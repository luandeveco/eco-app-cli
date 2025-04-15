import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
  Pressable,
  ScrollView,
  BackHandler,
  FlatList,
} from 'react-native';
import {Styles} from './Style';
import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {dataSource} from '../../database/database';
import {
  Movement,
  Movement as MovementEntities,
} from '../../database/entities/Movement';
import {Messenger} from '../../database/entities/Messenger';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../components/ButtonBack/BackButton';
import {DateMovementChosen} from '../../database/entities/DateMovementChosen';
import {api} from '../../services/Api';
import {Auth} from '../../database/entities/Auth';
import {getCurrentLocation} from '../../utils/GeoLocation';
import {AccountsBank} from '../../database/entities/AccountsBank';
import {formatDate} from '../../utils/Formatting/FormattingData';
import {formatDateTime} from '../../utils/Formatting/FormattingDateClock';
import {Institution} from '../../database/entities/Institution';
import {formatMoneyNumber} from '../../utils/Formatting/FormatMoneyNumber';
import ModalError from '../../components/ModalError/ModalError';
import {BLEPrinter, IBLEPrinter} from 'react-native-thermal-receipt-printer';
import {clearDatabase} from './Components/Index';
import {formatPhoneNumber} from '../../utils/Formatting/FormatPhone';
import detailedReport from './Components/DetailedReport';
import GetTimeModule from '../../utils/GetTimeModule';
import {InstitutionInformation} from '../../database/entities/InstitutionInformation';
import summarizedReport from './Components/SummarizedReport';
import detailedReportServer from './Components/DetailedReportServer';

