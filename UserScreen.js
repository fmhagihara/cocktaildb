import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { listDrinks } from './database';

const UserScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    // Obter o nome de usuário do async storage ou de onde estiver armazenado
    // e atribuir ao estado "username"
    let nome_usuario = 'sem_nome';
    const getToken = async () => {
      try {
        // Obtenha o token armazenado no AsyncStorage
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        if (token) {
          const key = 'teste'; // Substitua pela sua chave secreta

          // Decode o token JWT para obter as informações do usuário
          const decodedToken = JWT.decode(token, key);
          console.log(decodedToken);
          // Verifique o tipo de usuário
          nome_usuario = decodedToken.name;
          setUsername(nome_usuario);
        }
        else console.log('token nao encontrado');
      }
      catch (error) {
        console.log('Erro ao verificar o token:', error);
      }
    };
    getToken();
  }, []);


  useEffect(() => {
    // Busca os drinks do BD
    const fetchDrinks = async () => {
      try {
        const drinksData = await listDrinks();
        setDrinks(drinksData);
      } catch (error) {
        console.log('Erro ao obter a lista de drinks:', error);
      }
    };

    fetchDrinks();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      // Redirecionar para a tela de login ou outra tela desejada
      navigation.navigate('LoginScreen');
      Alert.alert('Logout', 'Você saiu do sistema');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  const handleEditDrink = (id) => {
    navigation.navigate('Editar drink', { id });
  };

  // Para aparecer lista com nome e botão de editar ao lado
  const renderDrinkItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ flex: 1, fontSize: 16  }}>- {item.strDrink}</Text>
        <TouchableOpacity onPress={() => handleEditDrink(item.id)}>
          <Text style={{ color: 'blue' }}>Editar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18 }}>Bem-vindo(a), {username}</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ fontSize: 16, color: 'red' }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.text}>Drinks cadastrados:</Text>
        {drinks.length > 0 ? (
        <FlatList
          data={drinks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDrinkItem}
        />
      ) : (
        <Text>Nenhum drink encontrado.</Text>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserScreen;
