import * as Haptics from 'expo-haptics';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import React from 'react';
import { faker } from '@faker-js/faker';
import {
  ActionSheetIOS,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { IAPIData } from '../@types/types';
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

interface Auth {
  displayName?: string;
  uid?: string;
  profileImage?: string;
}

interface PostProps {
  imgSrc?: string[] | null;
  auth?: Auth;
  clientName?: string;
  comments?: string;
  createdAt?: number | Timestamp | string;
  isSeasonal?: boolean;
  productsUsed?: [label: string, value: string];
  rating?: number;
}

export default function Post({
  imgSrc,
  auth: { displayName: username, uid, profileImage } = {},
  clientName,
  comments,
  createdAt,
  isSeasonal,
  productsUsed,
  rating,
  ...props
}: PostProps) {
  const theme = useTheme();
  const paperTheme = usePaperTheme();
  const dummyPhoneNumber = faker.phone.number();

  const getElapsedTime = (
    time1: number,
    time2: number = Date.now(),
    format?: 'string'
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
        options: ['Cancel', 'Save Post', `View Profile for ${username}`],
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
    if (imgSrc?.length! > 1 && Array.isArray(imgSrc)) {
      return (
        <Swiper
          containerStyle={{
            height: 300,
            width: 300,
            // borderRadius: 30,
          }}
          onIndexChanged={() => Haptics.ImpactFeedbackStyle.Light}
        >
          {imgSrc?.map((uri, index) => (
            <Image
              key={index}
              source={{ uri: uri }}
              style={{ width: '100%', height: '100%' }}
            />
          ))}
        </Swiper>
      );
    } else {
      return (
        <Card.Cover
          source={{
            uri: imgSrc![0],
          }}
        />
      );
    }
  };

  return (
    <Link
      href={{
        pathname: `/${username}`,
        // params: {
        //   displayName: username,
        //   clientName: clientName,
        //   username: username ?? uid,
        //   //
        //   imgSrc,
        //   // auth,
        //   comments,
        //   createdAt,
        //   isSeasonal,
        //   productsUsed,
        //   rating,
        // },
        params: {
          comments,
          clientName,
          imgSrc,
        },
      }}
      onLongPress={showActionSheet}
    >
      <Card
        style={styles.card}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <Card.Title
          title={clientName}
          titleStyle={{ color: theme.colors.text }}
          subtitle={
            <>
              <View style={{ backgroundColor: 'transparent' }}>
                <Text
                  style={{
                    color: paperTheme.colors.secondary,
                  }}
                >
                  ⟩⟩ {username}
                </Text>
                <Text style={{ color: theme.colors.text }}>
                  {createdAt &&
                    `${getElapsedTime(createdAt as number)?.number} ${
                      getElapsedTime(createdAt as number)?.unit
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
                  profileImage ??
                  `https://api.dicebear.com/6.x/lorelei/png/seed=${uid}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
              }}
            />
          )}
          right={props =>
            // TODO Make a banner, not a button
            isSeasonal && (
              <PaperAvatar.Icon
                {...props}
                size={20}
                icon='airplane'
                color={theme.colors.primary}
                style={{ backgroundColor: 'transparent' }}
              />
            )
          }
        />

        <CoverImage />
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
});
