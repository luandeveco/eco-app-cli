import {
  Text,
  View,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Image,
  ImageBackground,
  //NativeModules,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {api} from '../../services/Api';
import {formatDate} from '../../utils/Formatting/FormattingData';
import {
  requestBluetoothPermissions,
  requestLocationPermission,
} from '../../components/Permissions';
import {getCurrentLocation} from '../../utils/GeoLocation';
import {dataSource} from '../../database/database';
import {Auth} from '../../database/entities/Auth';
import {Movement as MovementEntities} from '../../database/entities/Movement';
import {Styles} from './Style';
import {Messenger} from '../../database/entities/Messenger';
import {Dropdown} from 'react-native-element-dropdown';
import {TextInput} from 'react-native-gesture-handler';
import {DateMovementChosen} from '../../database/entities/DateMovementChosen';
import {accountMovementChosen} from '../../database/entities/accountMovementChosen';
import {DateMovement} from '../../database/entities/DateMovement';
import {AccountsBank} from '../../database/entities/AccountsBank';
import {CountiesMovement} from '../../database/entities/CountiesMovement';
import {SuburbMovement} from '../../database/entities/SuburbMovement';
import {NavigationProp} from '../../routes/Interfaces/NavigationTypes';
import date from '../../assets/iconsWhite/Data.png';
import Account from '../../assets/iconsWhite/contaBancaria.png';
import synchronization from '../../assets/iconsWhite/sincronizar.png';
import Route from '../../assets/iconsWhite/ROTA.png';
import Report from '../../assets/iconsWhite/Relatorio.png';
import ModalError from '../../components/ModalError/ModalError';
import {ModalCheck} from '../../components/ModalCheck/ModalCheck';
import {formatNameOne} from '../../utils/Formatting/FormatNameMensseger';
import {InstitutionInformation} from './../../database/entities/InstitutionInformation';
import {ReceiptSettings} from '../../database/entities/ReceiptSettings';
import {Shift as ShiftEntiti} from '../../database/entities/Shift';
import DeviceInfo from 'react-native-device-info';
//const {VersionModule} = NativeModules;

export function Home() {
  const [dataMovement, setDataMovement] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [dataMovementGeneral, setDataMovementGeneral] = useState([
    {label: '', value: ''},
  ]);
  const [bankAccountGeneral, setBankAccountGeneral] = useState([
    {label: '', value: ''},
  ]);
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [modalCheck, setModalCheck] = useState({Title: '', Message: ''});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCheck, setModalVisibleCheck] = useState(false);
  const [deactivateAccount, setDeactivateAccount] = useState(false);
  const [disableData, setDisableData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [versionName, setVersionName] = useState<string>('');
  const [block, setBlock] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [messenger, setMesseger] = useState<{
    nome: string;
  }>({nome: ''});
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    requestBluetoothPermissionHome();
    loadStorage();
    information();
    searchDataMovement();
    searchBankAccount();
    loadInformation();
    setting();
    Shift();
  }, []);

  useEffect(() => {
    const version = DeviceInfo.getVersion();
    setVersionName(version);
      // .then((version: string) => {
      //   setVersionName(version);
      // })
      // .catch((error: any) => {
      //   console.error(error);
      // });
  }, []);

  async function Block(OpeningTimeSystem: string, ClosingTimeSystem: string) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    if (timeFormatted >= OpeningTimeSystem && timeFormatted <= ClosingTimeSystem) {
      setBlock(true);
    } else {
      clock();
    }
  }

  async function Shift() {
    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    await api
      .get('/turno', {
        headers: {
          Authorization: `Bearer ${authDataFromDb.access_token}`,
        },
      })
      .then(async function (response) {
        const responseDataHoraAberturaSistema = response.data[0].HoraAberturaSistema;
        const responseDataHoraFechamentoSistema = response.data[0].HoraFechamentoSistema;

        const shiftRepository = dataSource.getRepository(ShiftEntiti);
        const existingRecord = await shiftRepository
          .createQueryBuilder('shift')
          .where('shift.HoraAberturaSistema = :horaAbertura', {
            horaAbertura: responseDataHoraAberturaSistema,
          })
          .andWhere('shift.HoraFechamentoSistema = :horaFechamento', {
            horaFechamento: responseDataHoraFechamentoSistema,
          })
          .getOne();

        if (existingRecord) {
          existingRecord.HoraAberturaSistema = responseDataHoraAberturaSistema;
          existingRecord.HoraFechamentoSistema = responseDataHoraFechamentoSistema;

          await shiftRepository.save(existingRecord);
        } else {
          const newRecord = shiftRepository.create({
            HoraAberturaSistema: responseDataHoraAberturaSistema,
            HoraFechamentoSistema: responseDataHoraFechamentoSistema,
          });

          await shiftRepository.save(newRecord);
        }
        Block(
          responseDataHoraAberturaSistema,
          responseDataHoraFechamentoSistema,
        );
      })
      .catch(async function (error) {
        const ShiftDate = await dataSource
          .getRepository(ShiftEntiti)
          .createQueryBuilder('Shift')
          .orderBy('Shift.id', 'DESC')
          .getOne();
        Block(ShiftDate.HoraAberturaSistema, ShiftDate.HoraFechamentoSistema);
      });
  }

  async function setting() {
    const check = await dataSource
      .getRepository(ReceiptSettings)
      .createQueryBuilder('Receipt')
      .orderBy('Receipt.id', 'DESC')
      .getOne();
    if (check?.SummaryReceipt == undefined) {
      const ReceiptCheck = new ReceiptSettings();
      ReceiptCheck.SummaryReceipt = true;
      ReceiptCheck.AssemblyNew = false;
      ReceiptCheck.AssemblyOld = true;
      ReceiptCheck.sizeFont = 16;
      await dataSource.getRepository(ReceiptSettings).save(ReceiptCheck);
    }
  }

  async function information() {
    const messengerData = await dataSource
      .getRepository(Messenger)
      .createQueryBuilder('messenger')
      .orderBy('messenger.id', 'DESC')
      .getOne();
    setMesseger({nome: messengerData.nome});
  }

  async function searchDataMovement() {
    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    await api
      .get('/data_movimento', {
        headers: {
          Authorization: `Bearer ${authDataFromDb.access_token}`,
        },
      })
      .then(async function (response) {
        setDataMovementGeneral(
          response.data.map((r: {DATA_MOVIMENTO: Date | string}) => ({
            label: formatDate(r.DATA_MOVIMENTO),
            value: r.DATA_MOVIMENTO,
          })),
        );
      })
      .catch(function (error) {
        console.error(JSON.parse(JSON.stringify(error)));
      });
  }

  async function searchBankAccount() {
    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    await api
      .get('/conta_bancaria', {
        headers: {
          Authorization: `Bearer ${authDataFromDb.access_token}`,
        },
      })
      .then(async function (response) {
        setBankAccountGeneral(
          response.data.map((r: {Id; CONTA}) => ({
            label: r.CONTA,
            value: r.Id,
          })),
        );
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  }

  async function requestBluetoothPermissionHome() {
    try {
      await requestBluetoothPermissions();
    } catch (error) {
      console.error('Erro ao obter permissão Bluetooth: ', error);
    }
  }

  async function requestLocationPermissionsHome() {
    try {
      const coords = await requestLocationPermission();
      //Atualiza o estado 'location' com as coordenadas obtidas, se estiverem disponíveis
      if (coords) {
        setLocation(coords);
      }
    } catch (error) {
      console.error('Error ao obter permissão de localização: ', error);
    }
  }

  async function setCurrentLocation() {
    try {
      const currentPosition = await getCurrentLocation();
      setLocation(currentPosition);
    } catch (error) {
      console.error('Error ao obter permissão de localização: ', error);
    }
  }

  async function loadStorage() {
    const date_Movement = await dataSource
      .getRepository(DateMovementChosen)
      .createQueryBuilder('dateMovementChosen')
      .select('dateMovementChosen.valuecollected')
      .getOne();
    const accountMovementChosenSelect = dataSource.getRepository(
      accountMovementChosen,
    );
    const accountMovementChosenDB = await accountMovementChosenSelect
      .createQueryBuilder('dateMovementChosen')
      .select('dateMovementChosen.valuecollected')
      .getOne();
    const checkDateGeneralSelect = await dataSource
      .getRepository(DateMovement)
      .find();
    const checkAccountGeneral = await dataSource
      .getRepository(AccountsBank)
      .find();
    setCurrentLocation();
    setLoading(false);
    requestLocationPermissionsHome();
    if (date_Movement != null) {
      setDataMovement(date_Movement.valuecollected);
      setBankAccount(accountMovementChosenDB?.valuecollected.toString());
      setBankAccountGeneral(JSON.parse(JSON.stringify(checkAccountGeneral)));
      setDataMovementGeneral(
        JSON.parse(JSON.stringify(checkDateGeneralSelect)),
      );
      setLoading(false);
      setDeactivateAccount(true);
      setDisableData(true);
    }
  }

  async function loadInformation() {
    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});
    await api
      .get('/informacao_instituicao', {
        headers: {
          Authorization: `Bearer ${authDataFromDb.access_token}`,
        },
      })
      .then(async response => {
        const responseData = response.data[0];
        const tel1 = responseData.Telefones[0]
          ? responseData.Telefones[0].Telefone1
          : null;
        const tel2 = responseData.Telefones[1]
          ? responseData.Telefones[1].Telefone2
          : null;
        const tel3 = responseData.Telefones[2]
          ? responseData.Telefones[2].Telefone3
          : null;

        if (!lastInstitutionInfo) {
          const ins = new InstitutionInformation();
          ins.cnpj = responseData.CNPJ;
          ins.RazaoSocial = responseData.RazaoSocial;
          ins.NomeFantasia = responseData.NomeFantasia;
          ins.Sigla = responseData.Sigla;
          ins.Email = responseData.Email;
          ins.Telefone1 = tel1;
          ins.Telefone2 = tel2;
          ins.Telefone3 = tel3;
          ins.EnderecoCEP = responseData.EnderecoCEP;
          ins.EnderecoNumero = responseData.EnderecoNumero;
          ins.EnderecoComplemento = responseData.EnderecoComplemento;
          ins.NumeroSuporte = responseData.NumeroSuporte;
          const repository = await dataSource.getRepository(
            InstitutionInformation,
          );
          await repository.save(ins);
        } else {
          lastInstitutionInfo.cnpj = responseData.CNPJ;
          lastInstitutionInfo.RazaoSocial = responseData.RazaoSocial;
          lastInstitutionInfo.NomeFantasia = responseData.NomeFantasia;
          lastInstitutionInfo.Sigla = responseData.Sigla;
          lastInstitutionInfo.Email = responseData.Email;
          lastInstitutionInfo.Telefone1 = tel1;
          lastInstitutionInfo.Telefone2 = tel2;
          lastInstitutionInfo.Telefone3 = tel3;
          lastInstitutionInfo.EnderecoCEP = responseData.EnderecoCEP;
          lastInstitutionInfo.EnderecoNumero = responseData.EnderecoNumero;
          lastInstitutionInfo.EnderecoComplemento =
            responseData.EnderecoComplemento;
          lastInstitutionInfo.NumeroSuporte = responseData.NumeroSuporte;
          const repository = await dataSource.getRepository(
            InstitutionInformation,
          );
          await repository.save(lastInstitutionInfo);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function handleMovimento() {
    setLoading(true);

    const authDataFromDb = await dataSource
      .getRepository(Auth)
      .createQueryBuilder('auth')
      .orderBy('auth.id', 'DESC')
      .getOne();
    const authToken = authDataFromDb.access_token;
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
          if (location != undefined) {
            if (disableData == false && dataMovement == '') {
              setLoading(false);
              setModalError({
                Title: 'Sincronização não concluída',
                Message: 'Você precisa selecionar um movimento',
              });
              setModalVisible(true);
            } else if (deactivateAccount == false && bankAccount == '') {
              setLoading(false);
              setModalError({
                Title: 'Sincronização não concluída',
                Message: 'Você precisa selecionar uma conta',
              });
              setModalVisible(true);
            } else {
              setLoading(true);
              await api
                .post(
                  '/movimento',
                  {
                    data_movimento: dataMovement,
                    conta_bancaria: bankAccount,
                    localizacao: {
                      latitude: location?.latitude,
                      longitude: location?.longitude,
                    },
                    recibos:
                      movementDataFrom != null
                        ? JSON.parse(JSON.stringify(movementDataFrom))
                        : null,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                    },
                  },
                )
                .then(async function (response) {
                  const responseData = response.data.movimento;
                  const responseDataCounties = response.data.municipios;
                  const responseDataSuburb = response.data.bairros;
                  await Promise.all(
                    responseDataCounties.map(async item => {
                      // Verifica se o registro já existe na tabela CountiesMovement
                      const existingCounty = await CountiesMovement.findOne({
                        where: {descricao: item.descricao},
                      });
                      if (!existingCounty) {
                        const countiesMovement = new CountiesMovement();
                        countiesMovement.descricao = item.Nome;
                        await dataSource
                          .getRepository(CountiesMovement)
                          .save(countiesMovement);
                      }
                    }),
                  );

                  await Promise.all(
                    responseDataSuburb.map(async item => {
                      const existingSuburb = await SuburbMovement.findOne({
                        where: {descricao: item.descricao},
                      });
                      if (!existingSuburb) {
                        const suburbMovement = new SuburbMovement();
                        suburbMovement.descricaoCounties =
                          item.descricaoCounties;
                        suburbMovement.descricao = item.descricao;
                        await dataSource
                          .getRepository(SuburbMovement)
                          .save(suburbMovement);
                      }
                    }),
                  );

                  await Promise.all(
                    responseData.map(async item => {
                      // Verifica se o movimento já existe no banco de dados local
                      const existingMovement = await movementRepository.findOne(
                        {
                          where: {numero_recibo: item.numero_recibo},
                        },
                      );
                      // Se não existir, registra o movimento no banco de dados
                      if (!existingMovement) {
                        const movement = new MovementEntities();
                        movement.numero_recibo = item.numero_recibo;
                        movement.cod_contribuinte = item.cod_contribuinte;
                        movement.nome_contribuinte = item.nome_contribuinte;
                        movement.end_logradouro = item.end_logradouro;
                        movement.end_numero = item.end_numero;
                        movement.end_complemento = item.end_complemento;
                        movement.end_referencia = item.end_referencia;
                        movement.end_municipio = item.end_municipio;
                        movement.end_bairro = item.end_bairro;
                        movement.telefone1 = item.telefone1;
                        movement.telefone2 = item.telefone2;
                        movement.telefone3 = item.telefone3;
                        movement.memo_obs_mensageiro = item.memo_obs_mensageiro;
                        movement.valor_prev = item.valor_prev;
                        movement.valor_pago = item.valor_pago;
                        movement.cod_ultima_ocorrencia =
                          item.cod_ultima_ocorrencia;
                        movement.cod_banco_baixa = item.cod_banco_baixa;
                        movement.turno = item.turno;
                        movement.status = item.status;
                        movement.operador = item.operador;
                        movement.cod_tipo_pagamento = item.cod_tipo_pagamento;
                        movement.CPF = item.CPF;
                        movement.CNPJ = item.CNPJ;
                        movement.TipoPessoa = item.TipoPessoa;
                        if (item.ordem == null) {
                          movement.ordem = 0;
                        } else {
                          movement.ordem = item.ordem;
                        }
                        movement.data_prev = new Date(item.data_prev);
                        movement.data_ultima_contribuicoes = new Date(
                          item.data_ultima_contribuicoes,
                        );
                        movement.saldos = item.saldos;
                        movement.doador_novo = item.doador_novo;
                        movement.texto_obs = item.texto_obs;
                        movement.usuario_baixa = item.usuario_baixa;
                        movement.ultima_visita = item.ultima_visita;
                        movement.latitude = item.latitude;
                        movement.longitude = item.longitude;
                        movement.endereco_cobranca = item.endereco_cobranca;
                        movement.distancia = item.distancia;
                        movement.data_baixa = item.data_baixa;
                        movement.obs_contribuinte = item.obs_contribuinte;
                        await dataSource
                          .getRepository(MovementEntities)
                          .save(movement);
                      } else {
                        if (item.status != 0) {
                          existingMovement.status = item.status;
                          await dataSource
                            .getRepository(MovementEntities)
                            .save(existingMovement);
                        } else if (
                          existingMovement.cod_tipo_pagamento !=
                            item.cod_tipo_pagamento &&
                          existingMovement.status == 0
                        ) {
                          existingMovement.cod_tipo_pagamento =
                            item.cod_tipo_pagamento;
                          await dataSource
                            .getRepository(MovementEntities)
                            .save(existingMovement);
                        }
                        existingMovement.end_logradouro = item.end_logradouro;
                        existingMovement.end_numero = item.end_numero;
                        existingMovement.end_complemento = item.end_complemento;
                        existingMovement.end_referencia = item.end_referencia;
                        existingMovement.end_municipio = item.end_municipio;
                        existingMovement.end_municipio_cod =
                          item.end_municipio_cod;
                        existingMovement.end_bairro_cod = item.end_bairro_cod;
                        existingMovement.end_bairro = item.end_bairro;
                        existingMovement.telefone1 = item.telefone1;
                        existingMovement.telefone2 = item.telefone2;
                        existingMovement.telefone3 = item.telefone3;
                        existingMovement.turno = item.turno;
                        existingMovement.operador = item.operador;
                        existingMovement.saldos = item.saldos;
                        existingMovement.endereco_cobranca =
                          item.endereco_cobranca;
                        existingMovement.distancia = item.distancia;
                        await dataSource
                          .getRepository(MovementEntities)
                          .save(existingMovement);
                      }
                      // Busca todos os recibos do banco de dados local
                      const allLocalReceipts = await movementRepository.find();

                      await Promise.all(
                        allLocalReceipts.map(async localReceipt => {
                          // Verifica se o recibo local está presente na resposta da API
                          const receiptInApiResponse = responseData.find(
                            apiReceipt =>
                              apiReceipt.numero_recibo ===
                              localReceipt.numero_recibo,
                          );

                          // Se o recibo local não estiver presente na resposta da API, apaga-o do banco de dados local
                          if (!receiptInApiResponse) {
                            console.log(
                              `Deleting receipt: ${localReceipt.numero_recibo}`,
                            );
                            await movementRepository.delete({
                              numero_recibo: localReceipt.numero_recibo,
                            });
                          }
                        }),
                      );
                    }),
                  );

                  const existingDateMovement = await dataSource
                    .getRepository(DateMovementChosen)
                    .findOne({where: {valuecollected: dataMovement}});

                  if (!existingDateMovement) {
                    const date_movement = new DateMovementChosen();
                    date_movement.valuecollected = dataMovement;
                    await dataSource
                      .getRepository(DateMovementChosen)
                      .save(date_movement);
                  }
                  const AccountMovementChosen = new accountMovementChosen();
                  AccountMovementChosen.valuecollected = bankAccount;
                  await dataSource
                    .getRepository(accountMovementChosen)
                    .save(AccountMovementChosen);

                  await Promise.all(
                    dataMovementGeneral.map(async item => {
                      // Verifica se o registro já existe na tabela DateMovement
                      const existingDateMovement = await DateMovement.findOne({
                        where: {value: item.value},
                      });
                      if (!existingDateMovement) {
                        const dataMovementGeneralBase = new DateMovement();
                        dataMovementGeneralBase.label = item.label;
                        dataMovementGeneralBase.value = item.value;
                        await dataSource
                          .getRepository(DateMovement)
                          .save(dataMovementGeneralBase);
                      }
                    }),
                  );

                  await Promise.all(
                    bankAccountGeneral.map(async item => {
                      const existingAccount = await AccountsBank.findOne({
                        where: {value: item.value},
                      });
                      if (!existingAccount) {
                        const bankAccountGeneralBase = new AccountsBank();
                        bankAccountGeneralBase.label = item.label;
                        bankAccountGeneralBase.value = item.value;
                        await dataSource
                          .getRepository(AccountsBank)
                          .save(bankAccountGeneralBase);
                      }
                    }),
                  );

                  setModalCheck({
                    Title: 'Sucesso',
                    Message: 'Aparelho sincronizado',
                  });
                  setModalVisibleCheck(true);
                  setDataMovement(dataMovement);
                  setBankAccount(bankAccount);
                  setDisableData(true);
                  setDeactivateAccount(true);
                  setLoading(false);
                })
                .catch(function (error) {
                  console.log(JSON.stringify(error));
                  setModalError({
                    Title: 'Sincronização não concluída',
                    Message:
                      'Não foi possível concluir a sincronização. Verifique a sua conexão de internet ou entre em contato com o suporte',
                  });
                  setModalVisible(true);
                  setLoading(false);
                });
            }
          } else {
            setModalError({
              Title: 'Localização não encontrada',
              Message: 'Reenicie sua localização ou sincronize novamente',
            });
            setModalVisible(true);
            setLoading(false);
          }
        } else {
          setModalError({
            Title: 'Fora do horário de expediente',
            Message: 'Entre em contato com sua coordenação.',
          });
          setModalVisible(true);
          setLoading(false);
        }
      });
  }

  async function handleMakeRoute() {
    if (deactivateAccount == true && loading == false) {
      navigation.navigate('MakeRoute');
    } else {
      if (loading == true) {
        setModalError({
          Title: 'Trabalhar Rota',
          Message: 'Espere a sincronização acabar',
        });
        setModalVisible(true);
      } else {
        setModalError({
          Title: 'Trabalhar Rota',
          Message: 'Você precisa sincronizar o movimento',
        });
        setModalVisible(true);
      }
    }
  }

  async function handleRelatory() {
    if (disableData == true && loading == false) {
      navigation.navigate('Relatory');
    } else {
      if (loading == true) {
        setModalError({
          Title: 'Relatório',
          Message: 'Espere a sincronização acabar',
        });
        setModalVisible(true);
      } else {
        setModalError({
          Title: 'Relatório',
          Message:
            'Você precisa sincronizar o movimento para obter o relatório',
        });
        setModalVisible(true);
      }
    }
  }

  async function handleSettings() {
    navigation.navigate('Settings');
  }

  async function clock() {
    const ShiftDate = await dataSource
      .getRepository(ShiftEntiti)
      .createQueryBuilder('Shift')
      .orderBy('Shift.id', 'DESC')
      .getOne();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    if ( timeFormatted >= ShiftDate.HoraAberturaSistema && timeFormatted <= ShiftDate.HoraFechamentoSistema) {
      setBlock(true);
    } else {
      setModalVisible(true);
      setModalError({
        Title: 'Fora do horário de expediente',
        Message: 'Entre em contato com sua coordenação.',
      });
    }
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={
          modalVisible || modalVisibleCheck
            ? 'rgba(0, 0, 0, 0.5)'
            : 'transparent'
        }
        barStyle={
          modalVisible || modalVisibleCheck ? 'light-content' : 'dark-content'
        }
      />
      <ImageBackground
        source={require('../../assets/Background/BackgroundHome.png')}
        style={Styles.backgroundImage}>
        <View style={Styles.containerHome}>
          <View style={Styles.container}>
            <View style={Styles.containerTitle}>
              <View style={Styles.textContainer}>
                <Text style={Styles.textMens}>
                  Olá, {formatNameOne(messenger.nome)}!
                </Text>
                <Image
                  style={{width: 22, height: 22, marginLeft: '3%'}}
                  source={require('../../assets/iconsBlack/maoAcenando.png')}
                  alt="Icone de uma mão"
                />
              </View>
              <Text style={Styles.textMensa}>Mensageiro</Text>
            </View>
            <Pressable
              onPress={handleSettings}
              style={({pressed}) => [Styles.Settingbutton, {opacity: pressed ? 0.6 : 1}]}>
              <Image
                style={{width: 25, height: 25, marginBottom: '5%'}}
                source={require('../../assets/configuracoes-cog.png')}
                alt="Icone da tela de configuração"
              />
            </Pressable>
          </View>
          <View style={Styles.styleContainer}>
            <View style={Styles.containerMen}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginRight: '3%',
                  marginLeft: '5%',
                }}
                source={require('../../assets/iconsWhite/Movimento.png')}
                alt="Icone da tela de configuração"
              />
              <Text style={Styles.textMen}>MOVIMENTO</Text>
            </View>
            <Dropdown
              renderLeftIcon={() => (
                <Image
                  source={date}
                  style={{width: 20, height: 20, marginRight: '2%'}}
                />
              )}
              data={dataMovementGeneral}
              labelField="label"
              valueField="value"
              onChange={item => setDataMovement(item.value)}
              value={dataMovement}
              placeholder="Selecionar a data"
              placeholderStyle={{
                color: disableData == true ? '#d4d4d4' : '#ffffff',
                borderColor: disableData == true ? '#d4d4d4' : '#ffffff',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              disable={disableData || loading == true}
              style={{
                borderColor: disableData == true ? '#d4d4d4' : '#ffffff',
                height: 43,
                width: '100%',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              itemTextStyle={{
                color: disableData == true ? '#d4d4d4' : '#004e92',
                textAlign: 'left',
                fontWeight: '700',
              }}
              selectedTextStyle={{
                color: disableData == true ? '#d4d4d4' : '#ffffff',
              }}
              iconColor={disableData == true ? '#d4d4d4' : '#ffffff'}
            />
            <Dropdown
              renderLeftIcon={() => (
                <Image
                  source={Account}
                  style={{width: 20, height: 20, marginRight: '2%'}}
                />
              )}
              data={bankAccountGeneral}
              labelField="label"
              valueField="value"
              value={bankAccount}
              disable={disableData || loading == true}
              onChange={item => setBankAccount(item.value)}
              placeholder="Selecione a conta bancária"
              placeholderStyle={{
                color: deactivateAccount == true ? '#d4d4d4' : '#ffffff',
                borderColor: deactivateAccount == true ? '#d4d4d4' : '#ffffff',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
                borderRadius: 500,
              }}
              style={{
                borderColor: deactivateAccount == true ? '#d4d4d4' : '#ffffff',
                height: 43,
                width: '100%',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              itemTextStyle={{
                color: deactivateAccount == true ? '#d4d4d4' : '#000000',
              }}
              selectedTextStyle={{
                color: deactivateAccount == true ? '#d4d4d4' : '#ffffff',
              }}
              iconColor={deactivateAccount == true ? '#d4d4d4' : '#ffffff'}
            />
            <TextInput
              placeholder="Envelope do depósito"
              underlineColorAndroid="transparent"
              returnKeyType="next"
              placeholderTextColor="#ffffff"
              keyboardType="default"
              style={Styles.inputText}
            />
          </View>
          <Pressable
            onPress={block == false ? clock : handleMovimento}
            disabled={loading}
            style={({pressed}) => [Styles.Syncbutton, {opacity: pressed ? 0.6 : 1}]}>
            {loading ? (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                size="large"
                color="#ffffff"
              />
            ) : (
              <>
                <View style={Styles.buttonContainer}>
                  <Image
                    source={synchronization}
                    style={{width: 20, height: 20, marginRight: '2%'}}
                  />
                  <Text style={Styles.buttonText}>Sincronizar</Text>
                </View>
              </>
            )}
          </Pressable>
          <View style={Styles.buttonContainerDown}>
            <Pressable
              onPress={block == false ? clock : handleMakeRoute}
              style={({pressed}) => [Styles.downButton, {opacity: pressed ? 0.6 : 1}]}>
              <View style={Styles.buttonContainer}>
                <Image
                  source={Route}
                  style={{width: 20, height: 20, marginRight: '2%'}}
                />
                <Text style={Styles.buttonTextDown}>Montar rota</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={block == false ? clock : handleRelatory}
              style={({pressed}) => [Styles.downButton, {opacity: pressed ? 0.6 : 1}]}>
              <View style={Styles.buttonContainer}>
                <Image
                  source={Report}
                  style={{width: 20, height: 20, marginRight: '2%'}}
                />
                <Text style={Styles.buttonTextDown}>Relatório</Text>
              </View>
            </Pressable>
          </View>
          <ModalError
            Title={modalError.Title}
            Message={modalError.Message}
            status={modalVisible}
            onClose={() => setModalVisible(false)}
          />
          <ModalCheck
            Title={modalCheck.Title}
            Message={modalCheck.Message}
            status={modalVisibleCheck}
            onClose={() => setModalVisible(false)}
          />
        </View>
        <View style={Styles.containerVersion}>
          <Text style={Styles.versionText}>V {versionName}</Text>
        </View>
      </ImageBackground>
    </>
  );
}
function requestStoragePermission() {
  throw new Error('Function not implemented.');
}
