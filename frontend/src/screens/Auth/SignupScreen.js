import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { registerUser } from "../../api";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!username || !email || !mobileNo || !password)
      return Alert.alert("Error", "Fill all fields");
    try {
      await registerUser({ username, email, mobile_no: mobileNo, password });
      Alert.alert("Success", "Account created!", [{ text: "OK", onPress: () => navigation.navigate("Login") }]);
    } catch (err) {
      Alert.alert("Signup Failed", err.response?.data?.detail || "Error");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Mobile No</Text>
      <TextInput value={mobileNo} onChangeText={setMobileNo} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Password</Text>
      <TextInput value={password} secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Signup" onPress={signup} />
    </View>
  );
}
