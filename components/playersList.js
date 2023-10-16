import React, { useContext, useState } from 'react';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { StyleSheet, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { mapPlayersToKeyValueList } from "../shared/utils/playersUtil";

export default function PlayersList({ addPlayerToMatch, match }) {

  const { players } = useContext(AuthenticatedUserContext);

  const keyValueList = mapPlayersToKeyValueList(players, match);

  const playerAlreadyExist = val => {
    return players.find(player => player.apodo === val)
  }

  return (<View style={styles.container}>
    <SelectList
      placeholder='Seleccione jugador'
      search={false}
      setSelected={(val) => addPlayerToMatch(playerAlreadyExist(val))}
      data={keyValueList}
      save={'value'}
    />
  </View>)
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
    backgroundColor: '#fff',
    right: 80
  }
});