import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  Pressable,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {Styles} from './styles';
import {useEffect, useState} from 'react';
import {requestLocationPermission} from '../../components/Permissions';
import {dataSource} from '../../database/database';
import {Movement} from '../../database/entities/Movement';
import {Movement as MovementInterface} from '../../interfaces/Movement';
import {
  getCurrentLocation,
  watchLocation,
  clearWatchLocation,
} from '../../utils/GeoLocation';
import {TypePayment as typePayment} from '../../database/entities/TypePayment';
import {TypePayment as payment} from '../../interfaces/TypePayment';
import {TypeOccurrence as occourrence} from '../../interfaces/TypeOccurrence';
import {statusReceipt} from './Components/statusReceipt';
import {Line} from '../../components/Line/Line';
import {formatName} from '../../utils/Formatting/FormatName';
import {
  formatDate,
  formatDateReceipt,
} from '../../utils/Formatting/FormattingData';
import {Dropdown} from 'react-native-element-dropdown';
import {formatPhoneNumber} from '../../utils/Formatting/FormatPhone';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TypeOccurrence} from '../../database/entities/TypeOccurrence';
import BackButton from '../../components/ButtonBack/BackButton';
import {sendText} from './Components/Texts/sendAlertWhatsapp';
import {printNotice as print} from '../NewReceipt/Components/Texts/printNotice';
import ModalError from '../../components/ModalError/ModalError';
import {Shift as ShiftEntiti} from '../../database/entities/Shift';
import {Printer} from '../../database/entities/Printers';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import {printReceipt as PrintRecaipt} from './Components/Texts/printReceipt';
import {Messenger} from '../../database/entities/Messenger';
import {formatDateTime} from '../../utils/Formatting/FormattingDateClock';
import {TextInputMask} from 'react-native-masked-text';
import validateCPF from '../../utils/functions/CPFValidator';
import {InstitutionInformation} from '../../database/entities/InstitutionInformation';
import {ReceiptSettings} from '../../database/entities/ReceiptSettings';
import React from 'react';
// import PrinterModule from '../../interfaces/PrinterModule';

const {width, height} = Dimensions.get('window');

