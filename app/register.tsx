import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Keyboard } from 'react-native';
import {
  Button,
  HelperText,
  MD3DarkTheme,
  MD3LightTheme,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { UserContext } from '~/context/UserContext';
import { Auth as SignInWithPopupButton } from '~/components/auth/Auth';
import { useAuth } from '~/context/auth';

export default function RegisterPage() {
  const auth = getAuth();
  const myAuth = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [licenseId, setLicenseId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | undefined | null>();

  const theme = useTheme();
  const userCtx = useContext(UserContext);

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;

        console.log(
          `Registered successfully!\n${JSON.stringify(user, null, 2)}`
        );

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

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email!)) {
      setEmailError('Invalid email format');
    }
  };

  const validatePassword = () => {
    if (password!.length < 8 && password!.length > 0) {
      setPasswordError('Password must be at least 8 characters long');
    }
  };

  const validateLicenseId = () => {
    const licenseIdRegex = /^[A-Za-z]{2}\d{7}$/;
    if (!licenseIdRegex.test(licenseId!)) {
      setLicenseError('A license must have two letters followed by 7 numbers!');
    }
  };

  const validateForm = () => {
    validateEmail();
    validatePassword();
    validateLicenseId;
    return !emailError && !passwordError && !licenseError;
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

      {/* TODO Offload into its own customizable component that I can iterate over */}
      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        error={!!emailError}
        onBlur={validateEmail}
        onChangeText={email => setEmail(email)}
        autoFocus={true}
      />
      <HelperText type='error' visible={!!emailError}>
        Email address is invalid!
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='password'
        keyboardType='visible-password'
        error={!!passwordError}
        onBlur={validatePassword}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <HelperText type='error' visible={!!passwordError}>
        Email address is invalid!
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='name'
        onChangeText={name => setName(name)}
      />
      <HelperText type='error' visible={false}>
        Email address is invalid!
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='license number'
        error={!!licenseError}
        onBlur={validateLicenseId}
        onChangeText={licenseId => setLicenseId(licenseId)}
      />
      <HelperText type='error' visible={!!licenseError}>
        Email address is invalid!
      </HelperText>

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