export function Relatory() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalPrinterSelect, setVisibleModalPrinterSelect] =
    useState(false);
  const [qtdPending, setQtdPending] = useState<{
    dinheiro: number;
    carCredito: number;
    carDebito: number;
    pix: number;
    cheque: number;
    deposito: number;
    boleto: number;
    carne: number;
    debConta: number;
    total: number;
  }>({
    dinheiro: 0,
    carCredito: 0,
    carDebito: 0,
    pix: 0,
    cheque: 0,
    deposito: 0,
    boleto: 0,
    carne: 0,
    debConta: 0,
    total: 0,
  });
  const [valuePending, setValuePending] = useState<{
    dinheiro: string;
    carCredito: string;
    carDebito: string;
    pix: string;
    cheque: string;
    deposito: string;
    boleto: string;
    carne: string;
    debConta: string;
    total: string;
  }>({
    dinheiro: '',
    carCredito: '',
    carDebito: '',
    pix: '',
    cheque: '',
    deposito: '',
    boleto: '',
    carne: '',
    debConta: '',
    total: '',
  });
  const [qtdReceived, setQtdReceived] = useState<{
    dinheiro: number;
    carCredito: number;
    carDebito: number;
    pix: number;
    cheque: number;
    deposito: number;
    boleto: number;
    carne: number;
    debConta: number;
    total: number;
  }>({
    dinheiro: 0,
    carCredito: 0,
    carDebito: 0,
    pix: 0,
    cheque: 0,
    deposito: 0,
    boleto: 0,
    carne: 0,
    debConta: 0,
    total: 0,
  });
  const [valueReceived, setValueReceived] = useState<{
    dinheiro: string;
    carCredito: string;
    carDebito: string;
    pix: string;
    cheque: string;
    deposito: string;
    boleto: string;
    carne: string;
    debConta: string;
    total: string;
  }>({
    dinheiro: '',
    carCredito: '',
    carDebito: '',
    pix: '',
    cheque: '',
    deposito: '',
    boleto: '',
    carne: '',
    debConta: '',
    total: '',
  });
  const [qtdReturned, setQtdReturned] = useState<{
    dinheiro: number;
    carCredito: number;
    carDebito: number;
    pix: number;
    cheque: number;
    deposito: number;
    boleto: number;
    carne: number;
    debConta: number;
    total: number;
  }>({
    dinheiro: 0,
    carCredito: 0,
    carDebito: 0,
    pix: 0,
    cheque: 0,
    deposito: 0,
    boleto: 0,
    carne: 0,
    debConta: 0,
    total: 0,
  });
  const [valueReturned, setValueReturned] = useState<{
    dinheiro: string;
    carCredito: string;
    carDebito: string;
    pix: string;
    cheque: string;
    deposito: string;
    boleto: string;
    carne: string;
    debConta: string;
    total: string;
  }>({
    dinheiro: '',
    carCredito: '',
    carDebito: '',
    pix: '',
    cheque: '',
    deposito: '',
    boleto: '',
    carne: '',
    debConta: '',
    total: '',
  });
  const [totalMoney, setTotalMoney] = useState({
    totalPending: '',
    totalReceived: '',
    totalReturned: '',
  });
  const [totalReceipt, setTotalReceipt] = useState({
    totalWorked: '',
  });
  const [text, setText] = useState('');
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [phone1, setPhone1] = useState<string | null>('');
  const [phone2, setPhone2] = useState<string | null>('');
  const [modalVisibleError, setModalVisibleError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPhones, setShowPhones] = useState(false);
  const [relatory, setRelatory] = useState(false);
  const [relatorySummarized, setRelatorySummarized] = useState(false);
  const [relatoryState, setRelatoryState] = useState(false);
  const [relatoryStateDetail, setRelatoryStateDetail] = useState(false);
  const [summarizedReportOptions, setSummarizedReportOptions] = useState(false);
  const [summarizedReportOptionsLocal, setSummarizedReportOptionsLocal] =
    useState(false);
  const [detailReportOptions, setDetailReportOptions] = useState(false);
  const [detailReportOptionsLocal, setDetailReportOptionsLocal] =
    useState(false);
  const [detailReport, setDetailReport] = useState(false);
  const [printers, setPrinters] = useState<IBLEPrinter[]>([{} as IBLEPrinter]);
  const navigation = useNavigation();

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
    loadingInformation();
    report();
  }, []);

  async function fetchTime() {
    try {
      const currentTime = await GetTimeModule.getCurrentTime();
      return currentTime;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchDateTime() {
    try {
      const currentTime = await GetTimeModule.getCurrentDateTime();
      return currentTime;
    } catch (error) {
      console.error(error);
    }
  }

  async function openModalPrinterSelect() {
    setVisibleModalPrinterSelect(true);
  }

  async function loadingInformation() {
    const [
      pendingCounts,
      receivedCounts,
      returnedCounts,
      valuePending,
      valueReceived,
      valueReturned,
      total,
    ] = await Promise.all([
      dataSource
        .getRepository(Movement)
        .createQueryBuilder('movement')
        .select([
          'SUM(CASE WHEN movement.status = :statusPending THEN 1 ELSE 0 END) AS pendingTotal',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :dinheiro THEN 1 ELSE 0 END) AS dinheiro',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :carCredito THEN 1 ELSE 0 END) AS carCredito',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :carDebito THEN 1 ELSE 0 END) AS carDebito',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :pix THEN 1 ELSE 0 END) AS pix',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :cheque THEN 1 ELSE 0 END) AS cheque',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :deposito THEN 1 ELSE 0 END) AS deposito',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :boleto THEN 1 ELSE 0 END) AS boleto',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :carne THEN 1 ELSE 0 END) AS carne',
          'SUM(CASE WHEN movement.status = :statusPending AND movement.cod_tipo_pagamento = :debConta THEN 1 ELSE 0 END) AS debConta',
        ])
        .setParameters({
          statusPending: 0,
          dinheiro: 1,
          carCredito: 2,
          carDebito: 3,
          pix: 4,
          cheque: 5,
          deposito: 6,
          boleto: 7,
          carne: 9,
          debConta: 10,
        })
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder('movement')
        .select([
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) THEN 1 ELSE 0 END) AS receivedTotal',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :dinheiro THEN 1 ELSE 0 END) AS dinheiro',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :carCredito THEN 1 ELSE 0 END) AS carCredito',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :carDebito THEN 1 ELSE 0 END) AS carDebito',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :pix THEN 1 ELSE 0 END) AS pix',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :cheque THEN 1 ELSE 0 END) AS cheque',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :deposito THEN 1 ELSE 0 END) AS deposito',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :boleto THEN 1 ELSE 0 END) AS boleto',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :carne THEN 1 ELSE 0 END) AS carne',
          'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) AND movement.cod_tipo_pagamento = :debConta THEN 1 ELSE 0 END) AS debConta',
        ])
        .setParameters({
          statusReceived: 1,
          statusProcessed: 2,
          dinheiro: 1,
          carCredito: 2,
          carDebito: 3,
          pix: 4,
          cheque: 5,
          deposito: 6,
          boleto: 7,
          carne: 9,
          debConta: 10,
        })
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder('movement')
        .select([
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) THEN 1 ELSE 0 END) AS returnedTotal',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :dinheiro THEN 1 ELSE 0 END) AS dinheiro',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :carCredito THEN 1 ELSE 0 END) AS carCredito',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :carDebito THEN 1 ELSE 0 END) AS carDebito',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :pix THEN 1 ELSE 0 END) AS pix',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :cheque THEN 1 ELSE 0 END) AS cheque',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :deposito THEN 1 ELSE 0 END) AS deposito',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :boleto THEN 1 ELSE 0 END) AS boleto',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :carne THEN 1 ELSE 0 END) AS carne',
          'SUM(CASE WHEN movement.status IN (:statusReturned1, :statusReturned2) AND movement.cod_tipo_pagamento = :debConta THEN 1 ELSE 0 END) AS debConta',
        ])
        .setParameters({
          statusReturned1: 3,
          statusReturned2: 4,
          dinheiro: 1,
          carCredito: 2,
          carDebito: 3,
          pix: 4,
          cheque: 5,
          deposito: 6,
          boleto: 7,
          carne: 9,
          debConta: 10,
        })
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder()
        .select([
          'SUM(CASE WHEN cod_tipo_pagamento = 1 THEN valor_prev ELSE 0 END) AS Dinheiro',
          'SUM(CASE WHEN cod_tipo_pagamento = 2 THEN valor_prev ELSE 0 END) AS CarCredito',
          'SUM(CASE WHEN cod_tipo_pagamento = 3 THEN valor_prev ELSE 0 END) AS CarDebito',
          'SUM(CASE WHEN cod_tipo_pagamento = 4 THEN valor_prev ELSE 0 END) AS Pix',
          'SUM(CASE WHEN cod_tipo_pagamento = 5 THEN valor_prev ELSE 0 END) AS Cheque',
          'SUM(CASE WHEN cod_tipo_pagamento = 6 THEN valor_prev ELSE 0 END) AS Deposito',
          'SUM(CASE WHEN cod_tipo_pagamento = 7 THEN valor_prev ELSE 0 END) AS Boleto',
          'SUM(CASE WHEN cod_tipo_pagamento = 9 THEN valor_prev ELSE 0 END) AS Carne',
          'SUM(CASE WHEN cod_tipo_pagamento = 10 THEN valor_prev ELSE 0 END) AS DebConta',
        ])
        .where('status = :status', {status: 0})
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder()
        .select([
          'SUM(CASE WHEN cod_tipo_pagamento = 1 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Dinheiro',
          'SUM(CASE WHEN cod_tipo_pagamento = 2 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS CarCredito',
          'SUM(CASE WHEN cod_tipo_pagamento = 3 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS CarDebito',
          'SUM(CASE WHEN cod_tipo_pagamento = 4 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Pix',
          'SUM(CASE WHEN cod_tipo_pagamento = 5 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Cheque',
          'SUM(CASE WHEN cod_tipo_pagamento = 6 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Deposito',
          'SUM(CASE WHEN cod_tipo_pagamento = 7 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Boleto',
          'SUM(CASE WHEN cod_tipo_pagamento = 9 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Carne',
          'SUM(CASE WHEN cod_tipo_pagamento = 10 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS DebConta',
        ])
        .setParameter('status', [1, 2])
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder()
        .select([
          'SUM(CASE WHEN cod_tipo_pagamento = 1 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Dinheiro',
          'SUM(CASE WHEN cod_tipo_pagamento = 2 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS CarCredito',
          'SUM(CASE WHEN cod_tipo_pagamento = 3 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS CarDebito',
          'SUM(CASE WHEN cod_tipo_pagamento = 4 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Pix',
          'SUM(CASE WHEN cod_tipo_pagamento = 5 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Cheque',
          'SUM(CASE WHEN cod_tipo_pagamento = 6 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Deposito',
          'SUM(CASE WHEN cod_tipo_pagamento = 7 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Boleto',
          'SUM(CASE WHEN cod_tipo_pagamento = 9 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS Carne',
          'SUM(CASE WHEN cod_tipo_pagamento = 10 AND status IN (:...status) THEN valor_prev ELSE 0 END) AS DebConta',
        ])
        .setParameter('status', [3, 4])
        .getRawOne(),

      dataSource
        .getRepository(Movement)
        .createQueryBuilder()
        .select([
          'SUM(CASE WHEN status IN (:...status1) THEN valor_prev ELSE 0 END) AS totalPending',
          'SUM(CASE WHEN status IN (:...status2) THEN valor_prev ELSE 0 END) AS totalReceived',
          'SUM(CASE WHEN status IN (:...status3) THEN valor_prev ELSE 0 END) AS totalReturned',
        ])
        .setParameters({
          status1: [0],
          status2: [1, 2],
          status3: [3, 4],
        })
        .getRawOne(),
    ]);

    const formatCurrency = value => `R$ ${value.toFixed(2)}`;

    const qtdPending = {
      dinheiro: Number(pendingCounts.dinheiro) || 0,
      carCredito: Number(pendingCounts.carCredito) || 0,
      carDebito: Number(pendingCounts.carDebito) || 0,
      pix: Number(pendingCounts.pix) || 0,
      cheque: Number(pendingCounts.cheque) || 0,
      deposito: Number(pendingCounts.deposito) || 0,
      boleto: Number(pendingCounts.boleto) || 0,
      carne: Number(pendingCounts.carne) || 0,
      debConta: Number(pendingCounts.debConta) || 0,
      total: Number(pendingCounts.pendingTotal) || 0,
    };

    const qtdReceived = {
      dinheiro: Number(receivedCounts.dinheiro) || 0,
      carCredito: Number(receivedCounts.carCredito) || 0,
      carDebito: Number(receivedCounts.carDebito) || 0,
      pix: Number(receivedCounts.pix) || 0,
      cheque: Number(receivedCounts.cheque) || 0,
      deposito: Number(receivedCounts.deposito) || 0,
      boleto: Number(receivedCounts.boleto) || 0,
      carne: Number(receivedCounts.carne) || 0,
      debConta: Number(receivedCounts.debConta) || 0,
      total: Number(receivedCounts.receivedTotal) || 0,
    };

    const qtdReturned = {
      dinheiro: Number(returnedCounts.dinheiro) || 0,
      carCredito: Number(returnedCounts.carCredito) || 0,
      carDebito: Number(returnedCounts.carDebito) || 0,
      pix: Number(returnedCounts.pix) || 0,
      cheque: Number(returnedCounts.cheque) || 0,
      deposito: Number(returnedCounts.deposito) || 0,
      boleto: Number(returnedCounts.boleto) || 0,
      carne: Number(returnedCounts.carne) || 0,
      debConta: Number(returnedCounts.debConta) || 0,
      total: Number(returnedCounts.returnedTotal) || 0,
    };

    const ValuePending = {
      dinheiro: formatCurrency(Number(valuePending.Dinheiro) || 0),
      carCredito: formatCurrency(Number(valuePending.CarCredito) || 0),
      carDebito: formatCurrency(Number(valuePending.CarDebito) || 0),
      pix: formatCurrency(Number(valuePending.Pix) || 0),
      cheque: formatCurrency(Number(valuePending.Cheque) || 0),
      deposito: formatCurrency(Number(valuePending.Deposito) || 0),
      boleto: formatCurrency(Number(valuePending.Boleto) || 0),
      carne: formatCurrency(Number(valuePending.Carne) || 0),
      debConta: formatCurrency(Number(valuePending.DebConta) || 0),
      total: formatCurrency(Number(valuePending.returnedTotal) || 0),
    };

    const ValueReceived = {
      dinheiro: formatCurrency(Number(valueReceived.Dinheiro) || 0),
      carCredito: formatCurrency(Number(valueReceived.CarCredito) || 0),
      carDebito: formatCurrency(Number(valueReceived.CarDebito) || 0),
      pix: formatCurrency(Number(valueReceived.Pix) || 0),
      cheque: formatCurrency(Number(valueReceived.Cheque) || 0),
      deposito: formatCurrency(Number(valueReceived.Deposito) || 0),
      boleto: formatCurrency(Number(valueReceived.Boleto) || 0),
      carne: formatCurrency(Number(valueReceived.Carne) || 0),
      debConta: formatCurrency(Number(valueReceived.DebConta) || 0),
      total: formatCurrency(Number(valueReceived.returnedTotal) || 0),
    };

    const ValueReturned = {
      dinheiro: formatCurrency(Number(valueReturned.Dinheiro) || 0),
      carCredito: formatCurrency(Number(valueReturned.CarCredito) || 0),
      carDebito: formatCurrency(Number(valueReturned.CarDebito) || 0),
      pix: formatCurrency(Number(valueReturned.Pix) || 0),
      cheque: formatCurrency(Number(valueReturned.Cheque) || 0),
      deposito: formatCurrency(Number(valueReturned.Deposito) || 0),
      boleto: formatCurrency(Number(valueReturned.Boleto) || 0),
      carne: formatCurrency(Number(valueReturned.Carne) || 0),
      debConta: formatCurrency(Number(valueReturned.DebConta) || 0),
      total: formatCurrency(Number(valueReturned.returnedTotal) || 0),
    };

    const totalValue = {
      totalPending: formatCurrency(total.totalPending),
      totalReceived: formatCurrency(total.totalReceived),
      totalReturned: formatCurrency(total.totalReturned),
    };

    const totalWorked = {
      totalWorked: formatCurrency(
        total.totalPending + total.totalReceived + total.totalReturned,
      ),
    };

    setQtdReturned(qtdReturned);
    setQtdReceived(qtdReceived);
    setQtdPending(qtdPending);

    setValuePending(ValuePending);
    setValueReceived(ValueReceived);
    setValueReturned(ValueReturned);

    setTotalMoney(totalValue);
    setTotalReceipt(totalWorked);
  }

  function handleReturn() {
    navigation.goBack();
  }

  async function report() {
    setLoading(true);
    await setCurrentLocation();
    const repository = await dataSource
      .getRepository(InstitutionInformation)
      .createQueryBuilder('inform')
      .orderBy('inform.id', 'DESC')
      .getOne();
    setPhone1(repository.Telefone1);
    setPhone2(repository.Telefone2);
    setLoading(false);
  }

  async function finishMovement() {
    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    let formatDateFinish = formatDate(checkDateValue.valuecollected);
    formatDateFinish = formatDateFinish.split('/').reverse().join('-');

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();

    const authToken = authDataFromDb.access_token;

    await api
      .post(
        '/finalizar-movimento',
        {data_movimento: formatDateFinish},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      .then(async function (response) {
        Alert.alert('Finalizar Movimento', 'Movimento Finalizado');
        await clearDatabase();
        dataSource
          .destroy()
          .then(() =>
            console.log('Conexão com o banco de dados Finalizada com sucesso.'),
          )
          .catch(error => console.error('Deu error: ', error));
        BackHandler.exitApp();
      })
      .catch(function (error) {
        console.error('Erro aqui', error);
      });
  }

  async function setCurrentLocation() {
    const coords = await getCurrentLocation();
    setLocation(coords);
  }

  async function openModal() {
    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    await api
      .get('/turno', {
        headers: {
          Authorization: `Bearer ${authDataFromDb.access_token}`,
        },
      })
      .then(async function (response) {
        const responseDataHoraAberturaSistema =
          response.data[0].HoraAberturaSistema;
        const responseDataHoraFechamentoSistema =
          response.data[0].HoraFechamentoSistema;
        if (
          timeFormatted >= responseDataHoraAberturaSistema &&
          timeFormatted <= responseDataHoraFechamentoSistema
        ) {
          const movementRepository = dataSource.getRepository(MovementEntities);
          const movementDataFrom = await movementRepository
            .createQueryBuilder('movement')
            .where('movement.devolutivaMen = :devolutivaMen', {
              devolutivaMen: 1,
            })
            .orWhere('movement.obsMen = :obsMen', {obsMen: 1})
            .getMany();
          const checkDateValue = await dataSource
            .getRepository(DateMovementChosen)
            .createQueryBuilder('dateMovementChosen')
            .orderBy('dateMovementChosen.id', 'DESC')
            .getOne();
          const checkAccountValue = await dataSource
            .getRepository(AccountsBank)
            .createQueryBuilder('checkAccount')
            .orderBy('checkAccount.id', 'DESC')
            .getOne();
          const authDataFromDb = await dataSource
            .getRepository(Auth)
            .createQueryBuilder('auth')
            .orderBy('auth.id', 'DESC')
            .getOne();
          const authToken = authDataFromDb.access_token;

          setLoading(true);
          let formatDateFinish = formatDate(checkDateValue.valuecollected);
          formatDateFinish = formatDateFinish.split('/').reverse().join('-');
          await api
            .post(
              '/movimento',
              {
                data_movimento: formatDateFinish,
                conta_bancaria: Number(checkAccountValue.label),
                localizacao: {
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                },
                recibos: JSON.parse(JSON.stringify(movementDataFrom)),
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            )
            .then(async function (response) {
              setLoading(false);
              setModalVisible(true);
            })
            .catch(function (error) {
              setLoading(false);
              Alert.alert(
                'Sincronização não concluida',
                'Não foi possível concluir a sincronização. Verifique a sua conexão de internet ou entre em contato com o suporte.',
              );
            });
        } else {
          setModalError({
            Title: 'Fora do horário de expediente',
            Message: 'Entre em contato com sua coordenação.',
          });
          setModalVisibleError(true);
        }
      });
  }

  async function sendWhatsapp() {
    const time = await fetchTime();
        let reportPending = `\nPendente (${qtdPending.total})\n\n${
          qtdPending.dinheiro !== 0 && valuePending.dinheiro !== 'R$ 0,00'
            ? `Dinheiro (${qtdPending.dinheiro}) - ${valuePending.dinheiro}\n`
            : ''
        }${
          qtdPending.carCredito !== 0 && valuePending.carCredito !== 'R$ 0,00'
            ? `Cartao de crédito (${qtdPending.carCredito}) - ${valuePending.carCredito}\n`
            : ''
        }${
          qtdPending.carDebito !== 0 && valuePending.carDebito !== 'R$ 0,00'
            ? `Cartão débito (${qtdPending.carDebito}) - ${valuePending.carDebito}\n`
            : ''
        }${
          qtdPending.deposito !== 0 && valuePending.deposito !== 'R$ 0,00'
            ? `Depósito (${qtdPending.deposito}) - ${valuePending.deposito}\n`
            : ''
        }${
          qtdPending.cheque !== 0 && valuePending.cheque !== 'R$ 0,00'
            ? `Cheque (${qtdPending.cheque}) - ${valuePending.cheque}\n`
            : ''
        }${
          qtdPending.pix !== 0 && valuePending.pix !== 'R$ 0,00'
            ? `PIX (${qtdPending.pix}) - ${valuePending.pix}\n`
            : ''
        }${
          qtdPending.boleto !== 0 && valuePending.boleto !== 'R$ 0,00'
            ? `Boleto (${qtdPending.boleto}) - ${valuePending.boleto}\n`
            : ''
        }${
          qtdPending.debConta !== 0 && valuePending.debConta !== 'R$ 0,00'
            ? `Débito em Conta (${qtdPending.debConta}) - ${valuePending.debConta}\n`
            : ''
        }${
          qtdPending.carne !== 0 && valuePending.carne !== 'R$ 0,00'
            ? `Carnê (${qtdPending.carne}) - ${valuePending.carne}\n`
            : ''
        }`;
    
        let reportReturned = `\nDevolvido (${qtdReturned.total})\n\n${
          qtdReturned.dinheiro !== 0 && valueReturned.dinheiro !== 'R$ 0,00'
            ? `Dinheiro (${qtdReturned.dinheiro}) - ${valueReturned.dinheiro}\n`
            : ''
        }${
          qtdReturned.carCredito !== 0 && valueReturned.carCredito !== 'R$ 0,00'
            ? `Cartão de crédito (${qtdReturned.carCredito}) - ${valueReturned.carCredito}\n`
            : ''
        }${
          qtdReturned.carDebito !== 0 && valueReturned.carDebito !== 'R$ 0,00'
            ? `Cartão débito (${qtdReturned.carDebito}) - ${valueReturned.carDebito}\n`
            : ''
        }${
          qtdReturned.deposito !== 0 && valueReturned.deposito !== 'R$ 0,00'
            ? `Depósito (${qtdReturned.deposito}) - ${valueReturned.deposito}\n`
            : ''
        }${
          qtdReturned.cheque !== 0 && valueReturned.cheque !== 'R$ 0,00'
            ? `Cheque (${qtdReturned.cheque}) - ${valueReturned.cheque}\n`
            : ''
        }${
          qtdReturned.pix !== 0 && valueReturned.pix !== 'R$ 0,00'
            ? `PIX (${qtdReturned.pix}) - ${valueReturned.pix}\n`
            : ''
        }${
          qtdReturned.boleto !== 0 && valueReturned.boleto !== 'R$ 0,00'
            ? `Boleto (${qtdReturned.boleto}) - ${valueReturned.boleto}\n`
            : ''
        }${
          qtdReturned.debConta !== 0 && valueReturned.debConta !== 'R$ 0,00'
            ? `Débito em Conta (${qtdReturned.debConta}) - ${valueReturned.debConta}\n`
            : ''
        }${
          qtdReturned.carne !== 0 && valueReturned.carne !== 'R$ 0,00'
            ? `Carnê (${qtdReturned.carne}) - ${valueReturned.carne}\n`
            : ''
        }`;
    
        let reportReceived = `\nRecebido (${qtdReceived.total})\n\n${
          qtdReceived.dinheiro !== 0 && valueReceived.dinheiro !== 'R$ 0,00'
            ? `Dinheiro (${qtdReceived.dinheiro}) - ${valueReceived.dinheiro}\n`
            : ''
        }${
          qtdReceived.carCredito !== 0 && valueReceived.carCredito !== 'R$ 0,00'
            ? `Cartão de crédito (${qtdReceived.carCredito}) - ${valueReceived.carCredito}\n`
            : ''
        }${
          qtdReceived.carDebito !== 0 && valueReceived.carDebito !== 'R$ 0,00'
            ? `Cartão débito (${qtdReceived.carDebito}) - ${valueReceived.carDebito}\n`
            : ''
        }${
          qtdReceived.deposito !== 0 && valueReceived.deposito !== 'R$ 0,00'
            ? `Depósito (${qtdReceived.deposito}) - ${valueReceived.deposito}\n`
            : ''
        }${
          qtdReceived.cheque !== 0 && valueReceived.cheque !== 'R$ 0,00'
            ? `Cheque (${qtdReceived.cheque}) - ${valueReceived.cheque}\n`
            : ''
        }${
          qtdReceived.pix !== 0 && valueReceived.pix !== 'R$ 0,00'
            ? `PIX (${qtdReceived.pix}) - ${valueReceived.pix}\n`
            : ''
        }${
          qtdReceived.boleto !== 0 && valueReceived.boleto !== 'R$ 0,00'
            ? `Boleto (${qtdReceived.boleto}) - ${valueReceived.boleto}\n`
            : ''
        }${
          qtdReceived.debConta !== 0 && valueReceived.debConta !== 'R$ 0,00'
            ? `Débito em conta (${qtdReceived.debConta}) - ${valueReceived.debConta}\n`
            : ''
        }${
          qtdReceived.carne !== 0 && valueReceived.carne !== 'R$ 0,00'
            ? `Carnê (${qtdReceived.carne}) - ${valueReceived.carne}\n`
            : ''
        }`;
    
        let TotalReceived = `\nTOTAL RECEBIDO (${qtdReceived.total}) - ${totalMoney.totalReceived}`;
        let TotalWorked = `\nTOTAL TRABALHADO (${
          qtdPending.total + qtdReturned.total + qtdReceived.total
        }) - ${totalReceipt.totalWorked}`;    

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    const dateFormatted = formatDate(checkDateValue.valuecollected);
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
    const dateLowString = dateDownload
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');
    const dateLowStringFormatted = formatDateTime(dateLowString);

    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();

    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});
    const nome = messengerData.nome;

    summarizedReport(
      true,
      time,
      dateFormatted,
      nome,
      'Relatório de Finalização',
      time,
      lastInstitutionInfo.cnpj + ' - ' + lastInstitutionInfo.NomeFantasia,
      reportPending,
      reportReturned,
      reportReceived,
      TotalReceived,
      TotalWorked,
    );

    await finishMovement();
  }

  async function sendWhatsappDetailLocal() {
    setLoading(true);
    const dateTime = await fetchDateTime();
    const Movement = await dataSource
      .getRepository(MovementEntities)
      .createQueryBuilder('movement')
      .select([
        'movement.numero_recibo',
        'movement.valor_prev',
        'movement.status',
        'movement.cod_tipo_pagamento',
        'movement.data_baixa',
      ])
      .where('devolutivaMen = 1')
      .getMany();

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    const dateFormatted = formatDate(checkDateValue.valuecollected);

    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();
    const institutionInforma = await dataSource
      .getRepository(Institution)
      .createQueryBuilder('institution')
      .orderBy('institution.id', 'DESC')
      .getOne();

    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});

    detailedReport(
      true,
      Movement,
      dateFormatted,
      messengerData,
      institutionInforma,
      dateTime,
      'Relatório Detalhado Local - Rec. e Dev.',
      dateTime,
      lastInstitutionInfo.cnpj + ' - ' + lastInstitutionInfo.NomeFantasia,
    );
    try {
      setVisibleModal(false);
      setLoading(false);
    } catch (error) {
      setModalError({
        Title: 'Impressão',
        Message: 'Não foi possivel realizar a impressão',
      });
      setLoading(false);
      setModalVisibleError(true);
    }
  }

  async function sendWhatsappDetailSever() {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      setModalError({
        Title: 'Erro de conexão',
        Message: 'Verifique sua conexão com a internet.',
      });
      setModalVisibleError(true);
      setVisibleModal(false);
      setLoading(false);
      return;
    }

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();

    let formatDateFinish = formatDate(checkDateValue.valuecollected);
    formatDateFinish = formatDateFinish.split('/').reverse().join('-');

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();

    const institutionInforma = await dataSource
      .getRepository(Institution)
      .createQueryBuilder('institution')
      .orderBy('institution.id', 'DESC')
      .getOne();

    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});

    const authToken = authDataFromDb.access_token;

    await api
      .get('/relatorio_detalhado', {
        params: {datamovimento: formatDateFinish, statusWhats: true},
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(async function (response) {
        detailedReportServer(
          true,
          response.data.movements,
          response.data.dateFormatted,
          response.data.messengerData,
          institutionInforma,
          response.data.dateTime,
          'Relatório Detalhado Servidor - Rec. e Dev.',
          response.data.dateTime,
          lastInstitutionInfo.cnpj + ' - ' + lastInstitutionInfo.NomeFantasia,
        );
        setVisibleModal(false);
        setLoading(false);
      })
      .catch(async function (error) {
        console.error(error.message);
        if (error.response) {
          setModalError({
            Title: 'Erro ao gerar relatório',
            Message: 'Verifique com sua instituição e com o suporte.',
          });
          setModalVisibleError(true);
          setVisibleModal(false);
        }
      });
  }

  async function sendWhatsappSummarizedLocal() {
    const time = await fetchTime();
    let reportPending = `\nPendente (${qtdPending.total})\n\n${
      qtdPending.dinheiro !== 0 && valuePending.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdPending.dinheiro}) - ${valuePending.dinheiro}\n`
        : ''
    }${
      qtdPending.carCredito !== 0 && valuePending.carCredito !== 'R$ 0,00'
        ? `Cartao de crédito (${qtdPending.carCredito}) - ${valuePending.carCredito}\n`
        : ''
    }${
      qtdPending.carDebito !== 0 && valuePending.carDebito !== 'R$ 0,00'
        ? `Cartão débito (${qtdPending.carDebito}) - ${valuePending.carDebito}\n`
        : ''
    }${
      qtdPending.deposito !== 0 && valuePending.deposito !== 'R$ 0,00'
        ? `Depósito (${qtdPending.deposito}) - ${valuePending.deposito}\n`
        : ''
    }${
      qtdPending.cheque !== 0 && valuePending.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdPending.cheque}) - ${valuePending.cheque}\n`
        : ''
    }${
      qtdPending.pix !== 0 && valuePending.pix !== 'R$ 0,00'
        ? `PIX (${qtdPending.pix}) - ${valuePending.pix}\n`
        : ''
    }${
      qtdPending.boleto !== 0 && valuePending.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdPending.boleto}) - ${valuePending.boleto}\n`
        : ''
    }${
      qtdPending.debConta !== 0 && valuePending.debConta !== 'R$ 0,00'
        ? `Débito em Conta (${qtdPending.debConta}) - ${valuePending.debConta}\n`
        : ''
    }${
      qtdPending.carne !== 0 && valuePending.carne !== 'R$ 0,00'
        ? `Carnê (${qtdPending.carne}) - ${valuePending.carne}\n`
        : ''
    }`;

    let reportReturned = `\nDevolvido (${qtdReturned.total})\n\n${
      qtdReturned.dinheiro !== 0 && valueReturned.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdReturned.dinheiro}) - ${valueReturned.dinheiro}\n`
        : ''
    }${
      qtdReturned.carCredito !== 0 && valueReturned.carCredito !== 'R$ 0,00'
        ? `Cartão de crédito (${qtdReturned.carCredito}) - ${valueReturned.carCredito}\n`
        : ''
    }${
      qtdReturned.carDebito !== 0 && valueReturned.carDebito !== 'R$ 0,00'
        ? `Cartão débito (${qtdReturned.carDebito}) - ${valueReturned.carDebito}\n`
        : ''
    }${
      qtdReturned.deposito !== 0 && valueReturned.deposito !== 'R$ 0,00'
        ? `Depósito (${qtdReturned.deposito}) - ${valueReturned.deposito}\n`
        : ''
    }${
      qtdReturned.cheque !== 0 && valueReturned.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdReturned.cheque}) - ${valueReturned.cheque}\n`
        : ''
    }${
      qtdReturned.pix !== 0 && valueReturned.pix !== 'R$ 0,00'
        ? `PIX (${qtdReturned.pix}) - ${valueReturned.pix}\n`
        : ''
    }${
      qtdReturned.boleto !== 0 && valueReturned.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdReturned.boleto}) - ${valueReturned.boleto}\n`
        : ''
    }${
      qtdReturned.debConta !== 0 && valueReturned.debConta !== 'R$ 0,00'
        ? `Débito em Conta (${qtdReturned.debConta}) - ${valueReturned.debConta}\n`
        : ''
    }${
      qtdReturned.carne !== 0 && valueReturned.carne !== 'R$ 0,00'
        ? `Carnê (${qtdReturned.carne}) - ${valueReturned.carne}\n`
        : ''
    }`;

    let reportReceived = `\nRecebido (${qtdReceived.total})\n\n${
      qtdReceived.dinheiro !== 0 && valueReceived.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdReceived.dinheiro}) - ${valueReceived.dinheiro}\n`
        : ''
    }${
      qtdReceived.carCredito !== 0 && valueReceived.carCredito !== 'R$ 0,00'
        ? `Cartão de crédito (${qtdReceived.carCredito}) - ${valueReceived.carCredito}\n`
        : ''
    }${
      qtdReceived.carDebito !== 0 && valueReceived.carDebito !== 'R$ 0,00'
        ? `Cartão débito (${qtdReceived.carDebito}) - ${valueReceived.carDebito}\n`
        : ''
    }${
      qtdReceived.deposito !== 0 && valueReceived.deposito !== 'R$ 0,00'
        ? `Depósito (${qtdReceived.deposito}) - ${valueReceived.deposito}\n`
        : ''
    }${
      qtdReceived.cheque !== 0 && valueReceived.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdReceived.cheque}) - ${valueReceived.cheque}\n`
        : ''
    }${
      qtdReceived.pix !== 0 && valueReceived.pix !== 'R$ 0,00'
        ? `PIX (${qtdReceived.pix}) - ${valueReceived.pix}\n`
        : ''
    }${
      qtdReceived.boleto !== 0 && valueReceived.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdReceived.boleto}) - ${valueReceived.boleto}\n`
        : ''
    }${
      qtdReceived.debConta !== 0 && valueReceived.debConta !== 'R$ 0,00'
        ? `Débito em conta (${qtdReceived.debConta}) - ${valueReceived.debConta}\n`
        : ''
    }${
      qtdReceived.carne !== 0 && valueReceived.carne !== 'R$ 0,00'
        ? `Carnê (${qtdReceived.carne}) - ${valueReceived.carne}\n`
        : ''
    }`;

    let TotalReceived = `\nTOTAL RECEBIDO (${qtdReceived.total}) - ${totalMoney.totalReceived}`;
    let TotalWorked = `\nTOTAL TRABALHADO (${
      qtdPending.total + qtdReturned.total + qtdReceived.total
    }) - ${totalReceipt.totalWorked}`;

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    const dateFormatted = formatDate(checkDateValue.valuecollected);

    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();

    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});
    const nome = messengerData.nome;

    summarizedReport(
      true,
      time,
      dateFormatted,
      nome,
      'Relatório resumido',
      time,
      lastInstitutionInfo.cnpj + ' - ' + lastInstitutionInfo.NomeFantasia,
      reportPending,
      reportReturned,
      reportReceived,
      TotalReceived,
      TotalWorked,
    );

    setShowPhones(false);
    setRelatory(false);
    setRelatoryState(false);
    setRelatoryStateDetail(false);
  }

  async function sendWhatsappummarizedSever() {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      setModalError({
        Title: 'Erro de conexão',
        Message: 'Verifique sua conexão com a internet.',
      });
      setModalVisibleError(true);
      setVisibleModal(false);
      setLoading(false);
      return;
    }

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();

    let formatDateFinish = formatDate(checkDateValue.valuecollected);
    formatDateFinish = formatDateFinish.split('/').reverse().join('-');

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});

    const authToken = authDataFromDb.access_token;

    await api
      .get('/relatorio_resumido', {
        params: {datamovimento: formatDateFinish, statusWhats: true},
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(async function (response) {
        summarizedReport(
          false,
          '',
          formatDateFinish,
          response.data.messengerData,
          'Relatório resumido servidor',
          response.data.dateTimeReport,
          lastInstitutionInfo.cnpj + ' - ' + lastInstitutionInfo.NomeFantasia,
          response.data.reportPending,
          response.data.reportReturned,
          response.data.reportReceived,
        );
        setVisibleModal(false);
        setLoading(false);
      })
      .catch(async function (error) {
        console.error(error.message);
        if (error.response) {
          setModalError({
            Title: 'Erro ao gerar relatório',
            Message: 'Verifique com sua instituição e com o suporte.',
          });
          setModalVisibleError(true);
          setVisibleModal(false);
        }
      });

    setShowPhones(false);
  }

  async function reportFinalizeMovement(withoutFinalization: boolean) {
    const time = await fetchTime();
    let reportPending = `\nPendente (${qtdPending.total})\n\n${
      qtdPending.dinheiro !== 0 && valuePending.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdPending.dinheiro}) - ${formatMoneyNumber(
            valuePending.dinheiro,
          )}\n`
        : ''
    }${
      qtdPending.carCredito !== 0 && valuePending.carCredito !== 'R$ 0,00'
        ? `Cartao de credito (${qtdPending.carCredito}) - ${formatMoneyNumber(
            valuePending.carCredito,
          )}\n`
        : ''
    }${
      qtdPending.carDebito !== 0 && valuePending.carDebito !== 'R$ 0,00'
        ? `Cartao debito (${qtdPending.carDebito}) - ${formatMoneyNumber(
            valuePending.carDebito,
          )}\n`
        : ''
    }${
      qtdPending.deposito !== 0 && valuePending.deposito !== 'R$ 0,00'
        ? `Deposito (${qtdPending.deposito}) - ${formatMoneyNumber(
            valuePending.deposito,
          )}\n`
        : ''
    }${
      qtdPending.cheque !== 0 && valuePending.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdPending.cheque}) - ${formatMoneyNumber(
            valuePending.cheque,
          )}\n`
        : ''
    }${
      qtdPending.pix !== 0 && valuePending.pix !== 'R$ 0,00'
        ? `PIX (${qtdPending.pix}) - ${formatMoneyNumber(valuePending.pix)}\n`
        : ''
    }${
      qtdPending.boleto !== 0 && valuePending.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdPending.boleto}) - ${formatMoneyNumber(
            valuePending.boleto,
          )}\n`
        : ''
    }${
      qtdPending.debConta !== 0 && valuePending.debConta !== 'R$ 0,00'
        ? `Debito em Conta (${qtdPending.debConta}) - ${formatMoneyNumber(
            valuePending.debConta,
          )}\n`
        : ''
    }${
      qtdPending.carne !== 0 && valuePending.carne !== 'R$ 0,00'
        ? `Carne (${qtdPending.carne}) - ${formatMoneyNumber(
            valuePending.carne,
          )}\n`
        : ''
    }`;

    let reportReturned = `\nDevolvido (${qtdReturned.total})\n\n${
      qtdReturned.dinheiro !== 0 && valueReturned.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdReturned.dinheiro}) - ${formatMoneyNumber(
            valueReturned.dinheiro,
          )}\n`
        : ''
    }${
      qtdReturned.carCredito !== 0 && valueReturned.carCredito !== 'R$ 0,00'
        ? `Cartao de credito (${qtdReturned.carCredito}) - ${formatMoneyNumber(
            valueReturned.carCredito,
          )}\n`
        : ''
    }${
      qtdReturned.carDebito !== 0 && valueReturned.carDebito !== 'R$ 0,00'
        ? `Cartao debito (${qtdReturned.carDebito}) - ${formatMoneyNumber(
            valueReturned.carDebito,
          )}\n`
        : ''
    }${
      qtdReturned.deposito !== 0 && valueReturned.deposito !== 'R$ 0,00'
        ? `Deposito (${qtdReturned.deposito}) - ${formatMoneyNumber(
            valueReturned.deposito,
          )}\n`
        : ''
    }${
      qtdReturned.cheque !== 0 && valueReturned.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdReturned.cheque}) - ${formatMoneyNumber(
            valueReturned.cheque,
          )}\n`
        : ''
    }${
      qtdReturned.pix !== 0 && valueReturned.pix !== 'R$ 0,00'
        ? `PIX (${qtdReturned.pix}) - ${formatMoneyNumber(valueReturned.pix)}\n`
        : ''
    }${
      qtdReturned.boleto !== 0 && valueReturned.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdReturned.boleto}) - ${formatMoneyNumber(
            valueReturned.boleto,
          )}\n`
        : ''
    }${
      qtdReturned.debConta !== 0 && valueReturned.debConta !== 'R$ 0,00'
        ? `Debito em Conta (${qtdReturned.debConta}) - ${formatMoneyNumber(
            valueReturned.debConta,
          )}\n`
        : ''
    }${
      qtdReturned.carne !== 0 && valueReturned.carne !== 'R$ 0,00'
        ? `Carne (${qtdReturned.carne}) - ${formatMoneyNumber(
            valueReturned.carne,
          )}\n`
        : ''
    }`;

    let reportReceived = `\nRecebido (${qtdReceived.total})\n\n${
      qtdReceived.dinheiro !== 0 && valueReceived.dinheiro !== 'R$ 0,00'
        ? `Dinheiro (${qtdReceived.dinheiro}) - ${formatMoneyNumber(
            valueReceived.dinheiro,
          )}\n`
        : ''
    }${
      qtdReceived.carCredito !== 0 && valueReceived.carCredito !== 'R$ 0,00'
        ? `Cartao de credito (${qtdReceived.carCredito}) - ${formatMoneyNumber(
            valueReceived.carCredito,
          )}\n`
        : ''
    }${
      qtdReceived.carDebito !== 0 && valueReceived.carDebito !== 'R$ 0,00'
        ? `Cartao debito (${qtdReceived.carDebito}) - ${formatMoneyNumber(
            valueReceived.carDebito,
          )}\n`
        : ''
    }${
      qtdReceived.deposito !== 0 && valueReceived.deposito !== 'R$ 0,00'
        ? `Deposito (${qtdReceived.deposito}) - ${formatMoneyNumber(
            valueReceived.deposito,
          )}\n`
        : ''
    }${
      qtdReceived.cheque !== 0 && valueReceived.cheque !== 'R$ 0,00'
        ? `Cheque (${qtdReceived.cheque}) - ${formatMoneyNumber(
            valueReceived.cheque,
          )}\n`
        : ''
    }${
      qtdReceived.pix !== 0 && valueReceived.pix !== 'R$ 0,00'
        ? `PIX (${qtdReceived.pix}) - ${formatMoneyNumber(valueReceived.pix)}\n`
        : ''
    }${
      qtdReceived.boleto !== 0 && valueReceived.boleto !== 'R$ 0,00'
        ? `Boleto (${qtdReceived.boleto}) - ${formatMoneyNumber(
            valueReceived.boleto,
          )}\n`
        : ''
    }${
      qtdReceived.debConta !== 0 && valueReceived.debConta !== 'R$ 0,00'
        ? `Debito em conta (${qtdReceived.debConta}) - ${formatMoneyNumber(
            valueReceived.debConta,
          )}\n`
        : ''
    }${
      qtdReceived.carne !== 0 && valueReceived.carne !== 'R$ 0,00'
        ? `Carne (${qtdReceived.carne}) - ${formatMoneyNumber(
            valueReceived.carne,
          )}\n`
        : ''
    }`;

    let TotalReceived = `\nTOTAL RECEBIDO (${
      qtdReceived.total
    }) - ${formatMoneyNumber(totalMoney.totalReceived)}`;
    let TotalWorked = `\nTOTAL TRABALHADO (${
      qtdPending.total + qtdReturned.total + qtdReceived.total
    }) - ${formatMoneyNumber(totalReceipt.totalWorked)}`;

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    const dateFormatted = formatDate(checkDateValue.valuecollected);
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
    const dateLowString = dateDownload
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');
    const dateLowStringFormatted = formatDateTime(dateLowString);

    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();

    const Text =
      '\nMENSAGEIRO: ' +
      messengerData.nome +
      '\nData do movimento: ' +
      dateFormatted +
      (withoutFinalization == true
        ? ''
        : '\nData de finalizacao: ' + dateLowStringFormatted) +
      (withoutFinalization == true
        ? '\nData/Hora da impressao: ' + time + '\n\nRELATORIO SEM FINALIZACAO'
        : '') +
      '\n\n-------RELATORIO PENDENTE-------\n' +
      reportPending +
      '\n\n------RELATORIO DEVOLVIDO-------\n' +
      reportReturned +
      '\n\n-------RELATORIO RECEBIDO-------\n' +
      reportReceived +
      '\n--------------------------------\n' +
      TotalWorked +
      TotalReceived;
    setText(Text);
    try {
      setVisibleModal(false);
      openModalPrinterSelect();
    } catch (error) {
      setModalError({
        Title: 'Impressão',
        Message: 'Não foi possivel realizar a impressão',
      });
      setModalVisibleError(true);
    }
  }

  async function reportMovimentDetailedServer() {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      setModalError({
        Title: 'Erro de conexão',
        Message: 'Verifique sua conexão com a internet.',
      });
      setModalVisibleError(true);
      setVisibleModal(false);
      setLoading(false);
      return;
    }

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();

    let formatDateFinish = formatDate(checkDateValue.valuecollected);
    formatDateFinish = formatDateFinish.split('/').reverse().join('-');

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();

    const authToken = authDataFromDb.access_token;

    await api
      .get('/relatorio_detalhado', {
        params: {datamovimento: formatDateFinish},
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(async function (response) {
        setText(response.data);
        setVisibleModal(false);
        openModalPrinterSelect();
        setLoading(false);
      })
      .catch(async function (error) {
        console.error(error.message);
        if (error.response) {
          setModalError({
            Title: 'Erro ao gerar relatório',
            Message: 'Verifique com sua instituição e com o suporte.',
          });
          setModalVisibleError(true);
          setVisibleModal(false);
        }
      });
  }

  async function reportMovimentSummarizedServer() {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      setModalError({
        Title: 'Erro de conexão',
        Message: 'Verifique sua conexão com a internet.',
      });
      setModalVisibleError(true);
      setVisibleModal(false);
      setLoading(false);
      return;
    }

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();

    let formatDateFinish = formatDate(checkDateValue.valuecollected);
    formatDateFinish = formatDateFinish.split('/').reverse().join('-');

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();

    const authToken = authDataFromDb.access_token;

    await api
      .get('/relatorio_resumido', {
        params: {datamovimento: formatDateFinish},
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(async function (response) {
        setText(response.data);
        setVisibleModal(false);
        openModalPrinterSelect();
        setLoading(false);
      })
      .catch(async function (error) {
        console.error(error.message);
        if (error.response) {
          setModalError({
            Title: 'Erro ao gerar relatório',
            Message: 'Verifique com sua instituição e com o suporte.',
          });
          setModalVisibleError(true);
          setVisibleModal(false);
        }
      });
  }

  async function reportMovimentDetailed() {
    setLoading(true);
    const dateTime = await fetchDateTime();
    const Movement = await dataSource
      .getRepository(MovementEntities)
      .createQueryBuilder('movement')
      .select([
        'movement.numero_recibo',
        'movement.valor_prev',
        'movement.status',
        'movement.cod_tipo_pagamento',
        'movement.data_baixa',
      ])
      .where('devolutivaMen = 1')
      .getMany();

    const checkDateValue = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .orderBy('dateMovementChosen.id', 'DESC')
      .getOne();
    const dateFormatted = formatDate(checkDateValue.valuecollected);

    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();
    const institutionInforma = await dataSource
      .getRepository(Institution)
      .createQueryBuilder('institution')
      .orderBy('institution.id', 'DESC')
      .getOne();

    const result = detailedReport(
      false,
      Movement,
      dateFormatted,
      messengerData,
      institutionInforma,
      dateTime,
    );
    setText(result);
    try {
      setVisibleModal(false);
      openModalPrinterSelect();
      setLoading(false);
    } catch (error) {
      setModalError({
        Title: 'Impressão',
        Message: 'Não foi possivel realizar a impressão',
      });
      setLoading(false);
      setModalVisibleError(true);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setShowPhones(false);
  };

  async function printOut(mac: string, text: string) {
    await BLEPrinter.init()
      .then(() => {
        // BLEPrinter.closeConn();
        BLEPrinter.connectPrinter(mac).finally(() => {
          setLoading(false);
          BLEPrinter.printText(text);
        });
        if (
          relatorySummarized === true ||
          relatoryStateDetail === true ||
          detailReport === true
        ) {
          setRelatorySummarized(false);
          setVisibleModalPrinterSelect(false);
          setRelatoryStateDetail(false);
          setRelatory(false);
          setRelatoryState(false);
          setDetailReportOptions(false);
          setDetailReportOptionsLocal(false);
          setDetailReport(false);
        } else {
          finishMovement();
        }
      })
      .catch(error => {
        Alert.alert('Erro na impressão:', `${error}`);
      });
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#2974b4',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar
          backgroundColor={
            modalVisible || visibleModalPrinterSelect || modalVisibleError
              ? 'rgba(0, 0, 0, 0.7)'
              : '#2973b44d'
          }
          barStyle="light-content"
        />
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={Styles.Container}>
      <StatusBar
        backgroundColor={
          modalVisible || visibleModalPrinterSelect || modalVisibleError
            ? 'rgba(0, 0, 0, 0.7)'
            : '#2973b44d'
        }
        barStyle="light-content"
      />
      <ScrollView
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}>
        <BackButton onPress={handleReturn} />
        <Pressable
          style={({pressed}) => [Styles.ButtonTitle, {opacity : pressed ? 0.6 : 1}]}
          onPress={() => {
            setRelatory(true);
          }}>
          <Text style={Styles.TitleButton}>Imprimir Relatório</Text>
        </Pressable>
        {/*Recibos Pendentes*/}
        <View style={[Styles.StatusCard, {marginTop: '7%'}]}>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.text}>PENDENTE</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.text}>({qtdPending.total})</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DINHEIRO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.dinheiro}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.dinheiro}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. CRED.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.carCredito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>
                {valuePending.carCredito}
              </Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. DEB.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.carDebito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.carDebito}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>PIX</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.pix}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.pix}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CHEQUE</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.cheque}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.cheque}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEPOSITO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.deposito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.deposito}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>BOLETO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.boleto}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.boleto}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CARNÊ</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.carne}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.carne}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEB. CONTA</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdPending.debConta}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valuePending.debConta}</Text>
            </View>
          </View>
        </View>
        {/*Recibos Devolvidos*/}
        <View style={Styles.StatusCard}>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.text}>DEVOLVIDO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.text}>({qtdReturned.total})</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DINHEIRO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.dinheiro}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.dinheiro}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. CRED.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.carCredito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>
                {valueReturned.carCredito}
              </Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. DEB.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.carDebito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>
                {valueReturned.carDebito}
              </Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>PIX</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.pix}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.pix}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CHEQUE</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.cheque}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.cheque}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEPOSITO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.deposito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.deposito}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>BOLETO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.boleto}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.boleto}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CARNÊ</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.carne}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.carne}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEB. CONTA</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReturned.debConta}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReturned.debConta}</Text>
            </View>
          </View>
        </View>
        {/*Recibos Recebido*/}
        <View style={Styles.StatusCard}>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.text}>RECEBIDO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.text}>({qtdReceived.total})</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DINHEIRO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.dinheiro}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.dinheiro}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. CRED.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.carCredito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>
                {valueReceived.carCredito}
              </Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CAR. DEB.</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.carDebito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>
                {valueReceived.carDebito}
              </Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>PIX</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.pix}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.pix}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CHEQUE</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.cheque}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.cheque}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEPOSITO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.deposito}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.deposito}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>BOLETO</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.boleto}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.boleto}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>CARNÊ</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.carne}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.carne}</Text>
            </View>
          </View>
          <View style={Styles.Caption}>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>DEB. CONTA</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextData}>{qtdReceived.debConta}</Text>
            </View>
            <View style={Styles.Data}>
              <Text style={Styles.TextDataValue}>{valueReceived.debConta}</Text>
            </View>
          </View>
        </View>
        {/* Total Pendente */}
        <View style={Styles.CardTotal}>
          <Text style={Styles.Total}>TOTAL PENDENTE</Text>
          <Text style={Styles.TotalData}>
            {totalMoney.totalPending} ({qtdPending.total})
          </Text>
        </View>
        {/* Total Devolvido */}
        <View style={Styles.CardTotal}>
          <Text style={Styles.Total}>TOTAL DEVOLVIDO</Text>
          <Text style={Styles.TotalData}>
            {totalMoney.totalReturned} ({qtdReturned.total})
          </Text>
        </View>
        {/* Total Recebido */}
        <View style={Styles.CardTotal}>
          <Text style={Styles.Total}>TOTAL RECEBIDO</Text>
          <Text style={Styles.TotalData}>
            {totalMoney.totalReceived} ({qtdReceived.total})
          </Text>
        </View>
        <Pressable
          style={({pressed}) => [Styles.DownReturnButton, {opacity : pressed ? 0.6 : 1}]}
          onPress={() => {
            openModal();
          }}>
          <Text style={Styles.TextDownReturnButton}>Finalizar Movimento</Text>
        </Pressable>
      </ScrollView>
      <ModalError
        Title={modalError.Title}
        Message={modalError.Message}
        status={modalVisibleError}
        onClose={() => setModalVisibleError(false)}
      />
      {/**Modal de telefones */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
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
                      height: '100%',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: '15%',
                    },{opacity : pressed ? 0.6 : 1}]}
                    onPress={() => {
                      setModalVisible(false);
                      reportFinalizeMovement(false);
                    }}>
                    <Image
                      source={require('../../assets/icons/atencao.png')}
                      style={{width: 62, height: 62, marginBottom: '2%'}}
                    />
                    <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                      Finalizar
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({pressed}) => [{
                      backgroundColor: '#2974B4',
                      padding: 10,
                      borderRadius: 15,
                      width: '49%',
                      height: '100%',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }, {opacity : pressed ? 0.6 : 1}]}
                    onPress={() => {
                      sendWhatsapp()
                    }}>
                    <Image
                      source={require('../../assets/icons/whatsapp.png')}
                      style={{width: 62, height: 62, marginBottom: '2%'}}
                    />
                    <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                      Enviar pelo Whatsapp
                    </Text>
                  </Pressable>
                </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/**Modal de impressão */}
      <Modal
        visible={visibleModalPrinterSelect}
        transparent={true}
        onRequestClose={() => setVisibleModalPrinterSelect(false)}
        animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setVisibleModalPrinterSelect(false)}>
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
                    {/** Listagem de impressoras */}
                    {data.item.device_name ||
                    data.item.inner_mac_address != null ? (
                      <Pressable
                        style={({pressed}) => [Styles.Printer, {opacity : pressed ? 0.6 : 1}]}
                        onPress={() => {
                          printOut(data.item.inner_mac_address, text);
                          setLoading(true);
                        }}>
                        <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                          {data.item.device_name}
                        </Text>
                        <Text style={{color: '#FFFFFF', fontWeight: '700'}}>
                          {data.item.inner_mac_address}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={({pressed}) => [Styles.Printer, {opacity : pressed ? 0.6 : 1}]}
                        onPress={() => setVisibleModalPrinterSelect(false)}>
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
                      </Pressable>
                    )}
                  </>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/**Modal de Relatórios */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={relatory}
        onRequestClose={() => {
          setRelatory(false),
            setRelatoryState(false),
            setRelatoryStateDetail(false);
          setDetailReportOptions(false);
          setDetailReportOptionsLocal(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setRelatory(false),
              setRelatoryState(false),
              setRelatoryStateDetail(false);
            setDetailReportOptions(false);
            setDetailReportOptionsLocal(false);
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {relatoryState == false ? (
                  <>
                    {/**Relatório Resumido */}
                    <Pressable
                      style={({pressed}) => [{
                        backgroundColor: '#2974B4',
                        padding: 10,
                        borderRadius: 15,
                        width: '49%',
                        height: '100%',
                        alignContent: 'center',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }, {opacity : pressed ? 0.6 : 1}]}
                      onPress={() => {
                        setRelatoryState(true);
                      }}>
                      <Image
                        source={require('../../assets/iconsWhite/relatorioResumido.png')}
                        style={{width: 118, height: 85}}
                        resizeMode="contain"
                      />
                      <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                        Resumido
                      </Text>
                    </Pressable>
                    {/**Relatório Detalhado */}
                    <Pressable
                      style={({pressed}) => [{
                        backgroundColor: '#2974B4',
                        padding: 10,
                        borderRadius: 15,
                        width: '49%',
                        height: '100%',
                        alignContent: 'center',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginBottom: 10,
                      },{opacity : pressed ? 0.6 : 1}]}
                      onPress={() => {
                        setRelatoryState(true);
                        setRelatoryStateDetail(true);
                      }}>
                      <Image
                        source={require('../../assets/iconsWhite/relatorioDetalhado.png')}
                        style={{width: 70, height: 87}}
                        resizeMode="contain"
                      />
                      <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                        Detalhado
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    {relatoryStateDetail ? (
                      <>
                        {/**Relatório detalhado Local */}
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            marginBottom: 10,
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setRelatory(false);
                            setRelatoryState(false);
                            setRelatoryStateDetail(false);
                            setDetailReportOptions(true);
                            setDetailReportOptionsLocal(true);
                          }}>
                          <Image
                            source={require('../../assets/iconsBlack/mobile.png')}
                            style={{width: 70, height: 87}}
                            resizeMode="contain"
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Local
                          </Text>
                        </Pressable>
                        {/**Relatório detalhado Servidor */}
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            marginBottom: 10,
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setRelatory(false);
                            setRelatoryState(false);
                            setRelatoryStateDetail(false);
                            setDetailReportOptions(true);
                          }}>
                          <Image
                            source={require('../../assets/iconsBlack/globo.png')}
                            style={{width: 70, height: 93}}
                            resizeMode="contain"
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Sistema
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <>
                        {/**Relatório resumido Local */}
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            marginBottom: 10,
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setRelatory(false);
                            setRelatorySummarized(true);
                            setRelatoryState(false);
                            setSummarizedReportOptionsLocal(true);
                            setSummarizedReportOptions(true);
                          }}>
                          <Image
                            source={require('../../assets/iconsBlack/mobile.png')}
                            style={{width: 70, height: 87}}
                            resizeMode="contain"
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Local
                          </Text>
                        </Pressable>
                        {/**Relatório resumido Servidor */}
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            marginBottom: 10,
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setSummarizedReportOptions(true);
                          }}>
                          <Image
                            source={require('../../assets/iconsBlack/globo.png')}
                            style={{width: 70, height: 93}}
                            resizeMode="contain"
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Sistema
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/** Modal Whatsapp Relatório Resumido*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={summarizedReportOptions}
        onRequestClose={() => {
          setSummarizedReportOptions(false),
            setShowPhones(false),
            setRelatory(false),
            setRelatoryState(false),
            setRelatoryStateDetail(false);
          setDetailReportOptions(false);
          setDetailReportOptionsLocal(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSummarizedReportOptions(false),
              setShowPhones(false),
              setRelatory(false),
              setRelatoryState(false),
              setRelatoryStateDetail(false);
            setDetailReportOptions(false);
            setDetailReportOptionsLocal(false);
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <>
                  {summarizedReportOptionsLocal ? (
                    <>
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
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: '15%',
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            reportFinalizeMovement(true);
                          }}>
                          <Image
                            source={require('../../assets/img/impressora.png')}
                            style={{
                              width: 62,
                              height: 62,
                              marginBottom: '2%',
                            }}
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Imprimir
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            sendWhatsappSummarizedLocal();
                          }}>
                          <Image
                            resizeMode="contain"
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
                              textAlign: 'center',
                            }}>
                            Enviar pelo Whatsapp
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
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
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: '15%',
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => reportMovimentSummarizedServer()}>
                          <Image
                            resizeMode="contain"
                            source={require('../../assets/img/impressora.png')}
                            style={{
                              width: 62,
                              height: 62,
                              marginBottom: '2%',
                            }}
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Imprimir
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            sendWhatsappummarizedSever();
                          }}>
                          <Image
                            resizeMode="contain"
                            source={require('../../assets/icons/whatsapp.png')}
                            style={{
                              width: 62,
                              height: 62,
                              marginBottom: '2%',
                            }}
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Enviar pelo Whatsapp
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/** Modal Whatsapp Relatório Detralhado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={detailReportOptions}
        onRequestClose={() => {
          setSummarizedReportOptions(false),
            setShowPhones(false),
            setRelatory(false),
            setRelatoryState(false),
            setRelatoryStateDetail(false);
          setDetailReportOptions(false);
          setDetailReportOptionsLocal(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSummarizedReportOptions(false),
              setShowPhones(false),
              setRelatory(false),
              setRelatoryState(false),
              setRelatoryStateDetail(false);
            setDetailReportOptions(false);
            setDetailReportOptionsLocal(false);
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <>
                  {detailReportOptionsLocal ? (
                    <>
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
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: '15%',
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setDetailReportOptions(false);
                            setDetailReport(true);
                            reportMovimentDetailed();
                          }}>
                          <Image
                            source={require('../../assets/img/impressora.png')}
                            style={{
                              width: 62,
                              height: 62,
                              marginBottom: '2%',
                            }}
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Imprimir
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                          }, {opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            sendWhatsappDetailLocal();
                          }}>
                          <Image
                            resizeMode="contain"
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
                              textAlign: 'center',
                            }}>
                            Enviar pelo Whatsapp
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
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
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: '15%',
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            setDetailReportOptions(false);
                            setDetailReportOptionsLocal(false);
                            setDetailReport(true);
                            reportMovimentDetailedServer();
                          }}>
                          <Image
                            resizeMode="contain"
                            source={require('../../assets/img/impressora.png')}
                            style={{
                              width: 62,
                              height: 62,
                              marginBottom: '2%',
                            }}
                          />
                          <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
                            Imprimir
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({pressed}) => [{
                            backgroundColor: '#2974B4',
                            padding: 10,
                            borderRadius: 15,
                            width: '49%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                          },{opacity : pressed ? 0.6 : 1}]}
                          onPress={() => {
                            sendWhatsappDetailSever();
                          }}>
                          <Image
                            resizeMode="contain"
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
                              textAlign: 'center',
                            }}>
                            Enviar pelo Whatsapp
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
