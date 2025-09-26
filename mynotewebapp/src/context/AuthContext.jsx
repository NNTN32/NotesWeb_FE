import { createContext, useContext, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// No runtime PropTypes to avoid extra dependency; relying on JSDoc for DX

export const useAuth = () => useContext(AuthContext); 