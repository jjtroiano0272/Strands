import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack, useSearchParams } from 'expo-router';

const ClientProfilePage = () => {
  // const { post } = useSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'ClientsLayout' }} />
      <Text style={styles.textHeader}>looking at client's page</Text>
    </View>
  );
};

export default ClientProfilePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
