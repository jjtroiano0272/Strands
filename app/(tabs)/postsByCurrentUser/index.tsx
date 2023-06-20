import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { Button } from 'react-native-paper';
import { faker } from '@faker-js/faker';

const ListPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen options={{ headerTitle: 'Posts by current user' }} />

      <Text style={{ color: 'blue' }}>ListPage</Text>

      {Array.from({ length: 5 }, () => faker.name.firstName()).map(
        userProfile => (
          <Link
            key={userProfile}
            href={`users/${userProfile}`}
            style={{ margin: 15, fontSize: 42, color: 'blue' }}
          >
            News {userProfile}
          </Link>
        )
      )}
    </View>
  );
};

export default ListPage;

const styles = StyleSheet.create({});
