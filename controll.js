const seque = require('sequelize');
const database = require('./db');


const conta = database.define('conta', {
    id: {
        type: seque.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: seque.STRING,
        allowNull: false,
    },

    dataNascimento: {
        type: seque.DATEONLY
    },
    senha: {
        type: seque.STRING,
        allowNull: true
    },
    email: {
        type: seque.STRING,
        allowNull: true,
        unique: true
    },
    cpf: {
        type: seque.STRING,
        allowNull: true,
        unique: true
    },
    saldo: {
        type: seque.INTEGER,
        allowNull: true
    },
    telefone: {
        type: seque.STRING,
        allowNull: true,
    },
    cep: {
        type: seque.STRING,
        allowNull: true
    },
    rua: {
        type: seque.STRING,
        allowNull: true
    },
    bairro: {
        type: seque.STRING,
        allowNull: true
    },
    uf: {
        type: seque.STRING,
        allowNull: true
    }
});

const Extrato = database.define('Extrato', {
    id: {
        type: seque.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numeroConta: seque.STRING,
    nome: seque.STRING,
    tipoTransacao: seque.STRING,
    valor: seque.INTEGER
});

module.exports =
{
    conta,
    Extrato
};