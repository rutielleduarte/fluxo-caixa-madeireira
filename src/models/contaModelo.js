const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Conta = sequelize.define('Conta', {
    id_conta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_conta: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo_conta: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    saldo_inicial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'ativo',
        validate: {
            isIn: [['ativo', 'inativo']]
        }
    }
}, {
    tableName: 'conta',
    timestamps: false
});

async function listarContasAtivas() {
    return await Conta.findAll({
        where: { status: 'ativo' },
        order: [['nome_conta', 'ASC']]
    });
}

async function cadastrarConta(dados) {
    return await Conta.create(dados);
}

module.exports = {
    Conta,
    listarContasAtivas,
    cadastrarConta
};
