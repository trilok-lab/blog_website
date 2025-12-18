// frontend/src/api/notifications.js
import client from "./client";

export const listNotifications = () => client.get("/notifications/");
export const markRead = (id) => client.patch(`/notifications/${id}/read/`, { is_read: true });

export default { listNotifications, markRead };
