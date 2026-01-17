import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { listNotifications, markRead } from "../../src/api/notifications";
import { useTheme } from "../../src/theme/ThemeContext";

const HEADER_OFFSET = 30; // 🔧 adjust if needed

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [groups, setGroups] = useState({ today: [], earlier: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- LOAD DATA ---------------- */

  const load = async () => {
    try {
      const res = await listNotifications();
      const items = res.data?.results || res.data || [];

      const today = [];
      const earlier = [];
      const todayStr = new Date().toDateString();

      items.forEach((n) => {
        const dateStr = new Date(n.created_at).toDateString();
        dateStr === todayStr ? today.push(n) : earlier.push(n);
      });

      setGroups({ today, earlier });
    } catch (e) {
      console.log("notifications load error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- MARK READ ---------------- */

  const onPressItem = async (item) => {
    if (item.is_read) return;

    setGroups((prev) => ({
      today: prev.today.map((n) =>
        n.id === item.id ? { ...n, is_read: true } : n
      ),
      earlier: prev.earlier.map((n) =>
        n.id === item.id ? { ...n, is_read: true } : n
      ),
    }));

    try {
      await markRead(item.id);
    } catch (e) {
      console.log("mark read failed", e);
    }
  };

  /* ---------------- RENDER ITEM ---------------- */

  const renderNotification = ({ item }) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPressItem(item)}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? item.is_read
                ? "#1E1E1E"
                : "#2A2A2A"
              : item.is_read
              ? "#F1F3F5"
              : "#E7F1FF",
            borderLeftWidth: item.is_read ? 0 : 4,
            borderLeftColor: "#0D6EFD",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          {item.title || "Notification"}
        </Text>

        <Text
          style={[
            styles.message,
            { color: isDark ? "#CCCCCC" : "#333333" },
          ]}
        >
          {item.message}
        </Text>

        <View style={styles.footer}>
          <Text style={{ fontSize: 12, color: "#6C757D" }}>
            {new Date(item.created_at).toLocaleString()}
          </Text>

          {!item.is_read && <Text style={styles.unreadBadge}>NEW</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  /* ---------------- BUILD LIST ---------------- */

  const buildListData = () => {
    const data = [];

    if (groups.today.length) {
      data.push({ type: "header", title: "Today" });
      data.push(...groups.today);
    }

    if (groups.earlier.length) {
      data.push({ type: "header", title: "Earlier" });
      data.push(...groups.earlier);
    }

    return data;
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#121212" : "#FFFFFF" },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <FlatList
      data={buildListData()}
      keyExtractor={(item, index) =>
        item.type === "header" ? `h-${index}` : String(item.id)
      }
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#FFFFFF" },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
      ListHeaderComponent={
        <Text
          style={[
            styles.pageTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          Notifications
        </Text>
      }
      renderItem={({ item }) =>
        item.type === "header" ? (
          <Text
            style={[
              styles.groupHeader,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            {item.title}
          </Text>
        ) : (
          renderNotification({ item })
        )
      }
      ListEmptyComponent={
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            color: isDark ? "#AAAAAA" : "#555555",
          }}
        >
          No notifications
        </Text>
      }
    />
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: HEADER_OFFSET,
    marginBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  groupHeader: {
    fontSize: 16,
    fontWeight: "800",
    marginVertical: 12,
  },

  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  message: {
    marginTop: 6,
    fontSize: 14,
  },

  footer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  unreadBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0D6EFD",
  },
});
