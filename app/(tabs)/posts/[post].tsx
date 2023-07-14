import * as Haptics from 'expo-haptics';
import { faker } from '@faker-js/faker';
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
import { db } from '~/firebaseConfig';

export default function ClientProfile({
  postData,
}: {
  postData: FireBasePost;
}) {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  const { docId }: { docId?: string } = useLocalSearchParams();
  console.log(`docId: ${docId}`);
  const getStylistData = async () => {
    if (!docId) return;

    const docRef = doc(db, 'posts', docId);
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
  };

  // TODO These need to be replace with actual data, but will need to be engineered.
  // For example, user actually needs to come from something like the user context for the actual user.
  const placeholders = {
    recipient: faker.name.firstName(),
    user: faker.name.fullName(),
    phoneNumber: faker.phone.number('(###) ###-###').toString(),
  };
  const messageBody = encodeURI(
    `Hi ${placeholders.recipient} this is ${placeholders.user}. I just wanted to confirm the upcoming appointment with you`
  );

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
            await Linking.openURL(`sms:${phoneNumber}?body=${messageBody}`);
          } else {
            return;
          }
        } catch (err) {
          console.error(`menu option error: ${err}`);
        }
      }
    );
  };

  const [data, setData] = useState<DocumentData | FireBasePost>();

  // getDocs(userPostsCollectionRef)
  //   .then(querySnapshot => {
  //     querySnapshot.forEach(doc => {
  //       const data = doc.data(); // Get the data object
  //       data.docId = doc.id; // Add the id property with the value of doc.id

  //       list.push(data); // Push the modified object into the list array

  //       console.log(`id type: ${JSON.stringify(data, null, 2)}`);
  //     });

  //     setMyDbData(list);
  //     setInitialDbData(list);

  //     console.log(`list: ${JSON.stringify(list.slice(0, 2), null, 2)}`);
  //   })
  //   .catch((error: FirebaseError) => {
  //     console.log(
  //       'Error getting document: \x1b[34m',
  //       error.code,
  //       error.message
  //     );

  //     setErrors(error);
  //   });
  const fetchPost = async () => {
    if (!docId) return;

    // TODO Refactor into one line compound?
    const docRef = doc(db, 'posts', docId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    console.log(`in post: ${JSON.stringify(docSnap.data(), null, 2)}`);

    setData(docData);
  };

  useEffect(() => {
    fetchPost();
    getPosterInfo();
    getStylistData();
  }, []);

  useEffect(() => {
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
  }, [data]);

  // TEMP
  const getPosterInfo = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs;
      const posts = docSnapshot.map(doc => {
        // return { ...doc.data(), docId: doc.id };
        if (doc.id === data?.postedBy) {
          console.log(
            `user displayName: ${JSON.stringify(doc.data(), null, 2)}`
          );

          // append to data state var
          setData({ ...data, displayName: doc.data().displayName });
        }
      });
    }
  };

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ title: `${data?.clientName}` }} />

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

              <Link
                // href={{ pathname: '../users/123', params: { id: 123 } }}
                style={{
                  color: theme.colors.primary,
                  justifyContent: 'flex-end',
                  alignItems: 'baseline',
                }}
                href={{
                  pathname: `users/${data?.postedBy}`,
                  params: { docId: docId },
                }}
              >
                {postData?.displayName}
              </Link>

              <View
                style={{ backgroundColor: 'transparent' }}
                hitSlop={styles.utilHitSlop}
              ></View>
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
              onIndexChanged={(index: number) =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              {data.media.images.map((imgUri: string) => (
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
          {data?.phoneNumber && (
            <List.Item
              style={styles.listItem}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              title={`(${data.phoneNumber
                ?.toString()
                .slice(0, 3)}) ${data.phoneNumber
                ?.toString()
                .slice(3, 6)}-${data.phoneNumber?.toString().slice(6)}`}
              // description='Item description'
              left={() => (
                <MaterialCommunityIcons
                  color={theme.colors.primary}
                  size={24}
                  name='phone'
                />
              )}
              onPress={() => handleOptionsMenu(data.phoneNumber as string)}
            />
          )}

          {/* Salon */}
          <Subheading style={[styles.subtitle, { color: theme.colors.text }]}>
            Salon
          </Subheading>
          <Paragraph style={{ color: theme.colors.text }}>
            {data?.salonSeenAt ?? 'N/A'}
          </Paragraph>
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
