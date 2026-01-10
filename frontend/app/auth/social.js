// frontend/app/auth/social.js

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useRouter, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";

import { socialLogin } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

WebBrowser.maybeCompleteAuthSession();

export default function SocialAuth() {
  const router = useRouter();
  const { provider } = useLocalSearchParams();
  const triggeredRef = useRef(false);

  const FACEBOOK_APP_ID =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FACEBOOK_APP_ID;

  // ✅ REQUIRED FOR FACEBOOK (Expo Go)
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  // ---------- GOOGLE ----------
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      expoClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      androidClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      iosClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
      webClientId:
        "993534453505-rds2dij88nvld0fvjr15jpj9dgehf4ir.apps.googleusercontent.com",
    });

  // ---------- FACEBOOK ----------
  const [fbRequest, fbResponse, fbPromptAsync] =
    Facebook.useAuthRequest({
      clientId: FACEBOOK_APP_ID,
      redirectUri,              // ✅ FIX
      responseType: "token",    // ✅ REQUIRED
    });

  // ---------- TRIGGER ONCE ----------
  useEffect(() => {
    if (triggeredRef.current) return;

    if (provider === "google" && googleRequest) {
      triggeredRef.current = true;
      googlePromptAsync();
    }

    if (provider === "facebook" && fbRequest) {
      triggeredRef.current = true;
      fbPromptAsync();
    }
  }, [provider, googleRequest, fbRequest]);

  // ---------- GOOGLE RESPONSE ----------
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const token = googleResponse.authentication?.accessToken;
      if (token) handleSocialLogin("google", token);
    }
  }, [googleResponse]);

  // ---------- FACEBOOK RESPONSE ----------
  useEffect(() => {
    if (fbResponse?.type === "success") {
      const token = fbResponse.authentication?.accessToken;
      if (token) handleSocialLogin("facebook", token);
    }
  }, [fbResponse]);

  // ---------- COMMON ----------
  async function handleSocialLogin(provider, token) {
    try {
      const res = await socialLogin(provider, token);

      await saveTokens({
        access: res.access,
        refresh: res.refresh,
      });

      router.replace("/menu");
    } catch (err) {
      console.error(err);
      Alert.alert("Login failed", "Social login failed");
      router.replace("/auth/login");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Redirecting to {provider}…
      </Text>
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
