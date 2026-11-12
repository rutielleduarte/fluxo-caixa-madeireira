-- Banco de dados: estrutura a definir conforme o dicionário de dados.
-- Este arquivo é um espaço reservado; não executa a criação das tabelas.
-- =============================================================
-- SISTEMA DE FLUXO DE CAIXA — MADEIREIRA GOMES E MARENDA
-- Banco de dados MySQL 8.0+
-- Baseado no modelo lógico e dicionário de dados do projeto.
-- =============================================================

CREATE DATABASE IF NOT EXISTS fluxo_caixa_madeireira
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fluxo_caixa_madeireira;

-- 1. PERFIL: três níveis de acesso definidos pelo grupo.
CREATE TABLE IF NOT EXISTS perfil (
    id_perfil INT NOT NULL AUTO_INCREMENT,
    nome_perfil VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    PRIMARY KEY (id_perfil),
    UNIQUE KEY uq_perfil_nome (nome_perfil)
) ENGINE=InnoDB;

-- 2. USUARIO: cada usuário pertence a um perfil.
-- senha deve receber um HASH, nunca a senha em texto puro.
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    id_perfil INT NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_email (email),
    CONSTRAINT fk_usuario_perfil FOREIGN KEY (id_perfil)
        REFERENCES perfil (id_perfil),
    CONSTRAINT ck_usuario_status CHECK (status IN ('ativo', 'inativo'))
) ENGINE=InnoDB;

-- 3. CATEGORIA: classificação das entradas e saídas.
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT NOT NULL AUTO_INCREMENT,
    nome_categoria VARCHAR(100) NOT NULL,
    tipo_categoria VARCHAR(20) NOT NULL,
    descricao VARCHAR(255),
    PRIMARY KEY (id_categoria),
    CONSTRAINT ck_categoria_tipo CHECK (tipo_categoria IN ('entrada', 'saida'))
) ENGINE=InnoDB;

-- 4. CONTA: contas financeiras, como caixa ou banco.
CREATE TABLE IF NOT EXISTS conta (
    id_conta INT NOT NULL AUTO_INCREMENT,
    nome_conta VARCHAR(100) NOT NULL,
    tipo_conta VARCHAR(30) NOT NULL,
    saldo_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    PRIMARY KEY (id_conta),
    CONSTRAINT ck_conta_status CHECK (status IN ('ativo', 'inativo'))
) ENGINE=InnoDB;

-- 5. LANCAMENTO: cada movimentação pertence a um usuário,
-- uma categoria e uma conta.
CREATE TABLE IF NOT EXISTS lancamento (
    id_lancamento INT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    tipo_lancamento VARCHAR(20) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_lancamento DATE NOT NULL,
    forma_pagamento VARCHAR(30),
    observacao TEXT,
    id_usuario INT NOT NULL,
    id_categoria INT NOT NULL,
    id_conta INT NOT NULL,
    PRIMARY KEY (id_lancamento),
    CONSTRAINT fk_lancamento_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario),
    CONSTRAINT fk_lancamento_categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria (id_categoria),
    CONSTRAINT fk_lancamento_conta FOREIGN KEY (id_conta)
        REFERENCES conta (id_conta),
    CONSTRAINT ck_lancamento_tipo CHECK (tipo_lancamento IN ('entrada', 'saida')),
    CONSTRAINT ck_lancamento_valor CHECK (valor > 0)
) ENGINE=InnoDB;

-- Perfis iniciais para o sistema (compatíveis com o código do Luan).
INSERT INTO perfil (nome_perfil, descricao)
SELECT 'proprietario', 'Proprietário/Administração: acesso ao módulo financeiro'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nome_perfil = 'proprietario');

INSERT INTO perfil (nome_perfil, descricao)
SELECT 'administracao', 'Administração: somente visualização e consultas'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nome_perfil = 'administracao');

INSERT INTO perfil (nome_perfil, descricao)
SELECT 'ti', 'TI: gerenciamento de usuários e acesso total ao sistema'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nome_perfil = 'ti');

-- Conferência manual após executar:
-- SHOW TABLES;
-- SELECT * FROM perfil;
-- DESCRIBE lancamento;

-- OBSERVAÇÕES SOBRE A INTEGRAÇÃO:
-- 1) Os modelos Node.js enviados ainda utilizam arrays, não MySQL.
-- 2) lancamentoModelo.js cadastra apenas descricao, tipo e valor;
--    para usar esta tabela, será necessário enviar também
--    data_lancamento, id_usuario, id_categoria e id_conta.
-- 3) usuarioModelo.js usa o atributo 'perfil' em texto;
--    no banco esse valor será relacionado por id_perfil.
-- 4) financeiroModelo.js usa os campos 'tipo' e 'data';
--    a tabela lancamento utiliza 'tipo_lancamento' e 'data_lancamento'.
-- 5) Validar no controlador se a categoria corresponde ao tipo
--    do lançamento (entrada/saida) antes de gravar os dados.