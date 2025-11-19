import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { fetchArticles } from "../api/client";
import Loading from "../components/Loading";

export default function ArticleListScreen({ navigation }) {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchArticles();
    setArticles(data);
  };

  if (!articles) return <Loading />;

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.title}</Text>
            <Text style={{ color: "blue" }}>Read more...</Text>
            <View style={{ marginBottom: 20 }} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
