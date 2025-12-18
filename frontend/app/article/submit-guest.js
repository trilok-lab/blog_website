// app/article/submit-guest.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";

import { submitArticle, getCategories } from "../../src/api/articles";
import { sendOTP, verifyOTP } from "../../src/api/otp";
import { startPayment } from "../../src/api/payments";

export default function SubmitGuestArticle() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ARTICLE FIELDS
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [image, setImage] = useState(null);

  // OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");
  const [sessionId, setSessionId] = useState("");

  // PAYMENT
  const [paymentId, setPaymentId] = useState("");

  // Load incoming session_id if passed from older screens
  useEffect(() => {
    if (params?.session_id) {
      setSessionId(params.session_id);
    }
  }, [params]);

  // Load categories from backend
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  // Pick image
  const pickImage = async () => {
    let r = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!r.canceled) setImage(r.assets[0]);
  };

  // Category toggle
  const toggleCategory = (id) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter((x) => x !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  // SEND OTP
  const sendOtpNow = async () => {
    if (!mobile) return Alert.alert("Please enter mobile number");

    try {
      const res = await sendOTP({ mobile_no: mobile });

      // Backend may return session_id after sending OTP (debug mode)
      const sid = res?.data?.session_id || "";
      if (sid) setSessionId(sid);

      Alert.alert("OTP sent!");
    } catch (err) {
      console.log("OTP SEND ERROR", err);
      Alert.alert("Unable to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtpNow = async () => {
    if (!sessionId) return Alert.alert("No session_id found. Send OTP first.");

    try {
      const res = await verifyOTP({
        session_id: sessionId,
        code: otp,
      });

      const sid = res?.data?.session_id || sessionId;
      setSessionId(sid);

      Alert.alert("OTP verified!");
    } catch (err) {
      console.log("OTP VERIFY ERROR", err);
      Alert.alert("Invalid OTP");
    }
  };

  // START PAYMENT
  const startPaymentNow = async () => {
    try {
      const res = await startPayment();
      setPaymentId(res.data.id);
      Alert.alert("Payment started", "Complete payment in browser then return.");
    } catch (e) {
      console.log(e);
      Alert.alert("Payment could not start");
    }
  };

  // SUBMIT ARTICLE
  const submit = async () => {
    if (!sessionId) return Alert.alert("Please verify your phone number first!");
    if (!paymentId) return Alert.alert("Start payment before submitting!");

    const fd = new FormData();

    fd.append("title", title);
    fd.append("excerpt", excerpt);
    fd.append("body", body);

    selectedCats.forEach((id) => fd.append("category_ids", id));

    if (image) {
      fd.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "article.jpg",
      });
    }

    // REQUIRED BY BACKEND
    fd.append("verification_session_id", sessionId);
    fd.append("payment_id", paymentId);

    try {
      await submitArticle(fd);
      Alert.alert("Success", "Article submitted!", [
        { text: "OK", onPress: () => router.push("/article") },
      ]);
    } catch (err) {
      console.log("SUBMIT ERR", err);
      Alert.alert("Error submitting article");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 40 , paddingHorizontal: 10, paddingTop: 50}}>
        Guest Article Submission
      </Text>

      {/* MOBILE */}
      <TextInput
        placeholder="Mobile number" value={mobile} onChangeText={setMobile} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}  keyboardType="phone-pad"
      />

      <TouchableOpacity
        onPress={sendOtpNow}
        style={{ backgroundColor: "#1E90FF", padding: 12, borderRadius: 8,  marginBottom: 10, }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Send OTP</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter OTP" value={otp} onChangeText={setOTP}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        onPress={verifyOtpNow}
        style={{ backgroundColor: "#19be5eff", padding: 12, borderRadius: 8, marginBottom: 10, }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Verify OTP</Text>
      </TouchableOpacity>

      {sessionId ? (
        <Text style={{ color: "green", marginBottom: 10 }}>
          OTP Verified ✔
        </Text>
      ) : null}

      {/* PAYMENT */}
      <TouchableOpacity
        onPress={startPaymentNow}
        style={{ backgroundColor: "#222", padding: 12, borderRadius: 8, marginBottom: 10, }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Start Payment
        </Text>
      </TouchableOpacity>

      {paymentId ? (
        <Text style={{ color: "#1E90FF", marginBottom: 10 }}>
          Payment ID: {paymentId}
        </Text>
      ) : null}

      {/* ARTICLE FIELDS */}
      <TextInput
        placeholder="Title" value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Excerpt" value={excerpt} onChangeText={setExcerpt}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Body" value={body} onChangeText={setBody} multiline 
        style={{ borderWidth: 1, padding: 10, height: 160,  marginBottom: 10, }} />

      {/* Image */}
      <TouchableOpacity
        onPress={pickImage}
        style={{ backgroundColor: "#1E90FF", padding: 12, borderRadius: 8, marginBottom: 10, }} >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Pick Image
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 200, marginBottom: 10 }} />
      )}

      {/* Categories */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Categories</Text>

      {categories.map((c) => (
        <TouchableOpacity key={c.id} onPress={() => toggleCategory(c.id)}
          style={{padding: 10,marginBottom: 6,backgroundColor: selectedCats.includes(c.id) ? "#1E90FF" : "#eee",borderRadius: 8,}}>
          <Text
            style={{color: selectedCats.includes(c.id) ? "#fff" : "#000",}}>
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Submit */}
      <TouchableOpacity onPress={submit}
        style={{backgroundColor: "#19be5eff",padding: 14,borderRadius: 8,marginVertical: 20,marginBottom: 100}} >
        <Text style={{ color: "#fff", textAlign: "center" , }}>
          Submit Article
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
