import { createContext, useState, useEffect } from "react";
import client from "../api/client";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState("default");
  const [themeData, setThemeData] = useState({});

  const loadTheme = async () => {
    try {
      const res = await client.get("/api/theming/setting/");
      setActiveTheme(res.data.active_theme);
      setThemeData(res.data.theme_data);
    } catch (err) {
      console.log("Theme load error:", err);
    }
  };

  const changeTheme = async (theme) => {
    try {
      const res = await client.post("/api/theming/setting/change/", {
        active_theme: theme,
      });
      setActiveTheme(res.data.active_theme);
      setThemeData(res.data.theme_data);
    } catch (err) {
      console.log("Theme switch error:", err);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, themeData, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
