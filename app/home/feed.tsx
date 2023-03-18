//useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, StyleSheet } from 'react-native';
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

const Feed = () => {
  const theme = useTheme();
  // const { data, error, loading } = useFetch(
  //   'https://jsonplaceholder.typicode.com/users'
  // );

  /**
   * res.data.children
   * children[{}]
   *
   * child: {
   *  data: {
   *    thumbnail: string,
   *    url_overridden_by_dest: string,
   *    author: string,
   *  }
   * }
   */
  const { data, error, loading } = useFetch(
    'https://www.reddit.com/r/FancyFollicles.json'
  );

  console.log(
    `redditData: ${data}, redditError: ${error}, redditLoading: ${loading}`
  );

  return (
    <ScrollView style={styles.getStartedContainer}>
      {/* TODO Add a filter button for like 'Show me people of x hair type within x miles of me, etc. */}
      <View style={styles.container}>
        {/* TODO Offload to custom component with only the needed text, standardized format */}
        <View style={styles.cardsContainer}>
          {/* {!loading &&
            data &&
            data.map((user: IAPIData, index: number) => (
              <GridItem key={index} index={index} user={user} sourceImg={} />
            ))} */}
          {!loading &&
            !error &&
            data &&
            data.map((child: any, index: number) => (
              //  thumbnail: string,
              //  url_overridden_by_dest: string,
              //  author: string,
              // <Text>{child.data.author}</Text>
              <GridItem
                key={index}
                imgSrc={
                  child.data.thumbnail !== 'self' ? child.data.thumbnail : null
                }
                user={{
                  username: child.author,
                  id: 3,
                  name: child.data.author,
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
                  company: {
                    bs: 'foooo',
                    catchPhrase: 'hello',
                    name: JSON.stringify(child.data.ups),
                  },
                  email: 'foo@bar.com',
                  phone: 911,
                  website: 'google.com',
                }}
              />
              // <Text style={{ color: theme.colors.text }}>{child.url_overridden_by_dest}</Text>
            ))}
        </View>
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
