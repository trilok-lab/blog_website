// frontend/src/components/CommentItem.js
import React from "react";
import { View, Text } from "react-native";

export default function CommentItem({ comment }) {
  const author = comment.user_name || comment.guest_name || "Anonymous";
  const initials = (author || "A").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <View style={{ flexDirection: "row", marginVertical: 8 }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
        <Text style={{ fontWeight: "700" }}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "700" }}>{author}</Text>
          <Text style={{ color: "#888", fontSize: 12 }}>{new Date(comment.created_at).toLocaleString?.() || comment.created_at}</Text>
        </View>
        <Text style={{ marginTop: 6 }}>{comment.content}</Text>
      </View>
    </View>
  );
}
