// frontend/app/auth/register.js

import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { registerUser, loginUser } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Register() {
  const router = useRouter();
  const { session_id, mobile_no } = useLocalSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- ROUTE GUARD (SAFE) ---------------- */
  useEffect(() => {
    if (!session_id || !mobile_no) {
      router.replace("/auth/otp-request");
    }
  }, [session_id, mobile_no]);

  const passwordStrength =
    password.length < 6 ? "Weak" :
    password.length < 10 ? "Medium" : "Strong";

  /* ---------------- REGISTER ---------------- */
  const register = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    if (password !== password2) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username,
        email,
        password,
        password2,
        mobile_no,
        verification_session_id: session_id,
      });

      // Auto login
      const res = await loginUser({ username, password });
      await saveTokens(res);

      router.replace("/menu");
    } catch (err) {
      Alert.alert(
        "Registration failed",
        err?.body?.detail || "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appName}>Trilok Blog App</Text>
        <Text style={styles.step}>Step 3 of 3</Text>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Mobile verified: {mobile_no}</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Text style={styles.strength}>
          Password strength: {passwordStrength}
        </Text>

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={register}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  step: {
    textAlign: "center",
    color: "#6C757D",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  strength: {
    fontSize: 13,
    color: "#6C757D",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28A745",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
