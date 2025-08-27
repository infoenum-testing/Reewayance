// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import { ROUTES } from '../helper/routes';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOMESCREEN}
        component={HomeScreen}
        options={{ tabBarLabel: 'HOME' }}
      />
      <Tab.Screen
        name={ROUTES.SEARCH_SCREEN}
        component={SearchScreen}
        options={{ tabBarLabel: 'SEARCH' }}
      />
      <Tab.Screen
        name={ROUTES.PRODUCT_DETAIL}
        component={ProductDetailScreen}
        options={{ tabBarLabel: 'PRODUCT' }}
      />
      <Tab.Screen
        name={ROUTES.CARTSCREEN}
        component={CartScreen}
        options={{ tabBarLabel: 'CART' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
