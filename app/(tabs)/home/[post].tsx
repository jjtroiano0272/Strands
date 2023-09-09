import { useAuth } from '../../../context/auth';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Image,
  Linking,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FireBasePost } from '../../../@types/types';
import {
  Card,
  Subheading,
  Paragraph,
  MD3LightTheme,
  MD3DarkTheme,
  List,
  Chip,
  IconButton,
  MD3Colors,
  Snackbar,
} from 'react-native-paper';
import { Text, View } from '../../../components/Themed';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../../../context/UserContext';
import Swiper from 'react-native-swiper';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { PASS, USER, db } from '~/firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function ClientProfile() {
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [data, setData] = useState<DocumentData | FireBasePost>();
  const [clientID, setClientID] = useState<string>();
  const [copiedText, setCopiedText] = useState('');
  const [textCopied, setTextCopied] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>();
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [selectedChip, setSelectedChip] = useState<string>();
  const [showSelected, setShowSelected] = useState(false);
  const [phoneSnackbarVisible, setPhoneSnackbarVisible] = useState(false);
  const { docId } = useLocalSearchParams();

  const firebaseAuth = getAuth();

  // const messageBody = encodeURI(
  //   `Hi ${placeholders.recipient} this is ${placeholders.user}. I just wanted to confirm the upcoming appointment with you`
  // );

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleOptionsMenu = (phoneNumber: string) => {
    const menuOptions = [
      `Call ${data?.clientName}`,
      `Text ${data?.clientName}`,
      `Copy phone number`,
      'Cancel',
    ];

    // Show the action sheet to the user
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: menuOptions,
        cancelButtonIndex: menuOptions.length - 1,
      },
      async (index: number) => {
        try {
          // Call client
          if (menuOptions[index] === menuOptions[0]) {
            await Linking.openURL(`tel:${phoneNumber}`);
          }
          // Call client
          else if (menuOptions[index] === menuOptions[1]) {
            // await Linking.openURL(`sms:${phoneNumber}?body=${messageBody}`); TODO: This needs to work correctly to set body
            await Linking.openURL(`sms:${phoneNumber}`);
          }
          // Copy phone number
          else if (menuOptions[index] === menuOptions[2]) {
            handleCopyPhoneNumber(phoneNumber);
          }
          // Nothing selected?
          else {
            return Promise.reject('Invalid menu option');
          }
        } catch (err) {
          console.error(`menu option error: ${err}`);
        }
      }
    );
  };

  const fetchData = async () => {
    if (!docId) return console.error(`no doc id!`);

    try {
      // TODO Refactor into one line compound?
      const docRef = doc(db, 'posts', docId as string);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      // console.log(`docData single: ${JSON.stringify(docData, null, 2)}`); // has .postedBy

      const clientRef = doc(db, 'clients', docSnap?.data()?.clientID);
      const clientSnap = await getDoc(clientRef);
      const clientData = clientSnap.data();
      // console.log(`clientData: ${JSON.stringify(clientData, null, 2)}`);

      const userRef = doc(db, 'users', docData?.postedBy);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      console.log(`hello: ${JSON.stringify(userData, null, 2)}`);

      setClientID(docSnap?.data()?.clientID);
      setData({
        ...docData,
        clientName: clientData?.firstName,
        // Debug step
        ...data,
        phoneNumber: clientData?.phoneNumber,
        postedByDisplayName: userData?.displayName,
        postedByID: docData?.postedBy,
      });
    } catch (error) {
      console.error(`Error getting docs for post: ${error}`);
    }
  };

  const fetchStylistData = async () => {
    if (!docId) return console.error(`no docId in fetchStylistData`);

    try {
      const docRef = doc(db, 'posts', docId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(
          `post looking at : ${JSON.stringify(docSnap.data(), null, 2)}`
        );

        const idOfStylistThatPostedThis = docSnap.data().postedBy;

        // Then look up the users table by `postedBy` field from the doc here
        const stylistRef = doc(db, 'users', idOfStylistThatPostedThis);
        const stylistSnap = await getDoc(stylistRef);
        console.log(
          `Stylist data: ${JSON.stringify(stylistSnap.data(), null, 2)}`
        );
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // TEMP
  const getPosterInfo = async () => {
    // const querySnapshot = await getDocs(collection(db, 'users'));

    // if (!querySnapshot.empty) {
    //   const docSnapshot = querySnapshot.docs;
    //   const posts = docSnapshot.map(doc => {
    //     // return { ...doc.data(), docId: doc.id };
    //     if (doc.id === data?.postedBy) {
    //       console.log(
    //         `user displayName: ${JSON.stringify(doc.data(), null, 2)}`
    //       );

    //       // append to data state var
    //       setData({ ...data, displayName: doc.data().displayName });
    //     }
    //   });
    // }

    const userRef = doc(db, 'users', data?.postedByDisplayName);
    console.log(`userRef: ${JSON.stringify(userRef, null, 2)}`);

    try {
      const userDoc = await getDoc(userRef);
      console.log(`userDoc: ${JSON.stringify(userDoc, null, 2)}`);
      // Document was found in the cache. If no cached document exists,
      // an error will be returned to the 'catch' block below.
      console.log('Cached document data:', userDoc.data());
    } catch (error) {
      console.log('Error getting cached document:', error);
    }
  };

  const startAnimation = () => {
    setIsVisible(!isVisible);

    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleCopyItem = async (str: string, type?: 'partial') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await Clipboard.setStringAsync(str);

      startAnimation();
      setTextCopied(true);
      setSelectedChip(str);
      setSnackbarMessage(
        type === 'partial' ? 'Item copied' : 'Whole formula copied!'
      );
      setIsVisible(true);

      setTimeout(() => {
        console.log('Delayed for 1 second.');
        setTextCopied(false);
      }, 1000);
    } catch (error) {
      console.error(`some error in handleCopyItem: ${error}`);
    }
  };

  const handleCopyPhoneNumber = async (str: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Clipboard.setStringAsync(str);
      setPhoneSnackbarVisible(true);
    } catch (error) {
      console.error(`some error in handleCopyItem: ${error}`);
    }
  };

  const waitASecond = () => {
    setShowSelected(true);
    setTimeout(() => {
      console.log('Delayed for 1 second.');
      setShowSelected(false);
    }, 1000);
  };

  useEffect(() => {
    // fetchPost();
    // getStylistData();
    // fetchClientData();
    fetchData();
    getPosterInfo();
  }, []);

  useEffect(() => {
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
  }, [data]);

  return (
    <>
      <ScrollView style={styles.getStartedContainer}>
        <Stack.Screen
          options={{
            title: `${data?.clientName}`,
            headerRight: () => (
              <IconButton
                icon='phone'
                iconColor={textCopied ? 'green' : theme.colors.primary}
                mode={textCopied ? 'outlined' : undefined}
                size={24}
                onPress={() => handleOptionsMenu(data?.phoneNumber as string)}
              />
            ),
          }}
        />

        {/* <Text>docID: {docId}</Text> */}
        {/* <Text>clientID: {clientID}</Text> */}

        <Card
          style={styles.card}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        >
          <Card.Title
            theme={MD3DarkTheme}
            title={null} // Client's name
            titleStyle={[{ color: theme.colors.text }, styles.cardTitle]}
            // TODO: Make username URL
            subtitle={
              <View style={styles.subtitleContainer}>
                <Text style={{ lineHeight: 18 }}>Seen by </Text>

                {/* <Link
                  style={{
                    color: theme.colors.primary,
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}
                  href={{
                    pathname: `users/${data?.postedByDisplayName}`,
                    params: { userID: data?.postedByID },
                  }}
                >
                  {data?.postedByDisplayName}
                </Link>

                <View
                  style={{ backgroundColor: 'transparent' }}
                  hitSlop={styles.utilHitSlop}
                ></View> */}

                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}
                  hitSlop={{ left: 5, right: 50, top: 50, bottom: 40 }}
                  onPress={() =>
                    router.push({
                      pathname: `users/${data?.postedByDisplayName}`,
                      params: { userID: data?.postedByID },
                    })
                  }
                >
                  <Text style={{ color: theme.colors.primary }}>
                    {data?.postedByDisplayName}
                  </Text>
                </TouchableOpacity>
              </View>
            }
            subtitleStyle={[{ color: theme.colors.text }, styles.cardSubtitle]}
          />

          <Card.Content>
            {data?.media?.images && (
              <Swiper
                containerStyle={styles.swiper}
                dot={
                  <View
                    style={[
                      styles.dotStyle,
                      { borderColor: theme.colors.background },
                    ]}
                  />
                }
                activeDot={
                  <View
                    style={[
                      styles.activeDotStyle,
                      {
                        borderColor: theme.colors.background,
                        // backgroundColor: 'transparent',
                      },
                    ]}
                  />
                }
                onIndexChanged={(index: number) => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch (error) {
                    console.error(`Haptic error in onIndexChanged`);
                  }
                }}
              >
                {data?.media?.images.map((imgUri: string) => (
                  <Image
                    style={styles.flex1}
                    key={imgUri}
                    source={{
                      uri: imgUri,
                    }}
                  />
                ))}
              </Swiper>
            )}

            {/* TWO COLUMNS of list items */}
            {/* Recent reviews, listed in order of submission and saying who wrote what, and their own rating */}
            {/* Phone + prompt to hook into API to call */}
            {/* {data?.phoneNumber && (
              <List.Item
                style={styles.listItem}
                theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                title={data?.phoneNumber}
                left={() => (
                  <MaterialCommunityIcons
                    color={theme.colors.primary}
                    size={24}
                    name='phone'
                  />
                )}
                onPress={() => handleOptionsMenu(data?.phoneNumber as string)}
              />
            )} */}

            {!data?.phoneNumber && (
              <List.Item
                style={styles.listItem}
                theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                title='No phone number listed'
                left={() => (
                  <MaterialCommunityIcons color='#ccc' size={24} name='phone' />
                )}
                // onPress={() => handleOptionsMenu(data?.phoneNumber as string)}
              />
            )}

            {/* Salon */}
            <Subheading style={[styles.subtitle, { color: theme.colors.text }]}>
              Salon
            </Subheading>
            <Paragraph style={{ color: theme.colors.text }}>
              {data?.salonSeenAt
                ? capitalizeFirstLetter(data.salonSeenAt)
                : 'N/A'}
            </Paragraph>

            {/* Formulas */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Subheading
                style={[styles.subtitle, { color: theme.colors.text }]}
              >
                Formula
                {data?.formulaUsed?.type &&
                  ': ' + capitalizeFirstLetter(data?.formulaUsed?.type)}
              </Subheading>
              {data?.formulaUsed?.type && (
                <IconButton
                  icon='content-copy'
                  size={20}
                  iconColor={textCopied ? 'green' : MD3Colors.neutral0} // TODO Better implementation eventually
                  onPress={() => {
                    handleCopyItem(data?.formulaUsed?.description);
                  }}
                />
              )}

              {/* <Animated.Text style={[animatedStyle]}>
                Sliding Text
              </Animated.Text> */}
              <Animated.View
                style={[
                  // styles.fadingContainer,
                  {
                    // Bind opacity to animated value
                    opacity: slideAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text>{snackbarMessage}</Text>
              </Animated.View>
            </View>

            {data?.formulaUsed?.description
              ?.split('+')
              .map((item: string, index: number) => (
                <Chip
                  key={index}
                  selected={
                    item.trim() === selectedChip?.trim() && showSelected
                  }
                  style={{ marginVertical: 5, flex: 1 }}
                  onPress={() => {
                    handleCopyItem(item.trim(), 'partial');
                  }}
                >
                  {item.trim()}
                  {/* TODO UI: Later, have the clipboard icon showup and slide out in the chip itself */}
                </Chip>
              ))}

            {/* Comments */}
            <Subheading style={[styles.subtitle, { color: theme.colors.text }]}>
              Comments
            </Subheading>
            <Paragraph style={{ color: theme.colors.text }}>
              {data?.comments ?? 'No comments'}
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
      <Snackbar
        visible={phoneSnackbarVisible}
        duration={600}
        // style={{ left: 200, width: 175 }}
        onDismiss={() => setPhoneSnackbarVisible(false)}
        action={{
          label: '',
          onPress: () => {
            // Do something
            null;
          },
        }}
      >
        Phone number copied
      </Snackbar>
    </>
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
    // flex: 1,
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
    alignItems: 'baseline',
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
