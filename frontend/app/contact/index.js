// frontend/app/contact/index.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";
import { useTheme } from "../../src/theme/ThemeContext";

export default function Contact() {
  const r = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      await client.post("/contact/submit/", {
        name,
        email,
        subject,
        message,
      });
      showSnackbar("Message sent — we'll reply soon", "success");
      setTimeout(() => r.back(), 900);
    } catch {
      showSnackbar("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const themedInput = {
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderColor: colors.border,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Contact Us</Text>

      {[
        ["Name", name, setName],
        ["Email", email, setEmail],
        ["Subject", subject, setSubject],
      ].map(([p, v, s], i) => (
        <TextInput
          key={i}
          placeholder={p}
          placeholderTextColor={colors.muted}
          value={v}
          onChangeText={s}
          style={[styles.input, themedInput]}
        />
      ))}

      <TextInput
        placeholder="Message"
        placeholderTextColor={colors.muted}
        value={message}
        onChangeText={setMessage}
        multiline
        style={[styles.input, themedInput, { height: 140 }]}
      />

      <TouchableOpacity
        onPress={send}
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, marginBottom: 20, paddingTop: 50 },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 8 },
  btn: { padding: 14, borderRadius: 100, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
});
