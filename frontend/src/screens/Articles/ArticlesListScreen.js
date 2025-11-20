import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getArticles } from "../../api";

export default function ArticlesListScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    try {
      const res = await getArticles(page);
      setArticles(res.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ArticleDetail", { slug: item.slug })} style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2}>{item.excerpt}</Text>
      <Text style={styles.readMore}>Read more...</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginBottom: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  readMore: { color: "#007bff", marginTop: 5 },
});
