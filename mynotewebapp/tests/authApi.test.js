import test from "node:test";
import { Buffer } from "node:buffer";
import assert from "node:assert/strict";
import { createAuthApi, abortableDelay } from "../src/features/auth/authApi.js";
import { sessionFromToken } from "../src/features/auth/session.js";

test("queued sign-in uses username and polls before returning accessToken", async () => {
  const calls = [];
  const results = [{ status: 202, data: { status: "PENDING" } },
    { status: 200, data: { status: "success", accessToken: "access-token" } }];
  const api = createAuthApi({
    post: async (path, body) => { calls.push({ path, body }); return { data: { sessionId: "session/id" } }; },
    get: async (path) => { calls.push({ path }); return results.shift(); },
  }, { delay: async () => {} });
  assert.equal((await api.login({ username: "writer", password: "test-password" })).accessToken, "access-token");
  assert.deepEqual(calls[0], { path: "/auth/login", body: { username: "writer", password: "test-password" } });
  assert.equal(calls[1].path, "/auth/login/result/session%2Fid");
  assert.equal(calls.length, 3);
});
test("pending login has bounded polling", async () => {
  let polls = 0;
  const api = createAuthApi({ post: async () => ({ data: { sessionId: "id" } }),
    get: async () => { polls++; return { status: 202, data: { status: "PENDING" } }; },
  }, { attempts: 3, delay: async () => {} });
  await assert.rejects(api.login({}), /could not be confirmed/);
  assert.equal(polls, 3);
});
test("failed or malformed login never produces success", async () => {
  const client = { post: async () => ({ data: { sessionId: "id" } }),
    get: async () => ({ status: 200, data: { status: "FAIL" } }) };
  await assert.rejects(createAuthApi(client).login({}), /unsuccessful/);
  client.post = async () => ({ data: { token: "legacy" } });
  await assert.rejects(createAuthApi(client).login({}), /Invalid sign-in response/);
});
test("closing a form cancels polling", async () => {
  const controller = new AbortController();
  let polls = 0;
  const api = createAuthApi({ post: async () => ({ data: { sessionId: "id" } }),
    get: async () => { polls++; return { status: 202, data: { status: "PENDING" } }; },
  }, { delay: async () => controller.abort() });
  await assert.rejects(api.login({}, { signal: controller.signal }), { name: "AbortError" });
  assert.equal(polls, 1);
  await assert.rejects(abortableDelay(1000, controller.signal), { name: "AbortError" });
});
test("registration sends USER role and accepts a text response", async () => {
  let payload;
  const api = createAuthApi({ post: async (path, body) => { payload = { path, body }; return { data: "User registered successfully" }; } });
  await api.register({ username: "writer", email: "writer@example.com", password: "test", role: "ADMIN" });
  assert.deepEqual(payload, { path: "/auth/register", body: { username: "writer", email: "writer@example.com", password: "test", role: "USER" } });
});
test("session metadata rejects expired/rotation/malformed tokens and supports Unicode", () => {
  const token = (claims) => `header.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.signature`;
  const claims = { sub: "Nhân", userId: "id", type: "Access", exp: Math.floor(Date.now() / 1000) + 3600 };
  assert.equal(sessionFromToken(token(claims)).user.name, "Nhân");
  assert.throws(() => sessionFromToken(token({ ...claims, exp: 1 })), /expired/);
  assert.throws(() => sessionFromToken(token({ ...claims, type: "Rotation" })), /expired/);
  assert.throws(() => sessionFromToken("invalid"), /Invalid/);
});

test("refresh and logout use cookie endpoints; malformed refresh is rejected", async () => {
  const paths = [];
  const api = createAuthApi({ post: async (path) => {
    paths.push(path);
    return { data: { accessToken: "access-token", status: "SUCCESS" } };
  } });
  assert.equal((await api.refresh()).accessToken, "access-token");
  await api.logout();
  assert.deepEqual(paths, ["/auth/refresh", "/auth/logout"]);
  await assert.rejects(createAuthApi({ post: async () => ({ data: {} }) }).refresh(), /Invalid session response/);
});

test("session refresh is shared and cannot restore an invalidated session", async () => {
  const { default: client } = await import("../src/utils/axiosConfig.js");
  const { refreshSession, invalidateSession } = await import("../src/utils/api/auth.js");
  const { getSession } = await import("../src/features/auth/session.js");
  const originalAdapter = client.defaults.adapter;
  let resolve;
  let calls = 0;
  client.defaults.adapter = () => {
    calls++;
    return new Promise((done) => { resolve = done; });
  };
  try {
    const first = refreshSession();
    const second = refreshSession();
    assert.equal(first, second);
    await new Promise((done) => setTimeout(done, 0));
    invalidateSession();
    resolve({ data: { accessToken: "obsolete" }, status: 200, headers: {}, config: {} });
    assert.equal(await first, null);
    assert.equal(calls, 1);
    assert.equal(getSession(), null);
  } finally {
    client.defaults.adapter = originalAdapter;
    invalidateSession();
  }
});
