import api from "./client";

// =========================
// AUTH / ACCOUNTS
// =========================

// Request OTP
export const requestPhoneCode = async (phone) => {
  const res = await api.post("/auth/request-phone-code/", { phone });
  return res.data;
};

// Verify OTP
export const verifyPhoneCode = async (phone, code) => {
  const res = await api.post("/auth/verify-phone-code/", { phone, code });
  return res.data;
};

// Register user
export const registerUser = async (userData) => {
  const res = await api.post("/auth/register/", userData);
  return res.data;
};

// JWT Login
export const loginUser = async (username, password) => {
  const res = await api.post("/auth/jwt/create/", {
    username,
    password,
  });
  return res.data;
};

// =========================
// ARTICLES
// =========================

// List all articles
export const getArticles = async () => {
  const res = await api.get("/api/");
  return res.data;
};

// Get single article
export const getArticleDetails = async (id) => {
  const res = await api.get(`/api/${id}/`);
  return res.data;
};

// Submit article (requires auth)
export const submitArticle = async (formData) => {
  const res = await api.post("/api/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// =========================
// COMMENTS
// =========================

// List comments for an article
export const getComments = async (articleId) => {
  const res = await api.get(`/api/comments/comments/?article=${articleId}`);
  return res.data;
};

// Post a comment
export const postComment = async (articleId, text) => {
  const res = await api.post("/api/comments/comments/", {
    article: articleId,
    text,
  });
  return res.data;
};

// =========================
// CONTACT FORM
// =========================

export const submitContact = async (data) => {
  const res = await api.post("/api/contact/submit/", data);
  return res.data;
};

// =========================
// THEME SETTINGS
// =========================

export const getTheme = async () => {
  const res = await api.get("/api/theming/setting/");
  return res.data;
};
