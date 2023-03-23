import * as FileSystem from 'expo-file-system';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  useSearchParams,
  useLocalSearchParams,
  Stack,
  useRouter,
} from 'expo-router';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
// Firebase 8 imports
// import firebase from 'firebase';
// require('firebase/firestore');
// require('firebase/firebase-storage');
// Firebase 9 imports
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  UploadTask,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';

import { firebaseApp } from '../_layout';
import { Dropdown } from 'react-native-material-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function save() {
  type RouteParams = {
    imgUri: string;
  };

  // const storage = getStorage(firebaseApp);
  const theme = useTheme();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const router = useRouter();
  const { imgUri } = route.params;

  const [comment, setComment] = useState<string>('');
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const labels = [
    '1A',
    '1B',
    '1C',
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
  const labelObjs = labels.map(label => ({ label, value: label }));
  const [items, setItems] = useState(labelObjs);

  const handleImageUpload = async () => {
    setLoading(true);

    // Firebase 8 methodology
    // const response = await fetch(imgUri);
    // const blob = await response.blob();
    // const childPath = `post/${
    //   firebase.auth().currentUser?.uid
    // }/${Math.random().toString(36)}`;
    // console.log(`childPath: ${childPath}`);

    // const task = firebase.storage().ref().child(childPath).put(blob);
    // const taskProgress = (snapshot: any) => {
    //   console.log(`transferred: ${snapshot.bytesTransferred}`);
    // };

    // const taskCompleted = (snapshot: any) => {
    //   snapshot.ref
    //     .getDownloadURL()
    //     .then((snapshot: any) => console.log(`snapshot: ${snapshot}`));
    // };

    // const taskError = (snapshot: any) => {
    //   console.error(`Error uploading! ${snapshot}`);
    // };

    // task.on('state_changed', taskProgress, taskCompleted, taskError);

    // Firebase 9 methodology
    // const storage = getStorage();
    // const foo = Date.now().toString();
    // const storageRef = ref(storage, `images/some-child-${foo}`);

    // const response = await fetch(imgUri);
    // const blob = await response.blob();

    // uploadBytes(storageRef, blob)
    //   .then(snapshot => {
    //     console.log('Uploaded a blob or file!');
    //     setLoading(false);
    //   })
    //   .catch(err => console.error(`Whoops! ${err}`));

    // Firebase 9 methodology, II
    const response = await fetch(imgUri);
    const blob = await response.blob();
    const childPath = `post/${
      getAuth().currentUser?.uid
    }/${Math.random().toString(36)}`;
    console.log(`childPath: ${childPath}`);

    const storageRef = ref(getStorage());
    const fileRef = ref(storageRef, childPath);
    const uploadTask = (fileRef as any).put(blob);

    // const uploadTask: UploadTask = fileRef.put(blob);

    uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      },
      (error: any) => {
        console.error(`Error uploading! ${error}`);
      },
      () => {
        getDownloadURL(fileRef).then(downloadURL => {
          console.log(`downloadURL: ${downloadURL}`);
        });
      }
    );
  };

  return (
    <>
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
        {imgUri && <Image source={{ uri: imgUri, height: 300, width: 300 }} />}
        {/* Hair type */}
        <DropDownPicker
          placeholder='Hair type'
          open={dropdownOpen}
          value={dropdownValue}
          items={items}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setItems}
          theme={!theme.dark ? 'LIGHT' : 'DARK'}
          multiple={true}
          mode='BADGE'
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
        {/* Hair length? */}
        {/* Color */}
        {/* Treatment done */}

        {/* Star rating */}
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
                onPress={() => setDefaultRating(item)}
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

        {/* Responds well to */}
        {/* <TextInput /> */}
        {/* Responds poorly to */}
        {/* <TextInput /> */}

        {/* Comments */}
        <TextInput
          style={{ width: '100%' }}
          label='Comments'
          value={comment}
          onChangeText={text => setComment(text)}
          multiline={true}
        />
      </View>
      <View style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
        <Button mode='contained' onPress={handleImageUpload} loading={loading}>
          {!loading && 'Upload'}
        </Button>
      </View>
    </>
  );
}
