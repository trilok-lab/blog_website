import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

/* -----------------------------
   SAVE TOKENS
-------------------------------- */
export async function saveTokens({ access, refresh }) {
  if (access) await AsyncStorage.setItem(ACCESS_KEY, access);
  if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
}

/* -----------------------------
   READ TOKENS
-------------------------------- */
export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
}

/* -----------------------------
   LOGOUT (SINGLE SOURCE)
-------------------------------- */
export async function logoutUser() {
  await AsyncStorage.removeItem(ACCESS_KEY);
  await AsyncStorage.removeItem(REFRESH_KEY);
}
