const { buscarEndereco } = require('utils-playground');
const db = require('./db');
const conta = require('./controll');

const criarConta = async (req, res) => {
    await db.sync();
    const { cep, nome, senha, email, cpf, telefone, dataNascimento } = req.body;
    const local = await buscarEndereco(String(cep));

    if (!nome) {
        return res.status(404).json({ mensagem: "O nome não foi informado. " });
    }

    if (!telefone) {
        return res.status(404).json({ mensagem: "O telefone não foi informado. " });
    }

    if (!cep) {
        return res.status(404).json({ mensagem: "O cep não foi informado. " });
    }

    if (!cpf) {
        return res.status(404).json({ mensagem: "O cpf não foi informado. " });
    }

    if (!dataNascimento) {
        return res.status(404).json({ mensagem: "A data de nascimento não foi informado. " });
    }

    if (!email) {
        return res.status(404).json({ mensagem: "O email não foi informado. " });
    }

    if (!senha) {
        return res.status(404).json({ mensagem: "A senha não foi informado. " });
    }

    if (cep.length !== 8) {
        return res.status(404).json({ mensagem: "CEP inválido. " });
    }

    if (cpf.length !== 11) {
        return res.status(404).json({ mensagem: "CPF inválido. " });
    }

    if (telefone.length !== 11) {
        return res.status(404).json({ mensagem: "Número inválido. " });
    }

    const novaConta = await conta.conta.create({
        nome,
        dataNascimento,
        senha,
        email,
        cpf,
        saldo: 0,
        telefone,
        cep: local.cep,
        rua: local.logradouro,
        bairro: local.bairro,
        uf: local.uf
    });

    res.send();
};

const excluirConta = async (req, res) => {
    db.sync();
    const { id } = req.params
    const contaAchada = await conta.conta.findByPk(id);
    const excluirExtrato = await conta.Extrato.findOne({ where: { numeroConta: id } });

    if (!contaAchada) {
        res.json("nao localizada. ")
    }

    if (excluirExtrato) {
        let guardar = excluirExtrato.id
        const excluirExtratoId = await conta.Extrato.findOne({ where: { id: guardar } })
        await excluirExtratoId.destroy();
        return res.json({ mensagem: "Conta excluida. " });
    }
    await contaAchada.destroy();

    res.send();
}

const procurarConta = async (req, res) => {
    await db.sync();
    const { id } = req.params;

    const contaAchada = await conta.conta.findByPk(id);

    if (!contaAchada ? res.json("Conta não localizada. ") : res.json(contaAchada));

    res.send();
}

const alterarConta = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const { nome, senha, email, telefone, cep, bairro, rua, uf } = req.body;
    const contaAchada = await conta.conta.findByPk(id);

    if (nome) {
        contaAchada.nome = nome;
        contaAchada.save();
        console.log("Mudei o nome");
    } else {
        contaAchada.nome = contaAchada.nome;
        contaAchada.save();
    }

    if (email) {
        contaAchada.email = email;
        contaAchada.save();
        console.log("Mudei o email");
    } else {
        contaAchada.email = contaAchada.email;
        contaAchada.save();
    }

    if (senha) {
        contaAchada.senha = senha;
        contaAchada.save();
        console.log("Mudei o senha");
    } else {
        contaAchada.senha = contaAchada.senha;
        contaAchada.save();
    }

    if (telefone) {
        contaAchada.telefone = telefone;
        contaAchada.save();
        console.log("Mudei o telefone");
    } else {
        contaAchada.telefone = contaAchada.telefone
        contaAchada.save();
    }

    if (cep) {
        contaAchada.cep = cep;
        const local = await buscarEndereco(cep);
        if (local) {
            contaAchada.rua = local.logradouro
            contaAchada.bairro = local.bairro
            contaAchada.uf = local.uf
            contaAchada.save();
            console.log("Mudei o cep");
        }
    } else {
        contaAchada.cep = contaAchada.cep
        contaAchada.save();
    }

    if (uf) {
        contaAchada.uf = contaAchada.uf;
        contaAchada.save();
        console.log("Mudei o uf");
    } else {
        contaAchada.uf = contaAchada.uf
        contaAchada.save();
    }

    if (rua) {
        contaAchada.rua = crua;
        contaAchada.save();
        console.log("Mudei o rua");
    } else {
        contaAchada.rua = rua;
        contaAchada.save();
    }

    if (bairro) {
        contaAchada.bairro = bairro;
        contaAchada.save();
        console.log("Mudei o bairro");
    } else {
        contaAchada.bairro = contaAchada.bairro
        contaAchada.save();
    }

    res.send();
}

