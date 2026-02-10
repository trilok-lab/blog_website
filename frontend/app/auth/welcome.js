// frontend/app/auth/welcome.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { loginUser } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Welcome() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!username || !password) {
      return Alert.alert("Error", "Enter username and password");
    }

    try {
      setLoading(true);
      const res = await loginUser({ username, password });
      await saveTokens(res);
      router.replace("/menu");
    } catch {
      Alert.alert("Login failed", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* CARD */}
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={login}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.secondaryText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => router.push("/auth/social?provider=google")}
        >
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialBtn, styles.fb]}
          onPress={() => router.push("/auth/social?provider=facebook")}
        >
          <Text style={[styles.socialText, { color: "#fff" }]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    color: "#6c757d",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 18,
  },
  secondaryBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    marginBottom: 14,
  },
  secondaryText: {
    textAlign: "center",
    fontWeight: "600",
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
  disabled: {
    opacity: 0.6,
  },
});
