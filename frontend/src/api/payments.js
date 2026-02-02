// frontend/src/api/payments.js
import client from "./client";

/**
 * Create Stripe checkout session
 * Backend: POST /api/payments/checkout-session/
 */
export const startPayment = (payload = {}) =>
  client.post("/api/payments/checkout-session/", payload);

/**
 * Get all payments for logged-in user
 * Backend: GET /api/payments/my-payments/
 */
export const getMyPayments = () =>
  client.get("/api/payments/my-payments/");

export default {
  startPayment,
  getMyPayments,
};
