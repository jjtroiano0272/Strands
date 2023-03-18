import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'purple',
      }}
    >
      <Tabs.Screen
        name='feed'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={24} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='search' size={24} color={color} />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name='messages/index'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='envelope' size={24} color={color} />
          ),
          tabBarLabel: 'Messages',
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({});
