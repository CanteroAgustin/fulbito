import { useEffect, useContext, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { FormControl, List, ListItem, MenuItem, InputLabel, Select, Button, TextField } from '@mui/material';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';
import { db } from '../../config/firebase';




WebBrowser.maybeCompleteAuthSession();

const schema = yup.object({
  apodo: yup.string().required(),
}).required();

export default function LoginPage() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [posicion, setPosicion] = useState('');
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleChange = (event) => {
    setPosicion(event.target.value);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "535761942486-oas8lvtva2m7j08qb5nhq0n1uk97kh1j.apps.googleusercontent.com",
    iosClientId: "535761942486-7amoqiclcntblbsu68i5dlk79s2fhlqt.apps.googleusercontent.com",
    webClientId: "535761942486-lip9sci1vcah62g0fpj41lv29nioqqnl.apps.googleusercontent.com"
  })

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response])

  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      await getUserInfo(response.authentication.accessToken);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    const response = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userInfo = await response.json();
    setTempUser(userInfo);
    const docRef = doc(db, "usuarios", userInfo.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
      AsyncStorage.setItem('@user', JSON.stringify(docSnap.data()));
    } else {
      setModalVisible(true);
    }
  };

  const handleSubmitModal = data => {
    setDBUser(data);
  };

  const setDBUser = async data => {
    await setDoc(doc(db, "usuarios", tempUser.id), {
      ...tempUser,
      "apodo": data.apodo,
      posicion
    });
    const unsub = onSnapshot(doc(db, "usuarios", tempUser.id), (doc) => {
      setUser({ ...doc.data() });
      AsyncStorage.setItem('@user', JSON.stringify(...docSnap.data()));
    });
  }

  return (
    <View style={styles.container}>
      {!modalVisible && <FontAwesome.Button disabled={!request} name="google" backgroundColor="#4285F4" style={{ fontFamily: "Roboto" }} onPress={() => {
        promptAsync();
      }}>
        Login with Google
      </FontAwesome.Button>}

      {modalVisible && <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {tempUser && <UserAvatar size={100} src={tempUser.picture} />}
          <Text style={styles.text}>Completa tu perfil de jugador.</Text>
          <form style={{ height: '100%' }} onSubmit={handleSubmit(handleSubmitModal)}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem>
                <Controller
                  name="apodo"
                  control={control}
                  render={({ field }) => <TextField {...field} id="outlined-basic" label="Apodo" variant="outlined" />}
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
      </View>}


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: '100%',
    height: 350,
  },
});