import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { registerUser, loginUser, getMe } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for a stored token on app start

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          const response = await getMe(); // the interceptor attaches the token automatically
          setUser(response.data);
        }
      } catch (error) {
        // Token exists but is invalid/expired — clear it so we don't keep retrying
        console.log("Stored token invalid, clearing:", error.message);
        await SecureStore.deleteItemAsync("authToken");
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const register = async (name, email, password) => {
    const response = await registerUser({ name, email, password });
    const { token, ...userData } = response.data;
    await SecureStore.setItemAsync("authToken", token);
    setUser(userData);
  };

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { token, ...userData } = response.data;
    await SecureStore.setItemAsync("authToken", token);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.log("Failed to refresh user:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);