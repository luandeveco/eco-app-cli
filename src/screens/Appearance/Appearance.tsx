import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  Pressable,
  View,
  Image,
  useColorScheme
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Styles} from './Style';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../theme/Theme';
import { dataSource } from '../../database/database';
import { ReceiptSettings } from '../../database/entities/ReceiptSettings';
import BackButton from '../../components/BackButton/BackButton';

export function Appearance() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [fontSize, setFontSizeState] = useState<number>(16);
  useEffect(()=> {
    getFontSize()
  }, [])

  async function getFontSize() {
    const fontSizeRepository = dataSource.getRepository(ReceiptSettings);
    const fontSize = await fontSizeRepository.findOne({ where: { id: 1 } });
    setFontSizeState(fontSize.sizeFont)
  }

  function handleReturn() {
    navigation.goBack();
  }

  const increaseFontSize = async () => {
    setFontSizeState((prev) => {
      const newSize = prev < MAX_FONT_SIZE ? prev + 1 : prev;
      setFontSize(newSize)
      return newSize;
    });
  };

  const setFontSize = async (size: number): Promise<void> => {
    const fontSizeRepository = dataSource.getRepository(ReceiptSettings);
    let fontSize = await fontSizeRepository.findOne({where: { id: 1 }});
    fontSize.sizeFont = size;
    await fontSizeRepository.save(fontSize);
  };

  const decreaseFontSize = async () => {
    setFontSizeState((prev) => {
      const newSize = prev > MIN_FONT_SIZE ? prev - 1 : prev;
      setFontSize(newSize)
      return newSize;
    });
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <ImageBackground
        source={require('../../assets/Background/BackgroungConfig.png')}
        style={Styles.backgroundImage}>
        {/** Cabeçalho da tela: Botão de voltar e título */}
        <View style={Styles.Container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '15%',
            }}>
            <BackButton onPress={handleReturn}/>
            <Text
              style={{
                color: '#000000',
                fontWeight: '700',
                fontSize: 18,
                marginLeft: '15%',
              }}>
              Aparência
            </Text>
          </View>
        </View>
        {/** Opções */}
        <View style={{marginTop: '5%', paddingHorizontal: '5%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '25%'
            }}>
            <Text style={Styles.text}>Tela de Recibo</Text>
            <View style={Styles.containerSetAparencia}>
              <Pressable onPress={decreaseFontSize} style={({pressed}) => [Styles.setPress, {opacity: pressed ? 0.6 : 1}]}>
                <Text style={{color: isDarkMode ? '#000000' : '#000000', fontSize: 24}}>-</Text>
              </Pressable>
              <Text style={{color: '#000000', fontWeight: '700'}}>{fontSize}</Text>
              <Pressable onPress={increaseFontSize} style={({pressed}) => [Styles.setPress, {opacity: pressed ? 0.6 : 1}]}>
                <Text style={{color: isDarkMode ? '#000000' : '#000000', fontSize: 18}}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}
