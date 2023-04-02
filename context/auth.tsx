import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

type AuthContextType = {
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

    console.log(`Segments: ${segments}`);

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/home');
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
