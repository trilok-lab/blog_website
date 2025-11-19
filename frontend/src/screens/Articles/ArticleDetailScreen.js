import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { getArticleDetails } from "../../api";

export default function ArticleDetailScreen({ route, navigation }) {
  const { slug } = route.params;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticleDetails(slug);
      setArticle(data);
    };
    fetchArticle();
  }, [slug]);

  if (!article) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 10 }}>
      {article.image && <Image source={{ uri: article.image }} style={{ width: "100%", height: 200 }} />}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>{article.title}</Text>
      <Text>{article.content}</Text>
      <Button title="View Comments" onPress={() => navigation.navigate("Comments", { articleId: article.id })} />
    </ScrollView>
  );
}
