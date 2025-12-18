// frontend/app/article/index.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

import {
  listArticles,
  listPopular,
  listSlider,
  getCategories,
} from "../../src/api/articles";

export default function ArticleList() {
  const params = useLocalSearchParams();

  const isSlider = params.is_slider === "true";
  const isPopular = params.popular === "true";

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const debounce = useRef(null);

  // Load categories once
  useEffect(() => {
    getCategories().then((r) => setCategories(r.data || []));
  }, []);

  // Load articles (mode-based)
  const load = async (q = "") => {
    setLoading(true);

    try {
      let res;

      if (isSlider) {
        res = await listSlider();
        setItems(res.data || []);
        return;
      }

      if (isPopular) {
        res = await listPopular();
        setItems(res.data || []);
        return;
      }

      res = await listArticles(1, null, q ? { search: q } : {});
      setItems(res.data?.results || []);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load();
  }, [isSlider, isPopular]);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      load(search);
    }, 400);
  }, [search]);

  const renderItem = ({ item }) => (
    <Link href={`/article/${item.id}`} asChild>
      <TouchableOpacity
        style={{
          padding: 14,
          backgroundColor: "#f2f2f2",
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {item.title}
        </Text>

        {item.categories?.length > 0 && (
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            {item.categories.map((c) => (
              <Text
                key={c.id}
                style={{
                  marginRight: 6,
                  fontSize: 12,
                  color: "#1E90FF",
                }}
              >
                #{c.name}
              </Text>
            ))}
          </View>
        )}

        <Text style={{ marginTop: 6, color: "#555" }}>
          {item.excerpt}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 26, marginBottom: 10 }}>
        Articles
      </Text>

      <TextInput
        placeholder="Search articles..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 14,
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
