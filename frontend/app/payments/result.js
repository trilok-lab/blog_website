// frontend/app/payments/result.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { checkPayment } from "../../src/api/payments";

export default function PaymentResult() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    checkPayment(id)
      .then(res => setStatus(res.data))
      .catch(e => {
        console.log("check payment", e.response?.data || e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Payment status</Text>
      <Text style={{ marginTop: 12 }}>{JSON.stringify(status)}</Text>
      <TouchableOpacity onPress={() => router.push("/menu")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#1E90FF" }}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
