// frontend/app/auth/social.js
import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useRouter, useLocalSearchParams } from "expo-router";

import { socialLogin } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

WebBrowser.maybeCompleteAuthSession();

export default function SocialAuth() {
  const router = useRouter();
  const { provider } = useLocalSearchParams();

  // ---------------- GOOGLE ----------------
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      expoClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      iosClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      androidClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      webClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
    });

  // ---------------- FACEBOOK ----------------
  const [fbRequest, fbResponse, fbPromptAsync] =
    Facebook.useAuthRequest({
      clientId: "YOUR_FACEBOOK_APP_ID", // 🔴 REQUIRED
    });

  // ---------------- AUTO TRIGGER ----------------
  useEffect(() => {
    if (provider === "google") googlePromptAsync();
    if (provider === "facebook") fbPromptAsync();
  }, [provider]);

  // ---------------- GOOGLE RESPONSE ----------------
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const token = googleResponse.authentication?.accessToken;
      if (token) handleSocialLogin("google", token);
    }
  }, [googleResponse]);

  // ---------------- FACEBOOK RESPONSE ----------------
  useEffect(() => {
    if (fbResponse?.type === "success") {
      const token = fbResponse.authentication?.accessToken;
      if (token) handleSocialLogin("facebook", token);
    }
  }, [fbResponse]);

  // ---------------- COMMON HANDLER ----------------
  async function handleSocialLogin(provider, token) {
    try {
      const res = await socialLogin(provider, token);

      await saveTokens({
        access: res.access,
        refresh: res.refresh,
      });

      Alert.alert("Success", `Logged in with ${provider}`, [
        { text: "OK", onPress: () => router.replace("/menu") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Login failed",
        err?.body?.detail || "Social login failed"
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to {provider}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontSize: 16,
    color: "#495057",
  },
});
