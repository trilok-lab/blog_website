// frontend/src/api/auth.js

import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL not configured");
}

// 🔐 CENTRAL REQUEST HANDLER
async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let json = {};

  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const err = new Error("API Error");
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

/* =======================
   ✅ AUTH ENDPOINTS
======================= */

// 🔥 FIXED — API PREFIX ADDED
export const requestPhoneCode = (mobile_no) =>
  apiRequest("/api/auth/request-phone-code/", "POST", { mobile_no });

export const verifyPhoneCode = (session_id, code) =>
  apiRequest("/api/auth/verify-phone-code/", "POST", { session_id, code });

export const registerUser = (payload) =>
  apiRequest("/api/auth/register/", "POST", payload);

export const loginUser = (payload) =>
  apiRequest("/api/auth/login/", "POST", payload);

export const socialLogin = (provider, token) =>
  apiRequest("/api/auth/social/", "POST", { provider, token });

export const getProfile = (token) =>
  apiRequest("/api/auth/profile/", "GET", null, token);
