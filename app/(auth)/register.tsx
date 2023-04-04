import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { firebaseConfig } from '../../firebaseConfig';
import { Link, Stack } from 'expo-router';
import { UserContext } from '../../context/UserContext';
import { Auth as SignInWithPopupButton } from '../../components/auth/Auth';
import { Keyboard } from 'react-native';
import { useAuth } from '../../context/auth';

export default function Register() {
  const auth = getAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [licenseId, setLicenseId] = useState<string | null>(null);
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined | null>();

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const myAuth = useAuth();

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;

        console.log(`Registered successfully!\n${JSON.stringify(user)}`);

        setErrors('Registered successfully!');
        setSnackbarVisible(true);

        // TODO Set Auth to now be verified, which leads to the user being redirected to feed (since they're logged in)
        // user.refreshToken;
        userCtx?.setIsLoggedIn(true);
        myAuth?.signIn();
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

  // TODO Temporary workaround for getting the keyboard out of the way only when there's an error
  useEffect(() => {
    snackbarVisible && Keyboard.dismiss();
  }, [snackbarVisible]);

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    > */}
      <Stack.Screen options={{ headerShown: false }} />

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        onChangeText={email => setEmail(email)}
        // error={!email && true}
      />
      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='password'
        keyboardType='visible-password'
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='name'
        onChangeText={name => setName(name)}
      />
      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='license number'
        onChangeText={licenseId => setLicenseId(licenseId)}
      />

      <Button
        style={{ margin: 10, marginTop: 30, width: 300 }}
        mode='contained'
        contentStyle={{ padding: 10 }}
        onPress={handleRegister}
      >
        Create account
      </Button>

      <SignInWithPopupButton />

      <Snackbar
        visible={snackbarVisible}
        duration={3000}
        onDismiss={onDismissSnackBar}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
      >
        {errors}
      </Snackbar>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { width: 300 },
});
