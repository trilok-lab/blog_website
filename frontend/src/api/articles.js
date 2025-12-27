// frontend/src/api/articles.js
import { publicClient } from "./client";

/**
 * View Articles (public)
 */
export const listArticles = (page = 1, pageSize = null, filters = {}) =>
  publicClient.get("/api/articles/", {
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  });

/**
 * Single article (increments views)
 */
export const getArticle = (id) =>
  publicClient.get(`/api/articles/${id}/`);

/**
 * Slider articles
 */
export const listSlider = () =>
  publicClient.get("/api/articles/slider/");

/**
 * Popular articles (by views)
 */
export const listPopular = () =>
  publicClient.get("/api/articles/popular/");

/**
 * Categories
 */
export const getCategories = () =>
  publicClient.get("/api/articles/categories/");
