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

export default function ArticleList({ mode = "view" }) {
  const router = useRouter();

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

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        {/* IMAGE (ONLY IF EXISTS) */}
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>

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

  return (
    <View style={styles.container}>
      {/* APP NAME */}
      <Text style={[styles.appName, { marginTop: 30, marginBottom: 20 }]}>
        Trilok Blog App
      </Text>

      {/* TITLE */}
      <Text style={styles.pageTitle}>{pageTitle}</Text>

      {/* SEARCH */}
      {mode === "view" && (
        <TextInput
          placeholder="Search articles..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
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
  search: {
    borderWidth: 1,
    borderColor: "#CED4DA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
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
    color: "#1E90FF",
    marginRight: 8,
  },
  excerpt: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
});
