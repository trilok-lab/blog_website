import client from "./client";

/** ===== AUTH APIs ===== **/

export const loginUser = async (data) => client.post("/auth/jwt/create/", data);
export const refreshToken = async (refresh) => client.post("/auth/jwt/refresh/", { refresh });
export const signupUser = async (data) => client.post("/accounts/register/", data);
export const verifyOTP = async (data) => client.post("/accounts/verify-otp/", data);

/** ===== ARTICLES APIs ===== **/

export const getArticles = async (page = 1) => client.get(`/articles/list/?page=${page}`);
export const getArticleDetail = async (slug) => client.get(`/articles/${slug}/`);
export const createArticle = async (data, token) => client.post("/articles/create/", data, { headers: { Authorization: `Bearer ${token}` }});
export const updateArticle = async (slug, data, token) => client.put(`/articles/${slug}/update/`, data, { headers: { Authorization: `Bearer ${token}` }});
export const submitArticleStripe = async (data, token) => client.post("/stripe/submit-article/", data, { headers: { Authorization: `Bearer ${token}` }});

/** ===== COMMENTS APIs ===== **/

export const submitComment = async (articleId, data) => client.post(`/comments/${articleId}/submit/`, data);
export const getComments = async (articleId) => client.get(`/comments/${articleId}/list/`);

/** ===== CONTACT APIs ===== **/

export const sendContactMessage = async (data) => client.post("/contact/send/", data);

/** ===== ADMIN APIs ===== **/

export const getAllArticles = async () => client.get("/articles/admin/list/");
export const approveArticle = async (id) => client.post(`/articles/admin/${id}/approve/`);
export const getCategories = async () => client.get("/articles/categories/list/");
export const createCategory = async (data) => client.post("/articles/categories/create/", data);
export const deleteCategory = async (id) => client.delete(`/articles/categories/${id}/delete/`);

/** ===== NOTIFICATIONS ===== **/

export const getNotifications = async () => client.get("/notifications/list/");
