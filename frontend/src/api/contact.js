// frontend/src/api/contact.js

import client from "./client";

export const submitContact = (data) => {
  return client.post("/api/contact/submit/", data);
};

export default {
  submitContact,
};
