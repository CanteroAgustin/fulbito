import React from 'react';
import { StyleSheet, View, ScrollView } from "react-native";
import Team from './team';

export default function Teams({ match }) {

  return (
    <View>
      {match.team1 && <Team name="Equipo 1" team={match.team1}></Team>}
      {match.team2 && <Team name="Equipo 2" team={match.team2}></Team>}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
    backgroundColor: '#fff',
    right: 80
  }
});