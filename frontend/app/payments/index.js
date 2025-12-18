// frontend/app/payments/index.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { startPayment } from "../../src/api/payments";
import { showSnackbar } from "../../src/components/Snackbar";

export default function Payments() {
  const [loading, setLoading] = useState(false);

  const doStart = async () => {
    setLoading(true);
    try {
      const res = await startPayment();
      showSnackbar("Payment started (check server)", "success");
      console.log("payment start res", res.data);
    } catch (e) {
      console.log("payment err", e);
      showSnackbar("Payment failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, marginBottom: 12 ,paddingHorizontal: 20, paddingTop: 50 }}>Payments</Text>
      <TouchableOpacity onPress={doStart} style={{ backgroundColor: "#1E90FF", padding: 12, borderRadius: 8 }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Start Payment</Text>}
      </TouchableOpacity>
    </View>
  );
}
