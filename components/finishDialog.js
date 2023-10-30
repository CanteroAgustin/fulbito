import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, SegmentedButtons, Dialog } from 'react-native-paper';
import { finishMatch } from '../services/matchService';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

const FinishDialog = ({
  title,
  text,
  match,
  visible,
  hideDialog
}) => {
  const { players } = useContext(AuthenticatedUserContext);
  const [toggleBtnValue, setToggleBtnValue] = useState('checked');

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Text style={styles.finishDialogText}>{text}</Text>
      <Dialog.Content>
        <SegmentedButtons
          value={toggleBtnValue}
          onValueChange={setToggleBtnValue}
          buttons={[
            {
              value: '1',
              label: 'Equipo 1',
            },
            {
              value: '0',
              label: 'Empate',
            },
            {
              value: '2',
              label: 'Equipo 2',
            },
          ]}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => finishMatch(match, toggleBtnValue, players)}>Finalizar</Button>
        <Button onPress={hideDialog}>Cancelar</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  finishDialogText: {
    alignSelf: "center",
    fontWeight: 'bold',
    paddingBottom: 20,
    fontSize: 20,
    color: '#388E3C'
  }
});

export default FinishDialog;
