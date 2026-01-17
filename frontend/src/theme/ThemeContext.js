// frontend/src/theme/ThemeContext.js

import React, { createContext, useContext, useState, useMemo } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = useMemo(() => {
    const isDark = theme === "dark";

    return {
      background: isDark ? "#121212" : "#F8F9FA",
      card: isDark ? "#1E1E1E" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#000000",
      muted: isDark ? "#B0B0B0" : "#6C757D",
      border: isDark ? "#2A2A2A" : "#DEE2E6",
      inputBg: isDark ? "#1E1E1E" : "#FFFFFF",

      primary: "#1E90FF",
      danger: "#DC3545",
      success: "#28A745",
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
