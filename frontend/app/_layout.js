import { Stack } from "expo-router";
import Snackbar from "../src/components/Snackbar";
import { ThemeProvider } from "../src/theme/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Snackbar />
    </ThemeProvider>
  );
}
