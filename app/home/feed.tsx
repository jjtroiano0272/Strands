import BottomSheet, {
  useBottomSheet,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Sheet from 'react-modal-sheet';
import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import {
  Alert,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';

import React from 'react';
import { ScrollView } from 'react-native';
import { FireBasePost, IAPIData } from '../../@types/types';
import Colors from '../../constants/Colors';
import useFetch from '../../hooks/useFetch';
import { ExternalLink } from '../../components/ExternalLink';
import { MonoText } from '../../components/StyledText';
import GridItem from '../../components/GridItem';
import { Stack } from 'expo-router';
import { Connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
// import { fetchUser } from '../../redux/actions';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  Avatar,
  Button,
  IconButton,
  List,
  MD3DarkTheme,
  MD3LightTheme,
  Modal,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper';
import { ListItem } from '@rneui/themed';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  WithSpringConfig,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Context } from 'react-native-reanimated/lib/types/lib/reanimated2/hook/commonTypes';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  sortLabels,
  sortLabelsObj,
  springConfig,
} from '../../constants/constants';
import { FirebaseError } from 'firebase/app';

type RedditAPIData = {
  data: [
    {
      data: {
        title: string;
        thumbnail: 'default' | 'self' | 'nsfw';
        url_overridden_by_dest: string;
        author: string;
      };
    }
  ];
  error: string | null;
  loading: string | boolean | null;
};

const Feed = () => {
  // const userPostsCollectionRef = collection(db, 'posts', userID!, 'userPosts');
  const theme = useTheme();
  const [myDbData, setMyDbData] = useState<FireBasePost[] | undefined | null>(
    null
  );
  const userPostsCollectionRef = collection(db, 'postNew');
  const [refreshing, setRefreshing] = useState(false);
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);
  const [finalData, setFinalData] = useState<unknown[] | null>(null);
  const currentUser = getAuth().currentUser;
  const userID = getAuth().currentUser?.uid;
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);
  const sheetStyle = useAnimatedStyle(() => {
    return { top: withSpring(top.value, springConfig) };
  });
  const [sortCriteria, setSortCriteria] = useState<
    { label: string; value: string }[]
  >(
    sortLabels.map(text => ({
      label: text,
      value: text,
    }))
  );
  const [sortingBy, setSortingBy] = useState<
    string | number | Timestamp | null
  >(null);

  const apiUrl = 'https://www.reddit.com/r/FancyFollicles.json';

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const {
    data: redditPlaceholderData,
    error,
    loading,
  }: RedditAPIData = useFetch(apiUrl);

  const fetchMyData = () => {
    let list: DocumentData[] = [];
    getDocs(userPostsCollectionRef)
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list.push(doc.data());
        });

        setMyDbData(list);
      })
      .catch((error: FirebaseError) => {
        console.log(
          'Error getting document: \x1b[34m',
          error.code,
          error.message
        );
      });
  };

  const fetchUsers = async (search: string) => {
    // FIREBASE 8 METHODOLOGY
    // Also, back then firestore didn't contain a fuzzy search
    // firebase
    //   .firestore()
    //   .collection('users')
    //   .where('name', '>=', search)
    //   .get()
    //   .then((snapshot: any) => {
    //     let localUsers = snapshot.docs.map((doc: any) => {
    //       const data = doc.data();
    //       const id = doc.id;
    //       return { id, ...data };
    //     });

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

    console.log(`users: ${JSON.stringify(localUsers)}`);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    fetchMyData();

    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  }, []);

  const handleGesture = useAnimatedGestureHandler({
    onStart(_, context: any) {
      // context.startTop = top.value;
      context.y = top.value;
    },

    onActive(event, context: any) {
      top.value = context.startTop + event.translationY;
      top.value = context.y + event.translationY;
    },

    onEnd(event, context) {
      if (top.value > dimensions.height / 2 + 200) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2;
      }
    },
  });

  const getDataSortedBy = (
    varName: string
  ): FireBasePost[] | undefined | void => {
    let result: FireBasePost[] | undefined | null;
    if (varName === 'rating') {
      result = myDbData?.sort((a, b) => {
        if (a?.rating! > b?.rating!) {
          return 1;
        } else if (a?.rating! < b?.rating!) {
          return -1;
        } else {
          return 0;
        }
      });

      console.log(`result: ${JSON.stringify(result, null, 2)}`);

      // return result;
      myDbData && setMyDbData(result);
    } else {
      console.error(`No data supplied to sort by! Exiting...`);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, [!myDbData]);

  useEffect(() => {
    console.log(`\x1b[32m${JSON.stringify(myDbData, null, 2)}`);
  }, [myDbData]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  // TODO These set the height of the modal but I need some  way to grab the dynamic height of it based on what data is being shown
  const snapPoints = useMemo(() => ['40%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
    console.log('helloooooo?');
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <>
      <BottomSheetModalProvider>
        <ScrollView
          style={styles.getStartedContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />

          {/* TODO Add a filter button for like 'Show me people of x hair type within x miles of me, etc. */}
          <View style={styles.container}>
            {/* TODO Offload to custom component with only the needed text, standardized format */}
            <View style={styles.cardsContainer}>
              {/* {!loading &&
                  !error &&
                  redditPlaceholderData &&
                  redditPlaceholderData
                    .slice(0, redditPlaceholderData.length - 1)
                    .filter(
                      (item: any) =>
                        item.data.thumbnail !== 'default' &&
                        item.data.thumbnail !== 'self' &&
                        item.data.thumbnail !== 'nsfw'
                    )
                    .map((item: any, index: number) => (
                      <GridItem
                        key={index}
                        imgSrc={
                          item.data.thumbnail !== 'self'
                            ? item.data.thumbnail
                            : null
                        }
                        user={{
                          username: item.author,
                          company: {
                            bs: 'foooo',
                            catchPhrase: 'hello',
                            name: JSON.stringify(item.data.ups, null, 2),
                          },
                          name: item.data.author,
                          // Any keys after this aren't consumed by [username]
                          id: 3,
                          address: {
                            street: 'string',
                            suite: 'string',
                            city: 'string',
                            zipcode: 44444,
                            geo: {
                              lat: 50,
                              lng: -20,
                            },
                          },
                          email: 'foo@bar.com',
                          phone: '911',
                          website: 'google.com',
                          seasonal: true,
                        }}
                      />
                    ))} */}
            </View>

            <View style={styles.cardsContainer}>
              {myDbData &&
                myDbData.map((item: FireBasePost, index: number) => (
                  <GridItem
                    key={index}
                    usingMyOwnDB={true}
                    isSeasonal={item?.isSeasonal}
                    auth={item?.auth}
                    imgSrc={
                      item?.downloadURL
                        ? item.downloadURL
                        : `https://unsplash.it/id/${index}200/200`
                    }
                  />
                ))}
            </View>
          </View>

          <Button mode='contained' onPress={handlePresentModalPress}>
            BottomSheet
          </Button>
        </ScrollView>

        <BottomSheetModal
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.text }}
          index={0}
          snapPoints={snapPoints}
          ref={bottomSheetModalRef}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          {sortLabelsObj
            .filter(x => x.displayName !== null)
            .map((label, index: number) => (
              <List.Item
                key={index}
                theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                style={{ width: '100%' }}
                title={label.displayName}
                left={props => <List.Icon {...props} icon={label.icon} />}
                onPress={() => getDataSortedBy(label.varName)}
              />
            ))}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default Feed;

const styles = StyleSheet.create({
  getStartedContainer: {
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  container: { flexDirection: 'row', flexWrap: 'wrap', flex: 1, padding: 8 },
  cardsContainer: {
    // marginHorizontal: 'auto',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  card: {
    width: 190,
    margin: 2,
  },
});
