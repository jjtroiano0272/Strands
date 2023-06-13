import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
import * as Haptics from 'expo-haptics';
import { faker } from '@faker-js/faker';
import Animated, {
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { FireBasePost, IAPIData, SearchParams } from '../../../@types/types';
import Colors from '../../../constants/Colors';
import useFetch from '../../../hooks/useFetch';
import { ExternalLink } from '../../../components/ExternalLink';
import { MonoText } from '../../../components/StyledText';
import {
  Avatar,
  Button,
  Card,
  Title,
  Subheading,
  Paragraph,
  MD3LightTheme,
  MD3DarkTheme,
  List,
  IconButton,
  ProgressBar,
  Divider,
  TextInput,
} from 'react-native-paper';
import { Text, View } from '../../../components/Themed';
import {
  Link,
  Stack,
  useRouter,
  useSearchParams,
  usePathname,
  useSegments,
  useNavigation,
  useLocalSearchParams,
} from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../../../context/UserContext';
import Swiper from 'react-native-swiper';

import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { getAuth } from 'firebase/auth';
import { interpolate } from 'react-native-reanimated';

export default function Client() {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const { clientName }: { clientName?: string } = useLocalSearchParams();
  const [clientData, setClientData] = useState<DocumentData | FireBasePost>();
  const auth = getAuth();
  const sensor = useAnimatedSensor(SensorType.ROTATION);

  // const fetchPost = async () => {
  //   if (!docId) return;

  //   // TODO Refactor into one line compound?
  //   const docRef = doc(db, 'posts', docId);
  //   const docSnap = await getDoc(docRef);
  //   const docData = docSnap.data();

  //   console.log(`in post: ${JSON.stringify(docSnap.data(), null, 2)}`);

  //   setData(docData);
  // };

  const handleOptionsMenu = (phoneNumber: string) => {
    const menuOptions = ['Call', 'Text', 'Cancel'];

    // Show the action sheet to the user
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: menuOptions,
        cancelButtonIndex: menuOptions.length - 1,
      },
      async (index: number) => {
        // if else method
        try {
          if (menuOptions[index] === 'Call') {
            await Linking.openURL(`tel:${phoneNumber}`);
          } else if (menuOptions[index] === 'Text') {
            await Linking.openURL(
              `sms:${phoneNumber}?body=Hi ${clientData?.clientName} this is ${auth?.currentUser?.displayName}. I just wanted to confirm the upcoming appointment with you`
            );
          } else {
            return;
          }
        } catch (err) {
          console.error(`menu option error: ${err}`);
        }
      }
    );
  };

  const formatPhoneNumber = (num: string): string => {
    return `(${num?.toString().slice(0, 3)}) ${num
      ?.toString()
      .slice(3, 6)}-${num?.toString().slice(6)}`;
  };

  const fetchClientData = async () => {
    let numRatings = 0;
    let ratingSum = 0;
    let postsAboutClient: {}[] = [];

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('clientName', '==', clientName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      numRatings = numRatings + 1;
      console.log(`doc?.data()?.rating: ${doc?.data()?.rating}`);

      if (doc?.data()?.rating) {
        console.log(`truthy rating: ${doc?.data()?.rating}`);
        ratingSum = ratingSum + doc?.data()?.rating;
      }

      postsAboutClient.push({ id: doc.id, ...doc.data() });
    });

    console.log(
      `postsAboutClient: ${JSON.stringify(postsAboutClient, null, 2)}`
    );

    console.log(`ratingSum: ${ratingSum}`);
    console.log(`numRatings: ${numRatings}`);
    console.log(`averageRating: ${ratingSum / numRatings}`);

    setClientData({
      ...clientData,
      averageRating: ratingSum / numRatings,
      postsAboutClient,
    });
  };

  const [editable, setEditable] = useState(false);

  const getLocaleDate = (date: Date | string) => {
    console.log(`date: ${date}`);

    const localeDate = new Date(
      (date as string).substring(0, (date as string).indexOf('Z'))
    );
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return localeDate.toLocaleString('en-US', { dateStyle: 'medium' });
  };

  const IMAGE_OFFSET = 100;
  const imageStyle = useAnimatedStyle(() => {
    const { yaw, pitch, roll } = sensor.sensor.value;
    console.log(yaw.toFixed(1), pitch.toFixed(1), roll.toFixed(1));

    return {
      transform: [
        {
          translateX: withTiming(
            interpolate(
              yaw,
              [-Math.PI / 2, Math.PI / 2],
              [-IMAGE_OFFSET * 2, 0]
            ),
            { duration: 100 }
          ),
        },
        {
          translateY: withTiming(
            interpolate(
              pitch,
              [-Math.PI / 2, Math.PI / 2],
              [-IMAGE_OFFSET * 2, 0]
            ),
            { duration: 100 }
          ),
        },
      ],
    };
  });

  useEffect(() => {
    // fetchPost();
    fetchClientData();
  }, []);

  useEffect(() => {
    console.log(`clientData: ${JSON.stringify(clientData, null, 2)}`);
  }, [clientData]);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <Card
        style={styles.card}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        {/* <Card.Cover
          style={[
            {
              height: 400 + 2 * IMAGE_OFFSET,
              width: 400 + 2 * IMAGE_OFFSET,
              transform: [{ translateX: 50 }],
            },
            // imageStyle,
          ]}
          source={{
            uri:
              clientData?.postsAboutClient[0]?.media?.image?.[0] ??
              `https://api.dicebear.com/6.x/notionists/png/seed=${clientData?.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
          }}
        /> */}
        <View
          style={{
            height: 300,
            width: '100%',
            backgroundColor: 'red',
            overflow: 'hidden',
          }}
        >
          <Animated.Image
            source={{
              uri:
                clientData?.postsAboutClient[0]?.media?.image?.[0] ??
                `https://api.dicebear.com/6.x/notionists/png/seed=${clientData?.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
            }}
            style={[
              {
                height: 1000,
                width: 1000,
                // height: undefined,
                // width: undefined,
                flex: 1,
                resizeMode: 'cover',
              },
              imageStyle,
            ]}
          />
        </View>

        <Card.Title
          theme={MD3DarkTheme}
          title={clientName} // Client's name
          titleStyle={[{ color: theme.colors.text }, styles.cardTitle]}
          subtitleStyle={[{ color: theme.colors.text }, styles.cardSubtitle]}
          right={
            clientData?.averageRating
              ? () => (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 20,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                      {clientData.averageRating.toFixed(1)}
                    </Text>
                  </View>
                )
              : undefined
          }
        />

        <Card.Content>
          <Pressable onPress={() => console.log('pressable')}>
            <List.Item
              style={styles.listItem}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              title={() => (
                <TextInput
                  editable={editable}
                  label={
                    clientData?.postsAboutClient[0]?.phoneNumber
                      ? formatPhoneNumber(
                          clientData?.postsAboutClient[0]?.phoneNumber
                        )
                      : 'Add phone number'
                  }
                  onPressIn={() => setEditable(true)}
                  style={{
                    backgroundColor: 'transparent',
                    fontStyle: 'italic',
                  }}
                  placeholderTextColor='#ccc'
                  underlineColor='transparent'
                />
              )}
              titleStyle={
                !clientData?.postsAboutClient[0]?.phoneNumber && {
                  fontStyle: 'italic',
                }
              }
              // description='Item description'
              left={() => (
                <MaterialCommunityIcons
                  color={theme.colors.primary}
                  size={24}
                  name='phone'
                />
              )}
              onPress={() =>
                !clientData?.phoneNumber
                  ? setEditable(true)
                  : handleOptionsMenu(
                      clientData?.postsAboutClient[0]?.phoneNumber as string
                    )
              }
            />
          </Pressable>

          <Divider style={{ marginBottom: 20, paddingHorizontal: 100 }} />

          <View style={styles.subtitleContainer}>
            <Text style={{ lineHeight: 18 }}>Seen by </Text>
          </View>
          {(clientData ? clientData.postsAboutClient : []).map(
            (post: FireBasePost) => (
              <List.Item
                style={{ padding: 10, borderRadius: 10, marginVertical: 5 }}
                title={() => (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      {post?.auth?.displayName}
                    </Text>
                  </View>
                )}
                description={() => (
                  <View style={{ backgroundColor: 'transparent' }}>
                    <Text>{post?.comments}</Text>
                    <Text style={{ fontStyle: 'italic', marginTop: 10 }}>
                      {post?.createdAt && getLocaleDate(post?.createdAt)}
                    </Text>
                  </View>
                )}
                left={() => (
                  <Avatar.Image
                    source={{
                      uri: post?.media?.image
                        ? post.media.image[0]
                        : `https://api.dicebear.com/6.x/notionists/png/seed=${post?.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                    }}
                    size={64}
                  />
                )}
                right={() =>
                  post?.rating && (
                    // <View
                    //   style={{
                    //     flex: 1,
                    //     backgroundColor: 'transparent',
                    //   }}
                    // >
                    //   <ProgressCircle
                    //     style={{ height: 20 }}
                    //     progress={post.rating / 5}
                    //     progressColor={
                    //       post.rating < 1.67
                    //         ? '#DC4C64'
                    //         : post.rating < 3.33
                    //         ? '#E4A11B'
                    //         : post.rating < 5
                    //         ? '#14A44D'
                    //         : 'black'
                    //     }
                    //   />
                    // </View>
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 25,
                      }}
                    >
                      <IconButton
                        icon='star-outline'
                        iconColor={
                          post.rating < 1.67
                            ? '#DC4C64'
                            : post.rating < 3.33
                            ? '#E4A11B'
                            : post.rating < 5
                            ? '#14A44D'
                            : 'black'
                        }
                      />
                      <Text>{post.rating}</Text>
                    </View>
                  )
                }
                onPress={() =>
                  // router.push({
                  //   pathname: `posts/${item?.docId}`,
                  //   params: item?.docId,
                  // })
                  console.log(JSON.stringify(post, null, 2))
                }
              />
            )
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    padding: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  utilHitSlop: { top: 5, bottom: 5, left: 5, right: 5 },
  card: { margin: 10, minWidth: 300 },
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
  subtitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardTitle: { fontSize: 42, paddingTop: 30 },
  cardSubtitle: { fontSize: 14, paddingVertical: 14 },
  swiperContainer: { height: 300, width: '100%', borderRadius: 30 },
  listItem: { padding: 10, marginVertical: 10, borderRadius: 7 },
  circleOutline: {},
  circleFilled: {},
  flex1: { flex: 1 },
  activeDotStyle: {
    margin: 7,
    justifyContent: 'space-between',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 5,
  },
  dotStyle: {
    margin: 7,
    justifyContent: 'space-between',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  swiper: { flex: 1, aspectRatio: 1, borderRadius: 30 },
});
