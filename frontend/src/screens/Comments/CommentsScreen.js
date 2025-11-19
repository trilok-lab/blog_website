import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, Alert } from "react-native";
import { getComments, postComment } from "../api";

export default function CommentsScreen({ route }) {
  const { articleId } = route.params;
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const data = await getComments(articleId);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const submitComment = async () => {
    if (!text) return;
    try {
      await postComment(articleId, text);
      setText("");
      fetchComments();
    } catch (err) {
      Alert.alert("Error", "Failed to post comment");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 5, borderBottomWidth: 1, paddingBottom: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a comment..."
        style={{ borderWidth: 1, marginVertical: 10, padding: 5 }}
      />
      <Button title="Post Comment" onPress={submitComment} />
    </View>
  );
}
