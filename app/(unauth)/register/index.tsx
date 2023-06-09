import { Pressable, StyleSheet } from 'react-native';
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
import { Stack, useRouter } from 'expo-router';
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

  const router = useRouter();
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
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else if (email.length === 0 || emailRegex.test(email)) {
      setEmailError(null);
    }
  };

  const validatePassword = () => {
    if (!password) return;

    if (password.length < 8 && password.length > 0) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (password.length === 0) {
      setPasswordError(null);
    } else {
      setPasswordError(null);
    }
  };

  const validateLicenseId = () => {
    if (!licenseId) return;

    const licenseIdRegex = /^[A-Za-z]{2}\d{7}$/;
    if (!licenseIdRegex.test(licenseId)) {
      setLicenseError('A license must have two letters followed by 7 numbers!');
    } else if (licenseId.length === 0 || licenseIdRegex.test(licenseId)) {
      setLicenseError(null);
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
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      {/* <View style={styles.container}> */}
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
        textContentType='username'
        error={!!emailError}
        onBlur={validateEmail}
        onChangeText={email => setEmail(email)}
        autoFocus={true}
      />
      <HelperText type='error' visible={!!emailError}>
        {emailError}
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='password'
        keyboardType='visible-password'
        textContentType={
          password && password.length > 0 ? 'password' : 'newPassword'
        }
        error={!!passwordError}
        onBlur={validatePassword}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <HelperText type='error' visible={!!passwordError}>
        {passwordError}
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='name'
        onChangeText={name => setName(name)}
      />
      <HelperText type='error' visible={false}>
        Keep this here for consistent spacing
      </HelperText>

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='license number'
        error={!!licenseError}
        onBlur={validateLicenseId}
        onChangeText={licenseId => setLicenseId(licenseId.toUpperCase())}
        value={licenseId ?? ''}
      />
      <HelperText type='error' visible={!!licenseError}>
        {licenseError}
      </HelperText>

      <Button
        style={{ margin: 10, marginTop: 30, width: 300 }}
        mode={
          !!emailError || !!passwordError || !!licenseError
            ? 'outlined'
            : 'contained'
        }
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
      {/* </View> */}
    </Pressable>
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
