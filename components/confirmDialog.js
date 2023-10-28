import React from 'react';
import { Text, Button, Dialog } from 'react-native-paper';
import { RemoveFromPlayerList, addPlayerToTeamAndRemoveFromList } from '../services/matchService';
import { TEAMS } from '../shared/utils/constants';

const ConfirmDialog = ({
  title,
  text,
  match,
  player,
  visible,
  hideDialog
}) => {

  const deletePlayer = (match, player) => {
    RemoveFromPlayerList(match, player.id);
    hideDialog();
  }

  const handleAddPlayer = (match, player, team) => {
    addPlayerToTeamAndRemoveFromList(match, player, team);
    hideDialog();
  }

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => deletePlayer(match, player)}>Eliminar</Button>
        <Button onPress={() => handleAddPlayer(match, player, TEAMS.TEAM_ONE)}>Equipo 1</Button>
        <Button onPress={() => handleAddPlayer(match, player, TEAMS.TEAM_TWO)}>Equipo 2</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ConfirmDialog;
