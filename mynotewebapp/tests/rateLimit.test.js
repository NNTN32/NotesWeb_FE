import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { AxiosError, AxiosHeaders } from "axios";
import client from "../src/lib/httpClient.js";
import { retryDeadline, retrySeconds, formatRetryWait } from "../src/lib/rateLimit.js";
import { createAuthApi } from "../src/features/auth/authApi.js";
import { invalidateSession, scheduleSessionRenewal } from "../src/features/auth/authService.js";
import { getSession, setSession, sessionFromToken } from "../src/features/auth/session.js";
import { getAuthDeadline, setAuthDeadline } from "../src/features/auth/authCooldown.js";

const now = Date.parse("2026-10-16T00:00:00Z");
const token = (id) => `header.${Buffer.from(JSON.stringify({ sub: "alice", userId: id, type: "Access", exp: now / 1000 + 3600 })).toString("base64url")}.signature`;
const settle = () => new Promise((done) => setImmediate(done));

test("Retry-After supports seconds, HTTP dates and server clock skew", () => {
  assert.equal(retryDeadline(new AxiosHeaders({ "Retry-After": "30" }), now), now + 30000);
  assert.equal(retryDeadline({ "rEtRy-AfTeR": "0" }, now), now);
  assert.equal(retryDeadline({ "Retry-After": "Fri, 16 Oct 2026 00:01:00 GMT" }, now), now + 60000);
  assert.equal(retryDeadline({ "Retry-After": "Fri, 16 Oct 2026 00:01:00 GMT", Date: "Fri, 16 Oct 2026 00:00:30 GMT" }, now + 500000), now + 530000);
  assert.equal(retryDeadline({ "Retry-After": "Thu, 15 Oct 2026 00:00:00 GMT" }, now), now);
  for (const value of [undefined, "", "-1", "1.5", "Infinity", "garbage", "9".repeat(100)])
    assert.equal(retryDeadline({ "Retry-After": value }, now), now + 30000);
  assert.equal(retrySeconds(now + 1001, now), 2);
  assert.equal(retrySeconds(now - 1000, now), 0);
  assert.equal(formatRetryWait(61), "1m 1s");
});

test("login and register cooldowns survive form replacement but remain separate", () => {
  setAuthDeadline("login", 0);setAuthDeadline("register", 0);
  setAuthDeadline("login", now + 30000);setAuthDeadline("login", now + 1000);
  assert.equal(getAuthDeadline("login"), now + 30000);
  assert.equal(getAuthDeadline("register"), 0);
  setAuthDeadline("login", 0);
});

function transport(t, handler) {
  const old = client.defaults.adapter;
  const calls = [];
  client.defaults.adapter = async (config) => {
    calls.push(config);
    const response = { status: 200, headers: {}, config, ...handler(config, calls.length) };
    if (response.status >= 400) throw new AxiosError("HTTP failure", "ERR_BAD_RESPONSE", config, null, response);
    return response;
  };
  t.after(() => { client.defaults.adapter = old; invalidateSession(); });
  return calls;
}

test("real Axios 429 preserves session and does not replay login/register/business requests", async (t) => {
  const session = { accessToken: "current", expiresAt: Date.now() + 60000, user: { id: "alice" } };
  setSession(session);
  const calls = transport(t, () => ({ status: 429, headers: { "retry-after": "30" }, data: "<html>Rate limited</html>" }));
  const api = createAuthApi(client);
  for (const operation of [() => api.login({ username: "alice", password: "test" }),
    () => api.register({ username: "alice", email: "alice@example.test", password: "test" }),
    () => client.get("/notes/listNotes"), () => api.logout()]) {
    const before = calls.length;
    await assert.rejects(operation(), (error) => error.response.status === 429 && error.retryAt > Date.now());
    assert.equal(calls.length, before + 1);
    assert.equal(getSession(), session);
  }
  assert.equal(calls.filter((c) => c.url.includes("/result/")).length, 0);
});

