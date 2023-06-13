import react, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Card, Avatar, IconButton, Surface, Badge } from 'react-native-paper';

import { query, collection, onSnapshot, getDocs } from "firebase/firestore";

import { db } from '../config/firebase';

export default function Jugadores(props) {
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    getUsers();

  }, []);

  const getUsers = async () => {
    const dbRef = collection(db, "usuarios");
    onSnapshot(dbRef, docsSnap => {
      docsSnap.forEach(doc => {
        setJugadores(jugadores => [...jugadores, doc.data()]);
      })
    });
  }

  return (
    <View style={styles.container}>
      {jugadores.map((item, index) => {
        return (
          <Surface style={Platform.OS === 'web' ? styles.surfaceWeb : styles.surface} elevation={4} key={item.id}>
            <Avatar.Image style={styles.avatar} {...props} size={48} source={{
              uri: item.picture,
            }} />
            <View style={styles.cardContainer}>
              <Text style={styles.textApodo}>{item.apodo}</Text>
              <View style={styles.badgesContainer}>
                <Badge size={25} style={styles.badge}>J: {item.estadisticas.jugados}</Badge>
                <Badge size={25} style={styles.badge}>G: {item.estadisticas.ganados}</Badge>
                <Badge size={25} style={styles.badge}>E: {item.estadisticas.empatados}</Badge>
                <Badge size={25} style={styles.badge}>P: {item.estadisticas.perdidos}</Badge>
              </View>
            </View>
            <Badge size={25} style={styles.badgePuntos}>Puntos: {item.estadisticas.puntos}</Badge>
          </Surface>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  surfaceWeb: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 8,
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
    minWidth: 500,
    maxWidth: 700
  },
  surface: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderRadius: 10,
    margin: 5
  },
  avatar: {
    alignSelf: 'flex-start'
  },
  textApodo: {
    margin: 2,
    fontWeight: '500'
  },
  cardContainer: {
    marginLeft: 10
  },
  badgesContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  badgePuntos: {
    alignSelf: 'center',
    marginLeft: 'auto',
  },
  badge: {
    margin: 1,
  }
});
