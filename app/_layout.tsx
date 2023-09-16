import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
// Import the functions you need from the SDKs you need
import { AntDesign } from '@expo/vector-icons';
import { Provider as AuthProvider } from '../context/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// import thunk from 'redux-thunk';

// const store = createStoreHook(rootReducer);

// Initialize Firebase
// export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.error(`Error in root layout: ${error}`);
      throw error;
    }
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
  const router = useRouter();
  const { height } = Dimensions.get('window');

  if (typeof process !== 'undefined' && process.on) {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Optionally, send this to an error tracking service like Sentry
    });
  }

  // const route = useRoute();
  // const showFilterButton = route.name === 'feed'; // Set to true only on the 'feed' route

  return (
    // TODO Combine these two into one Provider
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        {/* <UserProvider> */}

        {/* <Stack
          screenOptions={{
            headerRight: () => (
              <>
                <IconButton
                  icon='filter-outline'
                  size={20}
                  onPress={() => router.push('/filtersModal')}
                />
                <TouchableOpacity
                  hitSlop={{
                    bottom: 50,
                    left: 100,
                    right: 50,
                    top: 50,
                  }}
                  onPress={() => router.push('/modal')}
                >
                  <AntDesign
                    name='infocirlceo'
                    size={24}
                    color={colorScheme === 'dark' ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </>
            ),
            headerTitle: '',
          }}
        > */}
        <Stack
          // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* Optionally configure static options outside the route. */}
          {/* Set the topmost header */}
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
        {/* <SafeAreaView>
            <Stack.Screen
              name='login'
              options={{ headerTitle: 'Login', headerShown: true }}
            />
            <Stack.Screen
              name='(unauth)/register'
              options={{
                headerTitle: 'Create Account',
                headerShown: true,
              }}
            />
            <Stack.Screen name='(tabs)' options={{ headerShown: true }} />
            <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
            <Stack.Screen
              name='filtersModal'
              options={{
                presentation: 'modal',
                contentStyle: { backgroundColor: 'red' },
              }}
            />
          </SafeAreaView> */}
        {/* </Stack> */}

        {/* </UserProvider> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
