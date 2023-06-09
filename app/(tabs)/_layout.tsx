import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getAuth } from 'firebase/auth';

export default () => {
  const iconSize = 24;
  const router = useRouter();
  const currentUserID = getAuth().currentUser?.uid;

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
        name='add'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name='plus'
              size={iconSize * 1.4}
              color={focused ? (color = 'red') : color}
            />
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name='messages'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='envelope' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Messages',
        }}
      />
      <Tabs.Screen
        name='myProfile'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user-circle' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Profile',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='clients'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='save'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='star' size={iconSize} color='red' />
          ),
          tabBarLabel: 'Profile',
          href: null,
        }}
      />
      <Tabs.Screen
        name='posts'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='star' size={iconSize} color='red' />
          ),
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='users'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='star' size={iconSize} color='red' />
          ),
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='clientInCommon'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='star' size={iconSize} color='red' />
          ),
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='postsByCurrentUser'
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='star' size={iconSize} color='red' />
          ),
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({});
