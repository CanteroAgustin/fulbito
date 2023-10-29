import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function MatchInformation({ match }) {
  return <View style={styles.container}>
    <View style={styles.textContainer}><Text style={styles.textStyle}>Informacion del partido:</Text></View>
    <View style={styles.textContainer}><Text style={styles.textStyle}>Organizador:</Text><Text> {match.organizador}</Text></View>
    <View style={styles.textContainer}><Text style={styles.textStyle}>Fecha:</Text><Text> {match.fecha}</Text></View>
    <View style={styles.textContainer}><Text style={styles.textStyle}>Lugar:</Text><Text> {match.lugar}</Text></View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingBottom: 20,
    paddingTop: 20
  },
  textContainer: {
    flexDirection: 'row',
    alignContent: 'flex-start'
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#388E3C',
  },
});