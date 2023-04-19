import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useAuth } from '../context/auth';
import { UserContext } from '../context/UserContext';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ModalScreen() {
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const auth = useAuth();

  const sortLabels = [
    'id',
    'createdAt',
    'isSeasonal',
    'productsUsed',
    'clientName',
    'displayName',
    'rating',
  ];
  const [sortCriteria, setSortCriteria] = useState<
    { label: string; value: string }[]
  >(
    sortLabels.map(text => ({
      label: text,
      value: text,
    }))
  );
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);

  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Stack.Screen options={{ title: 'Filter' }} />

      <DropDownPicker
        theme={!theme.dark ? 'LIGHT' : 'DARK'}
        placeholder='Sort results by'
        badgeDotColors={['red', 'purple', 'green', 'blue', 'grey']}
        items={sortCriteria}
        max={3}
        mode='BADGE'
        multiple={true}
        open={dropdownOpen}
        setItems={setSortCriteria}
        setOpen={setDropdownOpen}
        setValue={setDropdownValue}
        value={dropdownValue}
      />
      <View
        style={styles.separator}
        // lightColor='#eee'
        // darkColor='rgba(255,255,255,0.1)'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',

    paddingHorizontal: 20,
    paddingVertical: 20,
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
