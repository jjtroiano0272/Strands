import { Camera, CameraType } from 'expo-camera';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { Button, IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

export default function Add() {
  const theme = useTheme();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  Camera.requestCameraPermissionsAsync();

  if (!permission) {
    console.warn('no permission!');
    return <View></View>;
  }

  if (!permission.granted) {
    console.warn('no permission.granted!');
  }

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}

          {/* <Button mode='contained' onPress={toggleCameraType}>
            Flip Camera
          </Button> */}

          <IconButton
            icon='camera'
            // color={theme.colors.primary}
            size={24}
            onPress={toggleCameraType}
          />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  buttonContainer: {
    // flex: 1,
    // backgroundColor: 'transparent',
    // flexDirection: 'row',
    justifyContent: 'flex-end', 
  },
  button: {},
  text: {},
});
