import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

export default function HomeScreen() {

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
    <View style={styles.container}>
      <Text>{JSON.stringify(user, null, 2)}</Text>
      <Button onPress={handleSignOut} title='Salir'></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaf6',
  },
});