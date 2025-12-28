// frontend/app/menu/index.js

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Menu() {
  const router = useRouter();

  const MenuButton = ({ title, onPress, color = "#1E90FF" }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
      activeOpacity={0.85}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.appName, { marginTop: 30 , marginBottom: 20, }]}>Trilok Blog App</Text>
        <Text style={[styles.pageTitle, { marginTop: 20 , marginBottom: 10, }]}>Menu</Text>
      </View>

      {/* BROWSE */}
      <Section title="📖 Read Articles">
        <MenuButton title="📄 View Articles" onPress={() => router.push("/article")} />
        <MenuButton title="🖼 Slider Articles" onPress={() => router.push("/article/slider")} />
        <MenuButton title="🔥 Popular Articles" onPress={() => router.push("/article/popular")} />
      </Section>

      {/* CONTRIBUTE */}
      <Section title="✍️ Contribute">
        <MenuButton title="➕ Submit Article (Guest)" onPress={() => router.push("/article/submit-guest")} />
        <MenuButton title="👤 Submit Article (User)" onPress={() => router.push("/article/submit-user")} />
        {/*<MenuButton title="💬 Add Comment" onPress={() => router.push("/comments/add")} />*/}
      </Section>

      {/* SUPPORT */}
      <Section title="📞 Support">
        <MenuButton title="☎ Contact Us" onPress={() => router.push("/contact")} />
      </Section>

      {/* ADMIN */}
      <Section title="🧑‍💼 Admin">
        <MenuButton title="🧑‍💼 Admin Panel" onPress={() => router.push("/admin")} />
      </Section>

      {/* LOGOUT */}
      <View style={styles.logoutSection}>
        <MenuButton title="🚪 Logout" color="#DC3545" onPress={() => router.replace("/auth/login")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#F8F9FA",
  },

  /* HEADER */
  header: {
    marginBottom: 30,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 6, // slight right shift
  },

  /* SECTIONS */
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#495057",
  },

  /* BUTTONS */
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* LOGOUT */
  logoutSection: {
    marginTop: 20,
  },
});
