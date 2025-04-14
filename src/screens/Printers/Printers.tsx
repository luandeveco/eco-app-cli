import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BLEPrinter, IBLEPrinter} from 'react-native-thermal-receipt-printer';
import {Styles} from './Style';
import {Printer} from '../../database/entities/Printers';
import {dataSource} from '../../database/database';
import {ModalCheck} from '../../components/ModalCheck/ModalCheck';
import ModalError from '../../components/ModalError/ModalError';

export function Printers() {
  const [loading, setLoading] = useState(false);
  const [printers, setPrinters] = useState<IBLEPrinter[]>([{} as IBLEPrinter]);
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [modalCheck, setModalCheck] = useState({Title: '', Message: ''});
  const [idPrint, setIdPrint] = useState('');
  const [modalVisibleCheck, setModalVisibleCheck] = useState(false);
  const [modalVisibleError, setModalVisibleError] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalAction, setModalAction] = useState(false);
  const [registeredPrinters, setRegisteredPrinters] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    information().then(printe => setRegisteredPrinters(printe));
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  },[]);

  useEffect(()=>{
    information().then(printe => setRegisteredPrinters(printe));
  },[Print || PrintOutExclusion])

  async function PrintOutExclusion(id: string) {
    await dataSource.getRepository(Printer).createQueryBuilder().delete().from(Printer)
    .where('id = :id', {id: id}).execute().then(response =>{
      setModalAction(false);
      setModalCheck({
        Title: 'Sucesso',
        Message: 'Impressora excluída com sucesso',
      });
      setModalVisibleCheck(true);
    }).catch(error => {
      setModalAction(false);
      setModalVisibleError(true);
      setModalError({Title: 'Erro', Message: 'Erro ao tentar excluir a impressora'});
      ToastAndroid.show(error, ToastAndroid.LONG);
    })
  }

  async function PrintOutTest(id: string) {
    const printOuts = await dataSource.getRepository(Printer).findOne({where: {id: Number(id)}});
    const text = 'App Mensageiro: Teste de impressao.';

     await BLEPrinter.init().then(() => {
       //BLEPrinter.closeConn();
       BLEPrinter.connectPrinter(printOuts.inner_mac_address).finally(() => {
         setLoading(false);
         BLEPrinter.printText(text);
       });
     });

     setModalAction(false);
  }

  async function Print(mac_address: string, device_name: string) {
    const existingCounty = await Printer.findOne({
      where: {inner_mac_address: mac_address},
    });
    if(!existingCounty){
      const printNew = new Printer();
      printNew.inner_mac_address = mac_address;
      printNew.nome = device_name;
      printNew.impressoraPadrao = 'false';
      const printOuts = dataSource.getRepository(Printer);
      await printOuts
        .save(printNew)
        .then(response => {
            setModalVisibleCheck(true);
            setModalCheck({
              Title: 'Sucesso',
              Message: 'Impressora cadastrada com sucesso',
            });
        })
        .catch(error => {
          setModalVisibleError(true);
          setModalError({Title: 'Erro', Message: 'Impressora não cadastrada'});
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    } else {
      setModalVisibleError(true);
      setModalError({Title: 'Erro', Message: 'Impressora já cadastrada'});
    }
  }

  function handleReturn() {
    navigation.goBack();
  }

  async function information() {
    const printOuts = dataSource.getRepository(Printer);
    return await printOuts.find();
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={
          modal || modalVisibleCheck || modalAction || modalVisibleError
            ? modalVisibleCheck
              ? 'rgba(0,0,0, 0.5)'
              : 'rgba(0,0,0, 0.7)'
            : 'transparent'
        }
        barStyle={
          modal || modalVisibleCheck || modalAction || modalVisibleError
            ? 'light-content'
            : 'dark-content'
        }
      />
      <ImageBackground
        source={require('../../assets/Background/BackgroungConfig.png')}
        style={Styles.backgroundImage}>
        <View style={Styles.Container}>
          {/** Cabeçalho da tela: Botão de voltar e título */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={Styles.LineContainer}
              onPress={handleReturn}>
              <View style={Styles.button}>
                <Image
                  source={require('../../assets/icons/voltar.png')}
                  style={{maxWidth: 15, height: 15}}
                />
                <Text style={Styles.backButton}>
                  Voltar
                </Text>
              </View>
            </TouchableOpacity>
            <Text
              style={Styles.printButton}>
              Impressoras
            </Text>
          </View>
        </View>
        {/** Botão de ação */}
        <View style={{marginRight: '5%'}}>
          <View style={{marginVertical: '4%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={Styles.LineContainerButton}
              onPress={() => setModal(true)}>
              <Text style={Styles.text}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width: '100%', height: '70%'}}
            data={registeredPrinters}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '3%',
                  marginLeft: '5%',
                  marginBottom: '2%',
                  borderBottomWidth: 1,
                  borderBottomColor: '#2974b4',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  setModalAction(true), setIdPrint(item.id);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: '500',
                        fontSize: 18,
                      }}>
                      {item.nome}
                    </Text>
                    <Text
                      style={{
                        color: '#646464',
                        fontWeight: '300',
                      }}>
                      {item.inner_mac_address}
                    </Text>
                  </View>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {/** Modal de cadastro de impressora */}
        <Modal
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModal(false)}
          visible={modal}>
          <TouchableWithoutFeedback onPress={() => setModal(false)}>
            <View style={Styles.ContainerModal}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  alignItems: 'center',
                  width: '100%',
                  height: '35%',
                  justifyContent: 'center',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}>
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
                  data={printers}
                  renderItem={data => (
                    <>
                      {data.item.device_name ||
                      data.item.inner_mac_address != null ? (
                        <TouchableOpacity
                          style={Styles.Printer}
                          activeOpacity={0.9}
                          onPress={() => {
                            Print(
                              data.item.inner_mac_address,
                              data.item.device_name,
                            );
                            setModal(false);
                          }}>
                          <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                            {data.item.device_name}
                          </Text>
                          <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                            {data.item.inner_mac_address}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={Styles.Printer}
                          activeOpacity={0.9}
                          onPress={() => setModal(false)}>
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
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/** Modal de ações da impressora */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalAction}
          onRequestClose={() => setModalAction(false)}>
          <TouchableWithoutFeedback onPress={() => setModalAction(false)}>
            <View style={Styles.ContainerModalAction}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 20,
                  alignItems: 'center',
                  width: '100%',
                  height: '35%',
                  justifyContent: 'center',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      PrintOutExclusion(idPrint);
                    }}
                    style={{
                      ...Styles.buttonAction,
                      borderColor: '#df0000',
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        color: '#df0000',
                        fontWeight: '400',
                        fontSize: 18,
                      }}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      PrintOutTest(idPrint);
                    }}
                    style={{
                      ...Styles.buttonAction,
                      borderColor: '#2974b4',
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        color: '#2974b4',
                        fontWeight: '400',
                        fontSize: 18,
                      }}>
                      Testar Impressora
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <ModalCheck
          Title={modalCheck.Title}
          Message={modalCheck.Message}
          status={modalVisibleCheck}
          onClose={() => setModalVisibleCheck(false)}
        />
        <ModalError
          Title={modalError.Title}
          Message={modalError.Message}
          status={modalVisibleError}
          onClose={() => setModalVisibleError(false)}
        />
      </ImageBackground>
    </>
  );
}
