import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const Users = () => {
  return (
    <View>
      <Text>you'll see this if you just navigate to /users</Text>
      <Link href='/users/1'>USER 1</Link>
      <Link href='/users/2'>USER 2</Link>
      <Link href='/users/3'>USER 3</Link>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({});
