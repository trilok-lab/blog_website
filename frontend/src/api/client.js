import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://192.168.10.7:8000";

console.log("API URL =", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------ AUTH ------------------ */
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/jwt/create/", { email, password });
  const { access } = res.data;
  await AsyncStorage.setItem("token", access);
  return access;
};

/* ------------------ ARTICLES ------------------ */
export const fetchArticles = async () => {
  const res = await api.get("/api/");
  return res.data;
};

export const fetchArticleDetail = async (id) => {
  const res = await api.get(`/api/${id}/`);
  return res.data;
};

/* ------------------ COMMENTS ------------------ */
export const fetchComments = async (articleId) => {
  const res = await api.get(`/api/comments/comments/?article=${articleId}`);
  return res.data;
};

export const postComment = async (articleId, text) => {
  const res = await api.post("/api/comments/comments/", {
    article: articleId,
    text,
  });
  return res.data;
};

/* ------------------ SUBMIT ARTICLE ------------------ */
export const createArticle = async (title, content) => {
  const res = await api.post("/api/", {
    title,
    content,
  });
  return res.data;
};
