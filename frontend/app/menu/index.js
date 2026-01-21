import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppShell from "../../src/components/AppShell";
import { useTheme } from "../../src/theme/ThemeContext";

export default function Menu() {
  const r = useRouter();
  const { theme, toggleTheme } = useTheme();

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
