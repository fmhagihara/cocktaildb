import React  from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Instructions = ({ navigation }) => {
    // Visualização
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Instruções</Text>
            <View style={styles.paragrafo}>
                <Text style={styles.texto}>
                    Este aplicativo é a segunda avaliação do conteúdo ministrado na disciplina DS151 -
                    Desenvolvimento para Dispositivos Móveis, curso de Tecnologia em Análise e
                    Desenvolvimento de Sistemas da Universidade Federal do Paraná. professor
                    Diego Addan Gonçalves.
                </Text>
                <Text style={styles.texto}>
                    O objetivo do trabalho é a utilização de uma API com um catálogo para ser consumido
                    e os dados alterados. O usuário tipo Administrador insere os dados em um BD SQLite
                    a partir dos dados da API e pode excluí-los. O usuário tipo Usuário pode somente
                    alterar os dados em um formulário.
                </Text>
                <Text style={styles.texto}>
                    A API escolhida é a The Cocktail DB (https://www.thecocktaildb.com/api.php). Ela
                    possui um catálogo de drinks com nome, tipo de copo, ingredientes, receita, etc.{'\n'}
                </Text>
                <Text style={styles.texto}>
                    - Para logar como Administrador:{'\n'}
                    Username: administrador{'\n'}
                    Password: admin123
                </Text>
                <Text style={styles.texto}>
                    - Para logar como Usuário:{'\n'}
                    Username: usuario{'\n'}
                    Password: user123{'\n'}
                </Text>
            </View>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Ir à tela de Login</Text>
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },

    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },

    paragrafo: {
        marginLeft: 10,
        marginBottom: 20,
    },

    texto: {
        textAlign: 'justify',
    },

    link: {
        marginTop: 30,
        height: 50,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});


export default Instructions