import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { getArticles } from "../../api";
import ArticleCard from "../../components/ArticleCard";
import Loading from "../../components/Loading";

export default function ArticlesListScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    const data = await getArticles();
    setArticles(data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1, padding: 10 }}>
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
