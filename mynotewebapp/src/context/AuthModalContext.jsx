import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/** @typedef {'login' | 'register'} AuthModalMode */

const AuthModalContext = createContext(null);

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
    [mode, openLogin, openRegister, close]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
