import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';

import { Text, TextInput, FAB, List, Button } from 'react-native-paper';

import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { Formik } from 'formik';
import dayjs from 'dayjs';

import matchesValidationSchema from '../../schemas/matches-schema';
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';
import { db } from '../../config/firebase';
import MatchAccordion from '../../components/matchAccordion';
import DatePicker from '../../components/datePicker';

export default function matches() {
  const { user, _, players, setPlayers } = useContext(AuthenticatedUserContext);
  const [matches, setMatches] = useState([]);
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const [date, setDate] = useState(undefined);
  const [hour, setHour] = useState('19:00');

  useEffect(() => {
    getMatchs();
  }, [])

  const getMatchs = async () => {
    const dbRef = collection(db, "matches");
    onSnapshot(dbRef, docsSnap => {
      setMatches([]);
      docsSnap.forEach(doc => {
        if (doc.data().status === 'pendiente') {
          setMatches(matches => [...matches, doc.data()]);
        }
      })
    });
  }

  const createMatch = async values => {
    const fecha = dayjs(date).format('DD-MM-YYYY') + " " + hour + "hs"
    const id = `${user.id}-${values.lugar}-${fecha}`
    await setDoc(doc(db, "matches", id), {
      "id": id,
      "fecha": fecha,
      "lugar": values.lugar,
      "organizador": user.apodo,
      "status": 'pendiente',
      "players": []
    });
    setShouldShowForm(false);
  }

  function handleDateEvent(date) {
    setDate(date);
  }

  function handleHourEvent(hour) {
    setHour(hour);
  }

  return (
    <View style={styles.container}>
      {shouldShowForm ? <View style={styles.formikContainer}>
        <Formik
          validationSchema={matchesValidationSchema}
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
                <DatePicker dateEvent={handleDateEvent} hourEvent={handleHourEvent}></DatePicker>
              </View>
              <Button style={styles.saveBtn} buttonColor='#1B5E20' mode="contained" onPress={handleSubmit}>Guardar</Button>
            </View>
          )}
        </Formik>
      </View> :
        <>
          <ScrollView>
            <List.AccordionGroup>
              {matches.map((match, index) => {
                return (
                  <SafeAreaView key={match.id}>
                    <MatchAccordion key={match.id} match={match} index={index}></MatchAccordion>
                  </SafeAreaView>

                );
              })}
            </List.AccordionGroup>
          </ScrollView>
          {user.rol === 'admin' && <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => { setShouldShowForm(true) }}
          />}
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
  card: {
    height: '100%',
  },
  saveBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
});
