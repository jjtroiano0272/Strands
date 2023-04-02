import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { View } from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { firebaseConfig } from '../../firebaseConfig';
import { UserContext } from '../../context/UserContext';
import { Auth } from '../../components/auth/Auth';
import { Link, Stack } from 'expo-router';
import { useAuth } from '../../context/auth';
import { SAMLAuthProvider } from 'firebase/auth';

export default function Login() {
  const auth = getAuth();
  const newAuth = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined | null>();

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const samlProvider = new SAMLAuthProvider('saml.example-provider');

  const firebaseAuth = getAuth();
  signInWithRedirect(firebaseAuth, samlProvider);

  const handleLogin = () => {
    // Login Logic
    signInWithEmailAndPassword(auth, email!, password!)
      .then(res => {
        console.log(`login res: ${JSON.stringify(res)}`);
        newAuth?.signIn();

        userCtx?.setIsLoggedIn(true);
        // Alert.alert(`You're in, bbbbbb!`);
      })
      // Err code:  ERROR  Sign in error! {
      //    "code":"auth/user-not-found",
      //    "customData":{},
      //    "name":"FirebaseError"
      // }
      .catch(err => {
        console.log(`Sign in error! ${err}`);

        if (err.code === 'auth/user-not-found') {
          setErrors('No user exists with that name!');
          setSnackbarVisible(true);
        } else if (err.code === 'auth/invalid-email') {
          setErrors('Invalid email!');
          setSnackbarVisible(true);
        } else if (err.code === 'auth/invalid-password') {
          setErrors('Invalid password entered!!');
          setSnackbarVisible(true);
        } else if (err.code === 'auth/missing-email') {
          // Client-side should handle this just in the UI
          return;
        } else {
          setErrors('Unspecified error!');
          setSnackbarVisible(true);
        }
      });
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;

        console.log(`Registered successfully!\n${JSON.stringify(user)}`);

        Alert.alert('Registeration success!');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(`Registration error!: ${errorCode}: ${errorMessage}`);

        Alert.alert('Could not register!', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TODO This needs to be only on register screen. Makes no sense to have a name field FOR LOGGING IN */}
      {/* <TextInput
        style={{ width: 300 }}
        placeholder='name'
        onChangeText={name => setName(name)}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      /> */}
      <TextInput
        style={{ width: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        onChangeText={email => setEmail(email)}
        // error={!email && true}
      />
      <TextInput
        style={{ width: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='password'
        keyboardType='visible-password'
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <Button
        style={{ margin: 10, marginTop: 30, width: 300 }}
        mode='contained'
        contentStyle={{ padding: 10 }}
        onPress={handleLogin}
      >
        Login
      </Button>

      <Link href='register'>
        <Button
          style={{ margin: 10, width: 300 }}
          contentStyle={{ padding: 20 }}
          // onPress={handleRegister}
          // onPress={() => console.log('registering....')}
        >
          Register
        </Button>
      </Link>

      <Auth />

      <Snackbar
        visible={snackbarVisible}
        duration={3000}
        onDismiss={onDismissSnackBar}
        theme={theme.dark ? MD3LightTheme : MD3DarkTheme}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
      >
        {errors}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
