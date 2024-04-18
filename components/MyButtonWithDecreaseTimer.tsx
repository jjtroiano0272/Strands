// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

import React, { useEffect, useRef, useState } from 'react';
import { Colors } from 'react-native-elements';
import theme from 'react-native-elements/dist/config/theme';

// import { Haptics } from '~/constants/constants';
import {
  Button,
  Icon,
  IconButton,
  MD3Colors,
  ProgressBar,
} from 'react-native-paper';
import Animated, {
  useDerivedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { mix } from 'react-native-redash';
import AnimatedCircle from './IconButtonWithFeedback';

const SIZE = 150;
const STROKE_WIDTH = 10;
const ICON_SIZE = 96;
const CONTENT_SIZE = SIZE - STROKE_WIDTH * 2;

export const MyButton = ({
  progress,
  onComplete,
}: {
  progress?: any;
  onComplete?: () => void;
}) => {
  const counterLimit = 10;

  const timer = useRef<any>(null);
  const [counter, setCounter] = useState(0);
  const [buttonUnlocked, setButtonUnlocked] = useState(false);
  const progressGemini: any = useSharedValue(0);
  const backgroundColor = interpolateColor(
    progressGemini,
    [0, 1],
    ['transparent', 'red']
  );

  const addOne = () => {
    // if (buttonUnlocked) {
    //   setButtonUnlocked(false);
    // }

    setCounter(prevValue => prevValue + 1);
    // 15.05.2023 EDIT: clear timer.current if already exists
    // to avoid potential floating timer on user double click
    if (timer.current) clearTimeout(timer.current!);
    // set new timer
    timer.current = setTimeout(addOne, 200);

    animate();
  };

  const stopTimer = () => {
    clearTimeout(timer.current);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progressGemini.value,
        [0, 1],
        ['#ccc', MD3Colors.primary40]
      ),
    };
  });

  const animate = () => {
    progressGemini.value = Math.min(progressGemini.value + 0.01, 1); // Adjust increment for speed
    if (progressGemini.value < 1) {
      requestAnimationFrame(animate);
    }
    // else if (progressGemini.value >= 1) {
    //   setButtonUnlocked(true);
    // }
  };

  useEffect(() => {
    console.log(`state: ${JSON.stringify(counter, null, 2)}`);

    // if (counter >= counterLimit) {
    //   setButtonUnlocked(true);
    // }
  }, [counter]);

  useEffect(() => {
    // Need to move to be tied to the button press
    // animate();
  }, []); // Empty dependency array to run only once

  return (
    <React.Fragment>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // margin: 30,
        }}
      >
        <IconButton
          onPressIn={addOne}
          onPressOut={stopTimer}
          icon='home'
          size={72}
          // iconColor={buttonUnlocked ? 'blue' : '#ccc'}
        />
        {/* <Text>{counter}</Text> */}
      </View>

      {/* <AnimatedCircle progress={counter / counterLimit} /> */}

      {/* <Animated.View
          style={[{ width: 100, height: 100, borderRadius: 50 }, animatedStyle]}
        /> */}
      <ProgressBar
        progress={counter / counterLimit}
        color={buttonUnlocked ? MD3Colors.primary50 : MD3Colors.neutral0}
      />
      {/* <CircularProgress value={counter / counterLimit} /> */}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: STROKE_WIDTH,
    left: STROKE_WIDTH,
    right: STROKE_WIDTH,
    bottom: STROKE_WIDTH,
    backgroundColor: 'white',
    borderRadius: CONTENT_SIZE / 2,
    zIndex: 100,
  },
  icon: {
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
  activeIcon: {
    position: 'absolute',
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
});
