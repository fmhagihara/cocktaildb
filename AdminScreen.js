import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { truncateTableDrinks } from './database';

const AdminScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Obter o nome de usuário do async storage
        let nome_usuario = 'sem_nome';
        const getToken = async () => {
            try {
                // Obtenha o token armazenado no AsyncStorage
                const token = await AsyncStorage.getItem('token');
                console.log(token);
                if (token) {
                    const key = 'teste';

                    // Decode o token JWT para obter as informações do usuário
                    const decodedToken = JWT.decode(token, key);
                    console.log(decodedToken);

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

    // Logout. Remove token do AsyncStorage e direciona para a tela de Login
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');

            navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao fazer logout:', error);
        }
    };


    // Visualização
    return (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18 }}>Bem-vindo(a), {username}</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ fontSize: 16, color: 'red' }}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Buscar e importar')}>
                    <Text style={styles.buttonText}>Buscar dados na API</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Lista de drinks')}>
                    <Text style={styles.buttonText}>Listar Drinks</Text>
                </TouchableOpacity></View>
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminScreen;
