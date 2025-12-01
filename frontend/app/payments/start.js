import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";

export default function StartPayment() {
  const [amount, setAmount] = useState("199"); // cents by default
  const [currency, setCurrency] = useState("usd");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    try {
      const res = await client.post("/api/payments/checkout-session/", { amount: Number(amount), currency, article_title: title });
      // res contains { payment_id, session_id, url }
      Alert.alert("Checkout", "Open checkout url in browser on device");
      // Open url using Linking
      const { url } = res.data;
      if (url) {
        // Try open in-device browser
        const Linking = require("react-native").Linking;
        Linking.openURL(url);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Payment</Text>
      <TextInput placeholder="Amount in cents (e.g. 199)" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <TextInput placeholder="Currency" style={styles.input} value={currency} onChangeText={setCurrency} />
      <TextInput placeholder="Article title (optional)" style={styles.input} value={title} onChangeText={setTitle} />
      <TouchableOpacity style={styles.btn} onPress={start} disabled={loading}>
        <Text style={styles.btntxt}>Create Checkout Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#D32F2F", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
