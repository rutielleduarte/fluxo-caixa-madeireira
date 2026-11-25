// Painel Gomes Marenda - JavaScript puro, sem bibliotecas de front-end.
// As rotas reais deste projeto estão em /lancamentos (e não em /api/lancamentos).

const API = '/lancamentos';
const $ = (id) => document.getElementById(id);
const dinheiro = (valor) => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const numero = (valor) => Number(valor || 0);
const seguro = (texto) => String(texto ?? '').replace(/[&<>"']/g, caractere => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[caractere]));

const estado = {
  lancamentos: [],
  usuarios: [],
  categorias: [],
  contas: [],
  demonstracao: false,
  conectado: false
};

function hojeISO() {
  const agora = new Date();
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
}

function dataBR(valor) {
  const partes = String(valor || '').slice(0, 10).split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '--';
}

function mostrarStatus(tipo, texto) {
  const elemento = $('conexao');
  elemento.className = `conexao ${tipo}`;
  elemento.innerHTML = `<span class="bolinha"></span>${seguro(texto)}`;
}

function mostrarAviso(titulo, texto, botao, acao) {
  $('avisoSistema').hidden = false;
  $('avisoTitulo').textContent = titulo;
  $('avisoTexto').textContent = texto;
  $('acaoAviso').textContent = botao;
  $('acaoAviso').onclick = acao;
}

function esconderAviso() {
  $('avisoSistema').hidden = true;
}

function notificacao(mensagem, erro = false) {
  let toast = document.getElementById('toastSistema');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastSistema';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.className = `toast visivel${erro ? ' toast-erro' : ''}`;
  clearTimeout(notificacao.tempo);
  notificacao.tempo = setTimeout(() => toast.classList.remove('visivel'), 4200);
}

// Faz chamadas ao backend Express existente.
async function chamarRota(rota, configuracao = {}) {
  const resposta = await fetch(rota, {
    ...configuracao,
    headers: { 'Content-Type': 'application/json', ...(configuracao.headers || {}) }
  });
  const retorno = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(retorno?.erro || retorno?.mensagem || `Erro HTTP ${resposta.status}`);
  }
  // Alguns controladores do projeto devolvem erros em strings com status 200.
  if (typeof retorno === 'string' && /^erro:/i.test(retorno)) throw new Error(retorno);
  return retorno;
}

async function chamarAPI(caminho = '', configuracao = {}) {
  return chamarRota(API + caminho, configuracao);
}

// Dados ilustrativos usados SOMENTE na demonstracao visual, nao no MySQL.
function exemplos() {
  const dataMes = (mesesAtras, dia) => {
    const agora = new Date();
    const data = new Date(agora.getFullYear(), agora.getMonth() - mesesAtras, dia);
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  };
  const dados = [
    ['Venda de caixas organizadoras', 'entrada', 1890, 0, 13, 1],
    ['Compra de madeira pinus', 'saida', 750, 0, 10, 2],
    ['Venda de bandejas personalizadas', 'entrada', 2650, 0, 7, 1],
    ['Frete e transporte', 'saida', 340, 0, 3, 3],
    ['Venda de kits decorativos', 'entrada', 2240, 1, 22, 1],
    ['Compra de verniz e acabamento', 'saida', 820, 1, 12, 2],
    ['Venda de caixas para presentes', 'entrada', 3470, 2, 16, 1],
    ['Conta de energia', 'saida', 610, 2, 8, 3],
    ['Venda de cestas de madeira', 'entrada', 3100, 3, 19, 1],
    ['Reposição de matéria-prima', 'saida', 1290, 3, 12, 2],
    ['Venda de produtos artesanais', 'entrada', 2750, 4, 14, 1],
    ['Compra de embalagens', 'saida', 530, 4, 5, 2],
    ['Venda no atacado', 'entrada', 4100, 5, 18, 1],
    ['Despesas operacionais', 'saida', 1150, 5, 9, 3]
  ];
  return dados.map((item, i) => ({
    id_lancamento: i + 1,
    descricao: item[0],
    tipo_lancamento: item[1],
    valor: item[2],
    data_lancamento: dataMes(item[3], item[4]),
    id_usuario: 1,
    id_categoria: item[5],
    id_conta: 1,
    forma_pagamento: i % 2 ? 'Pix' : 'Transferência',
    observacao: ''
  }));
}

function preencherSelect(elemento, itens, { valorChave, textoFn, placeholder }) {
  if (!elemento || elemento.tagName !== 'SELECT') return;
  const opcoes = [];
  if (placeholder) {
    opcoes.push(`<option value="">${seguro(placeholder)}</option>`);
  }
  itens.forEach((item) => {
    const valor = item[valorChave];
    const texto = textoFn(item);
    opcoes.push(`<option value="${seguro(valor)}">${seguro(texto)}</option>`);
  });
  elemento.innerHTML = opcoes.join('');
}

function atualizarSelectCategorias(categoriaSelecionada = '') {
  const selectCategoria = $('idCategoria');
  if (!selectCategoria || selectCategoria.tagName !== 'SELECT') return;

  const tipoAtual = $('tipo')?.value || 'entrada';
  const filtradas = estado.categorias.filter((cat) => {
    const tipoCat = String(cat.tipo_categoria || cat.tipo || cat.tipo_lancamento || '').toLowerCase();
    return !tipoCat || tipoCat === tipoAtual.toLowerCase();
  });

  preencherSelect(selectCategoria, filtradas, {
    valorChave: 'id_categoria',
    textoFn: (cat) => cat.nome_categoria || cat.nome || cat.descricao || `Categoria #${cat.id_categoria}`,
    placeholder: filtradas.length ? 'Selecione uma categoria' : 'Nenhuma categoria disponível'
  });

  if (categoriaSelecionada) {
    selectCategoria.value = String(categoriaSelecionada);
  }
}

async function carregarOpcoesFormulario() {
  const selectUsuario = $('idUsuario');
  const selectConta = $('idConta');

  // Fallback para modo demonstração ou quando o backend ainda não expõe essas rotas
  const padraoUsuarios = [{ id_usuario: 1, nome: 'Administrador (Demo)' }];
  const padraoCategorias = [
    { id_categoria: 1, nome: 'Vendas de produtos', tipo: 'entrada' },
    { id_categoria: 2, nome: 'Matéria-prima e insumos', tipo: 'saida' },
    { id_categoria: 3, nome: 'Operacional e logística', tipo: 'saida' }
  ];
  const padraoContas = [{ id_conta: 1, nome: 'Caixa Principal' }];

  if (estado.demonstracao || location.protocol === 'file:') {
    estado.usuarios = padraoUsuarios;
    estado.categorias = padraoCategorias;
    estado.contas = padraoContas;
  } else {
    const [resUsuarios, resCategorias, resContas] = await Promise.allSettled([
      chamarRota('/usuarios'),
      chamarRota('/categorias'),
      chamarRota('/contas')
    ]);

    estado.usuarios = resUsuarios.status === 'fulfilled' && Array.isArray(resUsuarios.value) && resUsuarios.value.length
      ? resUsuarios.value
      : padraoUsuarios;

    estado.categorias = resCategorias.status === 'fulfilled' && Array.isArray(resCategorias.value) && resCategorias.value.length
      ? resCategorias.value
      : padraoCategorias;

    estado.contas = resContas.status === 'fulfilled' && Array.isArray(resContas.value) && resContas.value.length
      ? resContas.value
      : padraoContas;
  }

  preencherSelect(selectUsuario, estado.usuarios, {
    valorChave: 'id_usuario',
    textoFn: (u) => u.nome || u.email || `Usuário #${u.id_usuario}`,
    placeholder: 'Selecione o responsável'
  });

if (selectConta && selectConta.tagName === 'SELECT') {
    preencherSelect(selectConta, estado.contas, {
      valorChave: 'id_conta',
      textoFn: (c) => c.nome_conta || c.nome || c.descricao || `Conta #${c.id_conta}`,
      placeholder: 'Selecione a conta'
    });
  }

  atualizarSelectCategorias();
}

function entrarDemonstracao() {
  estado.demonstracao = true;
  estado.conectado = false;
  estado.lancamentos = exemplos();
  carregarOpcoesFormulario();
  mostrarStatus('demo', 'Modo demonstração');
  mostrarAviso(
    'Você está visualizando dados de exemplo',
    'As informações são fictícias. Neste modo, as alterações não são salvas no MySQL.',
    'Conectar ao banco',
    () => { estado.demonstracao = false; carregarLancamentos(); }
  );
  renderizar();
}

async function carregarLancamentos() {
  if (estado.demonstracao) { renderizar(); return; }
  mostrarStatus('', 'Conectando...');
  try {
    const dados = await chamarAPI();
    if (!Array.isArray(dados)) throw new Error('A API não retornou uma lista de lançamentos.');
    estado.lancamentos = dados;
    estado.conectado = true;
    esconderAviso();
    mostrarStatus('online', 'Conectado ao sistema');
    renderizar();
  } catch (erro) {
    estado.lancamentos = [];
    estado.conectado = false;
    mostrarStatus('offline', 'Sem conexão com os dados');
    mostrarAviso(
      'Não foi possível carregar os lançamentos do MySQL',
      'Verifique o servidor, o banco de dados e a rota /lancamentos. Você também pode visualizar a interface com dados de exemplo.',
      'Ver demonstração',
      entrarDemonstracao
    );
    renderizar();
    console.warn('Erro ao consultar lançamentos:', erro.message);
  }
}

function listaFiltrada() {
  const termo = $('busca').value.trim().toLocaleLowerCase('pt-BR');
  const tipo = $('filtroTipo').value;
  const inicial = $('dataInicial').value;
  const final = $('dataFinal').value;
  return estado.lancamentos.filter((lancamento) => {
    const descricao = String(lancamento.descricao || '').toLocaleLowerCase('pt-BR');
    const data = String(lancamento.data_lancamento || '').slice(0, 10);
    return (!termo || descricao.includes(termo)) &&
      (!tipo || lancamento.tipo_lancamento === tipo) &&
      (!inicial || data >= inicial) &&
      (!final || data <= final);
  }).sort((a, b) => String(b.data_lancamento).localeCompare(String(a.data_lancamento)));
}

function preencherIndicadores(lista) {
  const entradas = lista.filter(l => l.tipo_lancamento === 'entrada').reduce((soma, l) => soma + numero(l.valor), 0);
  const saidas = lista.filter(l => l.tipo_lancamento === 'saida').reduce((soma, l) => soma + numero(l.valor), 0);
  const saldoInicial = Number($('saldoInicial').value) || 0;
  const saldo = saldoInicial + entradas - saidas;
  $('saldoFinal').textContent = dinheiro(saldo);
  $('totalReceitas').textContent = dinheiro(entradas);
  $('totalDespesas').textContent = dinheiro(saidas);
  $('totalLancamentos').textContent = lista.length.toLocaleString('pt-BR');
  $('resumoEntradas').textContent = dinheiro(entradas);
  $('resumoSaidas').textContent = dinheiro(saidas);
  $('resumoSaldo').textContent = dinheiro(saldo);
}

function renderizarGrafico() {
  const meses = Array.from({ length: 6 }, (_, indice) => {
    const data = new Date();
    data.setDate(1);
    data.setMonth(data.getMonth() - (5 - indice));
    return { chave: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`, nome: data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), entrada: 0, saida: 0 };
  });
  estado.lancamentos.forEach((l) => {
    const mes = meses.find(m => String(l.data_lancamento).slice(0, 7) === m.chave);
    if (mes && ['entrada', 'saida'].includes(l.tipo_lancamento)) mes[l.tipo_lancamento] += numero(l.valor);
  });
  const maximo = Math.max(1, ...meses.flatMap(m => [m.entrada, m.saida]));
  $('grafico').innerHTML = meses.map(m => {
    const alturaEntrada = m.entrada ? Math.max(3, m.entrada / maximo * 100) : 0;
    const alturaSaida = m.saida ? Math.max(3, m.saida / maximo * 100) : 0;
    return `<div class="grafico-mes"><div class="grafico-barras">
      <div class="grafico-barra" style="height:${alturaEntrada.toFixed(2)}%" title="${seguro(m.nome)} - Entradas: ${dinheiro(m.entrada)}"></div>
      <div class="grafico-barra saida" style="height:${alturaSaida.toFixed(2)}%" title="${seguro(m.nome)} - Saídas: ${dinheiro(m.saida)}"></div>
      </div><span class="grafico-mes-label">${seguro(m.nome)}</span></div>`;
  }).join('');
}

function renderizarTabela(lista) {
  if (!lista.length) {
    $('corpoTabela').innerHTML = `<tr><td colspan="6" class="tabela-vazia">Nenhum lançamento encontrado.<br>Use “Novo lançamento” para cadastrar uma movimentação ou ajuste os filtros.</td></tr>`;
  } else {
    $('corpoTabela').innerHTML = lista.map(l => {
      const entrada = l.tipo_lancamento === 'entrada';
      const id = Number(l.id_lancamento);
      const catEncontrada = estado.categorias.find(c => Number(c.id_categoria) === Number(l.id_categoria));
      const nomeCategoria = catEncontrada
  ? (catEncontrada.nome_categoria || catEncontrada.nome)
  : `Categoria #${l.id_categoria}`;
      
      return `<tr>
        <td><span class="descricao-principal">${seguro(l.descricao)}</span><span class="descricao-secundaria">${seguro(l.forma_pagamento || 'Forma de pagamento não informada')}</span></td>
        <td>${dataBR(l.data_lancamento)}</td>
        <td><span class="etiqueta ${entrada ? 'entrada' : 'saida'}">${entrada ? 'Entrada' : 'Saída'}</span></td>
        <td>${seguro(nomeCategoria)}</td>
        <td class="alinhar-direita"><span class="valor-tabela ${entrada ? 'valor-entrada' : 'valor-saida'}">${entrada ? '+ ' : '- '}${dinheiro(l.valor)}</span></td>
        <td class="alinhar-direita"><button type="button" class="acao-linha" title="Editar lançamento" aria-label="Editar ${seguro(l.descricao)}" data-acao="editar" data-id="${id}"><svg class="icone"><use href="#i-pencil"/></svg></button><button type="button" class="acao-linha apagar" title="Excluir lançamento" aria-label="Excluir ${seguro(l.descricao)}" data-acao="excluir" data-id="${id}"><svg class="icone"><use href="#i-trash"/></svg></button></td>
      </tr>`;
    }).join('');
  }
  $('contagem').textContent = `${lista.length} ${lista.length === 1 ? 'lançamento encontrado' : 'lançamentos encontrados'}`;
}

function renderizar() {
  const lista = listaFiltrada();
  preencherIndicadores(lista);
  renderizarGrafico();
  renderizarTabela(lista);
}

function abrirFormulario(lancamento = null) {
  $('formLancamento').reset();
  $('mensagem').textContent = '';
  $('idLancamento').value = lancamento?.id_lancamento || '';
  $('tituloForm').textContent = lancamento ? 'Editar lançamento' : 'Novo lançamento';
  $('btnSalvar').textContent = lancamento ? 'Salvar alterações' : 'Salvar lançamento';
  $('descricao').value = lancamento?.descricao || '';
  $('tipo').value = lancamento?.tipo_lancamento || 'entrada';
  $('valor').value = lancamento?.valor ?? '';
  $('data').value = String(lancamento?.data_lancamento || hojeISO()).slice(0, 10);
  $('forma').value = lancamento?.forma_pagamento || '';
  $('observacao').value = lancamento?.observacao || '';

  const usuarioAlvo = lancamento?.id_usuario || localStorage.getItem('gm_id_usuario') || '';
  const categoriaAlvo = lancamento?.id_categoria || localStorage.getItem('gm_id_categoria') || '';
  const contaAlvo = lancamento?.id_conta || localStorage.getItem('gm_id_conta') || '';

  atualizarSelectCategorias(categoriaAlvo);
  $('idUsuario').value = usuarioAlvo;
  $('idConta').value = contaAlvo;
  $('modalLancamento').showModal();
  $('descricao').focus();
}

function fecharFormulario() { $('modalLancamento').close(); }

async function salvarFormulario(evento) {
  evento.preventDefault();
  if (!estado.demonstracao && !estado.conectado) {
    $('mensagem').textContent = 'Sem conexão: ative a demonstração ou conecte o MySQL antes de salvar.';
    return;
  }
  const id = Number($('idLancamento').value);
  const dados = {
    descricao: $('descricao').value.trim(),
    tipo_lancamento: $('tipo').value,
    valor: Number($('valor').value),
    data_lancamento: $('data').value,
    forma_pagamento: $('forma').value || null,
    observacao: $('observacao').value.trim() || null,
    id_usuario: Number($('idUsuario').value),
    id_categoria: Number($('idCategoria').value),
    id_conta: Number($('idConta').value)
  };
  if (!dados.descricao || !Number.isFinite(dados.valor) || dados.valor <= 0) {
    $('mensagem').textContent = 'Preencha uma descrição e um valor maior que zero.';
    return;
  }
  if ([dados.id_usuario, dados.id_categoria, dados.id_conta].some(n => !Number.isInteger(n) || n <= 0)) {
    $('mensagem').textContent = 'Informe IDs inteiros positivos para usuário, categoria e conta.';
    return;
  }
  const botao = $('btnSalvar');
  botao.disabled = true;
  botao.textContent = 'Salvando...';
  try {
    if (estado.demonstracao) {
      if (id) {
        estado.lancamentos = estado.lancamentos.map(l => Number(l.id_lancamento) === id ? { ...l, ...dados } : l);
      } else {
        estado.lancamentos.unshift({ ...dados, id_lancamento: Math.max(0, ...estado.lancamentos.map(l => Number(l.id_lancamento))) + 1 });
      }
    } else {
      await chamarAPI(id ? `/${id}` : '', { method: id ? 'PUT' : 'POST', body: JSON.stringify(dados) });
    }
    localStorage.setItem('gm_id_usuario', String(dados.id_usuario));
    localStorage.setItem('gm_id_categoria', String(dados.id_categoria));
    localStorage.setItem('gm_id_conta', String(dados.id_conta));
    fecharFormulario();
    if (estado.demonstracao) renderizar();
    else await carregarLancamentos();
    notificacao(id ? 'Lançamento atualizado com sucesso.' : 'Lançamento cadastrado com sucesso.');
  } catch (erro) {
    $('mensagem').textContent = erro.message;
  } finally {
    botao.disabled = false;
    botao.textContent = id ? 'Salvar alterações' : 'Salvar lançamento';
  }
}

async function excluirLancamento(id) {
  const lancamento = estado.lancamentos.find(l => Number(l.id_lancamento) === id);
  if (!lancamento) return;
  if (!confirm(`Excluir o lançamento “${lancamento.descricao}”? Essa ação não pode ser desfeita.`)) return;
  try {
    if (estado.demonstracao) estado.lancamentos = estado.lancamentos.filter(l => Number(l.id_lancamento) !== id);
    else await chamarAPI(`/${id}`, { method: 'DELETE' });
    if (estado.demonstracao) renderizar();
    else await carregarLancamentos();
    notificacao('Lançamento excluído.');
  } catch (erro) {
    notificacao(`Não foi possível excluir: ${erro.message}`, true);
  }
}

// Eventos da pagina.
document.querySelectorAll('[data-abrir-cadastro]').forEach(botao => botao.addEventListener('click', () => abrirFormulario()));
$('fecharModal').addEventListener('click', fecharFormulario);
$('btnCancelar').addEventListener('click', fecharFormulario);
$('modalLancamento').addEventListener('click', evento => { if (evento.target === $('modalLancamento')) fecharFormulario(); });
$('formLancamento').addEventListener('submit', salvarFormulario);
$('corpoTabela').addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === 'editar') {
    const lancamento = estado.lancamentos.find(l => Number(l.id_lancamento) === id);
    if (lancamento) abrirFormulario(lancamento);
  }
  if (botao.dataset.acao === 'excluir') excluirLancamento(id);
});
['busca', 'filtroTipo', 'dataInicial', 'dataFinal'].forEach(id => $(id).addEventListener('input', renderizar));
$('limparFiltros').addEventListener('click', () => {
  ['busca', 'filtroTipo', 'dataInicial', 'dataFinal'].forEach(id => { $(id).value = ''; });
  renderizar();
});
$('saldoInicial').addEventListener('input', () => {
  localStorage.setItem('gm_saldo_inicial', $('saldoInicial').value);
  renderizar();
});
$('atualizar').addEventListener('click', () => {
  if (estado.demonstracao) { notificacao('Modo demonstração: dados locais atualizados.'); renderizar(); }
  else carregarLancamentos();
});
document.querySelectorAll('[data-nav]').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('[data-nav]').forEach(item => item.classList.toggle('ativo', item === link));
}));

// Atualiza as categorias disponíveis sempre que o usuário alternar entre "Entrada" e "Saída"
$('tipo').addEventListener('change', () => {
  atualizarSelectCategorias();
});

// Inicializacao.
$('dataAtual').textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
$('anoAtual').textContent = new Date().getFullYear();
$('saldoInicial').value = localStorage.getItem('gm_saldo_inicial') ?? '0';

if (location.protocol === 'file:' || new URLSearchParams(location.search).get('demo') === '1') {
  entrarDemonstracao();
} else {
  carregarOpcoesFormulario().then(carregarLancamentos);
}
