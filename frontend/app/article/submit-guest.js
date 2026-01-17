// frontend/app/article/submit-guest.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";

import { submitArticle, getCategories } from "../../src/api/articles";
import { sendOTP, verifyOTP } from "../../src/api/otp";
import { startPayment } from "../../src/api/payments";
import { useTheme } from "../../src/theme/ThemeContext";

export default function SubmitGuestArticle() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);

  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    if (params?.session_id) setSessionId(params.session_id);
  }, [params]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data || []));
  }, []);

  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!r.canceled) setImage(r.assets[0]);
  };

  const toggleCategory = (id) => {
    setSelectedCats((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const themedInput = {
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderColor: colors.border,
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, padding: 20 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Guest Article Submission
      </Text>

      <TextInput placeholder="Mobile number" placeholderTextColor={colors.muted}
        value={mobile} onChangeText={setMobile}
        style={[styles.input, themedInput]} />

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() => sendOTP({ mobile_no: mobile }).then(() => Alert.alert("OTP sent"))}>
        <Text style={styles.btnText}>Send OTP</Text>
      </TouchableOpacity>

      <TextInput placeholder="OTP" placeholderTextColor={colors.muted}
        value={otp} onChangeText={setOTP}
        style={[styles.input, themedInput]} />

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.success }]}
        onPress={() => verifyOTP({ session_id: sessionId, code: otp })
          .then((r) => setSessionId(r.data.session_id))}>
        <Text style={styles.btnText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: "#222" }]}
        onPress={() => startPayment().then((r) => setPaymentId(r.data.id))}>
        <Text style={styles.btnText}>Start Payment</Text>
      </TouchableOpacity>

      {[
        ["Title", title, setTitle],
        ["Excerpt", excerpt, setExcerpt],
        ["Body", body, setBody],
      ].map(([p, v, s], i) => (
        <TextInput key={i} placeholder={p} placeholderTextColor={colors.muted}
          value={v} onChangeText={s} multiline={p === "Body"}
          style={[styles.input, themedInput, p === "Body" && { height: 160 }]} />
      ))}

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={pickImage}>
        <Text style={styles.btnText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <Text style={{ color: colors.text, fontSize: 18, marginVertical: 10 }}>
        Categories
      </Text>

      {categories.map((c) => (
        <TouchableOpacity key={c.id} onPress={() => toggleCategory(c.id)}
          style={[styles.cat, {
            backgroundColor: selectedCats.includes(c.id)
              ? colors.primary
              : colors.card,
          }]}>
          <Text style={{ color: selectedCats.includes(c.id) ? "#fff" : colors.text }}>
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.success, marginTop: 20 }]}
        onPress={() => submitArticle({})}
      >
        <Text style={styles.btnText}>Submit Article</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30, paddingTop: 40 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  btn: { padding: 12, borderRadius: 8, marginBottom: 10 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  image: { width: "100%", height: 200, marginBottom: 10 },
  cat: { padding: 10, borderRadius: 8, marginBottom: 6 },
});
