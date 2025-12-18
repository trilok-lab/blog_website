// frontend/app/submit/index.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { submitArticle, getCategories } from "../../src/api/articles";
import { showSnackbar } from "../../src/components/Snackbar";
import * as ImagePicker from "expo-image-picker";

export default function SubmitArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled) setImage(res);
  };

  const doSubmit = async () => {
    if (!title || !body) { showSnackbar("Title and body are required", "error"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("excerpt", excerpt);
      fd.append("body", body);
      if (image && image.uri) {
        const filename = image.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image";
        fd.append("image", { uri: image.uri, name: filename, type });
      }
      await submitArticle(fd);
      showSnackbar("Article submitted", "success");
      router.replace("/");
    } catch (e) {
      console.log("submit err", e);
      showSnackbar("Submission failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 30, marginBottom: 12 ,paddingHorizontal: 20, paddingTop: 50}}>Submit Article</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
      <TextInput placeholder="Excerpt" value={excerpt} onChangeText={setExcerpt} style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
      <TextInput placeholder="Body" value={body} onChangeText={setBody} multiline style={{ borderWidth: 1, padding: 12, height: 180, marginBottom: 8 }} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 120, height: 80, marginBottom: 8 }} />}
      <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={doSubmit} style={{ backgroundColor: "#1E90FF", padding: 12, borderRadius: 8, alignItems: "center" }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Submit</Text>}
      </TouchableOpacity>
    </View>
  );
}
