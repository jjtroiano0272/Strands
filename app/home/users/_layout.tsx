import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSearchParams } from 'expo-router';

export default () => {
  const { id } = useSearchParams();

  return (
    <View>
      <Text>_layout file within /users: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
