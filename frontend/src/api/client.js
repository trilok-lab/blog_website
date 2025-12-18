import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { showSnackbar } from "../components/Snackbar";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  Constants.manifest2?.extra?.EXPO_PUBLIC_API_URL || 
  "http://10.0.2.2:8000/api";

console.log("API URL in use:", API_URL);

const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API error:", err.message);
    return Promise.reject(err);
  }
);

export default client;
