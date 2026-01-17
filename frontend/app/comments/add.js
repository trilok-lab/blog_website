// frontend/app/comments/add.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import client from "../../src/api/client";
import { useAuthStore } from "../../src/store/authStore";
import { showSnackbar } from "../../src/components/Snackbar";
import { useTheme } from "../../src/theme/ThemeContext";

export default function AddComment() {
  const { id } = useLocalSearchParams(); // article id
  const router = useRouter();
  const auth = useAuthStore();
  const { colors } = useTheme();

  const [guestName, setGuestName] = useState("");
  const [guestMobile, setGuestMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- SUBMIT ---------------- */

  const submit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    if (!auth?.user) {
      if (!guestName || !guestMobile || !sessionId) {
        Alert.alert(
          "Error",
          "Guest must fill all fields including OTP session."
        );
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { article: id, content };

      if (!auth?.user) {
        payload.guest_name = guestName;
        payload.guest_mobile = guestMobile;
        payload.verification_session_id = sessionId;
      }

      await client.post("/comments/", payload);
      showSnackbar(
        "Comment submitted (may require admin approval)",
        "success"
      );
      setTimeout(() => router.back(), 500);
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Error",
        e.response?.data?.detail || "Failed to submit comment"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Add Comment
      </Text>

      {!auth?.user && (
        <>
          <TextInput
            placeholder="Your Name"
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

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            value={guestMobile}
            onChangeText={setGuestMobile}
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
            placeholder="OTP Verification Session ID"
            placeholderTextColor={colors.muted}
            value={sessionId}
            onChangeText={setSessionId}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />
        </>
      )}

      <TextInput
        placeholder="Write your comment..."
        placeholderTextColor={colors.muted}
        value={content}
        onChangeText={setContent}
        multiline
        style={[
          styles.commentBox,
          {
            backgroundColor: colors.inputBg,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
      />

      <TouchableOpacity
        onPress={submit}
        disabled={loading}
        style={[
          styles.submitBtn,
          { backgroundColor: colors.primary },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    paddingTop: 50,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
  },

  commentBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
  },

  submitBtn: {
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },

  submitText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
