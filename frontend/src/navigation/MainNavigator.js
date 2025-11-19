import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import UserDashboard from "../screens/User/UserDashboard";
import ProfileScreen from "../screens/User/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import CreateArticleScreen from "../screens/Articles/CreateArticleScreen";
import EditArticleScreen from "../screens/Articles/EditArticleScreen";
import ArticlesListScreen from "../screens/Articles/ArticlesListScreen";
import ArticleDetailScreen from "../screens/Articles/ArticleDetailScreen";
import CommentsScreen from "../screens/CommentsScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import SubmitArticleScreen from "../screens/Articles/SubmitArticleScreen";
import AdminArticleListScreen from "../screens/Admin/AdminArticleListScreen";
import AdminCategoryManagementScreen from "../screens/Admin/AdminCategoryManagementScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={UserDashboard} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
      <Stack.Screen name="EditArticle" component={EditArticleScreen} />
      <Stack.Screen name="Articles" component={ArticlesListScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="SubmitArticle" component={SubmitArticleScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="AdminArticles" component={AdminArticleListScreen} />
      <Stack.Screen name="AdminCategories" component={AdminCategoryManagementScreen} />
    </Stack.Navigator>
  );
}
