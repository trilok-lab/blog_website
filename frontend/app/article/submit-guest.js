// frontend/app/article/submit-guest.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

import { getCategories, submitArticle } from "../../src/api/articles";
import { startPayment, getMyPayments } from "../../src/api/payments";
import {
  requestPhoneCode,
  verifyPhoneCode,
} from "../../src/api/auth";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";

const PAYMENT_KEY = "guest_article_payment_id";

export default function SubmitGuestArticle() {
  const router = useRouter();
  const { colors } = useTheme();

  /* ---------- VERIFICATION ---------- */
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ---------- ARTICLE ---------- */
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);

  /* ---------- PAYMENT ---------- */
  const [paymentId, setPaymentId] = useState(null);
  const [paying, setPaying] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD CATEGORIES ---------- */
  useEffect(() => {
    getCategories().then((r) =>
      setCategories(r.data?.results || [])
    );
  }, []);

  /* ---------- IMAGE ---------- */
  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!r.canceled) setImage(r.assets[0]);
  };

  /* ---------- OTP ---------- */
  const sendOtp = async () => {
    if (!mobile.trim()) {
      return Alert.alert("Error", "Enter mobile number");
    }

    try {
      setVerifying(true);
      const res = await requestPhoneCode(mobile.trim());
      setSessionId(res.session_id);
      Alert.alert("OTP Sent", "Check WhatsApp for OTP");
    } catch (e) {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setVerifying(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !sessionId) return;

    try {
      setVerifying(true);
      await verifyPhoneCode({
        session_id: sessionId,
        code: otp,
      });
      setVerified(true);
      Alert.alert("Verified", "Phone number verified");
    } catch {
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  /* ---------- CATEGORIES ---------- */
  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------- PAYMENT ---------- */
  const startPay = async () => {
    if (!title || !body || !selectedCats.length) {
      return Alert.alert(
        "Incomplete",
        "Fill title, body and categories first"
      );
    }

    try {
      setPaying(true);
      const res = await startPayment({ article_title: title });
      const { payment_id, url } = res.data;

      await AsyncStorage.setItem(PAYMENT_KEY, String(payment_id));
      setPaymentId(payment_id);

      await Linking.openURL(url);
    } catch {
      Alert.alert("Payment error", "Unable to start payment");
    } finally {
      setPaying(false);
    }
  };

  const restorePayment = async () => {
    const stored = await AsyncStorage.getItem(PAYMENT_KEY);
    if (!stored) return;

    try {
      setCheckingPayment(true);
      const res = await getMyPayments();
      const p = (res.data || []).find(
        (x) => String(x.id) === String(stored)
      );

      if (p && p.status === "paid" && p.used === false) {
        setPaymentId(p.id);
      }
    } finally {
      setCheckingPayment(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      restorePayment();
    }, [])
  );

  /* ---------- SUBMIT ---------- */
  const submit = async () => {
    if (!verified || !paymentId) return;

    const fd = new FormData();
    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("body", body);
    fd.append("payment_id", paymentId);
    fd.append("verification_session_id", sessionId);

    selectedCats.forEach((id) =>
      fd.append("category_ids", id)
    );

    if (image) {
      fd.append("image", {
        uri: image.uri,
        name: "article.jpg",
        type: "image/jpeg",
      });
    }

    try {
      setSubmitting(true);
      await submitArticle(fd);
      await AsyncStorage.removeItem(PAYMENT_KEY);
      Alert.alert("Submitted", "Article sent for admin approval");
      router.replace("/article");
    } catch {
      Alert.alert("Error", "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <AppShell title="Submit Article (Guest)">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {!verified && (
          <>
            <TextInput
              placeholder="+91XXXXXXXXXX"
              value={mobile}
              onChangeText={setMobile}
              style={styles.input}
            />

            {sessionId && (
              <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
              />
            )}

            <TouchableOpacity style={styles.btn} onPress={sessionId ? verifyOtp : sendOtp}>
              {verifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  {sessionId ? "Verify OTP" : "Send OTP ||Verify Phone Number"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TextInput
          placeholder="Short Excerpt"
          value={excerpt}
          onChangeText={setExcerpt}
          editable={verified}
          style={[styles.input, !verified && styles.disabled]}
        />

        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={setBody}
          multiline
          editable={verified}
          style={[styles.input, styles.body, !verified && styles.disabled]}
        />

        <TouchableOpacity
          style={[styles.btn, !verified && styles.disabled]}
          onPress={pickImage}
          disabled={!verified}
        >
          <Text style={styles.btnText}>Pick Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.image} />}

        {categories.map((c) => {
          const active = selectedCats.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => toggleCategory(c.id)}
              disabled={!verified}
              style={[
                styles.cat,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.card,
                  opacity: verified ? 1 : 0.5,
                },
              ]}
            >
              <Text style={{ color: active ? "#fff" : colors.text }}>
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {!paymentId ? (
          <TouchableOpacity
            style={[styles.pay, !verified && styles.disabled]}
            onPress={startPay}
            disabled={!verified || paying}
          >
            {paying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Pay & Unlock Submit</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.pay, styles.success]} disabled>
            <Text style={styles.btnText}>Payment Verified ✓</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submit, (!paymentId || submitting) && styles.disabled]}
          onPress={submit}
          disabled={!paymentId || submitting}
        >
          <Text style={styles.btnText}>
            {submitting ? "Submitting..." : "Submit Article"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  body: {
    height: 160,
    textAlignVertical: "top",
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#6c757d",
    marginBottom: 10,
  },
  pay: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f59e0b",
    marginTop: 20,
  },
  submit: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#28a745",
    marginTop: 14,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
  cat: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  success: {
    backgroundColor: "#16a34a",
  },
});
