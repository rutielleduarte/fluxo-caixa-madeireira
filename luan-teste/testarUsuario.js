
const {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
} = require("../src/modelos/usuarioModelo");

// CADASTRANDO USUÁRIOS FICTÍCIOS

cadastrarUsuario("Maria", "maria@exemplo.com", "proprietario", "SenhaTeste123!");
cadastrarUsuario("João", "joao@exemplo.com", "administracao", "SenhaTeste456!");
cadastrarUsuario("Carlos", "carlos@exemplo.com", "ti", "SenhaTeste789!");

// ATIVIDADE 1 - Cadastro

console.log("1 - Cadastro:");
console.log(listarUsuarios().length === 3);

// ATIVIDADE 2 - Listagem

console.log("2 - Listagem:");
console.log(listarUsuarios());

// ATIVIDADE 3 - Busca por ID

console.log("3 - Busca por ID:");
console.log(buscarUsuarioPorId(2)?.nome === "João");
console.log(buscarUsuarioPorId(99) === null);

// ATIVIDADE 4 - Login

console.log("4 - Login correto:");
console.log(realizarLogin("maria@exemplo.com", "SenhaTeste123!") !== null);

console.log("4 - Senha incorreta:");
console.log(realizarLogin("maria@exemplo.com", "senhaErrada") === null);

console.log("4 - Senha oculta na listagem:");
console.log(!("senha" in listarUsuarios()[0]));

// ATIVIDADE 5 - Permissões

console.log("5 - Maria sem permissão:");
console.log(alterarPermissoes(1, 2, "ti") === null);

console.log("5 - Carlos altera o perfil:");
console.log(alterarPermissoes(3, 2, "proprietario")?.perfil === "proprietario");

console.log("5 - Perfil inválido:");
console.log(alterarPermissoes(3, 2, "gerente") === null);

// ATIVIDADE 6 - Redefinir senhas

console.log("6 - Maria sem permissão:");
console.log(redefinirSenha(1, 2, "NovaSenhaJoao123!") === null);

console.log("6 - Carlos redefine a senha:");
console.log(redefinirSenha(3, 1, "NovaSenhaMaria123!") !== null);

console.log("6 - Senha antiga rejeitada:");
console.log(realizarLogin("maria@exemplo.com", "SenhaTeste123!") === null);

console.log("6 - Senha nova aceita:");
console.log(realizarLogin("maria@exemplo.com", "NovaSenhaMaria123!") !== null);

console.log("6 - Senha muito curta:");
console.log(redefinirSenha(3, 1, "123") === null);








// TESTANDO A COMUNICAÇÃO COM O CONTROLADOR

const {
    listarUsuariosControlador,
    buscarUsuarioPorIdControlador,
    cadastrarUsuarioControlador,
    realizarLoginControlador,
    alterarPermissoesControlador,
    redefinirSenhaControlador
} = require("../src/controladores/usuarioControlador");

console.log("7 - Controlador - Listagem:");
console.log(listarUsuariosControlador().length === 3);


 // TESTANDO A BUSCA PELO CONTROLADOR

console.log("8 - Controlador - Buscar por ID:");

console.log(buscarUsuarioPorIdControlador(2)?.nome === "João");

console.log(buscarUsuarioPorIdControlador(99) === null);

console.log(buscarUsuarioPorIdControlador("abc") === null);

console.log(buscarUsuarioPorIdControlador("2")?.nome === "João");

// TESTANDO O LOGIN PELO CONTROLADOR

console.log("10 - Login pelo controlador:");

// Login correto da Maria
console.log(
    realizarLoginControlador(
        "maria@exemplo.com", "NovaSenhaMaria123!"
    )?.nome === "Maria"
);

// Senha antiga da Maria
console.log(
    realizarLoginControlador(
        "maria@exemplo.com", "SenhaTeste123!"
    ) === null
);

// Usuário inexistente
console.log(
    realizarLoginControlador(
        "inexistente@exemplo.com", "SenhaTeste123!"
    ) === null
);

// E-mail não informado
console.log(
    realizarLoginControlador("", "NovaSenhaMaria123!") === null
);

// Senha não informada
console.log(
    realizarLoginControlador("maria@exemplo.com", "") === null
);

// TESTANDO AS PERMISSÕES PELO CONTROLADOR

console.log("11 - Permissões pelo controlador:");

// Maria não pode alterar permissões
console.log(
    alterarPermissoesControlador(1, 2, "ti") === null
);

// Carlos altera o perfil de João
console.log(
    alterarPermissoesControlador(3, 2, "administracao")?.perfil === "administracao"
);

// Perfil inválido
console.log(
    alterarPermissoesControlador(3, 2, "gerente") === null
);

// Usuário inexistente
console.log(
    alterarPermissoesControlador(3, 99, "proprietario") === null
);

// ID inválido
console.log(
    alterarPermissoesControlador(3, "abc", "proprietario") === null
);


// TESTANDO A REDEFINIÇÃO DE SENHAS PELO CONTROLADOR

console.log("12 - Redefinir senha pelo controlador:");

// Maria não pode redefinir a senha de João
console.log(
    redefinirSenhaControlador(1, 2, "NovaSenhaJoao123!") === null
);

// Carlos (TI) redefine a senha de João
console.log(
    redefinirSenhaControlador(3, 2, "NovaSenhaJoao123!")?.nome === "João"
);

// Login de João com a senha antiga
console.log(
    realizarLoginControlador(
        "joao@exemplo.com", "SenhaTeste456!"
    ) === null
);

// Login de João com a nova senha
console.log(
    realizarLoginControlador(
        "joao@exemplo.com", "NovaSenhaJoao123!"
    ) !== null
);

// Usuário inexistente
console.log(
    redefinirSenhaControlador(3, 99, "OutraSenha123!") === null
);

// Senha muito curta
console.log(
    redefinirSenhaControlador(3, 2, "123") === null
);

// ID inválido
console.log(
    redefinirSenhaControlador(3, "abc", "OutraSenha123!") === null
);

