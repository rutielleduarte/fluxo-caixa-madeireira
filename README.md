# Sistema de Fluxo de Caixa — Madeireira Gomes e Marenda

Projeto acadêmico de back-end para organizar o registro e a consulta de movimentações financeiras de uma madeireira.

**Situação do projeto:** em desenvolvimento. A API REST de lançamentos está conectada ao MySQL por meio do Sequelize. O módulo de usuários trabalha com dados em memória, o módulo financeiro utiliza dados fictícios e a interface web ainda é provisória.

## 1. Visão geral da documentação

Este README apresenta a finalidade da aplicação, a arquitetura do código, as tecnologias utilizadas, a estrutura do banco de dados e as etapas necessárias para executar o projeto localmente. Também informa quais funcionalidades estão disponíveis e quais ainda dependem de integração, de modo que novos integrantes e avaliadores consigam compreender o estágio atual do sistema.

## 2. Introdução e apresentação do projeto

O Sistema de Fluxo de Caixa da **Madeireira Gomes e Marenda** foi desenvolvido como atividade acadêmica de Desenvolvimento de Sistemas. Seu objetivo é auxiliar no controle de entradas e saídas financeiras, permitindo cadastrar, consultar, atualizar e excluir lançamentos e, futuramente, acompanhar saldos e relatórios com controle de acesso por perfil.

Trata-se de uma aplicação **Node.js com API REST em Express**, organizada em camadas semelhantes ao padrão MVC (Model, Controller e rotas). O servidor também disponibiliza arquivos estáticos de uma interface HTML inicial,que ainda será modificada.

### Funcionalidades encontradas no código

| Módulo | Implementação atual |
| --- | --- |
| Lançamentos | Cadastro, listagem, consulta por ID, descrição e valor, atualização e exclusão. Os dados são acessados pelo Sequelize no MySQL. |
| Usuários | Funções de cadastro, listagem, busca, login, alteração de perfil e redefinição de senha, com armazenamento em um array em memória. As senhas são protegidas com `scrypt`, mas não há rotas HTTP ativas para o módulo. |
| Financeiro | Funções para calcular receitas, despesas, saldo e resumo e consultar movimentações por período. Atualmente utilizam registros fictícios e não possuem rotas HTTP ativas. |
| Interface web | Página HTML básica disponível, com conteúdo de apresentação. A interface de uso do sistema ainda não está implementada. |

## 3. Arquitetura e organização de pastas

O projeto separa as responsabilidades entre **modelos**, **controladores** e **rotas**, seguindo uma organização inspirada em MVC:

- **Modelos (`src/models`)**: concentram o acesso ou a manipulação dos dados. O modelo de lançamentos usa Sequelize; os demais ainda usam arrays ou dados fictícios.
- **Controladores (`src/controllers`)**: reúnem validações e operações solicitadas à camada de modelos.
- **Rotas (`src/routes`)**: definem os endereços HTTP e encaminham as requisições aos controladores.
- **Configuração (`src/config`)**: estabelece a conexão do Sequelize com o MySQL.
- **Arquivos públicos (`public`)**: contêm a interface estática disponibilizada pelo Express.

### Estrutura atual do repositório

~~~text
fluxo-caixa-madeireira/
├── index.js                       # Inicialização do Express e registro das rotas ativas
├── package.json                   # Dependências e comando npm start
├── package-lock.json              # Registro das versões instaladas pelo npm
├── schema.sql                     # Criação das tabelas e inserção dos perfis iniciais
├── testeConexao.js                # Teste de conexão do Sequelize com MySQL
├── README.md                      # Documentação do projeto
├── LEIA-ME.txt                    # Orientações iniciais da equipe
├── .gitignore                     # Arquivos que não devem entrar no Git
├── public/
│   ├── index.html                 # Página web inicial
│   ├── script.js                  # JavaScript do navegador (a desenvolver)
│   └── style.css                  # Folha de estilos (a desenvolver)
└── src/
    ├── config/
    │   └── bd.js                  # Configuração da conexão com o banco
    ├── controllers/
    │   ├── financeiroControlador.js
    │   ├── lancamentoControlador.js
    │   └── usuarioControlador.js
    ├── models/
    │   ├── financeiroModelo.js
    │   ├── lancamentoModelo.js
    │   └── usuarioModelo.js
    └── routes/
        ├── financeiroRotas.js     # Ainda sem endpoints
        ├── lancamentoRotas.js     # Rotas CRUD de lançamentos
        ├── rotas.js               # Arquivo reservado à integração
        └── usuarioRotas.js        # Ainda sem endpoints
~~~

**Observação:** o diretório real chama-se `models` e não `modelos`. Os controladores de usuário e financeiro ainda apontam para `../modelos/`, caminho que deverá ser ajustado antes da integração desses módulos.

## 4. Especificação tecnológica

As tecnologias abaixo foram identificadas em `package.json`, `schema.sql` e nos arquivos-fonte.

