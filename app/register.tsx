import { Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  TextInput,
} from 'react-native-paper';
import { View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { DarkTheme, useTheme } from '@react-navigation/native';

export default function Register() {
  const auth = getAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log(`Registered successfully!\n${JSON.stringify(user)}`);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(`Registration error!: ${errorCode}: ${errorMessage}`);
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
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        style={{ width: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='password'
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <Button
        onPress={handleRegister}
        contentStyle={{ padding: 30 }}
        style={{ margin: 10 }}
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
