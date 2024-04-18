import React, { useState, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const ProgressButton = ({ onLongPress, onLongPressRelease }: any) => {
  const [progress, setProgress] = useState<any>(new Animated.Value(0));
  const timeoutRef = useRef<any>(null);
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    clearTimeout(timeoutRef?.current);
    timeoutRef.current = null;
    setProgress(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000, // Adjust duration for filling speed
        useNativeDriver: true,
      })
    );
  };

  const handlePressOut = () => {
    if (timeoutRef && timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setProgress(
          Animated.timing(progress, {
            toValue: 0,
            duration: 2000, // Adjust duration for draining speed
            useNativeDriver: true,
          })
        );
        onLongPressRelease?.();
      }, 500); // Delay before draining starts (adjust as needed)
    }
  };

  const interpolatedProgress = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <Button onLongPress={handlePressIn} onPressOut={handlePressOut}>
        Hold to Progress
      </Button>
      <Animated.View
        style={{ width: '100%', height: 10, backgroundColor: 'grey' }}
      >
        <Animated.View
          style={{ width: interpolatedProgress, backgroundColor: 'blue' }}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressButton;
