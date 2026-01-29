// frontend/app/notifications/index.js

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import AppShell from "../../src/components/AppShell";
import { useTheme } from "../../src/theme/ThemeContext";
import {
  listNotifications,
  markRead,
} from "../../src/api/notifications";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function NotificationsPage() {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await listNotifications();
    setItems(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const onPressNotification = async (item) => {
    if (!item.is_read) {
      await markRead(item.id);
      setItems((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, is_read: true } : n
        )
      );
    }
  };

  return (
    <AppShell title="Notifications">
      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressNotification(item)}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderLeftColor: item.is_read
                  ? "transparent"
                  : "#ff9800",
              },
            ]}
          >
            <View style={styles.row}>
              {!item.is_read && (
                <Text style={styles.bell}>🔔</Text>
              )}
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                {item.title}
              </Text>
            </View>

            <Text
              style={[
                styles.message,
                { color: colors.muted },
              ]}
            >
              {item.message}
            </Text>

            <Text
              style={[
                styles.time,
                { color: colors.muted },
              ]}
            >
              {formatDate(item.created_at)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: colors.muted,
            }}
          >
            No notifications
          </Text>
        }
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bell: {
    marginRight: 6,
    fontSize: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    fontSize: 14,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    textAlign: "right",
  },
});
