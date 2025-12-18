// frontend/app/payments/status.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPayment } from "../../src/api/payments";

export default function PaymentStatus() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const POLL_INTERVAL = 2000;

  async function fetchStatus() {
    try {
      const res = await getPayment(id);
      const data = res.data || {};
      const s = data.status || data.payment_status || null;
      setStatus(s);
      if (s === "paid" || s === "completed" || s === "success") {
        clearInterval(pollRef.current);
        Alert.alert("Payment successful", "Thank you — payment completed.", [{ text: "OK", onPress: () => router.back() }]);
      } else if (s === "failed" || s === "cancelled") {
        clearInterval(pollRef.current);
        Alert.alert("Payment failed", "Payment failed or was cancelled.");
      }
    } catch (e) {
      console.log("getPayment error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      Alert.alert("Missing payment id", "No payment id provided.");
      return;
    }
    fetchStatus();
    pollRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Payment Status</Text>
      {loading ? <ActivityIndicator size="large" /> : (
        <>
          <Text style={{ marginBottom: 8 }}>Payment ID: {id}</Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Status: {status || "unknown"}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); fetchStatus(); }} style={{ backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, marginTop: 8 }}>
            <Text style={{ color: "white" }}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={{ color: "#1E90FF" }}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
