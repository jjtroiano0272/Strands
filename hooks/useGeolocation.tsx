import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';

export const useGeoLocation = () => {
  const [location, setLocation] = useState<{
    coords: LocationObjectCoords;
    mocked?: boolean;
    timestamp: number;
  }>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let location = await Location.getCurrentPositionAsync({});

        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        setLocation(location);
        setLat(location?.coords?.latitude);
        setLng(location?.coords?.longitude);
      } catch (err) {
        console.error(`Whoopsies on trying to get geolocation! ${err}`);
      }
    })();
  }, []);

  return [lat, lng];
};
