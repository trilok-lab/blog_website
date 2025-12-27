// frontend/src/api/client.js
import axios from "axios";
import Constants from "expo-constants";
import { getAccessToken } from "../utils/token";

const API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

/**
 * PUBLIC CLIENT
 * - NO Authorization header
 * - Used for articles, slider, popular, categories
 */
export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * AUTHENTICATED CLIENT
 * - Automatically attaches JWT token
 * - Used for protected APIs
 */
const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

authClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authClient;
