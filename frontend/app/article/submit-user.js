import React, { useState, useEffect } from "react";
import {
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
import AppShell from "../../src/components/AppShell";

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
    getCategories().then((r) => setCategories(r.data?.results || []));
  }, []);

  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!r.canceled) setImage(r.assets[0]);
  };

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    if (!title || !body || !selectedCats.length) {
      return Alert.alert("Error", "All required fields missing");
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
      Alert.alert("Success", "Article submitted");
      router.replace("/article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Submit Article (User)">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <TextInput
          placeholder="Short Excerpt"
          placeholderTextColor={colors.muted}
          value={excerpt}
          onChangeText={setExcerpt}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <TextInput
          placeholder="Body"
          placeholderTextColor={colors.muted}
          value={body}
          onChangeText={setBody}
          multiline
          style={[
            styles.input,
            styles.body,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={pickImage}
        >
          <Text style={styles.btnText}>Pick Feature Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.image} />}

        <Text style={[styles.section, { color: colors.text }]}>
          Categories
        </Text>

        {categories.map((c) => {
          const active = selectedCats.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => toggleCategory(c.id)}
              style={[
                styles.cat,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.card,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? "#fff" : colors.text,
                  fontWeight: "600",
                }}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: colors.success }]}
          onPress={submit}
          disabled={submitting}
        >
          <Text style={styles.btnText}>
            {submitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  body: {
    height: 160,
    textAlignVertical: "top",
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  submit: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  cat: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
});
