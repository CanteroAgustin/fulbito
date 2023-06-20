import { useContext, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';

import { FormControl, List, ListItem, MenuItem, InputLabel, Select, Button, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useForm, Controller } from "react-hook-form";
import UserAvatar from 'react-native-user-avatar';

import loginValidationSchema from '../schemas/login-schema';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

export default function FormLogin({ tempUser }) {
  const [posicion, setPosicion] = useState('');
  const { _, setUser } = useContext(AuthenticatedUserContext);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginValidationSchema)
  });

  const handleSubmitModal = data => {
    setDBUser(data);
  };

  const handleChange = (event) => {
    setPosicion(event.target.value);
  };

  const setDBUser = async data => {
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
      posicion
    });
    onSnapshot(doc(db, "usuarios", tempUser.id), (doc) => {
      setUser({ ...doc.data() });
      AsyncStorage.setItem('@user', JSON.stringify(...doc.data()));
    });
  }

  return (<View style={styles.centeredView}>
    <View style={styles.modalView}>
      {tempUser && <UserAvatar size={100} src={tempUser.picture} />}
      <Text style={styles.text}>Completa tu perfil de jugador.</Text>
      <form style={{ height: '100%' }} onSubmit={handleSubmit(handleSubmitModal)}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <ListItem>
            <Controller
              name="apodo"
              control={control}
              render={({ field }) => <TextField required {...field} id="outlined-basic" label="Nombre para mostrar" variant="outlined" />}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="select"
              control={control}
              render={({ field }) => <FormControl required sx={{ minWidth: '100%' }}>
                <InputLabel id="demo-controlled-open-select-label">Posicion</InputLabel>
                <Select
                  {...field}
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={posicion}
                  label="Posicion *"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'arquero'}>Arquero</MenuItem>
                  <MenuItem value={'defensor'}>Defensor</MenuItem>
                  <MenuItem value={'medio'}>Medio</MenuItem>
                  <MenuItem value={'delantero'}>Delantero</MenuItem>
                </Select>
              </FormControl>
              }
            />
          </ListItem>
          <ListItem>
            <Button type="submit" variant="contained" sx={{ minWidth: '100%' }}>Finalizar</Button>
          </ListItem>
        </List>
      </form>
    </View>
  </View>)
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});