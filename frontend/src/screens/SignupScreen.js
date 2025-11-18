import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { api } from "../api/client";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    await api.post("/auth/register/", {
      email,
      password,
    });

    navigation.navigate("Login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Signup" onPress={signup} />
    </View>
  );
}
