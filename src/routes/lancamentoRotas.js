
const express = require('express');
const router = express.Router();

const controlador = require('../controllers/lancamentoControlador');

// Cadastrar lançamento
router.post('/', async (req, res) => {
    try {
        const resultado = await controlador.cadastrarLancamentoControlador(req.body);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Listar lançamentos
router.get('/', async (req, res) => {
    try {
        const resultado = await controlador.listarLancamentosControlador();
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Buscar por descrição
router.get('/descricao/:texto', async (req, res) => {
    try {
        const resultado = await controlador.buscarPorDescricaoControlador(req.params.texto);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Buscar por valor
router.get('/valor/:valor', async (req, res) => {
    try {
        const valor = Number(req.params.valor);

        if (!Number.isFinite(valor)) {
            return res.status(400).json({ erro: 'Valor inválido!' });
        }

        const resultado = await controlador.buscarPorValorControlador(valor);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Buscar por ID
router.get('/:id', async (req, res) => {
    try {
        const resultado = await controlador.buscarLancamentoPorIdControlador(req.params.id);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Atualizar lançamento
router.put('/:id', async (req, res) => {
    try {
        const resultado = await controlador.atualizarLancamentoControlador(
            req.params.id,
            req.body
        );
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Excluir lançamento
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await controlador.excluirLancamentoControlador(req.params.id);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
