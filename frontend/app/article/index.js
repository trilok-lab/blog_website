import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import client from "../../src/api/client";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    client.get("/api/articles/")
      .then(res => setArticles(res.data.results))
      .catch(err => console.log("Error loading articles", err));
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Latest Articles
      </Text>

      {articles.map(article => (
        <Link
          key={article.id}
          href={`/article/${article.id}`}
          asChild
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#eee",
              padding: 15,
              borderRadius: 10,
              marginBottom: 15
            }}
          >
            <Text style={{ fontSize: 18 }}>{article.title}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}
