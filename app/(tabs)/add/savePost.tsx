import MultiSelect from 'react-native-multiple-select';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-core';
import { SearchBox } from 'react-instantsearch';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import Swiper from 'react-native-swiper';
import SwiperNumber from 'react-native-swiper';
import Carousel from 'react-native-reanimated-carousel';
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
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  Chip,
  MD3Colors,
  Icon,
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
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';

import { getAuth, User } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from '@react-native-firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
// Local Imports
import { auth, clientsRef, db, firebaseConfig } from '~/firebaseConfig';
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
  // const imgUris = route.params.imgUris.split(',');
  // const imgUris = ['https://loremflickr.com/320/240'];
  const searchParams = useLocalSearchParams() as { imgUris: string };
  // const imageFoos = imgUris.split(',');
  const imgUris = searchParams?.imgUris?.split(',');

  const [newImgUris, setNewImgUris] = useState<string[] | null>(null);

  const [comments, setComments] = useState<string>('');
  const [salon, setSalon] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
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
  const hairTypeLabelsArr = labelsConst;
  const hairTypeImages = hairTypeImagesConst;
  const hairTypesConst = [
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
  const hairTypeLabelsObj = hairTypeLabelsArr.map(label => ({
    label,
    value: label,
  }));
  const [hairTypeLabels, setHairTypeLabels] = useState(hairTypeLabelsObj);
  const [blobArr, setBlobArr] = useState<Blob[]>([]);
  const [formData, setFormData] = useState<FireBasePost | null>(null);
  const [lat, lng] = useGeoLocation();

  const handleImageUpload = async () => {
    setLoading(true);

    try {
      /** Posts are organized by userID, then it shows the actual post. */
      const storage = getStorage();
      const auth = getAuth();
      const dbDestinationPath = `post/${
        auth.currentUser?.uid
      }/${Math.random().toString(36)}`;
      const storageRef = ref(storage, dbDestinationPath);
      let blob: void | Blob;

      // Gets here succesfully
      if (imgUris.length === 1) {
        console.warn(`inside first if`);

        try {
          blob = await fetch(imgUris[0])
            .then(async res => await res.blob())
            .catch(err =>
              console.error(`Failed to fetch blob from imgUris: ${err}`)
            );
          console.warn(`Got to the blob try`);
        } catch (error) {
          console.error(`Error inside fetching blob: ${error}`);
        }

        const task = uploadBytes(storageRef, blob!); // TODO Is this good practice to use non-null assertion?
        console.log(`task: ${JSON.stringify(task, null, 2)}`);

        console.warn(`211`);
        task
          .then(snapshot => {
            console.log('Does this mean it was successful?');
            console.log(`metadata: ${snapshot.metadata}`);

            console.warn(`217`);
            setPostSuccess(true);
            setLoading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // navigate user back to previous page/route
            console.warn(`Sign post 224`);
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

        const postsRef = collection(db, 'posts');
        let downloadURL;
        try {
          downloadURL = await getDownloadURL((await task).ref);
          console.warn(`Sign post 261`);
          console.log(`downloadURL: ${JSON.stringify(downloadURL, null, 2)}`);
        } catch {
          (err: any) => console.error(`error in getting download URL: ${err}`);
        }

        // doc ids of posts to remove

        /* DB Strucutre:
        
          X clientID: string,
          X comments: string,
          X createdAt: string? (serverTimestamp),
          X postedBy: string,
          X rating: number,
          X geolocation: {
            lat: string,
            lng: string
          },
          X lastUpdatedAt: string,
          X formulaUsed: {
            description: string,
            type: string
          },
          media: {
            images: string[],
            videos: string[]
          },
          X salonSeenAt: string
         */

        addDoc(postsRef, {
          // auth: {
          //   displayName: auth?.currentUser?.displayName ?? null,
          //   uid: auth?.currentUser?.uid ?? null,
          // },
          postedBy: auth?.currentUser?.uid ?? null,
          clientID: (clientName && clientIDTemp) ?? null,
          comments: comments.length > 0 ? comments : null,
          createdAt: serverTimestamp(), // TODO: Isn't this handled automatically, serverside?
          lastUpdatedAt: serverTimestamp(),
          rating: selectedUserRating,
          isSeasonal: isSeasonal,
          productsUsed: productsDropdownValue,
          downloadURL: downloadURL ?? null,
          salonSeenAt: salon,
          // Only include if location services are permitted?
          geolocation: {
            lat: lat,
            lng: lng,
          },
          formulaUsed: {
            description: formulaDescription, // Actual user comments about the formulation
            type: formulaValue?.join(' ') ?? null, // e.g. AVEDA, Redken, etc.
          },
          media: {
            images: [downloadURL ?? null],
            videos: [null],
          },
        })
          .then(res => {
            console.warn(`Sign post 289`);

            router.replace({
              pathname: '/home',
              params: {
                snackbarMessage: `Image uploaded successfully`,
                seePostID: res.id,
              },
            });
            // setSnackbarMessage(`Posted successfully!`);
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

              console.log(
                `BlobArr (expected falsy): ${blobArr ? true : false}`
              );

              setBlobArr(prev => [...prev, blob]);
            })
            .catch(err => {
              setLoading(false);
              setSnackbarMessage('Whoopsies');
              return console.error(`Error in promise: ${err}`);
            });
        });

        // const uploadFiles = async (files: Blob[]) => {

        console.warn(`Before promises`);

        const promises = [];
        for (const file of blobArr) {
          console.warn(`inside blobArr iter fn`);
          const fileName = file.name;
          const storageRef = ref(storage, fileName);

          const uploadTask = uploadBytes(storageRef, file);
          promises.push(uploadTask);
          console.warn(`end of blobArr iter fn`);
        }

        console.warn(`Before promise all`);
        await Promise.all(promises)
          .then(res => console.log(`I think it all worked?\n${res}`))
          .catch(err => {
            console.error(`Error in resolving Promise.all: ${err}`);
            setSnackbarMessage(err);
          });

        router.replace({
          pathname: '/home',
          params: {
            snackbarMessage: `${imgUris.length} files uploaded successfully`,
          },
        });
        // setSnackbarMessage('All files uploaded successfully');

        // };
        // uploadFiles(blobArr);
      }
    } catch (error) {
      setLoading(false);
      console.error(`Error in image upload: ${error}`);
    }
  };

  const handleShowModal = () => setModalVisible(true);

  const handleHideModal = () => setModalVisible(false);

  // TODO Possibly saving post as posts/userPosts
  // posts contains user id, then click through that id to find all posts by that id
  // { caption, createdAt, mediaUrl (points to fireStore) }

  useEffect(() => {
    console.log(`imgUris: ${JSON.stringify(imgUris, null, 2)}`);
    console.log(`newImgUris: ${JSON.stringify(newImgUris, null, 2)}`);
  }, [newImgUris, imgUris]);

  useEffect(() => {
    if (blobArr && blobArr.length > 0) {
      // const uploadFiles = async (files: Blob[]) => {
      //   // ...
      // };
      // uploadFiles(blobArr);
    }

    console.log(`blobArr: ${JSON.stringify(blobArr, null, 2)}`);
  }, [blobArr]);

  useEffect(() => {
    console.log(`fieldValue: ${JSON.stringify(fieldValue, null, 2)}`);
  }, [fieldValue]);

  const [selected, setSelected] = useState([]);
  const [hairTypeHelpVisible, setHairTypeHelpVisible] = useState(false);

  const data = [
    { key: '1', value: 'Mobiles', disabled: true },
    { key: '2', value: 'Appliances' },
    { key: '3', value: 'Cameras' },
    { key: '4', value: 'Computers', disabled: true },
    { key: '5', value: 'Vegetables' },
    { key: '6', value: 'Diary Products' },
    { key: '7', value: 'Drinks' },
  ];

  const [clientName, setClientName] = useState('');
  const [clientSearchResults, setClientSearchResults] =
    useState<DocumentData[]>();

  const searchClientName = async (name: string) => {
    let results: DocumentData[] = [];

    const firstNameQuery = await getDocs(
      query(clientsRef, where('firstName', '>=', name))
    );
    const lastNameQuery = await getDocs(
      query(clientsRef, where('lastName', '<=', name))
    );

    const [firstNameResults, lastNameResults] = await Promise.all([
      firstNameQuery,
      lastNameQuery,
    ]);
    firstNameResults.forEach(doc => {
      results.push({ ...doc.data(), clientID: doc.id });
    });

    lastNameResults.forEach(doc => {
      results.push({ ...doc.data(), clientID: doc.id });
    });

    console.log(
      `searching clients results (${results.length} found): ${JSON.stringify(
        results,
        null,
        2
      )}`
    );

    setClientSearchResults(results);
    return results;
  };

  useEffect(() => {
    searchClientName(clientName);
  }, [clientName]);

  const [clientIDTemp, setClientIDTemp] = useState<string>('');
  const [clientAutofilled, setClientAutofilled] = useState(false); // Use for when selecting the client from the list that pops up

  const [showFoundClients, setShowFoundClients] = useState(true);
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: ``,
        }}
      />

      <ModalProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
            {/* <Stack.Screen options={{ headerShown: false }} /> */}
            {/* {imgUri && <Image source={{ uri: imgUri, height: 300, width: 300 }} />} */}

            {/* <Swiper
              // containerStyle={{ flex: 1 }}
              // swiper: { flex: 1, aspectRatio: 1, borderRadius: 30 },
              style={{}}
              containerStyle={{ height: 300, width: '100%', borderRadius: 30 }}
              // onIndexChanged={() =>
              //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              // }
              // showsButtons
            >
              {imgUris
                ? imgUris.map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri: uri }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ))
                : null}
            </Swiper> */}

            <Carousel
              mode='parallax'
              loop={imgUris?.length > 1 ? true : false}
              width={Dimensions.get('window').width * 0.9}
              height={300}
              // autoPlay={true}
              data={imgUris}
              pagingEnabled={true}
              scrollAnimationDuration={1000}
              onSnapToItem={index => console.log('current index:', index)}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            />

            {/* <StarRating /> */}

            <TextInput
              style={styles.inputComponent}
              mode='outlined'
              left={
                clientAutofilled && (
                  <TextInput.Icon icon='account-check' color='green' />
                )
              }
              right={
                clientAutofilled && (
                  <TextInput.Icon
                    icon='close-circle'
                    color={MD3Colors.neutral0}
                    onPress={() => {
                      setClientName('');
                      setClientIDTemp('');
                      setClientAutofilled(false);
                    }}
                  />
                )
              }
              label='Client name' // later on, name OR phone number
              keyboardType='default'
              textColor={clientAutofilled ? 'green' : undefined}
              onChangeText={text => {
                setClientName(text);
                setShowFoundClients(true);
              }}
              // onChangeText={text => searchClientName(text)}
              value={clientName}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            />
            {/* Showing potential client matches */}
            {clientSearchResults?.length &&
              clientName &&
              showFoundClients &&
              clientSearchResults?.slice(0, 2).map((clientFound, index) => (
                <List.Item
                  key={index}
                  onPress={() => {
                    setClientName(
                      `${clientFound.firstName} ${clientFound.lastName}`
                    );
                    setClientIDTemp(clientFound.clientID);
                    setClientAutofilled(true);
                    setShowFoundClients(false);
                  }}
                  theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                  style={{
                    width: '100%',
                    backgroundColor: MD3LightTheme.colors.onPrimary,
                    marginVertical: 5,
                    borderRadius: 10,
                  }}
                  title={`${clientFound.firstName} ${clientFound.lastName}`}
                />
              ))}
            {/* <MultiSelect
              items={[
                {
                  id: '92iijs7yta',
                  name: 'Ondo',
                },
                {
                  id: 'a0s0a8ssbsd',
                  name: 'Ogun',
                },
                {},
              ]}
              uniqueKey='id'
              onSelectedItemsChange={items =>
                console.log(JSON.stringify(items, null, 2))
              }
            /> */}

            <List.Item
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              style={{ width: '100%' }}
              title='This client is seasonal'
              right={props => (
                <Switch
                  value={isSeasonal}
                  onChange={() => setIsSeasonal(!isSeasonal)}
                />
              )}
            />
            <MultipleSelectList
              setSelected={(val: any) => setSelected(val)}
              data={productsList}
              save='value'
              placeholder='Products used'
              label='Products used'
              // onSelect={() => alert(selected)}
            />
            <DropDownPicker
              placeholder='Hair type'
              listMode='MODAL'
              theme={!theme.dark ? 'LIGHT' : 'DARK'}
              badgeDotColors={badgeColors}
              items={hairTypeLabels}
              max={2}
              mode='BADGE'
              multiple={true}
              open={dropdownOpen}
              setItems={setHairTypeLabels}
              setOpen={() => {
                // setDropdownVisible({ ...dropdownVisible, hairType: true });
                // handleShowModal();
                setDropdownOpen(true);
                console.log(`Opened hair type dropdown`);
              }}
              onClose={() => setDropdownOpen(false)}
              setValue={setDropdownValue}
              value={dropdownValue}
            />
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
              listMode='SCROLLVIEW'
              onSelectItem={() => setFormulaDropdownOpen(false)}
            />

            <TextInput
              style={styles.inputComponent}
              mode='outlined'
              label={`Formula description (like 'Base: 30g 6n 10g IB 8g oy...')`}
              keyboardType='default'
              onChangeText={text => setFormulaDescription(text)}
              value={formulaDescription}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              multiline={true}
            />
            {/* TODO Plus button here that adds another field */}
            <TextInput
              style={styles.inputComponent}
              mode='outlined'
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              label='Salon'
              value={salon}
              onChangeText={text => setSalon(text)}
              multiline={true}
            />
            <TextInput
              style={styles.inputComponent}
              mode='outlined'
              label='Comments'
              value={comments}
              onChangeText={text => setComments(text)}
              multiline={true}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            />
            <Portal>
              <Modal visible={modalVisible} onDismiss={handleHideModal}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                  }}
                >
                  {/* TODO Optimize by using aither SVG or putting Skeleton on them until loaded FULLY */}
                  {hairTypesConst.map(image => (
                    <TouchableOpacity
                      style={{ width: '33%' }}
                      key={image.id}
                      onPress={() => {
                        dropdownValue === null
                          ? setDropdownValue([image.id])
                          : setDropdownValue([...dropdownValue, image.id]);
                        setModalVisible(false);
                      }}
                    >
                      <Image
                        key={image.id}
                        source={image?.uri}
                        style={{ height: 100, width: 100 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {/* TODO Images requires attribution to use! */}
              </Modal>
            </Portal>
            {/* TODO: Maybe make its down component? */}
          </Pressable>

          {/* POST/UPLOAD BUTTON */}

          <View
            style={{
              paddingVertical: 30,
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              disabled={clientName?.length < 1}
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
          </View>

          <Snackbar
            visible={snackbarVisible}
            duration={3000}
            onDismiss={() => setSnackbarVisible(false)}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            action={{
              label: 'OK',
              onPress: () => {
                setSnackbarVisible(false);
              },
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </KeyboardAvoidingView>
      </ModalProvider>
    </ScrollView>
  );
}

// inputsContainer
const styles = StyleSheet.create({
  inputsContainer: {
    paddingVertical: 20,
    width: '100%',
  },
  inputComponent: {
    marginVertical: 10,
    width: '100%',
  },
});
