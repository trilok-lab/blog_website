import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { getArticles } from "../../api";
import ArticleCard from "../../components/ArticleCard";

export default function UserDashboard({ navigation }) {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    const data = await getArticles();
    setArticles(data.results);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Dashboard</Text>
      <Button title="Create Article" onPress={() => navigation.navigate("CreateArticle")} />
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard article={item} onPress={(slug) => navigation.navigate("ArticleDetail", { slug })} />
        )}
      />
    </View>
  );
}
