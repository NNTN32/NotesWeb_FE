import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import AuthForm from "../../src/features/auth/components/AuthForm.jsx";
import { AuthContext, useAuth } from "../../src/features/auth/AuthContext.js";
import { AuthProvider } from "../../src/features/auth/AuthProvider.jsx";
import { getSession, sessionFromToken, setSession } from "../../src/features/auth/session.js";
import { setAuthDeadline } from "../../src/features/auth/authCooldown.js";
import client from "../../src/lib/httpClient.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const container = document.createElement("div");document.body.append(container);
const root = createRoot(container);
const calls = [];
let scenario = "limited", signedIn = 0, revision = 0;
const checks = [];
function check(condition, message) { if (!condition) throw new Error(message); checks.push(message); }
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const token = `test.${btoa(JSON.stringify({ sub: "test-writer", userId: "test-user", type: "Access", exp: Math.floor(Date.now() / 1000) + 3600 }))}.signature`;
client.defaults.adapter = async (config) => {
  calls.push(config.url);
  let response = { status: 200, headers: {}, config, data: {} };
  if (scenario === "expired") response = { ...response, status: 401 };
  else if (scenario === "session" && config.url === "/auth/refresh" && calls.filter((url) => url === "/auth/refresh").length > 1) response.data = { accessToken: token };
  else if (scenario === "success") response.data = config.method === "post"
    ? { sessionId: "test-session" } : { status: "SUCCESS", accessToken: "test-access" };
  else if (scenario === "created" && config.url === "/auth/register") response.data = "Account created";
  else response = { ...response, status: 429, headers: { "Retry-After": "1" }, data: "Rate limited" };
  if (response.status >= 400) throw new AxiosError("Request rejected", "ERR_BAD_RESPONSE", config, null, response);
  return response;
};
async function render(mode, replace = true) {
  if (replace) revision++;
  await act(async () => root.render(<MemoryRouter><AuthContext.Provider value={{ login: () => signedIn++ }}>
    <AuthForm key={revision} mode={mode} onSwitch={() => {}} />
  </AuthContext.Provider></MemoryRouter>));
  for (const input of container.querySelectorAll("input")) {
    input.value = input.name === "username" ? "test-writer" : input.name === "email" ? "test@example.test" : "test-password";
  }
}
async function submit() {
  await act(async () => {
    container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await sleep(0);
  });
}
const button = () => container.querySelector('button[type="submit"]');
// eslint-disable-next-line react-refresh/only-export-components -- This browser fixture runs assertions, not hot reload.
function SessionProbe() {
  const { user, logout, sessionError } = useAuth();
  return <><output id="session-user">{user?.username || "signed-out"}</output>
    <output id="session-error">{sessionError}</output><button id="logout" onClick={logout}>Sign out</button></>;
}
async function renderSession(mode, key = "session") {
  await act(async () => {
    root.render(<MemoryRouter><AuthProvider key={key}><SessionProbe /><AuthForm key={mode} mode={mode} onSwitch={() => {}} /></AuthProvider></MemoryRouter>);
    await sleep(50);
  });
  for (const input of container.querySelectorAll("input")) {
    input.value = input.name === "username" ? "test-writer" : input.name === "email" ? "test@example.test" : "test-password";
  }
}
const sessionPresent = () => getSession()?.accessToken === token && container.querySelector("#session-user").textContent === "test-writer";

async function run() {
  setAuthDeadline("login", 0);setAuthDeadline("register", 0);
  await render("login");await submit();
  check(button().disabled && /Wait 1s/.test(button().textContent), "login shows countdown and disables submit");
  check(container.querySelector('input[name="username"]').value === "test-writer", "credentials remain in the form");
  await submit();check(calls.length === 1, "programmatic duplicate submission is blocked during cooldown");
  await render("login");check(button().disabled, "closing/replacing the form preserves the wait");
  await act(async () => { await sleep(1200); });
  check(!button().disabled && container.textContent.includes("You can try again now"), "countdown expires and enables manual retry");
  check(calls.length === 1 && signedIn === 0, "timer expiration never replays login or establishes a session");
  scenario = "success";await submit();
  check(calls.filter((url) => url === "/auth/login").length === 2 && signedIn === 1, "only manual retry starts the next login");

  calls.length = 0;scenario = "limited";
  await render("register");await submit();await submit();
  check(button().disabled && calls.length === 1 && calls[0] === "/auth/register", "register 429 never retries or starts login");
  await act(async () => { await sleep(1200); });
  check(calls.length === 1 && !button().disabled, "register countdown enables only a manual retry");

  calls.length = 0;scenario = "created";
  await submit();
  check(container.textContent.includes("Your account was created"), "registration success followed by login 429 is explained");
  await submit();
  check(calls.filter((url) => url === "/auth/register").length === 1, "created account is never registered twice");
  await render("login");check(button().disabled, "switch to sign in retains the login cooldown");
  await act(async () => { await sleep(1200); });
  check(calls.length === 2, "mode switch and timers do not submit credentials");

  setAuthDeadline("login", Date.now() + 3000);await render("login");
  check(/Wait 3s/.test(button().textContent), "countdown starts at the remaining Retry-After duration");
  await act(async () => { await sleep(1100); });
  check(button().disabled && /Wait [12]s/.test(button().textContent), "countdown decreases while submission remains disabled");
  await act(async () => { await sleep(2200); });
  check(!button().disabled && calls.length === 2, "multi-second countdown expires without credential replay");

  calls.length = 0;scenario = "session";
  setSession(sessionFromToken(token));
  await renderSession("login");
  check(sessionPresent() && container.querySelector("#session-error").textContent.includes("temporarily limited"), "refresh 429 preserves the actual provider session and displays the wait");
  await submit();
  check(sessionPresent(), "login 429 preserves the actual provider session");
  await act(async () => { await sleep(1400); });
  check(calls.filter((url) => url === "/auth/refresh").length === 2 && sessionPresent(), "only cookie renewal retries and recovers after its cooldown");
  check(calls.filter((url) => url === "/auth/login").length === 1, "refresh recovery never replays login credentials");
  await renderSession("register");await submit();
  check(sessionPresent(), "register 429 preserves the actual provider session");
  await act(async () => {
    container.querySelector("#logout").click();await sleep(0);
  });
  check(sessionPresent() && container.querySelector("#session-error").textContent.includes("still signed in"), "logout 429 retains the session and explains the failure");
  await act(async () => { await sleep(1400); });
  check(sessionPresent() && calls.filter((url) => url === "/auth/logout").length === 1 && calls.filter((url) => url === "/auth/register").length === 1, "expiry never retries register or logout automatically");
  scenario = "expired";
  await renderSession("login", "expired");
  check(getSession() === null && container.querySelector("#session-user").textContent === "signed-out", "definitive refresh 401 still ends the session");
  await act(async () => root.unmount());
  return checks;
}

run().then((checks) => {
  const result = document.createElement("pre");result.id = "rate-test-result";
  result.textContent = JSON.stringify({ passed: true, checks });document.body.append(result);
}).catch((error) => {
  const result = document.createElement("pre");result.id = "rate-test-result";
  result.textContent = JSON.stringify({ passed: false, message: error.message, checks });document.body.append(result);
});
