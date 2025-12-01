import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await client.post("/auth/jwt/create/", { username, password });
    await AsyncStorage.setItem("access_token", res.data.access);
    await AsyncStorage.setItem("refresh_token", res.data.refresh);

    const profile = await client.get("/auth/profile/");
    setUser(profile.data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    setUser(null);
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return;
    try {
      const profile = await client.get("/auth/profile/");
      setUser(profile.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