| Tecnologia | Versão / requisito | Finalidade |
| --- | --- | --- |
| JavaScript | Ambiente Node.js | Linguagem usada no back-end e no script do navegador. |
| Node.js | 20 ou superior recomendado | Executar a aplicação JavaScript no servidor. O repositório não fixa uma versão de Node. |
| npm | Incluído na instalação do Node.js | Gerenciar as dependências e executar o script de inicialização. |
| Express | `^5.3.0` | Criar o servidor HTTP, as rotas REST e servir arquivos estáticos. |
| MySQL | 8.0 ou superior, conforme `schema.sql` | Armazenar os dados relacionais da aplicação. |
| Sequelize | `^6.37.8` | ORM utilizado no modelo de lançamentos para consultar e modificar dados no MySQL. |
| mysql2 | `^3.24.6` | Driver de comunicação entre Node.js/Sequelize e MySQL. |
| dotenv | `^18.0.10` | Carregar as variáveis de configuração do arquivo `.env`. |
| `node:crypto` | Módulo nativo do Node.js | Proteger e verificar as senhas no módulo de usuários. |
| HTML e CSS | Tecnologias do navegador | Base da interface web, ainda em construção. |

As versões dos pacotes indicam as faixas declaradas no `package.json`; as versões exatas instaladas são controladas pelo `package-lock.json`.

## 5. Modelagem de banco de dados

O banco relacional está definido no arquivo `schema.sql` e se chama **`fluxo_caixa_madeireira`**. O script contém comandos de criação para cinco tabelas:

| Tabela | Finalidade | Chave primária e relacionamentos |
| --- | --- | --- |
| `perfil` | Define os níveis de acesso: `proprietario`, `administracao` e `ti`. | `id_perfil`. |
| `usuario` | Armazena nome, e-mail, hash de senha, status e perfil do usuário. | `id_usuario`; `id_perfil` referencia `perfil`. |
| `categoria` | Classifica uma movimentação como entrada ou saída. | `id_categoria`. |
| `conta` | Representa contas financeiras, como caixa ou banco, incluindo saldo inicial. | `id_conta`. |
| `lancamento` | Registra movimentações com descrição, tipo, valor, data, pagamento, observação, usuário, categoria e conta. | `id_lancamento`; `id_usuario`, `id_categoria` e `id_conta` são chaves estrangeiras. |

### Relacionamentos

~~~text
perfil    (1) ─── (N) usuario
usuario   (1) ─── (N) lancamento
categoria (1) ─── (N) lancamento
conta     (1) ─── (N) lancamento
~~~

As **chaves estrangeiras** de `lancamento` garantem que cada movimentação esteja vinculada a um usuário, uma categoria e uma conta existentes. A tabela `usuario` se relaciona a `perfil` pelo campo `id_perfil`. O esquema também define e-mail único, tipos `entrada`/`saida`, valores de lançamento maiores que zero e estados válidos para usuários e contas.

O script insere automaticamente os três perfis de acesso, caso ainda não existam. **Ele não insere usuários, categorias, contas ou lançamentos de exemplo.** Portanto, para cadastrar um lançamento é necessário que os registros correspondentes já existam no banco.

**Estado da integração:** a tabela `lancamento` já é utilizada pelo modelo Sequelize. O módulo de usuários e as funções financeiras ainda não consultam essas tabelas. O modelo Sequelize de lançamentos declara os campos das chaves estrangeiras, mas não define associações Sequelize (`belongsTo`, por exemplo); as relações estão no SQL.

## 6. Guia de instalação e preparação do ambiente

### Pré-requisitos

- Git instalado para clonar o repositório.
- Node.js e npm instalados (Node.js 20+ recomendado).
- MySQL 8.0+ instalado e com o serviço iniciado.
- Terminal e, opcionalmente, Visual Studio Code.

### Passo 1 — Clonar o repositório

~~~bash
git clone https://github.com/rutielleduarte/fluxo-caixa-madeireira.git
cd fluxo-caixa-madeireira
~~~

### Passo 2 — Instalar as dependências

~~~bash
npm install
~~~

### Passo 3 — Criar o banco de dados

Com o MySQL iniciado, execute na pasta principal do projeto:

~~~bash
mysql -u root -p < schema.sql
~~~

Informe a senha do seu usuário MySQL quando solicitada. O arquivo `schema.sql` cria o banco, as cinco tabelas e os perfis iniciais. Se `mysql` não estiver disponível no terminal, abra o arquivo em um cliente MySQL e execute seu conteúdo.

### Passo 4 — Configurar as variáveis de ambiente

Na pasta principal, crie ou ajuste um arquivo chamado **`.env`**. Utilize seus próprios dados de conexão, sem compartilhar senhas reais:

~~~dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=fluxo_caixa_madeireira
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
PORT=3000
~~~

