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
import { useTheme } from "../../src/theme/ThemeContext";

export default function SliderArticles() {
  const router = useRouter();
  const { colors } = useTheme();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SLIDER ARTICLES ---------------- */

  const loadSliderArticles = async () => {
    setLoading(true);
    try {
      const res = await listSlider();
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
        style={[styles.card, { backgroundColor: colors.card }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
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
      <Text
        style={[
          styles.appName,
          { color: colors.text, marginTop: 30, marginBottom: 20 },
        ]}
      >
        Trilok Blog App
      </Text>

      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Featured Articles
      </Text>

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
    marginRight: 8,
  },

  excerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
});
