import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const ListPage = () => {
  return (
    <View>
      <Text>you'll see this if you just navigate to /ListPage</Text>
      <Link href='/list/1'>USER 1</Link>
      <Link href='/list/2'>USER 2</Link>
      <Link href='/list/3'>USER 3</Link>
    </View>
  );
};

export default ListPage;

const styles = StyleSheet.create({});
