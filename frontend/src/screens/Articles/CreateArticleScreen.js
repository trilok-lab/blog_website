import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createArticle } from "../api/client";

export default function CreateArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const save = async () => {
    await createArticle(title, content);
    navigation.navigate("Articles");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Create Article</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />

      <TextInput placeholder="Content" value={content} onChangeText={setContent}
        multiline style={{ borderWidth: 1, marginVertical: 10, padding: 8, height: 120 }} />

      <Button title="Save" onPress={save} />
    </View>
  );
}
