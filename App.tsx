/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  PermissionsAndroid,
  Text, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const addItem = () => {
  console.log('Add item clicked');
}

const requestLocationPermission = async () => {
  console.log(`requestLocationPermission called`);
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Geolocation permission',
      message: 'Can we access your location',
      buttonPositive: 'Yes',
      buttonNegative: 'No'
    });
    console.log(`location permission result: ${result}`);
    return result === 'granted';
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
}


const getLocation = async (setLocation) => {
  console.log(`getLocation invoked`);
  const permissionGranted = await requestLocationPermission();
  if (!permissionGranted) {
    return;
  }
  Geolocation.getCurrentPosition(position => {
    setLocation(position)
  });
}

function App(): JSX.Element {
  const [location, setLocation] = useState(null);
  return (
    <View>
      <Text>Latitude: {location?.coords.latitude}</Text>
      <Text>Longitude: {location?.coords.longitude}</Text>
      <Button
        title="getLocation"
        onPress={() => getLocation(setLocation)}/>
    </View>
  );
}

export default App;
