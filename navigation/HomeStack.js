import React, { useContext } from "react";
import { StyleSheet, Pressable } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import HomePage from "../pages/HomePage";

const Stack = createStackNavigator();


export default function HomeStack() {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  const handleSignOut = async () => {
    try {
      AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerRightContainerStyle: styles.headerRight,
        headerStyle: { backgroundColor: "papayawhip" },
        headerRight: () => (
          <Pressable onPress={handleSignOut}>
            <ExitToAppIcon />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    paddingRight: 30,
  },
});
