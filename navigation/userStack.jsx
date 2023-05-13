import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen"; // renamed here

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
          component={CameraScreen} // and here
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
