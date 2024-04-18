import React, { useEffect } from 'react';
import { Alert, Text, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  // Value,
  // cond,
  // eq,
  useSharedValue,
} from 'react-native-reanimated';
import { mix, onGestureEvent, withTransition } from 'react-native-redash';
import Button from './Button';
import { Button as PaperButton } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EDFF',
  },
});

export default () => {
  // const state = new Value(State.UNDETERMINED); // prob shared value
  // const state = useSharedValue(State.UNDETERMINED); // 0
  // vv this causes the problem
  // const gestureHandler = onGestureEvent({ state, State.UNDETERMINED }); // TODO I think I'm gonna have to rebuild this myself

  const translationX = useSharedValue(0);
  const state = useSharedValue(State);
  // const gestureHandler = onGestureEvent({ translationX, state });

  // const isActive = true; // debug value
  // // const isActive = eq(state, State.BEGAN);
  const isActive = state.value.ACTIVE ? true : false;
  // // const duration = cond(isActive, 2000, 250);
  const duration = isActive ? 2000 : 250;
  const progress = withTransition(isActive, { duration });
  const scale = mix(progress, 1, 1.2);

  // useEffect(() => {
  //   // Not possible because these values are only accessible in UI runtime
  //   console.log(`state: ${JSON.stringify(state, null, 2)}`);
  // }, [state]);

  return (
    <GestureDetector
      gesture={Gesture.Tap().onStart(() => console.log('the fuck?'))}
    >
      <View style={styles.container}>
        {/* <TapGestureHandler {...gestureHandler}> */}
        <Animated.View style={{ transform: [{ scale }] }}>
          {/* <Button {...{ progress }} /> */}
          <PaperButton children='TEST' onPress={() => Alert.alert('Hello!')} />
        </Animated.View>
        {/* </TapGestureHandler> */}
        <Text>STATE: {isActive}</Text>
      </View>
    </GestureDetector>
  );
};
