// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    }
    load();
  }, []);

  const loginUser = async (userData, access, refresh) => {
    await AsyncStorage.setItem("access_token", access);
    if (refresh) await AsyncStorage.setItem("refresh_token", refresh);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    client.defaults.headers.Authorization = `Bearer ${access}`;
    setUser(userData);
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("user");
    delete client.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
