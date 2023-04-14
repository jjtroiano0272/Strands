import * as Haptics from 'expo-haptics';
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
import {
  Button,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  TouchableRipple,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MediaLibraryPermissionResponse } from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { uuidv4 } from '@firebase/util';
import ButtonWithRipple from '../../../components/RippleButton';
import RippleButton from '../../../components/RippleButton';
import Swiper from 'react-native-swiper';

export default function Add() {
  const theme = useTheme();
  const router = useRouter();
  const route = useRoute();
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  // const [imagePaths, setImagePaths] = useState<string[] | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState<any | null>(
    Camera.useCameraPermissions()
  );
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any | null>(
    ImagePicker.useMediaLibraryPermissions()
  );

  Camera.requestCameraPermissionsAsync().catch(err =>
    console.error(`Camera permissions error ${err}`)
  );
  ImagePicker.requestMediaLibraryPermissionsAsync().catch(err =>
    console.error(`Image Picker permissions error ${err}`)
  );

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

  // TODO You probably don't need to write this async since takePictureAsync already is a Promise
  const handleTakePicture = async () => {
    if (camera) {
      const res = camera._onCameraReady();

      await camera
        .takePictureAsync()
        .then(res => setSelectedImages([res.uri]))
        .catch(err => console.error(`Error when taking picture! ${err}`));
    } else {
      console.error(`Camera unavaible! Or something.`);
    }
  };

  // TODO change to .then.catch methodology
  const handlePickImage = () => {
    // TODO future support for uploading short videos?
    const result = ImagePicker.launchImageLibraryAsync({
      // allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then(res => {
        // TODO res.canceled causes the error, so just comment this line out to get rid of it
        console.log(`res: ${JSON.stringify(res.assets, null, 2)}`);

        // this is the local device's path to the image, where assets is the string[] containing all selected images
        // setImage(res?.assets![0].uri);
        // setImagePaths(res?.assets!.map(image => image.uri));
        setSelectedImages(res?.assets!.map(image => image.uri));
      })
      .catch(err => {
        console.error(`Something happened picking image: ${err}`);
      });
  };

  // PREVIOUSLY WAS ASYNC WITH DIFFERENT METHODS
  // const handleSaveImage = async () => {
  const handleSaveImage = () => {
    const imgUris = selectedImages?.map(path => encodeURIComponent(path));

    console.log(
      `imagePaths (${selectedImages?.length}): ${JSON.stringify(
        selectedImages,
        null,
        2
      )}`
    );
    console.log(
      `encoded URIs (${imgUris?.length}): ${JSON.stringify(imgUris, null, 2)}`
    );

    // VERSION A
    if (imgUris) {
      router.push({
        // pathname: './save',
        // TODO For some reason this acts as replace() and not push()....
        pathname: '/home/add/save',
        params: {
          imgUris,
        },
      });
    }
  };

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
          <View
            style={{
              // TODO Calculate contrast numerically
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              flexDirection: 'row',
              width: 300,
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: 30,
            }}
          >
            <IconButton
              // mode='contained'
              icon='camera-flip-outline'
              iconColor='#ccc'
              onPress={toggleCameraType}
              size={20}
            />
            <IconButton
              mode='contained'
              icon={'camera'}
              iconColor={theme.colors.primary}
              onPress={handleTakePicture}
              size={42}
            />
            <IconButton
              // mode='contained'
              icon={'view-gallery-outline'}
              iconColor='#ccc'
              onPress={handlePickImage}
              size={20}
            />
          </View>
        </View>

        {selectedImages && (
          <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            {/* <IconButton
              icon='cancel'
              mode='contained'
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              // iconColor={MD3Colors.error50}
              size={20}
              onPress={() => setImage(null)}
            /> */}

            <RippleButton
              mode='contained'
              onPress={() => handleSaveImage()}
              loading={fetchingData}
            >
              SAVE
            </RippleButton>

            {/* TODO Will probably need a redesign of this for better UX */}
            <Swiper
              // containerStyle={{ flex: 1 }}
              containerStyle={{ height: 300, width: '100%', borderRadius: 30 }}
              onIndexChanged={() => Haptics.ImpactFeedbackStyle.Light}
              showsPagination={selectedImages.length < 2 && false}
            >
              {selectedImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri: uri }}
                  style={{ width: '100%', height: '100%' }}
                />
              ))}
            </Swiper>
          </View>
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  buttonContainer: {
    // backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    // padding: 30,
  },
  button: {},
  text: {},
});
