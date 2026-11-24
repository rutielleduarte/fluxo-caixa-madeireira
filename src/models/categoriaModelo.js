const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_categoria: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo_categoria: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['entrada', 'saida']]
        }
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'categoria',
    timestamps: false
});

async function listarCategorias() {
    return await Categoria.findAll({
        order: [['nome_categoria', 'ASC']]
    });
}

async function cadastrarCategoria(dados) {
    return await Categoria.create(dados);
}

module.exports = {
    Categoria,
    listarCategorias,
    cadastrarCategoria
};
