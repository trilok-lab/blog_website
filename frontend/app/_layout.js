import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeContext";
import Snackbar from "../src/components/Snackbar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Snackbar />
    </ThemeProvider>
  );
}
