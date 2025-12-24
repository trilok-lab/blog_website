import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { getAccessToken, logoutUser } from "../../src/utils/token";

export default function Menu() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* -------------------------------------------
     CHECK AUTH STATE
  -------------------------------------------- */
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  /* -------------------------------------------
     LOGOUT HANDLER (FIXED)
  -------------------------------------------- */
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logoutUser();
            setIsLoggedIn(false);

            // ✅ IMPORTANT FIX
            router.replace("/auth/welcome");
          },
        },
      ],
      { cancelable: true }
    );
  };

  /* -------------------------------------------
     MENU BUTTON
  -------------------------------------------- */
  const MenuButton = ({ label, route, danger }) => (
    <TouchableOpacity
      onPress={() => router.push(route)}
      style={{
        backgroundColor: danger ? "#dc3545" : "#1E90FF",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 18 }}>{label}</Text>
    </TouchableOpacity>
  );

  /* -------------------------------------------
     LOADING
  -------------------------------------------- */
  if (checkingAuth) {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  /* -------------------------------------------
     MENU UI
  -------------------------------------------- */
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 50 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Menu</Text>

      {/* ARTICLES */}
      <MenuButton label="📄 View Articles" route="/article" />
      <MenuButton label="🖼 Slider Articles" route="/article?is_slider=true" />
      <MenuButton label="🔥 Popular Articles" route="/article?popular=true" />

      {/* SUBMISSION */}
      <MenuButton
        label="➕ Submit Article (Guest)"
        route="/article/submit-guest"
      />

      {isLoggedIn && (
        <MenuButton
          label="👤 Submit Article (User)"
          route="/article/submit-user"
        />
      )}

      {/* MISC */}
      <MenuButton label="💬 Add Comment" route="/comments/add" />
      <MenuButton label="☎ Contact Us" route="/contact" />

      {/* AUTH */}
      {!isLoggedIn && (
        <MenuButton label="🔐 Login / Register" route="/auth/welcome" />
      )}

      {isLoggedIn && (
        <>
          <MenuButton label="🧑‍💼 Admin Panel" route="/admin" />

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#dc3545",
              padding: 14,
              borderRadius: 10,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>🚪 Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
