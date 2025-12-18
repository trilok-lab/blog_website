// frontend/app/_layout.js
import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Snackbar from "../src/components/Snackbar";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* AUTH SCREENS */}
        <Stack.Screen name="auth/otp-request" />
        <Stack.Screen name="auth/otp-verify" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/social" />

        {/* MAIN APP */}
        <Stack.Screen name="home" />
      </Stack>

      {/* Global Snackbar Overlay */}
      <Snackbar />
    </View>
  );
}
