// LUAN — Controlador de usuários.
// Implementar validações, login e controle de permissões.

const {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
} = require("../modelos/usuarioModelo");

// CONTROLADOR - Listar usuários

function listarUsuariosControlador() {
    return listarUsuarios();
}

 // CONTROLADOR - Buscar usuário por ID

function buscarUsuarioPorIdControlador(id) {
    const idNumero = Number(id);

    if (!Number.isInteger(idNumero) || idNumero <= 0) {
        return null;
    }

    return buscarUsuarioPorId(idNumero);
}

 // CONTROLADOR - Cadastrar usuários

function cadastrarUsuarioControlador(idResponsavel, nome, email, perfil, senha) {

    // Verifica se o responsável é TI
    const responsavel = buscarUsuarioPorId(Number(idResponsavel));

    if (!responsavel || responsavel.perfil !== "ti" ||
        responsavel.status !== "ativo") {
        return null;
    }

    // Verifica os dados informados
    if (typeof nome !== "string" || !nome.trim()) {
        return null;
    }

    if (typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return null;
    }

    if (typeof senha !== "string" || senha.length < 8) {
        return null;
    }

    // Verifica o perfil
    const perfisValidos = ["proprietario", "administracao", "ti"];

    if (!perfisValidos.includes(perfil)) {
        return null;
    }

    // Verifica se o e-mail já está cadastrado
    const emailLimpo = email.trim().toLowerCase();

    const emailExiste = listarUsuarios().some(
        usuario => usuario.email.toLowerCase() === emailLimpo
    );

    if (emailExiste) {
        return null;
    }

    // Realiza o cadastro
    return cadastrarUsuario(nome.trim(), emailLimpo, perfil, senha);
}

// CONTROLADOR - Realizar login

function realizarLoginControlador(email, senha) {

    // Verifica se o e-mail foi informado
    if (typeof email !== "string" || !email.trim()) {
        return null;
    }

    // Verifica se a senha foi informada
    if (typeof senha !== "string" || !senha) {
        return null;
    }

    // Realiza o login pelo modelo
    return realizarLogin(email.trim().toLowerCase(), senha);
}

// CONTROLADOR - Alterar permissões

function alterarPermissoesControlador(idResponsavel, idUsuario, novoPerfil) {

    // Converte os IDs para números
    const responsavel = Number(idResponsavel);
    const usuario = Number(idUsuario);

    // Verifica se os IDs são válidos
    if (!Number.isInteger(responsavel) || responsavel <= 0 ||
        !Number.isInteger(usuario) || usuario <= 0) {
        return null;
    }

    // Verifica se o perfil é válido
    const perfisValidos = ["proprietario", "administracao", "ti"];

    if (!perfisValidos.includes(novoPerfil)) {
        return null;
    }

    // Solicita a alteração ao modelo
    return alterarPermissoes(responsavel, usuario, novoPerfil);
}

// CONTROLADOR - Redefinir senhas

function redefinirSenhaControlador(idResponsavel, idUsuario, novaSenha) {

    // Converte os IDs para números
    const responsavel = Number(idResponsavel);
    const usuario = Number(idUsuario);

    // Verifica se os IDs são válidos
    if (!Number.isInteger(responsavel) || responsavel <= 0 ||
        !Number.isInteger(usuario) || usuario <= 0) {
        return null;
    }

    // Verifica se a nova senha é válida
    if (typeof novaSenha !== "string" || novaSenha.length < 8) {
        return null;
    }

    // Solicita a redefinição ao modelo
    return redefinirSenha(responsavel, usuario, novaSenha);
}

// EXPORTANDO A FUNÇÃO

module.exports = {
    listarUsuariosControlador,
    buscarUsuarioPorIdControlador,
    cadastrarUsuarioControlador,
    realizarLoginControlador,
    alterarPermissoesControlador,
    redefinirSenhaControlador
};
