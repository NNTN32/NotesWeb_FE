import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import AuthForm from "../../src/features/auth/components/AuthForm.jsx";
import { AuthContext } from "../../src/features/auth/AuthContext.js";
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
client.defaults.adapter = async (config) => {
  calls.push(config.url);
  let response = { status: 200, headers: {}, config, data: {} };
  if (scenario === "success") response.data = config.method === "post"
    ? { sessionId: "test-session" } : { status: "SUCCESS", accessToken: "test-access" };
  else if (scenario === "created" && config.url === "/auth/register") response.data = "Account created";
  else response = { ...response, status: 429, headers: { "Retry-After": "1" }, data: "Rate limited" };
  if (response.status === 429) throw new AxiosError("Rate limited", "ERR_BAD_RESPONSE", config, null, response);
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
