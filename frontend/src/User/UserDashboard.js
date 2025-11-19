import React from "react";
import { View, Text, Button } from "react-native";

export default function UserDashboard({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>User Dashboard</Text>

      <Button title="My Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Settings" onPress={() => navigation.navigate("Settings")} />
      <Button title="Create Article" onPress={() => navigation.navigate("CreateArticle")} />
      <Button title="View Articles" onPress={() => navigation.navigate("Articles")} />
    </View>
  );
}
