// frontend/app/profile/index.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AppShell from "../../src/components/AppShell";
import client from "../../src/api/client";
import { logout } from "../../src/auth/logout";
import { showSnackbar } from "../../src/components/Snackbar";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await client.get("/api/auth/profile/");
      setUser(res.data);
    } catch (err) {
      console.log("Profile load error:", err);
      showSnackbar("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppShell title="Profile">
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" />
        </View>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Profile">
        <View style={{ padding: 20 }}>
          <Text>Unable to load profile.</Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile">
      <View style={styles.container}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>
          {user.email || "Not provided"}
        </Text>

        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>
          {user.mobile_no || "Not provided"}
        </Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>
          {user.is_admin ? "Admin" : "User"}
        </Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => logout(router)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
