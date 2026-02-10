// frontend/app/auth/login.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { loginUser } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!username || !password) {
      return Alert.alert("Error", "Enter username and password");
    }

    try {
      setLoading(true);

      const res = await loginUser({ username, password });

      await saveTokens({
        access: res.access,
        refresh: res.refresh,
      });

      router.replace("/menu");
    } catch {
      Alert.alert("Login failed", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Username or Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
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

        <Pressable onPress={() => router.push("/auth/register")}>
          <Text style={styles.link}>Create an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: "#0d6efd",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 18,
  },
  socialBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    marginBottom: 10,
  },
  fb: {
    backgroundColor: "#1877f2",
    borderColor: "#1877f2",
  },
  socialText: {
    fontWeight: "600",
  },
  link: {
    marginTop: 14,
    color: "#0d6efd",
    textAlign: "center",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
