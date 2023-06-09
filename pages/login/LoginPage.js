import { useEffect, useContext, useState } from 'react'
import { StyleSheet, View, Modal, Pressable, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from 'react-native-user-avatar';
import { useForm, Controller } from "react-hook-form";

import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Input from '@mui/material/Input';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl } from '@mui/material';

import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

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
    setPosition(event.target.value);
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
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUser(user);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setTempUser(user);
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setModalVisible(true);
    } catch (error) {

    }
  };

  const handleSubmitModal = data => {
    console.log(data);
    setUser(tempUser);
    setModalVisible(!modalVisible)
  };

  return (
    <View style={styles.container}>
      {request && <FontAwesome.Button disabled={!request} name="google" backgroundColor="#4285F4" style={{ fontFamily: "Roboto" }} onPress={() => {
        promptAsync();
      }}>
        Login with Google
      </FontAwesome.Button>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {tempUser && <UserAvatar size={100} src={tempUser.picture} />}
            <Text style={styles.text}>Completa tu perfil de jugador.</Text>
            <form style={{ height: '100%' }} onSubmit={handleSubmit(handleSubmitModal)}>
              <Controller
                name="apodo"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              <p>{errors.apodo?.message}</p>

              <Controller
                name="select"
                control={control}
                render={({ field }) => <FormControl required sx={{ m: 1, minWidth: 120 }}>
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
              <input type="submit" />
            </form>
          </View>
        </View>
      </Modal>


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