import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getToken,
  getCurrentUser,
  loginUser,
  googleLoginUser,
  fetchMe,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Sync session and verify token with backend on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const storedToken = getToken();
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const freshUser = await fetchMe();
        if (isMounted) {
          setUser(freshUser);
          setToken(storedToken);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (formData) => {
    const res = await loginUser(formData);
    if (res.data?.success) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  }, []);

  const googleLogin = useCallback(async (payload) => {
    const res = await googleLoginUser(payload);
    if (res.data?.success) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    googleLogin,
    logout,
    updateUser,
    register: registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
