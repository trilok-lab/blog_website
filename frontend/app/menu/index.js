import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";
import { listNotifications } from "../../src/api/notifications";

export default function Menu() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnread();
  }, []);

  const loadUnread = async () => {
    try {
      const res = await listNotifications();
      const items = res.data?.results || res.data || [];
      const unread = items.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
      console.log("unread count error", e);
    }
  };

  const MenuButton = ({ title, onPress, color = "#1E90FF", badge }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
      activeOpacity={0.85}
    >
      <Text style={styles.buttonText}>{title}</Text>

      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
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
      <View style={styles.header}>
        <Text
          style={[
            styles.appName,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          Trilok Blog App
        </Text>
        <Text
          style={[
            styles.pageTitle,
            { color: isDark ? "#DDDDDD" : "#000000" },
          ]}
        >
          Menu
        </Text>
      </View>

      <Section title="📖 Read Articles">
        <MenuButton title="📄 View Articles" onPress={() => router.push("/article")} />
        <MenuButton title="🖼 Slider Articles" onPress={() => router.push("/article/slider")} />
        <MenuButton title="🔥 Popular Articles" onPress={() => router.push("/article/popular")} />
      </Section>

      <Section title="✍️ Contribute">
        <MenuButton
          title="👤➕ Submit Article (User)"
          onPress={() => router.push("/article/submit-user")}
        />
      </Section>

      <Section title="📞 Support">
        <MenuButton title="☎ Contact Us" onPress={() => router.push("/contact")} />
      </Section>

      <Section title="🔔 Notifications">
        <MenuButton
          title="🔔 View Notifications"
          onPress={() => router.push("/notifications")}
          color="#0D6EFD"
          badge={unreadCount}
        />
      </Section>

      <Section title="⚙ Settings">
        <MenuButton
          title="🎨 Theme Settings"
          onPress={() => router.push("/theming")}
          color="#6F42C1"
        />
      </Section>

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
  header: {
    marginBottom: 30,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 30,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    position: "relative",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#DC3545",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  logoutSection: {
    marginTop: 20,
  },
});
