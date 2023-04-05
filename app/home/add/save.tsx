import * as Haptics from 'expo-haptics';
import Swiper from 'react-native-swiper';
import SwiperNumber from 'react-native-swiper';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
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
} from 'react-native-paper';
// Firebase 8 imports
// import firebase from 'firebase';
// require('firebase/firestore');
// require('firebase/firebase-storage');
// Firebase 9 imports
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// import { firebaseApp } from '../_layout';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, firebaseConfig } from '../../../firebaseConfig';

type RouteParams = {
  imgUri: string;
};

export default function save() {
  console.log(`getAuth: ${JSON.stringify(getAuth())}`);

  // const storage = getStorage(firebaseApp);
  const theme = useTheme();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const router = useRouter();
  const { imgUri } = route.params;

  const [comments, setComments] = useState<string>('');
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const [productsDropdownOpen, setProductsDropdownOpen] =
    useState<boolean>(false);
  const [productsDropdownValue, setProductsDropdownValue] = useState<
    string[] | null
  >(null);
  const [productsList, setProductsList] = useState([
    {
      label: "Trader Joe's Tea Tree Conditioner",
    },
    { label: 'Arctic Fox Coloring' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState<boolean>(false);

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
  let images: Object[] = [{ uri: 'https://picsum.photos/id/0/200/300' }];
  for (let i = 1; i < 11; i++) {
    images.push([{ uri: `https://picsum.photos/id/${i}/200/300` }]);
  }

  const handleImageUpload = async () => {
    try {
      setLoading(true);

      // Firebase Methodology, Part III
      const response = await fetch(imgUri);
      const blob = await response.blob();
      const storage = getStorage();
      const auth = getAuth();
      const childPath = `post/${auth.currentUser?.uid}/${Math.random().toString(
        36
      )}`;
      console.log(`childPath: ${childPath}`);

      const storageRef = ref(storage, childPath);
      const task = uploadBytes(storageRef, blob);

      const taskProgress = (snapshot: { bytesTransferred: any }) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      try {
        const taskCompleted = async (snapshot: {
          ref: { getDownloadURL: () => any };
        }) => {
          const downloadURL = await snapshot.ref.getDownloadURL();
          console.log(`snapshot: ${downloadURL}`);
        };
      } catch (err) {
        console.error(`Error in completed task: ${err}`);
      }

      const taskError = (error: any) => {
        console.error(`Error uploading! ${error}`);
      };

      // task.on('state_changed', taskProgress, taskError, taskCompleted);
      task.then(snapshot => {
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
      });
    } catch (err) {
      console.error(`Error in uploading image: ${err}`);
    }

    const postsRef = collection(db, 'postNew');
    addDoc(postsRef, {
      auth: {
        displayName: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
      },
      createdAt: serverTimestamp(), // TODO: Isn't this handled automatically, serverside?
      comments: comments,
      rating: defaultRating,
      isSeasonal: isSeasonal,
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

  const handleStarRating = (item: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDefaultRating(item);
  };

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  return (
    <ModalProvider>
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
        <Swiper>
          {images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={{ width: '100%', height: '100%' }}
            />
          ))}
        </Swiper>
        {/* Hair type */}
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={items}
          setOpen={setModalVisible}
          setValue={setDropdownValue}
          setItems={setItems}
          theme={!theme.dark ? 'LIGHT' : 'DARK'}
          multiple={true}
          max={2}
          mode='BADGE'
          placeholder='Hair type'
          badgeDotColors={[
            '#e76f51',
            '#00b4d8',
            '#e9c46a',
            '#e76f51',
            '#8ac926',
            '#00b4d8',
            '#e9c46a',
          ]}
        />
        <Portal>
          <Modal visible={modalVisible} onDismiss={handleHideModal}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FlatList
                // TODO Optimize by using aither SVG or putting Skeleton on them until loaded FULLY
                data={hairTypeImages}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      dropdownValue === null
                        ? setDropdownValue([item.id])
                        : setDropdownValue([...dropdownValue, item.id]);
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      style={{ width: 120, height: 120, margin: 10 }}
                      source={item.uri}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={3}
              />
            </View>

            {/* TODO Requires attribution to use! */}
          </Modal>
        </Portal>
        {/* Hair length? */}
        {/* Color */}
        {/* Treatment done */}
        {/* Star rating */}
        {/* TODO Can probably offload to own component */}
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginVertical: 30,
          }}
        >
          {maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                style={{ marginHorizontal: 7 }}
                activeOpacity={0.7}
                key={item}
                onPress={() => handleStarRating(item)}
              >
                <MaterialCommunityIcons
                  name={item <= defaultRating ? 'star' : 'star-outline'}
                  size={36}
                  color='#FF9529'
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text>Client is seasonal</Text>
          <Switch
            value={isSeasonal}
            onChange={() => setIsSeasonal(!isSeasonal)}
          />
        </View>
        {/* Responds well to */}
        {/* <TextInput /> */}
        {/* Responds poorly to */}
        {/* <TextInput /> */}
        {/* Comments */}
        <TextInput
          style={{ width: '100%' }}
          label='Comments'
          value={comments}
          onChangeText={text => setComments(text)}
          multiline={true}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
        />

        <DropDownPicker
          theme={!theme.dark ? 'LIGHT' : 'DARK'}
          open={productsDropdownOpen}
          setOpen={setProductsDropdownOpen}
          value={productsDropdownValue}
          setValue={setProductsDropdownValue}
          items={productsList}
          setItems={setProductsList}
          multiple={true}
          mode='SIMPLE'
          placeholder='Products used'
          badgeDotColors={Object.values(theme.colors)}
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
    </ModalProvider>
  );
}
