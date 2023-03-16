import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { IAPIData } from '../@types/types';
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
} from 'react-native-paper';
import { Text, View } from './Themed';
import { Link } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';

export default function EditScreenInfo({
  path,
  navigation,
}: {
  path?: string;
  navigation?: any;
}) {
  const { data, error, loading } = useFetch(
    'https://jsonplaceholder.typicode.com/users'
  );
  const theme = useTheme();

  // console.log(`data is ${JSON.stringify(data)}`);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <View style={styles.container}>
        {/* TODO Offload to custom component with only the needed text, standardized format */}
        <View style={styles.cardsContainer}>
          {!loading &&
            data &&
            data.map((user: IAPIData, index: number) => (
              <Link
                key={index}
                href={{
                  pathname: '/clientProfile',
                  params: {
                    id: index + 64,
                    name: user.name,
                    company: user.company.name,
                  },
                }}
              >
                <Card
                  key={index}
                  style={styles.card}
                  theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                >
                  <Card.Title
                    title={user.name}
                    titleStyle={{
                      color: theme.colors.text,
                    }}
                    subtitle={user.company.name}
                    subtitleStyle={{
                      color: theme.colors.text,
                    }}
                    left={props => (
                      <Avatar.Icon
                        {...props}
                        size={30}
                        icon={user.address.zipcode < 50000 ? 'account' : 'star'}
                      />
                    )}
                  />

                  <Card.Cover
                    source={{
                      uri: `https://picsum.photos/id/${index + 64}/200/200`,
                    }}
                  />
                </Card>
              </Link>
            ))}
        </View>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor='rgba(255,255,255,0.05)'
          lightColor='rgba(0,0,0,0.05)'
        >
          <MonoText>{path}</MonoText>
        </View>
        <Text
          style={styles.getStartedText}
          lightColor='rgba(0,0,0,0.8)'
          darkColor='rgba(255,255,255,0.8)'
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href='https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
        >
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </ScrollView>
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
  },
});
