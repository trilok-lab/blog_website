import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";

export default function RequestOTP() {
  const [mobile, setMobile] = useState("");
  const [session, setSession] = useState(null);
  const [debugOtp, setDebugOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async () => {
    setLoading(true);
    try {
      const res = await client.post("/auth/request-phone-code/", { mobile_no: mobile });
      setSession(res.data.session_id);
      if (res.data.debug_otp) setDebugOtp(res.data.debug_otp);
      Alert.alert("OTP requested", `session: ${res.data.session_id}`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.detail || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Phone Code</Text>
      <TextInput placeholder="+911234567890" style={styles.input} value={mobile} onChangeText={setMobile} />
      <TouchableOpacity style={styles.btn} onPress={request} disabled={loading}>
        <Text style={styles.btntxt}>Request</Text>
      </TouchableOpacity>
      {session ? <Text style={{ marginTop: 12 }}>Session ID: {session}</Text> : null}
      {debugOtp ? <Text style={{ marginTop: 6, color: "#d32f2f" }}>DEBUG OTP: {debugOtp}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#1976D2", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
