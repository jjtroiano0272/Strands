import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const ClientsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerTitle: 'ClientsLayout' }} />
    </Stack>
  );
};

export default ClientsLayout;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
