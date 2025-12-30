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

export default function SubmitArticleUser() {
  const router = useRouter();

  /* ---------------- FORM STATE ---------------- */

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- LOAD CATEGORIES ---------------- */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        // API returns paginated response
        setCategories(res.data?.results || []);
      } catch (err) {
        console.log("Category load error", err);
        Alert.alert("Error", "Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  /* ---------------- CATEGORY TOGGLE ---------------- */

  const toggleCategory = (id) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter((c) => c !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing fields", "Title and body are required.");
      return;
    }

    if (selectedCats.length === 0) {
      Alert.alert("Select category", "Please select at least one category.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("body", body);

    // ✅ DRF-safe category array
    selectedCats.forEach((id) => {
    formData.append("category_ids", id);
    });


    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: "article.jpg",
        type: "image/jpeg",
      });
    }

    try {
      setSubmitting(true);
      await submitArticle(formData);

      Alert.alert(
        "Submitted",
        "Your article has been submitted for review."
      );
      router.replace("/article");
    } catch (err) {
      console.log("Submit error", err);
      Alert.alert("Error", "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* APP NAME */}
      <Text style={styles.appName}>Trilok Blog App</Text>

      {/* PAGE TITLE */}
      <Text style={styles.pageTitle}>Submit Article (User)</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Short Excerpt"
        value={excerpt}
        onChangeText={setExcerpt}
        style={styles.input}
      />

      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={setBody}
        multiline
        style={[styles.input, styles.bodyInput]}
      />

      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>
          Pick Feature Image (Optional)
        </Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      )}

      {/* CATEGORIES */}
      <Text style={styles.sectionTitle}>Categories</Text>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => toggleCategory(cat.id)}
          style={[
            styles.categoryItem,
            selectedCats.includes(cat.id) && styles.categorySelected,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCats.includes(cat.id) && { color: "#fff" },
            ]}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={submit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 40,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CED4DA",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  bodyInput: {
    height: 180,
    textAlignVertical: "top",
  },

  imageBtn: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },

  imageBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },

  categoryItem: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#E9ECEF",
    marginBottom: 8,
  },

  categorySelected: {
    backgroundColor: "#1E90FF",
  },

  categoryText: {
    fontSize: 15,
    fontWeight: "600",
  },

  submitBtn: {
    backgroundColor: "#28A745",
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
  },

  submitText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16,
  },
});
