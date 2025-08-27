// navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { ROUTES } from "../helper/routes";
import { Text } from "react-native";  // replace with icons later if you want

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,  // hide header
        tabBarShowLabel: true, // you can hide/show text
      }}
    >
      <Tab.Screen 
        name={ROUTES.HOMESCREEN} 
        component={HomeScreen} 
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen 
        name={ROUTES.PRODUCT_DETAIL} 
        component={ProductDetailScreen} 
        options={{ tabBarLabel: "Products" }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
