import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createArticle } from "../api/client";

export default function SubmitArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    await createArticle(title, content);
    navigation.navigate("Articles");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          borderWidth: 1,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 10,
        }}
      />

      <Button title="Submit Article" onPress={submit} />
    </View>
  );
}
