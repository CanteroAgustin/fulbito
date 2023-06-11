import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNavigation } from 'react-native-paper';

import Jugadores from './Jugadores';
import Partidos from './Partidos';
import Estadisticas from './Estadisticas';
import Notificaciones from './Notificaciones';

const JugadoresRoute = () => <Jugadores />;

const PartidosRoute = () => <Partidos />;

const EstadisticasRoute = () => <Estadisticas />;

const NotificacionesRoute = () => <Notificaciones />;

export default function HomeScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'jugadores', title: 'Jugadores', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    { key: 'partidos', title: 'Partidos', focusedIcon: 'soccer-field' },
    { key: 'estadisticas', title: 'Estadisticas', focusedIcon: 'star', unfocusedIcon: 'star-outline' },
    { key: 'notificaciones', title: 'Notificaciones', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    jugadores: JugadoresRoute,
    partidos: PartidosRoute,
    estadisticas: EstadisticasRoute,
    notificaciones: NotificacionesRoute,
  });

  return (
    <View style={styles.container}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaf6',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});