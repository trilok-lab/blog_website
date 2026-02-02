// frontend/app/article/submit-user.js
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
import { useRouter, useFocusEffect } from "expo-router";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { submitArticle, getCategories } from "../../src/api/articles";
import { startPayment, getMyPayments } from "../../src/api/payments";
import { useTheme } from "../../src/theme/ThemeContext";
import AppShell from "../../src/components/AppShell";

const STORAGE_KEY = "article_payment_id";

export default function SubmitArticleUser() {
  const router = useRouter();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);

  const [paymentId, setPaymentId] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paying, setPaying] = useState(false);
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

  /* ---------- CATEGORIES ---------- */
  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------- START PAYMENT ---------- */
  const startPay = async () => {
    if (!title || !body || !selectedCats.length) {
      return Alert.alert(
        "Incomplete",
        "Fill title, body and categories before payment"
      );
    }

    try {
      setPaying(true);
      const res = await startPayment({ article_title: title });
      const { payment_id, url } = res.data;

      if (!payment_id || !url) {
        throw new Error("Invalid payment response");
      }

      await AsyncStorage.setItem(STORAGE_KEY, String(payment_id));
      setPaymentId(payment_id);

      await Linking.openURL(url);
    } catch (e) {
      Alert.alert(
        "Payment error",
        e.response?.data?.error || e.message
      );
    } finally {
      setPaying(false);
    }
  };

  /* ---------- POLL PAYMENT (NO CONSUME) ---------- */
  const restoreAndCheckPayment = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setCheckingPayment(true);
      const res = await getMyPayments();
      const payments = res.data || [];

      const p = payments.find(
        (x) => String(x.id) === String(stored)
      );

      if (p && p.status === "paid" && p.used === false) {
        setPaymentId(p.id);
      } else {
        setPaymentId(null);
      }
    } catch {
      // ignore temporary errors
    } finally {
      setCheckingPayment(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      restoreAndCheckPayment();
    }, [])
  );

  /* ---------- SUBMIT ARTICLE ---------- */
  const submit = async () => {
    if (!paymentId) {
      return Alert.alert(
        "Payment required",
        "Please complete payment first"
      );
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("body", body);
    fd.append("payment_id", paymentId);

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
      await AsyncStorage.removeItem(STORAGE_KEY);
      Alert.alert("Submitted", "Article sent for admin approval");
      router.replace("/article");
    } catch (e) {
      Alert.alert(
        "Submit error",
        e.response?.data?.payment_id ||
          e.response?.data?.detail ||
          "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <AppShell title="Submit Article">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: colors.text }]}
        />

        <TextInput
          placeholder="Short Excerpt"
          placeholderTextColor={colors.muted}
          value={excerpt}
          onChangeText={setExcerpt}
          style={[styles.input, { color: colors.text }]}
        />

        <TextInput
          placeholder="Body"
          placeholderTextColor={colors.muted}
          value={body}
          onChangeText={setBody}
          multiline
          style={[styles.input, styles.body, { color: colors.text }]}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={pickImage}
        >
          <Text style={styles.btnText}>Pick Feature Image</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.image} />
        )}

        <Text style={[styles.section, { color: colors.text }]}>
          Categories
        </Text>

        {categories.map((c) => {
          const active = selectedCats.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => toggleCategory(c.id)}
              style={[
                styles.cat,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.card,
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
            style={[styles.pay, { backgroundColor: "#f59e0b" }]}
            onPress={startPay}
            disabled={paying || checkingPayment}
          >
            {paying || checkingPayment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                Pay & Unlock Submit
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.pay, { backgroundColor: colors.success }]}
            disabled
          >
            <Text style={styles.btnText}>
              Payment Verified ✓
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.submit,
            {
              backgroundColor: paymentId
                ? colors.success
                : colors.border,
            },
          ]}
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
    marginTop: 6,
  },
  pay: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  submit: {
    padding: 16,
    borderRadius: 12,
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
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  cat: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
});
