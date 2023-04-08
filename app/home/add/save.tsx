import * as Haptics from 'expo-haptics';
import Swiper from 'react-native-swiper';
import SwiperNumber from 'react-native-swiper';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import {
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  TextInput,
  Modal,
  Portal,
  Provider as ModalProvider,
  Snackbar,
  IconButton,
  Checkbox,
  Switch,
  List,
} from 'react-native-paper';
// Firebase 8 imports
// import firebase from 'firebase';
// require('firebase/firestore');
// require('firebase/firebase-storage');
// Firebase 9 imports
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  addDoc,
  getDocs,
  collection,
  getDoc,
  getFirestore,
  serverTimestamp,
  doc,
  DocumentReference,
} from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';

// import { firebaseApp } from '../_layout';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, firebaseConfig } from '../../../firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';
import { firebase } from '@react-native-firebase/auth';
import StarRating from '../../../components/StarRating';

type RouteParams = {
  imgUris: string;
};

export default function save() {
  console.log(`getAuth: ${JSON.stringify(getAuth(), null, 2)}`);

  const numColors = 6;
  const badgeColors = Array.from({ length: numColors }, (_, i) => {
    const hue = (360 / numColors) * i; // calculate hue value for current color
    return `hsl(${hue}, ${70}%, ${70}%)`; // return HSL color string
  });

  // const storage = getStorage(firebaseApp);
  const theme = useTheme();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const router = useRouter();
  const imgUris = route.params.imgUris.split(',');

  const [comments, setComments] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const [productsDropdownOpen, setProductsDropdownOpen] =
    useState<boolean>(false);
  const [productsDropdownValue, setProductsDropdownValue] = useState<
    string[] | null
  >(null);
  const [productsList, setProductsList] = useState([
    {
      label: `Trader Joe's Tea Tree Conditioner`,
      value: `Trader Joe's Tea Tree Conditioner`,
    },
    { label: `Arctic Fox Coloring`, value: `Arctic Fox Coloring` },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState<boolean>(false);
  const [postData, setPostData] = useState<{} | null>(null);
  const [selectedUserRating, setSelectedUserRating] = useState<number | null>(
    null
  );

  const labels = [
    // '1A',
    // '1B',
    // '1C',
    '2A',
    '2B',
    '2C',
    '3A',
    '3B',
    '3C',
    '4A',
    '4B',
    '4C',
  ];

  const hairTypeImages = [
    { id: '2A', uri: require('../../../assets/images/hairType_2A.png') },
    { id: '2B', uri: require('../../../assets/images/hairType_2B.png') },
    { id: '2C', uri: require('../../../assets/images/hairType_2C.png') },
    { id: '3A', uri: require('../../../assets/images/hairType_3A.png') },
    { id: '3B', uri: require('../../../assets/images/hairType_3B.png') },
    { id: '3C', uri: require('../../../assets/images/hairType_3C.png') },
    { id: '4A', uri: require('../../../assets/images/hairType_4A.png') },
    { id: '4B', uri: require('../../../assets/images/hairType_4B.png') },
    { id: '4C', uri: require('../../../assets/images/hairType_4C.png') },
  ];

  const labelObjs = labels.map(label => ({ label, value: label }));
  const [items, setItems] = useState(labelObjs);
  // let images: Object[] = [{ uri: 'https://picsum.photos/id/0/200/300' }];
  let images: Object[] = [{ uri: 'https://picsum.photos/id/0/200/300' }];
  // for (let i = 1; i < 11; i++) {
  //   images.push([{ uri: `https://picsum.photos/id/${i}/200/300` }]);
  // }

  const handleImageUpload = async () => {
    setLoading(true);

    // Firebase Methodology, Part III
    const response = await fetch(imgUris);
    const blob = await response.blob();
    const storage = getStorage();
    const auth = getAuth();
    const childPath = `post/${auth.currentUser?.uid}/${Math.random().toString(
      36
    )}`;
    console.log(`childPath: ${childPath}`);

    const storageRef = ref(storage, childPath);
    const task = uploadBytes(storageRef, blob);

    // task.on('state_changed', taskProgress, taskError, taskCompleted);
    task
      .then(snapshot => {
        console.log('Does this mean it was successful?');
        console.log(`metadata: ${snapshot.metadata}`);

        setPostSuccess(true);
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // navigate user back to previous page/route
        router.replace('/home');

        setTimeout(() => {
          setPostSuccess(false);
        }, 2000);
      })
      .catch(err => console.error(`error uploading! ${err}`));

    // TODO Get rid of nested functions
    (async () => {
      const downloadURL = await getDownloadURL((await task).ref);

      const db = getFirestore();
      const currentUser = getAuth().currentUser;
      const postsRef = collection(db, 'posts');
      const userPostsRef = collection(
        doc(postsRef, currentUser?.uid),
        'userPosts'
      );

      const newPost = {
        downloadURL: downloadURL,
        caption: 'hard coded caption for testing purposes',
        creation: serverTimestamp(),
      };

      addDoc(userPostsRef, newPost);
    })();

    const postsRef = collection(db, 'postNew');
    addDoc(postsRef, {
      auth: {
        displayName: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
      },
      createdAt: serverTimestamp(), // TODO: Isn't this handled automatically, serverside?
      comments: comments,
      rating: selectedUserRating,
      isSeasonal: isSeasonal,
      productsUsed: productsDropdownValue,
    })
      .then(res => {
        setSnackbarMessage(`Posted successfully!`);
      })
      .catch(err => {
        setSnackbarMessage(`Error posting! ${err}`);
      });
  };

  const handleShowModal = () => setModalVisible(true);

  const handleHideModal = () => setModalVisible(false);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  // TODO Possibly saving post as posts/userPosts
  // posts contains user id, then click through that id to find all posts by that id
  // { caption, createdAt, mediaUrl (points to fireStore) }

  return (
    <ModalProvider>
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 30,
            paddingHorizontal: 10,
          }}
        >
          <Stack.Screen options={{ headerShown: false }} />
          {/* {imgUri && <Image source={{ uri: imgUri, height: 300, width: 300 }} />} */}
          <Swiper
            // containerStyle={{ flex: 1 }}
            containerStyle={{ height: 300, width: '100%', borderRadius: 30 }}
            onIndexChanged={() => Haptics.ImpactFeedbackStyle.Light}
          >
            {imgUris.map((uri, index) => (
              <Image
                key={index}
                source={{ uri: uri }}
                style={{ width: '100%', height: '100%' }}
              />
            ))}
          </Swiper>
          <StarRating />
          {/* Hair type */}
          <DropDownPicker
            theme={!theme.dark ? 'LIGHT' : 'DARK'}
            badgeDotColors={badgeColors}
            items={items}
            max={2}
            mode='BADGE'
            multiple={true}
            open={dropdownOpen}
            placeholder='Hair type'
            setItems={setItems}
            setOpen={setModalVisible}
            setValue={setDropdownValue}
            value={dropdownValue}
          />
          <DropDownPicker
            style={{ marginVertical: 20 }}
            theme={!theme.dark ? 'LIGHT' : 'DARK'}
            badgeDotColors={badgeColors}
            items={productsList}
            mode='BADGE'
            multiple={true}
            open={productsDropdownOpen}
            placeholder='Products used'
            setItems={setProductsList}
            setOpen={setProductsDropdownOpen}
            setValue={setProductsDropdownValue}
            value={productsDropdownValue}
          />
          <Portal>
            <Modal visible={modalVisible} onDismiss={handleHideModal}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* TODO Optimize by using aither SVG or putting Skeleton on them until loaded FULLY */}

                {hairTypeImages.map(image => (
                  <TouchableOpacity
                    onPress={() => {
                      dropdownValue === null
                        ? setDropdownValue([image.id])
                        : setDropdownValue([...dropdownValue, image.id]);
                      setModalVisible(false);
                    }}
                  >
                    {/* <Image key={image.id} source={{ uri: '' }} /> */}
                    <Button mode='contained'>{image.id}</Button>
                  </TouchableOpacity>
                ))}
              </View>

              {/* TODO Images requires attribution to use! */}
            </Modal>
          </Portal>
          <List.Item
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            style={{ width: '100%' }}
            title='Client is seasonal'
            right={props => (
              <Switch
                value={isSeasonal}
                onChange={() => setIsSeasonal(!isSeasonal)}
              />
            )}
          />

          <TextInput
            style={{ width: '100%' }}
            label='Comments'
            value={comments}
            onChangeText={text => setComments(text)}
            multiline={true}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
          />
        </View>

        <View
          style={{
            paddingVertical: 30,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            mode='contained'
            onPress={handleImageUpload}
            loading={loading}
            style={{ borderRadius: 50, width: 150 }}
            contentStyle={{ padding: 20 }}
            buttonColor={postSuccess ? 'green' : undefined}
          >
            {!loading && !postSuccess
              ? 'Post'
              : !loading && postSuccess
              ? 'Posted successfully!'
              : null}
          </Button>

          <Snackbar
            visible={snackbarVisible}
            duration={3000}
            onDismiss={onDismissSnackBar}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            action={{
              label: 'OK',
              onPress: () => {
                // Do something
              },
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </ScrollView>
    </ModalProvider>
  );
}
