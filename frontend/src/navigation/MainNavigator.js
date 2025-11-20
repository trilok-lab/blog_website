import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ArticlesListScreen from "../screens/Articles/ArticlesListScreen";
import ArticleDetailScreen from "../screens/Articles/ArticleDetailScreen";
import CreateArticleScreen from "../screens/Articles/CreateArticleScreen";
import EditArticleScreen from "../screens/Articles/EditArticleScreen";
import SubmitArticleScreen from "../screens/Articles/SubmitArticleScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import OTPVerificationScreen from "../screens/Auth/OTPVerificationScreen";
import UserDashboard from "../screens/User/UserDashboard";
import ProfileScreen from "../screens/User/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import AdminArticleListScreen from "../screens/Admin/AdminArticleListScreen";
import AdminCategoryManagementScreen from "../screens/Admin/AdminCategoryManagementScreen";
import ContactScreen from "../screens/Contact/ContactScreen";

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ArticlesList" component={ArticlesListScreen} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
        <Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
        <Stack.Screen name="EditArticle" component={EditArticleScreen} />
        <Stack.Screen name="SubmitArticle" component={SubmitArticleScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AdminArticles" component={AdminArticleListScreen} />
        <Stack.Screen name="AdminCategories" component={AdminCategoryManagementScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
