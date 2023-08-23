import { Link, useRouter } from 'expo-router';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { Text } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import {
  DocumentData,
  collection,
  getDocs,
  or,
  query,
  where,
} from 'firebase/firestore';
import { db, usersRef } from '~/firebaseConfig';
import {
  Avatar,
  Chip,
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
  displayName: string;
  bio: string;
  savedPosts: string[];
  username: string;
  profileImage: string;
  following: string[];
  followers: string[];
  socialMediaLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    reddit: string;
  };
  userID: string;
};

const Search = () => {
  const md5 = require('md5');
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchResults, setSearchResults] = useState<
    (DocumentData | User)[] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const dicebearAvatar = createAvatar(lorelei, {
    seed: 'Kitty',
    backgroundColor: ['662C91', '17A398', '17A398', 'EE6C4D', 'F38D68'],
    radius: 50,
    size: 30,
    // ... other options
  }).toString();

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
    try {
      // FIREBASE 9 METHODOLOGY
      // Ultimately it should have multiple OR conditions with
      //    or(where('displayName', '>=', search), where('username', '>=', search))
      let queryResult: DocumentData[] = [];
      const q = query(usersRef, where('displayName', '>=', search));
      const searchResultSnap = await getDocs(q);
      searchResultSnap.forEach(user => {
        // console.log(`${user.id} => ${JSON.stringify(user.data(), null, 2)}`);
        // console.log(`queryResult: ${JSON.stringify(queryResult, null, 2)}`);

        queryResult.push({ userID: user.id, ...user.data() });
      });
      setSearchResults(queryResult);

      // console.log(`users: ${JSON.stringify(localUsers)}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getGravatarURL = (value?: string) => {
    // Trim leading and trailing whitespace from
    // an email address and force all characters
    // to lower case
    const address = String(value).trim().toLowerCase();

    // Create an MD5 hash of the final string
    const hash = md5(address);

    // Grab the actual image URL
    // return `https://www.gravatar.com/avatar/${hash}`;
    return `https://api.dicebear.com/6.x/lorelei/png/seed=${value}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        searchUsers(searchQuery);
      } else {
        setSearchResults(null);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    console.log(
      `usersFound[0]: ${JSON.stringify(searchResults?.[0], null, 2)}`
    );
  }, [searchResults]);

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

      <FlatList
        // refreshing={refreshing}
        // onRefresh={handleRefresh}
        data={searchResults}
        renderItem={({ item: user }) => (
          <List.Item
            // key={index}
            style={{ marginVertical: 20, padding: 10 }}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            title={user?.displayName}
            description={user?.bio}
            left={props => {
              return (
                <View style={{ flex: 0.25, flexDirection: 'column' }}>
                  <Image
                    source={{
                      uri:
                        user?.profileImage ?? getGravatarURL(user?.displayName),
                    }}
                    style={{ height: 50, width: 50, borderRadius: 20 }}
                  />
                  <Chip
                    icon='information'
                    onPress={() => console.log('Pressed')}
                  >
                    stylist
                  </Chip>
                </View>
              );
            }}
            onPress={() =>
              router.push({
                // pathname: `clients/${clientData?.firstName}${clientData?.lastName}`,
                pathname: `users/${user?.userID}`, // Geraldine
                params: {
                  // clientID: postData?.clientID,
                  // userID: user?.userID,
                  userID: user?.userID,
                },
              })
            }
          />
        )}
        contentContainerStyle={
          !searchResults && {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      />
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
