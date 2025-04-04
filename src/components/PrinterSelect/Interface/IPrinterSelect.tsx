import { IBLEPrinter } from "react-native-thermal-receipt-printer";

export interface IPrinterSelect {
  handleClose: () => void;
  text: string;
  printer: IBLEPrinter[];
  callbackAfterPrint?: () => void;
}