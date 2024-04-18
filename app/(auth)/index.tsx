import { getValueFor, useSession } from '~/context/expoDocsCtx';
import * as Haptics from 'expo-haptics';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Keyboard, Pressable, StyleSheet } from 'react-native';
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
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { useTheme } from '@react-navigation/native';
import { persistentAuth } from '~/firebaseConfig';
import { UserContext } from '../../context/UserContext';
import { Stack, useRouter } from 'expo-router';
// import { useAuth } from '../context/auth';
import { useAuth } from '~/context/AuthContext';
import { SAMLAuthProvider, GoogleAuthProvider } from 'firebase/auth';
// import { BubbleBackground } from '../../components/AnimatedBackground';
// import { AnimatedBackground } from '../../../components/AnimatedBackground';
// import { getSeedData } from '../../../utils/getSeedData';
// import ParticleAnimation from 'react-particle-animation';
// import chalk from 'chalk';

export default function Login() {
  const chalk = require('chalk'); //Add this
  const chalkCtx = new chalk.Instance({ level: 3 });
  // console.log(ctx.red('red text'));

  const firebaseAuth = getAuth();
  // const myAuth = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const samlProvider = new SAMLAuthProvider('saml.example-provider');
  const googleProvider = new GoogleAuthProvider();
  // Previously defined as:
  //    const [errors, setErrors] = useState<string | undefined | null>();
  const [originalFormErrors, setOriginalFormErrors] = useState<
    string | undefined | null
  >();
  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must contain at least 8 characters'),
  });
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /* 
  _@react-native-async-storage/async-storage@1.21.0
  @react-native-picker/picker@2.6.1 expo-camera@14.0.1 expo-clipboard@5.0.1
  expo-file-system@16.0.4 expo-font@11.10.2 expo-image-picker@14.7.1 expo-linear-gradient@12.7.0 expo-linking@6.2.2
  expo-location@16.5.2 expo-router@3.4.3 expo-secure-store@12.8.1 expo-sensors@12.9.0 expo-splash-screen@0.26.3 expo-status-bar@1.11.1 expo-system-ui@2.9.3 expo-web-browser@12.8.1 lottie-react-native@6.5.1

  react-native@0.73.2 react-native-gesture-handler@2.14.0 react-native-maps@1.8.0 react-native-reanimated@3.6.0 react-native-safe-area-context@4.8.2 react-native-screens@3.29.0 react-native-svg@14.1.0 react-native-web@0.19.6 @types/react@18.2.45 jest-expo@50.0.1 typescript@5.3.0
*/

  // TODO Only display errors for a few seconds, then fade out, but keep the red line underneath
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
          // setOriginalFormErrors(errorMessage);
          // setSnackbarVisible(true);
        });
    } else {
      console.warn(`${provider} selected!`);
    }
  };

  const onSubmit = (formData: { email: string; password: string }) => {
    // console.log(`formData: ${JSON.stringify(formData, null, 2)}`);
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Perform actions with the validated form data
    // What's after this is only accessible once form data is valid

    // TODO
    /**
     * Probably use some structure that passes the button type or something to this and then
     *    if (google) => signInWithRedirect,
     *    if email => singInWithEmail
     *    ...
     * */
    // signInWithRedirect(firebaseAuth, samlProvider);
    // Login Logic
    signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password)
      .then((userCredentials: any) => {
        console.log(
          'User logged in successfully:',
          JSON.stringify(userCredentials, null, 2)
        );

        // sessionCtx?.signIn(userCredentials);

        // console.log(`Replacing route`);
        // // Do later
        // router.replace('home');
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
          setOriginalFormErrors('No user exists with that name!');
        } else if (err.code === 'auth/invalid-email') {
          setOriginalFormErrors('Invalid email!');
          setSnackbarVisible(true);
        } else if (err.code === 'auth/invalid-password') {
          setOriginalFormErrors('Invalid password entered!!');
          setSnackbarVisible(true);
        } else if (err.code === 'auth/missing-email') {
          // Client-side should handle this just in the UI
          return;
        } else {
          setOriginalFormErrors('Unspecified error!');
          setSnackbarVisible(true);
        }
      });
  };

  // This function is only reachable iff there are no errors in form
  const { onLogin } = useAuth();
  const handlePressLogin = async () => {
    const formErrors = Object.keys(errors).length > 0;

    // Trigger haptic feedback for errors or incomplete form
    if (formErrors) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      // If no errors, proceed with form submission
      const formData = getValues(); // Assuming getValues is a function from react-hook-form
      setIsFormValid(true);

      // Perform actions with the validated form data
      // What's after this is only accessible once form data is valid

      // TODO This should actually happen in the AuthContext

      if (onLogin) {
        const newToken = await onLogin(formData.email, formData.password).then(
          (x: any) => {
            console.log(`logged in with token ${JSON.stringify(x, null, 2)}`);
          }
        );
      }
    }
  };

  useEffect(() => {
    // console.log(`control: ${JSON.stringify(control, null, 2)}`);
    console.log(`handleSubmit: ${JSON.stringify(handleSubmit, null, 2)}`);
    console.log(`errors: ${JSON.stringify(errors, null, 2)}`);
    console.log(
      `errors.length: ${JSON.stringify(Object.keys(errors).length, null, 2)}`
    );

    if (errors.email || errors.password) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [control, handleSubmit, errors]);

  useEffect(() => {
    snackbarVisible && Keyboard.dismiss();
  }, [snackbarVisible]);

  const [user, setUser] = useState<User | null>(null);
  // SIMON GRIMM VERSION
  // useEffect(() => {
  //   onAuthStateChanged(FIREBASE_AUTH, user => {
  //     console.log(`authstateChangeduser: ${JSON.stringify(user, null, 2)}`);
  //   });
  // }, []);

  useEffect(() => {
    onAuthStateChanged(persistentAuth, user => {
      if (user) {
        console.log(
          `user @index.useEffect.onAuthStateChanged: ${chalkCtx.green(
            JSON.stringify(user, null, 2)
          )}`
        );
        // sessionCtx?.signIn(user);
      } else {
        console.log(`user: ${chalkCtx.red('signed out')}`);

        // navigation.navigate("login")
      }
    });
  }, [user]);

  // Check for existing user on mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await getValueFor('session')
  //       .then(res =>
  //         console.log(`res@index.fetchData(): ${JSON.stringify(res, null, 2)}`)
  //       )
  //       .catch(err => console.error(`error in calling getValueFor ${err}`));

  //     // if (currentSession) {
  //     //   // sessionCtx?.signIn(currentSession);
  //     // }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <Stack.Screen options={{ headerShown: false }} />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder='Email'
            style={styles.input}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            keyboardType='email-address'
          />
        )}
        name='email'
      />
      <HelperText type='error' visible={!!errors?.email}>
        {errors?.email?.message}
      </HelperText>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder='Password'
            secureTextEntry
            style={styles.input}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            keyboardType='visible-password'
          />
        )}
        name='password'
      />
      <HelperText type='error' visible={!!errors?.password}>
        {errors?.password?.message}
      </HelperText>
      <Button
        style={{ margin: 10, marginTop: 30, width: 300 }}
        mode='contained'
        contentStyle={{ padding: 10 }}
        // onPress={handleLogin}
        onPress={handlePressLogin}
        disabled={!isValid}
      >
        Login
      </Button>
      {/* <Link href='register'> */}
      {/* <Link> */}
      <Button style={{ margin: 10, width: 300 }} contentStyle={{ padding: 20 }}>
        Register
      </Button>
      {/* </Link> */}
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
        {originalFormErrors}
      </Snackbar>
      {/* <AnimatedBackground /> */}
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
