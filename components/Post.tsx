import * as Haptics from 'expo-haptics';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import React, { useEffect } from 'react';
import { faker } from '@faker-js/faker';
import {
  ActionSheetIOS,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { FireBasePost, IAPIData, PostProps } from '../@types/types';
import { Badge as RNEBadge } from 'react-native-elements';
import Colors from '../constants/Colors';
import useFetch from '../hooks/useFetch';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import {
  Avatar as PaperAvatar,
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
import { Link } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import Avatar from 'boring-avatars';
import Swiper from 'react-native-swiper';
import { style } from 'd3';

export default function Post({
  imgSrc,
  auth,
  displayName,
  clientName,
  comments,
  createdAt,
  isSeasonal,
  productsUsed,
  rating,
  postData,
}: PostProps) {
  const theme = useTheme();
  const paperTheme = usePaperTheme();
  const dummyPhoneNumber = faker.phone.number();

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

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',
          'Save Post',
          `View Profile for ${postData?.auth?.displayName}`,
        ],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          console.warn(`Placeholder for saving post`);
        } else if (buttonIndex === 2) {
          console.warn(`Placeholder for viewing stylist`);
        }
      }
    );
  };

  const CoverImage = () => {
    // TODO: Bad practice!
    /**
     * Three types:
     *    Multiple images => Swiper
     *    One Image       => Cover Image
     *    No Image        => Placeholder image?
     */
    if (postData?.media?.image?.length) {
      if (postData?.media?.image?.length! > 1) {
        return (
          <Swiper
            style={styles.wrapper}
            containerStyle={styles.swiperContainer}
            onIndexChanged={() => Haptics.ImpactFeedbackStyle.Light}
          >
            {postData?.media?.image?.map((imgUri, index) => (
              <Image
                key={index}
                style={styles.swiperImage}
                source={{
                  uri: imgUri,
                }}
              />
            ))}
          </Swiper>
        );
      } else if (postData.media.image.length === 1) {
        return (
          <Card.Cover
            source={{
              uri: postData?.media?.image[0],
            }}
          />
        );
      }
    }
    return <Card.Cover source={{ uri: 'https://unsplash.it/300/300' }} />;
  };

  return (
    <Link
      href={{
        // pathname: `/${postData?.clientName}`,
        // params: {
        //   imgSrc: 'https://unsplash.it/300',
        //   //   clientName: clientName,
        //   //   comments: comments,
        //   //   displayName: displayName,
        //   // imgSrc: postData?.media?.image ?? undefined,
        //   //   username: displayName,
        //   //   //   auth,
        //   //   //   createdAt,
        //   //   //   isSeasonal,
        //   //   //   productsUsed,
        //   //   //   rating,
        // },

        // For troubleshooting this Linking structure: https://www.youtube.com/live/yyGS0adZdsU?feature=share&t=2760
        pathname: `${postData?.clientName}`,
        params: {
          name: `${postData?.clientName}`,
          // imgSrc: postData?.media,
          imgParam: encodeURIComponent(
            postData?.media?.image?.join(',') as string
          ),
          phoneNumber: `${postData?.phoneNumber}`,
          postedBy: postData?.auth?.displayName,
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
            <PaperAvatar.Image
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
            isSeasonal && (
              <PaperAvatar.Icon
                {...props}
                style={{ backgroundColor: 'transparent' }}
                color={theme.colors.primary}
                size={20}
                icon='airplane'
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
