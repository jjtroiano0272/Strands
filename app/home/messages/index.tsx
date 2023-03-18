import { View, Text } from 'react-native';
import React from 'react';
import { DarkTheme, useTheme } from '@react-navigation/native';

const Messages = () => {
  const theme = useTheme();

  return (
    <View>
      <Text style={{ color: theme.colors.text, margin: 20, padding: 10 }}>
        Messages with Rebecca
      </Text>
      <Text style={{ color: theme.colors.text, margin: 20, padding: 10 }}>
        Messages with Josh
      </Text>
      <Text style={{ color: theme.colors.text, margin: 20, padding: 10 }}>
        Messages with Monica
      </Text>
    </View>
  );
};

export default Messages;
