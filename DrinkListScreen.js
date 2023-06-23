import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { listDrinks, removeDrink } from './database';

const DrinkListScreen = ({ navigation }) => {
  const [drinks, setDrinks] = useState([]);

  // Ao carregar a tela, busca os drinks cadastrados no BD
  useEffect(() => {
    listDrinks()
      .then(resultado => {
        setDrinks(resultado);
        console.log(resultado);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Pede confirmação para excluir o item
  const deleteDrink = (id) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDeleteDrink(id),
        },
      ],
      { cancelable: true }
    );
  };

  // Confirma deleção e remove do BD
  const confirmDeleteDrink = (id) => {
    removeDrink(id)
      .then(() => {
        console.log('Item excluído com sucesso');
        // Atualizar a lista de drinks após a exclusão
        listDrinks()
          .then(resultado => {
            setDrinks(resultado);
          })
          .catch(error => {
            console.log('Erro ao obter lista de drinks:', error);
          });
      })
      .catch(error => {
        console.log('Erro ao excluir o item:', error);
      })
  };




  return (
    <View style={styles.container}>
      {drinks.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum drink encontrado.</Text>
      ) : (
        <View>
          <Text style={styles.tituloLista}>Clique no drink a ser excluído</Text>
          <FlatList
            data={drinks}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => deleteDrink(item.id)}>
                <Text style={styles.itemText}>{item.strDrink}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

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

export default DrinkListScreen