import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text } from "react-native";
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { COLLECTIONS, ROL } from '../shared/utils/constants';
import { db } from '../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import * as poolService from '../services/poolService';
import { IconButton, TextInput } from 'react-native-paper';

export default function Pool() {
  const { user } = useContext(AuthenticatedUserContext);
  const [pool, setPool] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const dbRef = collection(db, COLLECTIONS.POOL);
    onSnapshot(dbRef, docsSnap => {
      docsSnap.forEach(doc => {
        setPool(doc.data().pool);
        return;
      })
    });
  }, []);

  const save = pool => {
    poolService.editPool(pool);
    setIsEditing(false);
  }

  return (<Text style={styles.pool}>
    {(isEditing && user.rol && user.rol.includes(ROL.TESORERO)) && <IconButton
      style={styles.addGuestIconButton}
      icon="content-save"
      iconColor='#1B5E20'
      size={20}
      onPress={() => save(pool)}
    />}
    {(!isEditing && user.rol && user.rol.includes(ROL.TESORERO)) && <IconButton
      icon="pencil"
      iconColor='#1B5E20'
      size={20}
      onPress={() => setIsEditing(true)}
    />}
    Pozo: <TextInput
      value={pool}
      mode="outlined"
      inputMode='numeric'
      style={styles.input}
      contentStyle={{ paddingHorizontal: -10 }}
      outlineStyle={{ borderWidth: 0, padding: 0 }}
      onChangeText={text => setPool(text)}
      disabled={!isEditing}
    />
  </Text>)
}

const styles = StyleSheet.create({
  pool: {
    fontSize: 20,
    marginLeft: 10
  },
});