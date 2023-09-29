import { useEffect, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { doc, getDoc } from "firebase/firestore";

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { db } from '../config/firebase';
import FormLogin from '../components/formLogin';

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUser, setTempUser] = useState(null);

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
      console.log("response success from google");
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

  return (
    <View style={styles.container}>
      {!modalVisible && <FontAwesome.Button disabled={!request} name="google" backgroundColor="#4285F4" style={{ fontFamily: "Roboto" }} onPress={() => {
        promptAsync();
      }}>
        Login with Google
      </FontAwesome.Button>}
      {modalVisible &&
        <FormLogin tempUser={tempUser} />}
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
});