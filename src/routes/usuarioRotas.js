const express = require('express');
const router = express.Router();

const {
    listarUsuariosControlador,
    buscarUsuarioPorIdControlador,
    cadastrarUsuarioControlador,
    realizarLoginControlador,
    alterarPermissoesControlador,
    redefinirSenhaControlador
} = require('../controllers/usuarioControlador');

// Listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const usuarios = await listarUsuariosControlador();
        return res.json(usuarios);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await buscarUsuarioPorIdControlador(req.params.id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado ou ID inválido.' });
        }

        return res.json(usuario);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

// Cadastrar novo usuário (requer idResponsavel com perfil 'ti')
router.post('/', async (req, res) => {
    try {
        const { idResponsavel, nome, email, perfil, senha } = req.body;
        const novoUsuario = await cadastrarUsuarioControlador(idResponsavel, nome, email, perfil, senha);

        if (!novoUsuario) {
            return res.status(400).json({
                erro: 'Não foi possível cadastrar. Verifique os dados, se o e-mail já existe ou a permissão do responsável.'
            });
        }

        return res.status(201).json(novoUsuario);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

// Realizar login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuarioAutenticado = await realizarLoginControlador(email, senha);

        if (!usuarioAutenticado) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        return res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: usuarioAutenticado
        });
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

// Alterar permissões/perfil de um usuário
router.put('/:id/permissoes', async (req, res) => {
    try {
        const { idResponsavel, novoPerfil } = req.body;
        const resultado = await alterarPermissoesControlador(idResponsavel, req.params.id, novoPerfil);

        if (!resultado) {
            return res.status(400).json({
                erro: 'Não foi possível alterar as permissões. Verifique os IDs, o perfil informado ou a autorização.'
            });
        }

        return res.json(resultado);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

// Redefinir senha de um usuário
router.put('/:id/senha', async (req, res) => {
    try {
        const { idResponsavel, novaSenha } = req.body;
        const resultado = await redefinirSenhaControlador(idResponsavel, req.params.id, novaSenha);

        if (!resultado) {
            return res.status(400).json({
                erro: 'Não foi possível redefinir a senha. Verifique os IDs, o tamanho mínimo (8 caracteres) ou a autorização.'
            });
        }

        return res.json(resultado);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
