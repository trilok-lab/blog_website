import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { getCategories } from "../../src/api/articles";
import AppShell from "../../src/components/AppShell";

export default function SubmitGuestArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data || []));
  }, []);

  return (
    <AppShell title="Submit Article (Guest)">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TextInput placeholder="Title" style={styles.input} />
        <TextInput placeholder="Body" multiline style={[styles.input, styles.body]} />

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Verify OTP (Later Phase)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Payment (Later Phase)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  body: { height: 160 },
  btn: { padding: 14, backgroundColor: "#6c757d", borderRadius: 10, marginBottom: 10 },
  submit: { padding: 16, backgroundColor: "#28a745", borderRadius: 12 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
