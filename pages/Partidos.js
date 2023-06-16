import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, TextInput, FAB, List, Button } from 'react-native-paper';
import { TimePickerModal, DatePickerModal, enGB, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { Formik } from 'formik';
import dayjs from 'dayjs';

import partidosValidationSchema from '../schemas/partidos-schema';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { db } from '../config/firebase';
import { useEffect } from 'react';

registerTranslation('en-GB', enGB)

export default function Partidos() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [partidos, setPartidos] = useState([]);
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState(undefined);
  const [hour, setHour] = useState('19');
  const [minutes, setMinutes] = useState('00');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMatchs();
  }, [])

  const getMatchs = async () => {
    const dbRef = collection(db, "partidos");
    onSnapshot(dbRef, docsSnap => {
      docsSnap.forEach(doc => {
        setPartidos(partidos => [...partidos, doc.data()]);
      })
    });
  }

  const onDismiss = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setHour(hours);
      setMinutes(minutes);
    },
    [setVisible]
  );

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const createMatch = async values => {
    const fecha = dayjs(date).format('DD-MM-YYYY') + "-" + hour + ":" + minutes + "hs"
    const id = `${user.id}-${values.lugar}-${fecha}`
    await setDoc(doc(db, "partidos", id), {
      "id": id,
      "fecha": fecha,
      "lugar": values.lugar,
      "organizador": user.apodo,
      "status": 'pendiente',
      "jugadores": []
    });
    setShouldShowForm(false);
  }


  return (
    <View style={styles.container}>
      {shouldShowForm ? <View style={styles.formikContainer}>
        <Formik
          validationSchema={partidosValidationSchema}
          style={styles.formik}
          initialValues={{ lugar: '' }}
          onSubmit={values => createMatch(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.card}>
              <TextInput
                mode='outlined'
                label="Lugar"
                onChangeText={handleChange('lugar')}
                onBlur={handleBlur('lugar')}
                value={values.lugar}
              />
              {errors.lugar &&
                <Text style={{ textAlign: 'center', fontSize: 15, color: 'red', paddingTop: 10 }}>{errors.lugar}</Text>
              }
              <View style={styles.iconDateContainer}>
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
                </SafeAreaProvider>
                <SafeAreaProvider>
                  <View style={styles.dateButtons}>
                    <Button textColor='#1B5E20' icon="clock-outline" mode="outlined" onPress={() => setVisible(true)}>
                      Hora
                    </Button>
                    <TimePickerModal
                      visible={visible}
                      onDismiss={onDismiss}
                      onConfirm={onConfirm}
                      hours={12}
                      minutes={14}
                    />
                  </View>
                </SafeAreaProvider>
              </View>
              <Button style={styles.saveBtn} buttonColor='#1B5E20' mode="contained" onPress={handleSubmit}>Guardar</Button>
            </View>
          )}
        </Formik>
      </View> :
        <>
          <List.AccordionGroup>
            {partidos.map((item, index) => {
              return (
                <View key={item.id}>
                  <List.Accordion left={props => <List.Icon {...props} icon="soccer" color='#1B5E20' />} style={styles.accordion} titleStyle={styles.acordeonTitle} title={`${item.lugar} - ${item.fecha}`} id={item.id + index}>
                    <Text>Sarasa</Text>
                    <List.Item title={item.fecha} ></List.Item>
                  </List.Accordion>
                </View>
              );
            })}
          </List.AccordionGroup>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => { setShouldShowForm(true) }}
          />
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  formik: {
    height: '100%'
  },
  container: {
    padding: 10,
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  formikContainer: {
    height: '100%'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  accordion: {
    backgroundColor: '#ece6f3',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 5
  },
  acordeonTitle: {
    fontWeight: 'bold',
  },
  card: {
    height: '100%',
  },
  iconDateContainer: {
    flexDirection: 'row'
  },
  saveBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  dateButtons: {
    paddingTop: 20,
    paddingHorizontal: 5
  }
});
