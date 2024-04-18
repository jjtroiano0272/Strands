import * as Haptics from 'expo-haptics';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  ActionSheetIOS,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  FireBasePost,
  IAPIData,
  PostProps,
  YetAnotherNewOne,
} from '../@types/types';
import { Badge as RNEBadge } from 'react-native-elements';
import Colors from '../constants/Colors';
import useFetch from '../hooks/useFetch';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  MD3DarkTheme,
  MD3LightTheme,
  Badge,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { Text, View } from './Themed';
import { Link, Stack, useRouter } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';
import {
  DocumentData,
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import Swiper from 'react-native-swiper';
import { style } from 'd3';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, push, update } from 'firebase/database';
import { clientsRef, db } from '~/firebaseConfig';
import { Skeleton } from 'moti/skeleton';

export default function Post({
  postData,
  postsSavedByUser,
  onPressArgs,
  loading,
}: {
  postData: FireBasePost;
  postsSavedByUser: string[];
  onPressArgs: any;
  loading: boolean;
}) {
  const theme = useTheme();
  const router = useRouter();
  const uid = getAuth().currentUser?.uid;
  const paperTheme = usePaperTheme();
  const [isSaved, setIsSaved] = useState(false);

  // // console.log(`postData: ${JSON.stringify(postData, null, 2)}`);

  const savePost = async (postId: string) => {
    const uid = getAuth().currentUser?.uid;

    try {
      if (uid) {
        await updateDoc(doc(db, 'users', uid), {
          savedPosts: arrayUnion(postId),
        });
      }
    } catch (error) {
      console.error(`Error in Post:savePost() ${error}`);
    }

    setIsSaved(true);
  };

  const unsavePost = async (postId: string) => {
    const uid = getAuth().currentUser?.uid;

    try {
      if (uid) {
        await updateDoc(doc(db, 'users', uid), {
          savedPosts: arrayRemove(postId),
        });

        // console.log(`Post updated successfully! `);
      }
    } catch (error) {
      console.error(`Error in unsaving post: ${error}`);
    }

    setIsSaved(false);
  };

  const unsub =
    uid &&
    onSnapshot(doc(db, 'users', uid), doc => {
      // // console.log(
      //   'Current data: ',
      //   JSON.stringify(doc?.data()?.savedPosts, null, 2)
      // );

      const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
      // // console.log(source, ' data: ', JSON.stringify(doc.data(), null, 2));
    });

  const getElapsedTime = (
    time1: number,
    time2: number = Date.now(),
    format?: string
  ) => {
    const createdAtTimestamp = time1 * 1000;

    const elapsedTimeInSeconds = Math.abs(
      Math.round((createdAtTimestamp - time2) / 1000)
    );
    const elapsedTimeInMinutes = Math.abs(
      Math.round(elapsedTimeInSeconds / 60)
    );
    const elapsedTimeInHours = Math.abs(Math.round(elapsedTimeInMinutes / 60));
    const elapsedTimeInDays = Math.abs(Math.round(elapsedTimeInHours / 24));
    const elapsedTimeInWeeks = Math.abs(
      Math.round(elapsedTimeInSeconds / 604800)
    ); // 604800 seconds in a week
    const elapsedTimeInMonths = Math.abs(Math.round(elapsedTimeInWeeks / 4));

    // If it has been longer than 60 seconds, use elapseTimeinMinutes
    // let result: { number: number; unit: string };
    let result;
    if (elapsedTimeInSeconds < 60) {
      result = 'Just now';
    }
    if (elapsedTimeInSeconds >= 60) {
      result = { number: elapsedTimeInMinutes, unit: 'minutes' };
    }
    if (elapsedTimeInMinutes >= 60) {
      result = { number: elapsedTimeInHours, unit: 'hours' };
    }
    if (elapsedTimeInHours >= 24) {
      result = { number: elapsedTimeInDays, unit: 'days' };
    }
    if (elapsedTimeInDays >= 7) {
      result = { number: elapsedTimeInWeeks, unit: 'weeks' };
    }
    if (elapsedTimeInWeeks >= 4) {
      result = { number: elapsedTimeInMonths, unit: 'months' };
    }

    return result;
  };

  const showActionSheet = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error(`Haptic error at Post:166: ${error}`);
    }

    let actionSheetOptions = [
      'Cancel',
      !postData.savedPosts?.includes(postData?.docId || '')
        ? 'Save Post'
        : 'Unsave Post',
      clientData?.firstName
        ? `View ${clientData?.firstName}'s profile`
        : 'No client',
      `View ${postData?.displayName}'s profile`,
    ];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (!postsSavedByUser?.includes(postData?.docId || '')) {
          ('Save Post');
        } else if (
          postsSavedByUser?.includes(postData?.docId || '') &&
          isSaved
        ) {
          ('UnsavePost');
        }

        // If post is not saved, show the 'Save Post' option
        if (
          buttonIndex === 1 &&
          postData?.docId &&
          !postsSavedByUser?.includes(postData?.docId)
        ) {
          savePost(postData.docId);
        }
        // If the post is already saved, how 'Unsave post' option
        else if (
          buttonIndex === 1 &&
          postData?.docId &&
          postsSavedByUser?.includes(postData?.docId)
        ) {
          unsavePost(postData.docId);
        } else if (buttonIndex === 2) {
          router.push({
            pathname: `clients/${clientData?.firstName}${clientData?.lastName}`,
            params: {
              clientID: postData?.clientID,
            },
          });
        }
        // Go to user's profile
        else if (buttonIndex === 3) {
          router.push({
            pathname: `users/${postData?.postedByDisplayName}`,
            // params: { docId: docId },
          });
        } else if (buttonIndex === 0) {
          return;
        }
      }
    );
  };

  const [clientData, setClientData] = useState<DocumentData>();
  const getClientData = async () => {
    if (!postData?.clientID) return console.error(`no clientID on postData`);

    const clientsRef = doc(db, 'clients', postData?.clientID);

    await getDoc(clientsRef)
      .then(docSnap => {
        // docSnap.id === '0offP5pWtN7yXbNNzP48' &&
        //   console.warn('Client data:', docSnap.data());

        setClientData({ ...getClientData, ...docSnap.data() });
      })
      .catch(err => console.error(`No such document! ${err}`));
  };

  useEffect(() => {
    getClientData();
    fetchStylistData();
  }, []);

  const [stylistData, setStylistData] = useState<DocumentData>();

  const fetchStylistData = async (userID?: string) => {
    if (!userID) return;

    try {
      const stylistRef = doc(db, 'users', userID);
      const stylistSnap = await getDoc(stylistRef);

      if (stylistSnap.exists()) {
        // console.log('Stylist data:', stylistSnap.data());
        setStylistData({ ...stylistData, ...stylistSnap.data() });
      } else {
        // console.log('No such document!');
      }
    } catch (error) {
      console.error(`Error Post:265 ${error}`);
    }
  };

  useEffect(() => {
    // console.log(`postData of Post.tsx: ${JSON.stringify(postData, null, 2)}`);
    // console.log(`onPressArgs: ${JSON.stringify(onPressArgs, null, 2)}`);
  }, []);

  useEffect(() => {
    const possibleIDs = [
      '6xOlNfFkWF7cYyBhGu7u',
      'BFpUdqR1wNv8UvXOdFOI',
      'zXntngjZkHol5jf3gmVd', // new one
    ];

    // possibleIDs.forEach(
    //   id =>
    //     postData?.docId === id &&
    //     console.log(`postData in Post: ${JSON.stringify(postData, null, 2)}`)
    // );
  }, []);

  type Timestamp = { seconds: number; nanoseconds: number };
  const returnCreatedAt = (date: string | Timestamp | Date) => {
    if (typeof date === 'string' || date instanceof Timestamp) {
      const timestamp =
        typeof date === 'string' ? Date.parse(date) / 1000 : date.seconds;
      const elapsedTime = getElapsedTime(timestamp);

      if (elapsedTime instanceof Object) {
        return (
          // <Text style={{ color: theme.colors.text, fontSize: 10 }}>
          <Text style={{ color: '#ccc', fontSize: 10 }}>
            {`${elapsedTime?.number} ${elapsedTime?.unit} ago`}
          </Text>
        );
      } else if (typeof elapsedTime === 'string') {
        return (
          <Text style={{ color: theme.colors.text, fontSize: 10 }}>
            Just now
          </Text>
        );
      }

      return (
        <Text style={{ color: theme.colors.text, fontSize: 10 }}>
          {/* {elapsedTime?. && `${elapsedTime?.number} ${elapsedTime?.unit} ago`} */}
        </Text>
      );
    }
  };

  // console.log(`postData: ${JSON.stringify(postData, null, 2)}`);

  return (
    <Card
      style={styles.card}
      theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      onLongPress={showActionSheet}
      onPress={() => router.push(onPressArgs)}
    >
      <Skeleton.Group show={!loading}>
        <Card.Title
          title={
            // <Skeleton colorMode={theme.dark ? 'light' : 'dark'}>
            //   {clientData?.firstName ? (
            //     <Text style={{ fontSize: 24 }}>{clientData?.firstName}</Text>
            //   ) : null}
            // </Skeleton>
            clientData?.firstName
          }
          // titleStyle={{ color: 'red' }}
          titleVariant='titleLarge'
          subtitle={
            <>
              <View style={{ backgroundColor: 'transparent' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Skeleton
                    radius={50}
                    height={24}
                    width={24}
                    colorMode='light'
                  >
                    {postData?.profileImage ? (
                      <Avatar.Image
                        style={{ marginRight: 10 }}
                        size={24}
                        source={{
                          uri:
                            postData?.profileImage ??
                            `https://api.dicebear.com/6.x/lorelei/png/seed=${postData?.docId}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                        }}
                      />
                    ) : null}
                  </Skeleton>
                  <Skeleton colorMode='light'>
                    {postData?.displayName ? (
                      <Text
                        style={{
                          color: paperTheme.colors.secondary,
                        }}
                      >
                        seen by {postData?.displayName}
                      </Text>
                    ) : null}
                  </Skeleton>
                </View>
              </View>
            </>
          }
          // TODO: Have the DB autogenerate the image if the user doesn't have profileimage
          // left={props => (
          //   <Avatar.Image
          //     {...props}
          //     size={36}
          //     source={{
          //       uri:
          //         postData?.profileImage ??
          //         `https://api.dicebear.com/6.x/lorelei/png/seed=${postData?.docId}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
          //     }}
          //   />
          // )}
          right={props =>
            // TODO Make a banner, not a button
            postsSavedByUser?.includes(postData?.docId || '') && (
              <Avatar.Icon
                {...props}
                style={{ backgroundColor: 'transparent', top: -30 }}
                color={theme.colors.primary}
                size={20}
                icon='bookmark'
              />
            )
          }
        />
        {/* TODO: This will need to be read from the app-wide theme */}
        <Skeleton height={195} width='100%' colorMode='light'>
          {/* data ? data : null */}
          {postData?.media?.images ? (
            <>
              <Card.Cover
                source={{
                  uri: postData?.media?.images
                    ? postData?.media?.images[0]
                    : undefined,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  // top: 0,
                  // left: 0,
                  right: 10,
                  bottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  // backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: 20,
                  opacity: 0.75,
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
                >
                  <Skeleton colorMode='light'>
                    {/* Difference in createdAt data past/new
                    
                    old
                      "createdAt": "2023-04-12T02:07:19.222Z",

                    new
                    "createdAt": {
                      "seconds": 1698771509,
                      "nanoseconds": 839000000
                    },
                    */}
                    {postData?.createdAt &&
                      returnCreatedAt(postData?.createdAt)}
                    {/* {postData?.createdAt ? (
                      <Text style={{ color: theme.colors.text, fontSize: 10 }}>
                        {postData?.createdAt &&
                          `${
                            getElapsedTime(
                              Date.parse(postData?.createdAt as string) / 1000
                            )?.number
                          } ${
                            getElapsedTime(
                              Date.parse(postData?.createdAt as string) / 1000
                            )?.unit
                          } ago`}
                      </Text>
                    ) : null} */}
                  </Skeleton>
                </Text>
              </View>
            </>
          ) : null}
        </Skeleton>
      </Skeleton.Group>
    </Card>
  );
}

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
    marginVertical: 10,
    // backgroundColor: 'white',
  },
  swiperContainer: {
    height: 300,
    width: 300,
    // borderRadius: 30,
  },
  // swiperImage: { width: '100%', height: '100%' },
  swiperImage: { width: 200, height: 200 },
  wrapper: { width: 200, height: 200 },
  RTCViewFix: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
});
