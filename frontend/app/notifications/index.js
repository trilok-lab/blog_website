// frontend/app/notifications/index.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { listNotifications, markRead } from "../../src/api/notifications";
import { showSnackbar } from "../../src/components/Snackbar";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listNotifications();
      setItems(res.data?.results || res.data || []);
    } catch (e) {
      console.log("notif err", e);
      showSnackbar("Failed to load", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const doMark = async (id) => {
    try {
      await markRead(id);
      load();
    } catch (e) {
      showSnackbar("Failed", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Notifications</Text>
      {loading && <ActivityIndicator size="large" />}
      {items.map((n) => (
        <TouchableOpacity key={n.id} style={{ padding: 12, backgroundColor: n.is_read ? "#f2f2f2" : "#fff", marginBottom: 8, borderRadius: 8 }}>
          <Text style={{ fontWeight: "700" }}>{n.title || "Notification"}</Text>
          <Text style={{ marginTop: 6 }}>{n.message || n.body || ""}</Text>
          {!n.is_read && <TouchableOpacity onPress={() => doMark(n.id)} style={{ marginTop: 8 }}><Text style={{ color: "#1E90FF" }}>Mark read</Text></TouchableOpacity>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
