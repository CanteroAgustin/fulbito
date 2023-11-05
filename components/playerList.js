import React, { useContext } from 'react';
import { StyleSheet, View } from "react-native";
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { Chip } from 'react-native-paper';
import { ROL } from '../shared/utils/constants';

export default function PlayerList({ match, setSelectedPlayer, setShowConfirmDialog }) {

  const { user } = useContext(AuthenticatedUserContext);
  const handleOnClick = player => {
    setSelectedPlayer(player);
    setShowConfirmDialog(true);
  }
  return (
    <View>
      {match.players.map((player, index) => {
        return (
          <Chip style={styles.chip} key={player.id} disabled={(!(player.id === user.id) && !user.rol.includes(ROL.ADMIN))} mode='outlined' icon="account"
            onPress={() => handleOnClick(player)}>{index + 1}-{player.apodo} ({player.posicion})</Chip>
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