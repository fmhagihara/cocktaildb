import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { truncateTableDrinks } from './database';

const AdminScreen = ({ navigation }) => {

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');

            navigation.navigate('LoginScreen');
        } catch (error) {
            console.log('Erro ao fazer logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bem-vindo, Administrador!</Text>
            <Button title="Buscar dados na API" onPress={() => navigation.navigate('Buscar e importar')} />
            <Button title="Listar Drinks" onPress={()=>navigation.navigate('Lista de drinks')} />

            <Button title="Logout" onPress={handleLogout} />
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
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AdminScreen;
