import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>HomePage</Text>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42, color: 'blue' },
});
