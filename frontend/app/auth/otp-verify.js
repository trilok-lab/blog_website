import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyPhoneCode } from "../../src/api/auth";

export default function OTPVerify() {
  const router = useRouter();
  const { session_id, mobile_no } = useLocalSearchParams();

  const [code, setCode] = useState("");

  async function onVerify() {
    if (!code) return Alert.alert("Error", "Enter OTP code");

    try {
      const res = await verifyPhoneCode(session_id, code);

      if (res.verified) {
        router.replace({
          pathname: "/auth/register",
          params: {
            verification_session_id: session_id,
            mobile_no,
          },
        });
      } else {
        Alert.alert("Error", "Verification failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to verify OTP");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Enter OTP</Text>
      <Text>Code sent to {mobile_no}</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        style={{ borderWidth: 1, padding: 10, marginVertical: 12 }}
      />

      <Pressable onPress={onVerify} style={{ backgroundColor: "#198754", padding: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Verify</Text>
      </Pressable>
    </View>
  );
}
