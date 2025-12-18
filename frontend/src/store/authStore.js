// frontend/src/store/authStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export async function saveAuth(user, access, refresh) {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  await AsyncStorage.setItem("access_token", access);
  if (refresh) await AsyncStorage.setItem("refresh_token", refresh);
}

export async function clearAuth() {
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("refresh_token");
}

export async function getAuth() {
  const user = await AsyncStorage.getItem("user");
  const access = await AsyncStorage.getItem("access_token");
  const refresh = await AsyncStorage.getItem("refresh_token");
  return { user: user ? JSON.parse(user) : null, access, refresh };
}

export function useAuthStore() {
  return useContext(AuthContext);
}
