// frontend/app/comments/[articleId].js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import client from "../../src/api/client";
import { useSearchParams } from "expo-router";

export default function CommentsList() {
  const { articleId } = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/api/comments/?article=${articleId}`);
        setComments(res.data);
      } catch (e) {
        console.warn(e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ padding: 12 }}>
      <FlatList
        data={comments}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "700" }}>{item.user_name || item.guest_name || "Guest"}</Text>
            <Text>{item.content}</Text>
            <Text style={{ color: "#666", fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
