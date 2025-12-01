import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import client from "../../src/api/client";

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    client.get(`/api/articles/${id}/`)
      .then(res => setArticle(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!article) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
        {article.title}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {article.body}
      </Text>

      <Text>Popularity: {article.popularity}</Text>
      <Text>Approved: {article.is_approved ? "Yes" : "No"}</Text>
    </ScrollView>
  );
}
