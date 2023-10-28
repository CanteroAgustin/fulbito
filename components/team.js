import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List } from "react-native-paper"
import PlayerChip from './playerChip';

export default function Team({ name, team }) {

  //const { maxPlayers } = players.length / 2;

  return <List.Section title={name}  >
    <View style={styles.section}>
      <ScrollView horizontal={true}>
        {team.map((player, index) => {
          return (
            <PlayerChip key={index} player={player}></PlayerChip>
          );
        })}
      </ScrollView>
    </View>
  </List.Section>

}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row'
  },
});
