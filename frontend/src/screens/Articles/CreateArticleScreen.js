import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { submitArticle } from "../../api";

export default function CreateArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createArticle = async () => {
    if (!title || !content) return Alert.alert("Error", "Fill all fields");
    try {
      await submitArticle({ title, content });
      Alert.alert("Success", "Article created!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert("Error", "Failed to create article");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Content</Text>
      <TextInput value={content} onChangeText={setContent} multiline numberOfLines={6} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Create Article" onPress={createArticle} />
    </View>
  );
}
