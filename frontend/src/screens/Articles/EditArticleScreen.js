import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getArticleDetail, updateArticle } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditArticleScreen({ route, navigation }) {
  const { slug } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    const res = await getArticleDetail(slug);
    setTitle(res.data.title);
    setContent(res.data.content);
    setCategories(res.data.categories.map((c) => c.name).join(","));
    setLoading(false);
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await updateArticle(slug, { title, content, categories: categories.split(",") }, token);
      Alert.alert("Article updated!");
      navigation.navigate("ArticleDetail", { slug });
    } catch (error) {
      console.error(error);
      Alert.alert("Update failed");
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} style={[styles.input, { height: 150 }]} multiline />
      <TextInput placeholder="Categories" value={categories} onChangeText={setCategories} style={styles.input} />
      <Button title="Update Article" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});
