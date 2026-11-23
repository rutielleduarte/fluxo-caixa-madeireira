// RENAN — Modelo financeiro integrado ao MySQL via Sequelize.

const { Op } = require('sequelize');
const { Lancamento } = require('./lancamentoModelo');

const saldoInicialPadrao = 1000.00;

// Etapa 1 — Calcular total de receitas (soma todas as movimentações do tipo 'entrada')
async function calcularTotalReceitas() {
    const total = await Lancamento.sum('valor', {
        where: { tipo_lancamento: 'entrada' }
    });

    return Number(total) || 0;
}

// Etapa 2 — Calcular total de despesas (soma todas as movimentações do tipo 'saida')
async function calcularTotalDespesas() {
    const total = await Lancamento.sum('valor', {
        where: { tipo_lancamento: 'saida' }
    });

    return Number(total) || 0;
}

// Etapa 3 — Calcular saldo final
async function calcularSaldo(saldoInicial = saldoInicialPadrao, receitas, despesas) {
    const totalReceitas = receitas !== undefined ? receitas : await calcularTotalReceitas();
    const totalDespesas = despesas !== undefined ? despesas : await calcularTotalDespesas();

    return (Number(saldoInicial) + totalReceitas) - totalDespesas;
}

// Etapa 4 — Consultar fluxo de caixa filtrado por período
async function consultarFluxoCaixa(dataInicial, dataFinal) {
    const filtroData = {};

    if (dataInicial && dataFinal) {
        filtroData.data_lancamento = { [Op.between]: [dataInicial, dataFinal] };
    } else if (dataInicial) {
        filtroData.data_lancamento = { [Op.gte]: dataInicial };
    } else if (dataFinal) {
        filtroData.data_lancamento = { [Op.lte]: dataFinal };
    }

    return await Lancamento.findAll({
        where: filtroData,
        order: [['data_lancamento', 'ASC'], ['id_lancamento', 'ASC']]
    });
}

// Etapa 5 — Gerar resumo financeiro consolidado
async function gerarResumoFinanceiro(saldoInicial = saldoInicialPadrao) {
    const inicial = Number(saldoInicial) || 0;
    const totalReceitas = await calcularTotalReceitas();
    const totalDespesas = await calcularTotalDespesas();
    const saldoFinal = await calcularSaldo(inicial, totalReceitas, totalDespesas);

    return {
        saldoInicial: inicial,
        totalReceitas,
        totalDespesas,
        saldoFinal
    };
}

module.exports = {
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularSaldo,
    consultarFluxoCaixa,
    gerarResumoFinanceiro
};
