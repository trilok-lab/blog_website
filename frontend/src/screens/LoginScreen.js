import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { loginUser } from "../api/client";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    await loginUser(email, password);
    navigation.navigate("Articles");
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

      <Button title="Login" onPress={login} />

      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate("Signup")}
      />
    </View>
  );
}
