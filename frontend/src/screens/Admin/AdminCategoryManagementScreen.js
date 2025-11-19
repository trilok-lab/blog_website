import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import api from "../../api/client";

export default function AdminCategoryManagementScreen() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const res = await api.get("/articles/categories/");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name) return;
    try {
      await api.post("/articles/categories/", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      Alert.alert("Error", "Failed to add category");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Add Category</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Add" onPress={addCategory} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={{ padding: 5 }}>{item.name}</Text>}
      />
    </View>
  );
}
