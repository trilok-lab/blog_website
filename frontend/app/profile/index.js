// frontend/app/profile/index.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/auth/profile/");
      setUser(res.data);
    } catch (e) {
      console.log("profile err", e);
      showSnackbar("Failed to load profile", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const doLogout = async () => {
    try {
      await client.setAuthToken(null);
      showSnackbar("Logged out", "success");
      router.replace("/");
    } catch (e) {
      showSnackbar("Logout error", "error");
    }
  };

  if (loading) return <View style={{ padding: 20 }}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{user?.username || "Profile"}</Text>
      <Text style={{ marginTop: 8 }}>{user?.email}</Text>
      <TouchableOpacity onPress={() => router.push("/profile/settings")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#1E90FF" }}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={doLogout} style={{ marginTop: 16, backgroundColor: "#e74c3c", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "#fff" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
