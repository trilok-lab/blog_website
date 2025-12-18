// frontend/src/api/otp.js
import client from "./client";

// backend endpoints (Option A)
export const sendOTP = (payload) => client.post("/auth/request-phone-code/", payload);
export const verifyOTP = (payload) => client.post("/auth/verify-phone-code/", payload);

export default { sendOTP, verifyOTP };
