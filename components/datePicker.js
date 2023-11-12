import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TimePickerModal, DatePickerModal, en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en)

export default function DatePicker(props) {
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);

  const onDismiss = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      props.hourEvent(String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0'));
    },
    [setVisible]
  );

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      props.dateEvent(params.date);
    },
    [setOpen, setDate]
  );

  return (<View style={styles.iconDateContainer}>
    <SafeAreaProvider>
      <View style={styles.dateButtons}>
        <Button textColor='#1B5E20' icon="calendar-blank" mode="outlined" onPress={() => setOpen(true)}>
          Fecha
        </Button>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
        />
      </View>
      <View style={styles.dateButtons}>
        <Button textColor='#1B5E20' icon="clock-outline" mode="outlined" onPress={() => setVisible(true)}>
          Hora
        </Button>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={60}
        />
      </View>
    </SafeAreaProvider>
  </View>)
}

const styles = StyleSheet.create({
  iconDateContainer: {
    flexDirection: 'row'
  },
  dateButtons: {
    paddingTop: 20,
    paddingHorizontal: 5
  },
});