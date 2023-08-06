import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import { Text, List, Button, Chip, IconButton, Divider, Dialog, Portal, ToggleButton, SegmentedButtons, PaperProvider, Modal, Provider } from 'react-native-paper';
import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";


export default function MatchAccordion({ match, index }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [teamsReady, setTeamsReady] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
  const [finishConfirmationVisible, setFinishConfirmationVisible] = useState(false);
  const [toggleBtnValue, setToggleBtnValue] = useState('checked');

  const showDialog = () => setCancelConfirmationVisible(true);
  const hideDialog = () => setCancelConfirmationVisible(false);
  const showFinishDialog = () => setFinishConfirmationVisible(true);
  const hideFinishDialog = () => setFinishConfirmationVisible(false);
  const [value, setValue] = useState('');

  const playerAlreadyExist = (playersInMatch) => playersInMatch.find(player => player.id === user.id);

  const addMeToMatch = async (match) => {
    if (!playerAlreadyExist(match.players)) {
      match.players.push(user);
      await setDoc(doc(db, "matches", match.id), { ...match });
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

  const finishMatch = async (match) => {
    match.status = 'terminado'
    await setDoc(doc(db, "matches", match.id), {
      ...match,
      win: toggleBtnValue
    });
  }

  return (<View key={match.id}>
    <List.Accordion style={styles.accordion} titleStyle={styles.acordeonTitle} title={`${match.lugar} ${match.fecha}`} id={match.id + index}>
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
            onPress={() => addMeToMatch(match)}
          />
        </View>
        {match.players.map((player, index) => {
          return (
            <Chip key={player.id} disabled={!(player.id === user.id)} mode='outlined' icon="account" onPress={() => removeFromMatch(player.id, match)}>{index + 1}-{player.apodo}</Chip>
          )
        })}
      </> :
        <View>
          {teamOne.map((item) => {
            return (
              <View key={item.id}>
                <Text>Equipo 1</Text>
                <Text>{item.apodo} - {item.posicion}</Text>
              </View>
            )
          })}
          {teamTwo.map((item) => {
            return (
              <View key={item.id}>
                <Text>Equipo 2</Text>
                <Text>{item.apodo} - {item.posicion}</Text>
              </View>
            )
          })}
        </View>}
      <SegmentedButtons
        style={styles.segmentButton}
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            onPress: showDialog,
            icon: "delete-outline",
            value: 'cancel',
            label: 'Cancelar partido',
          },
          {
            onPress: showFinishDialog,
            icon: "check-outline",
            value: 'finish',
            label: 'Finalizar partido',
          },
        ]}
      />
      {finishConfirmationVisible &&
        <Dialog visible={finishConfirmationVisible} onDismiss={hideFinishDialog}>
          <Dialog.Title>Finalizar partido</Dialog.Title>
          <Text style={styles.finishDialogText}>¿Quien gano?</Text>
          <Dialog.Content>
            <SegmentedButtons
              style={styles.segmentButton}
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
            <Button onPress={() => finishMatch(match)}>Finalizar</Button>
            <Button onPress={hideFinishDialog}>Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      }
      {cancelConfirmationVisible && <Dialog visible={cancelConfirmationVisible} onDismiss={hideDialog}>
        <Dialog.Title>Cancelar partido</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Estas seguro que queres cancelar el partido?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => deleteMatch(match)}>Si</Button>
          <Button onPress={hideDialog}>No</Button>
        </Dialog.Actions>
      </Dialog>}
    </List.Accordion>

  </View >)
}

const styles = StyleSheet.create({
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
  matchInformation: {
    paddingLeft: 0,
    paddingBottom: 20,
    paddingTop: 20
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
  addMeToMatchIconButton: {
    position: 'absolute',
    end: 10,
    top: 5
  },
  finishDialogText: {
    alignSelf: "center",
    fontWeight: 'bold',
    paddingBottom: 20,
    fontSize: 20,
    color: '#388E3C'
  }
});