// frontend/app/admin/articles.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";

export default function AdminArticles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get("/admin/articles/");
      setItems(res.data || []);
    } catch (e) {
      console.log("admin article error", e);
      showSnackbar("Failed to load admin articles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id) => {
    try {
      await client.patch(`/admin/articles/${id}/`, { is_approved: true });
      fetch();
      showSnackbar("Article approved", "success");
    } catch (e) {
      console.log(e);
      showSnackbar("Approval failed", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Pending Articles</Text>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {items.map((a) => (
        <TouchableOpacity key={a.id} style={{ backgroundColor: "#eee", padding: 14, borderRadius: 10, marginVertical: 10 }}>
          <Text style={{ fontSize: 18 }}>{a.title}</Text>
          <TouchableOpacity onPress={() => approve(a.id)} style={{ backgroundColor: "green", padding: 10, marginTop: 10, borderRadius: 8 }}>
            <Text style={{ color: "white" }}>Approve</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
