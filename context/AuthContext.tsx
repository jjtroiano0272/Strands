import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Redirect, useRouter } from 'expo-router';
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '~/firebaseConfig';
import { trace } from 'loglevel';
// import { ExtendedUser } from '~/@types/types';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

interface ExtendedUser extends User {
  user?: {
    stsTokenManager?: {
      refreshToken: string;
      accessToken: string;
      expirationTime: number;
    };
  };
}

const TOKEN_KEY = 'myJwt';
export const API_URL = 'foo';
export const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    console.log(`On mount: loadToken...`);

    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log(`stored token: ${token}`);

      if (token) {
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setAuthState({ token: token, authenticated: true });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      // TODO Path changes
      return await axios.post(`${API_URL}/users`, { email, password });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  // @06:25
  // const login = async (email: string, password: string, type?: string) => {
  const login = async (email: string, password: string) => {
    try {
      let accessToken;
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password).then(
        // TODO Fuck it. I'm done with trying to get the types to match correctly. Fix later.
        (res: any) => {
          console.log(`res: ${JSON.stringify(res, null, 2)}`);
          console.log(res?.user?.stsTokenManager.accessToken);

          accessToken = res?.user?.stsTokenManager?.accessToken;

          setAuthState({
            token: accessToken,
            authenticated: true,
          });
        }
      );

      if (accessToken) {
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        console.log(`logging the accessToken ${accessToken}`);
      }

      // router.replace('home');

      return accessToken;
    } catch (error) {
      // TODO This errors out because the structure of the error object is wrong
      // return { error: true, msg: (error as any).response.data.msg };
      console.log(`Sign in error! ${error}`);
      return { error: true, msg: error as any };
    }
  };

  // Other versions changed
  /* 
  expo 48 -> 50
  npx expo install @react-native-async-storage/async-storage@1.17.11 expo-file-system@~15.2.2 expo-secure-store@~12.1.1 lottie-react-native@5.1.4 react-native@0.71.14

  @expo/vector-icons@14.0.0    @react-native-async-storage/async-storage@1.21.0    @react-native-picker/picker@2.6.1    expo-camera@14.0.1    expo-clipboard@5.0.1    expo-file-system@16.0.4    expo-font@11.10.2    expo-image-picker@14.7.1    expo-linear-gradient@12.7.0    expo-linking@6.2.2    expo-location@16.5.2    expo-router@3.4.3    expo-secure-store@12.8.1    expo-sensors@12.9.0    expo-splash-screen@0.26.3    expo-status-bar@1.11.1    expo-system-ui@2.9.3    expo-web-browser@12.8.1    lottie-react-native@6.5.1    react-native@0.73.2    react-native-gesture-handler@2.14.0    react-native-maps@1.8.0    react-native-reanimated@3.6.0    react-native-safe-area-context@4.8.2    react-native-screens@3.29.0    react-native-svg@14.1.0    react-native-web@0.19.6    @types/react@18.2.45    jest-expo@50.0.1    typescript@5.3.0    */
  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(err =>
      console.log(`logout error ${err}`)
    );
    setAuthState({ token: null, authenticated: false });
    // axios.defaults.headers.common['Authorization'] = ``;
  };

  // I added this
  useEffect(() => {
    console.log(`authState: ${JSON.stringify(authState, null, 2)}`);

    if (authState?.authenticated) {
      router.replace('home');
    } else {
      router.replace('/');
    }
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
