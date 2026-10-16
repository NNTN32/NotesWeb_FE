import client from "../../lib/httpClient.js";
import { createAuthApi } from "./authApi.js";
import { getSession, sessionFromToken, setSession } from "./session.js";
import { retryDeadline } from "../../lib/rateLimit.js";

export const authApi = createAuthApi(client);
let refreshRequest;
let generation = 0;
export function invalidateSession() {
  generation++;
  setSession(null);
}
export function refreshSession() {
  if (!refreshRequest) {
    const started = generation;
    refreshRequest = authApi.refresh().then(({ accessToken }) => {
      if (started !== generation) return null;
      const session = sessionFromToken(accessToken);
      setSession(session);
      return session;
    }).finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
}

export function scheduleSessionRenewal(session, onError, delay = 120000) {
  let active = true;
  let timer;
  const started = generation;
  const renew = async () => {
    if (!active || generation !== started || getSession() !== session) return;
    try {
      const next = await refreshSession();
      if (active && next && getSession() === next) onError(null);
    } catch (error) {
      if (!active || generation !== started || getSession() !== session) return;
      if ([401, 403].includes(error.response?.status)) {
        invalidateSession();
        onError(session ? { message: "Your session has ended. Please sign in again." } : null);
        return;
      }
      const retryAt = error.retryAt ?? retryDeadline(error.response?.headers);
      onError({ message: error.response?.status === 429 ? "Session renewal is temporarily limited."
        : "Session renewal is temporarily unavailable.", retryAt });
      // Only cookie renewal is retried; credential submissions are never replayed.
      timer = setTimeout(renew, Math.max(1000, retryAt - Date.now()) + 100);
    }
  };
  timer = setTimeout(renew, delay);
  return () => { active = false; clearTimeout(timer); };
}
