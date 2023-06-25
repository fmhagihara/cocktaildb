import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { insertDrink, getExistingDrinks } from './database';

const SearchScreen = ({ navigation }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Realiza a busca na API
    const handleSearch = () => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchKeyword}`)
            .then(response => response.json())
            .then(async data => {
                const results = data.drinks || [];
                //console.log(results);
                setSearchResults(results);
            })
            .catch(error => {
                console.log('Erro ao buscar os resultados: ' + error);
            });

    };

    // Para marcar/desmarcar os drinks listados (simula um checkbox)
    const handleToggleSelect = (drinkId) => {
        if (selectedDrinks.includes(drinkId)) {
            setSelectedDrinks(selectedDrinks.filter((id) => id !== drinkId));
        } else {
            setSelectedDrinks([...selectedDrinks, drinkId]);
        }
    };

    // Adicionar os drinks selecionados no BD
    const handleAddSelected = async () => {
        try {
            const selectedIds = searchResults
                .filter((item) => selectedDrinks.includes(item.idDrink))
            let successInserts = 0;
            const insertPromises = selectedIds.map((drink) => {
                const { idDrink, strDrink, strCategory, strAlcoholic, strGlass } = drink;
                console.log('Inserir: ' + idDrink + ' / ' + strDrink + ' / ' + strCategory + ' / ' + strAlcoholic + ' / ' + strGlass);
                return insertDrink(idDrink, strDrink, strCategory, strAlcoholic, strGlass)
                    .then(() => {
                        successInserts += 1;
                        console.log('OK Drink ID ' + idDrink);
                    })
                    .catch(error => {
                        console.log('Erro ao inserir o drink: ' + error);
                    });
            });

            await Promise.all(insertPromises);

            // Desmarca os drinks
            setSelectedDrinks([]);
            setSelectAll(false);

            // Mostra a quantidade de drinks adicionados
            if (successInserts > 0) {
                Alert.alert('Inserção Concluída', `Foram inseridos ${successInserts} registros no BD`);
            }
        } catch (error) {
            console.log('Erro ao inserir os registros: ' + error);
            Alert.alert('Erro', 'Ocorreu um erro ao inserir os registros. Por favor, tente novamente.');
        }

    };

    // Antes de realizar a busca, verifica se a palavra-chave tem pelo menos 3 caracteres
    const handleSearchButton = () => {
        if (searchKeyword.length < 3) {
            Alert.alert('Erro', 'A palavra-chave deve ter pelo menos 3 caracteres.');
            return;
        }

        handleSearch();
    };

    // Visualização
    return (
        <View style={styles.container}>
            <Text style={styles.tituloLista}>Realize uma busca e adicione os itens</Text>
            <Text>Palavra-chave:</Text>
            <TextInput value={searchKeyword} onChangeText={setSearchKeyword} />
            <Button title="Buscar" onPress={handleSearchButton} />
            {searchResults.map((item) => (
                <TouchableOpacity
                    key={item.idDrink}
                    onPress={() => handleToggleSelect(item.idDrink)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                    }}
                >
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: selectedDrinks.includes(item.idDrink)
                                ? 'blue'
                                : 'gray',
                            backgroundColor: selectedDrinks.includes(item.idDrink)
                                ? 'blue'
                                : 'transparent',
                            marginRight: 10,
                        }}
                    />
                    <Text>{item.strDrink}</Text>
                </TouchableOpacity>
            ))}
            {searchResults.length > 0 && (
                <>
                    <Button title="Adicionar" onPress={handleAddSelected} />
                </>
            )}

            <Text>{'\n'}</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    tituloLista: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#0000FF',
    },
    itemContainer: {
        backgroundColor: '#e6e6e6',
        padding: 8,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SearchScreen;