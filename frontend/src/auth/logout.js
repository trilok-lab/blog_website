// frontend/src/auth/logout.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { showSnackbar } from "../components/Snackbar";

/**
 * Unified logout helper
 * Clears all auth-related storage
 */
export async function logout(router) {
  try {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("user");

    showSnackbar("Logged out successfully", "success");
    router.replace("/article");
  } catch (e) {
    console.log("Logout error:", e);
    showSnackbar("Logout failed", "error");
  }
}
