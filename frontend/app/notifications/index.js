import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { listNotifications } from "../../src/api/notifications";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";

export default function NotificationsPage() {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);

  useEffect(() => {
    listNotifications().then((r) =>
      setItems(r.data?.results || [])
    );
  }, []);

  return (
    <AppShell title="Notifications">
      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              {item.title}
            </Text>
            <Text style={{ color: colors.muted }}>
              {item.message}
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
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 15,
  },
});
