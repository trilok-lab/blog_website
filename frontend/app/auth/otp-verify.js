// frontend/app/auth/otp-verify.js

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

import { verifyPhoneCode, requestPhoneCode } from "../../src/api/auth";

export default function OtpVerify() {
  const router = useRouter();
  const { session_id, mobile_no } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  /* ---------------- ROUTE GUARD (SAFE) ---------------- */
  useEffect(() => {
    if (!session_id || !mobile_no) {
      router.replace("/auth/otp-request");
    }
  }, [session_id, mobile_no]);

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (otp.trim().length !== 6) {
      Alert.alert("Invalid OTP", "Enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyPhoneCode(session_id, otp.trim());

      router.push({
        pathname: "/auth/register",
        params: { session_id, mobile_no },
      });
    } catch (err) {
      Alert.alert("Error", err?.body?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    try {
      setResending(true);
      await requestPhoneCode(mobile_no);
      Alert.alert("OTP Sent", "New OTP has been sent");
    } catch {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setResending(false);
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
        <Text style={styles.step}>Step 2 of 3</Text>

        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>Sent to {mobile_no}</Text>

        <TextInput
          placeholder="6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={verifyOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resendOtp} disabled={resending}>
          <Text style={styles.link}>
            {resending ? "Resending..." : "Resend OTP"}
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
    textAlign: "center",
    color: "#6C757D",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  link: {
    textAlign: "center",
    color: "#1E90FF",
    fontWeight: "600",
  },
});
