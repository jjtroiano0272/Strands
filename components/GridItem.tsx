import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { IAPIData } from '../@types/types';
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
} from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { Link } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';

export default function GridItem({
  user,
  index,
  imgSrc,
}: {
  user?: IAPIData;
  index?: number;
  imgSrc?: string;
}) {
  const theme = useTheme();

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
          left={props => <Avatar.Icon {...props} size={30} icon={'star'} />}
        />

        <Card.Cover
          source={{
            uri: imgSrc,
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
});
