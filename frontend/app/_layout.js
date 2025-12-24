import { Stack } from "expo-router";
import Snackbar from "../src/components/Snackbar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Snackbar />
    </>
  );
}
