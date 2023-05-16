import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Tab } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default () => {
  return (
    <Tabs>
      <Tabs.Screen name='home' />
      <Tabs.Screen name='profile' />
      <Tabs.Screen name='list' options={{ tabBarLabel: 'News' }} />
    </Tabs>
  );
};
