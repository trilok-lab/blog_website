import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { fetchComments, postComment } from "../api/client";
import Loading from "../components/Loading";

export default function CommentsScreen({ route }) {
  const { articleId } = route.params;
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchComments(articleId);
    setComments(data);
  };

  const submit = async () => {
    await postComment(articleId, text);
    setText("");
    load();
  };

  if (!comments) return <Loading />;

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginBottom: 10 }}>• {item.text}</Text>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a comment"
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />

      <Button title="Post Comment" onPress={submit} />
    </View>
  );
}
