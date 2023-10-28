import React, { useContext } from 'react';
import { StyleSheet, View } from "react-native";
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { Chip } from 'react-native-paper';
import { RemoveFromPlayerList } from '../services/matchDB';

export default function PlayerList({ match }) {

  const { user } = useContext(AuthenticatedUserContext);

  return (
    <View>
      {match.players.map((player, index) => {
        return (
          <Chip style={styles.chip} key={player.id} disabled={(!(player.id === user.id) && user.rol != 'admin')} mode='outlined' icon="account"
            onPress={() => RemoveFromPlayerList(match, player.id)}>{index + 1}-{player.apodo} ({player.posicion})</Chip>
        )
      })}
    </View>

  );
}

const styles = StyleSheet.create({
  chip: {
    marginBottom: 5
  },
});