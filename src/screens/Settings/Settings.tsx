import React, {useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  Pressable,
  View,
  Image,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Styles} from './Style';
import {NavigationProp} from '../../routes/Interfaces/NavigationTypes';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {dataSource} from '../../database/database';
import {InstitutionInformation} from '../../database/entities/InstitutionInformation';
import {useAuth} from '../../contexts/Auth';
import BackButton from '../../components/BackButton/BackButton';

export function Setting() {
  const [contactSupport, setContactSupport] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const {signOut} = useAuth();

  function handleReturn() {
    navigation.goBack();
  }

  function handlePrintes() {
    navigation.navigate('Printers');
  }

  function handleReceipt() {
    navigation.navigate('SettingsReceipt');
  }

  function modalRedirect() {
    setContactSupport(true);
  }

  async function RedirectWhatsapp() {
    setContactSupport(false);
    const lastInstitutionInfo = await dataSource
      .getRepository(InstitutionInformation)
      .findOne({where: {id: 1}});
    const phone = lastInstitutionInfo.NumeroSuporte;
    return Linking.openURL(`whatsapp://send?phone=${phone}`);
  }

  function handleAppearance() {
    navigation.navigate('SettingsAppearance');
  }

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={
          contactSupport == true ? 'rgba(37, 150, 190,0.7)' : 'transparent'
        }
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
              {/* <Pressable
                style={({pressed}) => [Styles.LineContainer, {opacity : pressed ? 0.6 : 1}]}
                onPress={handleReturn}>
                <View style={Styles.button}>
                  <Image
                    source={require('../../assets/icons/voltar.png')}
                    style={{maxWidth: 15, height: 15}}
                  />
                  <Text style={{color: '#2974B4', marginLeft: 5,fontWeight: '700',fontSize: 18,}}>
                    Voltar
                  </Text>
                </View>
              </Pressable> */}
              <Text style={{ color: '#000000', fontWeight: '700',fontSize: 18, marginLeft: '15%'}}>
                Configurações
              </Text>
            </View>
            {/** Opções */}
            {/** Opção da impressora */}
            <View style={{marginTop:'6%'}}>
              <Pressable style={({pressed}) => [Styles.buttonConfig, {opacity : pressed ? 0.6 : 1}]}
                onPress={handlePrintes}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/impressora.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={Styles.titleConfig}>
                    Impressora
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </Pressable>
            </View>
            {/** Opção do Relatório */}
            <View>
              <Pressable style={({pressed}) => [Styles.buttonConfig,{opacity : pressed ? 0.6 : 1}]}
                onPress={handleReceipt}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/relatorio.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={Styles.titleConfig}>
                    Relatório
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </Pressable>
            </View>
            {/** Opção do Aparência */}
            <View>
              <Pressable style={({pressed}) => [Styles.buttonConfig,{opacity : pressed ? 0.6 : 1}]}
                onPress={handleAppearance}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/iconeAparencia.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={Styles.titleConfig}>
                    Aparência
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </Pressable>
            </View>
            {/** Suporte */}
            <View>
              <Pressable style={({pressed}) => [Styles.buttonConfig, {opacity : pressed ? 0.6 : 1}]}
                onPress={modalRedirect}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SimpleLineIcons name="support" color="#2974B4" size={22} />
                  <Text
                    style={Styles.titleConfig}>
                    Suporte
                  </Text>
                </View>
              </Pressable>
            </View>
            {/** Logout */}
            <View>
              <Pressable style={({pressed}) => [Styles.buttonConfig,{opacity : pressed ? 0.6 : 1}]}
                onPress={signOut}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SimpleLineIcons name="logout" color="#B42929" size={22} />
                  <Text
                    style={Styles.titleConfig}>
                    Logout
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {/** Modal do contato do suporte */}
        <Modal animationType="none" transparent={true} visible={contactSupport}>
          <View style={Styles.model}>
            <View style={Styles.modelCenter}>
              <Text style={Styles.TitleModel}>
                Você será direcionado para o Whatsapp
              </Text>
              <View style={Styles.buttonOptions}>
                <Pressable style={({pressed}) => [Styles.ButtonOptionsWhatsapp, {opacity : pressed ? 0.6 : 1}]}
                  onPress={RedirectWhatsapp}>
                  <Text style={Styles.textButtonModel}>Falar com suporte</Text>
                </Pressable>
                <Pressable style={({pressed}) => [Styles.ButtonOptionscancel,{opacity : pressed ? 0.6 : 1}]}
                  onPress={() => setContactSupport(false)}>
                  <Text style={Styles.textButtonModel}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
}
