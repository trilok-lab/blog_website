import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditArticleScreen({ route, navigation }) {
  const { article } = route.params;

  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);

  const update = () => {
    alert("Update API not implemented yet.");
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Edit Article</Text>

      <TextInput value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />

      <TextInput value={content} onChangeText={setContent}
        multiline style={{ borderWidth: 1, height: 150, padding: 8 }} />

      <Button title="Update" onPress={update} />
    </View>
  );
}
