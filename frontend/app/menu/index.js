// frontend/app/menu/index.js

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppShell from "../../src/components/AppShell";
import { useTheme } from "../../src/theme/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Menu() {
  const r = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  // check login status
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  const handleAuthToggle = async () => {
    if (!loggedIn) {
      // LOGIN → go to welcome page
      r.push("/auth/welcome");
    } else {
      // LOGOUT → clear auth + go to articles
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      await AsyncStorage.removeItem("user");
      setLoggedIn(false);
      r.replace("/article");
    }
  };

  const Item = ({ label, path }) => (
    <TouchableOpacity style={styles.item} onPress={() => r.push(path)}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <AppShell>
      <View style={styles.container}>
        <Item label="📰 Articles" path="/article" />
        <Item label="🔥 Popular" path="/article/popular" />
        <Item label="✨ Featured" path="/article/slider" />
        <Item label="✍️ Submit Article" path="/article/submit-user" />
        <Item label="🔔 Notifications" path="/notifications" />
        <Item label="☎️ Contact" path="/contact" />


        {/* THEME TOGGLE */}
        <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
          <Text style={styles.text}>
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>

        {/* LOGIN / LOGOUT TOGGLE */}
        <TouchableOpacity style={styles.toggle} onPress={handleAuthToggle}>
          <Text style={styles.text}>
            {loggedIn ? "🚪 Logout" : "🔐 Login"}
          </Text>
        </TouchableOpacity>

      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  toggle: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ddd",
    marginTop: 20,
  },
  text: { fontSize: 16, fontWeight: "600" },
});
