import { useEffect, useContext } from 'react'
import { StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const { user, setUser } = useContext(AuthenticatedUserContext);

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
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUser(user);
    } catch (error) {

    }
  };

  return (
    <View style={styles.container}>
      {request && <FontAwesome.Button disabled={!request} name="google" backgroundColor="#4285F4" style={{ fontFamily: "Roboto" }} onPress={() => {
        promptAsync();
      }}>
        Login with Google
      </FontAwesome.Button>}




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