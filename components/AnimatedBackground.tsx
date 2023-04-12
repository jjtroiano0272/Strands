import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import Svg, { Circle } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import { interpolate } from 'flubber';
import * as d3 from 'd3';
import Reanimated from 'react-native-reanimated';
// npm i react-native-gyroscope react-native-svg react-native-responsive-screen flubber d3 react-native-reanimated

export const AnimatedBackground = ({ scene }: { scene: unknown }) => {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const perspective = new Animated.Value(1000);

  const START_Y_POSITION = -50;
  const SNOWFLAKE_TYPES = ['❄', '❅', '❆'];

  const updatePerspective = () => {
    const { x, y } = gyroData;
    const newX = d3.scaleLinear().domain([-90, 90]).range([-1, 1])(x);
    const newY = d3.scaleLinear().domain([-90, 90]).range([1, -1])(y);
    const newPerspective = 1000 + newY * 200;
    Animated.timing(perspective, {
      toValue: newPerspective,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const bubbles = [
    { x: wp('25%'), y: hp('25%'), r: 60 },
    { x: wp('70%'), y: hp('70%'), r: 80 },
    { x: wp('50%'), y: hp('50%'), r: 100 },
    // add more bubbles here...
  ];

  const bubbleComponents = bubbles.map((bubble, i) => (
    <Circle
      key={i}
      cx={bubble.x}
      cy={bubble.y}
      r={bubble.r}
      fill='#ccc'
      fillOpacity={0.3}
      stroke='#000000'
      strokeWidth={3}
    />
  ));

  useEffect(() => {
    const gyroscope = Gyroscope.addListener(data => {
      setGyroData(data);
    });
    return () => {
      gyroscope.remove();
    };
  }, []);

  useEffect(() => {
    updatePerspective();
  }, [gyroData]);

  const [config, setConfig] = useState(() => getConfig());
  const animatedY = useRef(new Animated.Value(START_Y_POSITION)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const animatedSwing = useRef(new Animated.Value(0)).current;

  const runAnimation = () => {
    animatedY.setValue(START_Y_POSITION);
    animatedRotation.setValue(0);

    Animated.loop(
      Animated.timing(animatedRotation, {
        toValue: 1,
        duration: config.rotationDuration,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedSwing, {
          toValue: -1,
          duration: config.swingDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedSwing, {
          toValue: 1,
          duration: config.swingDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.sequence([
      Animated.delay(config.fallDelay),
      Animated.timing(animatedY, {
        toValue: scene.height,
        duration: config.fallDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newConfig = getConfig();
      setConfig(newConfig);
    });
  };

  useEffect(() => {
    if (config) {
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const rotate = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: config.rotationDirection
      ? ['0deg', '360deg']
      : ['360deg', '0deg'],
  });

  const translateX = animatedSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: [-config.swingAmplitude, config.swingAmplitude],
  });

  return (
    <Animated.Text
      style={[
        styles.snowflake,
        {
          left: config.xPosition,
          fontSize: config.size,
          opacity: config.opacity,
          transform: [{ translateY: animatedY }, { rotate }, { translateX }],
        },
      ]}
    >
      {config.type}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  snowflake: {
    color: 'white',
    position: 'absolute',
  },
});

function getConfig(scene) {
  const size = randomInt(10, 18);
  const opacity = randomInt(4, 10) / 10;
  const type = SNOWFLAKE_TYPES[randomInt(0, 2)];
  const xPosition = `${randomInt(0, 100)}%`;

  const fallDuration = randomInt(10000, 30000);
  const fallDelay = randomInt(500, 10000);

  const rotationDuration = randomInt(2000, 10000);
  const rotationDirection = randomInt(0, 1);

  const swingDuration = randomInt(3000, 8000);
  const swingAmplitude = randomInt(0, 30);

  return {
    size,
    opacity,
    type,
    xPosition,
    fallDelay,
    fallDuration,
    rotationDuration,
    rotationDirection,
    swingDuration,
    swingAmplitude,
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
