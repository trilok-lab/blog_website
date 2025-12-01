import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";
import { AuthContext } from "../../src/context/AuthContext";
import { useSearchParams } from "expo-router";

export default function AddComment() {
  const { articleId } = useSearchParams();
  const { user } = useContext(AuthContext);
  const [guestName, setGuestName] = useState("");
  const [guestMobile, setGuestMobile] = useState("");
  const [content, setContent] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = { article: articleId, content };
      if (!user) {
        // guest requires verification_session_id
        payload.verification_session_id = sessionId;
        payload.guest_name = guestName;
        payload.guest_mobile = guestMobile;
      }
      await client.post("/api/comments/", payload);
      Alert.alert("OK", "Comment submitted (may require approval)");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Comment</Text>

      {!user && (
        <>
          <TextInput placeholder="Guest name" style={styles.input} value={guestName} onChangeText={setGuestName} />
          <TextInput placeholder="Guest mobile" style={styles.input} value={guestMobile} onChangeText={setGuestMobile} />
          <TextInput placeholder="verification_session_id" style={styles.input} value={sessionId} onChangeText={setSessionId} />
        </>
      )}

      <TextInput placeholder="Comment" multiline style={[styles.input, { height: 120 }]} value={content} onChangeText={setContent} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        <Text style={styles.btntxt}>Submit Comment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#1E88E5", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
