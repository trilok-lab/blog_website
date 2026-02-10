// frontend/app/auth/register.js

import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import {
  requestPhoneCode,
  verifyPhoneCode,
  registerUser,
  loginUser,
} from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Register() {
  const router = useRouter();

  /* ---------- PHONE ---------- */
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ---------- ACCOUNT ---------- */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registering, setRegistering] = useState(false);

  /* ---------- STEP ---------- */
  const step = verified ? 3 : sessionId ? 2 : 1;

  /* ---------- OTP ---------- */
  const sendOtp = async () => {
    if (!mobile.trim()) return Alert.alert("Error", "Enter mobile number");

    try {
      setVerifying(true);
      const res = await requestPhoneCode(mobile.trim());
      setSessionId(res.session_id);
      Alert.alert("OTP Sent", "Check WhatsApp for OTP");
    } catch {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setVerifying(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setVerifying(true);
      await verifyPhoneCode({ session_id: sessionId, code: otp });
      setVerified(true);
      Alert.alert("Verified", "Phone number verified");
    } catch {
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  /* ---------- REGISTER ---------- */
  const register = async () => {
    if (password !== password2) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      setRegistering(true);

      await registerUser({
        username,
        email,
        password,
        password2,
        mobile_no: mobile,
        verification_session_id: sessionId,
      });

      const res = await loginUser({ username, password });
      await saveTokens(res);

      router.replace("/menu");
    } catch {
      Alert.alert("Registration failed", "Unable to create account");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.screen}>
        {/* HEADER */}
        <Text style={[styles.heading , { paddingTop: 30, paddingBottom: 25 }]}>Create Account</Text>
        <Text style={styles.stepText}>Step {step} of 3</Text>

        {/* STEP 1 / 2 */}
        {!verified && (
          <>
            <TextInput
              placeholder="+91XXXXXXXXXX"
              value={mobile}
              onChangeText={setMobile}
              style={styles.input}
            />

            {sessionId && (
              <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
              />
            )}

            <TouchableOpacity
              style={styles.grayBtn}
              onPress={sessionId ? verifyOtp : sendOtp}
            >
              {verifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  {sessionId ? "Verify OTP" : "Send OTP"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 */}
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TextInput
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TouchableOpacity
          style={[styles.submitBtn, (!verified || registering) && styles.disabled]}
          onPress={register}
          disabled={!verified || registering}
        >
          {registering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
  },
  stepText: {
    marginTop: 6,
    marginBottom: 24,
    color: "#6c757d",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  grayBtn: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#6c757d",
    marginBottom: 16,
  },
  submitBtn: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#28a745",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
