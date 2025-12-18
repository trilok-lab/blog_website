// frontend/app/auth/register.js
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { registerUser } from "../../src/api/auth";

export default function Register() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const mobile_no = params.mobile_no;
  const verification_session_id = params.verification_session_id;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onRegister() {
    if (!username || !password) {
      return Alert.alert("Error", "All fields required");
    }

    try {
      await registerUser({
        username,
        password,
        mobile_no,
        verification_session_id,
      });

      Alert.alert("Success", "Account created", [
        { text: "OK", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Registration failed");
    }
  }

  return (
    <View style={{ padding: 20, paddingTop: 50 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Register</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Pressable
        onPress={onRegister}
        style={{
          backgroundColor: "#1E90FF",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          Create Account
        </Text>
      </Pressable>
    </View>
  );
}
