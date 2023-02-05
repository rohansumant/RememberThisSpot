/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  PermissionsAndroid,
  Pressable,
  Text, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './styles';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const saveLocation = async (location, count, setCount) => {
  try {
    await AsyncStorage.setItem(`location:${count}`, JSON.stringify(location));
    setCount(count+1);
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
  console.log(`Location ${count} saved successfully`);
}

const getStoredLocations = async (count) => {
  const locationList = [];
  try {
    for (let i=1;i<=count;i++) {
      const location = await AsyncStorage.getItem(`location:${count}`);
      locationList.push(JSON.parse(location));
    }
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
  console.log(`returning locationList: ${locationList}`);
  return locationList;
}

const RenderLocationList = (locationList) => {
  console.log(JSON.stringify(locationList, null, 2));
  return <>
  </>
}


function App(): JSX.Element {
  const [location, setLocation] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [count, setCount] = useState(1);
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    getStoredLocations(count).then((updatedList) => setLocationList(updatedList));
  }, [count]);

  return (
    <View>
      <Text>Latitude: {location?.coords.latitude}</Text>
      <Text>Longitude: {location?.coords.longitude}</Text>
      <Button
        title="get Location"
        onPress={() => getLocation(setLocation)}/>
      <Button
        title='save location'
        onPress={() => saveLocation(location, count, setCount)} />
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
      <View>
        <RenderLocationList locationList={locationList} />
      </View>
      <Button
        title='clearAll'
        onPress={() => setLocation(null)} />
    </View>
  );
}

export default App;
