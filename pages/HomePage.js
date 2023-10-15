import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

import { BottomNavigation } from 'react-native-paper';

import Players from './bottomNavigation/Players';
import Matches from './bottomNavigation/Matches';
import Statistics from './bottomNavigation/Statistics';
import Notifications from './bottomNavigation/Notifications';

const image = require('../assets/background.jpeg');

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'players', title: 'Jugadores', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    { key: 'matches', title: 'Partidos', focusedIcon: 'soccer-field' },
    { key: 'statistics', title: 'Estadisticas', focusedIcon: 'star', unfocusedIcon: 'star-outline' },
    { key: 'notifications', title: 'Notificaciones', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const PlayersRoute = () => <Players />;

  const MatchesRoute = () => <Matches />;

  const StatisticsRoute = () => <Statistics />;

  const NotificationsRoute = () => <Notifications />;

  const renderScene = BottomNavigation.SceneMap({
    players: PlayersRoute,
    matches: MatchesRoute,
    statistics: StatisticsRoute,
    notifications: NotificationsRoute,
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={styles.bottomNavigation}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  bottomNavigation: {
    backgroundColor: '#E8F5E9'
  }
});