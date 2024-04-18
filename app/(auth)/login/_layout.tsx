import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const LoginLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerTitle: '(unauth)/login', headerShown: false }}
      />
    </Stack>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
