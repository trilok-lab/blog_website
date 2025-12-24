import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { loginUser } from "../../src/api/auth";
import { saveTokens } from "../../src/utils/token";

export default function Welcome() {
  const r = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const login = async () => {
    const res = await loginUser({ username: u, password: p });
    await saveTokens(res);
    r.replace("/menu");
  };

  return (
    <View style={{ padding: 24, justifyContent: "center", flex: 1 }}>
      <Text style={{ fontSize: 32, textAlign: "center", marginBottom: 20 }}>
        Welcome
      </Text>

      <TextInput placeholder="Username / Email" value={u} onChangeText={setU}
        style={{ borderWidth: 1, padding: 12, marginBottom: 10 }} />

      <TextInput placeholder="Password" secureTextEntry value={p} onChangeText={setP}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16 }} />

      <TouchableOpacity onPress={login}
        style={{ backgroundColor: "#1E90FF", padding: 14, marginBottom: 10 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => r.push("/auth/register")}
        style={{ borderWidth: 1, padding: 14, marginBottom: 20 }}>
        <Text style={{ textAlign: "center" }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => r.push("/auth/social?provider=google")}
        style={{ padding: 14, backgroundColor: "#eee", marginBottom: 10 }}>
        <Text style={{ textAlign: "center" }}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => r.push("/auth/social?provider=facebook")}
        style={{ padding: 14, backgroundColor: "#eee" }}>
        <Text style={{ textAlign: "center" }}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}
