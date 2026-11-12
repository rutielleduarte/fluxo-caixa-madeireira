// RENAN — Modelo financeiro.
// Dados fictícios para testes locais antes da integração com banco
 const lancamentosFicticios = [
 { id: 1, descricao: 'Venda de bandeja', tipo: 'entrada', valor: 150.00, data: '2026-11-01' },
 { id: 2, descricao: 'Compra de madeira', tipo: 'saida', valor: 300.00, data: '2026-11-02' },
 { id: 3, descricao: 'Venda de caixa de madeira', tipo: 'entrada', valor: 200.00, data: '2026-11-03' },
 { id: 4, descricao: 'Pagamento de energia', tipo: 'saida', valor: 120.00, data: '2026-11-04' },
 { id: 5, descricao: 'Venda de sapateira', tipo: 'entrada', valor: 350.00, data: '2026-11-05' },
 { id: 6, descricao: 'Compra de materiais', tipo: 'saida', valor: 80.00, data: '2026-11-06' }
];


const saldoInicialPadrao = 1000.00;


/* Etapa 1 — Calcular total de receitas, soma todas as movimentações do tipo 'entrada'*/


function calcularTotalReceitas(lancamentos = lancamentosFicticios) {
 return lancamentos
   .filter(l => l.tipo.toLowerCase() === 'entrada')
   .reduce((total, l) => total + l.valor, 0);
}


const totalReceitas = calcularTotalReceitas();
console.log("Total de Receitas: R$ " + totalReceitas.toFixed(2));




function calcularTotalDespesas(lancamentos = lancamentosFicticios) {
 return lancamentos
   .filter(l => l.tipo.toLowerCase() === 'saida')
   .reduce((total, l) => total + l.valor, 0);
}


const totalDespesas = calcularTotalDespesas();
console.log("Total de Despesas: R$ " + totalDespesas.toFixed(2));


function calcularSaldo(saldoInicial = saldoInicialPadrao, receitas, despesas) {
 const totalReceitas = receitas !== undefined ? receitas : calcularTotalReceitas();
 const totalDespesas = despesas !== undefined ? despesas : calcularTotalDespesas();
  return (saldoInicial + totalReceitas) - totalDespesas;
}


const saldoFinal= calcularSaldo();
console.log("Saldo final da empresa: R$" + saldoFinal.toFixed(2))


function consultarFluxoCaixa(dataInicial, dataFinal, lancamentos = lancamentosFicticios) {
 return lancamentos
   .filter(l => {
     if (!dataInicial || !dataFinal) return true;
     return l.data >= dataInicial && l.data <= dataFinal;
   })
   .sort((a, b) => new Date(a.data) - new Date(b.data));
}


function gerarResumoFinanceiro(saldoInicial = saldoInicialPadrao, lancamentos = lancamentosFicticios) {
 const receitas = calcularTotalReceitas(lancamentos);
 const despesas = calcularTotalDespesas(lancamentos);
 const saldoFinal = calcularSaldo(saldoInicial, receitas, despesas);


 return {
   saldoInicial: `R$ ${saldoInicial.toFixed(2)}`,
   totalReceitas: `R$ ${receitas.toFixed(2)}`,
   totalDespesas: `R$ ${despesas.toFixed(2)}`,
   saldoFinal: `R$ ${saldoFinal.toFixed(2)}`
 };
}


console.log("=== FLUXO DE CAIXA COMPLETO ===");
const resultadoCompleto = consultarFluxoCaixa();
console.table(resultadoCompleto);


console.log("\n=== RESUMO FINANCEIRO (ETAPA 5) ===");
const resumo = gerarResumoFinanceiro();
console.log(resumo);


// EXPORTAÇÃO DAS FUNÇÕES
module.exports ={
 calcularTotalReceitas,
 calcularTotalDespesas,
 calcularSaldo,
 consultarFluxoCaixa,
 gerarResumoFinanceiro,
 lancamentosFicticios
};
// Funções: calcularTotalReceitas, calcularTotalDespesas, calcularSaldo, consultarFluxoCaixa, gerarResumoFinanceiro*/


