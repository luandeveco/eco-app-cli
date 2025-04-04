import { AuthProvider } from "./contexts/Auth";
import { FilterProvider } from "./contexts/Filter";
import { Routes } from "./routes";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return(
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <FilterProvider>
          <Routes/>
        </FilterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

export default App;
