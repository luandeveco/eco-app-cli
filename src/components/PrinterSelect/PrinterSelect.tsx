import {useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {IPrinterSelect} from './Interface/IPrinterSelect';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import {Styles} from './Style';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function PrinterSelect({
  handleClose,
  printer,
  text,
  callbackAfterPrint,
}: IPrinterSelect) {
  const [loading, setLoading] = useState(false);

  async function imprimir(mac_address: string) {
    setLoading(true);

    await BLEPrinter.init().then(() => {
      //BLEPrinter.closeConn();
      BLEPrinter.connectPrinter(mac_address).finally(() => {
        setLoading(false);
        BLEPrinter.printText(text);
        if (callbackAfterPrint) {
          callbackAfterPrint();
        }
      });
    });
  }

  return (
    <View style={Styles.Container}>
      <TouchableOpacity
        style={Styles.BackgroundClose}
        onPress={handleClose}></TouchableOpacity>
      <View style={Styles.Content}>
        {loading && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#2974b4" />
          </View>
        )}

        {!loading && (
          <>
            <Text
              style={{
                fontWeight: '700',
                color: '#000000',
                marginBottom: 5,
                fontSize: 17,
                textAlign: 'center',
              }}>
              Selecione a impressora desejada:
            </Text>
            <FlatList
              style={{width: '100%'}}
              data={printer}
              renderItem={data => (
                <>
                  {data.item.device_name ||
                  data.item.inner_mac_address != null ? (
                    <TouchableOpacity
                      style={Styles.Printer}
                      activeOpacity={0.9}
                      onPress={() => imprimir(data.item.inner_mac_address)}>
                      <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                        {data.item.device_name}
                      </Text>
                      <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                        {data.item.inner_mac_address}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity activeOpacity={0.9} onPress={handleClose}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontWeight: '700',
                          textAlign: 'center',
                        }}>
                        Impresora não encontrada!
                      </Text>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontWeight: '600',
                          textAlign: 'justify',
                        }}>
                        Vincule sua impressora ao celular via Bluetooth.
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
}
