// frontend/app/admin/index.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 40, marginBottom: 12 , paddingHorizontal: 20, paddingTop: 40}}>Admin Panel</Text>

      <TouchableOpacity onPress={() => router.push("/admin/articles")} style={{ padding: 12, backgroundColor: "#242424e7", marginBottom: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff" }}>Articles</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/admin/comments")} style={{ padding: 12, backgroundColor: "#242424e7", marginBottom: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff" }}>Comments</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/admin/contact")} style={{ padding: 12, backgroundColor: "#242424e7", marginBottom: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff" }}>Contact</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
