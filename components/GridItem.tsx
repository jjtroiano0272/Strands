import React from 'react';
import { faker } from '@faker-js/faker';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { IAPIData } from '../@types/types';
import { Badge as RNEBadge } from 'react-native-elements';
import Colors from '../constants/Colors';
import useFetch from '../hooks/useFetch';
import { ExternalLink } from '../components/ExternalLink';
import { MonoText } from '../components/StyledText';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  MD3DarkTheme,
  MD3LightTheme,
  Badge,
} from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { Link } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';

export default function GridItem({
  usingMyOwnDB,
  user,
  index,
  imgSrc,
  auth,
  comments,
  createdAt,
  isSeasonal,
  productsUsed,
  rating,
}: {
  usingMyOwnDB?: boolean;
  user?: IAPIData;
  index?: number;
  imgSrc?: string;

  auth?: {
    displayName?: string;
    uid?: string;
  };
  comments?: string;
  createdAt: Timestamp;
  isSeasonal: boolean;
  productsUsed: [label: string, value: string];
  rating: number;
}) {
  const theme = useTheme();
  const dummyPhoneNumber = faker.phone.number();

  if (!usingMyOwnDB) {
    return (
      <Link
        href={{
          pathname: `/${user?.username}`,
          params: {
            name: user?.name,
            company: user?.company.name,
            username: user?.username,
            // imgSrc: imgSrc,
          },
        }}
      >
        <Card
          style={styles.card}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        >
          <Card.Title
            title={user?.name}
            titleStyle={{
              color: theme.colors.text,
            }}
            subtitle={user?.company.name}
            subtitleStyle={{
              color: theme.colors.text,
            }}
            left={props => (
              <Avatar.Icon
                {...props}
                size={30}
                icon={
                  isSeasonal
                    ? 'airplane'
                    : dummyPhoneNumber.startsWith('1')
                    ? 'airplane'
                    : 'star'
                }
                style={{
                  backgroundColor: dummyPhoneNumber.startsWith('1')
                    ? theme.colors.primary
                    : theme.colors.text,
                }}
              />
            )}
          />

          <Card.Cover
            source={{
              uri: imgSrc,
            }}
          />
          {dummyPhoneNumber.startsWith('1') && (
            <RNEBadge
              value='Seasonal'
              status='primary'
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />
          )}
        </Card>
      </Link>
    );
  } else {
    return (
      <Link
        href={{
          pathname: `/${auth?.displayName ? auth?.displayName : auth?.uid}`,
          params: {
            name: auth?.displayName ? auth?.displayName : auth?.uid,
            company: auth?.displayName ? auth?.displayName : auth?.uid,
            username: auth?.displayName ? auth?.displayName : auth?.uid,
          },
        }}
      >
        <Card
          style={styles.card}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        >
          <Card.Title
            title={auth?.displayName ? auth?.displayName : auth?.uid}
            titleStyle={{
              color: theme.colors.text,
            }}
            subtitle={auth?.displayName ? auth?.displayName : auth?.uid}
            subtitleStyle={{
              color: theme.colors.text,
            }}
            left={props => (
              <Avatar.Icon
                {...props}
                size={30}
                icon={isSeasonal ? 'airplane' : ''}
              />
            )}
          />

          <Card.Cover
            source={{
              uri: 'https://unsplash.it/200/200',
            }}
          />
        </Card>
      </Link>
    );
  }
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
