// RENAN — Controlador financeiro.

const modelo = require('../models/financeiroModelo');

async function obterTotalReceitas(req, res) {
    try {
        const total = await modelo.calcularTotalReceitas();
        return res.json({
            sucesso: true,
            totalReceitas: total,
            formatado: `R$ ${total.toFixed(2).replace('.', ',')}`
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
}

async function obterTotalDespesas(req, res) {
    try {
        const total = await modelo.calcularTotalDespesas();
        return res.json({
            sucesso: true,
            totalDespesas: total,
            formatado: `R$ ${total.toFixed(2).replace('.', ',')}`
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
}

async function obterSaldo(req, res) {
    try {
        const saldoInicial = req.query.saldoInicial !== undefined
            ? parseFloat(req.query.saldoInicial)
            : 1000.00;

        if (Number.isNaN(saldoInicial)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O saldo inicial informado é inválido.'
            });
        }

        const saldoFinal = await modelo.calcularSaldo(saldoInicial);

        return res.json({
            sucesso: true,
            saldoInicial,
            saldoFinal,
            formatado: `R$ ${saldoFinal.toFixed(2).replace('.', ',')}`
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
}

async function listarFluxoCaixa(req, res) {
    try {
        const { dataInicial, dataFinal } = req.query;

        if (dataInicial && dataFinal && dataInicial > dataFinal) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A data inicial não pode ser maior que a data final.'
            });
        }

        const movimentacoes = await modelo.consultarFluxoCaixa(dataInicial, dataFinal);

        return res.json({
            sucesso: true,
            quantidade: movimentacoes.length,
            periodo: { dataInicial: dataInicial || 'Início', dataFinal: dataFinal || 'Atual' },
            movimentacoes
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
}

async function obterResumoFinanceiro(req, res) {
    try {
        const saldoInicial = req.query.saldoInicial !== undefined
            ? parseFloat(req.query.saldoInicial)
            : 1000.00;

        if (Number.isNaN(saldoInicial)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O saldo inicial informado é inválido.'
            });
        }

        const resumo = await modelo.gerarResumoFinanceiro(saldoInicial);

        return res.json({
            sucesso: true,
            resumo: {
                saldoInicial: `R$ ${resumo.saldoInicial.toFixed(2).replace('.', ',')}`,
                totalReceitas: `R$ ${resumo.totalReceitas.toFixed(2).replace('.', ',')}`,
                totalDespesas: `R$ ${resumo.totalDespesas.toFixed(2).replace('.', ',')}`,
                saldoFinanceiro: `R$ ${resumo.saldoFinal.toFixed(2).replace('.', ',')}`
            }
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, erro: erro.message });
    }
}

module.exports = {
    obterTotalReceitas,
    obterTotalDespesas,
    obterSaldo,
    listarFluxoCaixa,
    obterResumoFinanceiro
};
