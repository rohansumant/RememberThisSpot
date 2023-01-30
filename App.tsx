/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  Modal,
  PermissionsAndroid,
  Text, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './styles';
import { Linking } from 'react-native';

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
  const [modalVisibility, setModalVisibility] = useState(false);

  return (
    <View>
      <Text>Latitude: {location?.coords.latitude}</Text>
      <Text>Longitude: {location?.coords.longitude}</Text>
      <Button
        title="get Location"
        onPress={() => getLocation(setLocation)}/>
      <Button
        title="Home"
        onPress={() => Linking.openURL(`https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`)} />
      <Modal
        transparent={false}
        visible={modalVisibility}
        style={styles.modalView}
        onRequestClose={() => setModalVisibility(!modalVisibility)}>
        <View><Text style={styles.textStyle}>Modal 1</Text></View>
      </Modal>
      <Button 
        title='toggleModal'
        onPress={() => setModalVisibility(!modalVisibility)} />
    </View>
  );
}

export default App;
