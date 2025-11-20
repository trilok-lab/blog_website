import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { getArticles } from "../api";
import ArticleCard from "../components/ArticleCard";
import Loading from "../components/Loading";

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await getArticles({ page: 1 });
      setArticles(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}
          />
        )}
      />
    </View>
  );
}
