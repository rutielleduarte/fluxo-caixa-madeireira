
const modelo = require("../modelos/lancamentoModelo");

// Função para validar os dados
function validarLancamento(descricao, tipo, valor) {

    if (typeof descricao !== "string" || descricao.trim() === "") {
        return "Erro: a descrição é obrigatória!";
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return "Erro: o tipo deve ser entrada ou saida!";
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
        return "Erro: o valor deve ser maior que zero!";
    }

    return "Lançamento válido!";
}

// Função para cadastrar após validar
function cadastrarLancamentoControlador(descricao, tipo, valor) {

    const resultado = validarLancamento(descricao, tipo, valor);

    if (resultado !== "Lançamento válido!") {
        return resultado;
    }

    return modelo.cadastrarLancamento(descricao, tipo, valor);
}


function listarLancamentosControlador() {
    return modelo.listarLancamentos();
}


function buscarLancamentoPorIdControlador(id) {
    const lancamento = modelo.buscarLancamentoPorId(id);

    if (lancamento === undefined) {
        return "Erro: lançamento não encontrado!";
    }

    return lancamento;
}


function atualizarLancamentoControlador(id, descricao, tipo, valor) {
    const validacao = validarLancamento(descricao, tipo, valor);

    if (validacao !== "Lançamento válido!") {
        return validacao;
    }

    const lancamento = modelo.buscarLancamentoPorId(id);

    if (lancamento === undefined) {
        return "Erro: lançamento não encontrado!";
    }

    return modelo.atualizarLancamento(id, descricao, tipo, valor);
}


function excluirLancamentoControlador(id) {
    const lancamento = modelo.buscarLancamentoPorId(id);

    if (lancamento === undefined) {
        return "Erro: lançamento não encontrado!";
    }

    return modelo.excluirLancamento(id);
}


// Exportando as funções do controlador
module.exports = {
    validarLancamento,
    cadastrarLancamentoControlador,
    listarLancamentosControlador,
    buscarLancamentoPorIdControlador,
    atualizarLancamentoControlador,
    excluirLancamentoControlador,
};


// Testando o cadastro
console.log("Teste de cadastro válido:");
console.log(cadastrarLancamentoControlador("Venda de caixas", "entrada", 200));

console.log("Teste de cadastro inválido:");
console.log(cadastrarLancamentoControlador("Compra de madeira", "saida", -50));

console.log("Consultando lançamentos:");
console.log(listarLancamentosControlador());


console.log("Buscando lançamento de ID 2:");
console.log(buscarLancamentoPorIdControlador(2));

console.log("Buscando lançamento inexistente:");
console.log(buscarLancamentoPorIdControlador(99));


console.log("Atualizando lançamento pelo controlador:");

console.log(
    atualizarLancamentoControlador(
        2,
        "Venda de caixas grandes",
        "entrada",
        250
    )
);


console.log("Excluindo lançamento pelo controlador:");
console.log(excluirLancamentoControlador(2));

console.log("Lançamentos após exclusão:");
console.log(listarLancamentosControlador());

