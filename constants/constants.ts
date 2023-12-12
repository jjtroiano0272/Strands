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

export const SOCIAL_MEDIA_ICON_SIZE = 24;

export const Haptics = {
  Error: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error),
  Success: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  Warning: () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning),
  Light: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
  Medium: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium),
  Heavy: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy),
};

export const getElapsedTime = (
  time1: number,
  time2: number = Date.now(),
  format?: string
) => {
  const createdAtTimestamp = time1 * 1000;

  const elapsedTimeInSeconds = Math.abs(
    Math.round((createdAtTimestamp - time2) / 1000)
  );
  const elapsedTimeInMinutes = Math.abs(
    Math.round(elapsedTimeInSeconds / 60)
  );
  const elapsedTimeInHours = Math.abs(Math.round(elapsedTimeInMinutes / 60));
  const elapsedTimeInDays = Math.abs(Math.round(elapsedTimeInHours / 24));
  const elapsedTimeInWeeks = Math.abs(
    Math.round(elapsedTimeInSeconds / 604800)
  ); // 604800 seconds in a week
  const elapsedTimeInMonths = Math.abs(Math.round(elapsedTimeInWeeks / 4));

  // If it has been longer than 60 seconds, use elapseTimeinMinutes
  // let result: { number: number; unit: string };
  let result;
  if (elapsedTimeInSeconds >= 60) {
    result = { number: elapsedTimeInMinutes, unit: 'minutes' };
  }
  if (elapsedTimeInMinutes >= 60) {
    result = { number: elapsedTimeInHours, unit: 'hours' };
  }
  if (elapsedTimeInHours >= 24) {
    result = { number: elapsedTimeInDays, unit: 'days' };
  }
  if (elapsedTimeInDays >= 7) {
    result = { number: elapsedTimeInWeeks, unit: 'weeks' };
  }
  if (elapsedTimeInWeeks >= 4) {
    result = { number: elapsedTimeInMonths, unit: 'months' };
  }

  return result;
};