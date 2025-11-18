import React from "react";
import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Settings</Text>
      <Text>Theme: Light</Text>
      <Text>Notifications: Enabled</Text>
    </View>
  );
}
