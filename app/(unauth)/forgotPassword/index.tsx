import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, useRouter, useSearchParams } from 'expo-router';
import {
  Button,
  HelperText,
  MD3DarkTheme,
  MD3LightTheme,
  TextInput,
  Text,
} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import {
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useAuth } from '~/context/auth';
import { UserContext } from '~/context/UserContext';
// import { passwordReset } from '~/firebaseConfig';
import { FirebaseError } from 'firebase/app';

const ForgotPasswordPage = () => {
  const auth = getAuth();
  const myAuth = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | undefined | null>();
  const [emailSentMessage, setEmailSentMessage] = useState<string>();

  const theme = useTheme();
  const userCtx = useContext(UserContext);

  const router = useRouter();

  const validateEmail = () => {
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else if (email.length === 0 || emailRegex.test(email)) {
      setEmailError(null);
    }
  };

  const handleChangeText = (email: string) => {
    // if (!email) return;

    setEmail(email);
    validateEmail();
  };

  const passwordReset = async (email: string) => {
    console.log(`Running passwordReset....`);
    // firebase.auth().sendPasswordResetEmail(email)

    await sendPasswordResetEmail(auth, email)
      .then(() => console.log(`Reset email sent!`))
      .catch(err => console.error(err));
  };

  const confirmThePasswordReset = async (
    oobCode: string,
    newPassword: string
  ) => {
    if (!oobCode && !newPassword) return;

    return await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const handleResetPassword = async () => {
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log(`Reset email sent!`);
          setEmailSentMessage(
            'Password reset email sent! Check your inbox for the link.'
          );
        })
        .catch(err => console.error(err));
    } catch (error: any) {
      // TODO Don't leave me as 'any'
      if (error.code === 'auth/user-not-found') {
        alert('User not found, try again!');
        setEmail('');
      }
    }
  };

  const searchParams = useSearchParams();
  console.log(`searchParams: ${JSON.stringify(searchParams)}`);

  const [emailSent, setEmailSent] = useState(false);

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1 / 3,
          marginVertical: 20,
          // justifyContent: 'flex-start',
          // alignItems: 'flex-start',
          // backgroundColor: 'red',
        }}
      >
        <LottieView
          source={require('~/assets/images/75971-forgot-password.json')}
          autoPlay={true}
          style={{ marginBottom: 40, height: 250, width: 250 }}
          // speed={0.3}
          // colorFilters={[
          //   { keypath: 'bottom', color: 'rgb(158, 42, 155)' },
          //   { keypath: 'top', color: 'rgb(255, 170, 243)' },
          // ]}
        />
      </View>

      <View style={{ flex: 1 / 3 }}>
        <TextInput
          style={styles.input}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
          placeholder='email'
          keyboardType='email-address'
          textContentType='username'
          error={!!emailError}
          onChangeText={handleChangeText}
          value={email ?? ''}
          // onBlur={validateEmail}
        />
        <HelperText type='error' visible={!!emailError}>
          {emailError}
        </HelperText>
        <Button
          style={{ margin: 10, marginTop: 30, width: 300 }}
          mode={!!emailError ? 'outlined' : 'contained'}
          disabled={!!emailError || !email ? true : false}
          contentStyle={{ padding: 10 }}
          onPress={handleResetPassword}
        >
          Reset
        </Button>

        <Animated.View
          // style={styles.loadingWrapper}
          entering={FadeIn.duration(3000)}
          exiting={FadeOut}
        >
          <Text>{emailSentMessage}</Text>
        </Animated.View>
      </View>

      <View style={{ flex: 1 / 3 }} />
    </Pressable>
  );
};

export default ForgotPasswordPage;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  textHeader: { fontSize: 42 },
  input: { width: 300 },
});
