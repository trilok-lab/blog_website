import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getArticleDetails, submitArticle } from "../../api";

export default function EditArticleScreen({ route, navigation }) {
  const { slug } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleDetails(slug);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch article");
      }
    };
    fetchArticle();
  }, [slug]);

  const editArticle = async () => {
    if (!title || !content) return Alert.alert("Error", "Fill all fields");
    try {
      await submitArticle({ title, content, slug });
      Alert.alert("Success", "Article updated!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert("Error", "Failed to update article");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Content</Text>
      <TextInput value={content} onChangeText={setContent} multiline numberOfLines={6} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Update Article" onPress={editArticle} />
    </View>
  );
}
