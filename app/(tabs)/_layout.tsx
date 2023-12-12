import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getAuth } from 'firebase/auth';
import { useHaptics } from '~/hooks/useHaptics';
import { active } from 'd3';
import { UserContext } from '~/context/UserContext';
import { useSession } from '~/context/expoDocsCtx';

export default () => {
  const iconSize = 24;
  const router = useRouter();
  const currentUserID = getAuth().currentUser?.uid;
  const sessionCtx = useSession();

  const userCtx = useContext(UserContext);

  /* 05DEC: Left off working on Logout button functionality--clicking logout
  should set usercontext to logged out, and auth object of firebase should be
  affected. Can these be merged into one thing? We have two thing essentially
  handling the same purpose */
  // if (!userCtx?.isLoggedIn) {
  //   return <Redirect href='/' />;
  // }

  if (!sessionCtx?.session) {
    return <Redirect href='/sign-in' />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'purple',
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name='home'
              size={iconSize}
              color={color}
              // onPress={() =>
              //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              // }
            />
          ),

          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name='search' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name='plus'
              size={iconSize}
              color={focused ? 'red' : color}
            />
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name='myProfile'
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user-circle-o' size={iconSize} color={color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />

      {/* TURNING OFF THE DISPLAY OF OTHER BOTTOM TABS */}
      <Tabs.Screen name='clientInCommon' options={{ href: null }} />
      <Tabs.Screen name='clients' options={{ href: null }} />
      {/* <Tabs.Screen name='myProfile' options={{ href: null }} /> */}
      <Tabs.Screen name='posts' options={{ href: null }} />
      <Tabs.Screen name='postsByCurrentUser' options={{ href: null }} />
      <Tabs.Screen name='users' options={{ href: null }} />
      {/* <Tabs.Screen name='add' options={{ href: null }} /> */}
      <Tabs.Screen name='details' options={{ href: null }} />
      <Tabs.Screen name='messages' options={{ href: null }} />
      {/* <Tabs.Screen name='save' options={{ href: null }} /> */}
      {/* <Tabs.Screen name='search' options={{ href: null }} /> */}
    </Tabs>
  );
};

const styles = StyleSheet.create({});
