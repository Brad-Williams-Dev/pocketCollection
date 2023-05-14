import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
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
          name="Camera"
          component={CameraScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