| Variável | Uso |
| --- | --- |
| `DB_HOST` | Endereço do servidor MySQL. |
| `DB_PORT` | Porta do MySQL; por padrão, `3306`. |
| `DB_NAME` | Nome do banco criado pelo script SQL. |
| `DB_USER` | Usuário do MySQL autorizado a acessar o banco. |
| `DB_PASSWORD` | Senha desse usuário MySQL. |
| `PORT` | Porta HTTP do Express; padrão `3000` quando não informada. |

O repositório também contém referências a `ENCRYPTION_KEY` e `JWT_SECRET` no arquivo de ambiente, porém **o código analisado ainda não implementa criptografia de dados com essa chave nem autenticação por JWT**. Essas variáveis não são necessárias para as rotas atualmente ativas.

**Segurança:** arquivos `.env` com credenciais reais não devem ser enviados ao Git. A presença de `.env` no `.gitignore` não remove um arquivo que já foi versionado.

## 7. Execução e inicialização

### Passo 1 — Testar a conexão com o MySQL

~~~bash
node testeConexao.js
~~~

O script tenta autenticar a conexão com Sequelize e listar as tabelas existentes. Em caso de erro, confira se o serviço MySQL está ativo, se o banco foi criado e se as credenciais do `.env` estão corretas.

### Passo 2 — Iniciar o servidor

~~~bash
npm start
~~~

Esse comando executa `node index.js`. Com a porta padrão, o servidor é iniciado em **http://localhost:3000**.

### Passo 3 — Verificar o funcionamento

- **Página inicial:** http://localhost:3000/ — apresenta a interface HTML provisória.
- **Estado da API:** http://localhost:3000/api/status — retorna uma mensagem JSON de confirmação do servidor.
- **Listagem de lançamentos:** http://localhost:3000/lancamentos — consulta os lançamentos registrados no MySQL.

A rota `/api/status` confirma que o servidor responde, mas **não comprova, sozinha, a conexão com o banco**. Para testar o MySQL, utilize `node testeConexao.js` ou uma das rotas de lançamentos.

### Rotas HTTP atualmente registradas

| Método | Endereço | Operação |
| --- | --- | --- |
| GET | `/api/status` | Verificar se o servidor está respondendo. |
| POST | `/lancamentos` | Cadastrar um lançamento. |
| GET | `/lancamentos` | Listar lançamentos. |
| GET | `/lancamentos/:id` | Buscar um lançamento por ID. |
| GET | `/lancamentos/descricao/:texto` | Consultar por parte da descrição. |
| GET | `/lancamentos/valor/:valor` | Consultar por valor. |
| PUT | `/lancamentos/:id` | Atualizar um lançamento. |
| DELETE | `/lancamentos/:id` | Excluir um lançamento. |

Para cadastrar via `POST`, envie JSON com `descricao`, `tipo_lancamento` (`entrada` ou `saida`), `valor` numérico positivo, `data_lancamento` (formato `AAAA-MM-DD`) e os identificadores existentes `id_usuario`, `id_categoria` e `id_conta`. `forma_pagamento` e `observacao` são opcionais.

**Importante:** antes de utilizar as rotas de cadastro, é necessário inserir usuários, categorias e contas no banco. Como os módulos ainda não estão completamente integrados, essa preparação deve ser realizada manualmente no MySQL. As rotas de usuários e de consultas financeiras ainda não estão disponíveis via HTTP.

### Limitações conhecidas na versão analisada

1. O módulo de usuários usa um array em memória: os registros desaparecem quando o processo Node.js é encerrado.
2. O módulo financeiro calcula resultados sobre dados fictícios e ainda não lê os lançamentos do MySQL.
3. `usuarioRotas.js`, `financeiroRotas.js` e `rotas.js` ainda não definem rotas funcionais; o `index.js` registra apenas o módulo de lançamentos.
4. Os controladores de usuários e financeiro importam modelos a partir de `../modelos/`, mas a pasta existente se chama `models`; isso deve ser corrigido antes de habilitá-los.
5. `public/index.html` referencia `estilos.css`, enquanto o arquivo existente se chama `style.css`. A página também ainda não possui os formulários do sistema.
6. O `package.json` não contém um comando de testes automatizados; o projeto possui o teste manual de conexão `testeConexao.js`.

## 8. Considerações finais e manutenção

O projeto já apresenta uma base de back-end organizada por responsabilidade, um esquema relacional MySQL e operações de lançamentos usando Sequelize. A próxima etapa é consolidar a integração dos módulos e oferecer uma interface para utilização das funcionalidades financeiras.

As prioridades de evolução são: persistir usuários no MySQL, corrigir os caminhos de importação, criar e integrar as rotas pendentes, usar lançamentos reais nos cálculos financeiros, finalizar a interface web e adicionar testes para as regras de negócio e para a API.

Ao contribuir com o projeto, mantenha a separação entre modelos, controladores e rotas; documente novas variáveis de ambiente e alterações do banco; valide os dados recebidos; não inclua credenciais no repositório; e registre problemas e propostas de melhoria nas *Issues* ou por *Pull Requests* no GitHub.

---

**Projeto acadêmico:** Sistema de Fluxo de Caixa — Madeireira Gomes e Marenda.
