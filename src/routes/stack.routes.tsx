import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../screens/Home/Home';
import SetRoute from '../screens/SetRouter/SetRouter';
import {Relatory} from '../screens/Relatory/Relatory';
import NewReceipt from '../screens/NewReceipt/NewReceipt';
import {Map} from '../screens/Map/Map';
import {Setting} from '../screens/Settings/Settings';
import {Printers} from '../screens/Printers/Printers';
import {ReceiptSettings} from '../screens/ReceiptSettings/Receipt';
import {Appearance} from '../screens/Appearance/Appearance';

const {Navigator, Screen} = createNativeStackNavigator();
/**
 * Componente de roteamento da aplicação.
 * Renderiza as rotas apropriadas usando uma pilha de navegação nativa.
 * Este componente define as telas e opções de navegação para cada rota.
 * @returns {JSX.Element} Componente de navegação da aplicação.
 */

export function StackRoutes() {
  return (
    <Navigator>
      {/* Definição de cada tela na pilha de navegação */}
      <Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="MakeRoute"
        component={SetRoute}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Receipt"
        component={NewReceipt}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Relatory"
        component={Relatory}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Settings"
        component={Setting}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Printers"
        component={Printers}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SettingsReceipt"
        component={ReceiptSettings}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SettingsAppearance"
        component={Appearance}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
