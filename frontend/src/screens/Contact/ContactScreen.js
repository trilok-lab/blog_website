import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { submitContact } from "../../api";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      await submitContact({ name, email, message });
      Alert.alert("Success", "Message sent!");
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} />
      
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} />

      <Text>Message</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button title="Send Message" onPress={handleSubmit} />
    </View>
  );
}
