import * as SQLite from 'expo-sqlite';

// Abrir/criar o banco de dados SQLite
const db = SQLite.openDatabase('meubanco.db');

// Cria a tabela "users" se ainda não existir
export const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, name TEXT, password TEXT NOT NULL, role TEXT NOT NULL);',
            [],
            () => console.log('Tabela criada com sucesso'),
            error => console.log('Erro ao criar a tabela: ', error)
        );
    });
};


// Insere usuários iniciais
export const insertUser = () => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
            ['administrador', 'Administrador', 'admin123', 'admin', 'usuario', 'Usuário', 'user123', 'user'],
            () => console.log('Usuários inseridos com sucesso'),
            error => console.log('Erro ao inserir usuário: ', error)
        );
    });
};

// Busca usuário por username (login)
export const getUserByUsername = (username, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (_, { rows }) => {
                if (rows.length > 0) {
                    const user = rows.item(0);
                    callback(null, user);
                } else {
                    const error = new Error('Usuário não encontrado');
                    callback(error, null);
                }
            },
            error => {
                callback(error, null);
            }
        );
    });
};


// Cria a tabela de drinks, se já não existir
const createTableDrinks = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS drinks (id INTEGER PRIMARY KEY AUTOINCREMENT, idDrink TEXT UNIQUE, strDrink TEXT, strCategory TEXT, strAlcoholic TEXT, strGlass TEXT);',
            [],
            () => {
                console.log('Tabela "drinks" criada com sucesso');
            },
            (_, error) => {
                console.log('Erro ao criar tabela: ' + error);
            }
        );
    });
};

// Limpa a tabela de drinks. Usada somente no ambiente de desenvolvimento
export const truncateTableDrinks = () => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM drinks; DELETE FROM SQLITE_SEQUENCE WHERE name='drinks';`,
            [],
            () => {
                console.log('Tabela "drinks" limpa com sucesso');
            },
            (_, error) => {
                console.log('Erro ao limpar tabela: ' + error);
            }
        );
    });
};

// Insere drink
export const insertDrink = (idDrink, strDrink, strCategory, strAlcoholic, strGlass) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO drinks (idDrink, strDrink, strCategory, strAlcoholic, strGlass) VALUES (?, ?, ?, ?, ?)',
                [idDrink, strDrink, strCategory, strAlcoholic, strGlass],
                (_, { insertId }) => {
                    resolve(insertId);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

// Exclui drink
export const removeDrink = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM drinks WHERE id = ?',
                [id],
                (_, result) => {
                    const rowsAffected = result.rowsAffected;

                    if (rowsAffected > 0) {
                        resolve();
                    } else {
                        reject(new Error('Falha ao excluir o drink. Item não encontrado.'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

// Listar drinks
export const listDrinks = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM drinks',
                [],
                (_, result) => {
                    const drinks = [];
                    const rows = result.rows;

                    for (let i = 0; i < rows.length; i++) {
                        drinks.push(rows.item(i));
                    }

                    resolve(drinks);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

// Busca drink pelo ID
export const getDrinkById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM drinks WHERE id = ?',
                [id],
                (_, { rows }) => {
                    const drink = rows.item(0);

                    if (drink) {
                        resolve(drink);
                    } else {
                        reject(new Error('Drink não encontrado.'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

// Atualiza drink
export const saveDrink = (idDrink, strDrink, strCategory, strAlcoholic, strGlass) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE drinks SET strDrink=?, strCategory=?, strAlcoholic=?, strGlass=? WHERE idDrink=?',
                [strDrink, strCategory, strAlcoholic, strGlass, idDrink],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve();
                    } else {
                        reject(new Error('Falha ao atualizar o drink. Item não encontrado.'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export default db;

// Chamado no início do programa. Cria as tabelas e insere os usuários iniciais
export const initDatabase = () => {
    createTable();
    insertUser();
    createTableDrinks();
    console.log('initDatabase');
};