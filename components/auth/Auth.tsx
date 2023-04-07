import { View, Text } from 'react-native';
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { Button } from 'react-native-paper';
import { auth, googleAuthProvider } from '../../firebaseConfig';
import { areCookiesEnabled } from '@firebase/util';
import Cookies, { Cookie } from 'universal-cookie';

export const Auth = () => {
  const cookie = new Cookies();

  const handleSignIn = async () => {
    await signInWithPopup(auth, googleAuthProvider)
      .then(res => {
        console.log(`in signInWithPopup: ${JSON.stringify(res, null, 2)}`);
        cookie.set('auth-token', res.user.refreshToken);
      })
      .catch(err => console.error(err));
  };

  return <Button onPress={handleSignIn}>Sign in with Popup</Button>;
};
