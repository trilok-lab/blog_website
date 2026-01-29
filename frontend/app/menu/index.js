// frontend/app/menu/index.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppShell from "../../src/components/AppShell";
import { useTheme } from "../../src/theme/ThemeContext";
import { logout } from "../../src/auth/logout";

export default function Menu() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  const Item = ({ label, path }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(path)}>
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

        {loggedIn && (
          <Item label="🔔 Notifications" path="/notifications" />
        )}

        <Item label="☎️ Contact" path="/contact" />

        <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
          <Text style={styles.text}>
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>

        {loggedIn ? (
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => logout(router)}
          >
            <Text style={styles.text}>🚪 Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => router.push("/auth/welcome")}
          >
            <Text style={styles.text}>🔐 Login</Text>
          </TouchableOpacity>
        )}
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
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
