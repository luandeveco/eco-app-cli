import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login/Login';

const {Navigator, Screen} = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{
      headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: 'white',
      }}>
      <Screen name="Login" component={Login} options={{headerShown: false}}/>
    </Navigator>
  );
}
