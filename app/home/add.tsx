import * as FileSystem from 'expo-file-system';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState, Suspense } from 'react';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { useRoute, useTheme } from '@react-navigation/native';
import { Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MediaLibraryPermissionResponse } from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { uuidv4 } from '@firebase/util';

export default function Add() {
  const theme = useTheme();
  const router = useRouter();
  const route = useRoute();
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState<any | null>(
    Camera.useCameraPermissions()
  );
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any | null>(
    ImagePicker.useMediaLibraryPermissions()
  );

  Camera.requestCameraPermissionsAsync();
  ImagePicker.requestMediaLibraryPermissionsAsync();

  // if (!hasCameraPermission) {
  //   // console.warn('no permission!');
  //   return <View></View>;
  // }

  // if (!hasCameraPermission.granted || !hasGalleryPermission) {
  //   // console.warn('no permission.granted!');
  //   return <Text>No Media acccess!</Text>;
  // }

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const handleTakePicture = async () => {
    // tkaing one
    if (camera) {
      const res = camera._onCameraReady();
      console.log(`What this is?: ${res}`);

      const data = await camera.takePictureAsync();
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // TODO future support for uploading short videos?
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveImage = async () => {
    // Timestamp: 02:18
    // const imageBase64 = await FileSystem.readAsStringAsync(imageUrl, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });
    //
    //
    // GOOD CODE
    // try {
    //   const storage = getStorage();
    //   const imagesRef = ref(storage, `images/${uuidv4()}`);
    //   // const blob = Blob(JSON.stringify(imageBase64));
    //   // console.log(`imageBase64: ${imageBase64}`);
    //   // router.push({ pathname: '/save', params: { imageBase64 } });
    //   fetch(image)
    //     .then(response => response.blob())
    //     .then(blob => {
    //       setFetchingData(true);
    //       // Use the `blob` object as needed, e.g. upload to Firestore with uploadBytes()
    //       uploadBytes(imagesRef, blob).then(snapshot => {
    //         console.log(`Uploaded blob or file`);
    //         setFetchingData(false);
    //       });
    //     })
    //     .catch(error => {
    //       setFetchingData(false);
    //       // Handle any errors that occurred during the fetch request
    //       Alert.alert('Error uploading image!');
    //       console.error(error);
    //     });
    // } catch (error) {
    //   console.error('outer error');
    // }

    const imgUrl = image ? encodeURIComponent(image) : null;

    // VERSION A
    if (imgUrl) {
      router.push({
        pathname: './save',
        params: {
          imgUrl,
        },
      });
    }

    // VERSION B
    // router.push('./save');
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus: MediaLibraryPermissionResponse =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

      if (!galleryStatus.granted) {
        Alert.alert('We need permissions in order for this to work!');
      }
    })();
  }, []);

  useEffect(() => {
    console.log(`image: ${image}`);
    console.log(`image type: ${typeof image}`);
  }, [image]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        style={styles.camera}
        type={type}
        ratio={'1:1'}
        ref={ref => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          <IconButton
            icon='camera-flip-outline'
            iconColor={theme.colors.primary}
            size={20}
            onPress={toggleCameraType}
          />
          <IconButton
            onPress={handleTakePicture}
            icon={'camera'}
            iconColor={theme.colors.primary}
            size={42}
            mode='contained'
          />
          <IconButton
            onPress={pickImage}
            icon={'view-gallery-outline'}
            iconColor={theme.colors.primary}
            size={20}
            mode='outlined'
          />
        </View>

        {image && (
          <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            <Button mode='contained' onPress={() => setImage(null)}>
              CLOSE
            </Button>

            <Button
              mode='contained'
              onPress={() => handleSaveImage(image)}
              loading={fetchingData}
            >
              SAVE
            </Button>
            <Image style={{ flex: 1 }} source={{ uri: image }} />
          </View>
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    // backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 30,
  },
  button: {},
  text: {},
});
