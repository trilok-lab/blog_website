// frontend/src/utils/toast.js
import { Platform, ToastAndroid, Alert } from "react-native";

export function showToast(title, message = null) {
  if (Platform.OS === "android") {
    ToastAndroid.show(title + (message ? ": " + message : ""), ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message || undefined);
  }
}
