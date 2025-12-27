// frontend/app/article/slider.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { listSlider } from "../../src/api/articles";

export default function SliderArticles() {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SLIDER ARTICLES ---------------- */

  const loadSliderArticles = async () => {
    setLoading(true);
    try {
      const res = await listSlider();

      // 🔥 IMPORTANT FIX: slider API is paginated
      setArticles(res.data?.results || []);
    } catch (error) {
      console.log("Slider article fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSliderArticles();
  }, []);

  /* ---------------- RENDER CARD ---------------- */

  const renderItem = ({ item }) => {
    const excerpt =
      item.excerpt && item.excerpt.trim().length > 0
        ? item.excerpt
        : item.body?.slice(0, 140) + "...";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        {/* IMAGE (OPTIONAL) */}
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>

          {/* CATEGORIES */}
          {item.categories?.length > 0 && (
            <View style={styles.categoryRow}>
              {item.categories.map((c) => (
                <Text key={c.id} style={styles.category}>
                  #{c.name}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.excerpt}>{excerpt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      {/* APP NAME */}
      <Text style={[styles.appName, { marginTop: 30, marginBottom: 20 }]}>
        Trilok Blog App
      </Text>

      {/* PAGE TITLE */}
      <Text style={styles.pageTitle}>Featured Articles</Text>

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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
  },

  image: {
    width: 120,
    height: "100%",
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
    color: "#1E90FF",
    marginRight: 8,
  },

  excerpt: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
});
