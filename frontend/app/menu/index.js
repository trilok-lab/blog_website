import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";

export default function Menu() {
  const router = useRouter();
  const { theme } = useTheme();

  const isDark = theme === "dark";

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
      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? "#FFFFFF" : "#495057" },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#F8F9FA" },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.appName,
            {
              marginTop: 30,
              marginBottom: 20,
              color: isDark ? "#FFFFFF" : "#000000",
            },
          ]}
        >
          Trilok Blog App
        </Text>

        <Text
          style={[
            styles.pageTitle,
            {
              marginTop: 20,
              marginBottom: 10,
              color: isDark ? "#DDDDDD" : "#000000",
            },
          ]}
        >
          Menu
        </Text>
      </View>

      {/* BROWSE */}
      <Section title="📖 Read Articles">
        <MenuButton
          title="📄 View Articles"
          onPress={() => router.push("/article")}
        />
        <MenuButton
          title="🖼 Slider Articles"
          onPress={() => router.push("/article/slider")}
        />
        <MenuButton
          title="🔥 Popular Articles"
          onPress={() => router.push("/article/popular")}
        />
      </Section>

      {/* CONTRIBUTE */}
      <Section title="✍️ Contribute">
        <MenuButton
          title="👤➕ Submit Article (User)"
          onPress={() => router.push("/article/submit-user")}
        />
      </Section>

      {/* SUPPORT */}
      <Section title="📞 Support">
        <MenuButton
          title="☎ Contact Us"
          onPress={() => router.push("/contact")}
        />
      </Section>

      {/* ADMIN */}
      <Section title="🧑‍💼 Admin">
        <MenuButton
          title="🧑‍💼 Admin Panel"
          onPress={() => router.push("/admin")}
        />
      </Section>

      {/* SETTINGS */}
      <Section title="⚙ Settings">
        <MenuButton
          title="🎨 Theme Settings"
          onPress={() => router.push("/theming")}
          color="#6F42C1"
        />
      </Section>

      {/* LOGOUT */}
      <View style={styles.logoutSection}>
        <MenuButton
          title="🚪 Logout"
          color="#DC3545"
          onPress={() => router.replace("/auth/login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
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
    marginLeft: 6,
  },

  /* SECTIONS */
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
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
