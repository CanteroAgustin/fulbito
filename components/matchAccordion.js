import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import { Text, List, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import FinishDialog from './finishDialog';
import CancelDialog from './cancelDialog';
import PlayersListSelect from './playersListSelect';
import FormGuest from '../components/formGuest';
import Teams from './teams';
import MatchInformation from './matchInformation';
import PlayerList from './playerList';
import { AddToPlayerList } from '../services/matchService';
import { ROL } from '../shared/utils/constants';
import ConfirmDialog from './confirmDialog';
import { matchToWhatsappMsg, toInformPlayerAddedMsg } from '../shared/utils/matchUtil';
import { shareToWhatsApp } from '../services/whatsappService';

export default function MatchAccordion({ match, index }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
  const [finishConfirmationVisible, setFinishConfirmationVisible] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [value, setValue] = useState('');
  const [shouldShowPlayersList, setShouldShowPlayersList] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const hideFinishDialog = () => setFinishConfirmationVisible(false);
  const showFinishDialog = () => setFinishConfirmationVisible(true);
  const showDialog = () => setCancelConfirmationVisible(true);
  const hideDialog = () => setCancelConfirmationVisible(false);

  const hideConfirmDialog = () => {
    setSelectedPlayer(null);
    setShowConfirmDialog(false);
  };

  const addToMatch = async () => {
    setShouldShowPlayersList(!shouldShowPlayersList);
  }

  const addPlayerToMatch = async player => {
    setShouldShowPlayersList(false);
    AddToPlayerList(match, player);
    shareToWhatsApp(toInformPlayerAddedMsg(match, player));
  }

  const closeGuestModalEvent = () => {
    setGuestModalVisible(false);
  }

  return (<View key={match.id}>
    <List.Accordion style={styles.accordion} titleStyle={styles.acordeonTitle} title={`${match.lugar} ${match.fecha}`} id={match.id + index}>
      <MatchInformation match={match} />
      <Divider />
      <View style={styles.playerListContainer}>
        <Text style={styles.playerListTitle}>Jugadores:</Text>
        {(user.rol && user.rol.includes(ROL.ADMIN)) && <IconButton
          style={styles.sendIconButton}
          icon="whatsapp"
          iconColor='#1B5E20'
          size={20}
          mode="contained-tonal"
          onPress={() => shareToWhatsApp(matchToWhatsappMsg(match))}
        />}
        {(user.rol && user.rol.includes(ROL.ADMIN)) && <IconButton
          style={styles.addGuestIconButton}
          icon="account-question"
          iconColor='#1B5E20'
          size={20}
          mode="contained-tonal"
          onPress={() => setGuestModalVisible(!guestModalVisible)}
        />}
        {(user.rol && user.rol.includes(ROL.ADMIN)) && <IconButton
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
          onPress={() => AddToPlayerList(match, user)}
        />
        {shouldShowPlayersList ? <PlayersListSelect addPlayerToMatch={addPlayerToMatch} match={match} /> : null}
      </View>

      {guestModalVisible &&
        <FormGuest match={match} closeGuestModalEvent={closeGuestModalEvent} />}
      <PlayerList match={match} setSelectedPlayer={setSelectedPlayer} setShowConfirmDialog={setShowConfirmDialog}></PlayerList>
      <Divider />
      <Teams match={match}></Teams>

      {(user.rol && user.rol.includes(ROL.ADMIN)) && < SegmentedButtons
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
      {selectedPlayer &&
        <ConfirmDialog title="Confirmar accion" hideDialog={hideConfirmDialog} visible={showConfirmDialog} match={match} player={selectedPlayer} />
      }
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
  sendIconButton: {
    position: 'absolute',
    end: 150,
    top: 5
  },
  segmentButton: {
    marginTop: 20
  }
});