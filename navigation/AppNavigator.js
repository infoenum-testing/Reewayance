// AppNavigator.js
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SplashScreen from 'react-native-splash-screen';
import { ROUTES } from '../helper/routes';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  useEffect(() => {
    SplashScreen.hide(); 
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.CREATE_ACCOUNT} component={CreateAccountScreen} />
      <Stack.Screen name={ROUTES.HOMESCREEN} component={HomeScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
