import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { getUserByUsername, initDatabase } from './database';
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    verifyUser();
    if (!username || !password) {
      Alert.alert('Aviso', 'Digite usuário e senha!');
    }

    getUserByUsername(username, (error, user) => {
      if (error) {
        console.log('Erro ao buscar usuário:', error);
        return;
      }

      if (user.password === password) {
        // Autenticação bem-sucedida
        const key = 'teste';
        const token = JWT.encode(user, key);

        //console.log('Usuário autenticado com sucesso!')
        //console.log(token);
        console.log(user);

        AsyncStorage.setItem('token', token);


        verifyUser();
      } else {
        // Senha incorreta
        console.log('Senha incorreta');
      }
      setUsername('');
      setPassword('');
    });
  };

  const verifyUser = async () => {
    try {
      // Obtenha o token armazenado no AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const key = 'teste'; // Substitua pela sua chave secreta

        // Decode o token JWT para obter as informações do usuário
        const decodedToken = JWT.decode(token, key);

        // Verifique o tipo de usuário
        const userType = decodedToken.role === 'admin' ? 'admin' : 'user';

        // Redirecione para a tela correta com base no tipo de usuário usando o navigation
        if (userType === 'admin') {
          navigation.navigate('Administrador');
        } else {
          navigation.navigate('Usuário');
        }
      }
    } catch (error) {
      console.log('Erro ao verificar o token:', error);
      // Lógica de tratamento de erro, se necessário
    }
  };


  return (
    <View>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={ text => {
          if (typeof text === 'string') {
            setUsername(text.trim())
          }
        }}
        placeholder="Username"
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
