import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import EmpresasScreen from '../screens/EmpresasScreen';
import MenusScreen from '../screens/MenusScreen';
import ClientesScreen from '../screens/ClientesScreen';
import PerfilesScreen from '../screens/PerfilesScreen';
import UsuariosScreen from '../screens/UsuariosScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
            <Text style={{ color: '#2563eb', fontWeight: '700' }}>Salir</Text>
          </TouchableOpacity>
        ),
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Empresas" component={EmpresasScreen} />
      <Tab.Screen name="Menús" component={MenusScreen} />
      <Tab.Screen name="Clientes" component={ClientesScreen} />
      <Tab.Screen name="Perfiles" component={PerfilesScreen} />
      <Tab.Screen name="Usuarios" component={UsuariosScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
