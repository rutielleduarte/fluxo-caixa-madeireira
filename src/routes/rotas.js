const express = require('express');
const router = express.Router();

const lancamentoRotas = require('./lancamentoRotas');
const usuarioRotas = require('./usuarioRotas');
const financeiroRotas = require('./financeiroRotas');
const categoriaRotas = require('./categoriaRotas');
const contaRotas = require('./contaRotas');

router.use('/lancamentos', lancamentoRotas);
router.use('/usuarios', usuarioRotas);
router.use('/financeiro', financeiroRotas);
router.use('/categorias', categoriaRotas);
router.use('/contas', contaRotas);

module.exports = router;
