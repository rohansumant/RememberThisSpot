/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Modal,
  PermissionsAndroid,
  Pressable,
  Text, TextInput, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './styles';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



// const saveLocation = async (location, count, setCount) => {
//   try {
//     await AsyncStorage.setItem(`location:${count}`, JSON.stringify(location));
//     setCount(count+1);
//   } catch (err) {
//     console.log(`Something went wrong: ${err}`);
//   }
//   console.log(`Location ${count} saved successfully`);
// }

// const getStoredLocations = async (count) => {
//   const locationList = [];
//   try {
//     for (let i=1;i<=count;i++) {
//       const location = await AsyncStorage.getItem(`location:${count}`);
//       locationList.push(JSON.parse(location));
//     }
//   } catch (err) {
//     console.log(`Something went wrong: ${err}`);
//   }
//   console.log(`returning locationList: ${locationList}`);
//   return locationList;
// }

// const RenderLocationList = (locationList) => {
//   console.log(JSON.stringify(locationList, null, 2));
//   return <>
//   </>
// }


//------------ NEW ATTEMPT

const log = (label : string, arg, JSONify = true) => {
  if (JSONify) {
    console.log(`${label}: ${JSON.stringify(arg, null, 2)}`);
  } else {
    console.log(`${label}: ${arg}`);
  }
}

type Location = {
  name: string;
  latitude: number;
  longitude: number;
  timestamp: number;
};

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

const getLocation = async () => {
  console.log(`getLocation invoked`);
  const permissionGranted = await requestLocationPermission();
  if (!permissionGranted) {
    return;
  }
  const position = await new Promise((resolved) => {
    Geolocation.getCurrentPosition(position =>
      resolved({
        name: 'Enter location name',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp
      } as Location)
    );
  });
  return position;
}


const renderTableEntry = (name, callback, key, locationTable, setLocationTable) => {
  return <View key={key}>
    <Button title="Go"
        onPress={() => callback()} />
      <TextInput
        value={name}
        onChangeText={(newLocationName) => {
          const newLocationTable = [...locationTable];
          locationTable[key].name = newLocationName;
          setLocationTable(newLocationTable);
        }} />
  </View>
}

const renderTable = (locationTable : Location[], setLocationTable) => {
  return <View>
    {
    locationTable.map(({name, latitude, longitude, timestamp},i) => {
      const callback = () => Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
      return renderTableEntry(name, callback, i, locationTable, setLocationTable);
    })
    }
  </View>
}

const addNewLocation = async (locationTable, setLocationTable) => {
  const currLocation = await getLocation();
  log('currLocation',currLocation);
  const newLocationTable = [...locationTable, currLocation];
  log('newLocTable',newLocationTable);
  setLocationTable(newLocationTable);
}

const saveLocationTable = (locationTable) => {
  AsyncStorage.setItem(`locationTable`, JSON.stringify(locationTable));
}

function App(): JSX.Element {
  const [locationTable, setLocationTable] = useState([]);
  const firstRender = useRef(true);

  useEffect(() => {
    // not the best way to ensure fetch from disk happens just once but OK for now
    if (firstRender.current === true) {
      AsyncStorage.getItem(`locationTable`).then((result) => {
        setLocationTable(JSON.parse(result));
      });
      firstRender.current = false;
    }

    log('locationTable',locationTable);
    // Instead of writing on every update, write only at the time of app close.
    saveLocationTable(locationTable);
  }, [locationTable])


  const finalView = <View>
    {renderTable(locationTable, setLocationTable)}
    <Button
      title="Add new"
      onPress={() => addNewLocation(locationTable, setLocationTable)} />
    <Button
      title='Clear saved locations'
      onPress={() => {AsyncStorage.setItem(`locationTable`, JSON.stringify([]));}} />
  </View>
  console.log(finalView);
  return finalView;
}

export default App;
