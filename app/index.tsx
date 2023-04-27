import React, { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { IAPIData } from '../@types/types';
import Colors from '../constants/Colors';
import useFetch from '../hooks/useFetch';
import { ExternalLink } from '../components/ExternalLink';
import { MonoText } from '../components/StyledText';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { Link, Redirect, Stack } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';
import GridItem from '../components/Post';
import { UserContext } from '../context/UserContext';

export default function Page() {
  const theme = useTheme();
  const userCtx = useContext(UserContext);
  const [isAuth, setIsAuth] = useState(false);

  if (userCtx?.isLoggedIn) {
    return <Redirect href='login' />;
  }

  return (
    // Don't do a Redirect, but rather the actual component or whatever structure consumes the Tabs Screens
    // <Redirect href='feed' />
    // null

    <Redirect href='home' />
  );
}
