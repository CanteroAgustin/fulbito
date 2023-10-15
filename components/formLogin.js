import { useContext, useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import UserAvatar from 'react-native-user-avatar';
import loginValidationSchema from '../schemas/login-schema';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormLogin({ tempUser }) {
  const { _, setUser } = useContext(AuthenticatedUserContext);
  const [posicion, setPosicion] = useState('Arquero');

  const positionsList = [
    { key: '1', value: 'Arquero' },
    { key: '2', value: 'Defensor' },
    { key: '3', value: 'Medio' },
    { key: '4', value: 'Delantero' },
  ]

  const handleSubmitModal = data => {
    setDBUser(data);
  };

  const setDBUser = async data => {
    let pos = (posicion != 1) ? posicion : 'Arquero'
    await setDoc(doc(db, "usuarios", tempUser.id), {
      ...tempUser,
      "apodo": data.apodo,
      "status": "ACTIVE",
      "estadisticas": {
        "ganados": 0,
        "empatados": 0,
        "perdidos": 0,
        "jugados": 0,
        "puntos": 0,
      },
      posicion: pos
    });
    onSnapshot(doc(db, "usuarios", tempUser.id), (doc) => {
      setUser(doc.data());
      AsyncStorage.setItem('@user', JSON.stringify(doc.data()));
    });
  }

  return (
    <Formik initialValues={{
      apodo: '',
    }}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmitModal}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => {
        return (
          <View style={styles.modalView}>
            <View style={styles.avatarContainer}>
              {tempUser && <UserAvatar size={100} src={tempUser.picture} />}
              <Text style={styles.text}>Completa tu perfil de jugador.</Text>
            </View>

            <View style={styles.apodoContainer}>
              <TextInput
                mode='outlined'
                label="Nombre"
                onChangeText={handleChange('apodo')}
                onBlur={handleBlur('apodo')}
                value={values.apodo}
              />
              {errors.apodo &&
                <Text style={{ textAlign: 'center', fontSize: 15, color: 'red', paddingTop: 10 }}>{errors.apodo}</Text>
              }
            </View>
            <View style={styles.selectContainer}>
              <SelectList
                search={false}
                setSelected={(val) => setPosicion(val)}
                data={positionsList}
                save={'value'}
                defaultOption={{ key: '1', value: 'Arquero' }}
              />
            </View>

            <Button disabled={!isValid} style={styles.saveBtn} buttonColor='#1B5E20' mode="contained" onPress={handleSubmit} title='Guardar' />
          </View >)
      }}
    </Formik >
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  apodoContainer: {
    marginBottom: 10
  },
  selectContainer: {
    marginBottom: 10
  },
  saveBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
});