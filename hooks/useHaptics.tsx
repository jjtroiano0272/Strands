import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'expo-router';

type FeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

export const useHaptics = (feedbackType: FeedbackType = 'selection') => {
  try {
    const createHapticHandler = useCallback(
      (type: Haptics.ImpactFeedbackStyle) => {
        return Platform.OS === 'web'
          ? undefined
          : () => Haptics.impactAsync(type);
      },
      []
    );

    const createNotificationFeedback = useCallback(
      (type: Haptics.NotificationFeedbackType) => {
        return Platform.OS === 'web'
          ? undefined
          : () => Haptics.notificationAsync(type);
      },
      []
    );

    const hapticHandlers = useMemo(
      () => ({
        light: createHapticHandler(Haptics.ImpactFeedbackStyle.Light),
        medium: createHapticHandler(Haptics.ImpactFeedbackStyle.Medium),
        heavy: createHapticHandler(Haptics.ImpactFeedbackStyle.Heavy),
        selection: Platform.OS === 'web' ? undefined : Haptics.selectionAsync,
        success: createNotificationFeedback(
          Haptics.NotificationFeedbackType.Success
        ),
        warning: createNotificationFeedback(
          Haptics.NotificationFeedbackType.Warning
        ),
        error: createNotificationFeedback(
          Haptics.NotificationFeedbackType.Error
        ),
      }),
      [createHapticHandler, createNotificationFeedback]
    );

    return hapticHandlers[feedbackType];
  } catch (error) {
    console.error(`Haptic error`);
  }
};
