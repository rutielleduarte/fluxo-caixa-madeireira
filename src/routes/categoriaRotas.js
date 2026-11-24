const express = require('express');
const router = express.Router();
const { listarCategorias, cadastrarCategoria } = require('../models/categoriaModelo');

router.get('/', async (req, res) => {
    try {
        const categorias = await listarCategorias();
        return res.json(categorias);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome_categoria, tipo_categoria, descricao } = req.body;
        if (!nome_categoria || !['entrada', 'saida'].includes(tipo_categoria)) {
            return res.status(400).json({ erro: 'Informe nome_categoria e tipo_categoria (entrada ou saida).' });
        }
        const nova = await cadastrarCategoria({ nome_categoria, tipo_categoria, descricao });
        return res.status(201).json(nova);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