function NewReceipt({navigation, route}) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [textTaxpayer, setTextTaxpayer] = useState('');
  const [receipt, setReceipt] = useState<MovementInterface>();
  const [typeSelected, setSelectedType] = useState<payment>({} as payment);
  const [typeOccurrenceSelected, setTypeOccurrenceSelected] =
    useState<occourrence>({} as occourrence);
  const [types, setTypes] = useState([]);
  const [typeOccurrence, setTypeOccurrence] = useState([]);
  const [valuePaidSelected, setValuePaidSelected] = useState('0');
  const [loading, setLoading] = useState(true);
  const [checkLocation, setCheckLocation] = useState(false);
  const [saveLocation, setSaveLocation] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleError, setModalVisibleError] = useState(false);
  const [showPhones, setShowPhones] = useState(false);
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [Inform, setInform] = useState({
    cnpj: '',
    RazaoSocial: '',
    Telefone1: '',
    Telefone2: '',
    Telefone3: '',
    ChangePhone: '',
  });
  const [mac, setMac] = useState('');
  const [text, setText] = useState('');
  const [updatePhone, setUpdatePhone] = useState('');
  const [cpfCheck, setCpfCheck] = useState(false);
  const [cpfText, setCpfText] = useState('');
  const [cpfTextError, setCpfTextError] = useState(false);
  const [cpfTextErrorCountBoolean, setCpfTextErrorCountBoolean] =
    useState(false);
  const [cpfTextErrorMessage, setCpfTextErrorMessage] = useState('');
  const [cpfTextErrorCount, setCpfTextErrorCount] = useState<number>(0);
  const [cpfTextCount, setCpfTextCount] = useState<number>(0);
  const [CPFError, setCpfError] = useState(false);
  const [block, setBlock] = useState(false);
  const [fontSize, setFontSizeState] = useState<number>(16);
  let watchId: number;

  useEffect(() => {
    const fetchData = async () => {
      information();
      const printOuts = await dataSource
        .getRepository(Printer)
        .createQueryBuilder('printOUT')
        .orderBy('printOUT.id', 'DESC')
        .getOne();
      if (printOuts != null) {
        setMac(printOuts.inner_mac_address);
      } else if (printOuts == null && receipt.status == 0) {
        setModalVisibleError(true);
        setModalError({
          Title: 'Impressora',
          Message: 'Impressora não cadastrada',
        });
      }
      requestLocationPermissionsReceipt();

      const types = await dataSource.getRepository(typePayment).find();
      setTypes(types);

      const typePaymentChoose = types.find(
        type => type.codigo == receipt?.cod_tipo_pagamento,
      );
      if (typePaymentChoose) {
        setSelectedType(typePaymentChoose);
      }

      const typeOccurrence = await dataSource
        .getRepository(TypeOccurrence)
        .find();
      setTypeOccurrence(typeOccurrence);

      const typeOccurrenceChoose = typeOccurrence.find(
        type => type.codigo == receipt?.cod_ultima_ocorrencia,
      );
      if (typeOccurrenceChoose) {
        setTypeOccurrenceSelected(typeOccurrenceChoose);
      }
    };

    fetchData();
  }, [
    receipt?.cod_tipo_pagamento,
    receipt?.cod_ultima_ocorrencia,
    receipt?.status,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      information();
      requestLocationPermissionsReceipt();

      const types = await dataSource.getRepository(typePayment).find();
      setTypes(types);

      const typePaymentChoose = types.find(
        type => type.codigo == receipt?.cod_tipo_pagamento,
      );
      if (typePaymentChoose) {
        setSelectedType(typePaymentChoose);
      }

      const typeOccurrence = await dataSource
        .getRepository(TypeOccurrence)
        .find();
      setTypeOccurrence(typeOccurrence);

      const typeOccurrenceChoose = typeOccurrence.find(
        type => type.codigo == receipt?.cod_ultima_ocorrencia,
      );
      if (typeOccurrenceChoose) {
        setTypeOccurrenceSelected(typeOccurrenceChoose);
      }
      const printOuts = await dataSource
        .getRepository(Printer)
        .createQueryBuilder('printOUT')
        .orderBy('printOUT.id', 'DESC')
        .getOne();
      setMac(printOuts.inner_mac_address);
    };

    fetchData();
  }, [
    receipt?.cod_tipo_pagamento,
    receipt?.cod_ultima_ocorrencia,
    receipt?.status,
  ]);

  useEffect(() => {
    const cleanedCPF = cpfText.replace(/\D/g, '');
    let count = Number(cleanedCPF.length);
    setCpfTextCount(count);
  }, [cpfText]);

  useEffect(() => {
    const locationSuccessCallback = (position: {
      latitude: number;
      longitude: number;
    }) => {
      setLocation(position);
    };

    watchId = watchLocation(locationSuccessCallback);

    return () => {
      clearWatchLocation(watchId);
    };
  }, []);

  function checkCPF() {
    setCpfCheck(true);
  }

  function handleReturn() {
    navigation.goBack();
  }

  async function saveText() {
    const receipRepository = await dataSource.getRepository(Movement);
    const receiptNew = await receipRepository.findOne({
      where: {
        numero_recibo: route.params.receipt_id,
      },
    });
    receiptNew.texto_obs = textTaxpayer;

    await receipRepository.save(receiptNew);
    setReceipt(receiptNew);

    if (textTaxpayer) {
      receiptNew.obsMen = 1;
      await receipRepository.save(receiptNew);

      ToastAndroid.show('Texto salvo com sucesso', ToastAndroid.SHORT);
    }
  }

  function callNumber(telephone: string) {
    return Linking.openURL(`tel://${telephone}`);
  }

  function sendAlertWhatsapp(telefone: string) {
    setShowPhones(false);
    return Linking.openURL(
      `whatsapp://send?text=${sendText(
        Number(receipt.numero_recibo),
        receipt.nome_contribuinte,
        Inform.RazaoSocial,
        Inform.cnpj,
        Inform.Telefone1,
        Inform.Telefone2,
        Inform.Telefone3,
      )}&phone=55${telefone}`,
    );
  }

  async function requestLocationPermissionsReceipt() {
    try {
      const verification = await requestLocationPermission();
      //Atualiza o estado 'location' com as coordenadas obtidas, se estiverem disponíveis
      if (verification) {
        const coords = await getCurrentLocation();
        setLocation(coords);
      }
    } catch (error) {
      console.error('Error ao obter permissão de localização: ', error);
    }
  }

  async function information() {
    setTextTaxpayer('');
    const checkMovement = await dataSource.getRepository(Movement).findOne({
      where: {
        numero_recibo: route.params.receipt_id,
      },
    });
    setReceipt(checkMovement);
    if (
      checkMovement.CPF == null &&
      receipt.TipoPessoa === 0 &&
      checkMovement.status === 0
    ) {
      checkCPF();
    }

    const repository = await dataSource
      .getRepository(InstitutionInformation)
      .createQueryBuilder('inform')
      .orderBy('inform.id', 'DESC')
      .getOne();
    setInform({
      cnpj: repository.cnpj,
      RazaoSocial: repository.RazaoSocial,
      Telefone1: repository.Telefone1,
      Telefone2: repository.Telefone2,
      Telefone3: repository.Telefone3,
      ChangePhone: repository.AlterarTelefone,
    });
    setValuePaidSelected(
      Number(checkMovement.valor_prev).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      }),
    );
    setUpdatePhone(checkMovement.TelefoneObs);
    if (checkMovement.latitude != null && checkMovement.longitude != null) {
      setCheckLocation(true);
    } else {
      setCheckLocation(false);
    }
    setTextTaxpayer(checkMovement.texto_obs);
    const shiftRepository = await dataSource
      .getRepository(ShiftEntiti)
      .createQueryBuilder('Shift')
      .orderBy('Shift.id', 'DESC')
      .getOne();
    const fontSizeRepository = dataSource.getRepository(ReceiptSettings);
    const fontSize = await fontSizeRepository.findOne({where: {id: 1}});
    setFontSizeState(fontSize.sizeFont);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    if (
      timeFormatted >= shiftRepository.HoraAberturaSistema &&
      timeFormatted <= shiftRepository.HoraFechamentoSistema
    ) {
      setBlock(false);
    } else {
      setModalError({
        Title: 'Fora do horário de expediente',
        Message: 'Entre em contato com sua coordenação.',
      });
      setModalVisible(true);
      setBlock(true);
    }
    setLoading(false);
  }

  const locationCheckalert = () => {
    Alert.alert('Localização', 'Localização já existente, deseja atualizar ?', [
      {
        text: 'Sim',
        onPress: () => {
          setSaveLocation(true);
          downSucess();
        },
      },
      {
        text: 'Não',
        onPress: () => {
          setSaveLocation(false);
          downSucess();
        },
      },
    ]);
  };

  async function downSucess() {
    try {
      setLoadingStatus(false);
      const receipRepository = dataSource.getRepository(Movement);
      const receiptNew = await receipRepository.findOne({
        where: {
          numero_recibo: route.params.receipt_id,
        },
      });
      const currentDate = new Date();
      const dateDownload = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          currentDate.getUTCHours() - 3,
          currentDate.getUTCMinutes(),
          currentDate.getUTCSeconds(),
        ),
      );
      const dateLowString = dateDownload
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      let value = valuePaidSelected
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.');
      receiptNew.valor_prev = Number(parseFloat(value).toFixed(2));
      receiptNew.cod_tipo_pagamento = Number(typeSelected.codigo);
      receiptNew.status = 1;
      receiptNew.data_baixa = dateLowString;
      receiptNew.devolutivaMen = 1;
      if (saveLocation == true) {
        receiptNew.latitude =
          location != null ? location.latitude.toString() : null;
        receiptNew.longitude =
          location != null ? location.longitude.toString() : null;
      } else {
        receiptNew.latitude = location.latitude.toString();
        receiptNew.longitude = location.longitude.toString();
      }

      await receipRepository.save(receiptNew);
      setReceipt(receiptNew);
      ToastAndroid.show('Recibo baixado com sucesso', ToastAndroid.SHORT);
      printReceipt();
    } catch (error) {
      console.error(
        'Ocorreu um erro durante a impressão do recibo, Baixar: ',
        error,
      );
      Alert.alert('Erro', `Baixa, ${error}`);
      setLoadingStatus(false);
    }
  }

  async function downReturned() {
    setLoadingStatus(true);
    const receipRepository = await dataSource.getRepository(Movement);
    const receiptNew = await receipRepository.findOne({
      where: {
        numero_recibo: route.params.receipt_id,
      },
    });

    if (!typeOccurrenceSelected.codigo) {
      setModalError({
        Title: 'Baixar Devolvido',
        Message: 'Para baixar devolvido, insira uma ocorrência',
      });
      setModalVisibleError(true);
      setLoadingStatus(false);
      return;
    }

    const currentDate = new Date();
    const dateDownload = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours() - 3,
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
      ),
    );
    const dateLowString = dateDownload
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    (receiptNew.status = 3),
      (receiptNew.cod_ultima_ocorrencia = parseInt(
        typeOccurrenceSelected.codigo,
      ));
    receiptNew.texto_obs = textTaxpayer;
    receiptNew.data_baixa = dateLowString;
    receiptNew.latitude = location.latitude.toString();
    receiptNew.longitude = location.longitude.toString();
    receiptNew.devolutivaMen = 1;

    await receipRepository.save(receiptNew);
    setReceipt(receiptNew);
    ToastAndroid.show('Recibo devolvido com sucesso', ToastAndroid.SHORT);
  }

  async function printNotice() {
    try {
      const receipRepository = dataSource.getRepository(Movement);
      const receiptNew = await receipRepository.findOne({
        where: {
          numero_recibo: route.params.receipt_id,
        },
      });
      setLoadingStatus(true);

      const currentDate = new Date();
      const dateDownload = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          currentDate.getUTCHours() - 3,
          currentDate.getUTCMinutes(),
          currentDate.getUTCSeconds(),
        ),
      );
      const dateLowString = dateDownload
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      if (receiptNew) {
        receiptNew.ultima_visita = dateLowString;
      }
      await receipRepository.save(receiptNew);
      setReceipt(receiptNew);
      printOut(
        mac,
        print(
          Inform.RazaoSocial,
          Number(receipt.numero_recibo),
          receipt.nome_contribuinte,
        ),
      );
      setModalVisible(!modalVisible);
      setLoadingStatus(false);
    } catch (error) {
      console.error('Ocorreu um erro ao imprimir o aviso: ', error);
      setLoadingStatus(false);
    }
  }

  async function printReceipt() {
    try {
      setLoadingStatus(true);
      const messengerData = await dataSource
        .getRepository(Messenger)
        .createQueryBuilder('messenger')
        .orderBy('messenger.id', 'DESC')
        .getOne();

      const dateLastContributions = formatDate(
        receipt.data_ultima_contribuicoes,
      );

      const date = new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
        ),
      );

      //Convert to string and remove the "T" and "Z"
      const dateLowString = date
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');

      const dateDonation = formatDate(dateLowString);

      const dateDownload = new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours() - 3,
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds(),
        ),
      );
      //Convert to string and remove the "T" and "Z"
      const dateLowStringTime = dateDownload
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');

      const dataTime = formatDateTime(dateLowStringTime);
      setText(
        await PrintRecaipt(
          Inform.cnpj,
          Inform.RazaoSocial,
          Inform.Telefone1,
          Inform.Telefone2,
          Inform.Telefone3,
          receipt.numero_recibo.toString(),
          receipt.nome_contribuinte,
          valuePaidSelected,
          messengerData.nome,
          dateLastContributions,
          dateDonation,
          receipt.operador,
          dataTime,
          receipt.cod_contribuinte.toString(),
        ),
      );
      // connectAndPrint(
      //   mac,
      //   await PrintRecaipt(
      //     Inform.cnpj,
      //     Inform.RazaoSocial,
      //     Inform.Telefone1,
      //     Inform.Telefone2,
      //     Inform.Telefone3,
      //     receipt.numero_recibo.toString(),
      //     receipt.nome_contribuinte,
      //     valuePaidSelected,
      //     messengerData.nome,
      //     dateLastContributions,
      //     dateDonation,
      //     receipt.operador,
      //     dataTime,
      //     receipt.cod_contribuinte.toString()
      //    ),
      // );
      printOut(
        mac,
        await PrintRecaipt(
          Inform.cnpj,
          Inform.RazaoSocial,
          Inform.Telefone1,
          Inform.Telefone2,
          Inform.Telefone3,
          receipt.numero_recibo.toString(),
          receipt.nome_contribuinte,
          valuePaidSelected,
          messengerData.nome,
          dateLastContributions,
          dateDonation,
          receipt.operador,
          dataTime,
          receipt.cod_contribuinte.toString(),
        ),
      );
      setLoadingStatus(false);
    } catch (error) {
      console.error('Ocorreu um erro durante a impressão do recibo:', error);
      Alert.alert('Erro', `Impressão, ${error}`);
      setLoadingStatus(false);
    }
  }

  async function printOut(mac: string, text: string) {
    await BLEPrinter.init()
      .then(() => {
        //BLEPrinter.closeConn();
        BLEPrinter.connectPrinter(mac).finally(() => {
          setLoading(false);
          BLEPrinter.printText(text);
        });
      })
      .catch(error => {
        Alert.alert('Erro na impressão:', `${error}`);
      });
  }

  async function savePhone() {
    if (updatePhone != ('' || null)) {
      const receipRepository = await dataSource.getRepository(Movement);
      const receiptNew = await receipRepository.findOne({
        where: {
          numero_recibo: route.params.receipt_id,
        },
      });
      receiptNew.TelefoneObs = updatePhone;
      await receipRepository.save(receiptNew);
      setReceipt(receiptNew);
      ToastAndroid.show('Telefone salvo com sucesso', ToastAndroid.SHORT);
    }
  }

  async function CPF() {
    if (cpfText != '') {
      const cleanedCPF = cpfText.replace(/\D/g, '');
      let count = Number(cleanedCPF.length);
      if (count === 11 && validateCPF(cpfText) == true) {
        const receipRepository = await dataSource.getRepository(Movement);
        const receiptNew = await receipRepository.findOne({
          where: {
            numero_recibo: receipt.numero_recibo.toString(),
          },
        });
        receiptNew.CPF = cleanedCPF;
        await receipRepository.save(receiptNew);
        setCpfCheck(false);
        setCpfTextError(false);
        setCpfTextErrorCountBoolean(false);
        ToastAndroid.show('CPF atualizado', ToastAndroid.SHORT);
      } else {
        setCpfTextErrorCount(count);
        setCpfTextError(true);
        setCpfTextErrorCountBoolean(true);
        setCpfTextErrorMessage('CPF inválido');
        Vibration.vibrate();
      }
    } else {
      setCpfError(true);
      setCpfTextError(true);
      setCpfTextErrorMessage('Insira o CPF do doador');
      Vibration.vibrate();
    }
  }

  //   const connectAndPrint = async (mac: string, text:string) => {
  //     try {
  //         const connectMessage = await PrinterModule.connectToPrinter(mac);
  //         console.log(connectMessage);
  //         Alert.alert('Success', connectMessage);

  //         const printMessage = await PrinterModule.printText(text);
  //         console.log(printMessage);
  //         Alert.alert('Success', printMessage);
  //     } catch (error) {
  //         console.error(error);
  //         Alert.alert('Error', error.message);
  //     }
  // };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#2974b4',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={Styles.container}
      keyboardVerticalOffset={30}
      enabled>
      <StatusBar
        backgroundColor={modalVisibleError ? 'rgba(0, 0, 0, 0.5)' : '#2974B4'}
        barStyle="light-content"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton onPress={handleReturn} />
        <View style={Styles.ButtonDownView}>
          {checkLocation === true ? (
            <Pressable
              style={({pressed}) => [{
                backgroundColor: receipt?.status != 0 ? '#bebebe' : '#fff',
                borderColor: receipt?.status != 0 ? '#bebebe' : '#fff',
                marginBottom: '1%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
              }, {opacity: pressed ? 0.6 : 1}]}
              disabled={
                block == true ? true : receipt?.status != 0 ? true : false
              }
              onPress={locationCheckalert}>
              <Text style={{color: '#000000', fontWeight: '700'}}>
                Baixar Recebido
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={({pressed}) => [{
                backgroundColor: receipt?.status != 0 ? '#bebebe' : '#fff',
                borderColor: receipt?.status != 0 ? '#bebebe' : '#fff',
                marginBottom: '1%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
              },{opacity: pressed ? 0.6 : 1}]}
              disabled={
                block == true ? true : receipt?.status != 0 ? true : false
              }
              onPress={() => {
                downSucess();
              }}>
              <Text style={{color: '#000000', fontWeight: '700'}}>
                Baixar Recebido
              </Text>
            </Pressable>
          )}
        </View>
        {/*Inicio do recibo*/}
        <View style={Styles.containerReceipt}>
          {/*Cabeçalho do recibo*/}
          <View style={Styles.ReceiptTitle}>
            <Text style={Styles.titleText}>Nº</Text>
            <Text style={Styles.titleTextData}>{receipt.numero_recibo}</Text>
            <Text style={Styles.titleTextstatus}>
              {statusReceipt(Number(receipt.status))}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Line />
          </View>
          {/** Informações do recibo*/}
          <View style={Styles.receiptInformation}>
            <Text style={Styles.titleText}>OPERADOR(A)</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {formatName(receipt?.operador)}
            </Text>
            <Text style={Styles.titleText}>DATA PREVISTA</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {formatDate(receipt?.data_prev)}
            </Text>
            <Text style={Styles.titleText}>DATA ÚLTIMA DOAÇÃO</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {receipt?.data_ultima_contribuicoes != null
                ? new Date(receipt.data_ultima_contribuicoes)
                    .toISOString()
                    .split('T')[0] === '1969-12-31'
                  ? ''
                  : formatDateReceipt(receipt.data_ultima_contribuicoes)
                : ''}
            </Text>
            <Dropdown
              data={types}
              labelField="descricao"
              valueField="codigo"
              value={typeSelected}
              placeholder="Tipo de pagamento"
              placeholderStyle={{
                color: '#000000',
                borderColor: '#646464',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              containerStyle={{
                top: '-0.2%',
                borderRadius: 8,
              }}
              style={{
                height: 43,
                width: '100%',
                borderColor: '#646464',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              itemTextStyle={{
                color: '#000000',
              }}
              selectedTextStyle={{
                color: '#000000',
              }}
              iconColor={'#000000'}
              onChange={item => setSelectedType(item)}
            />
            <TextInputMask
              type={'money'}
              editable={receipt?.status != 0 ? false : true}
              onChangeText={text => setValuePaidSelected(text)}
              style={{
                width: '100%',
                height: 43,
                marginTop: '3%',
                marginBottom: '6%',
                backgroundColor: 'white',
                borderColor: '#646464',
                color: '#000000',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
                borderRadius: 8,
                borderWidth: 1,
                paddingLeft: 8,
                paddingRight: 8,
              }}
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: '',
              }}
              value={valuePaidSelected}
              keyboardType={'numeric'}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Line />
          </View>
          {/**Informações do contribuinte*/}
          <View style={Styles.receiptInformation}>
            <Text style={Styles.titleText}>CONTRIBUINTE</Text>
            <Pressable onPress={checkCPF}>
              <Text style={[Styles.receiptInformationData, {fontSize}]}>
                {receipt?.cod_contribuinte} -{' '}
                {formatName(receipt?.nome_contribuinte)}
              </Text>
            </Pressable>
            <Text style={Styles.titleText}>CONTATO</Text>
            {[receipt?.telefone1, receipt?.telefone2, receipt?.telefone3].map(
              (telefone, index) => (
                <View key={index} style={Styles.Cell}>
                  {telefone && (
                    <>
                      <Pressable
                        style={({pressed}) => [Styles.ButtonCall, {opacity: pressed ? 0.6 : 1}]}
                        onPress={() => callNumber(telefone)}>
                        <Text style={[Styles.TextData, {fontSize}]}>
                          {formatPhoneNumber(telefone)}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={({pressed}) => [Styles.ButtonCall, {opacity: pressed ? 0.6 : 1}]}
                        onPress={() => sendAlertWhatsapp(telefone)}>
                        <Icon name="whatsapp" size={25} color="#000000" />
                      </Pressable>
                    </>
                  )}
                </View>
              ),
            )}
            {Number(Inform.ChangePhone) === 1 ? (
              <>
                <Text style={Styles.titleText}>Novo Contato</Text>
                <TextInputMask
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  value={updatePhone == (null || '') ? '' : updatePhone}
                  style={{
                    width: '100%',
                    height: 43,
                    marginBottom: '2%',
                    backgroundColor: 'white',
                    borderColor: '#646464',
                    color: '#000000',
                    fontFamily: 'Inter-Regular',
                    fontSize: 17,
                    borderRadius: 8,
                    borderWidth: 1,
                    paddingLeft: 8,
                    paddingRight: 8,
                  }}
                  onChangeText={text => {
                    setUpdatePhone(text);
                  }}
                />
                <Pressable
                  style={({pressed}) => [{
                    backgroundColor: '#2974b4',
                    marginVertical: '2%',
                    width: '100%',
                    padding: '5%',
                    borderRadius: 8,
                  },{opacity: pressed ? 0.6 : 1}]}
                  onPress={() => savePhone()}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    Salvar Número
                  </Text>
                </Pressable>
              </>
            ) : (
              ''
            )}
          </View>
          <View style={{alignItems: 'center'}}>
            <Line />
          </View>
          {/**Informações do Doador*/}
          <View style={Styles.receiptInformation}>
            <Text style={Styles.titleText}>ENDEREÇO</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {formatName(receipt?.end_logradouro)}, {receipt?.end_numero}
            </Text>
            <Text style={Styles.titleText}>BAIRRO</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {formatName(receipt?.end_bairro)}
            </Text>
            <Text style={Styles.titleText}>MUNICÍPIO</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {formatName(receipt?.end_municipio)}
            </Text>
            <Text style={Styles.titleText}>COMPLEMENTO</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {receipt?.end_complemento
                ? formatName(receipt?.end_complemento)
                : ''}
            </Text>
            <Text style={Styles.titleText}>REFERÊNCIA</Text>
            <Text style={[Styles.receiptInformationData, {fontSize}]}>
              {receipt?.end_referencia
                ? formatName(receipt?.end_referencia)
                : ''}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Line />
          </View>
          {/**Observações do recibo */}
          <View style={Styles.receiptInformation}>
            <View
              style={{
                backgroundColor: '#feffc9',
                width: '100%',
                paddingVertical: '1%',
                paddingHorizontal: '0.5%',
              }}>
              <Text style={Styles.titleText}>OBSERVAÇÃO DO RECIBO</Text>
              <Text style={[Styles.receiptInformationData, {fontSize}]}>
                {receipt?.memo_obs_mensageiro
                  ? formatName(receipt?.memo_obs_mensageiro)
                  : 'Sem observação'}
              </Text>
              <Text style={Styles.titleText}>OBSERVAÇÃO DO CONTRIBUINTE</Text>
              <Text style={[Styles.receiptInformationData, {fontSize}]}>
                {receipt?.obs_contribuinte
                  ? formatName(receipt?.obs_contribuinte)
                  : 'Sem observação'}
              </Text>
            </View>
            <Dropdown
              data={typeOccurrence}
              labelField="descricao"
              valueField="codigo"
              value={typeOccurrenceSelected}
              placeholder="TIPO DE OCORRÊNCIA"
              placeholderStyle={{
                color: '#646464',
                borderColor: '#646464',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              containerStyle={{
                top: '-0.2%',
                borderRadius: 8,
              }}
              style={{
                height: 43,
                width: '100%',
                borderColor: '#646464',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              selectedTextStyle={{
                color: '#000000',
              }}
              itemTextStyle={{
                color: '#000000',
              }}
              iconColor={'#000000'}
              onChange={item => setTypeOccurrenceSelected(item)}
            />
            <TextInput
              style={{
                height: 40,
                borderColor: '#646464',
                borderWidth: 1,
                borderRadius: 8,
                color: '#000000',
                marginTop: '3%',
                width: '100%',
                fontSize: 17,
              }}
              placeholder="OBSERVAÇÃO"
              onChangeText={text => setTextTaxpayer(text)}
              value={textTaxpayer}
            />
            <Pressable
              style={({pressed}) => [{
                backgroundColor: '#2974b4',
                marginVertical: '2%',
                width: '100%',
                padding: '5%',
                borderRadius: 8,
              }, {opacity: pressed ? 0.6 : 1}]}
              onPress={() => saveText()}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                ENVIAR OBSERVAÇÃO
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={({pressed}) => [{
            backgroundColor: receipt?.status != 0 ? '#bebebe' : '#fff',
            borderColor: receipt?.status != 0 ? '#bebebe' : '#fff',
            marginVertical: '3%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }, {opacity: pressed ? 0.6 : 1}]}
          disabled={block == true ? true : receipt?.status != 0 ? true : false}
          onPress={() => {
            downReturned();
          }}>
          <Text style={{color: '#000000', fontWeight: '700'}}>
            Baixar devolvido
          </Text>
        </Pressable>
        {receipt.status === 1 ? (
          <Pressable
            style={({pressed}) => [{
              backgroundColor: '#fff',
              borderColor: '#fff',
              marginVertical: '3%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
            }, {opacity: pressed ? 0.6 : 1}]}
            onPress={() => {
              printReceipt();
            }}>
            <Text style={{color: '#000000', fontWeight: '700'}}>
              Imprimir novamente
            </Text>
          </Pressable>
        ) : (
          ''
        )}
        <Pressable
          style={({pressed}) => [{
            backgroundColor: '#fff',
            borderColor: '#fff',
            marginBottom: '3%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          },{opacity: pressed ? 0.6 : 1}]}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={{color: '#000000', fontWeight: '700'}}>Aviso</Text>
        </Pressable>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setShowPhones(false);
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(!modalVisible);
              setShowPhones(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <StatusBar
                backgroundColor="rgba(0, 0, 0, 0.5)"
                barStyle="light-content"
              />
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
                {showPhones ? (
                  [
                    receipt?.telefone1,
                    receipt?.telefone2,
                    receipt?.telefone3,
                  ].map((telefone, index) => (
                    <View key={index} style={Styles.Cell}>
                      {telefone && (
                        <>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            <Pressable
                              style={({pressed}) => [Styles.ButtonCallModal, {opacity: pressed ? 0.6 : 1}]}
                              onPress={() => sendAlertWhatsapp(telefone)}>
                              <Text style={{color: '#ffffff'}}>
                                {formatPhoneNumber(telefone)}
                              </Text>
                            </Pressable>
                          </ScrollView>
                        </>
                      )}
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <Pressable
                      style={({pressed}) => [{
                        backgroundColor: '#2974B4',
                        padding: 10,
                        borderRadius: 15,
                        width: '49%',
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: '11%',
                      }, {opacity: pressed ? 0.6 : 1}]}
                      onPress={() => {
                        setModalVisible(!false);
                        printNotice();
                      }}>
                      <Image
                        source={require('../../assets/icons/atencao.png')}
                        style={{width: 62, height: 62, marginBottom: '2%'}}
                      />
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontWeight: '500',
                        }}>
                        Imprimir aviso
                      </Text>
                    </Pressable>
                    <Pressable
                      style={({pressed}) => [{
                        backgroundColor: '#2974B4',
                        padding: 10,
                        borderRadius: 15,
                        width: '49%',
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }, {opacity: pressed ? 0.6 : 1}]}
                      onPress={() => setShowPhones(true)}>
                      <Image
                        source={require('../../assets/icons/whatsapp.png')}
                        style={{
                          width: 62,
                          height: 62,
                          marginBottom: '2%',
                        }}
                      />
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontWeight: '500',
                        }}>
                        Enviar pelo Whatsapp
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/**Modal CPF */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={cpfCheck}
          onRequestClose={() => setCpfCheck(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <StatusBar
              backgroundColor="rgba(0, 0, 0, 0.5)"
              barStyle="light-content"
            />
            <View
              style={{
                backgroundColor: '#2974b4',
                padding: '5%',
                alignItems: 'flex-start',
                width: width * 0.9,
                justifyContent: 'center',
                borderRadius: 16,
              }}>
              <Pressable
                onPress={() => setCpfCheck(false)}
                style={{
                  alignSelf: 'flex-end',
                  top: 8,
                  position: 'absolute',
                  marginRight: '7%',
                  marginTop: '3.5%',
                }}>
                <IconAntDesign name="closecircleo" color="#FFFFFF" size={28} />
              </Pressable>
              <Text style={Styles.ModalCPFTitleText}>CPF DOS DOADORES</Text>
              <Text style={Styles.ModalCPFReceiptInformationData}>
                Solicite ao doador o CPF
              </Text>
              <View style={Styles.inputLabelCPF}>
                <Text style={[Styles.ModalCPFTitleText, {alignSelf: 'center'}]}>
                  CPF:{' '}
                </Text>
                <TextInputMask
                  type={'cpf'}
                  placeholder="CPF"
                  style={{
                    width: '70%',
                    height: '100%',
                    borderColor: cpfTextError
                      ? CPFError
                        ? '#FFFFFF'
                        : cpfText == ''
                        ? '#FFFFFF'
                        : cpfTextErrorCountBoolean
                        ? cpfTextCount <= cpfTextErrorCount
                          ? '#FFFFFF'
                          : '#FFFFFF'
                        : '#FFFFFF'
                      : CPFError
                      ? '#FFFFFF'
                      : '#FFFFFF',
                    color: '#FFFFFF',
                    borderWidth: 1,
                    borderRadius: 8,
                    fontSize: 16,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 1,
                  }}
                  value={''}
                  onChangeText={value => setCpfText(value)}
                />
              </View>
              {cpfTextError ? (
                cpfText == '' ? (
                  CPFError ? (
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.85)',
                        backgroundColor: '#000000',
                        paddingHorizontal: '2%',
                        borderRadius: 5,
                        position: 'absolute',
                        top: width * 0.297,
                        left: height * 0.09,
                        textAlign: 'center',
                      }}>
                      * {cpfTextErrorMessage}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.85)',
                        backgroundColor: '#000000',
                        paddingHorizontal: '2%',
                        borderRadius: 5,
                        position: 'absolute',
                        top: width * 0.297,
                        left: height * 0.09,
                      }}>
                      * {cpfTextErrorMessage}
                    </Text>
                  )
                ) : cpfTextErrorCountBoolean ? (
                  cpfTextCount <= cpfTextErrorCount ? (
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.85)',
                        backgroundColor: '#000000',
                        paddingHorizontal: '2%',
                        borderRadius: 5,
                        position: 'absolute',
                        top: width * 0.297,
                        left: height * 0.09,
                      }}>
                      * {cpfTextErrorMessage}
                    </Text>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              ) : CPFError ? (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    backgroundColor: '#000000',
                    paddingHorizontal: '2%',
                    borderRadius: 5,
                    position: 'absolute',
                    top: width * 0.297,
                    left: height * 0.09,
                    textAlign: 'center',
                  }}>
                  * {cpfTextErrorMessage}
                </Text>
              ) : (
                ''
              )}
              <Pressable
                onPress={CPF}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#FFFFFF',
                  marginBottom: '3%',
                  width: '50%',
                  alignSelf: 'flex-end',
                  borderWidth: 1,
                  padding: '2.5%',
                  borderRadius: 10,
                  marginVertical: '2%',
                  marginTop: '13%',
                }}>
                <Text
                  style={{
                    color: '#2974b4',
                    textAlign: 'center',
                    fontWeight: '400',
                  }}>
                  Salvar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <ModalError
        Title={modalError.Title}
        Message={modalError.Message}
        status={modalVisibleError}
        onClose={() => setModalVisibleError(false)}
      />
    </KeyboardAvoidingView>
  );
}
export default React.memo(NewReceipt);
