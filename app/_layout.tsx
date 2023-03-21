import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, SplashScreen, Stack, Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '../firebaseConfig';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserProvider } from '../context/UserContext';
import { Provider as ReduxProvider } from 'react-redux';
import { createStoreHook } from 'react-redux';
import rootReducer from '../redux/reducers';
// import thunk from 'redux-thunk';

// const store = createStoreHook(rootReducer);

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'home',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  if (false) {
    return (
      <Stack
        screenOptions={{
          headerRight: () => (
            <AntDesign
              name='infocirlceo'
              size={24}
              color={colorScheme === 'dark' ? 'white' : 'black'}
              onPress={() => router.push('/modal')}
            />
          ),
        }}
      >
        <Stack.Screen name='login' />
      </Stack>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <ReduxProvider store={store}> */}
      <UserProvider>
        <Stack
          screenOptions={{
            headerRight: () => (
              <AntDesign
                name='infocirlceo'
                size={24}
                color={colorScheme === 'dark' ? 'white' : 'black'}
                onPress={() => router.push('/modal')}
              />
            ),
          }}
        >
          <Stack.Screen
            name='home'
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
        </Stack>
      </UserProvider>
      {/* </ReduxProvider> */}
    </ThemeProvider>
  );
}
