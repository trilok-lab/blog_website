// frontend/app/contact/index.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import client from "../../src/api/client";
import { showSnackbar } from "../../src/components/Snackbar";

export default function Contact() {
  const r = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      await client.post("/contact/submit/", { name, email, subject, message });
      showSnackbar("Message sent — we'll reply soon", "success");
      setTimeout(() => r.back(), 900);
    } catch (e) {
      console.log("contact send err", e);
      showSnackbar("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, marginBottom: 12 ,paddingHorizontal: 20, paddingTop: 50 }}>Contact Us</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, marginVertical: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, padding: 10, marginVertical: 8 }} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={{ borderWidth: 1, padding: 10, marginVertical: 8 }} />
      <TextInput placeholder="Message" value={message} onChangeText={setMessage} multiline style={{ borderWidth: 1, padding: 10, marginVertical: 8, height: 140 }} />

      <TouchableOpacity onPress={send} style={{ backgroundColor: "#117be4ff", padding: 14, borderRadius: 100, alignItems: "center", marginTop: 8 }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white" }}>Send</Text>}
      </TouchableOpacity>
    </View>
  );
}
