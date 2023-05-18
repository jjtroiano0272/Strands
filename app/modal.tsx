import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from '~/components/Themed';
import { useAuth } from '~/context/auth';
import { UserContext } from '~/context/UserContext';

export default function ModalScreen() {
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const auth = useAuth();

  const handleLogout = () => {
    // setLogout in Context
    userCtx?.setIsLoggedIn(false);
    auth?.signOut();
  };

  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Stack.Screen options={{ title: 'Information in a modal' }} />

      <Button
        style={{ margin: 30 }}
        contentStyle={{ padding: 30 }}
        mode='contained'
        onPress={handleLogout}
      >
        Logout
      </Button>

      <Text style={styles.title}>Modal</Text>
      <View
        style={styles.separator}
        // lightColor='#eee'
        // darkColor='rgba(255,255,255,0.1)'
      />
      {/* <EditScreenInfo path='app/modal.tsx' /> */}
      <Text>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut dolores
        repudiandae natus id velit quibusdam quasi nihil minima exercitationem
        perspiciatis voluptatum odit alias ad placeat, eum aliquid incidunt nisi
        doloribus. Ullam blanditiis autem quisquam ratione. Voluptatibus nobis
        ipsam maxime obcaecati impedit aliquam deserunt blanditiis suscipit,
        veritatis magni commodi non quasi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
