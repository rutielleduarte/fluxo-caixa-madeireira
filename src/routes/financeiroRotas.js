const express = require('express');
const router = express.Router();

const {
    obterTotalReceitas,
    obterTotalDespesas,
    obterSaldo,
    listarFluxoCaixa,
    obterResumoFinanceiro
} = require('../controllers/financeiroControlador');

// Obter o total de receitas
router.get('/receitas', obterTotalReceitas);

// Obter o total de despesas
router.get('/despesas', obterTotalDespesas);

// Obter saldo (aceita ?saldoInicial=1000)
router.get('/saldo', obterSaldo);

// Listar fluxo de caixa por período (aceita ?dataInicial=AAAA-MM-DD&dataFinal=AAAA-MM-DD)
router.get('/fluxo-caixa', listarFluxoCaixa);

// Obter resumo financeiro completo (aceita ?saldoInicial=1000)
router.get('/resumo', obterResumoFinanceiro);

module.exports = router;
