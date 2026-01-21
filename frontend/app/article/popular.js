import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { listPopular } from "../../src/api/articles";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";
import client from "../../src/api/client";

const resolveImageUrl = (img) =>
  img?.startsWith("http") ? img : `${client.defaults.baseURL}${img}`;

export default function PopularArticles() {
  const router = useRouter();
  const { colors } = useTheme();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await listPopular();
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        setArticles(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderItem = ({ item }) => {
    const excerpt =
      item.excerpt?.trim() ||
      item.body?.slice(0, 120) + "...";

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        {item.image && (
          <Image
            source={{ uri: resolveImageUrl(item.image) }}
            style={styles.image}
          />
        )}

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>

          <Text style={[styles.views, { color: colors.danger }]}>
            🔥 {item.popularity} views
          </Text>

          {item.categories?.length > 0 && (
            <View style={styles.categoryRow}>
              {item.categories.map((c) => (
                <Text
                  key={c.id}
                  style={[styles.category, { color: colors.primary }]}
                >
                  #{c.name}
                </Text>
              ))}
            </View>
          )}

          <Text style={[styles.excerpt, { color: colors.muted }]}>
            {excerpt}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppShell title="Popular Articles">
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },
  image: {
    width: 90,
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  views: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    marginRight: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
});
