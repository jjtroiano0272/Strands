import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

const DetailsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen
        options={{
          title: params.name as string,
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: 'Updated' });
        }}
      >
        Update the title
      </Text>
    </View>
  );
};

export default DetailsPage;
