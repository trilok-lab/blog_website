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
import { useTheme } from "../../src/theme/ThemeContext";

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await client.get("/api/auth/profile/");
        setUser(res.data);
      } catch (err) {
        console.log("Profile load error:", err);
        showSnackbar("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppShell title="Profile">
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Profile">
        <View style={{ padding: 20 }}>
          <Text style={{ color: colors.text }}>
            Unable to load profile.
          </Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile">
      <View style={styles.container}>
        <Text style={[styles.label, { color: colors.muted }]}>Username</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {user.username}
        </Text>

        <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {user.email || "Not provided"}
        </Text>

        <Text style={[styles.label, { color: colors.muted }]}>Mobile</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {user.mobile_no || "Not provided"}
        </Text>

        <Text style={[styles.label, { color: colors.muted }]}>Role</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {user.is_admin ? "Admin" : "User"}
        </Text>

        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: colors.danger },
          ]}
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
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
