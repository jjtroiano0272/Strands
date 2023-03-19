import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
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
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { Link, Stack, useRouter, useSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function ClientProfile() {
  const router = useRouter();
  const theme = useTheme();
  const { data, error, loading } = useFetch(
    'https://jsonplaceholder.typicode.com/users'
  );

  // TODO Offload to types file
  type NewType = {
    id?: string;
    name?: string;
    company?: string;
    username?: string;
    imgSrc?: string;
  };

  const { id, name, company, username, imgSrc }: NewType = useSearchParams();

  useEffect(() => {
    // console.log(`uri used: https://picsum.photos/id/${id + 64}/700/700`);
    console.log(`username: ${username}`);
  }, []);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ title: `@${username}` }} />

      {/* TODO Offload to custom component with only the needed text, standardized format */}
      <Card
        style={{ margin: 10, minWidth: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <Card.Title
          theme={MD3DarkTheme}
          title={name}
          titleStyle={{
            color: theme.colors.text,
            fontSize: 42,
            paddingTop: 30,
          }}
          subtitle={`${company}`}
          subtitleStyle={{
            color: theme.colors.text,
            fontSize: 14,
            paddingVertical: 14,
          }}
        />
        <Card.Content>
          <Card.Cover
            source={{
              uri: imgSrc,
            }}
          />
          {/* TWO COLUMNS of list items */}
          {/* Recent reviews, listed in order of submission and saying who wrote what, and their own rating */}

          <Paragraph style={{ color: theme.colors.text }}>
            Code in an ideal world, for deep dive we have to leverage up the
            messaging it just needs more cowbell, but deliverables, yet this
            proposal is a win-win situation which will cause a stellar paradigm
            shift, and produce a multi-fold increase in deliverables. Clear blue
            water (let's not try to) boil the ocean (here/there/everywhere).
            {imgSrc}
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  cardsContainer: {
    marginHorizontal: 'auto',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  titleText: {
    fontSize: 42,
    margin: 20,
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
});
