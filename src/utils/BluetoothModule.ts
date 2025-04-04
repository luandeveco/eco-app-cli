import { NativeModules } from 'react-native';

const { BluetoothModule } = NativeModules;

interface BluetoothModuleInterface {
  isBluetoothEnabled(): Promise<boolean>;
  enableBluetooth(): Promise<boolean>;
  getPairedDevices(): Promise<string[]>;
}

export default BluetoothModule as BluetoothModuleInterface;
