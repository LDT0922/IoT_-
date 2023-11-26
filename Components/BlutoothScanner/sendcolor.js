import React, { useEffect, useState } from 'react';
import { View, Text, Button,StyleSheet  } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import Slider from '@react-native-community/slider';

export const BluetoothScanner = () => {
  const [device, setDevice] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manager, setManager] = useState(null); // BleManager 인스턴스 상태로 관리
  const [volume, setVolume] = useState(0);
   
  // 서비스와 캐릭터리스틱 UUID
  const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  const CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';


    useEffect(() => {
      // BleManager 인스턴스 생성
      const bleManager = new BleManager();
      setManager(bleManager);
  
      return () => {
        // 컴포넌트 언마운트 시 리소스 정리
        manager.destroy();
      };
    }, []);

    const startScanning = () => {
        setScanning(true);
        if(manager){
            console.log('yes');
        } //64:B7:08:6E:F0:6E
        manager.connectToDevice('64:B7:08:6E:F0:6E').then(connectedDevice => {
            setDevice(connectedDevice);
            return manager.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id);
        }).then(() => {
            setScanning(false);
            console.log('Esp32 Connected')
        }).catch(error => {
            console.log(error);
            setScanning(false);
        });
    };
    const sendCharacter = () => {
        if (device) {
            const valueBase64 = base64.encode('a');
            device.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                valueBase64
            ).then(characteristic => {
                console.log('Sent', characteristic.value);
            }).catch(error => {
                console.log('Error', error);
            });
        }
    };

    const sendVolume = (value) => {
        if (device) {
          const volumeValue = value.toString();
          const valueBase64 = base64.encode(volumeValue);
          device.writeCharacteristicWithResponseForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            valueBase64
          ).then(characteristic => {
            console.log('Volume sent:', volumeValue);
          }).catch(error => {
            console.log('Error', error);
          });
        }
      };

    return (
    <View style={styles.container}>
      <Text>{scanning ? 'Scanning…' : 'Connected'}</Text>
      <Button
          title={scanning ? 'Scanning…' : 'Start Scan'}
          disabled={scanning}
          onPress={startScanning}
          style = {styles.button}

      />
      {/* {device && ( */}
          <Button
              title="Send 'a'"
              onPress={sendCharacter}
              style = {styles.button}
          />
      {/* )} */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={4096}
        value={volume}
        onValueChange={setVolume}
        onSlidingComplete={sendVolume}
      />
      <Text>Volume: {volume}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      padding : 10,
      margin : 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slider: {
      width: 300,
      height: 40,
    },
    button : {
        marginVertical : 10,
    }
  });
