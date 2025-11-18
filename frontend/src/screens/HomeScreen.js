import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Welcome to the Blog App</Text>

      <Button title="Go to Dashboard" onPress={() => navigation.navigate("Dashboard")} />
      <Button title="View Articles" onPress={() => navigation.navigate("Articles")} />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
