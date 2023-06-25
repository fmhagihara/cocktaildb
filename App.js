import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import AdminScreen from './AdminScreen';
import UserScreen from './UserScreen';
import SearchScreen from './SearchScreen';
import DrinkListScreen from './DrinkListScreen';
import EditDrinkScreen from './EditDrinkScreen';
import Instructions from './Instructions';
import { initDatabase } from './database';
import { SafeAreaView, Constants } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{header: () => null}} />
          <Stack.Screen name="Administrador" component={AdminScreen} options={{header: () => null}} />
          <Stack.Screen name="Buscar e importar" component={SearchScreen}  options={{header: () => null}} />
          <Stack.Screen name="Lista de drinks" component={DrinkListScreen} options={{header: () => null}} />
          <Stack.Screen name="Usuário" component={UserScreen} options={{header: () => null}} />
          <Stack.Screen name="Editar drink" component={EditDrinkScreen} options={{header: () => null}} />
          <Stack.Screen name="Instruções" component={Instructions} options={{header: () => null}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
