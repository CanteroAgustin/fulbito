import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, TextInput, FAB, List, Button, Chip, IconButton, Divider } from 'react-native-paper';
import { TimePickerModal, DatePickerModal, enGB, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { Formik } from 'formik';
import dayjs from 'dayjs';

import matchesValidationSchema from '../schemas/matches-schema';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { db } from '../config/firebase';
import { margin } from '@mui/system';

registerTranslation('en-GB', enGB)

export default function matches() {
  const { user } = useContext(AuthenticatedUserContext);
  const [matches, setMatches] = useState([]);
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState(undefined);
  const [hour, setHour] = useState('19');
  const [minutes, setMinutes] = useState('00');
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [teamsReady, setTeamsReady] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);

  useEffect(() => {
    getMatchs();
    getPlayers();
  }, [])

  const getPlayers = async () => {
    const dbRef = collection(db, "usuarios");
    onSnapshot(dbRef, docsSnap => {
      docsSnap.forEach(doc => {
        setPlayers(players => [...players, doc.data()]);
      })
    });
  }

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
    const fecha = dayjs(date).format('DD-MM-YYYY') + " " + hour + ":" + minutes + "hs"
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

  const playerAlreadyExist = (playersInMatch) => playersInMatch.find(player => player.id === user.id);

  const getMatchByID = (id) => matches.find(match => match.id === id);

  const addMeToMatch = async (id) => {
    const match = getMatchByID(id);
    if (!playerAlreadyExist(match.players)) {
      match.players.push(user);
      await setDoc(doc(db, "matches", id), { ...match });
    }

  }

  const removeFromMatch = async (playerID, match) => {
    const newPlayersList = match.players.filter(player => {
      if (player.id !== playerID) {
        return player;
      }
    });
    match.players = newPlayersList;
    await setDoc(doc(db, "matches", match.id), {
      ...match
    });
  }

  const deleteMatch = async (match) => {
    match.status = 'cancelado'
    await setDoc(doc(db, "matches", match.id), {
      ...match
    });
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
            {matches.map((match, index) => {
              return (
                <View key={match.id}>
                  <List.Accordion left={props => <List.Icon {...props} icon="soccer" color='#1B5E20' />} style={styles.accordion} titleStyle={styles.acordeonTitle} title={`${match.lugar} ${match.fecha}`} id={match.id + index}>
                    <View style={styles.matchInformation}>
                      <View style={styles.listAccordionTextView}><Text style={styles.listAccordionTextLeft}>Informacion del partido:</Text></View>
                      <View style={styles.listAccordionTextView}><Text style={styles.listAccordionTextLeft}>Organizador:</Text><Text> {match.organizador}</Text></View>
                      <View style={styles.listAccordionTextView}><Text style={styles.listAccordionTextLeft}>Fecha:</Text><Text> {match.fecha}</Text></View>
                      <View style={styles.listAccordionTextView}><Text style={styles.listAccordionTextLeft}>Lugar:</Text><Text> {match.lugar}</Text></View>
                    </View>

                    <Divider />
                    {!teamsReady ? <>
                      <View style={styles.playerListContainer}>
                        <Text style={styles.playerListTitle}>Jugadores:</Text>
                        <IconButton
                          style={styles.addMeToMatchIconButton}
                          icon="account-plus"
                          iconColor='#1B5E20'
                          size={20}
                          mode="contained-tonal"
                          onPress={() => addMeToMatch(match.id)}
                        />
                      </View>
                      {match.players.map((player, index) => {
                        return (
                          <Chip disabled={!(player.id === user.id)} mode='outlined' icon="account" onPress={() => removeFromMatch(player.id, match)}>{index + 1}-{player.apodo}</Chip>
                        )
                      })}
                    </> :
                      <View>
                        {teamOne.map((item) => {
                          return (
                            <>
                              <Text>Equipo 1</Text>
                              <Text>{item.apodo} - {item.posicion}</Text>
                            </>
                          )
                        })}
                        {teamTwo.map((item) => {
                          return (
                            <>
                              <Text>Equipo 2</Text>
                              <Text>{item.apodo} - {item.posicion}</Text>
                            </>
                          )
                        })}
                      </View>}
                    <Button style={{ marginTop: 10, backgroundColor: '#DC3545' }} icon="delete-outline" mode="contained" onPress={() => deleteMatch(match)}>
                      Cancelar partido
                    </Button>
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
    marginBottom: 5,
    marginTop: 5
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
  },
  listAccordionTextView: {
    flexDirection: 'row',
    alignContent: 'flex-start'
  },
  listAccordionTextLeft: {
    fontWeight: 'bold',
    color: '#388E3C',
  },
  playerListContainer: {
    flexDirection: 'row',
  },
  playerListTitle: {
    alignSelf: 'center',
    paddingVertical: 20,
    fontWeight: 'bold',
    color: '#388E3C'
  },
  matchInformation: {
    paddingLeft: 0,
    paddingBottom: 20,
    paddingTop: 20
  },
  addMeToMatchIconButton: {
    margin: 'auto',
    marginEnd: 10
  }
});
