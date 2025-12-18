// frontend/src/components/FallbackImage.js
import React, { useState, useRef } from "react";
import { Animated, Image, View } from "react-native";

export default function FallbackImage({ uri, style, placeholderColor = "#eee", resizeMode = "cover" }) {
  const [failed, setFailed] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const onLoad = () => Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

  if (!uri || failed) return <View style={[{ backgroundColor: placeholderColor }, style]} />;

  return (
    <Animated.View style={[{ opacity }, style]}>
      <Image source={{ uri }} style={[{ width: "100%", height: "100%" }, style]} onLoad={onLoad} onError={() => setFailed(true)} resizeMode={resizeMode} />
    </Animated.View>
  );
}
