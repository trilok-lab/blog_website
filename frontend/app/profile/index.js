// frontend/app/profile/index.js

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AppShell from "../../src/components/AppShell";
import { getAuth, clearAuth } from "../../src/store/authStore";
import { showSnackbar } from "../../src/components/Snackbar";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getAuth();
      setUser(user);
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await clearAuth();
      showSnackbar("Logged out", "success");
      router.replace("/article");
    } catch (e) {
      showSnackbar("Logout error", "error");
    }
  };

  if (loading) {
    return (
      <AppShell title="Profile">
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          {user?.username || "User"}
        </Text>

        <Text style={{ marginTop: 8, fontSize: 16 }}>
          {user?.email || ""}
        </Text>

        <TouchableOpacity
          onPress={logout}
          style={{
            marginTop: 30,
            backgroundColor: "#e74c3c",
            padding: 14,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}
