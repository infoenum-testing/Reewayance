// navigation/AppNavigator.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import NewCardScreen from "../screens/NewCardScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VarificationScreen from "../screens/VarificationCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import SplashScreen from "react-native-splash-screen";
import { ROUTES } from "../helper/routes";
import BottomTabNavigator from "./BottomTabNavigator";
import MyOrdersScreen from "../screens/MyOrdersScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useSelector((state) => state.auth); // persisted user

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // 🔹 If logged in, go straight to tabs
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      ) : (
        // 🔹 Otherwise show onboarding/login flow
        <>
          <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
          <Stack.Screen name={ROUTES.CREATE_ACCOUNT} component={CreateAccountScreen} />
          <Stack.Screen name={ROUTES.Login_SCREEN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
          <Stack.Screen name={ROUTES.Varification_SCREEN} component={VarificationScreen} />
          <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
        </>
      )}

      {/* 🔹 Always available (both logged in & not logged in) */}
      <Stack.Screen name={ROUTES.NEWCARD_SCREEN} component={NewCardScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
      <Stack.Screen name={ROUTES.MY_ORDERS} component={MyOrdersScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;