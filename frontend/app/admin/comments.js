// frontend/app/admin/comments.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";

export default function AdminComments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get("/admin/comments/");
      setItems(res.data || []);
    } catch (e) {
      console.log("admin comments err", e);
      showSnackbar("Failed to load comments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id) => {
    try {
      await client.patch(`/admin/comments/${id}/`, { approved: true });
      fetch();
      showSnackbar("Comment approved", "success");
    } catch (e) {
      console.log(e);
      showSnackbar("Approval failed", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Pending Comments</Text>
      {loading && <ActivityIndicator size="large" />}
      {items.map((c) => (
        <TouchableOpacity key={c.id} style={{ backgroundColor: "#f1f1f1", padding: 14, marginVertical: 10, borderRadius: 10 }}>
          <Text style={{ fontWeight: "700" }}>{c.user_name || c.guest_name}</Text>
          <Text>{c.content}</Text>
          <TouchableOpacity onPress={() => approve(c.id)} style={{ backgroundColor: "green", padding: 10, marginTop: 10, borderRadius: 8 }}>
            <Text style={{ color: "white" }}>Approve</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
