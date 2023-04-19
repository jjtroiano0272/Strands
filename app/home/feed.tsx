import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback } from 'react';
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
import { IAPIData } from '../../@types/types';
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
  Modal,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper';
import { BottomSheet, ListItem } from '@rneui/themed';
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

type MyDbData = {
  caption: string;
  creation: Timestamp;
  downloadURL: string;
};

const Feed = () => {
  const theme = useTheme();
  const [myDbData, setMyDbData] = useState<DocumentData[] | null>(null);
  const currentUser = getAuth().currentUser;
  const userID = getAuth().currentUser?.uid;
  // const userPostsCollectionRef = collection(db, 'posts', userID!, 'userPosts');
  const userPostsCollectionRef = collection(db, 'postNew');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const {
    data,
    error,
    loading,
  }: {
    data: [
      {
        data: {
          title: string;
          thumbnail: string | 'self';
          url_overridden_by_dest: string;
          author: string;
        };
      }
    ];
    error: any;
    loading: any;
  } = useFetch('https://www.reddit.com/r/FancyFollicles.json');
  data?.length !== undefined &&
    console.log(`num items in data: ${data?.length}`);

  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    fetchMyData();

    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  }, []);

  // TODO There's a better way to write this so the output gets stored in a var

  const fetchMyData = () => {
    let list: DocumentData[] = [];
    getDocs(userPostsCollectionRef)
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list.push(doc.data());

          // setMyDbData([...myDbData!, data]);
        });

        setMyDbData(list);
        console.log(`myDbData: \x1b[32m${JSON.stringify(myDbData, null, 2)}`);
      })
      .catch(error => {
        console.log('Error getting document:', error);
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

  const gestureHandler = useAnimatedGestureHandler({
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

  const sheetStyle = useAnimatedStyle(() => {
    return { top: withSpring(top.value, springConfig) };
  });

  const springConfig: WithSpringConfig = {
    damping: 0.1,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 2,
    stiffness: 1000,
  };

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
  const [sortingBy, setSortingBy] = useState<
    string | number | Timestamp | null
  >(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);

  useEffect(() => {
    fetchMyData();
  }, [!myDbData]);

  return (
    // TODO Pull down to refresh (run API call again, but only dispatch to anything that has CHANGED)
    <>
      <Provider>
        <Portal>
          <ScrollView
            style={styles.getStartedContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
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
                {/* TODO Change to control this from root layout so the navbar can handle it */}
                {/* <Button onPress={() => setShowFilterModal(true)}>
                Filter placeholder
              </Button> */}

                {!loading &&
                  !error &&
                  data &&
                  data
                    .slice(0, data.length - 1)
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
                    ))}
              </View>

              <View style={styles.cardsContainer}>
                {myDbData &&
                  myDbData?.map((item: any, index: number) => (
                    <GridItem
                      usingMyOwnDB={true}
                      isSeasonal={item.isSeasonal}
                      auth={item?.auth}
                      key={index}
                      imgSrc={
                        item.downloadURL
                          ? item.downloadURL
                          : 'https://unsplash.it/200/200'
                      }
                    />
                  ))}
              </View>
            </View>

            <Button
              mode='contained'
              onPress={() =>
                (top.value = withSpring(dimensions.height / 2, springConfig))
              }
            >
              BottomSheet
            </Button>

            <View style={styles.helpContainer}>
              <ExternalLink
                style={styles.helpLink}
                href='https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
              >
                <Text
                  style={styles.helpLinkText}
                  lightColor={Colors.light.tint}
                >
                  Tap here if your app doesn't automatically update after making
                  changes
                </Text>
              </ExternalLink>
            </View>
          </ScrollView>

          {/* <Modal visible={showFilterModal}>
          <Text style={{ fontSize: 72 }}>Filters available</Text>
        </Modal> */}

          {/* <BottomSheet modalProps={{}} isVisible={isBottomSheetVisible}>
          <Text style={{ fontSize: 72 }}>Bottom sheet</Text>
        </BottomSheet> */}
        </Portal>
      </Provider>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            sheetStyle,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 25,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {/* <DropDownPicker
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
          /> */}
          {sortLabels.map((label: string, index: number) => (
            <List.Item
              key={index}
              title={label}
              onPress={() => setSortingBy(label)}
              left={props => (
                <List.Icon {...props} icon={true ? 'account' : 'folder'} />
              )}
              style={{ width: '100%' }}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
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
