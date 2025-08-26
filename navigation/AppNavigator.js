// AppNavigator.js
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VarificationScreen from '../screens/VarificationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SplashScreen from 'react-native-splash-screen';
import { ROUTES } from '../helper/routes';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
            <Stack.Screen name={ROUTES.CREATE_ACCOUNT} component={CreateAccountScreen} />
            <Stack.Screen name={ROUTES.Login_SCREEN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
            <Stack.Screen name={ROUTES.Varification_SCREEN} component={VarificationScreen} />
            <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
            <Stack.Screen name={ROUTES.HOMESCREEN} component={HomeScreen} />
            <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
        </Stack.Navigator>
    );

  useEffect(() => {
    SplashScreen.hide();
  }, []);
};

export default AppNavigator;
