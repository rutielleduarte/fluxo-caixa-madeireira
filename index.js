
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// Permite receber dados em JSON
app.use(express.json());

// Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// Disponibiliza os arquivos HTML, CSS e JavaScript
app.use(express.static(path.join(__dirname, 'public')));

// Importar as rotas de lançamentos
const lancamentoRotas = require('./src/routes/lancamentoRotas');

// Registrar as rotas de lançamentos
app.use('/lancamentos', lancamentoRotas);

// Rota inicial para testar o servidor
app.get('/api/status', (req, res) => {
    res.json({
        mensagem: 'Sistema de Fluxo de Caixa funcionando!'
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
