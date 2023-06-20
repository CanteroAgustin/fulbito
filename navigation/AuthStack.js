import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginPage from "../pages/LoginPage";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}