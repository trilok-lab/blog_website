import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";
import { getCategories, createCategory, deleteCategory } from "../../api";

export default function AdminCategoryManagementScreen() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleCreate = async () => {
    if (!name) return;
    try {
      await createCategory({ name });
      setName("");
      fetchCategories();
    } catch (error) {
      Alert.alert("Cannot create category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      Alert.alert("Cannot delete category. It might have articles.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="New Category Name" value={name} onChangeText={setName} style={styles.input} />
      <Button title="Add Category" onPress={handleCreate} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  categoryItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
