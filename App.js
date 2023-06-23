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
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Administrador" component={AdminScreen}  options={{ headerLeft: null }}/>
          <Stack.Screen name="Buscar e importar" component={SearchScreen} />
          <Stack.Screen name="Lista de drinks" component={DrinkListScreen} options={{ headerLeft: null }} />
          <Stack.Screen name="Usuário" component={UserScreen} options={{ headerLeft: null }}/>
          <Stack.Screen name="Editar drink" component={EditDrinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
