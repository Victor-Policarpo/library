import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TOKEN_KEY, setUnauthorizedHandler } from "../services/api.js";
import { login as loginRequest } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  const login = useCallback(async (email, password) => {
    const { token: newToken } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setSessionExpired(false);
  }, []);

  const logout = useCallback(({ expired = false } = {}) => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    if (expired) {
      setSessionExpired(true);
    }
  }, []);

  const handleUnauthorized = useCallback(() => logout({ expired: true }), [logout]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(() => {});
  }, [handleUnauthorized]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        login,
        logout,
        sessionExpired,
        clearSessionExpired,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}