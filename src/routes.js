const express = require('express');
const inter = require('../intermediary');
const rotas = express();

rotas.get('/procurar/:id', inter.procurarConta);
rotas.get('/extrato/:id', inter.verificarExtrato);
rotas.delete('/excluir/:id', inter.excluirConta);
rotas.get('/saldo/:id', inter.verificarSaldo);
rotas.post('/criar', inter.criarConta);
rotas.put('/alterar/:id', inter.alterarConta);
rotas.post('/depositar/:id', inter.depositarConta);
rotas.post('/sacar/:id', inter.sacarSaldo);
rotas.post('/transf/:id', inter.transferencia);

module.exports = rotas;