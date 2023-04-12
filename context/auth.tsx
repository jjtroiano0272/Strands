import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

export type AuthContextType = {
  signIn: () => void;
  signOut: () => void;
  user: any; // TODO Define it somehow...
};

// Property 'signOut' does not exist on type 'AuthContextType | null'.ts(2339)
export const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
// TODO Don't use type any in vars
function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup: boolean = segments[0] === '(auth)';

    console.log(`Path: ${segments.join(' > ')}`);

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');

      console.log(`LOGGED OUT`);
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.

      router.replace('/home');

      console.log(`LOGGED IN`);
    }
  }, [user, segments]);
}

export function Provider(props: any) {
  const [user, setAuth] = useState<any | null>(null);

  const signIn = () => {
    console.log(`Signing in from provider`);
    setAuth({});
  };

  const signOut = () => {
    setAuth(null);
    console.log(`in Auth; successfully signed out within Provider!`);
  };

  useProtectedRoute(user);

  /**
   *  From the RN-Firebase docs: https://rnfirebase.io/auth/usage
   * */
  // Set an initializing state whilst Firebase connects
  // const [initializing, setInitializing] = useState(true);
  // // const [user, setUser] = useState();

  // // Handle user state changes
  // function onAuthStateChanged(user: any) {
  //   setAuth(user);
  //   if (initializing) setInitializing(false);
  // }

  // if (initializing) return null;

  // if (!user) {
  //   // return (
  //   //   <View>
  //   //     <Text>Login</Text>
  //   //   </View>
  //   // );
  //   console.log(`no user found!`);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        // TODO Instead, probably just point these to local state vars
        signIn,
        signOut,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
