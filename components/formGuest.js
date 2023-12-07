import { useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import loginValidationSchema from '../schemas/login-schema';
import { Formik } from 'formik';
import uuid from 'react-native-uuid';
import { AddToPlayerList } from '../services/matchService';
import { toInformPlayerAddedMsg } from '../shared/utils/matchUtil';
import { shareToWhatsApp } from '../services/whatsappService';

export default function FormGuest({ match, closeGuestModalEvent }) {
  const [posicion, setPosicion] = useState('Arquero');

  const positionsList = [
    { key: '1', value: 'Arquero' },
    { key: '2', value: 'Defensor' },
    { key: '3', value: 'Medio' },
    { key: '4', value: 'Delantero' },
  ]

  const handleSubmitModal = data => {
    let guest = { apodo: '', posicion: '', rol: '' };
    let pos = (posicion != 1) ? posicion : 'Arquero'
    guest.id = uuid.v4();
    guest.apodo = data.apodo;
    guest.posicion = pos;
    guest.rol = ['invitado'];
    AddToPlayerList(match, guest);
    closeGuestModalEvent();
  };

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

            <Button disabled={!isValid} style={styles.saveBtn} buttonColor='#1B5E20' mode="contained" onPress={handleSubmit} title='Agregar invitado' />
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    padding: 10
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