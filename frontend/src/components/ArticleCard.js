import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ArticleCard({ article, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(article.slug)}>
      {article.image && <Image source={{ uri: article.image }} style={styles.image} />}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.excerpt}>{article.excerpt}</Text>
      <Text style={styles.comments}>{article.comments_count} comments</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  image: { width: "100%", height: 150, borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 16, marginTop: 5 },
  excerpt: { fontSize: 14, marginTop: 5 },
  comments: { fontSize: 12, color: "gray", marginTop: 5 },
});
