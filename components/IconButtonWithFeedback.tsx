import * as Haptics from 'expo-haptics';
import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  interpolateColor,
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Icon } from 'react-native-paper';
import { Icon as VectorIcon } from '@expo/vector-icons/build/createIconSet';
import { color } from 'd3';

const AnimatedCircle = ({
  progressProp,
}: {
  progressProp?: number;
  icon?: string;
  size?: number;
}) => {
  const CIRCLE_LENGTH = 600;
  const R = CIRCLE_LENGTH / (2 * Math.PI);
  const INCREMENT = 1;
  const DIMENSIONS = 200;
  const POS_X = 200;
  const POS_Y = 200;

  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    r: 1 - R + R * progress.value * 0.2,
    fillOpacity: progress.value,
  }));

  const pencilColor = useAnimatedProps(() => {
    return {
      color: interpolateColor(progress.value, [0, 1], ['black', 'white']),
    };
  });

  const animationGrow = useAnimatedProps(() => ({
    // strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    r: R + progress.value * 0.2,
  }));
  const progressGemini: any = useSharedValue(0);
  const [buttonUnlocked, setButtonUnlocked] = useState(false);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedIcon = Animated.createAnimatedComponent(React.forwardRef(Icon));

  const onComplete = () => {
    if (!buttonUnlocked) {
      setButtonUnlocked(prev => true);
    } else if (buttonUnlocked) {
      resetAll();
      // progressGemini.value = 0;
      // progress.value = 0;
      // setButtonUnlocked(prev => false);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const onPressIn = useCallback(() => {
    if (buttonUnlocked) {
      runOnJS(resetAll)();
      // console.log(`should reset button`);
    }

    progress.value = withTiming(
      1,
      {
        duration: 2000,
      },
      () => {
        if (progress.value === 1) {
          runOnJS(onComplete)();
        }
      }
    );
  }, [buttonUnlocked]);

  const onPressOut = () => {
    progress.value = withTiming(progress.value < 1 ? 0 : 1, {
      duration: 1000,
    });
  };

  const resetAll = () => {
    progressGemini.value = 0;
    progress.value = 0;
    setButtonUnlocked(prev => false);
  };

  useEffect(() => {
    console.log(`buttonUnlocked: ${JSON.stringify(buttonUnlocked, null, 2)}`);
    console.log(`progress.value: ${JSON.stringify(progress.value, null, 2)}`);

    if (progress.value >= 1) setButtonUnlocked(prev => true);
  }, [buttonUnlocked, progress.value]);

  return (
    <View style={{ height: 400 }}>
      <TouchableOpacity
        style={styles.container}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={{
            position: 'absolute',
            transform: [{ translateX: 15 }],
            zIndex: 100,
          }}
        >
          <AnimatedIcon
            size={80}
            source='pencil'
            animatedProps={pencilColor}
            color={buttonUnlocked ? 'white' : 'black'}
          />
        </View>

        <Svg>
          {/* <Circle {...props} /> */}
          <AnimatedCircle
            cx={POS_X}
            cy={POS_Y}
            r={R}
            fillOpacity={buttonUnlocked ? 1 : 0}
            fill='purple'
            stroke='#ccc'
            strokeWidth={30}
            // animatedProps={animationGrow}
          />

          <AnimatedCircle
            cx={POS_X}
            cy={POS_Y}
            r={R}
            fillOpacity={0}
            fill='purple'
            stroke='purple'
            strokeWidth={10}
            strokeDasharray={CIRCLE_LENGTH}
            // strokeDashoffset={CIRCLE_LENGTH * progress}
            animatedProps={animatedProps}
          />
        </Svg>
      </TouchableOpacity>

      <Button onPress={resetAll} icon={buttonUnlocked ? 'lock' : undefined}>
        RESET
      </Button>
    </View>
  );
};

export default AnimatedCircle;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: { fontSize: 42 },
});
