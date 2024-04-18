import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Slot, SplashScreen, Tabs, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import { SessionProvider } from '~/context/expoDocsCtx';
// import Login from './(auth)/login';
import AuthStack from './(tabs)/_layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import UnauthorizedLayout from './(auth)/_layout';
// import { NavigationContainer } from 'expo-router/src/NavigationContainer';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '/sign-in',
// };

export default function App() {
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
  // const { session, isLoading } = useSession();

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* {authState?.authenticated ? <AuthStack /> : <Redirect href='/' />} */}
        {/* But this probably won't UPDATE.... */}
        {/* <Slot /> */}
        <Layout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth(); // Simon Grimm one https://www.youtube.com/watch?v=9vydY9SDtAo&t=814s
  const iconSize = 24;

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarShowLabel: true,
    //     tabBarActiveTintColor: 'purple',
    //   }}
    // >
    //   {authState?.authenticated ? (
    //     <>
    //       <Tabs.Screen
    //         name='home'
    //         options={{
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => (
    //             <FontAwesome name='home' size={iconSize} color={color} />
    //           ),

    //           tabBarLabel: 'Home',
    //         }}
    //       />
    //       <Tabs.Screen
    //         name='search'
    //         options={{
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => (
    //             <FontAwesome name='search' size={iconSize} color={color} />
    //           ),
    //           tabBarLabel: 'Search',
    //         }}
    //       />
    //       <Tabs.Screen
    //         name='add'
    //         options={{
    //           headerShown: false,
    //           tabBarIcon: ({ color, focused }) => (
    //             <FontAwesome
    //               name='plus'
    //               size={iconSize}
    //               color={focused ? 'red' : color}
    //             />
    //           ),
    //           tabBarLabel: '',
    //         }}
    //       />
    //       <Tabs.Screen
    //         name='myProfile'
    //         options={{
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => (
    //             <FontAwesome
    //               name='user-circle-o'
    //               size={iconSize}
    //               color={color}
    //             />
    //           ),
    //           tabBarLabel: 'Profile',
    //         }}
    //       />

    /* 
    --expo@50.0.4 - expected version: ~50.0.11
    expo-camera@14.0.6 expo-file-system@16.0.8 expo-font@11.10.3 expo-linear-gradient@12.7.2 expo-location@16.5.5 expo-router@3.4.8 react-native@0.73.4 react-native-maps@1.10.0 jest-expo@50.0.3
    */

    //       <Tabs.Screen name='clientInCommon' options={{ href: null }} />
    //       <Tabs.Screen name='clients' options={{ href: null }} />
    //       <Tabs.Screen name='posts' options={{ href: null }} />
    //       <Tabs.Screen name='postsByCurrentUser' options={{ href: null }} />
    //       <Tabs.Screen name='users' options={{ href: null }} />
    //       <Tabs.Screen name='details' options={{ href: null }} />
    //       <Tabs.Screen name='messages' options={{ href: null }} />
    //     </>
    //   ) : (
    //     <Tabs.Screen name='/' /> // also called index
    //   )}
    // </Tabs>
    <Stack screenOptions={{ headerShown: false }}>
      {authState?.authenticated ? (
        <Stack.Screen name='DUMMY_HOME' />
      ) : (
        <Stack.Screen name='DUMMY_AUTH' />
      )}
    </Stack>

    // NOTE FROM TUES JAN 30
    /* Welp, dunno WHY the fuck it navigates to the correct page, even though it's set 
    above to go to dummy home or auth...but it SEEMS to currently work.
    
    npm i expo@50.0.13 expo-camera@14.1.1 react-native@0.73.5 jest-expo@50.0.4
    */
  );
};
