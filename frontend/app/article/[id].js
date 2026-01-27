// frontend/app/article/[id].js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

import { getArticle } from "../../src/api/articles";
import client from "../../src/api/client";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";

/* ---------------- PUBLIC CLIENT (NO AUTH) ---------------- */

const publicClient = axios.create({
  baseURL: client.defaults.baseURL,
});

/* ---------------- HELPERS ---------------- */

const resolveImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${client.defaults.baseURL}${image}`;
};

/* ---------------- COMPONENT ---------------- */

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  /* ---------------- LOADERS ---------------- */

  const loadArticle = async () => {
    const res = await getArticle(id);
    setArticle(res.data);
  };

  const loadComments = async () => {
    const res = await publicClient.get(
      `/api/comments/?article=${id}`
    );
    const data = Array.isArray(res.data) ? res.data : [];
    setComments(
      data.sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      )
    );
  };

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        await loadArticle();
        await loadComments();
      } catch (e) {
        console.log("Article detail load error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ---------------- ACTIONS ---------------- */

  const submitComment = async () => {
    if (!commentText.trim()) return;

    setPosting(true);
    try {
      await client.post("/api/comments/", {
        article: id,
        content: commentText,
      });
      setCommentText("");
      loadComments();
    } catch (e) {
      console.log("Comment submit error", e);
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <View
        style={[
          styles.loader,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!article) {
    return (
      <View
        style={[
          styles.loader,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>
          Article not found
        </Text>
      </View>
    );
  }

  const imageUrl = resolveImageUrl(article.image);

  /* ---------------- RENDER ---------------- */

  return (
    <AppShell title={article.title}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* CATEGORIES */}
        {article.categories?.length > 0 && (
          <View style={styles.categoryRow}>
            {article.categories.map((c) => (
              <Text
                key={c.id}
                style={[
                  styles.category,
                  {
                    backgroundColor: colors.card,
                    color: colors.primary,
                    borderColor: colors.border,
                  },
                ]}
              >
                {c.name}
              </Text>
            ))}
          </View>
        )}

        {/* EXCERPT */}
        {article.excerpt && (
          <Text
            style={[
              styles.excerpt,
              { color: colors.muted },
            ]}
          >
            {article.excerpt}
          </Text>
        )}

        {/* IMAGE */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )}

        {/* BODY */}
        <Text style={[styles.body, { color: colors.text }]}>
          {article.body}
        </Text>

        <View
          style={[
            styles.separator,
            { backgroundColor: colors.border },
          ]}
        />

        {/* COMMENTS */}
        <Text
          style={[
            styles.commentsHeader,
            { color: colors.text },
          ]}
        >
          Comments
        </Text>

        {/* COMMENT INPUT */}
        <View
          style={[
            styles.commentBox,
            { backgroundColor: colors.card },
          ]}
        >
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor={colors.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={submitComment}
            disabled={posting}
          >
            <Text style={styles.postText}>
              {posting ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* COMMENT LIST */}
        {comments.length === 0 ? (
          <Text
            style={[
              styles.noComments,
              { color: colors.muted },
            ]}
          >
            No comments yet.
          </Text>
        ) : (
          comments.map((c) => (
            <View
              key={c.id}
              style={[
                styles.commentItem,
                { backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.commentAuthor,
                  { color: colors.text },
                ]}
              >
                {c.user_name || "User"}
              </Text>
              <Text
                style={[
                  styles.commentContent,
                  { color: colors.text },
                ]}
              >
                {c.content}
              </Text>
              <Text
                style={[
                  styles.commentDate,
                  { color: colors.muted },
                ]}
              >
                {new Date(c.created_at).toDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    borderWidth: 1,
  },
  excerpt: {
    fontStyle: "italic",
    fontSize: 15,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    marginVertical: 30,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  commentBox: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    minHeight: 60,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  postButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postText: {
    color: "#fff",
    fontWeight: "700",
  },
  noComments: {
    fontStyle: "italic",
    marginBottom: 20,
  },
  commentItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentAuthor: {
    fontWeight: "700",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    marginBottom: 6,
  },
  commentDate: {
    fontSize: 12,
  },
});
