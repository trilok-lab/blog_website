// frontend/src/api/contact.js
import client from "./client";

export const submitContact = (data) =>
  client.post("/contact/submit/", data);

export default {
  submitContact,
};
