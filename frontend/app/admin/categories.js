// frontend/app/admin/categories.js
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/admin/categories/");
      setItems(res.data || []);
    } catch (e) {
      console.log("cat err", e);
      showSnackbar("Failed to load categories", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name) return showSnackbar("Name required", "error");
    try {
      await client.post("/admin/categories/", { name });
      setName("");
      load();
      showSnackbar("Created", "success");
    } catch (e) {
      console.log("create cat", e);
      showSnackbar("Create failed", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Categories</Text>
      <TextInput placeholder="New category name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
      <TouchableOpacity onPress={create} style={{ backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, marginBottom: 12 }}>
        <Text style={{ color: "#fff" }}>Create</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" />}
      {items.map((c) => (
        <Text key={c.id} style={{ padding: 10, backgroundColor: "#fff", marginBottom: 8, borderRadius: 8 }}>{c.name}</Text>
      ))}
    </ScrollView>
  );
}
