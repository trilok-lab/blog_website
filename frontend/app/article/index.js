import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { listArticles, listSlider } from "../../src/api/articles";
import { useTheme } from "../../src/theme/ThemeContext";
import client from "../../src/api/client";

/* ✅ NEW: normalize media URL */
const resolveImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${client.defaults.baseURL}${image}`;
};

export default function ArticleList({ mode = "view" }) {
  const router = useRouter();
  const { colors } = useTheme();

  const pageTitle =
    mode === "slider" ? "Featured Articles" : "Articles";

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef(null);

  /* ---------------- FETCH ARTICLES ---------------- */

  const loadArticles = async (q = "") => {
    setLoading(true);
    try {
      let res;
      if (mode === "slider") {
        res = await listSlider();
        setArticles(res.data || []);
      } else {
        res = await listArticles(1, null, q ? { search: q } : {});
        setArticles(res.data?.results || []);
      }
    } catch (err) {
      console.log("Article fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [mode]);

  useEffect(() => {
    if (mode !== "view") return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadArticles(search);
    }, 400);
  }, [search]);

  /* ---------------- CARD ---------------- */

  const renderItem = ({ item }) => {
    const excerpt =
      item.excerpt?.trim() ||
      item.body?.slice(0, 120) + "...";

    const imageUrl = resolveImageUrl(item.image);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        {/* ✅ NEW IMAGE RENDER */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        <View style={styles.cardContent}>
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

  /* ---------------- UI ---------------- */

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        {pageTitle}
      </Text>

      {mode === "view" && (
        <TextInput
          placeholder="Search articles..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.search,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      )}

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
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 50,
    marginBottom: 20,
  },

  search: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
  },

  thumbnail: {
    width: 90,
    height: 90,
  },

  cardContent: {
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
  },

  excerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
});
