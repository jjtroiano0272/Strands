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
import { Link, useRouter } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';
import {
  DocumentData,
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
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
import { db } from 'firebaseConfig';

export default function Post({
  postData,
}: {
  postData: FireBasePost | DocumentData | string;
}) {
  const theme = useTheme();
  const router = useRouter();
  const paperTheme = usePaperTheme();
  const [isSaved, setIsSaved] = useState(false);

  console.log(`postData: ${JSON.stringify(postData, null, 2)}`);

  const savePost = async (postId: string) => {
    const uid = getAuth().currentUser?.uid;

    if (uid) {
      await updateDoc(doc(db, 'users', uid), {
        savedPosts: arrayUnion(postId),
      });
    }

    setIsSaved(true);
  };

  const unsavePost = async (postId: string) => {
    const uid = getAuth().currentUser?.uid;

    if (uid) {
      await updateDoc(doc(db, 'users', uid), {
        savedPosts: arrayRemove(postId),
      }).then(res => `Post updated successfully! ${res}`);
    }

    setIsSaved(false);
  };

  const uid = getAuth().currentUser?.uid;
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

    return result;
  };

  const showActionSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let actionSheetOptions = [
      'Cancel',
      !postData.savedPosts?.includes(postData?.docId || '')
        ? 'Save Post'
        : 'Unsave Post',
      `View ${postData?.clientName}'s profile`,
      `View ${postData?.auth?.displayName}'s profile`,
    ];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (!savedPosts?.includes(postData?.docId || '')) {
          ('Save Post');
        } else if (savedPosts?.includes(postData?.docId || '') && isSaved) {
          ('UnsavePost');
        }

        // If post is not saved, show the 'Save Post' option
        if (
          buttonIndex === 1 &&
          postData?.docId &&
          !savedPosts?.includes(postData?.docId)
        ) {
          savePost(postData.docId);
        }
        // If the post is already saved, how 'Unsave post' option
        else if (
          buttonIndex === 1 &&
          postData?.docId &&
          savedPosts?.includes(postData?.docId)
        ) {
          unsavePost(postData.docId);
        } else if (buttonIndex === 2) {
          router.push({
            pathname: `clients/${postData?.clientName}`,
            params: { clientName: postData?.clientName },
          });
        }
        // Go to user's profile
        else if (buttonIndex === 3) {
          router.push({
            pathname: `users/${postData?.auth?.uid}`,
            // params: { docId: docId },
          });
        } else if (buttonIndex === 0) {
          return;
        }
      }
    );
  };

  return (
    <Link
      href={{
        pathname: `posts/foo`,
        params: {
          docId: postData?.docId,
        },
      }}
      onLongPress={showActionSheet}
    >
      <Card
        style={styles.card}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <Card.Title
          title={postData?.clientName}
          titleStyle={{ color: theme.colors.text }}
          subtitle={
            <>
              <View style={{ backgroundColor: 'transparent' }}>
                <Text
                  style={{
                    color: paperTheme.colors.secondary,
                  }}
                >
                  ⟩⟩ {postData?.auth?.displayName}
                </Text>
                <Text style={{ color: theme.colors.text }}>
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
                      getElapsedTime(Date.parse(postData?.createdAt) / 1000)
                        ?.unit
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
                  postData?.auth?.profileImage ??
                  `https://api.dicebear.com/6.x/lorelei/png/seed=${postData?.auth?.uid}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
              }}
            />
          )}
          right={props =>
            // TODO Make a banner, not a button
            savedPosts?.includes(postData?.docId || '') && (
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
            uri: postData?.media?.image ? postData?.media?.image[0] : undefined,
          }}
        />
      </Card>
    </Link>
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
