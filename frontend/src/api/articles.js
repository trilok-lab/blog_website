// frontend/src/api/articles.js
import client from "./client";

export const listArticles = (page = 1, pageSize = null, filters = {}) =>
  client.get("/articles/", {
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  });

export const getArticle = (id) =>
  client.get(`/articles/${id}/`);

export const listSlider = () =>
  client.get("/articles/slider/");

export const listPopular = () =>
  client.get("/articles/popular/");

export const getCategories = () =>
  client.get("/articles/categories/");
