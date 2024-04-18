import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import Button from './YT_Button';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import 'react-native-redash';

const TapGesture = () => {
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent();

  return (
    <View style={styles.container}>
      <TapGestureHandler {...gestureHandler}>
        <Animated.View>
          <Button />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default TapGesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  textHeader: { fontSize: 42 },
});
