// frontend/app/theming/index.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import client from "../../src/api/client";
import { ThemeContext } from "../../src/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  const change = async (name) => {
    try {
      await client.post("/api/theming/setting/change/", { active_theme: name });
      const res = await client.get("/api/theming/setting/");
      setTheme(res.data);
      alert("Theme changed");
    } catch (e) {
      alert("Error changing theme");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Active: {theme.active_theme}</Text>
      <FlatList
        data={theme.available_themes || []}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => change(item)} style={{ padding: 12, backgroundColor: "#eee", marginVertical: 8, borderRadius: 8 }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
