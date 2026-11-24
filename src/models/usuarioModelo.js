// LUAN — Modelo de usuários integrado ao MySQL via Sequelize.

const { DataTypes } = require('sequelize');
const { randomBytes, scryptSync, timingSafeEqual } = require('node:crypto');
const sequelize = require('../config/bd');

// Modelo da tabela perfil
const Perfil = sequelize.define('Perfil', {
    id_perfil: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_perfil: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'perfil',
    timestamps: false
});

// Modelo da tabela usuario
const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'ativo',
        validate: {
            isIn: [['ativo', 'inativo']]
        }
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

// Associação entre Usuario e Perfil
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'dadosPerfil' });

// FUNÇÃO AUXILIAR - Proteger senhas
function protegerSenha(senha) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(senha, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

// FUNÇÃO AUXILIAR - Verificar senha
function verificarSenha(senha, senhaProtegida) {
    if (!senhaProtegida || !senhaProtegida.includes(':')) return false;
    const [salt, hashHex] = senhaProtegida.split(':');
    const hashSalvo = Buffer.from(hashHex, 'hex');
    const hashDigitado = scryptSync(senha, salt, hashSalvo.length);

    if (hashSalvo.length !== hashDigitado.length) return false;
    return timingSafeEqual(hashSalvo, hashDigitado);
}

// FUNÇÃO AUXILIAR - Formatar retorno ocultando senha e expondo o nome do perfil
function formatarUsuario(registro) {
    if (!registro) return null;
    const dados = registro.toJSON ? registro.toJSON() : registro;
    const { senha, dadosPerfil, ...dadosPublicos } = dados;

    return {
        ...dadosPublicos,
        perfil: dadosPerfil ? dadosPerfil.nome_perfil : null
    };
}

// ATIVIDADE 1 - Cadastrar usuários
async function cadastrarUsuario(nome, email, perfilNome, senha) {
    const perfilEncontrado = await Perfil.findOne({
        where: { nome_perfil: perfilNome }
    });

    if (!perfilEncontrado) {
        return null;
    }

    const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: protegerSenha(senha),
        status: 'ativo',
        id_perfil: perfilEncontrado.id_perfil
    });

    return await buscarUsuarioPorId(novoUsuario.id_usuario);
}

// ATIVIDADE 2 - Listar usuários
async function listarUsuarios() {
    const lista = await Usuario.findAll({
        include: [{ model: Perfil, as: 'dadosPerfil', attributes: ['nome_perfil'] }],
        order: [['id_usuario', 'ASC']]
    });

    return lista.map(formatarUsuario);
}

// ATIVIDADE 3 - Buscar usuário por ID
async function buscarUsuarioPorId(id) {
    const usuario = await Usuario.findByPk(id, {
        include: [{ model: Perfil, as: 'dadosPerfil', attributes: ['nome_perfil'] }]
    });

    return formatarUsuario(usuario);
}

// Buscar usuário por E-mail (útil para validar duplicidade no controlador)
async function buscarUsuarioPorEmail(email) {
    const usuario = await Usuario.findOne({
        where: { email },
        include: [{ model: Perfil, as: 'dadosPerfil', attributes: ['nome_perfil'] }]
    });

    return formatarUsuario(usuario);
}

// ATIVIDADE 4 - Realizar login
async function realizarLogin(email, senha) {
    const usuario = await Usuario.findOne({
        where: { email },
        include: [{ model: Perfil, as: 'dadosPerfil', attributes: ['nome_perfil'] }]
    });

    if (!usuario || usuario.status !== 'ativo') {
        return null;
    }

    if (!verificarSenha(senha, usuario.senha)) {
        return null;
    }

    return formatarUsuario(usuario);
}

// ATIVIDADE 5 - Alterar permissões de acesso
async function alterarPermissoes(idResponsavel, idUsuario, novoPerfil) {
    const responsavel = await buscarUsuarioPorId(idResponsavel);

    if (!responsavel || responsavel.perfil !== 'ti' || responsavel.status !== 'ativo') {
        return null;
    }

    const perfilEncontrado = await Perfil.findOne({
        where: { nome_perfil: novoPerfil }
    });

    if (!perfilEncontrado) {
        return null;
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
        return null;
    }

    await usuario.update({ id_perfil: perfilEncontrado.id_perfil });

    return await buscarUsuarioPorId(idUsuario);
}

// ATIVIDADE 6 - Redefinir senhas
async function redefinirSenha(idResponsavel, idUsuario, novaSenha) {
    const responsavel = await buscarUsuarioPorId(idResponsavel);

    if (!responsavel || responsavel.perfil !== 'ti' || responsavel.status !== 'ativo') {
        return null;
    }

    if (typeof novaSenha !== 'string' || novaSenha.length < 8) {
        return null;
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
        return null;
    }

    await usuario.update({ senha: protegerSenha(novaSenha) });

    return await buscarUsuarioPorId(idUsuario);
}

module.exports = {
    Perfil,
    Usuario,
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
};
