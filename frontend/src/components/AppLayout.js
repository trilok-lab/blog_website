import React from "react";
import { View, SafeAreaView } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function AppLayout({ children }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
