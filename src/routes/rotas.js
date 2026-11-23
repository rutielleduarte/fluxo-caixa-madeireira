const express = require('express');
const router = express.Router();

const lancamentoRotas = require('./lancamentoRotas');
const usuarioRotas = require('./usuarioRotas');
const financeiroRotas = require('./financeiroRotas');

// Agrupamento das rotas dos três módulos
router.use('/lancamentos', lancamentoRotas);
router.use('/usuarios', usuarioRotas);
router.use('/financeiro', financeiroRotas);

module.exports = router;
