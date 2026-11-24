const express = require('express');
const router = express.Router();
const { listarContasAtivas, cadastrarConta } = require('../models/contaModelo');

router.get('/', async (req, res) => {
    try {
        const contas = await listarContasAtivas();
        return res.json(contas);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome_conta, tipo_conta, saldo_inicial } = req.body;
        if (!nome_conta || !tipo_conta) {
            return res.status(400).json({ erro: 'Informe nome_conta e tipo_conta.' });
        }
        const nova = await cadastrarConta({ nome_conta, tipo_conta, saldo_inicial: saldo_inicial || 0 });
        return res.status(201).json(nova);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
