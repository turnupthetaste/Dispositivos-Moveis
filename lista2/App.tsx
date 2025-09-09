// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList } from './types';
import { CepProvider } from './contexts/CepComtext';
import CepSearch from './screens/viaCep/CepSearch';
import CepHistory from './screens/viaCep/CepHistory';

const Drawer = createDrawerNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <CepProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="ViaCEP">
          <Drawer.Screen name="ViaCEP" component={CepSearch} options={{ title: 'ViaCEP' }} />
          <Drawer.Screen name="CepHistory" component={CepHistory} options={{ title: 'Consultas de CEP' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </CepProvider>
  );
};

export default App;
