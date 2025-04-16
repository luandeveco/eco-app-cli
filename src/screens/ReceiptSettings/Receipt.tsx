import {
  StatusBar,
  ImageBackground,
  View,
  Pressable,
  Image,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
import {Styles} from './Style';
import {useNavigation} from '@react-navigation/native';
import {useState, useRef, useEffect} from 'react';
import {dataSource} from '../../database/database';
import {ReceiptSettings as ReceiptR} from '../../database/entities/ReceiptSettings';
import AccordionMenu from '../../components/AccordionMenu/AccordionMenu';
import BackButton from '../../components/BackButton/BackButton';

export function ReceiptSettings() {
    const [isOn, setIsOn] = useState(false);
    const [assemblyNew, setAssemblyNew] = useState(false);
    const [assemblyOld, setAssemblyOld] = useState(false);
    const animate = useRef(new Animated.Value(isOn ? 1 : 0)).current;
    const animateAssemblyNew = useRef(new Animated.Value(assemblyNew ? 1 : 0)).current;
    const animateAssemblyOld = useRef(new Animated.Value(assemblyOld ? 1 : 0)).current;
    const navigation = useNavigation();

    useEffect(() => {
      settingload();
    }, []);

    useEffect(() => {
      Animated.timing(animate, {
        toValue: isOn ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isOn]);

    useEffect(() => {
      Animated.timing(animateAssemblyNew, {
        toValue: assemblyNew ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [assemblyNew]);

    useEffect(() => {
      Animated.timing(animateAssemblyOld, {
        toValue: assemblyOld ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [assemblyOld]);

    async function settingload() {
      const check = await dataSource
        .getRepository(ReceiptR)
        .createQueryBuilder('SummaryReceipt')
        .orderBy('SummaryReceipt.id', 'DESC')
        .getOne();
      setIsOn(check?.SummaryReceipt);
      setAssemblyNew(check?.AssemblyNew);
      setAssemblyOld(check?.AssemblyOld);
      setTimeout(() => {
        Animated.timing(animate, {
          toValue: check?.SummaryReceipt ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }, 100);
      Animated.timing(animate, {
        toValue: assemblyNew ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(animate, {
        toValue: assemblyOld ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      if(assemblyNew == !assemblyOld){
        setAssemblyOld(assemblyOld => !assemblyOld)
        setSettingSwitchOld(assemblyOld);
        Animated.timing(animateAssemblyOld, {
          toValue: assemblyOld ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      if(assemblyOld == !assemblyNew){
        setAssemblyNew(assemblyNew => !assemblyNew);
        setSettingSwitchNew(assemblyNew);
        Animated.timing(animateAssemblyOld, {
          toValue: assemblyOld ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }

  async function setSetting(option: boolean) {
    const ReceiptCheck = await dataSource
      .getRepository(ReceiptR)
      .createQueryBuilder('SummaryReceipt')
      .orderBy('SummaryReceipt.id', 'DESC')
      .getOne();
    ReceiptCheck.SummaryReceipt = !option;
    await dataSource.getRepository(ReceiptR).save(ReceiptCheck);
  }

  async function setSettingSwitchOld(option: boolean) {
    const ReceiptCheck = await dataSource
      .getRepository(ReceiptR)
      .createQueryBuilder('SummaryReceipt')
      .orderBy('SummaryReceipt.id', 'DESC')
      .getOne();
    ReceiptCheck.AssemblyOld = !option;
    await dataSource.getRepository(ReceiptR).save(ReceiptCheck);
  }

  async function setSettingSwitchNew(option: boolean) {
    const ReceiptCheck = await dataSource
      .getRepository(ReceiptR)
      .createQueryBuilder('SummaryReceipt')
      .orderBy('SummaryReceipt.id', 'DESC')
      .getOne();
    ReceiptCheck.AssemblyNew = !option;
    await dataSource.getRepository(ReceiptR).save(ReceiptCheck);
  }

  function handleReturn() {
    navigation.goBack();
  }

  function toggleSwich() {
    setIsOn(isOn => !isOn);
    setSetting(isOn);
  }

  async function toggleSwitchNew() {
    setAssemblyNew(assemblyNew => !assemblyNew);
    setSettingSwitchNew(assemblyNew);
    if(assemblyNew == false){
      setAssemblyOld(assemblyOld => !assemblyOld)
      setSettingSwitchOld(assemblyOld);
      Animated.timing(animateAssemblyOld, {
        toValue: assemblyOld ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setAssemblyOld(assemblyOld => !assemblyOld)
      setSettingSwitchOld(assemblyOld);
      Animated.timing(animateAssemblyOld, {
        toValue: assemblyOld ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }

  async function toggleSwitchOld() {
    setAssemblyOld(assemblyOld => !assemblyOld);
    setSettingSwitchOld(assemblyOld);
    if(assemblyOld == false){
      setAssemblyNew(assemblyNew => !assemblyNew);
      setSettingSwitchNew(assemblyNew);
      Animated.timing(animateAssemblyNew, {
        toValue: assemblyNew ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setAssemblyNew(assemblyNew => !assemblyNew);
      setSettingSwitchNew(assemblyNew);
      Animated.timing(animateAssemblyNew, {
        toValue: assemblyNew ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }

  const switchTranslate = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const switchTranslateAssemblyNew = animateAssemblyNew.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const switchTranslateAssemblyOld = animateAssemblyOld.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require('../../assets/Background/BackgroungConfig.png')}
        style={Styles.backgroundImage}>
        <ScrollView style={{marginTop: '15%'}}>
          <View style={Styles.Container}>
            {/** Cabeçalho da tela: Botão de voltar e título */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <BackButton onPress={handleReturn}/>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '700',
                  fontSize: 18,
                  marginLeft: '15%',
                }}>
                Recibo
              </Text>
            </View>
          </View>
          {/** Opção de Recibo Resumido */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '8%',
                paddingVertical: '5%',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#000000',
                    fontWeight: '500',
                    marginLeft: '3%',
                    fontSize: 18,
                    paddingLeft: '5%',
                  }}>
                  Recibo Resumido
                </Text>
              </View>
              <View style={Styles.ContainerSwitch}>
                <Pressable
                  style={({pressed}) => [
                    Styles.Outter,
                    isOn
                      ? {backgroundColor: '#5dd55d'}
                      : {backgroundColor: '#bdbebd'},
                  {opacity : pressed ? 0.6 : 1}]}
                  onPress={toggleSwich}>
                  <Animated.View
                    style={[
                      Styles.Inner,
                      {transform: [{translateX: switchTranslate}]},
                    ]}
                  />
                </Pressable>
              </View>
            </View>
          </View>
          {/** Opção de Montrar rota */}
          <AccordionMenu title="Montagem de Rota">
            <View
              style={{
                backgroundColor: 'rgba(211, 211, 211, 0.2)',
                marginTop: '-1%',
              }}>
              {/**Configuração 1 (Nova)*/}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: '5%',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: '500',
                        marginLeft: '3%',
                        fontSize: 14,
                        paddingLeft: '5%',
                      }}>
                      Montar Rota (Nova):
                    </Text>
                  </View>
                  <View style={Styles.ContainerSwitch}>
                    <Pressable
                      style={({pressed}) => [
                        Styles.Outter,
                        assemblyNew
                          ? {backgroundColor: '#5dd55d'}
                          : {backgroundColor: '#bdbebd'},
                      {opacity : pressed ? 0.6 : 1}]}
                      onPress={toggleSwitchNew}>
                      <Animated.View
                        style={[
                          Styles.Inner,
                          {transform: [{translateX: switchTranslateAssemblyNew}]},
                        ]}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
              {/**Configuração 2 (Antiga)*/}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: '5%',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: '500',
                        marginLeft: '3%',
                        fontSize: 14,
                        paddingLeft: '5%',
                      }}>
                      Montar Rota (Antiga):
                    </Text>
                  </View>
                  <View style={Styles.ContainerSwitch}>
                    <Pressable
                      style={({pressed}) => [
                        Styles.Outter,
                        assemblyOld
                          ? {backgroundColor: '#5dd55d'}
                          : {backgroundColor: '#bdbebd'},
                          {opacity : pressed ? 0.6 : 1}
                      ]}
                      onPress={toggleSwitchOld}>
                      <Animated.View
                        style={[
                          Styles.Inner,
                          {transform: [{translateX: switchTranslateAssemblyOld}]},
                        ]}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </AccordionMenu>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
