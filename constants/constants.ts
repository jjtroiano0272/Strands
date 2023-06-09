import { WithSpringConfig } from 'react-native-reanimated';
import * as ExpoHaptics from 'expo-haptics';


export const springConfig: WithSpringConfig = {
  damping: 0.1,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 2,
  stiffness: 1000,
};

export const sortLabels: string[] = [
  'id',
  'createdAt',
  'isSeasonal',
  'productsUsed',
  'clientName',
  'displayName',
  'rating',
];

export const sortLabelsObj: { icon: string; varName: string; displayName: string | null; }[] = [
  {
    icon: 'calendar',
    varName: 'createdAt',
    displayName: 'Date added'
  },
  {
    icon: 'sun-snowflake',
    varName: 'isSeasonal',
    displayName: 'Seasonal'
  },
  {
    icon: 'format-list-bulleted',
    varName: 'productsUsed',
    displayName: 'Products used'
  },
  {
    icon: 'account',
    varName: 'clientName',
    displayName: 'Client Name'
  },
  {
    icon: 'star',
    varName: 'rating',
    displayName: 'Rating'
  },
  {
    icon: 'account',
    varName: 'id',
    displayName: null
  },
  {
    icon: 'account',
    varName: 'displayName',
    displayName: null
  },
];

export const SOCIAL_MEDIA_ICONS = 24;

export const Haptics = {
  Error: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error),
  Success: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  Warning: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning),
  Light: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
  Medium: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium),
  Heavy: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy),
};