const depositarConta = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const { deposito } = req.body;
    const contaAchada = await conta.conta.findByPk(id);

    if (!contaAchada) {
        return res.json("Conta não localizada. ")
    }

    if (deposito <= 0 || deposito !== Number(deposito)) {
        return res.json("Valor informado invalido. ")
    } else {
        const total = contaAchada.saldo + deposito;
        contaAchada.saldo = total;
        contaAchada.save();
    }

    const novaConta = await conta.Extrato.create({
        numeroConta: contaAchada.id,
        nome: contaAchada.nome,
        valor: deposito,
        tipoTransacao: "Deposito"
    });

    res.send();
}

const sacarSaldo = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const { saque } = req.body;
    const contaAchada = await conta.conta.findByPk(id);

    if (!contaAchada) {
        return res.json("Conta não localizada. ")
    }

    const total = contaAchada.saldo - saque;

    if (saque <= contaAchada.saldo) {
        contaAchada.saldo = total;
        contaAchada.save();
    } else {
        res.json("Saldo insuficiente. ")
    }

    const novaConta = await conta.Extrato.create({
        numeroConta: contaAchada.id,
        nome: contaAchada.nome,
        valor: saque,
        tipoTransacao: "Saque"
    });

    res.send();
}

const transferencia = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const { usuario, valor } = req.body;
    const usuarioAEnviar = await conta.conta.findByPk(usuario);
    const idAreceber = await conta.conta.findByPk(id);


    const valorDebitar = usuarioAEnviar.saldo - valor;
    const valorAReceber = idAreceber.saldo + valor;

    if (usuarioAEnviar.saldo >= valor) {
        usuarioAEnviar.saldo = valorDebitar;
        usuarioAEnviar.save();
        if (idAreceber) {
            idAreceber.saldo = valorAReceber
            idAreceber.save();
        }

        if (valorDebitar) {
            const novaConta = await conta.Extrato.create({
                numeroConta: usuarioAEnviar.id,
                nome: usuarioAEnviar.nome,
                valor: valor,
                tipoTransacao: "Transf Realizada."
            });
        }

        if (idAreceber) {
            const novaConta = await conta.Extrato.create({
                numeroConta: idAreceber.id,
                nome: idAreceber.nome,
                valor: valor,
                tipoTransacao: "Transf Recebida."
            });
        }
    } else {
        return res.json({ mensagem: "Valor insuficiente. " })
    }

    res.send();
}

const verificarSaldo = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const contaAchada = await conta.conta.findByPk(id)

    if (!contaAchada ? res.json("Conta não localizada. ") : res.json(`O saldo disponível é de ${contaAchada.saldo}`));
}

const verificarExtrato = async (req, res) => {
    await db.sync();
    const { id } = req.params;
    const idConta = await conta.conta.findByPk(id);
    const contaAchada = await conta.Extrato.findAll({ where: { numeroConta: id } });

    if (!idConta ? res.json("Conta não localizada. ") : res.json(contaAchada));
}

module.exports = { criarConta, procurarConta, alterarConta, depositarConta, sacarSaldo, transferencia, verificarSaldo, excluirConta, verificarExtrato }