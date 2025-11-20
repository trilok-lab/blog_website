import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getArticleDetail } from "../../api";

export default function ArticleDetailScreen({ route }) {
  const { slug } = route.params;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const res = await getArticleDetail(slug);
      setArticle(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!article) return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      {article.image && <Image source={{ uri: article.image }} style={styles.image} />}
      <Text style={styles.content}>{article.content}</Text>
      <Text style={styles.categories}>Categories: {article.categories.map((c) => c.name).join(", ")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  image: { width: "100%", height: 200, marginBottom: 15 },
  content: { fontSize: 16, lineHeight: 24 },
  categories: { marginTop: 10, fontStyle: "italic" },
});
