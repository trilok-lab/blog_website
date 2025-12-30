// frontend/src/api/articles.js
import client, { publicClient } from "./client";

/* ---------------- PUBLIC ---------------- */

export const listArticles = (page = 1, pageSize = null, filters = {}) =>
  publicClient.get("/api/articles/", {
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  });

export const getArticle = (id) =>
  publicClient.get(`/api/articles/${id}/`);

export const listSlider = () =>
  publicClient.get("/api/articles/slider/");

export const listPopular = () =>
  publicClient.get("/api/articles/popular/");

export const getCategories = () =>
  client.get("/api/articles/categories/"); // 🔐 auth required

/* ---------------- AUTH REQUIRED ---------------- */

export const submitArticle = (formData) =>
  client.post("/api/articles/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
