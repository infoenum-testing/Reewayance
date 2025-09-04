// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import AccountScreen from '../screens/AccountScreen';
import { ROUTES } from '../helper/routes';
import { Image } from 'react-native';

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
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/homeActiveImage.png")}
              // eslint-disable-next-line react-native/no-inline-styles
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
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/searchActiveImage.png")}
              // eslint-disable-next-line react-native/no-inline-styles
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
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/saveActiveImage.png")}
              // eslint-disable-next-line react-native/no-inline-styles
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
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/cartActiveImage.png")}
              // eslint-disable-next-line react-native/no-inline-styles
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
        name={ROUTES.ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/tabImage/accountActiveImage.png")}
              // eslint-disable-next-line react-native/no-inline-styles
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
