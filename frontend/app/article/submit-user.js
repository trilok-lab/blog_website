// frontend/app/article/submit-user.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { submitArticle, getCategories } from "../../src/api/articles";
import { showSnackbar } from "../../src/components/Snackbar";

export default function SubmitArticleUser() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, base64: false, quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const toggleCategory = (id) => {
    if (selectedCats.includes(id)) setSelectedCats(selectedCats.filter(c => c !== id));
    else setSelectedCats([...selectedCats, id]);
  };

  const submit = async () => {
    if (!title || !body) {
      Alert.alert("Missing fields", "Title and body are required.");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("body", body);
    selectedCats.forEach(id => fd.append("category_ids", id));
    if (image) fd.append("image", { uri: image.uri, name: "article.jpg", type: "image/jpeg" });

    try {
      await submitArticle(fd);
      showSnackbar("Article submitted", "success");
      router.replace("/article");
    } catch (e) {
      console.log("submit err", e);
      showSnackbar("Submission failed", "error");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 40 , paddingHorizontal: 10, paddingTop: 50}}>Submit Article (User)</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 10, marginVertical: 10 }} />
      <TextInput placeholder="Short Excerpt" value={excerpt} onChangeText={setExcerpt} style={{ borderWidth: 1, padding: 10, marginVertical: 10 }} />
      <TextInput placeholder="Body" value={body} onChangeText={setBody} multiline style={{ borderWidth: 1, padding: 10, marginVertical: 10, height: 180 }} />

      <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#1E90FF", padding: 10, borderRadius: 6 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Pick Feature Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={{ width: "100%", height: 200, marginVertical: 10 }} />}

      <Text style={{ marginVertical: 10, fontSize: 18 }}>Categories</Text>
      {categories.map(c => (
        <TouchableOpacity key={c.id} onPress={() => toggleCategory(c.id)} style={{ padding: 10, marginBottom: 6, backgroundColor: selectedCats.includes(c.id) ? "#1E90FF" : "#eee", borderRadius: 6 }}>
          <Text style={{ color: selectedCats.includes(c.id) ? "white" : "black" }}>{c.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={submit} style={{ backgroundColor: "#28a745", padding: 14, marginVertical: 20, borderRadius: 6 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
