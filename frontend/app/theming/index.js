import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../../src/theme/ThemeContext";

const HEADER_OFFSET = 30; // 🔧 tweak if needed

export default function ThemePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#FFFFFF" },
      ]}
    >
      {/* PAGE TITLE */}
      <Text
        style={[
          styles.pageTitle,
          { color: isDark ? "#FFFFFF" : "#000000" },
        ]}
      >
        Theme Settings
      </Text>

      {/* CURRENT THEME */}
      <Text
        style={[
          styles.label,
          { color: isDark ? "#CCCCCC" : "#333333" },
        ]}
      >
        Current theme: {theme.toUpperCase()}
      </Text>

      {/* TOGGLE */}
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        style={styles.switch}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: HEADER_OFFSET,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
  },

  switch: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
});
