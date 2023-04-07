import * as Haptics from 'expo-haptics';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StarRating(props: any) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [ratingChoices, setRatingChoices] = useState([1, 2, 3, 4, 5]);

  const handleStarRating = (item: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRating(item);
  };

  // TODO <UI Level> allow drag and swipe to select rating

  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 30,
      }}
    >
      {ratingChoices.map((item, key) => {
        return (
          <TouchableOpacity
            style={{ marginHorizontal: 7 }}
            activeOpacity={0.7}
            key={item}
            onPress={() => handleStarRating(item)}
          >
            <MaterialCommunityIcons
              name={item <= selectedRating! ? 'star' : 'star-outline'}
              size={36}
              color='#FF9529'
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
