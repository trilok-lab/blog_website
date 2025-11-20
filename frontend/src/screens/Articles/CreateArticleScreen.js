import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { createArticle } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      await createArticle({ title, content, categories: categories.split(",") }, token);
      Alert.alert("Article created successfully!");
      navigation.navigate("ArticlesList");
    } catch (error) {
      console.error(error);
      Alert.alert("Error creating article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 150 }]}
        multiline
      />
      <TextInput placeholder="Categories (comma-separated)" value={categories} onChangeText={setCategories} style={styles.input} />
      <Button title={loading ? "Submitting..." : "Submit Article"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});
