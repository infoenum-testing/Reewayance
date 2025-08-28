// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import { ROUTES } from '../helper/routes';
import { Text , Image } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name={ROUTES.HOMESCREEN}
        component={HomeScreen}
        options={{
          tabBarLabel: "HOME",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/homeActiveImage.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#000" : "#999",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name= {ROUTES.SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/searchActiveImage.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#000" : "#999",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name= {ROUTES.SAVED_SCREEN}
        component={SavedScreen}
        options={{
          tabBarLabel: "Saved",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/saveActiveImage.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#000" : "#999",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.CARTSCREEN}
        component={CartScreen}
        options={{
          tabBarLabel: "CART",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/cartActiveImage.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#000" : "#999",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={HomeScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/accountActiveImage.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#000" : "#999",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
