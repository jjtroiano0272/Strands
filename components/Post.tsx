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

export default function Post({
  postData,
  postsSavedByUser,
  children,
}: {
  postData: FireBasePost;
  postsSavedByUser: string[];
  onPress?: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const uid = getAuth().currentUser?.uid;
  const paperTheme = usePaperTheme();
  const [isSaved, setIsSaved] = useState(false);

  // console.log(`postData: ${JSON.stringify(postData, null, 2)}`);

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

        console.log(`Post updated successfully! `);
      }
    } catch (error) {
      console.error(`Error in unsaving post: ${error}`);
    }

    setIsSaved(false);
  };

  const unsub =
    uid &&
    onSnapshot(doc(db, 'users', uid), doc => {
      // console.log(
      //   'Current data: ',
      //   JSON.stringify(doc?.data()?.savedPosts, null, 2)
      // );

      const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
      // console.log(source, ' data: ', JSON.stringify(doc.data(), null, 2));
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

  useEffect(() => {
    const getClientData = async () => {
      if (!postData?.clientID) return;

      try {
        const docRef = doc(db, 'clients', postData?.clientID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          setClientData({ ...getClientData, ...docSnap.data() });
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
        }
      } catch (error) {
        console.error(`Error Post:240: ${error}`);
      }
      // 1oLsVwRHB1CsBjBamz0x
    };

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
        console.log('Stylist data:', stylistSnap.data());
        setStylistData({ ...stylistData, ...stylistSnap.data() });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error(`Error Post:265 ${error}`);
    }
  };

  useEffect(() => {
    console.log(`postData of Post.tsx: ${JSON.stringify(postData, null, 2)}`);
  }, []);

  return (
    <Card
      style={styles.card}
      theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      onLongPress={showActionSheet}
    >
      <Card.Title
        title={clientData?.firstName}
        titleStyle={{ color: theme.colors.text }}
        subtitle={
          <>
            <View style={{ backgroundColor: 'transparent' }}>
              <Text
                style={{
                  color: paperTheme.colors.secondary,
                }}
              >
                ⟩⟩ {postData?.displayName}
              </Text>
              <Text style={{ color: theme.colors.text, fontSize: 10 }}>
                {/* {postData?.createdAt &&
                          `${getElapsedTime(postData?.createdAt as number)?.number} ${
                            getElapsedTime(postData?.createdAt as number)?.unit
                          } ago`} */}
                {/* TODO: Offload to its own component and include the handling cases for like '1 weeks ago' */}
                {postData?.createdAt &&
                  `${
                    getElapsedTime(Date.parse(postData?.createdAt) / 1000)
                      ?.number
                  } ${
                    getElapsedTime(Date.parse(postData?.createdAt) / 1000)?.unit
                  } ago`}
              </Text>
            </View>
          </>
        }
        // TODO: Have the DB autogenerate the image if the user doesn't have profileimage
        left={props => (
          <Avatar.Image
            {...props}
            size={36}
            source={{
              uri:
                postData?.profileImage ??
                `https://api.dicebear.com/6.x/lorelei/png/seed=${postData?.docId}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
            }}
          />
        )}
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
      <Card.Cover
        source={{
          uri: postData?.media?.images ? postData?.media?.images[0] : undefined,
        }}
      />
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
  },
  swiperContainer: {
    height: 300,
    width: 300,
    // borderRadius: 30,
  },
  // swiperImage: { width: '100%', height: '100%' },
  swiperImage: { width: 200, height: 200 },
  wrapper: { width: 200, height: 200 },
});
