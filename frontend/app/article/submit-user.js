// frontend/app/article/submit-user.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { submitArticle, getCategories } from "../../src/api/articles";
import { useTheme } from "../../src/theme/ThemeContext";

export default function SubmitArticleUser() {
  const router = useRouter();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data?.results || []))
      .catch(() => Alert.alert("Error", "Failed to load categories"));
  }, []);

  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!r.canceled) setImage(r.assets[0]);
  };

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      return Alert.alert("Error", "Title and body are required");
    }
    if (!selectedCats.length) {
      return Alert.alert("Error", "Select at least one category");
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("body", body);
    selectedCats.forEach((id) => fd.append("category_ids", id));

    if (image) {
      fd.append("image", {
        uri: image.uri,
        name: "article.jpg",
        type: "image/jpeg",
      });
    }

    try {
      setSubmitting(true);
      await submitArticle(fd);
      Alert.alert("Success", "Article submitted for review");
      router.replace("/article");
    } catch {
      Alert.alert("Error", "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Text style={[styles.appName, { color: colors.text }]}>
        Trilok Blog App
      </Text>

      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Submit Article (User)
      </Text>

      {[["Title", title, setTitle],
        ["Short Excerpt", excerpt, setExcerpt]].map(
        ([p, v, s], i) => (
          <TextInput
            key={i}
            placeholder={p}
            placeholderTextColor={colors.muted}
            value={v}
            onChangeText={s}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />
        )
      )}

      <TextInput
        placeholder="Body"
        placeholderTextColor={colors.muted}
        value={body}
        onChangeText={setBody}
        multiline
        style={[
          styles.input,
          styles.bodyInput,
          {
            backgroundColor: colors.inputBg,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
      />

      <TouchableOpacity
        style={[styles.imageBtn, { backgroundColor: colors.primary }]}
        onPress={pickImage}
      >
        <Text style={styles.btnText}>Pick Feature Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Categories
      </Text>

      {categories.map((c) => (
        <TouchableOpacity
          key={c.id}
          onPress={() => toggleCategory(c.id)}
          style={[
            styles.categoryItem,
            {
              backgroundColor: selectedCats.includes(c.id)
                ? colors.primary
                : colors.card,
            },
          ]}
        >
          <Text
            style={{
              color: selectedCats.includes(c.id)
                ? "#fff"
                : colors.text,
              fontWeight: "600",
            }}
          >
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={submit}
        disabled={submitting}
        style={[styles.submitBtn, { backgroundColor: colors.success }]}
      >
        <Text style={styles.btnText}>
          {submitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  appName: { fontSize: 26, fontWeight: "800", textAlign: "center", marginTop: 40 },
  pageTitle: { fontSize: 22, fontWeight: "700", marginVertical: 30 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  bodyInput: { height: 180, textAlignVertical: "top" },
  imageBtn: { padding: 12, borderRadius: 8, marginVertical: 10 },
  submitBtn: { padding: 16, borderRadius: 10, marginTop: 30 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  previewImage: { width: "100%", height: 200, borderRadius: 12, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  categoryItem: { padding: 12, borderRadius: 8, marginBottom: 8 },
});
