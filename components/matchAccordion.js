import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import { Text, List, Chip, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import FinishDialog from './finishDialog';
import CancelDialog from './cancelDialog';
import PlayersList from './playersList';
import FormGuest from '../components/formGuest';

export default function MatchAccordion({ match, index }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [teamsReady, setTeamsReady] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
  const showFinishDialog = () => setFinishConfirmationVisible(true);
  const showDialog = () => setCancelConfirmationVisible(true);
  const hideDialog = () => setCancelConfirmationVisible(false);
  const [value, setValue] = useState('');
  const [shouldShowPlayersList, setShouldShowPlayersList] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const playerAlreadyExist = (playersInMatch) => playersInMatch.find(player => player.id === user.id);
  const hideFinishDialog = () => setFinishConfirmationVisible(false);
  const [finishConfirmationVisible, setFinishConfirmationVisible] = useState(false);

  const addMeToMatch = async (match) => {
    if (!playerAlreadyExist(match.players)) {
      match.players.push(user);
      await setDoc(doc(db, "matches", match.id), { ...match });
    }
  }

  const addToMatch = async () => {
    setShouldShowPlayersList(!shouldShowPlayersList);
  }

  const addGuest = async () => {
    setGuestModalVisible(!guestModalVisible);
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

  const addPlayerToMatch = async player => {
    setShouldShowPlayersList(false);
    match.players.push(player);
    await setDoc(doc(db, "matches", match.id), { ...match });
  }

  const closeGuestModalEvent = async match => {
    await setDoc(doc(db, "matches", match.id), { ...match });
    setGuestModalVisible(false);
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
          {user.rol == "admin" && <IconButton
            style={styles.addGuestIconButton}
            icon="account-question"
            iconColor='#1B5E20'
            size={20}
            mode="contained-tonal"
            onPress={() => addGuest(match)}
          />}
          {user.rol == "admin" && <IconButton
            style={styles.addPlayersToMatchIconButton}
            icon="account-multiple-plus"
            iconColor='#1B5E20'
            size={20}
            mode="contained-tonal"
            onPress={() => addToMatch(match)}
          />}
          {shouldShowPlayersList ? <PlayersList addPlayerToMatch={addPlayerToMatch} match={match} /> : null}
          <IconButton
            style={styles.addMeToMatchIconButton}
            icon="account-plus"
            iconColor='#1B5E20'
            size={20}
            mode="contained-tonal"
            onPress={() => addMeToMatch(match)}
          />
        </View>
        {guestModalVisible &&
          <FormGuest match={match} closeGuestModalEvent={closeGuestModalEvent} />}
        {match.players.map((player, index) => {
          return (
            <Chip style={{ marginBottom: 5 }} key={player.id} disabled={(!(player.id === user.id) && user.rol != 'admin')} mode='outlined' icon="account"
              onPress={() => removeFromMatch(player.id, match)}>{index + 1}-{player.apodo} ({player.posicion})</Chip>
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
      {user.rol === 'admin' && < SegmentedButtons
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
      />}
      {finishConfirmationVisible &&
        <FinishDialog title="Finalizar partido" text="¿Quien gano?" hideDialog={hideFinishDialog} visible={finishConfirmationVisible} match={match} />
      }
      {cancelConfirmationVisible &&
        <CancelDialog title="Cancelar partido" text={"Estas seguro que queres cancelar el partido?"} visible={cancelConfirmationVisible} hideDialog={hideDialog} match={match} />}
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
    end: 0,
    top: 5
  },
  addPlayersToMatchIconButton: {
    position: 'absolute',
    end: 50,
    top: 5
  },
  addGuestIconButton: {
    position: 'absolute',
    end: 100,
    top: 5
  },
  segmentButton: {
    marginTop: 20
  }
});