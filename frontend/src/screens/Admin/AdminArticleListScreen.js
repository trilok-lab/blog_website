import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { getAllArticles, approveArticle } from "../../api";

export default function AdminArticleListScreen() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await getAllArticles();
    setArticles(res.data.results);
  };

  const handleApprove = async (id) => {
    await approveArticle(id);
    fetchArticles();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Status: {item.approved ? "Approved" : "Pending"}</Text>
      {!item.approved && <Button title="Approve" onPress={() => handleApprove(item.id)} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={articles} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});
