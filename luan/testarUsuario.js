
const {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    realizarLogin,
    alterarPermissoes,
    redefinirSenha
} = require("./usuarioModelo");

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
