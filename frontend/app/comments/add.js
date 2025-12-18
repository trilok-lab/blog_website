// frontend/app/comments/add.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import client from "../../src/api/client";
import { useAuthStore } from "../../src/store/authStore";
import { showSnackbar } from "../../src/components/Snackbar";

export default function AddComment() {
  const { id } = useLocalSearchParams(); // article id
  const router = useRouter();
  const auth = useAuthStore();

  const [guestName, setGuestName] = useState("");
  const [guestMobile, setGuestMobile] = useState("");
  const [sessionId, setSessionId] = useState(""); // OTP session id
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    if (!auth?.user) {
      if (!guestName || !guestMobile || !sessionId) {
        Alert.alert("Error", "Guest must fill all fields including OTP session.");
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
      showSnackbar("Comment submitted (may require admin approval)", "success");
      setTimeout(() => router.back(), 500);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.response?.data?.detail || "Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 40 , paddingHorizontal: 10, paddingTop: 50}}> Add Comment</Text>
      {!auth?.user && (
        <>
          <TextInput placeholder="Your Name" value={guestName} onChangeText={setGuestName} style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }} />
          <TextInput placeholder="Mobile Number" keyboardType="number-pad" value={guestMobile} onChangeText={setGuestMobile} style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }} />
          <TextInput placeholder="OTP Verification Session ID" value={sessionId} onChangeText={setSessionId} style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }} />
        </>
      )}

      <TextInput placeholder="Write your comment..." value={content} onChangeText={setContent} multiline style={{ borderWidth: 1, padding: 12, borderRadius: 10, height: 120, textAlignVertical: "top" }} />

      <TouchableOpacity onPress={submit} disabled={loading} style={{ backgroundColor: "#1E90FF", padding: 14, borderRadius: 8, marginTop: 16 }}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>Submit</Text>}
      </TouchableOpacity>
    </View>
  );
}
