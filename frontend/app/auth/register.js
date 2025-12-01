import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../../src/api/client";

export default function Register() {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [sessionId, setSessionId] = useState(""); // phone verification session id
  const [loading, setLoading] = useState(false);

  const doRegister = async () => {
    setLoading(true);
    try {
      const res = await client.post("/auth/register/", {
        username,
        password: pass,
        password2: pass2,
        email,
        mobile_no: mobile,
        verification_session_id: sessionId || null,
      });
      Alert.alert("Registered", "Account created");
    } catch (err) {
      console.log(err);
      const message = err.response?.data || { detail: "Registration failed" };
      Alert.alert("Error", JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Mobile (with country code)" style={styles.input} value={mobile} onChangeText={setMobile} />
      <TextInput placeholder="Email (optional)" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={pass} onChangeText={setPass} />
      <TextInput placeholder="Confirm password" secureTextEntry style={styles.input} value={pass2} onChangeText={setPass2} />
      <TextInput placeholder="Verification session id (guests only)" style={styles.input} value={sessionId} onChangeText={setSessionId} />

      <TouchableOpacity style={styles.btn} onPress={doRegister} disabled={loading}>
        <Text style={styles.btntxt}>{loading ? "Please wait…" : "Create account"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
