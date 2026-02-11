// frontend/src/components/AppShell.js

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppShell({ title, children }) {
  const router = useRouter();
  const { colors, template } = useTheme();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (mounted) {
        setIsLoggedIn(!!token);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const onAccountPress = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/auth/welcome");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: template === "modern" ? 16 : 8,
        },
      ]}
    >
      {/* 🔷 Template: MODERN */}
      {template === "modern" && (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/article")}
            style={[styles.appCard, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.appName, { color: colors.text }]}>
              Trilok Blog App
            </Text>
          </TouchableOpacity>

          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.push("/menu")}>
              <Text style={[styles.navText, { color: colors.primary }]}>
                ☰ Menu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAccountPress}>
              <Text style={[styles.navText, { color: colors.primary }]}>
                {isLoggedIn ? "Profile" : "LOGIN"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 🔷 Template: MINIMAL */}
      {template === "minimal" && (
        <View style={styles.minimalHeader}>
          <TouchableOpacity onPress={() => router.push("/menu")}>
            <Text style={[styles.navText, { color: colors.primary }]}>
              ☰
            </Text>
          </TouchableOpacity>

          <Text style={[styles.minimalTitle, { color: colors.text }]}>
            Trilok Blog App
          </Text>

          <TouchableOpacity onPress={onAccountPress}>
            <Text style={[styles.navText, { color: colors.primary }]}>
              {isLoggedIn ? "👤" : "🔐"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PAGE TITLE */}
      {title && (
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          {title}
        </Text>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  appCard: {
    marginTop: 40,
    marginBottom: 14,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
  },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 6,
  },

  navText: {
    fontSize: 16,
    fontWeight: "600",
  },

  minimalHeader: {
    marginTop: 40,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  minimalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  content: {
    flex: 1,
  },
});
