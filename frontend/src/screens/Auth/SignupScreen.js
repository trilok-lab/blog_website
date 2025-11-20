import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { signupUser } from "../../api";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signupUser({ email, password, mobile_no: mobile });
      Alert.alert("Signup successful! Verify OTP sent to mobile.");
      navigation.navigate("OTPVerification", { email });
    } catch (error) {
      console.error(error);
      Alert.alert("Signup Failed", error.response?.data || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Mobile Number" value={mobile} onChangeText={setMobile} style={styles.input} keyboardType="phone-pad" />
      <Button title={loading ? "Signing up..." : "Sign Up"} onPress={handleSignup} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});
