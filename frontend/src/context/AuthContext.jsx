import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, authHeaders } from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "home_services_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw);
  } catch (_error) {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(readStoredAuth);
  const theme = user?.theme || "ocean";
  const language = user?.language || "fr";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setSession = (nextToken, nextUser) => {
    const payload = { token: nextToken, user: nextUser };
    setAuth(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const clearSession = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (input) => {
    const response = await api.post("/auth/register", input);
    setSession(response.data.token, response.data.user);
    return response.data;
  };

  const login = async (input) => {
    const response = await api.post("/auth/login", input);
    setSession(response.data.token, response.data.user);
    return response.data;
  };

  const updateProfile = async (input) => {
    const response = await api.patch("/users/me", input, {
      headers: authHeaders(token),
    });
    setSession(token, response.data.user);
    return response.data;
  };

  const deleteAccount = async (password) => {
    await api.delete("/users/me", {
      headers: authHeaders(token),
      data: { password },
    });
    clearSession();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      theme,
      language,
      register,
      login,
      updateProfile,
      deleteAccount,
      logout: clearSession,
      setSession,
    }),
    [token, user, theme, language]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
