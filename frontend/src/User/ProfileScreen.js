import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>My Profile</Text>
      <Text>Name: Demo User</Text>
      <Text>Email: demo@example.com</Text>
    </View>
  );
}
