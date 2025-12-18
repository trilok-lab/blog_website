// frontend/app/payments/start.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { startPayment } from "../../src/api/payments";

export default function StartPayment() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onStart = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("Invalid amount", "Please enter a numeric amount.");
      return;
    }

    setLoading(true);
    try {
      const amountCents = Math.round(Number(amount) * 100);
      const payload = { amount_cents: amountCents, description: description || `Payment of ${amount}` };
      const res = await startPayment(payload);
      const data = res.data || {};
      const paymentId = data.id || data.payment_id || null;
      const checkoutUrl = data.checkout_url || data.payment_url || data.url || null;

      if (!paymentId) {
        Alert.alert("Error", "Payment id not returned by backend.");
        setLoading(false);
        return;
      }

      if (checkoutUrl) {
        Linking.openURL(checkoutUrl).catch(err => console.log("Link open error", err));
      } else {
        Alert.alert("Payment started", "Proceeding to payment status...");
      }

      router.push({ pathname: "/payments/status", params: { id: paymentId } });
    } catch (e) {
      console.log("startPayment error", e);
      const msg = e.response?.data?.detail || e.response?.data?.error || e.message || "Could not start payment. Check backend/tunnel.";
      Alert.alert("Payment error", String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Start Payment</Text>

      <Text style={{ marginBottom: 6 }}>Amount (units)</Text>
      <TextInput placeholder="e.g. 1.99" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 12 }} />

      <Text style={{ marginBottom: 6 }}>Description (optional)</Text>
      <TextInput placeholder="Payment for article submission" value={description} onChangeText={setDescription} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 18 }} />

      {loading ? <ActivityIndicator /> : (
        <>
          <TouchableOpacity onPress={onStart} style={{ backgroundColor: "#1E90FF", padding: 14, borderRadius: 8 }}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Start Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={{ color: "#1E90FF", textAlign: "center" }}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
