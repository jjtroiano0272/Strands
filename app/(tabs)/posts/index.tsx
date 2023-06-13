import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, useSearchParams } from 'expo-router';

const PostPage = () => {
  // const { post } = useSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>looking at post index</Text>
    </View>
  );
};

export default PostPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
