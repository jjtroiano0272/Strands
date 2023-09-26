import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerTitle: 'Searching', headerShown: false }}
      />
    </Stack>
  );
};

export default SearchLayout;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
