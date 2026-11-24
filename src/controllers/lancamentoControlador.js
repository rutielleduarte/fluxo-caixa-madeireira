const modelo = require('../models/lancamentoModelo');

// Função auxiliar para gerar erros com status HTTP
function criarErro(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}

// Função para validar os dados
function validarLancamento(descricao, tipo, valor) {
    if (typeof descricao !== "string" || descricao.trim() === "") {
        throw criarErro("A descrição é obrigatória!", 400);
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        throw criarErro("O tipo deve ser 'entrada' ou 'saida'!", 400);
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
        throw criarErro("O valor deve ser maior que zero!", 400);
    }
}

// Função para cadastrar após validar
async function cadastrarLancamentoControlador(dados) {
    validarLancamento(
        dados.descricao,
        dados.tipo_lancamento,
        dados.valor
    );

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
        throw criarErro("Lançamento não encontrado!", 404);
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
    validarLancamento(
        dados.descricao,
        dados.tipo_lancamento,
        dados.valor
    );

    const lancamento = await modelo.buscarLancamentoPorId(id);

    if (lancamento === null) {
        throw criarErro("Lançamento não encontrado!", 404);
    }

    return await modelo.atualizarLancamento(id, dados);
}

// Função para excluir lançamento
async function excluirLancamentoControlador(id) {
    const lancamento = await modelo.buscarLancamentoPorId(id);

    if (lancamento === null) {
        throw criarErro("Lançamento não encontrado!", 404);
    }

    return await modelo.excluirLancamento(id);
}

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
