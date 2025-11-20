import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ArticleCard({ article, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {article.image && <Image source={{ uri: article.image }} style={styles.image} />}
      <Text style={styles.title}>{article.title}</Text>
      <Text numberOfLines={2} style={styles.excerpt}>{article.excerpt}</Text>
      <Text style={styles.meta}>{article.comments_count} comments</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, padding: 10, backgroundColor: "#fff", borderRadius: 8, shadowOpacity: 0.2 },
  image: { width: "100%", height: 150, borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 16, marginTop: 5 },
  excerpt: { color: "#555", marginTop: 5 },
  meta: { color: "#999", marginTop: 5, fontSize: 12 },
});
