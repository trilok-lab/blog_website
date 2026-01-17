// frontend/src/components/AppLayout.js

import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const HEADER_HEIGHT = 68;

export default function AppLayout({ children }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* FIXED APP HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.appName, { color: colors.text }]}>
          Trilok Blog App
        </Text>
      </View>

      {/* SCREEN CONTENT */}
      <View
        style={{
          flex: 1,
          paddingTop: HEADER_HEIGHT,
          backgroundColor: colors.background,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: Platform.OS === "android" ? 30 : 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    borderBottomWidth: 5,
  },
  appName: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
