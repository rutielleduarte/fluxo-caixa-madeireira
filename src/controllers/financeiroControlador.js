// RENAN — Controlador

const modelo = require('../modelos/financeiroModelo');
function obterTotalReceitas(req, res) {
 const total = modelo.calcularTotalReceitas();
 return res.json({
   sucesso: true,
   totalReceitas: total,
   formatado: `R$ ${total.toFixed(2).replace('.', ',')}`
 });
}


function obterTotalDespesas(req, res) {
 const total = modelo.calcularTotalDespesas();
 return res.json({
   sucesso: true,
   totalDespesas: total,
   formatado: `R$ ${total.toFixed(2).replace('.', ',')}`
 });
}


function obterSaldo(req, res) {
 const saldoInicial = parseFloat(req.query.saldoInicial) || 1000.00;
 const saldoFinal = modelo.calcularSaldo(saldoInicial);


 return res.json({
   sucesso: true,
   saldoInicial,
   saldoFinal,
   formatado: `R$ ${saldoFinal.toFixed(2).replace('.', ',')}`
 });
}


function listarFluxoCaixa(req, res) {
 const { dataInicial, dataFinal } = req.query;


 if (dataInicial && dataFinal && dataInicial > dataFinal) {
   return res.status(400).json({
     sucesso: false,
     mensagem: 'A data inicial não pode ser maior que a data final.'
   });
 }


 const movimentacoes = modelo.consultarFluxoCaixa(dataInicial, dataFinal);


 return res.json({
   sucesso: true,
   quantidade: movimentacoes.length,
   periodo: { dataInicial: dataInicial || 'Início', dataFinal: dataFinal || 'Atual' },
   movimentacoes
 });
}


function obterResumoFinanceiro(req, res) {
 const saldoInicial = parseFloat(req.query.saldoInicial) || 1000.00;
 const resumo = modelo.gerarResumoFinanceiro(saldoInicial);


 return res.json({
   sucesso: true,
   resumo: {
     saldoInicial: `R$ ${resumo.saldoInicial.toFixed(2).replace('.', ',')}`,
     totalReceitas: `R$ ${resumo.totalReceitas.toFixed(2).replace('.', ',')}`,
     totalDespesas: `R$ ${resumo.totalDespesas.toFixed(2).replace('.', ',')}`,
     saldoFinanceiro: `R$ ${resumo.saldoFinal.toFixed(2).replace('.', ',')}`
   }
 });
}


module.exports = {
 obterTotalReceitas,
 obterTotalDespesas,
 obterSaldo,
 listarFluxoCaixa,
 obterResumoFinanceiro
};

