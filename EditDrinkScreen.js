import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getDrinkById, saveDrink } from './database';

const EditDrink = ({ route, navigation }) => {
    const [drink, setDrink] = useState(null);

    useEffect(() => {
        const { id } = route.params;
        getDrinkById(id)
            .then(result => {
                setDrink(result);
            })
            .catch(error => {
                console.log('Erro ao obter o drink:', error);
            });
    }, [route.params]);

    if (!drink) {
        return null; // ou exiba um componente de carregamento enquanto aguarda a busca do drink
    }

    const { idDrink, strDrink, strCategory, strAlcoholic, strGlass } = drink;

    const handleSave = () => {
        // Chamar a função saveDrink para atualizar os dados no banco de dados
        saveDrink(idDrink, strDrink, strCategory, strAlcoholic, strGlass)
            .then(() => {
                console.log('Drink atualizado com sucesso');
                Alert.alert('Sucesso', 'Dados do drink atualizados com sucesso!');
            })
            .catch(error => {
                console.log('Erro ao atualizar o drink:', error);
                Alert.alert('Erro', 'Ocorreu um erro ao atualizar os dados do drink. Por favor, tente novamente.');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.tituloLista}>Editar drink</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                    style={styles.input}
                    value={strDrink}
                    onChangeText={text => setDrink({ ...drink, strDrink: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Categoria:</Text>
                <TextInput
                    style={styles.input}
                    value={strCategory}
                    onChangeText={text => setDrink({ ...drink, strCategory: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Alcoólico:</Text>
                <TextInput
                    style={styles.input}
                    value={strAlcoholic}
                    onChangeText={text => setDrink({ ...drink, strAlcoholic: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de Copo:</Text>
                <TextInput
                    style={styles.input}
                    value={strGlass}
                    onChangeText={text => setDrink({ ...drink, strGlass: text })}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <Text>{'\n'}</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tituloLista: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#0000FF',
    },
});

export default EditDrink;
