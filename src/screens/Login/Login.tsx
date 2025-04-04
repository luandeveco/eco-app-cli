import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  //NativeModules,
} from 'react-native';
import {useAuth} from '../../contexts/Auth';
import {Styles} from './Style';
import {TextInput} from 'react-native-gesture-handler';
import {requestLocationPermission} from '../../components/Permissions';

//const {VersionModule} = NativeModules;

function Login() {
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [modalError, setModalError] = useState({Title: '', Message: ''});
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  //const [versionName, setVersionName] = useState<string>('');
  const {signIn} = useAuth();
  const passwordInputRef = useRef(null);
  useEffect(() => {
    requestLocationPermission();
    // Adiciona ouvinte para o evento de teclado aparecendo
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    // Adiciona ouvinte para o evento de teclado desaparecendo
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    // Remove os ouvintes de evento quando o componente é desmontado
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   VersionModule.getVersionName()
  //     .then((version: string) => {
  //       setVersionName(version);
  //     })
  //     .catch((error: any) => {
  //       console.error(error);
  //     });
  // }, []);

  function handleLogin() {
    if (!codigo || !senha) {
      setModalError({
        Title: 'Credenciais Inválidas',
        Message: 'Digite código ou senha',
      });
      setModalVisible(true);
      return; // Impede a execução adicional
    }
    signIn(codigo, senha);
  }

  function keyboardDidShow(event) {
    // Atualiza o estado com a altura do teclado
    setKeyboardVerticalOffset(event.endCoordinates.height);
  }

  function keyboardDidHide() {
    // Reseta o estado para zero quando o teclado é fechado
    setKeyboardVerticalOffset(0);
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible(prev => !prev);
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/Background/BackgroundLogin.png')}
        style={Styles.backgroundImage}>
        <KeyboardAvoidingView
          style={Styles.container}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <Image
            style={Styles.Logo}
            source={require('../../assets/img/LogoEcoBranco.png')}
            alt="Logo da Eco Consultoria"
            resizeMode="contain"
          />
          <Text style={Styles.textTitle}>Seja bem-vindo(a)!</Text>
          <View style={Styles.iconTextContainer}>
            <Image
              source={require('../../assets/iconsWhite/iconUser.png')}
              style={Styles.icon}
            />
            <Text style={Styles.text}>Código do usuário</Text>
          </View>
          <TextInput
            style={Styles.InputArea}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            value={codigo}
            onChangeText={setCodigo}
            cursorColor={'#ffffff'}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInputRef.current.focus();
            }}
          />
          <View style={Styles.iconTextContainer}>
            <View style={Styles.inputContainer}>
              <View style={Styles.iconTextContainer}>
                <Image
                  source={require('../../assets/iconsWhite/iconPassword.png')}
                  style={Styles.icon}
                />
                <Text style={Styles.text}>Senha</Text>
              </View>
              <TextInput
                ref={passwordInputRef}
                style={Styles.InputArea}
                underlineColorAndroid="transparent"
                keyboardType={'default'}
                value={senha}
                onChangeText={setSenha}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                secureTextEntry={!isPasswordVisible}
                cursorColor={'#ffffff'}
              />
              <TouchableOpacity
                style={Styles.showPasswordButton}
                onPress={togglePasswordVisibility}>
                <Image
                  source={
                    isPasswordVisible
                      ? require('../../assets/iconsWhite/eyeIcon.png')
                      : require('../../assets/iconsWhite/eyeIconNot.png')
                  }
                  style={Styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={Styles.boxButton}
            onPress={() => handleLogin()}>
            <Text style={Styles.textBotton}>Entrar</Text>
          </TouchableOpacity>
          <View style={Styles.containerVersion}>
            <Text style={Styles.versionText}>V {'versionName'}</Text>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

export default Login;
