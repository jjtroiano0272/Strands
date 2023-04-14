import { View, Text, Alert, ScrollView, Image } from 'react-native';
import React from 'react';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { List, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import useFetch from '../../../hooks/useFetch';

const Messages = () => {
  const theme = useTheme();

  const {
    data,
    error,
    loading,
  }: {
    data: [
      {
        data: {
          title: string;
          thumbnail: string | 'self';
          url_overridden_by_dest: string;
          author: string;
        };
      }
    ];
    error: any;
    loading: any;
  } = useFetch('https://www.reddit.com/r/FancyFollicles.json');

  return (
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }} />

      {data &&
        data
          .filter(
            (item: any) =>
              item.data.thumbnail !== 'default' &&
              item.data.thumbnail !== 'self' &&
              item.data.thumbnail !== 'nsfw'
          )
          .map((item: any, index: number) => (
            // item.data.thumbnail !== 'self' ? item.data.thumbnail : null}/>))
            <List.Item
              key={index}
              style={{ marginVertical: 20, padding: 10 }}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              title={item.data.author}
              description='Most recent message'
              // left={props => <List.Icon {...props} icon='message' />}
              left={props => (
                <Image
                  source={{ uri: item.data.thumbnail }}
                  style={{ height: 50, width: 50, borderRadius: 20 }}
                />
              )}
              onPress={() =>
                Alert.alert(
                  `This would then navgiate (router.push) to the next screen of message with that user`
                )
              }
            />
          ))}
    </ScrollView>
  );
};

export default Messages;
