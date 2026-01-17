import { Stack } from "expo-router";
import Snackbar from "../src/components/Snackbar";
import { ThemeProvider } from "../src/theme/ThemeContext";
import AppLayout from "../src/components/AppLayout";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Stack screenOptions={{ headerShown: false }} />
      </AppLayout>
      <Snackbar />
    </ThemeProvider>
  );
}
