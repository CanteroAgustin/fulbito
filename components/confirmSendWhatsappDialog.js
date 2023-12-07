import React from 'react';
import { Text, Button, Dialog } from 'react-native-paper';
import { shareToWhatsApp } from '../services/whatsappService';

const ConfirmSendWhatsappDialog = ({
  title,
  text,
  match,
  visible,
  hideDialog,
  confirmSendWhatsapp
}) => {
  const sendToWhatsapp = () => {
    shareToWhatsApp(confirmSendWhatsapp);
  }
  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={sendToWhatsapp}>Si</Button>
        <Button onPress={hideDialog}>No</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ConfirmSendWhatsappDialog;
