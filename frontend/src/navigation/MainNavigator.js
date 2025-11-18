import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import UserDashboard from "../screens/UserDashboard";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CreateArticleScreen from "../screens/CreateArticleScreen";
import EditArticleScreen from "../screens/EditArticleScreen";

import ArticlesListScreen from "../screens/ArticlesListScreen.js";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import CommentsScreen from "../screens/CommentsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import SubmitArticleScreen from "../screens/SubmitArticleScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      {/* Core Screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={UserDashboard} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
      <Stack.Screen name="EditArticle" component={EditArticleScreen} />

      {/* Article System */}
      <Stack.Screen name="Articles" component={ArticlesListScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="SubmitArticle" component={SubmitArticleScreen} />

      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
