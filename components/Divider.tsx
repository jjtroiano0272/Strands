import { View, Text } from 'react-native';
import React from 'react';

const Divider = ({
  width = '80%',
  height = 1,
  marginVertical = 20,
  backgroundColor = '#ccc',
}) => {
  return <View style={{ width, height, backgroundColor, marginVertical }} />;
};

export default Divider;
