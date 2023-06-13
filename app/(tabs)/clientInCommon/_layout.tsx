import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const CommonClientLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerTitle: 'Client in Common' }}
      />
    </Stack>
  );
};

export default CommonClientLayout;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
