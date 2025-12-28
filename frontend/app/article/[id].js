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

import { getArticle } from "../../src/api/articles";
import client from "../../src/api/client";

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  /* ---------------- FETCH ARTICLE ---------------- */

  const loadArticle = async () => {
    setLoading(true);
    try {
      const res = await getArticle(id);
      setArticle(res.data);
    } catch (err) {
      console.log("Article fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH COMMENTS (PUBLIC) ---------------- */

  const loadComments = async () => {
    try {
      const res = await client.get(`/api/comments/?article=${id}`);

      // backend returns ARRAY, not { results }
      const data = Array.isArray(res.data) ? res.data : [];

      // latest → oldest
      data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setComments(data);
    } catch (err) {
      console.log("Comments fetch error", err);
      setComments([]);
    }
  };

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [id]);

  /* ---------------- POST COMMENT ---------------- */

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
    } catch (err) {
      console.log("Comment submit error", err);
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.loader}>
        <Text>Article not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* APP NAME */}
      <Text style={[styles.appName, { marginTop: 30, marginBottom: 20 }]}>
        Trilok Blog App
      </Text>

      {/* ARTICLE TITLE */}
      <Text style={styles.title}>{article.title}</Text>

      {/* CATEGORIES */}
      {article.categories?.length > 0 && (
        <View style={styles.categoryRow}>
          {article.categories.map((c) => (
            <Text key={c.id} style={styles.category}>
              {c.name}
            </Text>
          ))}
        </View>
      )}

      {/* EXCERPT */}
      {article.excerpt && (
        <Text style={styles.excerpt}>{article.excerpt}</Text>
      )}

      {/* IMAGE */}
      {article.image && (
        <Image source={{ uri: article.image }} style={styles.image} />
      )}

      {/* BODY */}
      <Text style={styles.body}>{article.body}</Text>

      {/* SEPARATOR */}
      <View style={styles.separator} />

      {/* COMMENTS HEADER */}
      <Text style={styles.commentsHeader}>Comments</Text>

      {/* COMMENT INPUT */}
      <View style={styles.commentBox}>
        <TextInput
          placeholder="Write a comment…"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.postButton}
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
        <Text style={styles.noComments}>No comments yet.</Text>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={styles.commentItem}>
            <Text style={styles.commentAuthor}>
              {c.user_name || "User"}
            </Text>
            <Text style={styles.commentContent}>{c.content}</Text>
            <Text style={styles.commentDate}>
              {new Date(c.created_at).toDateString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  category: {
    backgroundColor: "#E7F0FF",
    color: "#1E90FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  excerpt: {
    fontStyle: "italic",
    color: "#6C757D",
    fontSize: 15,
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#212529",
  },

  separator: {
    height: 1,
    backgroundColor: "#DEE2E6",
    marginVertical: 30,
  },

  commentsHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
    marginBottom: 12,
  },

  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },

  input: {
    minHeight: 60,
    fontSize: 15,
    marginBottom: 10,
  },

  postButton: {
    alignSelf: "flex-end",
    backgroundColor: "#1E90FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  postText: {
    color: "#fff",
    fontWeight: "700",
  },

  noComments: {
    color: "#6C757D",
    fontStyle: "italic",
    marginBottom: 20,
  },

  commentItem: {
    backgroundColor: "#fff",
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
    color: "#6C757D",
  },
});
