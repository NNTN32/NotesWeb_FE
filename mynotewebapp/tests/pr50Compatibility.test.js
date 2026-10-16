import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import client from "../src/lib/httpClient.js";
import { createAuthApi } from "../src/features/auth/authApi.js";
import { authApi, invalidateSession, refreshSession } from "../src/features/auth/authService.js";
import { getSession, sessionFromToken, setSession } from "../src/features/auth/session.js";

const accessToken = (username = "alice", jti = "first") => `header.${Buffer.from(JSON.stringify({
  jti, sub: username, userId: `${username}-id`, type: "Access", exp: Math.floor(Date.now() / 1000) + 3600,
})).toString("base64url")}.signature`;

// Test the shipped Axios instance/interceptor; adapters replace only the network.
function transport(t, handler) {
  const previous = client.defaults.adapter;
  const calls = [];
  client.defaults.adapter = async (config) => {
    const call = { method: config.method, url: config.url, baseURL: config.baseURL,
      body: config.data ? JSON.parse(config.data) : undefined,
      authorization: config.headers.get("Authorization") };
    calls.push(call);
    const response = handler(call, calls.length);
    return { status: 200, headers: {}, ...response, config };
  };
  t.after(() => { client.defaults.adapter = previous; invalidateSession(); });
  return calls;
}

test("PR50 login completes using HTTP when WebSocket is unavailable", async (t) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "WebSocket");
  Object.defineProperty(globalThis, "WebSocket", { configurable: true, value: class {
    constructor() { assert.fail("Authentication must not open an anonymous WebSocket"); }
  } });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "WebSocket", previous);
    else delete globalThis.WebSocket;
  });
  const token = accessToken();
  const calls = transport(t, (call, number) => {
    if (call.url === "/auth/login") return { data: { sessionId: "opaque/id", status: "PENDING" } };
    assert.equal(call.url, "/auth/login/result/opaque%2Fid");
    return number === 2 ? { status: 202, data: { status: "PENDING" } }
      : { data: { status: "success", accessToken: token, userID: "alice-id" } };
  });
  const api = createAuthApi(client, { delay: async () => {} });
  const response = await api.login({ username: "alice", password: "test-only" });
  setSession(sessionFromToken(response.accessToken));
  assert.equal(getSession().user.username, "alice");
  assert.deepEqual(calls.map(({ method }) => method), ["post", "get", "get"]);
  assert.deepEqual(calls[0].body, { username: "alice", password: "test-only" });
  assert.ok(calls.every((call) => call.baseURL === "/api" && call.authorization === undefined));
});

test("PR50 registration excludes client-selected authorization and session fields", async (t) => {
  const calls = transport(t, () => ({ data: "User registered successfully" }));
  await authApi.register({ username: "alice", email: "alice@example.test", password: "test-only",
    role: "ADMIN", status: "SUCCESS", sessionID: "forged" });
  assert.deepEqual(calls[0].body, { username: "alice", email: "alice@example.test", password: "test-only" });
  assert.equal(calls[0].url, "/auth/register");
});

test("BE main HTTP FAIL stops pending login without a session or credential replay", async (t) => {
  let polls = 0;
  let waits = 0;
  const calls = transport(t, (call) => {
    if (call.method === "post") return { data: { sessionId: "failed-login", status: "PENDING" } };
    assert.equal(call.url, "/auth/login/result/failed-login");
    polls++;
    return polls === 1 ? { status: 202, data: { status: "PENDING", message: "Processing..." } }
      : { data: { status: "FAIL", token: "", rotationSecret: "", id: "", role: "",
        message: "Invalid credentials or too many attempts" } };
  });
  const api = createAuthApi(client, { delay: async () => { waits++; } });
  await assert.rejects(api.login({ username: "alice", password: "test-only" }), /Sign-in was unsuccessful/);
  assert.equal(polls, 2);
  assert.equal(waits, 1);
  assert.equal(calls.filter(({ method }) => method === "post").length, 1);
  assert.ok(calls.every(({ authorization }) => authorization === undefined));
  assert.equal(getSession(), null);
});

test("PR50 business requests use the renewed Access token; cookie endpoints receive no bearer", async (t) => {
  const first = accessToken("alice"), renewed = accessToken("alice", "renewed");
  const calls = transport(t, (call) => ({ data: call.url === "/auth/refresh"
    ? { accessToken: renewed, status: "SUCCESS" } : {} }));
  setSession(sessionFromToken(first));
  await client.get("/notes/listNotes");
  await refreshSession();
  await client.get("/notes/listNotes");
  await authApi.logout();
  invalidateSession();
  await client.get("/notes/listNotes");
  assert.deepEqual(calls.map(({ authorization }) => authorization), [
    `Bearer ${first}`, undefined, `Bearer ${renewed}`, undefined, undefined,
  ]);
  assert.deepEqual(calls.filter(({ url }) => url.startsWith("/auth/")).map(({ body }) => body), [undefined, undefined]);
  assert.equal(getSession(), null);
});

test("PR50 rotation token cannot become a frontend Access session", () => {
  const rotation = `header.${Buffer.from(JSON.stringify({ sub: "alice", userId: "alice-id",
    type: "Rotation", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.signature`;
  assert.throws(() => sessionFromToken(rotation), /expired/);
});

test("PR50 denied or forever-pending polling does not establish a session or repeat login", async (t) => {
  let denied = true;
  const calls = transport(t, (call) => {
    if (call.method === "post") return { data: { sessionId: "opaque", status: "PENDING" } };
    if (denied) throw Object.assign(new Error("Forbidden"), { response: { status: 403 } });
    return { status: 202, data: { status: "PENDING" } };
  });
  const api = createAuthApi(client, { attempts: 2, delay: async () => {} });
  await assert.rejects(api.login({ username: "alice", password: "test-only" }), /Forbidden/);
  assert.equal(getSession(), null);
  denied = false;
  await assert.rejects(api.login({ username: "alice", password: "test-only" }), /could not be confirmed/);
  assert.equal(getSession(), null);
  assert.equal(calls.filter(({ method }) => method === "post").length, 2);
});
