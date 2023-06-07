import React from "react";
import { StyleSheet } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "../pages/HomePage";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    paddingRight: 30,
  },
});
