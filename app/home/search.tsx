import { View, Text } from 'react-native';
import React from 'react';
import { DarkTheme, useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

const Search = () => {
  const theme = useTheme();

  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={{ color: theme.colors.text }}>Search Page</Text>
    </View>
  );
};

export default Search;
