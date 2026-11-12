
const sequelize = require('./src/config/bd');

async function testarConexao() {
  try {
    await sequelize.authenticate();

    console.log('Conexão com Sequelize realizada com sucesso!');

    const [tabelas] = await sequelize.query('SHOW TABLES');

    console.log('Tabelas encontradas:');
    console.table(tabelas);

  } catch (erro) {
    console.error('Erro ao conectar:', erro.message);

  } finally {
    await sequelize.close();
  }
}

testarConexao();
