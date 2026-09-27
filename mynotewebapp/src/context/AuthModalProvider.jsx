import { AuthModalContext } from "./AuthModalContext";
import { useCallback, useMemo, useState } from "react";

/** @typedef {'login' | 'register'} AuthModalMode */

/**
 * Controls the global auth modal (login / register). Side menu and deep links
 * call openLogin / openRegister; the modal UI lives in {@link ../components/auth/AuthModal}.
 */
export function AuthModalProvider({ children }) {
  /** @type {[AuthModalMode | null, import('react').Dispatch<import('react').SetStateAction<AuthModalMode | null>>]} */
  const [mode, setMode] = useState(null);

  const openLogin = useCallback(() => {
    setMode("login");
  }, []);

  const openRegister = useCallback(() => {
    setMode("register");
  }, []);

  const close = useCallback(() => {
    setMode(null);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isOpen: mode !== null,
      openLogin,
      openRegister,
      close,
    }),
    [mode, openLogin, openRegister, close],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}
