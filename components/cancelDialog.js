import React from 'react';
import { Text, Button, Dialog } from 'react-native-paper';
import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";

const CancelDialog = ({
  title,
  text,
  match,
  visible,
  hideDialog
}) => {

  const deleteMatch = async (match) => {
    match.status = 'cancelado'
    await setDoc(doc(db, "matches", match.id), {
      ...match
    });
  }

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => deleteMatch(match)}>Si</Button>
        <Button onPress={hideDialog}>No</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default CancelDialog;
