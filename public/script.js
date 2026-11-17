// ===== Configuração (ajuste conforme seu back-end) =====
const CONFIG = {
  API: 'http://localhost:3000/api',   // URL base da API
  ID_USUARIO: 1,                      // até existir login, usa um usuário fixo
  ID_CONTA: 1,
  CATEGORIAS: [                       // ids devem existir na tabela categoria
    { id: 1, nome: 'Vendas' },
    { id: 2, nome: 'Matéria-prima' },
    { id: 3, nome: 'Despesas fixas' },
    { id: 4, nome: 'Outros' }
  ]
};

const $ = id => document.getElementById(id);
const moeda = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let lancamentos = [];

// O back-end devolve mensagens de erro como texto simples (status 200); tratamos aqui.
async function api(caminho, opcoes = {}) {
  const resp = await fetch(CONFIG.API + caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes
  });
  const dados = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((dados && (dados.erro || dados.mensagem)) || 'Falha na requisição.');
  if (typeof dados === 'string' && dados.toLowerCase().startsWith('erro')) throw new Error(dados);
  return dados;
}

function mostrarMensagem(texto, tipo) {
  const el = $('mensagem');
  el.textContent = texto;
  el.className = tipo || '';
}

async function carregar() {
  try {
    lancamentos = await api('/lancamentos');
    renderizar();
  } catch (e) {
    $('corpoTabela').innerHTML = `<tr><td colspan="5" class="vazio">Não foi possível carregar os lançamentos. Verifique se o servidor está rodando em ${esc(CONFIG.API)}.</td></tr>`;
  }
}

function filtrados() {
  const busca = $('busca').value.trim().toLowerCase();
  const tipo = $('filtroTipo').value;
  const ini = $('dataInicial').value;
  const fim = $('dataFinal').value;
  return lancamentos
    .filter(l => (!busca || l.descricao.toLowerCase().includes(busca)) &&
                 (!tipo || l.tipo_lancamento === tipo) &&
                 (!ini || l.data_lancamento >= ini) &&
                 (!fim || l.data_lancamento <= fim))
    .sort((a, b) => b.data_lancamento.localeCompare(a.data_lancamento));
}

function renderizar() {
  const lista = filtrados();
  $('corpoTabela').innerHTML = lista.length ? lista.map(l => `
    <tr>
      <td>${l.data_lancamento.split('-').reverse().join('/')}</td>
      <td>${esc(l.descricao)}</td>
      <td>${l.tipo_lancamento === 'entrada' ? 'Entrada' : 'Saída'}</td>
      <td class="num ${l.tipo_lancamento === 'entrada' ? 'pos' : 'neg'}">${l.tipo_lancamento === 'entrada' ? '+' : '−'} ${moeda(l.valor)}</td>
      <td class="acoes-linha">
        <button class="secundario" data-editar="${l.id_lancamento}">Editar</button>
        <button class="perigo" data-excluir="${l.id_lancamento}">Excluir</button>
      </td>
    </tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhum lançamento encontrado. Cadastre o primeiro no formulário ao lado.</td></tr>';

  // O resumo considera o período/filtros aplicados à lista
  const soma = tipo => lista.filter(l => l.tipo_lancamento === tipo).reduce((t, l) => t + Number(l.valor), 0);
  const receitas = soma('entrada'), despesas = soma('saida');
  const saldoInicial = parseFloat($('saldoInicial').value) || 0;
  $('totalReceitas').textContent = moeda(receitas);
  $('totalDespesas').textContent = moeda(despesas);
  $('saldoFinal').textContent = moeda(saldoInicial + receitas - despesas);
}

function limparFormulario() {
  $('formLancamento').reset();
  $('idLancamento').value = '';
  $('data').value = new Date().toISOString().slice(0, 10);
  $('tituloForm').textContent = 'Novo lançamento';
  $('btnSalvar').textContent = 'Salvar lançamento';
  $('btnCancelar').hidden = true;
}

$('formLancamento').addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('idLancamento').value;
  const dados = {
    descricao: $('descricao').value.trim(),
    tipo_lancamento: $('tipo').value,
    valor: Number($('valor').value),
    data_lancamento: $('data').value,
    forma_pagamento: $('forma').value || null,
    observacao: $('observacao').value.trim() || null,
    id_usuario: CONFIG.ID_USUARIO,
    id_categoria: Number($('categoria').value),
    id_conta: CONFIG.ID_CONTA
  };
  try {
    await api(id ? `/lancamentos/${id}` : '/lancamentos', { method: id ? 'PUT' : 'POST', body: JSON.stringify(dados) });
    limparFormulario();
    mostrarMensagem(id ? 'Lançamento atualizado.' : 'Lançamento salvo.', 'ok');
    await carregar();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

$('corpoTabela').addEventListener('click', async e => {
  const idEditar = e.target.dataset.editar, idExcluir = e.target.dataset.excluir;
  if (idEditar) {
    const l = lancamentos.find(x => x.id_lancamento == idEditar);
    $('idLancamento').value = l.id_lancamento;
    $('descricao').value = l.descricao;
    $('tipo').value = l.tipo_lancamento;
    $('valor').value = l.valor;
    $('data').value = l.data_lancamento;
    $('forma').value = l.forma_pagamento || '';
    $('categoria').value = l.id_categoria;
    $('observacao').value = l.observacao || '';
    $('tituloForm').textContent = 'Editar lançamento';
    $('btnSalvar').textContent = 'Salvar alterações';
    $('btnCancelar').hidden = false;
    $('descricao').focus();
  }
  if (idExcluir && confirm('Excluir este lançamento? Essa ação não pode ser desfeita.')) {
    try {
      await api(`/lancamentos/${idExcluir}`, { method: 'DELETE' });
      mostrarMensagem('Lançamento excluído.', 'ok');
      await carregar();
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    }
  }
});

$('btnCancelar').addEventListener('click', () => { limparFormulario(); mostrarMensagem(''); });
['busca', 'filtroTipo', 'dataInicial', 'dataFinal'].forEach(id => $(id).addEventListener('input', renderizar));
$('saldoInicial').addEventListener('input', () => {
  localStorage.setItem('saldoInicial', $('saldoInicial').value);
  renderizar();
});

// Início
$('categoria').innerHTML = CONFIG.CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');
$('saldoInicial').value = localStorage.getItem('saldoInicial') ?? 1000;
limparFormulario();
carregar();