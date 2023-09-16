import { View, Text } from 'react-native';
import React from 'react';
import { Button, IconButton, TouchableRipple } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import * as Haptics from 'expo-haptics';

export default function RippleButton(props: any) {
  const { children, style, ...rest } = props; // Extracting children from props

  return (
    <Ripple
      rippleContainerBorderRadius={style ? style.borderRadius : 50}
      {...rest}
    >
      {props.icon ? (
        <IconButton
          icon={props.icon}
          onPress={
            props.hapticsOnPress &&
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(err =>
              console.error(`Haptics error in RippleButton: ${err}`)
            )
          }
          {...rest}
        />
      ) : (
        <Button style={style} {...rest}>
          {children}
        </Button>
      )}
    </Ripple>
  );
}
