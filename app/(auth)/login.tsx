import FontAwesome from '@expo/vector-icons/FontAwesome5';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  HelperText,
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
  signInWithPopup,
  OAuthCredential,
  UserCredential,
} from 'firebase/auth';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { firebaseConfig } from '../../firebaseConfig';
import { UserContext } from '../../context/UserContext';
import { Auth as SignInWithPopup } from '../../components/auth/Auth';
import { Link, Stack } from 'expo-router';
import { useAuth } from '../../context/auth';
import { SAMLAuthProvider, GoogleAuthProvider } from 'firebase/auth';

export default function Login() {
  const firebaseAuth = getAuth();
  const myAuth = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const [errors, setErrors] = useState<string | undefined | null>();

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const samlProvider = new SAMLAuthProvider('saml.example-provider');
  const googleProvider = new GoogleAuthProvider();

  // TODO Only display errors for a few seconds, then fade out, but keep the red line underneath
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

  const handleLogin = () => {
    // TODO
    /**
     * Probably use some structure that passes the button type or something to this and then
     *    if (google) => signInWithRedirect,
     *    if email => singInWithEmail
     *    ...
     * */
    // signInWithRedirect(firebaseAuth, samlProvider);
    // Login Logic
    signInWithEmailAndPassword(firebaseAuth, email!, password!)
      .then(res => {
        console.log(`login res: ${JSON.stringify(res)}`);
        myAuth?.signIn();

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
          setSnackbarVisible(true);
          setErrors('No user exists with that name!');
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

  const handleSSOLogin = (provider: string) => {
    const firebaseAuth = getAuth();

    if (provider === 'google') {
      signInWithPopup(firebaseAuth, googleProvider)
        .then((result: UserCredential) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential: OAuthCredential | null =
          //   GoogleAuthProvider.credentialFromResult(result);
          // const token = credential?.accessToken;
          // // The signed-in user info.
          // console.log(`in Google SSO, token: ${token}`);
          // const user = result.user;
          // // IdP data available using getAdditionalUserInfo(result)
          // console.log(`user: ${user}`);
        })
        .catch(error => {
          // Handle Errors here.
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // // The email of the user's account used.
          // const email = error.customData.email;
          // // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          // setErrors(errorMessage);
          // setSnackbarVisible(true);
        });
    } else {
      console.warn(`${provider} selected!`);
    }
  };

  useEffect(() => {
    snackbarVisible && Keyboard.dismiss();
  }, [snackbarVisible]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        onChangeText={email => setEmail(email)}
        error={!!emailError}
        onBlur={validateEmail}
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
        onChangeText={password => setPassword(password)}
        error={!!passwordError}
        onBlur={validatePassword}
        secureTextEntry={true}
      />
      <HelperText type='error' visible={!!emailError}>
        Email address is invalid!
      </HelperText>

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
        >
          Register
        </Button>
      </Link>
      {/* <SignInWithPopup /> */}
      {/* <Button onPress={handleSSOLogin}>Foo</Button> */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50,
          width: '100%',
        }}
      >
        {['google', 'microsoft', 'apple'].map(
          (provider: string, index: number) => (
            <FontAwesome.Button
              key={index}
              style={{ padding: 5 }}
              size={42}
              name={provider}
              backgroundColor='transparent'
              color='#ccc'
              children={null}
              onPress={() => handleSSOLogin(provider)}
            />
          )
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        duration={3000}
        onDismiss={onDismissSnackBar}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        action={{
          label: 'OK',
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
  input: { width: 300 },
});
