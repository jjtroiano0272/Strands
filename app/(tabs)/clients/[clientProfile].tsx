import { Haptics } from '~/constants/constants';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
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
  MD3Colors,
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
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { clientsRef, db } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { interpolate } from 'react-native-reanimated';

export default function Client() {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const { clientName, clientID }: { clientName?: string; clientID?: string } =
    useLocalSearchParams();
  const [clientData, setClientData] = useState<DocumentData | FireBasePost>();
  const auth = getAuth();
  const sensor = useAnimatedSensor(SensorType.ROTATION);
  const [editable, setEditable] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<{
    raw: number;
    formatted: string;
  }>({ raw: 0, formatted: '' });
  const IMAGE_OFFSET = 200;
  const WIDTH = 300;
  const HEIGHT = WIDTH * 0.8;

  const imageStyle = useAnimatedStyle(() => {
    const { yaw, pitch, roll } = sensor.sensor.value;

    return {
      transform: [
        {
          translateX: withTiming(
            interpolate(
              yaw * 0.2,
              [-Math.PI / 2, Math.PI / 2],
              [-IMAGE_OFFSET * 2, 0]
            ),
            { duration: 100 }
          ),
        },
        {
          translateY: withTiming(
            interpolate(
              pitch * 0.2,
              [-Math.PI / 2, Math.PI / 2],
              [-IMAGE_OFFSET * 2, 0]
            ),
            { duration: 100 }
          ),
        },
      ],
    };
  });

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
            console.log(`At text option for ${phoneNumber}`);

            await Linking.openURL(`sms:+${phoneNumber}`);
          } else {
            return;
          }
        } catch (err) {
          console.error(`menu option error: ${err}`);
        }
      }
    );
  };

  useEffect(() => {
    console.log(`clientData: ${JSON.stringify(clientData, null, 2)}`);
    console.log(
      `auth?.currentUser: ${JSON.stringify(auth?.currentUser, null, 2)}`
    );
  }, [clientData]);

  const formatPhoneNumber = (num: string): string => {
    return `(${num?.toString().slice(0, 3)}) ${num
      ?.toString()
      .slice(3, 6)}-${num?.toString().slice(6)}`;
  };

  const fetchClientData = async () => {
    if (!clientID) return;

    console.log(
      !clientID ? 'no clientID!' : !clientName ? 'no clientName!' : null
    );

    console.log(`clientID: ${JSON.stringify(clientID, null, 2)}`);

    let numRatings = 0;
    let ratingSum = 0;
    let postsAboutClient: {}[] = [];
    let clientSnap: DocumentSnapshot<DocumentData>;
    let firstName: string;
    let lastName: string;
    let phoneNumber: string | number;

    try {
      // Fetch posts ABOUT client
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('clientID', '==', clientID));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        numRatings = numRatings + 1;
        console.log(
          `doc?.data()?.rating: ${JSON.stringify(doc?.data(), null, 2)}`
        );

        console.log(
          `mf who posted: ${JSON.stringify(doc?.data().postedBy, null, 2)}`
        );
        // query DB for details about that user
        const postsRef = collection(db, 'users');
        const q = query(postsRef, where(doc.id, '==', doc?.data().postedBy));
        getDocs(q).then(doc =>
          console.log(`right here: ${JSON.stringify(doc.docs, null, 2)}`)
        );

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

      // fetch client's information
      const newClientRef = doc(db, 'clients', clientID);
      const clientSnap = await getDoc(newClientRef);

      firstName = clientSnap?.data()?.firstName;
      lastName = clientSnap?.data()?.lastName;
      phoneNumber = clientSnap?.data()?.phoneNumber;

      // Who were they seen by and get their details
      // stored on postsAboutClient.postedBy
      console.log(
        `phoneNumber in question: ${JSON.stringify(
          clientSnap?.data()?.phoneNumber,
          null,
          2
        )}`
      );

      setClientData({
        ...clientData,
        averageRating: ratingSum / numRatings,
        postsAboutClient,
        firstName,
        lastName,
        phoneNumber,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getLocaleDate = (date: Date | string) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const formatMobileNumber = (text: string) => {
    var cleaned = ('' + text).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      var intlCode = match[1] ? '+1 ' : '',
        number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
          ''
        );
      return number;
    }

    return text;
  };

  const [phoneNumberUpdated, setPhoneNumberUpdated] = useState(false);

  useEffect(() => {
    // fetchPost();
    fetchClientData();
  }, []);

  useEffect(() => {
    console.log(`clientData: ${JSON.stringify(clientData, null, 2)}`);
  }, [clientData]);

  useEffect(() => {
    console.log(`phoneNumber: ${JSON.stringify(phoneNumber, null, 2)}`);
  }, [phoneNumber]);

  useEffect(() => {
    console.log(`editable: ${JSON.stringify(editable, null, 2)}`);
  }, [editable]);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <Card
        style={styles.card}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <View
          style={{
            height: HEIGHT,
            width: '100%',
            backgroundColor: 'red',
            overflow: 'hidden',

            // height: 300,
            // width: '100%',
            // backgroundColor: 'red',
            // overflow: 'hidden',
            // flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          <Animated.Image
            source={{
              uri:
                clientData?.postsAboutClient[0]?.media?.images?.[0] ??
                `https://api.dicebear.com/6.x/notionists/png/seed=${clientData?.postsAboutClient[0].id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
            }}
            style={[
              {
                // height: width,
                // width: height,
                // flex: 1,
                resizeMode: 'cover',

                height: WIDTH + 2 * IMAGE_OFFSET,
                width: HEIGHT + 2 * IMAGE_OFFSET,
                // position: 'absolute',
                // flex: 1,
                // resizeMode: 'cover',
              },
              imageStyle,
            ]}
          />
        </View>

        <Card.Title
          theme={MD3DarkTheme}
          title={`${clientData?.firstName} ${clientData?.lastName}` ?? ''} // Client's name
          titleStyle={[{ color: theme.colors.text }, styles.cardTitle]}
          subtitleStyle={[{ color: theme.colors.text }, styles.cardSubtitle]}
          right={() => (
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {clientData?.averageRating ? (
                <>
                  <IconButton
                    icon='star'
                    iconColor={
                      clientData.averageRating < 1.67
                        ? '#DC4C64'
                        : clientData.averageRating < 3.33
                        ? '#E4A11B'
                        : clientData.averageRating < 5
                        ? '#14A44D'
                        : 'black'
                    }
                    size={36}
                  />
                  <Text>{clientData.averageRating.toFixed(1)}</Text>
                </>
              ) : (
                <>
                  <IconButton icon='star-outline' iconColor='#ccc' />
                  <Text>NO RATINGS YET</Text>
                </>
              )}
            </View>
          )}
        />

        <Card.Content>
          <List.Item
            style={styles.listItem}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            title={() =>
              editable ? (
                <TextInput
                  editable={true}
                  maxLength={12}
                  onChangeText={text => {
                    let formattedNumber = formatMobileNumber(text);
                    setPhoneNumber({
                      ...phoneNumber,
                      formatted: formattedNumber,
                    });
                  }}
                  value={phoneNumber.formatted}
                  keyboardType='phone-pad'
                  label={clientData?.phoneNumber ?? 'Add phone number'}
                  // onPressIn={() => setEditable(true)}

                  style={{
                    backgroundColor: 'transparent',
                    fontStyle: 'italic',
                    fontSize: 16,
                  }}
                  placeholderTextColor='#ccc'
                  underlineColor='transparent'
                  right={
                    <Button
                      icon='camera'
                      mode='contained'
                      onPress={() => console.log('Pressed')}
                      buttonColor='red'
                    >
                      Press me
                    </Button>
                  }
                />
              ) : (
                <Text
                  style={{
                    backgroundColor: 'transparent',
                    fontStyle: 'italic',
                    fontSize: 16,
                    padding: 19,
                  }}
                >
                  {clientData?.phoneNumber}
                </Text>
              )
            }
            titleStyle={
              !clientData?.phoneNumber && {
                fontStyle: 'italic',
              }
            }
            // description='Item description'
            left={() => (
              <MaterialCommunityIcons
                color={theme.colors.primary}
                size={24}
                name='phone'
                style={{
                  marginVertical: 20,
                }}
              />
            )}
            right={() => (
              <>
                {editable && (
                  <IconButton
                    icon='pencil-off-outline'
                    onPress={() => setEditable(false)}
                  />
                )}
                {phoneNumber.formatted.toString().length >= 10 && editable && (
                  <IconButton
                    icon={
                      !phoneNumberUpdated
                        ? 'check-circle-outline'
                        : 'check-circle'
                    }
                    // buttonColor='#68EEAD'
                    onPress={() => {}}
                    onLongPress={async () => {
                      if (!clientID)
                        return console.error(`No client ID in textInput!`);

                      try {
                        const docRef = doc(db, 'clients', clientID);

                        await updateDoc(docRef, {
                          phoneNumber: phoneNumber.formatted,
                        });

                        Haptics.Success();
                        setPhoneNumberUpdated(true);
                        setEditable(false);
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  />
                )}
              </>
            )}
            onPress={() => {
              handleOptionsMenu(clientData?.phoneNumber.replace(/\D/g, ''));
            }}
            onLongPress={() =>
              !editable ? setEditable(true) : setEditable(false)
            }
          />

          <Divider style={{ marginBottom: 20, paddingHorizontal: 100 }} />

          <View style={styles.subtitleContainer}>
            <Text style={{ lineHeight: 18 }}>Seen by </Text>
          </View>
          {(clientData ? clientData.postsAboutClient : []).map(
            (post: FireBasePost, index: number) => (
              <List.Item
                key={index}
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
                      uri: post?.media?.images
                        ? post.media.images[0]
                        : `https://api.dicebear.com/6.x/notionists/png/seed=${post?.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                    }}
                    size={64}
                  />
                )}
                right={() =>
                  post?.rating && (
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
                  router.push({
                    pathname: `posts/${post?.docId}`,
                    params: { docId: post?.docId },
                  })
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
  cardTitle: { fontSize: 36, paddingTop: 30 },
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
