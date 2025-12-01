import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e90ff" },
        headerTintColor: "#fff",
      }}
    />
  );
}
