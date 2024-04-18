import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const ForgotPasswordLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' />
    </Stack>
  );
};

export default ForgotPasswordLayout;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
