
const lancamentos = [];

function cadastrarLancamento(descricao, tipo, valor) {
    const lancamento = {
        id_lancamento: lancamentos.length + 1,
        descricao: descricao,
        tipo_lancamento: tipo,
        valor: valor
    };

    lancamentos.push(lancamento);

    return lancamento;
}


function listarLancamentos() {
    return lancamentos;
}


function buscarLancamentoPorId(id) {
    return lancamentos.find(function(lancamento) {
        return lancamento.id_lancamento === id;
    });
}


function buscarPorDescricao(texto) {
    return lancamentos.filter(function(lancamento) {
        return lancamento.descricao.toLowerCase()
            .includes(texto.toLowerCase());
    });
}

function buscarPorValor(valor) {
    return lancamentos.filter(function(lancamento) {
        return lancamento.valor === valor;
    });
}


function atualizarLancamento(id, descricao, tipo, valor) {
    const lancamento = buscarLancamentoPorId(id);

    if (lancamento === undefined) {
        return "Lançamento não encontrado!";
    }

    lancamento.descricao = descricao;
    lancamento.tipo_lancamento = tipo;
    lancamento.valor = valor;

    return lancamento;
}


function excluirLancamento(id) {
    const indice = lancamentos.findIndex(function(lancamento) {
        return lancamento.id_lancamento === id;
    });

    if (indice === -1) {
        return "Lançamento não encontrado!";
    }

    lancamentos.splice(indice, 1);

    return "Lançamento excluído com sucesso!";
}



// Testando a função
cadastrarLancamento("Venda de bandeja", "entrada", 150);
cadastrarLancamento("Compra de madeira", "saida", 80);


console.log("Excluindo lançamento:");
console.log(excluirLancamento(2));

console.log("Lançamentos restantes:");
console.log(listarLancamentos());


console.log("Buscando pela descrição:");
console.log(buscarPorDescricao("bandeja"));

console.log("Buscando pelo valor:");
console.log(buscarPorValor(150));

module.exports = {
    cadastrarLancamento,
    listarLancamentos,
    buscarLancamentoPorId,
    buscarPorDescricao,
    buscarPorValor,
    atualizarLancamento,
    excluirLancamento
};