// frontend/src/api/notifications.js
import client from "./client";

export const listNotifications = () =>
  client.get("/api/notifications/");

export const markRead = (id) =>
  client.post(`/api/notifications/${id}/read/`);

export const getUnreadCount = () =>
  client.get("/api/notifications/unread-count/");

export default {
  listNotifications,
  markRead,
  getUnreadCount,
};
