// frontend/app/article/index.js

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";

import { listArticles } from "../../src/api/articles";
import client from "../../src/api/client";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";
import ArticleSlider from "../../src/components/ArticleSlider";

const resolveImageUrl = (img) =>
  img?.startsWith("http") ? img : `${client.defaults.baseURL}${img}`;

export default function ArticleList() {
  const router = useRouter();
  const { colors } = useTheme();

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const debounce = useRef(null);

  const load = async (q = "") => {
    setLoading(true);
    try {
      const res = await listArticles(1, null, q ? { search: q } : {});
      setArticles(res.data?.results || []);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await load(search);
    setRefreshing(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(search), 400);
  }, [search]);

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
    <AppShell title="Articles">
      <TextInput
        placeholder="Search articles..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.muted}
        style={[
          styles.search,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />

      <ArticleSlider
        onPress={(item) => router.push(`/article/${item.id}`)}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },
  image: {
    width: 90,
    height: "90%",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    marginRight: 8,
    fontWeight: "600",
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
});
