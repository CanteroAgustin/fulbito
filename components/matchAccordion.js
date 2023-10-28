import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import { Text, List, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import FinishDialog from './finishDialog';
import CancelDialog from './cancelDialog';
import PlayersListSelect from './playersListSelect';
import FormGuest from '../components/formGuest';
import Teams from './teams';
import MatchInformation from './matchInformation';
import PlayerList from './playerList';
import { AddToPlayerList } from '../services/matchDB';

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
  const hideFinishDialog = () => setFinishConfirmationVisible(false);
  const [finishConfirmationVisible, setFinishConfirmationVisible] = useState(false);

  const addMeToMatch = async (match) => {
    AddToPlayerList(match, user);
  }

  const addToMatch = async () => {
    setShouldShowPlayersList(!shouldShowPlayersList);
  }

  const addGuest = async () => {
    setGuestModalVisible(!guestModalVisible);
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
      <MatchInformation match={match} />
      <Divider />

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
        <IconButton
          style={styles.addMeToMatchIconButton}
          icon="account-plus"
          iconColor='#1B5E20'
          size={20}
          mode="contained-tonal"
          onPress={() => addMeToMatch(match)}
        />
        {shouldShowPlayersList ? <PlayersListSelect addPlayerToMatch={addPlayerToMatch} match={match} /> : null}
      </View>

      {guestModalVisible &&
        <FormGuest match={match} closeGuestModalEvent={closeGuestModalEvent} />}
      <PlayerList match={match}></PlayerList>
      <Divider />
      {(match.team1.length > 0 || match.team2.length > 0) &&
        <Teams match={match}></Teams>
      }

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