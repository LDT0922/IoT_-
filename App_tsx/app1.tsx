import React, {useEffect} from 'react';
import {SafeAreaView, PermissionsAndroid, } from 'react-native';

import { BluetoothScanner } from './Components/BlutoothScanner/BluetoothScanner3_1';

const requestBLEPermissions = async () => {
  const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Cool Photo Location Permission',
      message:
          'Cool Photo App needs access to your Location ' +
          'so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);
  console.log(res);
}

function App(): JSX.Element {
  useEffect(() => {
    requestBLEPermissions();
  }, []);

  return (
    <SafeAreaView>
      <BluetoothScanner />
    </SafeAreaView>
  );
}

export default App;