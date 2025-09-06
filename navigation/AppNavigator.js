// navigation/AppNavigator.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/LogInAndSignUp/OnboardingScreen";
import CreateAccountScreen from "../screens/LogInAndSignUp/CreateAccountScreen";
import ProductDetailScreen from "../screens/Home/ProductDetailScreen";
import LoginScreen from "../screens/LogInAndSignUp/LoginScreen";
import NewCardScreen from "../screens/Accounts/NewCardScreen";
import CheckoutScreen from '../screens/Home/CheckoutScreen';
import ForgotPasswordScreen from '../screens/LogInAndSignUp/ForgotPasswordScreen';
import VarificationScreen from '../screens/LogInAndSignUp/VarificationCodeScreen';
import ResetPasswordScreen from '../screens/LogInAndSignUp/ResetPasswordScreen';
import SplashScreen from 'react-native-splash-screen';
import { ROUTES } from '../helper/routes';
import BottomTabNavigator from "./BottomTabNavigator";
import MyOrdersScreen from '../screens/Accounts/MyOrdersScreen';
import AddressScreen from '../screens/Accounts/AddressScreen';
import FAQScreen from '../screens/Accounts/FAQScreen';
import HelpCenterScreen from '../screens/Accounts/HelpCenterScreen';
import MyDetailsScreen from '../screens/Accounts/MyDetailsScreen'; 
import NotificationsScreen from '../screens/Accounts/NotificationsScreen';

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
      <Stack.Screen name={ROUTES.Notification_Screen} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.MY_ORDERS} component={MyOrdersScreen} />
      <Stack.Screen name={ROUTES.FAQ_Screen} component={FAQScreen} />
      <Stack.Screen name={ROUTES.ADDRESS_SCREEN} component={AddressScreen} />
      <Stack.Screen name={ROUTES.Help_Center_Screen} component={HelpCenterScreen} />
      <Stack.Screen name={ROUTES.CHECKOUT_SCREEN} component={CheckoutScreen} />
      <Stack.Screen name={ROUTES.My_Details_Screen} component={MyDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;