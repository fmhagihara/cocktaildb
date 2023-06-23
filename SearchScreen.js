import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { insertDrink, getExistingDrinks } from './database';

const SearchScreen = ({ navigation }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


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

    const handleToggleSelect = (drinkId) => {
        if (selectedDrinks.includes(drinkId)) {
            setSelectedDrinks(selectedDrinks.filter((id) => id !== drinkId));
        } else {
            setSelectedDrinks([...selectedDrinks, drinkId]);
        }
    };

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

            setSelectedDrinks([]);
            setSelectAll(false);

            if (successInserts > 0) {
                Alert.alert('Inserção Concluída', `Foram inseridos ${successInserts} registros no BD`);
            }
        } catch (error) {
            console.log('Erro ao inserir os registros: ' + error);
            Alert.alert('Erro', 'Ocorreu um erro ao inserir os registros. Por favor, tente novamente.');
        }

    };

    const handleSearchButton = () => {
        if (searchKeyword.length < 3) {
            Alert.alert('Erro', 'A palavra-chave deve ter pelo menos 3 caracteres.');
            return;
        }

        handleSearch();
    };

    return (
        <View>
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

            <Button title="Adicionar" onPress={handleAddSelected} />
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default SearchScreen;