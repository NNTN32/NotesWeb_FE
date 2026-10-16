import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AuthContext } from "./AuthContext";
import { authApi, invalidateSession, scheduleSessionRenewal } from "./authService.js";
import { useRetryCountdown } from "./useRetryCountdown.js";
import { formatRetryWait, retryDeadline } from "../../lib/rateLimit.js";
import {
  getSession,
  subscribeSession,
  setSession,
  sessionFromToken,
} from "./session.js";

export const AuthProvider = ({ children }) => {
  const session = useSyncExternalStore(subscribeSession, getSession, () => null);
  const [restoring, setRestoring] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const waitSeconds = useRetryCountdown(sessionError?.retryAt || 0);
  const sessionMessage = sessionError ? sessionError.message + (waitSeconds ? ` Try again in ${formatRetryWait(waitSeconds)}.` : "") : "";
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Legacy access tokens are no longer persisted in browser storage.
    try {
      localStorage.removeItem("token");
    } catch {
      /* Storage may be unavailable; cookie restoration still works. */
    }
    return scheduleSessionRenewal(getSession(), (error) => {
      setSessionError(error);
      setRestoring(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (!session) return;
    // BE Redis sessions expire after five minutes, even with a longer access JWT.
    const delay = Math.max(5000, Math.min(120000, session.expiresAt - Date.now() - 30000));
    return scheduleSessionRenewal(session, setSessionError, delay);
  }, [session]);

  const login = useCallback((accessToken) => {
    const next = sessionFromToken(accessToken);
    invalidateSession();
    setSession(next);
    setSessionError(null);
    setRestoring(false);
  }, []);

  const logout = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    setSessionError(null);
    try {
      await authApi.logout();
      invalidateSession();
    } catch (error) {
      setSessionError(error.response?.status === 429
        ? { message: "Sign-out is temporarily limited. You are still signed in.", retryAt: error.retryAt ?? retryDeadline(error.response.headers) }
        : { message: "Could not sign out on the server. Please try again." });
    } finally {
      setSigningOut(false);
    }
  }, [signingOut]);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      login,
      logout,
      restoring,
      signingOut,
      sessionError: sessionMessage,
    }),
    [session, login, logout, restoring, signingOut, sessionMessage],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
