import {
  StatusBar,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ImageBackground,
  Switch,
  VirtualizedList,
  Image,
  Dimensions,
} from 'react-native';
import {Styles} from './Style';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Movement} from '../../database/entities/Movement';
import {dataSource} from '../../database/database';
import {useCallback, useEffect, useState} from 'react';
import {CountiesMovement} from '../../database/entities/CountiesMovement';
import {SuburbMovement} from '../../database/entities/SuburbMovement';
import {StatusMessenger} from '../../database/entities/StatusMessenger';
import {NavigationProp} from '../../routes/Interfaces/NavigationTypes';
import {statusReceipt} from './Components/Components/statusReceipt';
import {Line} from '../../components/Line/Line';
import {colorPayment} from './Components/Components/ColorPayment';
import {paymentReceipt} from './Components/Components/paymentReceipt';
import {formatDate} from '../../utils/Formatting/FormattingData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import BackButton from '../../components/ButtonBack/BackButton';
import {In} from 'typeorm';
import {ReceiptSettings} from '../../database/entities/ReceiptSettings';
import React from 'react';
import {useFilterContext} from '../../contexts/Filter';
import {Shift as ShiftEntiti} from '../../database/entities/Shift';
import ModalError from '../../components/ModalError/ModalError';

const {width, height} = Dimensions.get('window');

