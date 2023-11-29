import React from 'react';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
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
        name='home'
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name='home' size={iconSize} color={color} />
          ),

          tabBarLabel: 'Home',
        }}
      />
      <Redirect href='/sign-in' />;
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
      {/* TURNING OFF THE DISPLAY OF OTHER BOTTOM TABS */}
      <Tabs.Screen name='clientInCommon' options={{ href: null }} />
      <Tabs.Screen name='clients' options={{ href: null }} />
      <Tabs.Screen name='myProfile' options={{ href: null }} />
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
