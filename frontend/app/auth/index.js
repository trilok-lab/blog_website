// frontend/app/auth/index.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function AuthLanding() {
  const router = useRouter();

  const AuthButton = ({ label, onPress, secondary = false }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.buttonSecondary,
      ]}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.buttonTextSecondary,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Choose how you want to continue
        </Text>

        <View style={styles.buttonGroup}>
          <AuthButton
            label="Login"
            onPress={() => router.push("/auth/login")}
          />

          <AuthButton
            label="Register"
            onPress={() => router.push("/auth/otp-request")}
          />

          <AuthButton
            label="Phone Verification"
            onPress={() => router.push("/auth/otp-request")}
            secondary
          />

          <AuthButton
            label="Continue with Google / Facebook"
            onPress={() => router.push("/auth/social")}
            secondary
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 36,
  },
  buttonGroup: {
    gap: 14,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#111827",
  },
});
