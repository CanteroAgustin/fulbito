import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

import { BottomNavigation } from 'react-native-paper';

import Jugadores from './Jugadores';
import Matches from './Matches';
import Estadisticas from './Estadisticas';
import Notificaciones from './Notificaciones';

const image = require('../assets/background.jpeg');

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'jugadores', title: 'Jugadores', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    { key: 'matches', title: 'Partidos', focusedIcon: 'soccer-field' },
    { key: 'estadisticas', title: 'Estadisticas', focusedIcon: 'star', unfocusedIcon: 'star-outline' },
    { key: 'notificaciones', title: 'Notificaciones', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const JugadoresRoute = () => <Jugadores />;

  const MatchesRoute = () => <Matches />;

  const EstadisticasRoute = () => <Estadisticas />;

  const NotificacionesRoute = () => <Notificaciones />;

  const renderScene = BottomNavigation.SceneMap({
    jugadores: JugadoresRoute,
    matches: MatchesRoute,
    estadisticas: EstadisticasRoute,
    notificaciones: NotificacionesRoute,
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