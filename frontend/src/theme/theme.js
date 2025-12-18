// frontend/src/theme/theme.js
import React, { createContext } from "react";

export const theme = {
  background: "#ffffff",
  card: "#f7f8fa",
  text: "#111827",
  muted: "#6b7280",
  primary: "#1e90ff",
  danger: "#ef4444",
};

export const ThemeContext = createContext({ theme });
export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
);
