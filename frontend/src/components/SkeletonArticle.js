// frontend/src/components/SkeletonArticle.js
import React from "react";
import { View } from "react-native";

export default function SkeletonArticle({ style }) {
  return (
    <View style={[{ padding: 14, backgroundColor: "#f6f7fb", borderRadius: 10, marginBottom: 12 }, style]}>
      <View style={{ height: 18, width: "60%", backgroundColor: "#e8eaf0", borderRadius: 6, marginBottom: 8 }} />
      <View style={{ height: 12, width: "40%", backgroundColor: "#e8eaf0", borderRadius: 6, marginBottom: 10 }} />
      <View style={{ height: 10, width: "90%", backgroundColor: "#e8eaf0", borderRadius: 6 }} />
    </View>
  );
}
