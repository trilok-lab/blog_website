import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/client";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({ username: "", email: "", mobile_no: "" });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile/");
      setProfile(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      await api.put("/auth/profile/update/", profile);
      Alert.alert("Success", "Profile updated");
    } catch (err) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput value={profile.username} onChangeText={(v) => setProfile({ ...profile, username: v })} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Email</Text>
      <TextInput value={profile.email} onChangeText={(v) => setProfile({ ...profile, email: v })} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Mobile No</Text>
      <TextInput value={profile.mobile_no} onChangeText={(v) => setProfile({ ...profile, mobile_no: v })} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}
