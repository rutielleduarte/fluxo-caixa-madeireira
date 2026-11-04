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

// EXECUTAR TESTAR APENAS DIRETAMENTE
if (require.main === module) {

// DADOS FICTÍCIOS PARA TESTAR

cadastrarUsuario(
    "Maria",
    "maria@exemplo.com",
    "proprietario",
    "SenhaTeste123!"
);

cadastrarUsuario(
    "João",
    "joao@exemplo.com",
    "administracao",
    "SenhaTeste456!"
);

// TESTANDO A LISTAGEM

console.log("Usuários cadastrados:");
console.log(listarUsuarios());

// TESTANDO A BUSCA POR ID

console.log("Buscando usuário com ID 2:");
console.log(buscarUsuarioPorId(2));

console.log("Buscando usuário com ID 99:");
console.log(buscarUsuarioPorId(99));

// TESTANDO A PROTEÇÃO DAS SENHAS

console.log("Senhas protegidas:",
    usuarios[0].senha !== "SenhaTeste123!" &&
    usuarios[1].senha !== "SenhaTeste456!"
);


// TESTANDO O LOGIN

console.log("Login da Maria:");
console.log(realizarLogin("maria@exemplo.com", "SenhaTeste123!"));


 // Testes de login

// Teste 1 - Senha incorreta
console.log("Teste 1 - Senha incorreta:");
console.log(realizarLogin("maria@exemplo.com", "senhaErrada"));

// Teste 2 - Usuário inexistente
console.log("Teste 2 - Usuário inexistente:");
console.log(realizarLogin("teste@exemplo.com", "SenhaTeste123!"));

// Teste 3 - João com conta ativa
console.log("Teste 3 - João ativo:");
console.log(realizarLogin("joao@exemplo.com", "SenhaTeste456!") !== null);

// Teste 4 - João com conta inativa
usuarios[1].status = "inativo";

console.log("Teste 4 - João inativo:");
console.log(realizarLogin("joao@exemplo.com", "SenhaTeste456!"));

// Teste 5 - Maria continua ativa
console.log("Teste 5 - Maria ativa:");
console.log(realizarLogin("maria@exemplo.com", "SenhaTeste123!") !== null);


// Criando usuário TI para testar

cadastrarUsuario(
    "Carlos",
    "carlos@exemplo.com",
    "ti",
    "SenhaTeste789!"
);


 // TESTANDO AS PERMISSÕES

// Teste 1 - Maria tenta alterar o perfil de João
console.log("Teste 1 - Maria sem permissão:");
console.log(alterarPermissoes(1, 2, "ti"));

// Teste 2 - Carlos altera o perfil de João
console.log("Teste 2 - Carlos com permissão:");
console.log(alterarPermissoes(3, 2, "proprietario"));

// Teste 3 - Carlos informa um perfil inválido
console.log("Teste 3 - Perfil inválido:");
console.log(alterarPermissoes(3, 2, "gerente"));

// Teste 4 - Carlos procura um usuário inexistente
console.log("Teste 4 - Usuário inexistente:");
console.log(alterarPermissoes(3, 99, "administracao"));


 // TESTANDO A REDEFINIÇÃO DE SENHAS

// Teste 1 - Maria tenta redefinir a senha de João
console.log("Teste 1 - Maria sem permissão:");
console.log(redefinirSenha(1, 2, "NovaSenhaJoao123!"));

// Teste 2 - Carlos redefine a senha da Maria
console.log("Teste 2 - Carlos redefine a senha:");
console.log(redefinirSenha(3, 1, "NovaSenhaMaria123!"));

// Teste 3 - Login com a senha antiga da Maria
console.log("Teste 3 - Senha antiga:");
console.log(realizarLogin("maria@exemplo.com", "SenhaTeste123!"));

// Teste 4 - Login com a nova senha da Maria
console.log("Teste 4 - Nova senha:");
console.log(realizarLogin("maria@exemplo.com", "NovaSenhaMaria123!") !== null);

// Teste 5 - Usuario inexistente
console.log("Teste 5 - Usuario inexistente:");
console.log(redefinirSenha(3, 99, "OutraSenha123!"));

// Teste 6 - Senha muito curta
console.log("Teste 6 - Senha muito curta:");
console.log(redefinirSenha(3, 1, "123"));
}