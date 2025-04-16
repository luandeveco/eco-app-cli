import React, {createContext, useState, useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import {AuthContextData} from './interfaces/AuthContextData';
import {api} from '../services/Api';
import {Auth} from './interfaces/auth';
import {AuthProviderProps} from './interfaces/AuthProviderProps';
import {Auth as AuthEntity} from '../database/entities/Auth';
import {Messenger} from '../database/entities/Messenger';
import {Institution} from '../database/entities/Institution';
import {TypeOccurrence as TypeOccurrenceEntity} from '../database/entities/TypeOccurrence';
import {TypePayment as TypePaymentEntity} from '../database/entities/TypePayment';
import {StatusMessenger as StatusMessengerEntity} from '../database/entities/StatusMessenger';
import {dataSource} from '../database/database';
import ModalError from '../components/ModalError/ModalError';
import {requestLocationPermission} from '../components/Permissions';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [auth, setAuth] = useState<Auth>();
  const [loading, setLoading] = useState<boolean>(true);
  const [printer, setPrinter] = useState();
  const [token, setToken] = useState('');
  const [databaseInitialized, setDatabaseInitialized] = useState<boolean>(false);
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [informationPhone, setInformationphone] = useState<{
    Manufacturer: string;
    Model: string;
    Brand: string;
    Version: string;
  } | null>(null);

  useEffect(() => {
    if (!databaseInitialized) {
      initializeDatabase();
    }
    requestLocationPermissionsHome();

    const getPhoneInformation = () => {
      const data = Platform.constants;
      const Manufacturer = 'Manufacturer' in data ? data.Manufacturer : 'Unknown';
      const Model = 'Model' in data ? data.Model : 'Unknown';
      const Brand = 'Brand' in data ? data.Brand : 'Unknown';
      const Version = 'Version' in Platform ? Platform.Version.toString() : 'Unknown';

      setInformationphone({ Manufacturer, Model, Brand, Version,});

    };

    locationAuth();
    getPhoneInformation();

  }, []);

  async function locationAuth() {
    const coords = await requestLocationPermission();
    //Atualiza o estado 'location' com as coordenadas obtidas, se estiverem disponíveis
    if (coords) {
      setLocation(coords);
    }
  }

  async function initializeDatabase() {
    try {
      await dataSource.initialize();
      console.log('Conexão com o banco de dados estabelecida');
      await dataSource.synchronize();
      console.log('Banco de dados sincronizado');
      setDatabaseInitialized(true);
      loadStorage();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function loadStorage() {
    try {
      const authData = await dataSource
        .getRepository(AuthEntity)
        .createQueryBuilder('auth')
        .orderBy('auth.id', 'DESC')
        .getOne();
      const institutionData = await dataSource
        .getRepository(Institution)
        .createQueryBuilder('institution')
        .orderBy('institution.id', 'DESC')
        .getOne();

      if (authData && institutionData) {
        const authentication: Auth = {
          access_token: authData.access_token,
          instituicao: institutionData,
        };
        setAuth(authentication);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      setLoading(false);
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

  async function signIn(code: string, password: string) {
    setLoading(true);
    try {
      const response = await api.post('/login', {
        codigo: code,
        senha: password,
        latitude: location.latitude,
        longitude: location.longitude,
        phoneBrand: informationPhone.Brand,
        Manufacturer: informationPhone.Manufacturer,
        Model: informationPhone.Model,
        Version: informationPhone.Version,
      });

      const responseData = response.data;
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      try {
        const authRepository = dataSource.getRepository(AuthEntity);
        const existingToken = await authRepository.findOne({
          where: {
            access_token: responseData.access_token,
          },
        });
        if (!existingToken) {
          const auth = new AuthEntity();
          auth.access_token = responseData.access_token;
          auth.expires_in = new Date(responseData.expires_in);
          await authRepository.save(auth);
        } else {
          existingToken.access_token = responseData.access_token;
          existingToken.expires_in = new Date(responseData.expires_in);
          await authRepository.save(existingToken);
        }
        await Promise.all(
          responseData.tipo_pagamento.map(async item => {
            const typePaymentRepository = dataSource.getRepository(TypePaymentEntity);
            const existingTypePayment = await typePaymentRepository.findOne({
              where: {
                codigo: item.codigo,
              },
            });
            if (!existingTypePayment) {
              const typePayment = new TypePaymentEntity();
              typePayment.codigo = item.codigo;
              typePayment.descricao = item.descricao;
              typePayment.sigla = item.Sigla;
              await dataSource.getRepository(TypePaymentEntity).save(typePayment);
            }
          }),
        );

        const messengerRepository = dataSource.getRepository(Messenger);
        const existingMessenger = await messengerRepository.findOne({
          where: {
            codigo: responseData.mensageiro.codigo,
          },
        });
        if (!existingMessenger) {
          const messenger = new Messenger();
          messenger.codigo = responseData.mensageiro.codigo;
          messenger.nome = responseData.mensageiro.nome;
          await dataSource.getRepository(Messenger).save(messenger);
        }

        await Promise.all(responseData.tipo_ocorrencia.map(async item => {

            const typeOccurrenceRepository = dataSource.getRepository(TypeOccurrenceEntity);
            const existingTypeOccurrence = await typeOccurrenceRepository.findOne({
                where: {
                  codigo: item.codigo,
                },
              });

            if (!existingTypeOccurrence) {
              const typeOccurrence = new TypeOccurrenceEntity();
              typeOccurrence.codigo = item.Id;
              typeOccurrence.descricao = item.Descricao;
              await dataSource
                .getRepository(TypeOccurrenceEntity)
                .save(typeOccurrence);
            }
          }),
        );

        await Promise.all(responseData.status_mensageiro.map(async item => {
            const statusMessengerRepository = dataSource.getRepository(
              StatusMessengerEntity,
            );
            const existingStatusMessenger = await statusMessengerRepository.findOne({
                where: {
                  codigo: item.codigo,
                },
              });
            if (!existingStatusMessenger) {
              const statusMessenger = new StatusMessengerEntity();
              statusMessenger.codigo = item.codigo;
              statusMessenger.descricao = item.descricao;
              await dataSource.getRepository(StatusMessengerEntity).save(statusMessenger);
            }
          }),
        );

        const institutionRepository = dataSource.getRepository(Institution);
        const existingInstitution = await institutionRepository.findOne({
          where: {
            mensagem_boleto: responseData.instituicao.mensagem_boleto,
            telefone_finalizar_android1: responseData.instituicao.telefone_finalizar_android1,
            telefone_finalizar_android2: responseData.instituicao.telefone_finalizar_android2,
          },
        });

        if (!existingInstitution) {
          const institution = new Institution();
          institution.mensagem_boleto = responseData.instituicao.mensagem_boleto;
          institution.telefone_finalizar_android1 = responseData.instituicao.telefone_finalizar_android1;
          institution.telefone_finalizar_android2 = responseData.instituicao.telefone_finalizar_android2;
          await dataSource.getRepository(Institution).save(institution);
        } else {
          existingInstitution.mensagem_boleto = responseData.instituicao.mensagem_boleto;
          existingInstitution.telefone_finalizar_android1 = responseData.instituicao.telefone_finalizar_android1;
          existingInstitution.telefone_finalizar_android2 = responseData.instituicao.telefone_finalizar_android2;
          await dataSource.getRepository(Institution).save(existingInstitution);
        }

        await queryRunner.commitTransaction();
        setAuth(responseData);
        setLoading(false);
        return responseData;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Erro ao salvar dados no banco de dados:', error);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response && error.response.status === 402) {
        setModalError({
          Title: 'Fora do horário de expediente',
          Message: 'Entre em contato com sua coordenação.',
        });
      } else {
        setModalError({
          Title: 'Credenciais Inválidas',
          Message: 'Digite código ou senha correta',
        });
      }
      setModalVisible(true);
    }
  }

  async function signOut(): Promise<void> {
    try {
      const authRepository = dataSource.getRepository(AuthEntity);
      await authRepository.clear();
      setAuth(undefined);
      setToken('');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{auth, loading, signIn, signOut, token, printer}}>
      {children}
      <ModalError
        Title={modalError.Title}
        Message={modalError.Message}
        status={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
