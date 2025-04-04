import { NativeModules } from 'react-native';

const { GetTimeModule } = NativeModules;

interface GetTimeModuleInterface {
  getCurrentTime(): Promise<string>;
  getCurrentDateTime(): Promise<string>;
}

export default GetTimeModule as GetTimeModuleInterface;