function SetRoute(route) {
  const {
    statusSelected,
    neighborhoodSelected,
    municipalitySelected,
    neighborhoods,
    movement,
    counties,
    setMovement,
    setcounties,
    setStatusSelected,
    setNeighborhoods,
    setNeighborhoodSelected,
    setMunicipalitySelected,
  } = useFilterContext();
  const [statusMessenger, setStatusMessenger] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [previousSelected, setPreviousSelected] = useState<number>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [isOn, setIsOn] = useState(true);
  const [assemblyNew, setAssemblyNew] = useState(false);
  const [block, setBlock] = useState(false);
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStorage().then(() => {
        if (neighborhoodSelected) {
          filterSortAndUpdateMovementsByNeighborhood(neighborhoodSelected);
        } else if (municipalitySelected) {
          filterAndSortByMunicipality(municipalitySelected);
        } else if (statusSelected) {
          filterStatus(statusSelected);
        }
      });
    }, [neighborhoodSelected, municipalitySelected, statusSelected]),
  );

  const toggleSwitch = () => {
    setSelectedId(0);
    setIsEnabled(previousState => !previousState);
  };

  async function loadStorage() {
    // Não resetamos os filtros para preservar os valores selecionados
    // if (!municipalitySelected) setMunicipalitySelected('');
    // if (!neighborhoodSelected) setNeighborhoodSelected('');

    const check = await dataSource
      .getRepository(ReceiptSettings)
      .createQueryBuilder('Receipt')
      .orderBy('Receipt.id', 'DESC')
      .getOne();
    setIsOn(check?.SummaryReceipt);
    setAssemblyNew(check?.AssemblyNew);
    const checkMovement = await dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .where('movement.status = :status', {status: 0})
      .orderBy('movement.ordem', 'ASC')
      .getMany();

    const checkMunicipality = await dataSource
      .getRepository(CountiesMovement)
      .find();
    const messengerData = await dataSource
      .getRepository(StatusMessenger)
      .find();
    const status = messengerData;
    const movementCounts = await dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .select(
        'SUM(CASE WHEN movement.status = :statusPending THEN 1 ELSE 0 END)',
        'pendingCount',
      )
      .addSelect(
        'SUM(CASE WHEN movement.status IN (:statusReceived, :statusProcessed) THEN 1 ELSE 0 END)',
        'receivedCount',
      )
      .addSelect(
        'SUM(CASE WHEN movement.status = :statusReturned THEN 1 ELSE 0 END)',
        'returnedCount',
      )
      .setParameter('statusPending', 0)
      .setParameter('statusReceived', 1)
      .setParameter('statusProcessed', 2)
      .setParameter('statusReturned', 3)
      .getRawOne();

    const checkMovementLengthPending = movementCounts.pendingCount || 0;
    const checkMovementLengthReceived = movementCounts.receivedCount || 0;
    const checkMovementLengthReturned = movementCounts.returnedCount || 0;

    status.map(count => {
      if (count.codigo === '0') {
        count.descricao = `${count.descricao} (${checkMovementLengthPending})`;
      } else if (count.codigo === '1') {
        count.descricao = `${count.descricao} (${checkMovementLengthReceived})`;
      } else if (count.codigo === '3') {
        count.descricao = `${count.descricao} (${checkMovementLengthReturned})`;
      }
    });

    let statusAtual = statusSelected === 1 ? [1, 2] : [statusSelected];

    const receiptCounts = await dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .select('movement.end_municipio', 'municipality')
      .addSelect('COUNT(movement.numero_recibo)', 'count')
      .where('movement.status IN (:...statuses)', {statuses: statusAtual})
      .groupBy('movement.end_municipio')
      .getRawMany();

    const updatedMunicipalities = checkMunicipality.map(m => {
      const municipalityData = receiptCounts.find(
        count =>
          count.municipality?.trim().toLowerCase() ===
          m.descricao?.trim().toLowerCase(),
      );
      return {
        ...m,
        descricao: `${m.descricao} (${
          municipalityData ? municipalityData.count : 0
        })`,
        contagem: municipalityData ? municipalityData.count : 0,
      };
    });
    setcounties(updatedMunicipalities);

    // Se os filtros já estiverem selecionados, aplica-os; caso contrário, usa os dados padrão
    if (municipalitySelected) {
      await filterAndSortByMunicipality(municipalitySelected);
      if (neighborhoodSelected) {
        await filterSortAndUpdateMovementsByNeighborhood(neighborhoodSelected);
      }
    } else if (statusSelected !== 0) {
      await filterStatus(statusSelected);
    } else {
      setMovement(checkMovement);
    }
    setStatusMessenger(status);

    const shiftRepository = await dataSource
      .getRepository(ShiftEntiti)
      .createQueryBuilder('Shift')
      .orderBy('Shift.id', 'DESC')
      .getOne();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    if (
      timeFormatted >= shiftRepository.HoraAberturaSistema &&
      timeFormatted <= shiftRepository.HoraFechamentoSistema
    ) {
      setBlock(true);
    } else {
      setBlock(false);
      setModalError({
        Title: 'Fora do horário de expediente',
        Message: 'Entre em contato com sua coordenação.',
      });
      setModalVisible(true);
    }
    setTimeout(() => {
      setLoading(false);
    });
  }

  function handleReturn() {
    navigation.goBack();
  }

  async function filterStatus(item: number) {
    setStatusSelected(item);
    setMunicipalitySelected('');
    setNeighborhoodSelected('');

    const checkMunicipality = await dataSource
      .getRepository(CountiesMovement)
      .find();

    let statusAtual = [];
    if (statusSelected == 1) {
      statusAtual = [1, 2];
    } else {
      statusAtual = [statusSelected];
    }

    const receiptCounts = await dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .select('movement.end_municipio', 'municipality')
      .addSelect('COUNT(movement.numero_recibo)', 'count')
      .where('movement.status IN (:...statuses)', {statuses: statusAtual})
      .groupBy('movement.end_municipio')
      .getRawMany();

    const updatedMunicipalities = checkMunicipality.map(m => {
      const municipalityData = receiptCounts.find(
        count =>
          count.municipality?.trim().toLowerCase() ===
          m.descricao?.trim().toLowerCase(),
      );

      return {
        ...m,
        descricao: `${m.descricao} (${
          municipalityData ? municipalityData.count : 0
        })`,
        contagem: municipalityData ? municipalityData.count : 0,
      };
    });

    setcounties([...updatedMunicipalities]);

    const checkMovementRepository = dataSource.getRepository(Movement);
    const checkMovement = await checkMovementRepository
      .createQueryBuilder('checkMovement')
      .where(
        item === 1
          ? 'checkMovement.status IN (:...statuses)'
          : 'checkMovement.status = :status',
        item === 1 ? {statuses: [1, 2]} : {status: item},
      )
      .getMany();

    let movement = checkMovement.sort((a, b) => {
      if (a.ordem === null) {
        return 1;
      }
      if (b.ordem === null) {
        return -1;
      }
      return a.ordem - b.ordem;
    });

    movement.forEach((e, i) => {
      e.ordem = i + 1;
    });

    let movementMap = new Map(movement.map(e => [e.numero_recibo, e.ordem]));
    movement.forEach(mov_storage => {
      if (movementMap.has(mov_storage.numero_recibo)) {
        mov_storage.ordem = movementMap.get(mov_storage.numero_recibo);
      }
    });

    await checkMovementRepository.save(movement);
    setMovement(movement);
  }

  async function filterAndSortByMunicipality(municipality: string) {
    setMunicipalitySelected(municipality);
    // Remova ou comente a linha que reseta o bairro:
    // setNeighborhoodSelected('');

    const suburbMovementRepository = dataSource.getRepository(SuburbMovement);
    const movementRepository = dataSource.getRepository(Movement);
    const checkNeighborhood = await suburbMovementRepository.query(
      'SELECT * FROM suburbMovement WHERE TRIM(descricaoCounties) = TRIM(?)',
      [municipality.toString()],
    );
    const cleanData = checkNeighborhood.map(item => ({
      descricao: item.descricao ? item.descricao.trim() : item.descricao,
      descricaoCounties: item.descricaoCounties
        ? item.descricaoCounties.trim()
        : item.descricaoCounties,
      id: item.id,
    }));
    const checkMovement = await movementRepository
      .createQueryBuilder('checkMovement')
      .where(
        statusSelected == 1
          ? 'checkMovement.status IN (:...statuses)'
          : 'checkMovement.status = :status',
        statusSelected == 1 ? {statuses: [1, 2]} : {status: statusSelected},
      )
      .andWhere(
        // Remova ou comente essa linha se não quiser resetar o bairro
        // neighborhoodSelected == '' ? 'checkMovement.end_bairro IS NOT NULL' : 'checkMovement.end_bairro = :neighborhood',
        // { neighborhood: neighborhoodSelected ? neighborhoodSelected.toString() : undefined }
        'checkMovement.end_municipio = :municipality',
        {municipality: municipality ? municipality.toString() : undefined},
      )
      .getMany();
    let movementSorted = checkMovement.sort((a, b) => {
      if (a.ordem === null) {
        return 1;
      }
      if (b.ordem === null) {
        return -1;
      }
      return a.ordem - b.ordem;
    });
    movementSorted.forEach((item, index) => {
      item.ordem = index + 1;
    });
    const movementCountByNeighborhood = movementSorted.reduce((acc, mov) => {
      if (mov.end_bairro) {
        const key = mov.end_bairro.trim().toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const neighborhoodsWithMovimentos = cleanData
      .map((bairro: any) => {
        const key = bairro.descricao
          ? bairro.descricao.trim().toLowerCase()
          : '';
        const count = movementCountByNeighborhood[key] || 0;
        return count > 0
          ? {
              ...bairro,
              descricao: `${bairro.descricao} (${count})`,
              contagem: count,
              label: `${bairro.descricao} (${count})`,
              value: bairro.descricao,
            }
          : null;
      })
      .filter((bairro: any) => bairro !== null);
    if (neighborhoodsWithMovimentos.length > 0) {
      setNeighborhoods(neighborhoodsWithMovimentos);
    } else {
      if (movementSorted.length === 0) {
        setNeighborhoods([{descricao: 'SEM MOVIMENTO', contagem: 0}]);
      } else {
      }
    }
    setMovement(movementSorted);
  }

  async function filterSortAndUpdateMovementsByNeighborhood(
    neighborhoodFilter: string,
  ) {
    const checkMovementRepository = dataSource.getRepository(Movement);
    const checkMovement = await checkMovementRepository
      .createQueryBuilder('checkMovement')
      .where(
        statusSelected === 1
          ? 'checkMovement.status IN (:...statuses)'
          : 'checkMovement.status = :status',
        statusSelected === 1 ? {statuses: [1, 2]} : {status: statusSelected},
      )
      .andWhere(
        neighborhoodFilter
          ? 'TRIM(checkMovement.end_bairro) = TRIM(:neighborhood)'
          : '1=1',
        {
          neighborhood: neighborhoodFilter
            ? neighborhoodFilter.toString()
            : undefined,
        },
      )
      .andWhere(
        municipalitySelected
          ? 'TRIM(checkMovement.end_municipio) = TRIM(:municipality)'
          : '1=1',
        {
          municipality: municipalitySelected
            ? municipalitySelected.toString()
            : undefined,
        },
      )
      .getMany();

    let movementSorted = checkMovement.sort((a, b) => {
      if (a.ordem === null) {
        return 1;
      }
      if (b.ordem === null) {
        return -1;
      }
      return a.ordem - b.ordem;
    });
    movementSorted.forEach((e, i) => {
      e.ordem = i + 1;
    });
    await checkMovementRepository.save(movementSorted);
    setMovement(movementSorted);

    // Atualiza somente a lista de bairros, sem modificar o valor selecionado
    if (statusSelected === 0) {
      const suburbMovementRepository = dataSource.getRepository(SuburbMovement);
      const checkNeighborhood = await suburbMovementRepository.query(
        'SELECT * FROM suburbMovement WHERE TRIM(descricaoCounties) = TRIM(?)',
        [municipalitySelected.toString()],
      );
      const treatedNeighborhoods = checkNeighborhood.map(neighborhood => ({
        ...neighborhood,
        descricao: neighborhood.descricao.trim(),
      }));
      const movementRepositoryNeighborhoods =
        dataSource.getRepository(Movement);
      const checkMovementNeighborhoods =
        await movementRepositoryNeighborhoods.find();
      const neighborhoodsWithMovimentos = treatedNeighborhoods
        .map((bairro: any) => {
          const movementsNoNeighborhood = checkMovementNeighborhoods.filter(
            (movementFilter: any) =>
              movementFilter.end_bairro === bairro.descricao &&
              movementFilter.status === 0,
          );
          if (movementsNoNeighborhood.length > 0) {
            const pureName = bairro.descricao;
            return {
              ...bairro,
              // Atualiza o label e valor para o dropdown
              label: `${pureName} (${movementsNoNeighborhood.length})`,
              value: pureName,
              contagem: movementsNoNeighborhood.length,
            };
          }
          return null;
        })
        .filter((bairro: any) => bairro !== null);
      if (neighborhoodsWithMovimentos.length > 0) {
        setNeighborhoods(neighborhoodsWithMovimentos);
      } else {
        setNeighborhoods([{descricao: 'SEM MOVIMENTO', contagem: 0}]);
      }
    }
    if (statusSelected === 1) {
      const suburbMovementRepository = dataSource.getRepository(SuburbMovement);
      const checkNeighborhood = await suburbMovementRepository.query(
        'SELECT * FROM suburbMovement WHERE TRIM(descricaoCounties) = TRIM(?)',
        [municipalitySelected.toString()],
      );
      const treatedNeighborhoods = checkNeighborhood.map(neighborhood => ({
        ...neighborhood,
        descricao: neighborhood.descricao.trim(),
      }));
      const movementRepositoryNeighborhoods =
        dataSource.getRepository(Movement);
      const checkMovementNeighborhoods =
        await movementRepositoryNeighborhoods.find();
      const neighborhoodsWithMovimentos = treatedNeighborhoods
        .map(bairro => {
          const movementsNoNeighborhood = checkMovementNeighborhoods.filter(
            movementFilter =>
              movementFilter.end_bairro === bairro.descricao &&
              movementFilter.status === 1,
          );
          if (movementsNoNeighborhood.length > 0) {
            const pureName = bairro.descricao;
            return {
              ...bairro,
              label: `${pureName} (${movementsNoNeighborhood.length})`,
              value: pureName,
              contagem: movementsNoNeighborhood.length,
            };
          }
          return null;
        })
        .filter(bairro => bairro !== null);
      setNeighborhoods(neighborhoodsWithMovimentos);
    }
    if (statusSelected === 3) {
      const suburbMovementRepository = dataSource.getRepository(SuburbMovement);
      const checkNeighborhood = await suburbMovementRepository.query(
        'SELECT * FROM suburbMovement WHERE TRIM(descricaoCounties) = TRIM(?)',
        [municipalitySelected.toString()],
      );
      const treatedNeighborhoods = checkNeighborhood.map(neighborhood => ({
        ...neighborhood,
        descricao: neighborhood.descricao.trim(),
      }));
      const movementRepositoryNeighborhoods =
        dataSource.getRepository(Movement);
      const checkMovementNeighborhoods =
        await movementRepositoryNeighborhoods.find();
      const neighborhoodsWithMovimentos = treatedNeighborhoods
        .map(bairro => {
          const movementsNoNeighborhood = checkMovementNeighborhoods.filter(
            movementFilter =>
              movementFilter.end_bairro === bairro.descricao &&
              movementFilter.status === 3,
          );
          if (movementsNoNeighborhood.length > 0) {
            const pureName = bairro.descricao;
            return {
              ...bairro,
              label: `${pureName} (${movementsNoNeighborhood.length})`,
              value: pureName,
              contagem: movementsNoNeighborhood.length,
            };
          }
          return null;
        })
        .filter(bairro => bairro !== null);
      setNeighborhoods(neighborhoodsWithMovimentos);
    }
  }

  async function loadMunicipalitiesWithCounts() {
    const checkMunicipality = await dataSource
      .getRepository(CountiesMovement)
      .find();

    let statusAtual = [];
    if (statusSelected === 1) {
      statusAtual = [1, 2];
    } else {
      statusAtual = [statusSelected];
    }

    const receiptCounts = await dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .select('movement.end_municipio', 'municipality')
      .addSelect('COUNT(movement.numero_recibo)', 'count')
      .where('movement.status IN (:...statuses)', {statuses: statusAtual})
      .groupBy('movement.end_municipio')
      .getRawMany();

    const updatedMunicipalities = checkMunicipality.map(m => {
      const municipalityData = receiptCounts.find(
        count =>
          count.municipality?.trim().toLowerCase() ===
          m.descricao?.trim().toLowerCase(),
      );
      return {
        ...m,
        descricao: `${m.descricao} (${
          municipalityData ? municipalityData.count : 0
        })`,
        contagem: municipalityData ? municipalityData.count : 0,
      };
    });

    setcounties([...updatedMunicipalities]);

    if (municipalitySelected) {
      await filterAndSortByMunicipality(municipalitySelected);
    }
  }

  function handleReceipt(receipt_id: number, payment_id: number) {
    navigation.navigate('Receipt', {
      receipt_id: receipt_id,
      payment_id: payment_id,
    });
  }

  async function orderByOrdem() {
    let sortMovement = [...movement];
    sortMovement
      .sort((a, b) => {
        if (a.ordem === null) {
          return 1;
        }
        if (b.ordem === null) {
          return -1;
        }
        return a.ordem - b.ordem;
      })
      .map((e, i) => {
        e.ordem = i + 1;
      });

    const movementRepository = dataSource.getRepository(Movement);
    let a = (await movementRepository.find()) as Movement[];

    sortMovement.forEach(s => {
      a.filter(e => e.numero_recibo === s.numero_recibo)[0].ordem = s.ordem;
    });

    await movementRepository.save(a);
    setMovement(sortMovement);
  }

  function cleanFilter() {
    setMunicipalitySelected('');
    setNeighborhoodSelected('');
    filterStatus(statusSelected);
    setNeighborhoods([]);
  }

  async function saveRoute(recibo: number) {
    if (assemblyNew == true) {
      if (previousSelected !== undefined) {
        const movementRepository = dataSource.getRepository(Movement);
        let a = movementRepository.find();

        movement.forEach(async function (m, i, moviment) {
          if (Number(m.numero_recibo) == recibo) {
            const previousSelectedMovement = moviment.filter(
              e => Number(e.numero_recibo) == previousSelected,
            )[0];
            const reciboMovement = moviment.filter(
              e => Number(e.numero_recibo) == recibo,
            )[0];

            if (previousSelectedMovement && reciboMovement) {
              const tempOrdem = previousSelectedMovement.ordem;
              previousSelectedMovement.ordem = reciboMovement.ordem;
              reciboMovement.ordem = tempOrdem;
            }
          }
        });

        await movementRepository.save(a);
        orderByOrdem();
        setSelectedId(undefined);
        setPreviousSelected(undefined);
        return;
      }

      movement.forEach(function (m, i) {
        if (Number(m.numero_recibo) == recibo) {
          setPreviousSelected(recibo);
          setSelectedId(recibo);
        }
      });
    } else {
      if (previousSelected !== undefined) {
        const movementRepository = dataSource.getRepository(Movement);
        let a = await movementRepository.find({
          where: {
            numero_recibo: In(movement.map(item => item.numero_recibo)),
          },
        });

        let ordem: number;
        let tam: number = a.length;

        const previousMovement = movement.find(
          e => e.numero_recibo == previousSelected.toString(),
        );
        const currentMovement = movement.find(
          m => Number(m.numero_recibo) == recibo,
        );

        if (previousMovement && currentMovement) {
          ordem = movement.indexOf(currentMovement) + 1;
          previousMovement.ordem = ordem;

          if (currentMovement.ordem == ordem && ordem < tam) {
            currentMovement.ordem = ordem + 1;
          }
        }

        const previousA = a.find(
          e => Number(e.numero_recibo) == previousSelected,
        );
        const currentA = a.find(vm => Number(vm.numero_recibo) == recibo);

        if (previousA && currentA) {
          previousA.ordem = ordem;

          if (currentA.ordem == ordem && ordem < tam) {
            currentA.ordem = ordem + 1;
          }
        }

        await movementRepository.save(a);
        orderByOrdem();
        setSelectedId(undefined);
        setPreviousSelected(undefined);
        return;
      }

      const selectedMovement = movement.find(
        m => Number(m.numero_recibo) == recibo,
      );
      if (selectedMovement) {
        setPreviousSelected(recibo);
        setSelectedId(recibo);
      }
    }
  }

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() =>
          isEnabled == false
            ? block == false
              ? setModalVisible(true)
              : handleReceipt(item.numero_recibo, item.cod_tipo_pagamento)
            : saveRoute(item.numero_recibo)
        }
        style={({pressed}) => [
          Styles.CardReceipt,
          isEnabled == false
            ? {backgroundColor: '#fff'}
            : {
                backgroundColor:
                  selectedId == item.numero_recibo ? '#fff' : '#fbfbfb86',
              },
              {opacity : pressed ? 0.6 : 1}
        ]}>
        <View>
          {/**Cabeçalho do recibo */}
          <View style={Styles.ReceiptData}>
            {item?.saldos == 1 ? (
              <Text style={Styles.TitleReceipt}>
                {statusReceipt(Number(item.status))}
              </Text>
            ) : (
              <Text style={Styles.ReceiptDataText}>
                {statusReceipt(Number(item.status))}
              </Text>
            )}
            <Text style={Styles.ReceiptDataText}>
              {Number(item?.valor_prev).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            {neighborhoodSelected != '' ||
            municipalitySelected != '' ||
            (neighborhoodSelected == '' && municipalitySelected == '') ? (
              <>
                <Text style={Styles.TitleReceipt}>ORDEM</Text>
                <Text style={Styles.ReceiptDataText}>{item?.ordem}</Text>
              </>
            ) : (
              ''
            )}
          </View>
          <Line />
          {/**Corpo do recibo (Pré-vizualização) */}
          {item?.doador_novo == false ? (
            ''
          ) : (
            <Text
              style={{
                color: '#2974B4',
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              DOADOR NOVO
            </Text>
          )}
          <Text style={Styles.ReceiptData}>
            Nº <Text style={Styles.ReceiptData}>{item?.numero_recibo}</Text>
          </Text>
          <Text style={Styles.TitleReceipt}>TURNO</Text>
          <Text style={Styles.ContributorData}>{item?.turno}</Text>
          <Text style={Styles.TitleReceipt}>NOME</Text>
          <Text style={Styles.ContributorData}>
            {item?.cod_contribuinte} - {item?.nome_contribuinte}
          </Text>
          <Text style={Styles.TitleReceipt}>MUNICÍPIO</Text>
          <Text style={Styles.ContributorData}>{item?.end_municipio}</Text>
          <Text style={Styles.TitleReceipt}>BAIRRO</Text>
          <Text style={Styles.ContributorData}>{item?.end_bairro}</Text>
          <Text style={Styles.TitleReceipt}>ENDEREÇO</Text>
          <Text style={Styles.ContributorData}>
            {item?.end_logradouro}, {item?.end_numero}
          </Text>
          <Text style={Styles.TitleReceipt}>TIPO DE PAGAMENTO</Text>
          <Text
            style={{
              color: colorPayment(Number(item.cod_tipo_pagamento)),
              fontFamily: 'Inter-Bold',
              fontWeight: '900',
              fontSize: 16,
              minHeight: 10,
              maxHeight: 90,
              width: '60%',
            }}>
            {paymentReceipt(Number(item.cod_tipo_pagamento))}
          </Text>
          <Text style={Styles.TitleReceipt}>REFERÊNCIA</Text>
          <Text style={Styles.ContributorData}>{item?.end_referencia}</Text>
          <Text style={Styles.TitleReceipt}>ÚLTIMA VISITA</Text>
          <Text style={Styles.ContributorData}>
            {item?.ultima_visita == null ? '' : formatDate(item?.ultima_visita)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderItemAbridged = ({item}) => {
    return (
      <Pressable
        onPress={() =>
          isEnabled == false
            ? block == false
              ? setModalVisible(true)
              : handleReceipt(item.numero_recibo, item.cod_tipo_pagamento)
            : saveRoute(item.numero_recibo)
        }
        style={({pressed}) => [
          Styles.CardReceipt,
          isEnabled == false
            ? {backgroundColor: '#fff'}
            : {
                backgroundColor:
                  selectedId == item.numero_recibo ? '#fff' : '#fbfbfb86',
              },
            {opacity : pressed ? 0.6 : 1}
        ]}>
        <View>
          {/**Cabeçalho do recibo */}
          <View style={Styles.ReceiptData}>
            {item?.saldos == 1 ? (
              <Text style={Styles.TitleReceipt}>
                {statusReceipt(Number(item.status))}
              </Text>
            ) : (
              <Text style={Styles.ReceiptDataText}>
                {statusReceipt(Number(item.status))}
              </Text>
            )}
            <Text style={Styles.ReceiptDataText}>
              {Number(item?.valor_prev).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            {neighborhoodSelected != '' ||
            municipalitySelected != '' ||
            (neighborhoodSelected == '' && municipalitySelected == '') ? (
              <>
                <Text style={Styles.TitleReceipt}>ORDEM</Text>
                <Text style={Styles.ReceiptDataText}>{item?.ordem}</Text>
              </>
            ) : (
              ''
            )}
          </View>
          <Line />
          {/**Corpo do recibo (Pré-vizualização)*/}
          {item?.doador_novo == false ? (
            ''
          ) : (
            <Text
              style={{
                color: '#2974B4',
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              DOADOR NOVO
            </Text>
          )}
          <View style={{marginRight: '5%'}}>
            <Text style={Styles.TitleReceipt}>
              Nº{' '}
              <Text style={Styles.ContributorData}>{item?.numero_recibo}</Text>
              <Text style={Styles.TitleReceipt}>
                {' '}
                TURNO: <Text style={Styles.ContributorData}>{item?.turno}</Text>
              </Text>
            </Text>
            <Text style={Styles.TitleReceipt}>
              NOME:{' '}
              <Text style={Styles.ContributorData}>
                {item?.cod_contribuinte} - {item?.nome_contribuinte}
              </Text>
            </Text>
            <Text style={Styles.TitleReceipt}>
              ENDEREÇO:{' '}
              <Text style={Styles.ContributorData}>
                {item?.end_logradouro}, {item?.end_numero}
              </Text>
            </Text>
            <Text style={Styles.TitleReceipt}>
              REFERÊNCIA:{' '}
              <Text style={Styles.ContributorData}>{item?.end_referencia}</Text>
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ImageBackground
          source={require('../../assets/Background/BackgroungConfig.png')}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#2974B4" />
        </ImageBackground>
      </>
    );
  }

  return (
    <View style={Styles.view}>
      <StatusBar backgroundColor="#2974B4" barStyle="light-content" />
      <BackButton onPress={handleReturn} />
      <View
        style={[
          Styles.FilterBox,
          filterOpen == true ? {height: height * 0.38} : {},
        ]}>
        <Pressable
          style={({pressed}) => [Styles.FilterLine, {opacity : pressed ? 0.6 : 1}]}
          onPress={() => setFilterOpen(filterOpen == true ? false : true)}>
          <MaterialIcons
            name={filterOpen == true ? 'expand-more' : 'chevron-right'}
            size={22}
            color="#2974B4"
          />
          <Text style={Styles.TextFilter}>FILTRAR</Text>
        </Pressable>
        {filterOpen == true ? (
          <View
            style={{
              alignSelf: 'flex-end',
              width: '40%',
              height: '19%',
              marginTop: '2%',
              marginRight: '5%',
            }}>
            <Pressable
              onPress={cleanFilter}
              style={({pressed}) => [{
                backgroundColor: '#2974B4',
                borderRadius: 8,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              },{opacity : pressed ? 0.6 : 1}]}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/iconsWhite/Clean3x.png')}
                  style={{width: 20, height: 20}}
                />
                <Text
                  style={{color: '#FFFFFF', marginLeft: '2%', fontSize: 12}}>
                  Limpar Filtro
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          ''
        )}
        {filterOpen == true ? (
          <>
            <Dropdown
              data={statusMessenger}
              labelField="descricao"
              valueField="codigo"
              value={statusMessenger.find(s => s.codigo == statusSelected)}
              containerStyle={{
                top: '-0.2%',
                borderRadius: 8,
              }}
              style={{
                height: 43,
                width: '95%',
                borderColor: '#646464',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              onChange={item => filterStatus(item.codigo)}
              placeholder="STATUS"
              placeholderStyle={{
                color: '#000000',
                borderColor: '#646464',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              itemTextStyle={{color: '#000000'}}
              selectedTextStyle={{
                color: '#000000',
              }}
              iconColor={'#000000'}
              disable={isEnabled == true}
            />
            <Dropdown
              data={counties.map(m => {
                const pureName = m.descricao.split(' (')[0].trim();
                return {
                  ...m,
                  label: `${pureName} (${m.contagem || 0})`,
                  value: pureName,
                };
              })}
              labelField="label"
              valueField="value"
              value={municipalitySelected}
              onChange={item => {
                setMunicipalitySelected(item.value);
                filterAndSortByMunicipality(item.value);
              }}
              placeholder="MUNICÍPIO"
              placeholderStyle={{
                color: '#000000',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              containerStyle={{borderRadius: 8}}
              style={{
                height: 43,
                width: '95%',
                borderColor: '#646464',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              itemTextStyle={{color: '#000000'}}
              selectedTextStyle={{color: '#000000'}}
              iconColor={'#000000'}
              disable={isEnabled === true}
            />
            <Dropdown
              data={neighborhoods}
              labelField="label"
              valueField="value"
              value={neighborhoodSelected}
              onChange={item => {
                setNeighborhoodSelected(item.value);
                filterSortAndUpdateMovementsByNeighborhood(item.value);
              }}
              placeholder="BAIRRO"
              placeholderStyle={{
                color: '#000000',
                fontFamily: 'Inter-Regular',
                fontSize: 17,
              }}
              containerStyle={{borderRadius: 8}}
              style={{
                height: 43,
                width: '95%',
                borderColor: '#646464',
                borderRadius: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                marginTop: '3%',
              }}
              itemTextStyle={{color: '#000000'}}
              selectedTextStyle={{color: '#000000'}}
              iconColor={'#000000'}
              disable={isEnabled === true}
            />
          </>
        ) : (
          ''
        )}
      </View>
      {neighborhoodSelected != '' ||
      municipalitySelected != '' ||
      (neighborhoodSelected == '' && municipalitySelected == '') ? (
        <View style={Styles.SetRouteBoxFilter}>
          <View style={Styles.SetRouteLine}>
            <Text style={Styles.TextFilter}>MONTAR ROTA</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#2974B4' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      ) : (
        <View style={Styles.SetRouteBoxFilter}>
          <View style={Styles.SetRouteLine}>
            <Text style={Styles.TextFilter}>MONTAR ROTA</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#2974B4' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      )}
      <VirtualizedList
        style={{
          width: '100%',
          height: '100%',
        }}
        renderItem={isOn == false ? renderItem : renderItemAbridged}
        initialNumToRender={isOn == false ? 2 : 5}
        keyExtractor={item => item.numero_recibo}
        data={movement}
        showsVerticalScrollIndicator={false}
        getItem={(data, index) => data[index]}
        getItemCount={data => data.length}
      />
      <ModalError
        Title={modalError.Title}
        Message={modalError.Message}
        status={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

export default React.memo(SetRoute);
