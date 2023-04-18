import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Avatar,
  List,
  MD3DarkTheme,
  MD3LightTheme,
  TextInput,
} from 'react-native-paper';
import React from 'react';

const Search = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [displayUsers, setDisplayUsers] = useState<unknown[] | null>(null);

  const handleRefresh = useCallback(() => {
    // setRefreshing(true);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // fetchMyData();
    // setTimeout(() => {
    //   setRefreshing(false);
    //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // }, 2000);
  }, []);

  const searchUsers = async (search: string) => {
    const foo = getGravatarURL('jtroiano@fau.edu');
    console.log(`HASH: ${foo}`);

    // FIREBASE 9 METHODOLOGY
    // const db = getFirestore();
    const q = query(
      collection(db, 'postNew'),
      where('clientName', '>=', search)
    );

    const snapshot = await getDocs(q);

    let localUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });

    setDisplayUsers(localUsers);

    console.log(`users: ${JSON.stringify(localUsers)}`);
  };

  const md5 = require('md5');

  function getGravatarURL(email: string) {
    // Trim leading and trailing whitespace from
    // an email address and force all characters
    // to lower case
    const address = String(email).trim().toLowerCase();

    // Create an MD5 hash of the final string
    const hash = md5(address);

    // Grab the actual image URL
    return `https://www.gravatar.com/avatar/${hash}`;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TextInput
        // style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        onChangeText={searchUsers}
        placeholder='Search for user'
        keyboardType='default'
        autoFocus={true}
        style={{ width: '100%' }}
        // onBlur={validateEmail}
      />
      {displayUsers?.map((user: unknown, index: number) => (
        <List.Item
          key={index}
          title='First Item'
          description='Item description'
          left={props => (
            <List.Icon
              {...props}
              icon={
                true
                  ? () => (
                      <Avatar.Image
                        size={24}
                        source={{ uri: 'https://unsplash.it/100/100' }}
                      />
                    )
                  : 'folder'
              }
            />
          )}
        />
      ))}
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    flex: 1,
    padding: 8,
  },
  // input: { width: '100%' },
});
