import { Linking } from 'react-native';

export const shareToWhatsApp = callback => {
  Linking.openURL(`whatsapp://send?text=${callback}`);
}

