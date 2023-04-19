import { useCallback, useEffect, useState } from 'react';
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

export type User = {
  id?: string;
  comments?: string;
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
  isSeasonal?: boolean;
  productsUsed?: [
    {
      value?: string;
      label?: string;
    }
  ];
  clientName?: string;
  auth?: {
    displayName?: string;
    uid?: string;
  };
  rating?: number;
};

const Search = () => {
  const md5 = require('md5');
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [displayUsers, setDisplayUsers] = useState<User[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const getGravatarURL = (email: string) => {
    // Trim leading and trailing whitespace from
    // an email address and force all characters
    // to lower case
    const address = String(email).trim().toLowerCase();

    // Create an MD5 hash of the final string
    const hash = md5(address);

    // Grab the actual image URL
    return `https://www.gravatar.com/avatar/${hash}`;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        searchUsers(searchQuery);
      } else {
        setDisplayUsers(null);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      <TextInput
        // style={styles.input}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder='Search for user'
        keyboardType='default'
        autoFocus={true}
        style={{ width: '100%' }}
        // onBlur={validateEmail}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Stack.Screen options={{ headerShown: false }} />

        {displayUsers?.map((user: User, index: number) => (
          <List.Item
            key={index}
            title={user.clientName}
            // description={user.rating}
            onPress={() => console.warn(`Expecting to navigate to user's page`)}
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
    </>
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
