import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";

export default function VerifyOTP() {
  const [session, setSession] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    try {
      const res = await client.post("/auth/verify-phone-code/", { session_id: session, code });
      Alert.alert("Verified", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.detail || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone</Text>
      <TextInput placeholder="Session id" style={styles.input} value={session} onChangeText={setSession} />
      <TextInput placeholder="Code" style={styles.input} value={code} onChangeText={setCode} />
      <TouchableOpacity style={styles.btn} onPress={verify} disabled={loading}>
        <Text style={styles.btntxt}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#388E3C", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
