import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default () => {
  const iconSize = 24;

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
            <FontAwesome name='home' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='search' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name='add/index'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name='plus'
              size={iconSize}
              color={focused ? (color = 'red') : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='messages/index'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='envelope' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Messages',
        }}
      />
      <Tabs.Screen
        name='add/save'
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({});
