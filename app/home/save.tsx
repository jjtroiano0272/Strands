import * as FileSystem from 'expo-file-system';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  useSearchParams,
  useLocalSearchParams,
  Stack,
  useRouter,
} from 'expo-router';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';
import { firebaseApp } from '../_layout';
import { Dropdown } from 'react-native-material-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function save() {
  type RouteParams = {
    imgUrl: string;
  };

  const theme = useTheme();
  const storage = getStorage(firebaseApp);

  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { imgUrl } = route.params;

  const [comment, setComment] = useState<string>('');

  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleImageUpload = async () => {
    setLoading(true);
    // upload to firestore...
    // const uri = 'foo/string';
    // const res = await fetch(uri);
    // const blob = await res.blob();
    // const task = ref(storage);

    // TODO Just symbolic file for now
    const file = { name: 'foo', uri: 'file/path/and/name.exdt' };
    const storage = getStorage();
    const storageRef = ref(storage);

    const imagesRef = ref(storage, 'images');

    uploadBytes(imagesRef, imgUrl)
      .then(res => {
        console.log(`upload success! res: ${JSON.stringify(res)}`);
        setLoading(false);
        router.push('/');
      })
      .catch(err => {
        console.error(`Upload error! ${err}`);
        setLoading(false);
      });
  };

  // console.log(localParams);
  // console.log(`route in Save: ${route}`);
  console.log(`route in Save: ${route.params.imgUrl}`);

  // const testArr = Array(4)
  //   .fill('A')
  //   .map(x => Array(3).fill(['A', 'B', 'C']));

  // console.log(testArr);

  // const hairTypes = Array.from({ length: 4 }, () =>
  //   Array.from({ length: 3 }, (_, index) => ({
  //     value: String.fromCharCode('A'.charCodeAt(0) + index),
  //   }))
  // );
  // console.log(hairTypes);

  const hairTypes = [
    { value: 'A' },
    { value: 'B' },
    { value: 'C' },
    { value: 'A' },
    { value: 'B' },
    { value: 'C' },
  ];

  let data = [
    {
      value: 'Banana',
    },
    {
      value: 'Mango',
    },
    {
      value: 'Pear',
    },
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[] | null>(null);
  const [items, setItems] = useState([
    { label: '1A', value: '1A' },
    { label: '1B', value: '1B' },
    { label: '1C', value: '1C' },
    { label: '2A', value: '2A' },
    { label: '2B', value: '2B' },
    { label: '2C', value: '2C' },
    { label: '3A', value: '3A' },
    { label: '3B', value: '3B' },
    { label: '3C', value: '3C' },
    { label: '4A', value: '4A' },
    { label: '4B', value: '4B' },
    { label: '4C', value: '4C' },
  ]);

  useEffect(() => {
    console.log(`loading: ${loading}`);
  }, [loading]);

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
        {route?.params?.imgUrl && (
          <Image
            source={{ uri: route.params.imgUrl, height: 300, width: 300 }}
          />
        )}
        {/* Hair type */}
        <DropDownPicker
          placeholder='Hair type'
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
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
                {/* <Image
                  style={styles.starImageStyle}
                  source={
                    item <= defaultRating
                      ? { uri: starImageFilled }
                      : { uri: starImageCorner }
                  }
                /> */}
                <MaterialCommunityIcons
                  name={item <= defaultRating ? 'star' : 'star-outline'}
                  size={36}
                  color='#FF9529'
                />
              </TouchableOpacity>
            );
          })}
        </View>

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
