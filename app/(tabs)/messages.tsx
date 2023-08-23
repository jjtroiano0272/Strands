import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { View, Text, Alert, ScrollView, Image, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { List, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';

const Messages = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<{ [key: string]: any }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const APIendpoint = 'https://jsonplaceholder.typicode.com/comments';

  const fetchMessages = () => {
    const source = axios.CancelToken.source();

    axios
      .get(APIendpoint, { cancelToken: source.token })
      .then(
        (res: {
          data: {
            postId: number;
            id: number;
            name: string;
            email: string;
            body: string;
          }[];
        }) => {
          console.log(
            `res.data: ${JSON.stringify(res.data.slice(0, 3), null, 2)}`
          );

          const result = res.data.slice(0, 3);

          // setLoading(false);
          // setData(res.data.data.children);
          setMessages(result);
        }
      )
      .catch((err: any) => {
        // setLoading(false);
        // setError('An error occurred. Awkward..');
        console.error(err);
      });

    return () => {
      source.cancel();
    };
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // fetchPostsData();

    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log(`messages are: ${!!messages} (length ${messages?.length})`);
  }, [messages]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={messages}
        renderItem={({ item }) => (
          <List.Item
            // key={index}
            style={{ marginVertical: 20, padding: 10 }}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            title={item?.name}
            description={item?.body}
            // left={props => <List.Icon {...props} icon='message' />}
            left={props => (
              <Image
                source={{
                  uri: `https://api.dicebear.com/6.x/lorelei/png/seed=${item?.email}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                }}
                style={{ height: 50, width: 50, borderRadius: 20 }}
              />
            )}
            onPress={() =>
              console.warn(
                `This would then navigate (router.push) to the next screen of message with that user`
              )
            }
          />
        )}
        contentContainerStyle={
          !messages && {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        } // Add this line
        ListEmptyComponent={
          <>
            <LottieView
              source={require('~/assets/images/animation_ll88sce9.json')}
              autoPlay={true}
              style={{ marginBottom: 40, height: 200, width: 200 }}
              // colorFilters={[
              //   { keypath: 'bottom', color: 'rgb(158, 42, 155)' },
              //   { keypath: 'top', color: 'rgb(255, 170, 243)' },
              // ]}
              // speed={0.3}
            />
            <Text style={{ fontSize: 36 }}>Nothing here, big dawg.</Text>
          </>
        }
      />
    </>
  );
};

export default Messages;
