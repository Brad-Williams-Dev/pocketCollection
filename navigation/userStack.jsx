import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoreScreen";
import SearchScreen from "../screens/SearchScreen";
import CollectionsScreen from "../screens/CollectionsScreen";

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerTitle: "",
            headerTransparent: true,
          })}
        />
        <Stack.Screen
          name="Store"
          component={StoreScreen}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerTitle: "",
            headerTransparent: true,
          })}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerTitle: "",
            headerTransparent: true,
          })}
        />
        <Stack.Screen
          name="Collection"
          component={CollectionsScreen}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerTitle: "",
            headerTransparent: true,
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            headerTitle: "",
            headerTransparent: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
