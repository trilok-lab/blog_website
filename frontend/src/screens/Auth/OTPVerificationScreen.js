import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { verifyOTP } from "../../api";

export default function OTPVerificationScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOTP({ email, otp });
      Alert.alert("Mobile verified! You can login now.");
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Verification Failed", error.response?.data || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter OTP sent to your mobile</Text>
      <TextInput
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title={loading ? "Verifying..." : "Verify"} onPress={handleVerify} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});
