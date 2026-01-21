import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getArticle } from "../../src/api/articles";
import client from "../../src/api/client";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";

const resolveImageUrl = (img) =>
  img?.startsWith("http") ? img : `${client.defaults.baseURL}${img}`;

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticle(id).then((r) => setArticle(r.data));
  }, [id]);

  if (!article) {
    return <ActivityIndicator size="large" style={{ marginTop: 80 }} />;
  }

  return (
    <AppShell title={article.title}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {article.image && (
          <Image
            source={{ uri: resolveImageUrl(article.image) }}
            style={styles.image}
          />
        )}
        <Text style={[styles.body, { color: colors.text }]}>
          {article.body}
        </Text>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
