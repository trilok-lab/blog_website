import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { createArticle } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SubmitArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please enter both title and content");
      return;
    }

    setLoading(true);

    try {
      // Retrieve token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Not Logged In", "Please login to submit an article");
        setLoading(false);
        return;
      }

      // Submit article
      const res = await createArticle(title, content);
      console.log("Article submitted:", res);

      Alert.alert("Success", "Article submitted successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Articles"),
        },
      ]);

      // Reset form
      setTitle("");
      setContent("");
    } catch (err) {
      console.log("Submit error:", err.response?.data || err.message);
      Alert.alert(
        "Submission Failed",
        err.response?.data?.message || "Could not submit article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Text>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5, height: 100 }}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Submit Article" onPress={submit} />
      )}
    </View>
  );
}
