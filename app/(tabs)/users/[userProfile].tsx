// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
import { Gyroscope } from 'expo-sensors';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import * as ExpoLinking from 'expo-linking';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { faker } from '@faker-js/faker';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, postsRef } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  Avatar,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  useTheme,
} from 'react-native-paper';
import chalk from 'chalk';
import {
  SensorType,
  interpolate,
  useAnimatedSensor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { UserProfile } from '~/@types/types';

const NewsDetailsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const auth = getAuth();
  const currentUserID = auth.currentUser?.uid;
  const { userID: uid, docId } = useLocalSearchParams();
  const [userData, setUserData] = useState<{
    profileImage?: string;
    name?: string;
    posts?: string[];
    numPosts?: number;
    following?: string[];
    followers?: string[];
    socialMediaLinks?: {
      instagram?: string;
    };
    displayName?: string;
    [key: string]: any;
  }>();
  let postsByLoggedInUser: DocumentData[] = [];
  let postsByUserYouAreViewing: DocumentData[] = [];
  const [clientsInCommon, setClientsInCommon] = useState<DocumentData[]>();

  const checkSameValueForKey = (
    arr1: DocumentData[],
    arr2: DocumentData[],
    key: string
  ): DocumentData[] => {
    const matchingFields: DocumentData[] = [];
    // const matchingUsers: DocumentData[] = [];

    arr1.forEach(obj1 => {
      arr2.forEach(obj2 => {
        if (obj1[key] === obj2[key]) {
          matchingFields.push(obj1);
          // matchingUsers.push(obj1);
        }
      });
    });

    return matchingFields;
  };

  const fetchUserPosts = async () => {
    if (!uid) return console.error(`no uid`);

    try {
      // Posts made by the user YOU ARE LOOKING AT
      const loggedInUserPostsQueryRef = query(
        postsRef,
        where('auth.uid', '==', auth?.currentUser?.uid)
      ); // change uid to one of the clients user has seen

      const querySnapshotForLoggedInUser = await getDocs(
        loggedInUserPostsQueryRef
      );

      const queryPosts = query(postsRef, where('postedBy', '==', uid));
      const querySnapshot = await getDocs(queryPosts);
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
      });

      console.log(
        `querySnapshot length: ${JSON.stringify(querySnapshot.size, null, 2)}`
      );

      // Find clients in common
      // const compoundQuery = query(
      //   postsCollectionRef,
      //   where('auth.uid', '==', uid),
      //   where('clientName', '==', 'Ettie')
      // ); // change uid to one of the clients user has seen
      // const foo = await getDocs(compoundQuery);
      // console.log(`overlap: ${JSON.stringify(foo.docs, null, 2)}`);

      if (!querySnapshot.empty || !querySnapshotForLoggedInUser.empty) {
        console.log(`Was expecting you...`);

        // Retrieve the first matching document
        const docSnapshot = querySnapshot.docs[0];
        postsByUserYouAreViewing = [docSnapshot.data()];
        postsByLoggedInUser = querySnapshotForLoggedInUser.docs.map(doc =>
          doc.data()
        );

        console.log(`numposts SHOULD be ${querySnapshot.size}`);

        const userRef = doc(db, 'users', uid as string);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        console.log(`hello userData: ${JSON.stringify(userData, null, 2)}`);

        setUserData({
          // TODO This won't break it but it's not a good way to handle it....
          // profileImage: postsByUserYouAreViewing[0].auth.profileImage,
          // following: undefined,
          // followers: undefined,
          // posts: undefined,
          displayName: userData?.displayName,
          username: userData?.username,
          numPosts: querySnapshot?.size,
          socialMediaLinks: {
            instagram: postsByUserYouAreViewing[0]?.socialMediaLinks?.instagram,
          },
        });
      } else {
        console.log('No matching post found.');
      }

      setClientsInCommon(
        checkSameValueForKey(
          postsByLoggedInUser,
          postsByUserYouAreViewing,
          'clientName'
        )
      );

      console.log(
        `\x1b[33mclientsInCommon: ${JSON.stringify(clientsInCommon, null, 2)}`
      );
    } catch (error) {
      console.error(`Something wrong in [userProfile]:172: ${error}`);
    }
  };

  const fetchUserData = async () => {
    // const docRef = doc(db, 'posts', docId);
    // const docSnap = await getDoc(docRef);
    // const docData = docSnap.data();
    // // console.log(`docData single: ${JSON.stringify(docData, null, 2)}`); // has .postedBy

    // const clientRef = doc(db, 'clients', docSnap?.data()?.clientID);
    // const clientSnap = await getDoc(clientRef);
    // const clientData = clientSnap.data();
    // // console.log(`clientData: ${JSON.stringify(clientData, null, 2)}`);

    // const userRef = doc(db, 'users', docData?.postedBy);
    // const userSnap = await getDoc(userRef);
    // const userData = userSnap.data();
    // console.log(`hello: ${JSON.stringify(userData, null, 2)}`);

    if (!uid) return console.error(`No uid:[userProfile]`);

    try {
      const docRef = doc(db, 'users', uid as string);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();

      console.log(
        `docSnap in profile: ${JSON.stringify(docSnap.data(), null, 2)}`
      );

      setUserData({
        // ...userData,
        // following: docSnap?.data()?.following,
        // profileImage: (docSnap.data() as UserProfile).profileImage,
        ...docSnap.data(),
      });
    } catch (error) {
      console.error(`Error in fetching user's profile data: ${error}`);
    }
  };

  // Replace `instagram://user?username=USERNAME` with the Instagram link you want to open
  const handleClickSocialMediaLink = () => {
    const instagramLink = `instagram://user?username=${userData?.socialMediaLinks?.instagram}`;

    ExpoLinking.canOpenURL(instagramLink)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${instagramLink}`);
        } else {
          return ExpoLinking.openURL(instagramLink);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  // NotjustDev Parallax
  const { width, height } = useWindowDimensions();
  const IMAGE_OFFSET = 100;
  const PI = Math.PI;
  const HALF_PI = PI / 2;
  const sensor = useAnimatedSensor(SensorType.ROTATION);

  const imageStyle = useAnimatedStyle(() => {
    const { yaw, pitch, roll } = sensor.sensor.value;

    return {
      top: yaw,
      left: pitch,
    };
  }, []);

  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    const gyroscopeSubscription = Gyroscope.addListener(gyroscopeData => {
      setGyroscopeData(gyroscopeData);
    });

    const accelerometerSubscription = Accelerometer.addListener(
      accelerometerData => {
        setAccelerometerData(accelerometerData);
      }
    );

    return () => {
      gyroscopeSubscription.remove();
      accelerometerSubscription.remove();
    };
  }, []);

  useEffect(() => {
    fetchUserPosts();
    fetchUserData();
  }, []);

  useEffect(() => {
    // console.log(`userData: ${JSON.stringify(userData, null, 2)}`);
    console.log(`both vars: ${JSON.stringify({ uid, docId }, null, 2)}`);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Stack.Screen options={{ headerTitle: `${uid}` }} /> */}

      <View
        style={{
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: userData?.profileImage }}
            style={[
              {
                flex: 1,
                width: 200,
                height: 200,
                borderRadius: 100,
                overflow: 'hidden',
                transform: [
                  {
                    translateX: gyroscopeData.x * 1,
                  },
                  {
                    translateY: gyroscopeData.y * 1,
                  },
                ],
              },
            ]}
            resizeMode='contain'
          />
        </View>
      </View>

      {/* User's subtitle of name */}
      <View style={styles.infoContainer}>
        <Text style={[styles.text, { fontWeight: '300', fontSize: 36 }]}>
          {userData?.displayName}
          {/* Foo Barrington */}
        </Text>
        {uid !== currentUserID && (
          <View style={styles.dm}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  `Route to messages, create new message, or bottom sheet for message`
                )
              }
            >
              <MaterialIcons name='chat' size={18} color='#DFD8C8' />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {userData?.username && (
        <View style={styles.usernameContainer}>
          <Text style={[styles.text, { fontWeight: '300', fontSize: 14 }]}>
            @{userData?.username}
          </Text>
        </View>
      )}

      {/* Number of user's followers, posts, etc. */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statsBox}
          onPress={() =>
            router.push({
              pathname: `/postsByCurrentUser/${uid}`,
              params: { uid },
            })
          }
        >
          <Text style={[styles.text, { fontSize: 24 }]}>
            {userData?.numPosts}
          </Text>
          <Text style={[styles.text, styles.subText]}>Posts</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.statsBox,
            {
              borderColor: '#DFD8C8',
              borderLeftWidth: 1,
              borderRightWidth: 1,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: 24 }]}>
            {userData?.followers?.length ?? '0'}
          </Text>
          <Text style={[styles.text, styles.subText]}>Followers</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24 }]}>
            {userData?.following?.length ?? '0'}
          </Text>
          <Text style={[styles.text, styles.subText]}>Following</Text>
        </View>
      </View>

      {/* User's media carousel */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {userData?.posts &&
          userData?.posts.map((post, index) => (
            <View style={styles.mediaImageContainer} key={index}>
              <Image
                source={{ uri: post }}
                style={styles.image}
                resizeMode='cover'
              />
            </View>
          ))}
      </ScrollView>

      {/* <View style={styles.mediaCount}>
        <Text
          style={[
            styles.text,
            { fontSize: 24, color: '#DFD8C8', fontWeight: '300' },
          ]}
        >
          70
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: 12,
              color: '#DFD8C8',
              textTransform: 'uppercase',
            },
          ]}
        >
          Media
        </Text>
      </View> */}

      <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.recentItem}>
          <View style={styles.activityIndicator}></View>
          <View style={{ width: 250 }}>
            <Text
              style={[
                styles.text,
                {
                  color: userData?.following?.length ? '#41444B' : 'red',
                  fontWeight: '300',
                },
              ]}
            >
              Started following{' '}
              <Text style={{ fontWeight: '400' }}>Jake Challeahe</Text> and{' '}
              <Text style={{ fontWeight: '400' }}>Luis Poteer</Text>
            </Text>
          </View>
        </View>
        <View style={styles.recentItem}>
          <View style={styles.activityIndicator} />
          <View style={{ width: 250 }}>
            <Text
              style={[
                styles.text,
                {
                  color: userData?.following ? '#41444B' : 'red',
                  fontWeight: '300',
                },
              ]}
            >
              Started following{' '}
              <Text style={{ fontWeight: '400' }}>Luke Harper</Text>
            </Text>
          </View>
        </View>
        <MaterialIcons name='keyboard-arrow-down' style={{ fontSize: 30 }} />
      </View>

      {clientsInCommon &&
        clientsInCommon.length > 0 &&
        uid !== currentUserID && (
          <>
            <Text style={[styles.subText, styles.recent]}>
              You have {clientsInCommon?.length} client
              {clientsInCommon && clientsInCommon?.length > 1 && 's'} in common
              with {userData ? userData.name : 'placeholder Name'}
            </Text>
            <View style={{ flexDirection: 'row', margin: 10 }}>
              {clientsInCommon &&
                clientsInCommon.map((client: DocumentData, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      router.push({
                        pathname: `clientInCommon/${client?.clientName}`,
                        params: {
                          clientName: client?.clientName,
                          otherStylistsUid: uid,
                        },
                      })
                    }
                  >
                    <Avatar.Image
                      size={48}
                      source={{
                        uri:
                          client?.media?.image[0] ??
                          'https://unsplash.it/50/50',
                      }}
                      style={{ marginHorizontal: 5 }}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </>
        )}

      <IconButton
        icon='instagram'
        onPress={handleClickSocialMediaLink}
        size={24}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      />
    </ScrollView>
  );
};

export default NewsDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  textHeader: { fontSize: 42, color: 'blue' },
  profileImage: {
    // width: 300,
    // height: 300,
    resizeMode: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: 300,
    width: 300,
    // borderRadius: 100,
    // overflow: 'hidden',
  },
  usernameContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  dm: {
    backgroundColor: '#41444B',
    // position: 'absolute',
    // top: 20,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'HelveticaNeue',
    color: '#52575D',
  },

  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  active: {
    backgroundColor: '#34FFB9',
    position: 'absolute',
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: '#41444B',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 32,
  },
  statsBox: {
    alignItems: 'center',
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  mediaCount: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    // shadowColor: 'rgba(0, 0, 0, 0.38)',
    // shadowOffset: { width: 0, height: 10 },
    // shadowRadius: 20,
    // shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: '#CABFAB',
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
  logoutButton: { margin: 30 },
});
