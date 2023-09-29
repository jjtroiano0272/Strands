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
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Chip,
  IconButton,
  List,
  MD3DarkTheme,
  MD3LightTheme,
  Modal,
  Portal,
  Searchbar,
  TextInput,
  Provider as ModalProvider,
  Paragraph,
  Title,
} from 'react-native-paper';
import { Text } from '../../../components/Themed';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import {
  DocumentData,
  and,
  collection,
  getDocs,
  or,
  query,
  where,
} from 'firebase/firestore';
import { db, postsRef, usersRef } from '~/firebaseConfig';
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
      setIsSearching(true);

      // FIREBASE 9 METHODOLOGY
      // Ultimately it should have multiple OR conditions with
      //    or(where('displayName', '>=', search), where('username', '>=', search))
      let usersQueryResult: DocumentData[] = [];
      let postsQueryResult: DocumentData[] = [];
      // clients
      let finalResult: DocumentData[] = [];

      const searchQuery = query(
        usersRef,
        where(selectedSearchField, '>=', search)
      );
      const searchQuerySnap = await getDocs(searchQuery);
      searchQuerySnap.forEach(user => {
        console.log({ userID: user.id, ...user.data() });
        finalResult.push({ userID: user.id, ...user.data() });
      });

      // SEARCH USERS
      // const usersQuery = query(usersRef, where('displayName', '>=', search));
      // const usersResultsSnap = await getDocs(usersQuery);
      // usersResultsSnap.forEach(user => {
      //   finalResult.push({ userID: user.id, ...user.data() });
      // });

      // SEARCH POSTS
      // const postsQuery = query(postsRef, where('displayName', '>=', search));
      // const postsResultsSnap = await getDocs(postsQuery);
      // postsResultsSnap.forEach(post => {
      //   console.log(`postsQuery post: ${JSON.stringify(post.data(), null, 2)}`);
      //   // finalResult.push({ userID: user.id, ...user.data() });
      // });

      // SEARCH CLIENTS

      // MERGE ALL RESULTS
      setSearchResults(finalResult);

      setIsSearching(false);
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
  const [isSearching, setIsSearching] = useState(false);

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
    console.log(`searchResults: ${JSON.stringify(searchResults, null, 2)}`);
  }, [searchResults]);

  // on 'posts' collection

  /* 
  formulaUsed?: {
    description?: string,
    type?: string;
  },
  geolocation?: {
    lng?: number,
    lat?: number;
  },
  lastUpdatedAt?: {
    seconds?: number,
    nanoseconds?: number;
  },
  media?: {
    images?: string[],
    videos?: string[];
  },
  'bio',
  'clientID',
  'comments',
  'createdAt',
  'displayName',
  'docId',
  'followers',
  'following',
  'postedByDisplayName',
  'profileImage',
  'rating',
  'savedPosts',
  'username',

  'docId',
  'data',
  */
  const availableFields = [
    // Possibly like
    { firebaseField: 'bio' },
    { firebaseField: 'comments' },
    { firebaseField: 'createdAt', displayField: 'Date created' },
    { firebaseField: 'displayName', displayField: 'Name' },
    { firebaseField: 'rating' },
    { firebaseField: 'username' },
    // { firebaseField: 'postedByDisplayName', displayField: '' },
  ];
  const capitalizeFirstLetter = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const [selectedSearchField, setSelectedSearchField] =
    useState<string>('username');
  const [accordionOpen, setAccordionOpen] = useState(false);
  const handleAccordionPress = (field: string) => {
    setSelectedSearchField(field);
    setAccordionOpen(false);
  };
  const handleFilterFieldPress = (field: string) => {
    setSelectedSearchField(field);
    hideModal();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  return (
    <ModalProvider>
      <SafeAreaView>
        {/* <TextInput
          // style={styles.input}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder='Search for user'
          keyboardType='default'
          style={{ width: '100%' }}
          // autoFocus={true}
          // onBlur={validateEmail}
        /> */}

        <Searchbar
          placeholder='Search users or posts'
          onChangeText={setSearchQuery}
          loading={isSearching}
          value={searchQuery}
          right={() => (
            <>
              {selectedSearchField !== 'username' && (
                <Chip
                  icon='information'
                  onClose={() => {
                    console.error('hi there');
                    setSelectedSearchField('username');
                  }}
                >
                  {selectedSearchField}
                </Chip>
              )}
              <IconButton icon='filter-variant' onPress={showModal} />
              <IconButton
                icon='close'
                onPress={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
              />
            </>
          )}
          // clearIcon={() => <IconButton icon='filter-variant' />}
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
              titleStyle={{ fontWeight: 'bold' }}
              description={user?.bio}
              left={props => {
                return (
                  <View style={{ flex: 0.25, flexDirection: 'column' }}>
                    <Image
                      source={{
                        uri:
                          user?.profileImage ??
                          getGravatarURL(user?.displayName),
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
          ListEmptyComponent={
            <Pressable
              onPress={() => Keyboard.dismiss()}
              style={{
                // TODO This actually has some artefacts, but eh whatever. It fixes the problem more than other solutions have yet.
                height: SCREEN_HEIGHT * 0.8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={
                  {
                    // flexGrow: 1,
                    // flex: 1,
                    // marginTop: 50, // TODO this isn't a good solution, but not worth spending time on a UI issue right now
                  }
                }
              >
                {searchQuery && !searchResults ? (
                  <Text>Nothing found!</Text>
                ) : (
                  <Text></Text>
                )}
              </KeyboardAvoidingView>
            </Pressable>
          }
          // contentContainerStyle={
          //   !searchResults && {
          //     // flexGrow: 1,
          //     // flex: 1,
          //     height: windowHeight * 1,
          //     justifyContent: 'center',
          //     alignItems: 'center',
          //   }
          // }
        />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              marginHorizontal: 20,
              borderRadius: 25,
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Title style={{ marginBottom: 16 }}>Search by...</Title>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                // margin: 50,
                // flex: 1,
              }}
            >
              {availableFields.map(field => (
                <Chip
                  icon='information'
                  selected={
                    field.firebaseField === selectedSearchField ? true : false
                  }
                  selectedColor={
                    field.firebaseField === selectedSearchField
                      ? 'blue'
                      : 'black'
                  }
                  showSelectedOverlay
                  onPress={() => handleFilterFieldPress(field.firebaseField)}
                  style={{ margin: 4 }}
                >
                  {field.displayField ??
                    capitalizeFirstLetter(field.firebaseField)}
                </Chip>
              ))}
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </ModalProvider>
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
