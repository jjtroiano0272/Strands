import { View, Text } from 'react-native';
import React from 'react';
import { Button, TouchableRipple } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';

export default function RippleButton(props: any) {
  const { children, style, ...rest } = props; // Extracting children from props

  return (
    <Ripple rippleContainerBorderRadius={style.borderRadius} {...rest}>
      <Button style={style} {...rest}>
        {children}
      </Button>
    </Ripple>
  );
}
