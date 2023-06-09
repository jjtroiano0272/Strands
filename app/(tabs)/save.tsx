import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import Swiper from 'react-native-swiper';
import SwiperNumber from 'react-native-swiper';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  Timestamp,
} from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from '@react-native-firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
// Local Imports
import { auth, db, firebaseConfig } from 'firebaseConfig';
import StarRating from '~/components/StarRating';
import {
  labels as labelsConst,
  hairTypeImages as hairTypeImagesConst,
} from '~/constants/Labels';
import { useGeoLocation } from '~/hooks/useGeolocation';
import { FireBasePost } from '~/@types/types';

type RouteParams = {
  imgUris: string;
};

export default function save() {
  console.log(`\x1B[34mgetAuth: ${JSON.stringify(getAuth(), null, 2)}`);

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
  const [newImgUris, setNewImgUris] = useState<string[] | null>(null);

  const [comments, setComments] = useState<string>('');
  const [salon, setSalon] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState([
    { id: 'products', open: false },
  ]);
  const [productsDropdownOpen, setProductsDropdownOpen] =
    useState<boolean>(false);
  const [formulaDropdownOpen, setFormulaDropdownOpen] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState({
    hairType: false,
    productsUsed: false,
    formulaType: false,
  });

  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const [formulaType, setFormulaType] = useState([
    {
      label: `AVEDA`,
      value: `aveda`,
    },
    {
      label: `Redken`,
      value: `redken`,
    },
    {
      label: `Tramesi`,
      value: `Tramesi`,
    },
    {
      label: `Goldwell`,
      value: `Goldwell`,
    },
  ]);
  const [formulaDescription, setFormulaDescription] = useState('');
  const [formulaValue, setFormulaValue] = useState<string[] | null>(null);
  const [fieldValue, setFieldValue] = useState<{
    quantity?: number;
    unit?: string | undefined;
  }>();
  const [productsDropdownValue, setProductsDropdownValue] = useState<
    string[] | null
  >(null);
  // TODO These will realistically have to be pulled from some DB probably
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
  const labels = labelsConst;
  const hairTypeImages = hairTypeImagesConst;
  const labelObjs = labels.map(label => ({ label, value: label }));
  const [items, setItems] = useState(labelObjs);
  const [blobArr, setBlobArr] = useState<any>(null);
  const [formData, setFormData] = useState<FireBasePost | null>(null);
  const [lat, lng] = useGeoLocation();

  const handleImageUpload = async () => {
    setLoading(true);

    /** Posts are organized by userID, then it shows the actual post. */
    const storage = getStorage();
    const auth = getAuth();
    const dbDestinationPath = `post/${
      auth.currentUser?.uid
    }/${Math.random().toString(36)}`;
    const storageRef = ref(storage, dbDestinationPath);

    if (imgUris.length === 1) {
      const blob = await fetch(imgUris[0])
        .then(async res => await res.blob())
        .catch(err =>
          console.error(`Failed to fetch blob from imgUris: ${err}`)
        );

      const task = uploadBytes(storageRef, blob!); // TODO Is this good practice to use non-null assertion?
      console.log(`task: ${JSON.stringify(task, null, 2)}`);

      task
        .then(snapshot => {
          console.log('Does this mean it was successful?');
          console.log(`metadata: ${snapshot.metadata}`);

          setPostSuccess(true);
          setLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // navigate user back to previous page/route
          router.replace('/home');
        })
        .catch(err => {
          setLoading(false);
          setTimeout(() => {
            setPostSuccess(false);
          }, 2000);
          console.error(`error uploading! ${err}`);
        });

      // TODO Get rid of nested functions
      // TODO Get rid of, refactor this  because this is the one that posts to the wrong directory
      // (async () => {
      //   const downloadURL = await getDownloadURL((await task).ref).catch(err =>
      //     console.error(`error in downloadURL: ${err}`)
      //   );

      //   const db = getFirestore();
      //   const currentUser = getAuth().currentUser;
      //   const postsRef = collection(db, 'posts');
      //   const userPostsRef = collection(
      //     doc(postsRef, currentUser?.uid),
      //     'userPosts'
      //   );

      //   const newPost = {
      //     downloadURL: downloadURL,
      //     caption: 'hard coded caption for testing purposes',
      //     creation: serverTimestamp(),
      //   };

      //   addDoc(userPostsRef, newPost);
      // })();

      let downloadURL;
      try {
        downloadURL = await getDownloadURL((await task).ref);
      } catch {
        (err: any) => console.error(`error in getting download URL: ${err}`);
      }

      const postsRef = collection(db, 'posts');
      addDoc(postsRef, {
        auth: {
          displayName: auth.currentUser?.displayName,
          uid: auth.currentUser?.uid,
        },
        createdAt: serverTimestamp(), // TODO: Isn't this handled automatically, serverside?
        comments: comments.length > 0 ? comments : null,
        rating: selectedUserRating,
        isSeasonal: isSeasonal,
        productsUsed: productsDropdownValue,
        downloadURL: downloadURL,
        // Only include if location services are permitted?
        geolocation: {
          lat: lat,
          lng: lng,
        },
        formula: {
          type: formulaValue, // e.g. AVEDA, Redken, etc.
          description: formulaDescription, // Actual user comments about the formulation
        },
      })
        .then(res => {
          setSnackbarMessage(`Posted successfully!`);
        })
        .catch(err => {
          setSnackbarMessage(`Error posting! ${err}`);
        });
    }

    if (imgUris.length > 1) {
      // Elements in imgUris look like
      // "file:///var/mobile/Containers/Data/Application/6BD76F07-7E63-44DA-A409-E4EC93762834/Library/Caches/ExponentExperienceData/%2540jonathan.troiano%252FYelpForHairStylists/ImagePicker/75264F55-F27A-4126-AC3F-E126D30849BA.jpg",

      imgUris.map(uri => {
        fetch(uri)
          .then(async res => {
            const blob = await res.blob();

            if (blob !== null) {
              console.log(`blob: ${JSON.stringify(blob)}`);

              console.log(
                `Before entering blobArr ternary. blobArr truthiness: ${
                  blobArr ? true : false
                }`
              );

              blobArr
                ? setBlobArr([...blobArr, blob]) // Probably origin of 'cannot convert null'
                : setBlobArr([blob]); // Probably origin of 'cannot convert null'
            }
          })
          .catch(err => {
            setLoading(false);
            setSnackbarMessage('Whoopsies');
            return console.error(`Error in promise: ${err}`);
          });
      });

      // const uploadFiles = async (files: Blob[]) => {

      const promises = [];

      for (const file of blobArr) {
        const fileName = file.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytes(storageRef, file);
        promises.push(uploadTask);
      }

      await Promise.all(promises)
        .then(res => console.log(`I think it all worked?\n${res}`))
        .catch(err => {
          console.error(`Error in resolving Promise.all: ${err}`);
          setSnackbarMessage(err);
        });

      console.log('Files uploaded successfully');
      // };
      // uploadFiles(blobArr);
    }
  };

  const handleShowModal = () => setModalVisible(true);

  const handleHideModal = () => setModalVisible(false);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  // TODO Possibly saving post as posts/userPosts
  // posts contains user id, then click through that id to find all posts by that id
  // { caption, createdAt, mediaUrl (points to fireStore) }

  useEffect(() => {
    console.log(`newImgUris: ${JSON.stringify(newImgUris, null, 2)}`);
  }, [newImgUris]);

  useEffect(() => {
    if (blobArr && blobArr.length > 0) {
      const uploadFiles = async (files: Blob[]) => {
        // ...
      };
      uploadFiles(blobArr);
    }
  }, [blobArr]);

  useEffect(() => {
    console.log(`fieldValue: ${JSON.stringify(fieldValue, null, 2)}`);
  }, [fieldValue]);

  return (
    <ModalProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <Pressable
            onPress={() => Keyboard.dismiss()}
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
            {/* <StarRating /> */}
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
              setOpen={() =>
                setDropdownVisible({ ...dropdownVisible, hairType: true })
              }
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
            {/* FORMULA
            formulaUsed: {
              type: 'aveda', // may also have RedKen, ... It will be selected from an array in dropdown
              // Could be anywhere from 1-n items
              quantities: [
                {
                  amount: 0, // number
                  unit: 'g', // string
                  product: 'productFoo', //string
                },
              ],
            }
            */}
            {/* FORMULA A */}
            {/* <View style={{ flexDirection: 'row' }}>
              <TextInput
                keyboardType='decimal-pad'
                onChangeText={text =>
                  // TODO If the Float comes out as having a trailing decimal but no mantissa after field is de-sele
                  setFieldValue({ ...fieldValue, quantity: parseFloat(text) })
                }
              />
              <Picker
                style={{ width: 100 }}
                selectedValue={fieldValue}
                onValueChange={itemValue => {
                  setFieldValue({ ...fieldValue, unit: itemValue });
                  console.log(
                    `parsing thorugh units: ${JSON.stringify(itemValue, null, 2)}`
                  );
                }}
              >
                {['grams', 'ml', 'oz'].map(element => (
                  <Picker.Item label={element} value={element} />
                ))}
              </Picker>
            </View> */}
            {/* FORMULA Bs */}
            {/* TODO If you press the same thing twice, it removes it from the list */}
            <DropDownPicker
              style={{ marginVertical: 20 }}
              theme={!theme.dark ? 'LIGHT' : 'DARK'}
              badgeDotColors={badgeColors}
              items={formulaType}
              setItems={setFormulaType}
              value={formulaValue}
              setValue={setFormulaValue}
              open={formulaDropdownOpen}
              setOpen={setFormulaDropdownOpen}
              mode='BADGE'
              multiple={true}
              max={1}
              placeholder='Type of formula'
              onSelectItem={() => setFormulaDropdownOpen(false)}
            />
            <TextInput
              style={{ width: '100%' }}
              label={`Formula description (like 'Base: 30g 6n 10g IB 8g oy...')`}
              keyboardType='default'
              onChangeText={text => setFormulaDescription(text)}
              value={formulaDescription}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              multiline={true}
            />
            {/* TODO Plus button here that adds another field */}
            <TextInput
              style={{ width: '100%' }}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              label='Salon'
              value={salon}
              onChangeText={text => setSalon(text)}
              multiline={true}
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
                      key={image.id}
                      onPress={() => {
                        dropdownValue === null
                          ? setDropdownValue([image.id])
                          : setDropdownValue([...dropdownValue, image.id]);
                        setModalVisible(false);
                      }}
                    >
                      {/* <Image key={image.id} source={{ uri: '' }} /> */}
                      <Button
                        mode='contained'
                        contentStyle={{ padding: 20, margin: 10 }}
                      >
                        {image.id}
                      </Button>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* TODO Images requires attribution to use! */}
              </Modal>
            </Portal>
            {/* TODO: Maybe make its down component? */}
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
          </Pressable>
          <Pressable
            onPress={() => Keyboard.dismiss()}
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
              {/* Maybe refactor with nullish coalescing */}
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
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalProvider>
  );
}
