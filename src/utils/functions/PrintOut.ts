import { Alert } from "react-native";
import { BLEPrinter } from "react-native-thermal-receipt-printer";

export async function PrintOut(mac_addres: string, text: string) {
  await BLEPrinter.init().then(() =>{
    BLEPrinter.connectPrinter(mac_addres).finally(() => {
      BLEPrinter.printText(text);
    }).catch((error) => {
      Alert.alert("Erro na impressão: ", `${error}`)
    })
  })
}
