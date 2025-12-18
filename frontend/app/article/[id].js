import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  async function loadArticle() {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/articles/${id}/`
      );

      if (!res.ok) {
        throw new Error("Failed to load article");
      }

      const json = await res.json();
      setArticle(json);
    } catch (e) {
      console.error(e);
      setError("Could not load article");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        {article.title}
      </Text>

      {article.categories?.length > 0 && (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {article.categories.map((c) => (
            <View
              key={c.id}
              style={{
                backgroundColor: "#e2e8ff",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 6,
              }}
            >
              <Text>{c.name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          lineHeight: 22,
        }}
      >
        {article.content}
      </Text>
    </ScrollView>
  );
}
