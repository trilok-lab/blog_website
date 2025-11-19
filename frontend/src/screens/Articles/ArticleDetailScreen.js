import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { fetchArticleDetail } from "../api/client";
import Loading from "../components/Loading";

export default function ArticleDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchArticleDetail(id);
    setArticle(data);
  };

  if (!article) return <Loading />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>{article.title}</Text>
      <Text style={{ marginVertical: 20 }}>{article.content}</Text>

      <Button
        title="View Comments"
        onPress={() => navigation.navigate("Comments", { articleId: id })}
      />
    </View>
  );
}
