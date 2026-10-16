import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "./AuthContext";
import { authApi } from "./authService";
import { getAuthDeadline, setAuthDeadline, subscribeAuthDeadline } from "./authCooldown.js";
import { retryDeadline } from "../../lib/rateLimit.js";
import { useRetryCountdown } from "./useRetryCountdown.js";

export function useAuthSubmission({ mode, onAuthenticated }) {
  const { login } = useAuth();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const scope = accountCreated ? "login" : mode;
  const retryAt = useSyncExternalStore(subscribeAuthDeadline, () => getAuthDeadline(scope), () => 0);
  const waitSeconds = useRetryCountdown(retryAt);
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  const submit = async (data) => {
    if (request.current || (mode === "register" && accountCreated) || getAuthDeadline(scope) > Date.now()) return;
    setError("");
    setAuthDeadline(scope, 0);
    if (mode === "register" && data.password !== data.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (!data.username?.trim()) {
      setError("Please enter a username.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPending("email");
    let registered = false;
    try {
      const credentials = { username: data.username.trim(), password: data.password };
      if (mode === "register") {
        await authApi.register({ ...credentials, email: data.email.trim() }, { signal: controller.signal });
        registered = true;
        setAccountCreated(true);
      }
      const response = await authApi.login(credentials, { signal: controller.signal });
      if (controller.signal.aborted) return;
      login(response.accessToken);
      onAuthenticated?.();
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err.response?.status === 429) {
        setAuthDeadline(registered ? "login" : mode, err.retryAt ?? retryDeadline(err.response.headers));
        setError(registered
          ? "Your account was created. Sign-in is temporarily limited. Switch to Sign in after the wait."
          : "Too many requests. Your details have been kept. Wait before trying again.");
        return;
      }
      const message = err.response?.data?.message || err.response?.data?.error;
      setError(registered
        ? "Your account was created, but sign-in could not be confirmed. Switch to Sign in to try again."
        : err.code === "ERR_CANCELED" || err.name === "TimeoutError"
        ? "Sign-in took too long. Please check your credentials and try again."
        : typeof message === "string" ? message
        : err.response ? "Could not connect to your account. Please try again later."
        : err.message || "Could not connect to your account. Please try again later.");
    } finally {
      if (!controller.signal.aborted) { request.current = null; setPending(null); }
    }
  };
  return { submit, pending, error, retryAt, waitSeconds, accountCreated };
}
