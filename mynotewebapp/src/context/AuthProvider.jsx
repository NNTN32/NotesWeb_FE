import { AuthContext } from "./AuthContext";
import { useState, useMemo, useCallback } from "react";

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
