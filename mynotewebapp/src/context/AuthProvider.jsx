import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AuthContext } from "./AuthContext";
import { authApi, invalidateSession, refreshSession } from "../utils/api/auth.js";
import {
  getSession,
  subscribeSession,
  setSession,
  sessionFromToken,
} from "../features/auth/session.js";

export const AuthProvider = ({ children }) => {
  const session = useSyncExternalStore(subscribeSession, getSession, () => null);
  const [restoring, setRestoring] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    // Legacy access tokens are no longer persisted in browser storage.
    try {
      localStorage.removeItem("token");
    } catch {
      /* Storage may be unavailable; cookie restoration still works. */
    }
    refreshSession()
      .catch(() => {})
      .finally(() => {
        if (active) setRestoring(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session) return;
    const refresh = () => refreshSession().catch((error) => {
      // An old renewal cannot clear a newer login or a completed logout.
      if (getSession() !== session) return;
      setSessionError([401, 403].includes(error.response?.status)
        ? "Your session has ended. Please sign in again."
        : "Could not renew your session. Please sign in again.");
      invalidateSession();
    });
    // BE Redis sessions expire after five minutes, even with a longer access JWT.
    const delay = Math.max(5000, Math.min(120000, session.expiresAt - Date.now() - 30000));
    const timer = setTimeout(refresh, delay);
    return () => clearTimeout(timer);
  }, [session]);

  const login = useCallback((accessToken) => {
    const next = sessionFromToken(accessToken);
    invalidateSession();
    setSession(next);
    setSessionError("");
  }, []);

  const logout = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    setSessionError("");
    try {
      await authApi.logout();
      invalidateSession();
    } catch {
      setSessionError("Could not sign out on the server. Please try again.");
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
      sessionError,
    }),
    [session, login, logout, restoring, signingOut, sessionError],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
