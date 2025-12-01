import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import client from "../../src/api/client";
import { useSearchParams } from "expo-router";

export default function CommentsList() {
  const { article } = useSearchParams(); // article slug or id
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await client.get("/api/comments/", { params: { article } });
      setComments(res.data);
    } catch (err) {
      console.log("Comments load", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [article]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.user_name || item.guest_name || "Guest"}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.meta}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#eee", padding: 12, marginBottom: 10, borderRadius: 8 },
  name: { fontWeight: "700" },
  content: { marginTop: 6 },
  meta: { marginTop: 8, color: "#777", fontSize: 12 },
});
