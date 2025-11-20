import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getProfile, updateProfile } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await getProfile(token);
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await updateProfile(profile, token);
      Alert.alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Update failed");
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={profile.first_name} onChangeText={(text) => setProfile({ ...profile, first_name: text })} placeholder="First Name" />
      <TextInput style={styles.input} value={profile.last_name} onChangeText={(text) => setProfile({ ...profile, last_name: text })} placeholder="Last Name" />
      <TextInput style={styles.input} value={profile.email} editable={false} placeholder="Email" />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});
