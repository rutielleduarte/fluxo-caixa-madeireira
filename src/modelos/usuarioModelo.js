// LUAN — Modelo de usuários.
// Funções: cadastrarUsuario, listarUsuarios, buscarUsuarioPorId, realizarLogin, alterarPermissao, redefinirSenha.


const { randomBytes, scryptSync, timingSafeEqual } = require("node:crypto");

const usuarios = [];

// FUNÇÃO AUXILIAR - Proteger senhas

function protegerSenha(senha) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(senha, salt, 64).toString("hex");

    return `${salt}:${hash}`;
}

// FUNÇÃO AUXILIAR - Ocultar senha nas consultas

function removerSenha(usuario) {
    const { senha, ...dadosPublicos } = usuario;
    return dadosPublicos;
}

// ATIVIDADE 1 - Cadastrar usuários

function cadastrarUsuario(nome, email, perfil, senha) {
    const usuario = {
        id_usuario: usuarios.length + 1,
        nome: nome,
        email: email,
        perfil: perfil,
        senha: protegerSenha(senha),
        status: "ativo"
    };

    usuarios.push(usuario);

    return removerSenha(usuario);
}

// ATIVIDADE 2 - Listar usuários

function listarUsuarios() {
    return usuarios.map(removerSenha);
}

// ATIVIDADE 3 - Buscar usuário por ID

function buscarUsuarioPorId(id) {
    const usuario = usuarios.find(
        usuario => usuario.id_usuario === id
    );

    return usuario ? removerSenha(usuario) : null;
}

 // FUNÇÃO AUXILIAR - Verificar senha

function verificarSenha(senha, senhaProtegida) {
    const [salt, hashHex] = senhaProtegida.split(":");

    const hashSalvo = Buffer.from(hashHex, "hex");
    const hashDigitado = scryptSync(senha, salt, hashSalvo.length);

    return timingSafeEqual(hashSalvo, hashDigitado);
}

// ATIVIDADE 4 - Realizar login

function realizarLogin(email, senha) {
    const usuario = usuarios.find(
        usuario => usuario.email === email
    );

    if (!usuario || usuario.status !== "ativo") {
        return null;
    }

    if (!verificarSenha(senha, usuario.senha)) {
        return null;
    }

    return removerSenha(usuario);
}


 // ATIVIDADE 5 - Alterar permissões de acesso

function alterarPermissoes(idResponsavel, idUsuario, novoPerfil) {
    const responsavel = usuarios.find(
        usuario => usuario.id_usuario === idResponsavel
    );

    // Verifica se o responsável é um TI ativo
    if (!responsavel || responsavel.perfil !== "ti" ||
        responsavel.status !== "ativo") {
        return null;
    }

    // Verifica se o perfil informado é válido
    const perfisValidos = ["proprietario", "administracao", "ti"];

    if (!perfisValidos.includes(novoPerfil)) {
        return null;
    }

    // Procura o usuário que será alterado
    const usuario = usuarios.find(
        usuario => usuario.id_usuario === idUsuario
    );

    if (!usuario) {
        return null;
    }

    // Altera o perfil do usuário
    usuario.perfil = novoPerfil;

    return removerSenha(usuario);
}


 // ATIVIDADE 6 - Redefinir senhas

function redefinirSenha(idResponsavel, idUsuario, novaSenha) {
    // Procura quem está solicitando a alteração
    const responsavel = usuarios.find(
        usuario => usuario.id_usuario === idResponsavel
    );

    // Somente um TI ativo pode redefinir senhas
    if (!responsavel || responsavel.perfil !== "ti" ||
        responsavel.status !== "ativo") {
        return null;
    }

    // Procura o usuário que terá a senha alterada
    const usuario = usuarios.find(
        usuario => usuario.id_usuario === idUsuario
    );

    if (!usuario) {
        return null;
    }

    // Verifica se a nova senha possui pelo menos 8 caracteres
    if (typeof novaSenha !== "string" || novaSenha.length < 8) {
        return null;
    }

    // Armazena a nova senha protegida
    usuario.senha = protegerSenha(novaSenha);

    return removerSenha(usuario);
}


 // EXPORTANDO AS FUNÇÕES DO MÓDULO

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
};