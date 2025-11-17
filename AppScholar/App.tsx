// App.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

import { CepProvider } from './src/contexts/CepContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';

import Login from './src/screens/Login';
import Registro from './src/screens/Registro';

// Novas telas
import Perfil from './src/screens/Perfil';
import Cadastros from './src/screens/Cadastros';
import Boletim from './src/screens/Boletim';

// Botão de sair
import LogoutButton from './src/screens/LogoutButton';

// Guard
import { withGuard } from './src/screens/withGuard';

import type { AppDrawerParamList, AuthStackParamList } from './src/types';

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const Stack = createNativeStackNavigator<AuthStackParamList>();

function AppDrawer() {
  const GuardCadastros = withGuard('Cadastros', Cadastros);
  const GuardBoletim   = withGuard('Boletim', Boletim);

  return (
    <Drawer.Navigator
      initialRouteName="Perfil" // 👈 aqui troquei de ViaCEP para Perfil
      screenOptions={({ route }) => ({
        headerLeft: () => <DrawerToggleButton />,
        headerRight: () => <LogoutButton />,
        drawerIcon: ({ color, size }) => {
          const iconMap: Record<string, any> = {
            Perfil: 'person-circle-outline',
            Cadastros: 'create-outline',
            Boletim: 'document-text-outline',
          };
          const name = iconMap[route.name] ?? 'ellipse';
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{ title: 'Meu Perfil' }}
      />

      <Drawer.Screen
        name="Cadastros"
        component={GuardCadastros}
        options={{ title: 'Cadastros' }}
      />

      <Drawer.Screen
        name="Boletim"
        component={GuardBoletim}
        options={{ title: 'Boletim' }}
      />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
        }}
      >
        <ActivityIndicator size="large" color="#9acd32" />
      </View>
    );
  }

  return token ? <AppDrawer /> : <AuthStack />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CepProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CepProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
