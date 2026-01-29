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
import AppShell from "../../src/components/AppShell";

export default function Contact() {
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!name || !email || !subject || !message) {
      showSnackbar("All fields are required", "error");
      return;
    }

    setLoading(true);
    try {
      await client.post("/api/contact/submit/", {
        name,
        email,
        subject,
        message,
      });

      showSnackbar("Message sent — we'll reply soon", "success");
      setTimeout(() => router.back(), 900);
    } catch (err) {
      showSnackbar("Failed to send message", "error");
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
    <AppShell title="Contact Us">
      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
          style={[styles.input, themedInput]}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, themedInput]}
        />

        <TextInput
          placeholder="Subject"
          placeholderTextColor={colors.muted}
          value={subject}
          onChangeText={setSubject}
          style={[styles.input, themedInput]}
        />

        <TextInput
          placeholder="Message"
          placeholderTextColor={colors.muted}
          value={message}
          onChangeText={setMessage}
          multiline
          style={[styles.input, themedInput, styles.messageBox]}
        />

        <TouchableOpacity
          onPress={send}
          style={[styles.btn, { backgroundColor: colors.primary }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  form: {
    paddingBottom: 40,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
  },

  messageBox: {
    height: 140,
    textAlignVertical: "top",
  },

  btn: {
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 16,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
