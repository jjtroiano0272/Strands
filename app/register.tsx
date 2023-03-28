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
} from 'firebase/auth';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { firebaseConfig } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';
import { Auth } from '../components/auth/Auth';
import { Link, Stack } from 'expo-router';

export default function Register() {
  const auth = getAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined | null>();

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;

        console.log(`Registered successfully!\n${JSON.stringify(user)}`);

        setErrors('Registered successfully!');
        setSnackbarVisible(true);

        // TODO Set Auth to now be verified, which leads to the user being redirected to feed (since they're logged in)
        user.refreshToken;
        userCtx?.setIsLoggedIn(true);
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        // ..
        console.log(`Registration error!: ${errorCode}: ${errorMessage}`);

        setErrors(`Couldn't register! ${err.message}`);
        setSnackbarVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

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
      <TextInput
        style={{ width: 300 }}
        placeholder='name'
        onChangeText={name => setName(name)}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      />

      <Button
        style={{ margin: 10, marginTop: 30, width: 300 }}
        mode='contained'
        contentStyle={{ padding: 10 }}
        onPress={handleRegister}
      >
        Create account
      </Button>
      {/* <Button
        style={{ margin: 10, width: 300 }}
        contentStyle={{ padding: 20 }}
        // onPress={handleRegister}
        // onPress={handleRegister}
      >
        Register
      </Button> */}

      {/* <Link href='register'>Register me!</Link> */}

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
