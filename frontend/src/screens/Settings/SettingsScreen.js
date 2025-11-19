import React from "react";
import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged Out");
    navigation.navigate("Login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Settings</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
