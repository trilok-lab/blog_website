import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../../src/theme/ThemeContext";

export default function ThemePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
      }}
    >
      <Text
        style={{
          fontSize: 22,
          color: theme === "dark" ? "#FFFFFF" : "#000000",
          marginBottom: 20,
        }}
      >
        Theme Settings
      </Text>

      <Text style={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>
        Current theme: {theme.toUpperCase()}
      </Text>

      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}
