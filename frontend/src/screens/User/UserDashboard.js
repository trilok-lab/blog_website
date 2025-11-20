import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function UserDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, User!</Text>
      <Button title="Edit Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Submit Article" onPress={() => navigation.navigate("SubmitArticle")} />
      <Button title="Settings" onPress={() => navigation.navigate("Settings")} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center", padding: 20 }, title: { fontSize: 24, marginBottom: 20, textAlign: "center" } });
