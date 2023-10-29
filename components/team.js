import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List } from "react-native-paper"
import PlayerChip from './playerChip';
import { removeFromTeamAndAddToList } from '../services/matchService';

export default function Team({ name, team, match }) {

  //const { maxPlayers } = players.length / 2;

  const handleOnClick = player => {
    removeFromTeamAndAddToList(team, player, match, name);
  }

  return <List.Section title={name}  >
    <View style={styles.section}>
      <ScrollView horizontal={true}>
        {team.map((player, index) => {
          return (
            <PlayerChip onPress={() => handleOnClick(player)} key={index} player={player} handleOnClick={handleOnClick}></PlayerChip>
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
