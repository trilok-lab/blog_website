// frontend/app/admin/contact.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";

export default function AdminContact() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get("/contact/admin/list/");
      setItems(res.data?.results || res.data || []);
    } catch (e) {
      console.log("contact admin err", e);
      showSnackbar("Failed to load contact messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    try {
      await client.patch(`/contact/${id}/read/`, { is_read: true });
      fetch();
      showSnackbar("Marked read", "success");
    } catch (e) {
      console.log("mark read err", e);
      showSnackbar("Failed to mark read", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Contact Messages</Text>
      {loading && <ActivityIndicator size="large" />}
      {items.map((m) => (
        <TouchableOpacity key={m.id} style={{ padding: 16, backgroundColor: m.is_read ? "#e7ffe7" : "#ffe7e7", borderRadius: 10, marginVertical: 10 }}>
          <Text style={{ fontSize: 18 }}>{m.subject}</Text>
          <Text>{m.name} — {m.email}</Text>
          <Text style={{ marginTop: 8 }}>{m.message}</Text>
          {!m.is_read && (
            <TouchableOpacity onPress={() => markRead(m.id)} style={{ backgroundColor: "green", padding: 10, marginTop: 10, borderRadius: 8 }}>
              <Text style={{ color: "white" }}>Mark as Read</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
