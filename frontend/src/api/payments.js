// frontend/src/api/payments.js
import client from "./client";

export const startPayment = (payload = {}) => client.post("/payments/start/", payload);
export const checkPayment = (id) => client.get(`/payments/${id}/status/`);
export const getPayment = (id) => client.get(`/payments/${id}/`);

export default { startPayment, checkPayment, getPayment };
