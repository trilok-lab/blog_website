import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Button, Alert } from "react-native";
import api from "../../api/client";

export default function AdminArticleListScreen({ navigation }) {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    const res = await api.get("/articles/admin-list/");
    setArticles(res.data.results);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const approveArticle = async (id) => {
    try {
      await api.post(`/articles/${id}/approve/`);
      Alert.alert("Success", "Article approved!");
      fetchArticles();
    } catch (err) {
      Alert.alert("Error", "Failed to approve");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>Status: {item.is_approved ? "Approved" : "Pending"}</Text>
            <Button title="Approve" onPress={() => approveArticle(item.id)} />
            <Button title="Edit" onPress={() => navigation.navigate("EditArticle", { slug: item.slug })} />
          </View>
        )}
      />
    </View>
  );
}
