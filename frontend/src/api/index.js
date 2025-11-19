import api from "./client";

// =========================
// AUTH / ACCOUNTS
// =========================
export const requestPhoneCode = async (phone) => {
  const res = await api.post("/auth/request-phone-code/", { mobile_no: phone });
  return res.data;
};

export const verifyPhoneCode = async (session_id, code) => {
  const res = await api.post("/auth/verify-phone-code/", { session_id, code });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register/", userData);
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await api.post("/auth/jwt/create/", { username, password });
  return res.data;
};

// =========================
// ARTICLES
// =========================
export const getArticles = async (page = 1) => {
  const res = await api.get(`/articles/?page=${page}`);
  return res.data;
};

export const getArticleDetails = async (slug) => {
  const res = await api.get(`/articles/${slug}/`);
  return res.data;
};

export const submitArticle = async (formData) => {
  const res = await api.post("/articles/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// =========================
// COMMENTS
// =========================
export const getComments = async (articleId) => {
  const res = await api.get(`/comments/comments/?article=${articleId}`);
  return res.data;
};

export const postComment = async (articleId, text) => {
  const res = await api.post("/comments/comments/create/", {
    article: articleId,
    text,
  });
  return res.data;
};

// =========================
// CONTACT
// =========================
export const submitContact = async (data) => {
  const res = await api.post("/contact/submit/", data);
  return res.data;
};

// =========================
// STRIPE PAYMENT
// =========================
export const createPaymentIntent = async (amount) => {
  const res = await api.post("/stripe_integration/create-payment-intent/", { amount });
  return res.data;
};
