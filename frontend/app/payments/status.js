import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";

export default function PaymentStatus() {
  const [paymentId, setPaymentId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [result, setResult] = useState(null);

  const check = async () => {
    try {
      const payload = {};
      if (paymentId) payload.payment_id = Number(paymentId);
      if (sessionId) payload.session_id = sessionId;
      const res = await client.post("/api/payments/verify/", payload);
      setResult(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.error || "Failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Payment</Text>
      <TextInput placeholder="Payment id" style={styles.input} value={paymentId} onChangeText={setPaymentId} keyboardType="numeric" />
      <TextInput placeholder="Stripe session id (cs_...)" style={styles.input} value={sessionId} onChangeText={setSessionId} />
      <TouchableOpacity style={styles.btn} onPress={check}>
        <Text style={styles.btntxt}>Verify</Text>
      </TouchableOpacity>

      {result ? (
        <View style={{ marginTop: 12 }}>
          <Text>Result:</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#D84315", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
