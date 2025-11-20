import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged out successfully");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center", padding: 20 }, title: { fontSize: 24, marginBottom: 20, textAlign: "center" } });
