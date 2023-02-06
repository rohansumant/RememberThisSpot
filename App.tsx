/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  PermissionsAndroid, ScrollView, TextInput, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './styles';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

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


const RenderTableEntry = (props) => {
  return <View key={props.index} style={styles.tableRow}>
    <View style={styles.smallButton}>
      <Icon.Button name="rocket"
        backgroundColor='green'
        onPress={() => props.openLinkCallback(props.index)} />
    </View>
    <View style={styles.smallButton}>
      <Icon.Button name="trash"
        backgroundColor='red'
        onPress={() => props.deleteEntryCallback(props.index)} />
    </View>
    <TextInput style={{paddingLeft: 10}}
      value={props.name}
      onChangeText={(newText) => props.onChangeText(props.index, newText)}
      />
  </View>
}

const RenderTable = (props) => {

  const locationTable = props.locationTable;
  const setLocationTable = props.setLocationTable;

  const openLinkCallback = (key) => {
    const location = locationTable[key];
    Linking.openURL(`https://maps.google.com/?q=${location.latitude},${location.longitude}`);
  };

  const deleteEntryCallback = (key) => {
    const newLocationTable = [...locationTable];
    newLocationTable.splice(key, 1);
    setLocationTable(newLocationTable);
  };

  const onChangeText = (key, text) => {
    const newLocationTable = [...locationTable];
    newLocationTable[key].name = text;
    setLocationTable(newLocationTable);
  };

  return <ScrollView style={styles.table}>
    {
    locationTable.map(({name}, i) => {
      return (<RenderTableEntry
        name={name}
        key={i}
        index={i}
        onChangeText={onChangeText}
        deleteEntryCallback={deleteEntryCallback}
        openLinkCallback={openLinkCallback} />);
    })
  }
  </ScrollView>
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
        if (result) {
          setLocationTable(JSON.parse(result));
        }
      });
      firstRender.current = false;
    }

    log('locationTable', locationTable);
    // Instead of writing on every update, write only at the time of app close.
    saveLocationTable(locationTable);
  }, [locationTable])


  const finalView = <View style={styles.topContainer}>
    <RenderTable
      locationTable={locationTable}
      setLocationTable={setLocationTable}
      />
    <View style={styles.footer}>
      <Icon.Button name="plus"
        onPress={() => addNewLocation(locationTable, setLocationTable)}>
          Save current location
      </Icon.Button>
    </View>
    <View style={styles.footer}>
      <Icon.Button name="warning"
        backgroundColor="red"
        onPress={() => setLocationTable([])}>
          Delete all entries
      </Icon.Button>
    </View>
  </View>
  console.log(finalView);
  return finalView;
}

export default App;
