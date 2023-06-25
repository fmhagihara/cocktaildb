import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { getUserByUsername } from './database';
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
        // Autenticação bem-sucedida. Codifica o usuário e salva no token, que ficará armazenado no AsyncStorage
        const key = 'teste';
        const token = JWT.encode(user, key);

        //console.log('Usuário autenticado com sucesso!')
        //console.log(token);
        //console.log(user);

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

  // Verifica o usuário, direcionando para a tela inicial correta
  const verifyUser = async () => {
    try {
      // Obter o token armazenado no AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const key = 'teste';

        // Decode o token JWT para obter as informações do usuário
        const decodedToken = JWT.decode(token, key);

        // Verifica o tipo de usuário
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
    }
  };

  // Visualização
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo_thecocktaildb.png')} style={styles.image} />

      <View style={styles.form}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => {
            if (typeof text === 'string') {
              setUsername(text.trim())
            }
          }}
          placeholder="Username"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} />

      </View>
      <View>
        <Text style = {styles.instrucoes} onPress={() => navigation.navigate('Instruções')}>Instruções</Text>

        <Text>{'\n'}Autor: Fernando Massaki Hagihara</Text>
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  instrucoes: {
    marginTop: 30,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
