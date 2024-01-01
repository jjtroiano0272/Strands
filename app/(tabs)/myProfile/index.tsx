import { UserContext } from '~/context/UserContext';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { MediaLibraryPermissionResponse } from 'expo-image-picker';
// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
import * as ImagePicker from 'expo-image-picker';

import { Gyroscope, Magnetometer } from 'expo-sensors';
import { Accelerometer } from 'expo-sensors';
import { Stack } from 'expo-router';

import React, { useContext, useEffect, useRef, useState } from 'react';

// import { Haptics } from '~/constants/constants';
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
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  Firestore,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  Avatar,
  Button,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { UserProfile } from '~/@types/types';
import Divider from '~/components/Divider';
import { SOCIAL_MEDIA_ICON_SIZE } from '~/constants/constants';
import { Skeleton } from 'moti/skeleton';
import { MotiView } from 'moti';
import { useAuth } from '~/context/auth';
import { useSession } from '~/context/expoDocsCtx';

const MyProfilePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const auth = getAuth();
  const userCtx = useContext(UserContext);
  const currentUserID = auth.currentUser?.uid;
  const [data, setData] = useState<{
    user?: UserProfile;
    posts?: DocumentData[];
  }>();
  const [userPosts, setUserPosts] = useState<DocumentData[]>();
  const myAuth = useAuth();

  const fetchUserData = async () => {
    if (!currentUserID) return;

    // pIsRHW945EW2ZJuSxxSFsqY7Hki1 UID received
    console.log(`auth: ${JSON.stringify(auth, null, 2)}`);
    console.log(
      `auth?.currentUser: ${JSON.stringify(auth?.currentUser, null, 2)}`
    );

    try {
      const userRef = doc(db, 'users', currentUserID);
      const userSnap = await getDoc(userRef);
      // Dec 3, 14:40: userSnap.data() was undefined when logging
      // Maybe my UID isn't actually registered in the DB rn...
      // console.log(`currentUserID: ${JSON.stringify(currentUserID, null, 2)}`);
      // console.log(`userSnap: ${JSON.stringify(userSnap, null, 2)}`);
      if (userSnap.exists()) {
        console.log('Document data:', userSnap.data());
      } else {
        // userSnap.data() will be undefined in this case
        console.log('No such document!');
      }

      // if (userSnap.exists()) {
      //   setData({ ...data, user: userSnap.data() as UserProfile });
      //   console.log('setUserData reached!');
      // } else {
      //   console.error(`Error fetching user's data!`);
      // }

      // get user's posts
      const postsRef = collection(db, 'posts');
      const postsQuery = query(
        postsRef,
        where('auth.uid', '==', auth?.currentUser?.uid)
        // orderBy('createdAt')
      );
      const querySnapshot = await getDocs(postsQuery);
      const postsData: DocumentData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(`postsData: ${JSON.stringify(postsData, null, 2)}`);

      // Compound query for recent activity
      // const recentActivityRef = collection(db, 'posts');
      // const newquery = query(
      //   postsRef,
      //   where('auth.uid', '==', auth?.currentUser?.uid)
      // );
      // const fooSnapshot = await getDocs(newquery);
      // const postsData: DocumentData[] = querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));

      setData({
        ...data,
        user: userSnap.data() as UserProfile,
        posts: postsData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Replace `instagram://user?username=USERNAME` with the Instagram link you want to open
  const handleClickSocialMediaLink = () => {
    const instagramLink = `instagram://user?username=${data?.user?.socialMediaLinks?.instagram}`;

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
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();
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

  const [editable, setEditable] = useState(false);
  const [profileDataBeforeSaving, setProfileDataBeforeSaving] = useState<{
    bio: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    profileImage: 'success' | 'error' | 'loading';
  }>();

  //
  //
  // IMAGE PICKING
  //
  //
  const [hasCameraPermission, setHasCameraPermission] = useState<any | null>(
    Camera.useCameraPermissions()
  );
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any | null>(
    ImagePicker.useMediaLibraryPermissions()
  );
  const [selectedImages, setSelectedImages] = useState<string[]>();
  Camera.requestCameraPermissionsAsync().catch(err =>
    console.error(`Camera permissions error ${err}`)
  );
  ImagePicker.requestMediaLibraryPermissionsAsync().catch(err =>
    console.error(`Image Picker permissions error ${err}`)
  );
  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');

        const galleryStatus: MediaLibraryPermissionResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted');

        if (!galleryStatus.granted) {
          Alert.alert('We need permissions in order for this to work!');
        }
      } catch (err) {
        console.error(`Error setting permissions: ${err}`);
      }
    })();
  }, []);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  Camera.requestCameraPermissionsAsync().catch(err =>
    console.error(`Camera permissions error ${err}`)
  );
  ImagePicker.requestMediaLibraryPermissionsAsync().catch(err =>
    console.error(`Image Picker permissions error ${err}`)
  );
  function toggleCameraType() {
    setCameraType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const storage = getStorage();
  const imagesRef = ref(storage, 'post');
  const userRef = ref(storage, 'post/eEXdyCMr0pgwCb8qNHeD11NT2683');
  const dbDestinationPath = `post/${
    auth.currentUser?.uid
  }/${Math.random().toString(24)}`;
  const storageRef = ref(storage, dbDestinationPath);
  const [imageUrl, setImageUrl] = useState<string | URL | undefined>();
  let uri: string;
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then(res => {
        if (res.canceled) {
          console.log('image picker canclled!');
        } else if (res.assets[0].uri) {
          uri = res.assets[0].uri;
        }
      })
      .catch(err => console.error(err.message));

    if (uri) {
      const imagesRefNew = ref(storage, 'post/' + Math.random().toString(24));
      const imageBlob = await fetch(uri).then(res => res.blob());
      const snapshot = await uploadBytes(imagesRefNew, imageBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(uri);
      console.log(`new downloadURL: ${JSON.stringify(downloadURL)}`);

      if (currentUserID) {
        await updateDoc(doc(db, 'users', currentUserID), {
          profileImage: downloadURL,
        }).then(res =>
          setUploadStatus({ ...uploadStatus, profileImage: 'success' })
        );
      } else {
        console.error('no uid!');
      }
    } else {
      console.error('no uri!');
    }
  };

  const uploadImage = async () => {
    const uid = getAuth().currentUser?.uid;
    const randID = Math.random().toFixed(15);

    const blob = await fetch(imageUrl as string)
      .then(async res => {
        console.log(`blob: ${JSON.stringify(blob)}`);

        return await res.blob();
      })
      .catch(err => console.error(`Failed to fetch blob from imgUris: ${err}`));

    if (blob) {
      // run the task code blelow
    }
    let downloadURL;
    try {
      downloadURL = await getDownloadURL(ref(storage, 'post/' + randID));
    } catch (error) {
      console.error(error);
    }

    const task = uploadBytes(storageRef, blob!)
      .then(snapshot => {
        console.log(`metadata: ${JSON.stringify(snapshot.metadata)}`);

        setUploadStatus({ ...uploadStatus, profileImage: 'success' });
        setLoading(false);

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
          console.error(`Haptic error in cons task of myProfile`);
        }
      })
      .catch(err => {
        setLoading(false);
        setTimeout(() => {
          setUploadStatus({ ...uploadStatus, profileImage: 'error' });
          console.error(`error uploading! ${err}`);
        }, 2000);
      });

    if (uid) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          profileImage: downloadURL,
        });
      } catch (error) {
        console.error(error);
      }
    }

    console.log(`downloadURL: ${downloadURL}`);

    setImageUrl(downloadURL);
  };

  // const unsub = uid
  //   ? onSnapshot(doc(db, 'users', uid), doc => {
  //       // console.log(
  //       //   'Current data: ',
  //       //   JSON.stringify(doc?.data()?.savedPosts, null, 2)
  //       // );

  //       const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
  //       console.log(
  //         '\x1b[32m',
  //         source,
  //         ' data: ',
  //         JSON.stringify(doc.data(), null, 2)
  //       );
  //     })
  //   : console.error('error in unsub');

  const handlePressEdit = async () => {
    if (editable) {
      setEditable(!editable);

      // update data on server
      const uid = getAuth().currentUser?.uid;

      if (uid) {
        try {
          await updateDoc(doc(db, 'users', uid), {
            displayName: data?.user?.displayName,
            bio: data?.user?.bio,
            // foo: data?.user?.profileImage,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleLongPressEdit = () => {
    if (!editable) {
      setEditable(!editable);
    }
  };

  const renderProfileImage = () => {
    if (uploadStatus?.profileImage === 'success') {
      return imageUrl as string;
    } else if (uploadStatus?.profileImage === undefined) {
      // Return some skeleton element otherwise...this might require all other returns to turn into the uri-containing object to work.
      return 'https://unsplash.it/300';
    } else {
      return data?.user?.profileImage;
    }
  };

  const sessionCtx = useSession();
  const handleLogout = () => {
    console.log('logging user out...');
    // myAuth?.signOut();
    // userCtx?.setIsLoggedIn(false);
    sessionCtx?.signOut();
  };

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
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log(`\x1b[32muser data: ${JSON.stringify(data, null, 2)}`);
    console.log(`auth: ${JSON.stringify(auth, null, 2)}`);

    console.log(
      `data.user.profileImage: ${JSON.stringify(
        data?.user?.profileImage,
        null,
        2
      )}`
    );

    console.log(`deviceHeight: ${JSON.stringify(deviceHeight, null, 2)}`);

    /* 
    auth: {
      "currentUser": {
        "uid": "pIsRHW945EW2ZJuSxxSFsqY7Hki1",
        "email": "jtroianofau@gmail.com",
        "emailVerified": false,
        "isAnonymous": false,
        "providerData": [
          {
            "providerId": "password",
            "uid": "jtroianofau@gmail.com",
            "displayName": null,
            "email": "jtroianofau@gmail.com",
            "phoneNumber": null,
            "photoURL": null
          }
        ],
        "stsTokenManager": {
          "refreshToken": "AMf-vBwTLvlJt93dYBpYbtU_9Zf6OQfsBjqTLbEReTaJsWIWVc56e3gTHHg00xPuUlsG0V-IeNMIYaCuMNiII9T1EthW4oEJBm_NX4IlS6WxBYywctGNQwBGAE7aKqBqbSMQDL51Mom2HQzNIkaBTDWWtc4NaI1z-doCPd3PJ9CiZythokfgKrz7sivGmgg2c8jwOLbKCdQX2vu8lxrxnXqJjTJZrFaE61kW3nLgdEV4yME5HoW8at0",
          "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhM2JkODk4ZGE1MGE4OWViOWUxY2YwYjdhN2VmZTM1OTNkNDEwNjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20veWVscGZvcmhhaXJzdHlsaXN0cyIsImF1ZCI6InllbHBmb3JoYWlyc3R5bGlzdHMiLCJhdXRoX3RpbWUiOjE3MDE2Mjk4NTQsInVzZXJfaWQiOiJwSXNSSFc5NDVFVzJaSnVTeHhTRnNxWTdIa2kxIiwic3ViIjoicElzUkhXOTQ1RVcyWkp1U3h4U0ZzcVk3SGtpMSIsImlhdCI6MTcwMTYyOTg1NCwiZXhwIjoxNzAxNjMzNDU0LCJlbWFpbCI6Imp0cm9pYW5vZmF1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqdHJvaWFub2ZhdUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.H9FcMfhlskA1qz9Na9a-xzbYJJD_eHpb0B1yAVlvqyB7Szc1dHDTQNFgLd-ahoJg1d4_y9duksaZ5O15OnDjdLAOl_AB71hJ8GlPpJ86M4paLfBh4Y3CbGSxL99Zcmahel5a8f1_Gtp-dT-PsCpJ5TH577DyBKN0m9lBUdrZ-gJq6US827mNrrmqo0V1gWlU0YMRzQMfyXlUdUIOOrS2IZtblgy96qj96NXeCzfWXbeC5msRwZYEMFaaUV5egWg2Kl93JCeC3rctQZN_CthZjrpp2c2NUQzJfi_b7Zq11D5SSG2_WbjefAHEeQizzsiPV9RXb07Mn8yV5DtGIfGjow",
          "expirationTime": 1701633454440
        },
        "createdAt": "1688661924388",
        "lastLoginAt": "1701629854386",
        ...
      }
    }
    */
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ height: deviceHeight - styles.container.padding }}>
          {/* Profile image and edit button */}
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              // justifyContent: 'flex-end',
              // backgroundColor: 'red',
              // paddingHorizontal: 10,
            }}
          >
            {/* Column 1 */}
            <View style={{ flex: 0.5, alignItems: 'center' }}></View>
            {/* Column 2 */}
            <View
              style={{
                flex: 2,
                width: 200,
                height: 200,
                borderRadius: 100,
                overflow: 'hidden',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (editable) {
                    handlePickImage();
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    } catch (error) {
                      console.error(`Haptic error, myProfile/index:409`);
                    }
                  }
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  borderColor: !editable ? undefined : '#ccc',
                  borderWidth: !editable ? undefined : 5,
                  overflow: 'hidden',
                }}
              >
                <MotiView
                  transition={{
                    type: 'timing',
                  }}
                  style={{ flex: 1, justifyContent: 'center', padding: 16 }}
                  // animate={{ backgroundColor: dark ? '#000000' : '#ffffff' }}
                  animate={{ backgroundColor: '#000000' }}
                >
                  <Skeleton height={200} width={200} radius='round'>
                    {true ? (
                      <Image
                        source={{
                          uri: renderProfileImage(),
                        }}
                        style={[
                          {
                            flex: 1,
                            height: undefined,
                            width: undefined,
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
                    ) : null}
                  </Skeleton>
                </MotiView>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
                top: -15,
              }}
            >
              <IconButton
                icon={!editable ? 'pencil-outline' : 'pencil'}
                onPress={handlePressEdit}
                onLongPress={handleLongPressEdit}
                iconColor={theme.colors.onBackground}
              />
            </View>
          </View>
          {/* User's subtitle of name */}
          <View style={styles.infoContainer}>
            {/* <Text style={[styles.text, { fontWeight: '200', fontSize: 36 }]}>
              {data?.user?.displayName}
            </Text> */}
            <TextInput
              style={[
                styles.text,
                {
                  fontWeight: '200',
                  fontSize: 36,
                  backgroundColor: 'transparent',
                },
              ]}
              mode='outlined'
              outlineColor={!editable ? 'transparent' : '#ccc'}
              underlineColor={!editable ? 'transparent' : '#ccc'}
              editable={editable}
              value={data?.user?.displayName}
              onChangeText={text =>
                setData({
                  ...data,
                  user: {
                    ...data?.user,
                    displayName: text,
                  } as UserProfile,
                })
              }
            />
          </View>
          <Divider />
          {/* User bio */}
          {/* <TextInput
            style={[
              styles.bioText,
              { fontWeight: '200', fontSize: 16, backgroundColor: 'transparent' },
            ]}
            mode='outlined'
            outlineColor={!editable ? 'transparent' : '#ccc'}
            underlineColor={!editable ? 'transparent' : '#ccc'}
            editable={editable}
            value={profileDataBeforeSaving?.bio}
            onChangeText={text =>
              setProfileDataBeforeSaving({
                ...profileDataBeforeSaving,
                bio: text,
              })
            }
          /> */}
          <TextInput
            style={[
              styles.bioText,
              {
                fontWeight: '200',
                fontSize: 16,
                backgroundColor: 'transparent',
              },
            ]}
            mode='outlined'
            outlineColor={!editable ? 'transparent' : '#ccc'}
            underlineColor={!editable ? 'transparent' : '#ccc'}
            editable={editable}
            value={data?.user?.bio}
            onChangeText={text =>
              setData({
                ...data,
                user: {
                  ...data?.user,
                  bio: text,
                } as UserProfile,
              })
            }
          />
          {/* Number of user's followers, posts, etc. */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statsBox}
              onPress={() =>
                router.push({
                  pathname: `/postsByCurrentUser/${currentUserID}`,
                  params: { uid: currentUserID },
                })
              }
            >
              <Text style={[styles.text, { fontSize: 24 }]}>
                {data?.posts?.length}
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
                {data?.user?.followers?.length ?? '-'}
              </Text>
              <Text style={[styles.text, styles.subText]}>Followers</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]}>
                {data?.user?.following?.length ?? '-'}
              </Text>
              <Text style={[styles.text, styles.subText]}>Following</Text>
            </View>
          </View>
          {/* User's media carousel */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {/* {userData?.posts &&
              userData?.posts.map((post, index) => (
                <View style={styles.mediaImageContainer} key={index}>
                  <Image
                    source={{ uri: post }}
                    style={styles.image}
                    resizeMode='cover'
                  />
                </View>
              ))} */}
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
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons
              name='keyboard-arrow-down'
              style={{ fontSize: 30 }}
            />
          </View>

          <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.recentItem}>
              <View style={styles.activityIndicator}></View>
              <View style={{ width: 250 }}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: data?.user?.following?.length ? '#41444B' : 'red',
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
                      color: data?.user?.following ? '#41444B' : 'red',
                      fontWeight: '300',
                    },
                  ]}
                >
                  Started following{' '}
                  <Text style={{ fontWeight: '400' }}>Luke Harper</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* EXTRA CONENT BELOW */}
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            icon='instagram'
            onPress={handleClickSocialMediaLink}
            size={SOCIAL_MEDIA_ICON_SIZE}
          />
          {editable && (
            <IconButton
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              icon='plus-circle-outline'
              onPress={() =>
                console.log('Prompt or modal to add a social media account')
              }
              size={SOCIAL_MEDIA_ICON_SIZE}
            />
          )}
        </View>
        <Button
          style={{ margin: 10, marginTop: 30, width: 300 }}
          mode='contained'
          contentStyle={{ padding: 10 }}
          buttonColor='red'
          // onPress={handleLogin}
          // disabled={!isValid}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfilePage;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: 'aqua',
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
  bioText: {
    // fontFamily: 'HelveticaNeue',
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
