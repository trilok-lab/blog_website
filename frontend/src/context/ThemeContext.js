// frontend/src/context/ThemeContext.js
import React, { createContext, useEffect, useState } from "react";
import client from "../api/client";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState("default");
  const [themeData, setThemeData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/api/theming/setting/");
        if (res.data) {
          setActiveTheme(res.data.active_theme || "default");
          setThemeData(res.data.theme_data || {});
        }
      } catch {}
    })();
  }, []);

  const changeTheme = async (name) => {
    try {
      const res = await client.post("/api/theming/setting/change/", { active_theme: name });
      if (res.data) {
        setActiveTheme(res.data.active_theme);
        setThemeData(res.data.theme_data || {});
      }
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, themeData, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
