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
  ScrollView,
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
import ButtonWithRipple from '~/components/RippleButton';
import RippleButton from '~/components/RippleButton';
import Swiper from 'react-native-swiper';
import { useHaptics } from '~/hooks/useHaptics';

export default function Add() {
  const theme = useTheme();
  const router = useRouter();
  const route = useRoute();
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
    try {
      if (camera) {
        const res = camera._onCameraReady();

        await camera
          .takePictureAsync()
          .then(res => setSelectedImages([...selectedImages, res.uri]))
          .catch(err => console.error(`Error when taking picture! ${err}`));
      } else {
        console.error(`Camera unavailable! Or something.`);
      }
    } catch (error) {
      console.error(error);
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
        pathname: ' /savePost',
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

  const removeImage = (uri: string) => {
    // setSelectedImages()
    const smallerArr = selectedImages.filter(imgPath => imgPath !== uri);
    console.log(`remove image function for image ${smallerArr}`);
    setSelectedImages(smallerArr);
  };

  const [selectedImagesConcatenated, setSelectedImagesConcatenated] =
    useState('');

  useEffect(() => {
    console.log(`selectedImages: ${JSON.stringify(selectedImages, null, 2)}`);
    setSelectedImagesConcatenated(selectedImages.join(','));
  }, [selectedImages]);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        style={[styles.camera, { position: 'relative' }]}
        type={type}
        ratio={'1:1'}
        ref={ref => setCamera(ref)}
      >
        {selectedImages && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              // padding: 16,
              flexDirection: 'row',
              padding: 16,
              position: 'absolute',
              bottom: 0, // Position at the bottom of the screen
              left: 0,
              right: 0,
            }}
          >
            {selectedImages.map((uri, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  width: 100, // Set the width of each card
                  height: 100,
                  marginRight: 16, // Adjust as needed for spacing
                  backgroundColor: 'white', // Adjust card styling as needed
                  borderRadius: 8, // Add borderRadius for card appearance
                  // shadowColor: '#000',
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2,
                  // },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 3.84,
                  // elevation: 5,
                  
                }}
              >
                <Image
                  key={index}
                  source={{ uri: uri }}
                  style={{ width: '100%', height: '100%' }}
                />
                <IconButton
                  key={uri}
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    // backgroundColor: 'transparent',
                    // padding: 10,
                  }}
                  icon='close'
                  mode='contained'
                  // underlayColor='red'
                  // containerColor='red'
                  // iconColor='#ccc'
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    removeImage(uri);
                  }}
                  size={15}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
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

            {selectedImages.length > 0 && (
              <IconButton
                // mode='contained'
                icon={'page-next'}
                iconColor='#ccc'
                onPress={() =>
                  router.push({
                    // pathname: '/home/[post]',
                    pathname: '/add/savePost',
                    // Looks like
                    // 'file:///var/mobile/Containers/Data/Application/7FF5DA39-5FA0-4426-882D-C1183F859A01/Library/Caches/ExponentExperienceData/%2540jonathan.troiano%252FStrands/Camera/F130A70D-81C2-4FB7-9A9E-405ADABEE555.jpg';
                    params: {
                      imgUris: encodeURIComponent(selectedImagesConcatenated),
                    },
                    // params: { id: 86, other: 'anything you want here' },
                  })
                }
                size={42}
              />
            )}
          </View>
        </View>
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
