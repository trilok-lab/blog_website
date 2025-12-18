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
import { requestPhoneCode } from "../../src/api/auth";

export default function OtpRequest() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (!mobile || mobile.length < 10) {
      return Alert.alert("Invalid number", "Enter a valid mobile number");
    }

    try {
      setLoading(true);

      const formatted =
        mobile.startsWith("+") ? mobile : `+91${mobile}`;

      const res = await requestPhoneCode(formatted);

      if (!res?.session_id) {
        throw new Error("Invalid OTP response");
      }

      router.push({
        pathname: "/auth/otp-verify",
        params: {
          session_id: res.session_id,
          mobile_no: formatted,
        },
      });
    } catch (err) {
      console.error("OTP ERROR:", err);
      Alert.alert("Error", "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <Pressable
        style={[styles.btn, loading && styles.disabled]}
        onPress={sendOtp}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Sending..." : "Send OTP"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/auth/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  btn: {
    backgroundColor: "#117be4",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    color: "#117be4",
    textAlign: "center",
  },
});
