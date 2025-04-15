import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const requestLocationPermission = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permissão de localização do aplicativo',
        message:'O aplicativo precisa de acesso à sua localização para um melhor funcionamento',
        buttonNeutral: 'Pergunte-me mais tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Permitir',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permissão de localização concedida');

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            resolve({latitude, longitude});
          },
          error => {
            reject(error);
          },
          //{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    } else {
      console.log('Permissão de localização negada');
      return null;
    }
  } catch (err) {
    console.warn('Erro ao solicitar permissão de localização:', err);
    return null;
  }
};

export async function requestBluetoothPermissions() {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    if (
      granted['android.permission.BLUETOOTH_ADVERTISE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_SCAN'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
    } else {
      console.log('Algumas permissões do Bluetooth foram negadas');
    }
  } catch (err) {
    console.warn(err);
  }
}
