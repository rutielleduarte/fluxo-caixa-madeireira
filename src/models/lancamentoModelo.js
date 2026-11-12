
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/bd');

// Modelo da tabela lancamento
const Lancamento = sequelize.define('Lancamento', {
    id_lancamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    tipo_lancamento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['entrada', 'saida']]
        }
    },

    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },

    data_lancamento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    forma_pagamento: {
        type: DataTypes.STRING(30),
        allowNull: true
    },

    observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_conta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: 'lancamento',
    timestamps: false
});


// 1. Cadastrar lançamento
async function cadastrarLancamento(dados) {
    return await Lancamento.create(dados);
}


// 2. Listar lançamentos
async function listarLancamentos() {
    return await Lancamento.findAll();
}


// 3. Buscar lançamento por ID
async function buscarLancamentoPorId(id) {
    return await Lancamento.findByPk(id);
}


// 4. Buscar por descrição
async function buscarPorDescricao(texto) {
    return await Lancamento.findAll({
        where: {
            descricao: {
                [Op.like]: `%${texto}%`
            }
        }
    });
}


// 5. Buscar por valor
async function buscarPorValor(valor) {
    return await Lancamento.findAll({
        where: {
            valor: valor
        }
    });
}


// 6. Atualizar lançamento
async function atualizarLancamento(id, dados) {
    const lancamento = await Lancamento.findByPk(id);

    if (!lancamento) {
        return "Lançamento não encontrado!";
    }

    await lancamento.update(dados);

    return lancamento;
}


// 7. Excluir lançamento
async function excluirLancamento(id) {
    const lancamento = await Lancamento.findByPk(id);

    if (!lancamento) {
        return "Lançamento não encontrado!";
    }

    await lancamento.destroy();

    return "Lançamento excluído com sucesso!";
}


// Exportar as funções
module.exports = {
    Lancamento,
    cadastrarLancamento,
    listarLancamentos,
    buscarLancamentoPorId,
    buscarPorDescricao,
    buscarPorValor,
    atualizarLancamento,
    excluirLancamento
};
