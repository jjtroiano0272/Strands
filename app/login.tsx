import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
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

export default function Register() {
  const auth = getAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const userCtx = useContext(UserContext);

  const handleLogin = () => {
    // Login Logic
    signInWithEmailAndPassword(auth, email!, password!)
      .then(res => {
        console.log(`login res: ${JSON.stringify(res)}`);
        userCtx?.setIsLoggedIn(true);
        Alert.alert(`You're in, bbbbbb!`);
      })
      .catch(err => console.error(`Sign in error! ${err}`));
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
      <TextInput
        style={{ width: 300 }}
        placeholder='name'
        onChangeText={name => setName(name)}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      />
      <TextInput
        style={{ width: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        onChangeText={email => setEmail(email)}
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
      <Button
        style={{ margin: 10, width: 300 }}
        contentStyle={{ padding: 20 }}
        onPress={handleRegister}
      >
        Register
      </Button>
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
