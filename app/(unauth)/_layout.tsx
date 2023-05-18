import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const UnauthorizedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='login' options={{ headerTitle: 'login' }} />
    </Stack>
  );
};

export default UnauthorizedLayout;

const styles = StyleSheet.create({});
