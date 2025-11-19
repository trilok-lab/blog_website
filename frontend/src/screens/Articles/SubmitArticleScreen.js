import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { submitArticle } from "../../api";

export default function SubmitArticleScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submit = async () => {
    if (!title || !content) return Alert.alert("Error", "Fill all fields");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", { uri: image, name: "article.jpg", type: "image/jpeg" });
    try {
      await submitArticle(formData);
      Alert.alert("Success", "Article submitted!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert("Error", "Failed to submit article");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Content</Text>
      <TextInput value={content} onChangeText={setContent} multiline numberOfLines={6} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10, padding: 10, backgroundColor: "#ddd" }}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 10 }} />}
      <Button title="Submit Article" onPress={submit} />
    </View>
  );
}
