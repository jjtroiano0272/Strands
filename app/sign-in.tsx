import { useSession } from '~/context/expoDocsCtx';
import * as Haptics from 'expo-haptics';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import { firebaseConfig } from '~/firebaseConfig';
import { UserContext } from '../context/UserContext';
import { Auth as SignInWithPopup } from '../components/auth/Auth';
import { Link, Stack, useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import { SAMLAuthProvider, GoogleAuthProvider } from 'firebase/auth';
// import { BubbleBackground } from '../../components/AnimatedBackground';
import Particles from 'react-particles';
import { useHaptics } from '~/hooks/useHaptics';
// import { AnimatedBackground } from '../../../components/AnimatedBackground';
// import { getSeedData } from '../../../utils/getSeedData';
// import ParticleAnimation from 'react-particle-animation';

export default function Login() {
  const firebaseAuth = getAuth();
  const myAuth = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const sessionCtx = useSession();
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
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // TODO Only display errors for a few seconds, then fade out, but keep the red line underneath
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email!)) {
      setEmailError('Invalid email format');
    }
  };

  const validatePassword = () => {
    if (password && password.length < 8 && password.length > 0) {
      setPasswordError('Password must be at least 8 characters long');
    }
  };

  // const handleLogin = () => {
  //   // TODO
  //   /**
  //    * Probably use some structure that passes the button type or something to this and then
  //    *    if (google) => signInWithRedirect,
  //    *    if email => singInWithEmail
  //    *    ...
  //    * */
  //   // signInWithRedirect(firebaseAuth, samlProvider);
  //   // Login Logic
  //   signInWithEmailAndPassword(firebaseAuth, email!, password!)
  //     .then(res => {
  //       console.log(`\x1b[34mlogin res: ${JSON.stringify(res, null, 2)}`);
  //       myAuth?.signIn();
  //       userCtx?.setIsLoggedIn(true);
  //       // Alert.alert(`You're in, bbbbbb!`);
  //     })
  //     // Err code:  ERROR  Sign in error! {
  //     //    "code":"auth/user-not-found",
  //     //    "customData":{},
  //     //    "name":"FirebaseError"
  //     // }
  //     .catch(err => {
  //       console.log(`Sign in error! ${err}`);

  //       if (err.code === 'auth/user-not-found') {
  //         setSnackbarVisible(true);
  //         setOriginalFormErrors('No user exists with that name!');
  //       } else if (err.code === 'auth/invalid-email') {
  //         setOriginalFormErrors('Invalid email!');
  //         setSnackbarVisible(true);
  //       } else if (err.code === 'auth/invalid-password') {
  //         setOriginalFormErrors('Invalid password entered!!');
  //         setSnackbarVisible(true);
  //       } else if (err.code === 'auth/missing-email') {
  //         // Client-side should handle this just in the UI
  //         return;
  //       } else {
  //         setOriginalFormErrors('Unspecified error!');
  //         setSnackbarVisible(true);
  //       }
  //     });
  // };

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

  // This function is only reachable iff there are no errors in form
  const handlePressLogin = () => {
    // Trigger haptic feedback for errors or incomplete form
    if (Object.keys(errors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      // If no errors, proceed with form submission
      handleSubmit(onSubmit)();
      setIsFormValid(true);
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
      .then(res => {
        console.log(`\x1b[34mlogin res: \n${JSON.stringify(res, null, 2)}`);
        // myAuth?.signIn();
        // userCtx?.setIsLoggedIn(true);
        sessionCtx?.signIn();
        // Alert.alert(`You're in, bbbbbb!`);

        router.replace('home');
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

  useEffect(() => {
    console.log(`control: ${JSON.stringify(control, null, 2)}`);
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

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* <TextInput
        style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        placeholder='email'
        keyboardType='email-address'
        onChangeText={email => setEmail(email)}
        error={!!emailError}
        onBlur={validateEmail}
        autoFocus={true}
      />
      <HelperText type='error' visible={hasEmailError()}>
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
      <HelperText type='error' visible={hasPasswordError()}>
        Password error
      </HelperText> */}

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
