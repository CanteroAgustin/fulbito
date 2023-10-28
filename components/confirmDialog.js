import React from 'react';
import { Text, Button, Dialog } from 'react-native-paper';
import { RemoveFromPlayerList } from '../services/matchDB';

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

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => deletePlayer(match, player)}>Eliminar</Button>
        <Button onPress={hideDialog}>Equipo 1</Button>
        <Button onPress={hideDialog}>Equipo 2</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ConfirmDialog;
