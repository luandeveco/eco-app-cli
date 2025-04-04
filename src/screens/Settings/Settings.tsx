import React, {useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
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
              <TouchableOpacity
                style={Styles.LineContainer}
                onPress={handleReturn}>
                <View style={Styles.button}>
                  <Image
                    source={require('../../assets/icons/voltar.png')}
                    style={{maxWidth: 15, height: 15}}
                  />
                  <Text
                    style={{
                      color: '#2974B4',
                      marginLeft: 5,
                      fontWeight: '700',
                      fontSize: 18,
                    }}>
                    Voltar
                  </Text>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '700',
                  fontSize: 18,
                  marginLeft: '15%',
                }}>
                Configurações
              </Text>
            </View>
            {/** Opções */}
            {/** Opção da impressora */}
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '8%',
                  borderBottomWidth: 1,
                  paddingVertical: '5%',
                  justifyContent: 'space-between',
                }}
                onPress={handlePrintes}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/impressora.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '500',
                      marginLeft: '3%',
                      fontSize: 18,
                    }}>
                    Impressora
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/** Opção do Relatório */}
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '2%',
                  borderBottomWidth: 1,
                  paddingVertical: '5%',
                  justifyContent: 'space-between',
                }}
                onPress={handleReceipt}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/relatorio.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '500',
                      marginLeft: '3%',
                      fontSize: 18,
                    }}>
                    Relatório
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/** Opção do Aparência */}
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '2%',
                  borderBottomWidth: 1,
                  paddingVertical: '5%',
                  justifyContent: 'space-between',
                }}
                onPress={handleAppearance}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/icons/iconeAparencia.png')}
                    style={{maxWidth: 20, height: 20, alignItems: 'center'}}
                  />
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '500',
                      marginLeft: '3%',
                      fontSize: 18,
                    }}>
                    Aparência
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/icons/proximaAba.png')}
                    style={{maxWidth: 15, height: 15, alignItems: 'center'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/** Suporte */}
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '2%',
                  borderBottomWidth: 1,
                  paddingVertical: '5%',
                  justifyContent: 'space-between',
                }}
                onPress={modalRedirect}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SimpleLineIcons name="support" color="#2974B4" size={22} />
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '500',
                      marginLeft: '3%',
                      fontSize: 18,
                    }}>
                    Suporte
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {/** Logout */}
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '2%',
                  borderBottomWidth: 1,
                  paddingVertical: '5%',
                  justifyContent: 'space-between',
                }}
                onPress={signOut}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SimpleLineIcons name="logout" color="#B42929" size={22} />
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '500',
                      marginLeft: '3%',
                      fontSize: 18,
                    }}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
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
                <TouchableOpacity
                  style={Styles.ButtonOptionsWhatsapp}
                  onPress={RedirectWhatsapp}>
                  <Text style={Styles.textButtonModel}>Falar com suporte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.ButtonOptionscancel}
                  onPress={() => setContactSupport(false)}>
                  <Text style={Styles.textButtonModel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
}
