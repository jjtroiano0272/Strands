import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

const NewsDetailsPage = () => {
  const { userProfile } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: `NewsItem ${userProfile}` }} />
      <Text style={styles.textHeader}>News userProfile {userProfile}</Text>
    </View>
  );
};

export default NewsDetailsPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
