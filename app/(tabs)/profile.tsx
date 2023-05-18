import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const ProfilePage = () => {
  return (
    <View>
      <Text>ProfilePage</Text>
      <Link href='/'>Go Home</Link>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({});
