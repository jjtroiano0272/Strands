import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

export type SnackbarContextType = {
  snackbarVisisble: boolean;
  setSnackbarVisible: () => void;
  snackbarMessage: string;
  setSnackbarMessage: () => void;
};

// Property 'signOut' does not exist on type 'AuthContextType | null'.ts(2339)
export const SnackbarContext = createContext<SnackbarContextType | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(SnackbarContext);
}

// This hook will protect the route access based on user authentication.
// TODO Don't use type any in vars
function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // const inAuthGroup: boolean = segments[0] === '(tabs)';
    const inAuthGroup: boolean = true;

    console.log('\x1b[33m', { inAuthGroup }, { user });
    console.log('\x1b[33m', `Path: ${segments.join(' > ')}`);

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      // router.replace('(tabs)/list');

      console.log(`LOGGED OUT`);
    } else if (user && inAuthGroup) {
      console.log(`Book em Danno, I'm in!`);

      // Redirect away from the sign-in page.
      router.replace('(tabs)');
    }
  }, [user]);
}

export function Provider(props: any) {
  const [snackbarMessage, setSnackbarMessage] = useState();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const signIn = () => {
    console.log(`Signing in from provider`);
    setAuth({});
  };

  const signOut = () => {
    setAuth(null);
    console.log(`in Auth; successfully signed out within Provider!`);
  };

  useProtectedRoute(user);

  return (
    <SnackbarContext.Provider
      value={{
        signIn,
        signOut,
        user,
        sortFeedBy,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
}
