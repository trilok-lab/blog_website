// frontend/src/api/comments.js
import client from "./client";

export const listComments = (articleId) =>
  client.get("/comments/", { params: { article: articleId } });

export const postComment = (data) => client.post("/comments/", data);

export default { listComments, postComment };
