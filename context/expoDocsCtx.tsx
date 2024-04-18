import { firebaseConfig, persistentAuth } from '~/firebaseConfig';
import * as SecureStore from 'expo-secure-store';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Dimensions, useColorScheme } from 'react-native';
/* Referenced from https://docs.expo.dev/router/reference/authentication/ */
import React, { useEffect, useState } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { Slot, useRouter } from 'expo-router';
import { ccolors } from '~/constants/conosleColors';
import { User, onAuthStateChanged } from 'firebase/auth';
// import * as Colors from 'colors';

const AuthContext = React.createContext<{
  signIn: (userCredentials: { [key: string]: any }) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
    .then(() => console.log(`SetItemAsync success`))
    .catch(err => console.error(`Error in setting item async: ${err}`));
}
export async function deleteKey(key: string) {
  await SecureStore.deleteItemAsync(key)
    .then(() => console.log(`deleteItemAsync success`))
    .catch(err => console.error(`Error in deleting item async: ${err}`));
}

export async function getValueFor(key: string) {
  await SecureStore.getItemAsync(key)
    .then(res => {
      if (res) {
        console.log(`\x1b[30m🔐 Here's your value for key ${key} 🔐`);
        console.log(JSON.stringify(JSON.parse(res), null, 2));
      }

      return res;
    })
    .catch(err =>
      console.error(`No values stored under that key. Key: ${key}`)
    );

  // if (result) {
  //   console.log(`🔐 Here's your value for key ${key} 🔐 \n${result}`);
  //   return result;
  // } else {
  //   console.log(`No values stored under that key. Key: ${key}`);
  //   return null;
  // }
}

export function SessionProvider(props: React.PropsWithChildren) {
  const chalk = require('chalk'); //Add this
  const ctx = new chalk.Instance({ level: 3 });

  // Session is the name of the key, but not it's value. The one inside the return is the actal value
  // This checks if session currently has a value (user was signed in) or is null (explicitly signed out)
  const [[isLoading, session], setSession] = useStorageState('session');
  const colorScheme = useColorScheme();
  const router = useRouter();

  // if (session) {
  //   router.replace('home');
  // }

  useEffect(() => {
    console.log(
      'session: ',
      session ? ctx.green(JSON.stringify(session, null, 2)) : ctx.red(session)
    );

    console.log(`Session is considered ${!!session}`);
  }, [session]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContext.Provider
        value={{
          signIn: (userCredentials?: any) => {
            // Perform sign-in logic here
            console.log(
              `Should be seeing the userCredentials passed here in ctx: ${JSON.stringify(
                userCredentials,
                null,
                2
              )}`
            );
            // jwt is located at userCredentials.stsTokenManager.refreshToken, accessToken, expirationTime

            // setSession(userCredentials ?? 'xxx');
            console.log(`Right before setting session from JSON value`);

            setSession(userCredentials);
            // TODO This is the one that throws error for being too big
            console.log(
              `Uhh fuckin hello!?: ${JSON.stringify(
                userCredentials?.user?.stsTokenManager,
                null,
                2
              )}`
            );

            save(
              'session',
              JSON.stringify(userCredentials?.user?.stsTokenManager)
            );

            console.log(`Inside signIn function`);
          },
          signOut: () => {
            setSession(null);
            deleteKey('session');
          },
          session,
          isLoading,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
