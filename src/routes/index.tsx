/**
 * Componente de roteamento da aplicação.
 * Renderiza as rotas apropriadas com base no estado de autenticação do usuário.
 * Se a autenticação estiver em andamento, exibe um indicador de carregamento.
 * @returns {JSX.Element} Componente de navegação da aplicação.
 */
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../contexts/Auth'; // Importa o hook useAuth do contexto de autenticação
import {ActivityIndicator, StatusBar, ImageBackground} from 'react-native';
import {StackRoutes} from './stack.routes'; // Importa as rotas da aplicação quando o usuário está autenticado
import {AuthRoutes} from './auth.routes'; // Importa as rotas da aplicação quando o usuário não está autenticado

export function Routes() {
  const {auth, loading} = useAuth();
  // Verifica se a aplicação está carregando
  if (loading) {
    // Retorna um componente de indicador de carregamento
    return (
      <>
        <StatusBar translucent backgroundColor="transparent" />
        <ImageBackground
          source={require('../assets/Background/BackgroundLogin.png')}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </ImageBackground>
      </>
    );
  }
  // Retorna o componente de navegação da aplicação
  return (
    <NavigationContainer>
      {/* Renderiza as rotas apropriadas com base no estado de autenticação do usuário */}
      {auth ? <StackRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