test("polling 429 stops without repeating login or consuming the result again", async (t) => {
  const calls = transport(t, (config) => config.method === "post"
    ? { data: { sessionId: "queued" } } : { status: 429, headers: { "Retry-After": "2" } });
  await assert.rejects(createAuthApi(client).login({}), (error) => error.response.status === 429);
  assert.deepEqual(calls.map((c) => c.method), ["post", "get"]);
});

test("refresh 429 retains the session and retries only refresh after Retry-After", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });
  const session = sessionFromToken(token("original"));setSession(session);
  const calls = transport(t, (_config, count) => count === 1
    ? { status: 429, headers: { "Retry-After": "30" } }
    : { data: { accessToken: token("renewed") } });
  const messages = [];
  const cancel = scheduleSessionRenewal(session, (error) => messages.push(error), 0);t.after(cancel);
  t.mock.timers.tick(0);await settle();
  assert.equal(getSession(), session);
  assert.equal(messages[0].retryAt, now + 30000);
  t.mock.timers.tick(30000);await settle();assert.equal(calls.length, 1);
  t.mock.timers.tick(100);await settle();
  assert.equal(getSession().user.id, "renewed");
  assert.deepEqual(calls.map((c) => c.url), ["/auth/refresh", "/auth/refresh"]);
  assert.equal(messages.at(-1), null);
});

test("cancelled or stale refresh waits cannot revive a logged-out/newer session", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });
  const session = sessionFromToken(token("original"));setSession(session);
  const calls = transport(t, () => ({ status: 429, headers: { "Retry-After": "1" } }));
  const cancel = scheduleSessionRenewal(session, () => {}, 0);
  t.mock.timers.tick(0);await settle();cancel();invalidateSession();
  t.mock.timers.tick(5000);await settle();
  assert.equal(calls.length, 1);assert.equal(getSession(), null);
});

test("a late refresh 429 cannot clear or schedule work for a newer login", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });
  const old = client.defaults.adapter;t.after(() => { client.defaults.adapter = old;invalidateSession(); });
  const original = sessionFromToken(token("original"));setSession(original);
  let reject, calls = 0, notifications = 0;
  client.defaults.adapter = (config) => { calls++;return new Promise((_resolve, fail) => {
    reject = () => fail(new AxiosError("Rate limited", "ERR_BAD_RESPONSE", config, null,
      { status: 429, headers: { "Retry-After": "1" } }));
  }); };
  const cancel = scheduleSessionRenewal(original, () => notifications++, 0);t.after(cancel);
  t.mock.timers.tick(0);await settle();
  invalidateSession();const newer = sessionFromToken(token("new-login"));setSession(newer);
  reject();await settle();t.mock.timers.tick(5000);await settle();
  assert.equal(getSession(), newer);assert.equal(calls, 1);assert.equal(notifications, 0);
});

test("a scheduled refresh retry does not run for a replaced session", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });
  const original = sessionFromToken(token("original"));setSession(original);
  const calls = transport(t, () => ({ status: 429, headers: { "Retry-After": "1" } }));
  const cancel = scheduleSessionRenewal(original, () => {}, 0);t.after(cancel);
  t.mock.timers.tick(0);await settle();
  invalidateSession();const newer = sessionFromToken(token("new-login"));setSession(newer);
  t.mock.timers.tick(1100);await settle();
  assert.equal(calls.length, 1);assert.equal(getSession(), newer);
});

test("definitive refresh rejection clears session; transient 503 does not", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });
  let status = 503;
  const calls = transport(t, () => ({ status, headers: { "Retry-After": "5" } }));
  const session = sessionFromToken(token("original"));setSession(session);
  const cancel = scheduleSessionRenewal(session, () => {}, 0);t.after(cancel);
  t.mock.timers.tick(0);await settle();assert.equal(getSession(), session);
  status = 403;t.mock.timers.tick(5100);await settle();
  assert.equal(getSession(), null);assert.equal(calls.length, 2);
});
