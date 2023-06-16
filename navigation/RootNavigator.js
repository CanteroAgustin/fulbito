import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';


export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    if (!user) {
      AsyncStorage.getItem('@user').then(userStorage => {
        if (userStorage) {
          setUser(JSON.parse(userStorage))
          setIsLoading(false)
        }
        setIsLoading(false)
      });
    }
    setIsLoading(false)
  }, [user]);



  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#1B5E20" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}