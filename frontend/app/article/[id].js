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
  Alert,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  /* ---------------- ARTICLE STATE ---------------- */

  const [article, setArticle] = useState(null);

  /* ---------------- COMMENTS STATE ---------------- */

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  /* ---------------- LOADING STATE ---------------- */

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- AUTH STATE ---------------- */

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---------------- GUEST OTP STATE ---------------- */

  const [guestName, setGuestName] = useState("");          // ✅ ADDED
  const [guestMobile, setGuestMobile] = useState("");
  const [guestOtp, setGuestOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

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

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadArticle();
      await loadComments();
    } catch (e) {
      console.log("Refresh error", e);
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        await checkAuth();
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

  /* ---------------- OTP ACTIONS (GUEST) ---------------- */

  const requestGuestOtp = async () => {
    if (!guestMobile.trim()) {
      Alert.alert("Error", "Enter mobile number");
      return;
    }

    try {
      setSendingOtp(true);

      const res = await publicClient.post(
        "/api/auth/request-phone-code/",
        {
          mobile_no: guestMobile.trim(),
        }
      );

      setOtpSessionId(res.data.session_id);
      setOtpSent(true);

      Alert.alert("OTP Sent", "Please check your phone");
    } catch (e) {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyGuestOtp = async () => {
    if (guestOtp.trim().length !== 6) {
      Alert.alert("Error", "Enter valid 6-digit OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      await publicClient.post(
        "/api/auth/verify-phone-code/",
        {
          session_id: otpSessionId,
          code: guestOtp.trim(),
        }
      );

      setOtpVerified(true);

      Alert.alert(
        "Verified",
        "OTP verified. You can now comment."
      );
    } catch (e) {
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ---------------- COMMENT ACTION ---------------- */

  const submitComment = async () => {
    if (!commentText.trim()) return;

    if (!isLoggedIn && !otpVerified) {
      Alert.alert(
        "Verification Required",
        "Please verify OTP before commenting"
      );
      return;
    }

    if (!isLoggedIn && !guestName.trim()) {
      Alert.alert("Required", "Please enter your name");
      return;
    }

    setPosting(true);

    try {
      if (isLoggedIn) {
        await client.post("/api/comments/", {
          article: id,
          content: commentText,
        });
      } else {
        await publicClient.post("/api/comments/", {
          article: id,
          content: commentText,
          guest_name: guestName.trim(),
          guest_mobile: guestMobile.trim(),
          verification_session_id: otpSessionId,
        });
      }

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
        alwaysBounceVertical
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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

        {/* COMMENTS HEADER */}
        <Text
          style={[
            styles.commentsHeader,
            { color: colors.text },
          ]}
        >
          Comments
        </Text>

        {/* -------- GUEST OTP BLOCK -------- */}
        {!isLoggedIn && !otpVerified && (
          <View
            style={[
              styles.commentBox,
              { backgroundColor: colors.card },
            ]}
          >
            {/* ✅ ADDED: GUEST NAME */}
            <TextInput
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              value={guestName}
              onChangeText={setGuestName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
            />

            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Verify mobile number to comment
            </Text>

            <TextInput
              placeholder="Mobile number"
              placeholderTextColor={colors.muted}
              value={guestMobile}
              onChangeText={setGuestMobile}
              keyboardType="phone-pad"
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
            />

            {otpSent && (
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor={colors.muted}
                value={guestOtp}
                onChangeText={setGuestOtp}
                keyboardType="number-pad"
                maxLength={6}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />
            )}

            {!otpSent ? (
              <TouchableOpacity
                style={[
                  styles.postButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={requestGuestOtp}
                disabled={sendingOtp}
              >
                <Text style={styles.postText}>
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.postButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={verifyGuestOtp}
                disabled={verifyingOtp}
              >
                <Text style={styles.postText}>
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* COMMENT INPUT */}
        <View
          style={[
            styles.commentBox,
            {
              backgroundColor: colors.card,
              opacity: isLoggedIn || otpVerified ? 1 : 0.5,
            },
          ]}
        >
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor={colors.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            editable={isLoggedIn || otpVerified}
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
            disabled={posting || (!isLoggedIn && !otpVerified)}
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
                {c.user_name || c.guest_name || "Guest"}
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
