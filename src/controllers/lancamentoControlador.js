
const modelo = require('../models/lancamentoModelo');

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
async function cadastrarLancamentoControlador(dados) {

    const resultado = validarLancamento(
        dados.descricao,
        dados.tipo_lancamento,
        dados.valor
    );

    if (resultado !== "Lançamento válido!") {
        return resultado;
    }

    return await modelo.cadastrarLancamento(dados);
}


// Função para listar lançamentos
async function listarLancamentosControlador() {
    return await modelo.listarLancamentos();
}


// Função para buscar por ID
async function buscarLancamentoPorIdControlador(id) {

    const lancamento = await modelo.buscarLancamentoPorId(id);

    if (lancamento === null) {
        return "Erro: lançamento não encontrado!";
    }

    return lancamento;
}


// Função para buscar por descrição
async function buscarPorDescricaoControlador(texto) {
    return await modelo.buscarPorDescricao(texto);
}


// Função para buscar por valor
async function buscarPorValorControlador(valor) {
    return await modelo.buscarPorValor(valor);
}


// Função para atualizar lançamento
async function atualizarLancamentoControlador(id, dados) {

    const validacao = validarLancamento(
        dados.descricao,
        dados.tipo_lancamento,
        dados.valor
    );

    if (validacao !== "Lançamento válido!") {
        return validacao;
    }

    const lancamento = await modelo.buscarLancamentoPorId(id);

    if (lancamento === null) {
        return "Erro: lançamento não encontrado!";
    }

    return await modelo.atualizarLancamento(id, dados);
}


// Função para excluir lançamento
async function excluirLancamentoControlador(id) {

    const lancamento = await modelo.buscarLancamentoPorId(id);

    if (lancamento === null) {
        return "Erro: lançamento não encontrado!";
    }

    return await modelo.excluirLancamento(id);
}


// Exportando as funções
module.exports = {
    validarLancamento,
    cadastrarLancamentoControlador,
    listarLancamentosControlador,
    buscarLancamentoPorIdControlador,
    buscarPorDescricaoControlador,
    buscarPorValorControlador,
    atualizarLancamentoControlador,
    excluirLancamentoControlador
};
