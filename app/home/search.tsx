import { View, Text } from 'react-native';
import React from 'react';
import { DarkTheme, useTheme } from '@react-navigation/native';

const Search = () => {
  const theme = useTheme();

  return (
    <View>
      <Text style={{ color: theme.colors.text }}>Search Page</Text>
    </View>
  );
};

export default Search;
