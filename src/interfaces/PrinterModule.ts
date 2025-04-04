import {NativeModules} from 'react-native';

const {PrinterModule} = NativeModules;

interface PrinterModuleType {
  connectToPrinter(macAddress: string): Promise<string>;
  printText(text: string): Promise<string>;
}

export default PrinterModule as PrinterModuleType;
