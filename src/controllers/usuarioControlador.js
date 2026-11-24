// LUAN — Controlador de usuários.

const {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
} = require('../models/usuarioModelo');

// CONTROLADOR - Listar usuários
async function listarUsuariosControlador() {
    return await listarUsuarios();
}

// CONTROLADOR - Buscar usuário por ID
async function buscarUsuarioPorIdControlador(id) {
    const idNumero = Number(id);

    if (!Number.isInteger(idNumero) || idNumero <= 0) {
        return null;
    }

    return await buscarUsuarioPorId(idNumero);
}

// CONTROLADOR - Cadastrar usuários
async function cadastrarUsuarioControlador(idResponsavel, nome, email, perfil, senha) {
    // Verifica se o responsável é TI ativo
    const responsavel = await buscarUsuarioPorId(Number(idResponsavel));

    if (!responsavel || responsavel.perfil !== 'ti' || responsavel.status !== 'ativo') {
        return null;
    }

    // Verifica os dados informados
    if (typeof nome !== 'string' || !nome.trim()) {
        return null;
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return null;
    }

    if (typeof senha !== 'string' || senha.length < 8) {
        return null;
    }

    const perfisValidos = ['proprietario', 'administracao', 'ti'];
    if (!perfisValidos.includes(perfil)) {
        return null;
    }

    // Verifica se o e-mail já está cadastrado no MySQL
    const emailLimpo = email.trim().toLowerCase();
    const usuarioExistente = await buscarUsuarioPorEmail(emailLimpo);

    if (usuarioExistente) {
        return null;
    }

    return await cadastrarUsuario(nome.trim(), emailLimpo, perfil, senha);
}

// CONTROLADOR - Realizar login
async function realizarLoginControlador(email, senha) {
    if (typeof email !== 'string' || !email.trim()) {
        return null;
    }

    if (typeof senha !== 'string' || !senha) {
        return null;
    }

    return await realizarLogin(email.trim().toLowerCase(), senha);
}

// CONTROLADOR - Alterar permissões
async function alterarPermissoesControlador(idResponsavel, idUsuario, novoPerfil) {
    const responsavel = Number(idResponsavel);
    const usuario = Number(idUsuario);

    if (!Number.isInteger(responsavel) || responsavel <= 0 ||
        !Number.isInteger(usuario) || usuario <= 0) {
        return null;
    }

    const perfisValidos = ['proprietario', 'administracao', 'ti'];
    if (!perfisValidos.includes(novoPerfil)) {
        return null;
    }

    return await alterarPermissoes(responsavel, usuario, novoPerfil);
}

// CONTROLADOR - Redefinir senhas
async function redefinirSenhaControlador(idResponsavel, idUsuario, novaSenha) {
    const responsavel = Number(idResponsavel);
    const usuario = Number(idUsuario);

    if (!Number.isInteger(responsavel) || responsavel <= 0 ||
        !Number.isInteger(usuario) || usuario <= 0) {
        return null;
    }

    if (typeof novaSenha !== 'string' || novaSenha.length < 8) {
        return null;
    }

    return await redefinirSenha(responsavel, usuario, novaSenha);
}

module.exports = {
    listarUsuariosControlador,
    buscarUsuarioPorIdControlador,
    cadastrarUsuarioControlador,
    realizarLoginControlador,
    alterarPermissoesControlador,
    redefinirSenhaControlador
};
