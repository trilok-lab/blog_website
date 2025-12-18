// frontend/app/auth/login.js
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

import { loginUser } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    if (!username || !password) {
      return Alert.alert("Error", "Enter username and password");
    }

    try {
      const res = await loginUser({ username, password });

      await saveTokens({
        access: res.access,
        refresh: res.refresh,
      });

      router.replace("/menu");
    } catch (err) {
      Alert.alert("Login failed", "Invalid credentials");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Username or Email"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <Pressable style={styles.primaryBtn} onPress={onLogin}>
          <Text style={styles.primaryText}>Login</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.socialBtn}
          onPress={() => router.push("/auth/social?provider=google")}
        >
          <Text style={styles.socialText}>Continue with Google</Text>
        </Pressable>

        <Pressable
          style={[styles.socialBtn, styles.fb]}
          onPress={() => router.push("/auth/social?provider=facebook")}
        >
          <Text style={[styles.socialText, { color: "#fff" }]}>
            Continue with Facebook
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/auth/otp-request")}>
          <Text style={styles.link}>Create an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderColor: "#dee2e6",
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: "#0d6efd",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#dee2e6", marginVertical: 16 },
  socialBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    marginBottom: 10,
  },
  fb: { backgroundColor: "#1877f2", borderColor: "#1877f2" },
  socialText: { fontWeight: "600" },
  link: { marginTop: 10, color: "#0d6efd", textAlign: "center" },
});
