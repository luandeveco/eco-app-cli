import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise<{latitude: number; longitude: number}>(
    (resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => {
          console.error('Erro ao obter a localização atual:', error.message);
          Alert.alert('Localização', 'Localização do celular desativada, Ative');
          reject(error);
        },
      );
    },
  );
}

export function watchLocation(successCallback: (position: { latitude: number; longitude: number }) => void) {
  const watchId = Geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      successCallback({ latitude, longitude });
    },
    error => {
      console.error('Erro ao obter a localização atual:', error.message);
      Alert.alert('Localização', 'Localização do celular desativada, Ative');
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
      distanceFilter: 0,
    }
  );
  
  return watchId;
}

export function clearWatchLocation(watchId: number) {
  Geolocation.clearWatch(watchId);
}