import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { SessionProvider } from '~/context/expoDocsCtx';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '/sign-in',
// };

export default function Root() {
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
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
