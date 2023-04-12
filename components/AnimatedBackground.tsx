import ParticleBackground from 'react-native-particle-background';
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
import { useTheme } from 'react-native-paper';

export const AnimatedBackground = ({ scene }: { scene?: unknown }) => {
  const theme = useTheme();

  useEffect(() => {
    // const gyroscope = Gyroscope.addListener(data => {
    //   setGyroData(data);
    // });
    // return () => {
    //   gyroscope.remove();
    // };
  }, []);

  // useEffect(() => {
  //   updatePerspective();
  // }, [gyroData]);

  // TODO: Modulate particles with gyro data

  return (
    // <Animated.Text
    //   style={[
    //     styles.snowflake,
    //     {
    //       left: config.xPosition,
    //       fontSize: config.size,
    //       opacity: config.opacity,
    //       transform: [{ translateY: animatedY }, { rotate }, { translateX }],
    //     },
    //   ]}
    // >
    //   {config.type}
    // </Animated.Text>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        zIndex: -1,
      }}
    >
      <ParticleBackground
        particleColor='#rgba(0, 0, 0, 0.08)'
        // particleColor={theme.colors.onSecondary}
        // particleColor='black'
        particleSize={8}
        particleDispersion={32}
        backgroundColor='transparent'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // snowflake: {
  //   color: 'white',
  //   position: 'absolute',
  // },
});

// function getConfig(scene) {
//   const size = randomInt(10, 18);
//   const opacity = randomInt(4, 10) / 10;
//   const type = SNOWFLAKE_TYPES[randomInt(0, 2)];
//   const xPosition = `${randomInt(0, 100)}%`;

//   const fallDuration = randomInt(10000, 30000);
//   const fallDelay = randomInt(500, 10000);

//   const rotationDuration = randomInt(2000, 10000);
//   const rotationDirection = randomInt(0, 1);

//   const swingDuration = randomInt(3000, 8000);
//   const swingAmplitude = randomInt(0, 30);

//   return {
//     size,
//     opacity,
//     type,
//     xPosition,
//     fallDelay,
//     fallDuration,
//     rotationDuration,
//     rotationDirection,
//     swingDuration,
//     swingAmplitude,
//   };
// }

// function randomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
