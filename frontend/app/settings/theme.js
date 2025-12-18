// frontend/app/settings/theme.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../src/theme/theme";

export default function ThemeSettings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 28, marginBottom: 20, color: theme.text }}>Theme Settings</Text>
      <TouchableOpacity onPress={toggleTheme} style={{ backgroundColor: theme.primary, padding: 16, borderRadius: 10 }}>
        <Text style={{ color: "white", fontSize: 18 }}>Switch mode</Text>
      </TouchableOpacity>
    </View>
  );
}
