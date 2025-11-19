import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { verifyPhoneCode } from "../../api";

export default function OTPVerificationScreen({ route, navigation }) {
  const { session_id } = route.params;
  const [code, setCode] = useState("");

  const verifyOTP = async () => {
    if (!code) return Alert.alert("Error", "Enter OTP code");
    try {
      await verifyPhoneCode(session_id, code);
      Alert.alert("Success", "Phone verified!", [
        { text: "OK", onPress: () => navigation.navigate("Signup") },
      ]);
    } catch (err) {
      Alert.alert("Verification Failed", err.response?.data?.detail || "Invalid code");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP sent to your phone</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Verify OTP" onPress={verifyOTP} />
    </View>
  );
}
