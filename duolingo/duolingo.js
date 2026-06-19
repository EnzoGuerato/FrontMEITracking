/* =====================================================================
   Duolingo · MEI Track
   ─────────────────────────────────────────────────────────────────────
   TODO (API/BD): substituir as funções marcadas com [API] por chamadas
   reais ao backend. Os pontos de integração estão comentados ao longo
   do arquivo com o bloco:
     // ── [API] ──────────────────────────────────────────────
   ===================================================================== */

'use strict';

/* =====================================================================
   Estado da Aplicação
   ===================================================================== */
let estadoApp = {
  moedas:              100,
  ofensiva:            0,
  vidasGlobais:        5,
  ultimoAcessoDia:     '',
  ultimaPerdaVidaHora: null,
  licaoAtual:          1,
  totalLicoes:         20,
  nomeUsuario:         localStorage.getItem('meitrack_perfil_nome') || 'Jogador_01',
  progressoM1:         0,
  progressoM2:         0,
  rankingInvertido:    false,
  tamanhoFonte:        'normal',
};

const KEY_ESTADO     = 'estado_meizinho_v3';
const KEY_DARK_MODE  = 'meitrack_dark_mode';
const LEGACY_DARK    = 'modo_escuro';

/* =====================================================================
   Banco de Lições (Placeholder — será substituído pela API)
   ─────────────────────────────────────────────────────────────────────
   // ── [API] ──────────────────────────────────────────────────────────
   // GET /api/licoes?unidade=1
   // Retorna: { licoes: [ { id, tipo, perguntas: [...] } ] }
   // Cada pergunta: { titulo, opcoes: string[], correta: number }
   // ───────────────────────────────────────────────────────────────────
   ===================================================================== */
const bancoLicoes = {
  1: {
    tipo: 'verde',
    perguntas: [
      { titulo: 'O que é MEI?', opcoes: ['Micro Empreendedor Individual', 'Médio Empreendedor Informal', 'Micro Empresa Independente', 'Mercado Econômico Integrado'], correta: 0 },
      { titulo: 'Qual o limite de faturamento anual do MEI?', opcoes: ['R$ 50.000', 'R$ 81.000', 'R$ 100.000', 'R$ 120.000'], correta: 1 },
      { titulo: 'O MEI pode ter funcionários?', opcoes: ['Não, nenhum', 'Sim, até 1 funcionário', 'Sim, até 3 funcionários', 'Sim, até 5 funcionários'], correta: 1 },
      { titulo: 'Qual documento representa o MEI?', opcoes: ['CNPJ', 'CPF', 'RG', 'Passaporte'], correta: 0 },
      { titulo: 'Como se chama o pagamento mensal obrigatório do MEI?', opcoes: ['IPTU', 'DAS', 'IRPF', 'FGTS'], correta: 1 },
    ],
  },
  2: {
    tipo: 'azul',
    perguntas: [
      { titulo: 'O que é fluxo de caixa?', opcoes: ['Controle de entradas e saídas de dinheiro', 'Empréstimo bancário', 'Imposto sobre circulação', 'Taxa de serviço'], correta: 0 },
      { titulo: 'Nota fiscal é obrigatória para o MEI?', opcoes: ['Nunca', 'Depende da atividade', 'Sempre, em todas as vendas', 'Apenas acima de R$ 1.000'], correta: 1 },
      { titulo: 'O que é capital de giro?', opcoes: ['Dinheiro para pagar impostos', 'Dinheiro para operações do dia a dia', 'Investimento em equipamentos', 'Reserva para aposentadoria'], correta: 1 },
      { titulo: 'Qual a vantagem do MEI em relação ao autônomo?', opcoes: ['Paga menos impostos', 'Tem CNPJ e acesso a crédito', 'Não precisa declarar renda', 'Pode contratar mais funcionários'], correta: 1 },
      { titulo: 'Declaração Anual do MEI se chama:', opcoes: ['DIRPF', 'DASN-SIMEI', 'ECF', 'SPED'], correta: 1 },
    ],
  },
};

// Lições 3–20 usam perguntas da lição 1 como placeholder até a API
for (let k = 3; k <= 20; k++) {
  bancoLicoes[k] = {
    tipo: k % 5 === 0 ? 'ouro' : k % 4 === 0 ? 'roxo' : k % 3 === 0 ? 'laranja' : k % 2 === 0 ? 'azul' : 'verde',
    perguntas: bancoLicoes[1].perguntas,
  };
}

/* =====================================================================
   Competidores do Ranking (Placeholder)
   ─────────────────────────────────────────────────────────────────────
   // ── [API] ──────────────────────────────────────────────────────────
   // GET /api/ranking?divisao=ouro
   // Retorna: { competidores: [ { id, nome, moedas, ofensiva } ] }
   // ───────────────────────────────────────────────────────────────────
   ===================================================================== */
let listaCompetidores = [
  { nome: 'Luis_Nativo',   moedas: 1250, ofensiva: 45 },
  { nome: 'Fernanda_Eng',  moedas: 980,  ofensiva: 12 },
  { nome: 'Carlos_BR',     moedas: 720,  ofensiva: 8  },
  { nome: 'Jogador_01',    moedas: 100,  ofensiva: 0, isPlayer: true },
  { nome: 'Amanda_Silv',   moedas: 410,  ofensiva: 3  },
];

/* =====================================================================
   Sistema de Toast / Notificações
   ===================================================================== */
const toastContainer = document.getElementById('toast-container');

/**
 * Exibe uma notificação toast.
 * @param {string} mensagem  - Texto da notificação
 * @param {'sucesso'|'erro'|'info'|'aviso'} tipo
 * @param {number} duracao   - Duração em ms (padrão 3000)
 */
function mostrarToast(mensagem, tipo = 'info', duracao = 3000) {
  const icones = { sucesso: '✅', erro: '❌', info: 'ℹ️', aviso: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.innerHTML = `<span class="toast__icone">${icones[tipo] || 'ℹ️'}</span><span class="toast__msg">${mensagem}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--saindo');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duracao);
}

/* =====================================================================
   Modal de Confirmação (substitui confirm())
   ===================================================================== */
const modalConfirmar     = document.getElementById('modal-confirmar');
const modalConfirmarTxt  = document.getElementById('modal-confirmar-texto');
const modalConfirmarTit  = document.getElementById('modal-confirmar-titulo');
const modalConfirmarIco  = document.getElementById('modal-confirmar-icone');
const btnConfirmarOk     = document.getElementById('modal-confirmar-ok');
const btnConfirmarCancel = document.getElementById('modal-confirmar-cancelar');

let _resolveConfirm = null;

/**
 * Exibe modal de confirmação e retorna Promise<boolean>.
 */
function confirmar(titulo, texto, icone = '⚠️') {
  modalConfirmarTit.textContent = titulo;
  modalConfirmarTxt.textContent = texto;
  modalConfirmarIco.textContent = icone;
  modalConfirmar.classList.remove('escondido');

  return new Promise(resolve => {
    _resolveConfirm = resolve;
  });
}

btnConfirmarOk.addEventListener('click', () => {
  modalConfirmar.classList.add('escondido');
  if (_resolveConfirm) { _resolveConfirm(true); _resolveConfirm = null; }
});
btnConfirmarCancel.addEventListener('click', () => {
  modalConfirmar.classList.add('escondido');
  if (_resolveConfirm) { _resolveConfirm(false); _resolveConfirm = null; }
});

/* =====================================================================
   Referências DOM
   ===================================================================== */
const elOfensiva     = document.getElementById('contador-ofensiva');
const elMoedas       = document.getElementById('contador-moedas');
const elVidas        = document.getElementById('contador-vidas');
const elTempoRecarga = document.getElementById('tempo-recarga');
const containerTrilha= document.getElementById('container-trilha-licoes');
const nomeExibicao   = document.getElementById('nome-exibicao-perfil');
const ulRanking      = document.getElementById('lista-ranking');
const conteudoPrincipal = document.getElementById('conteudo-principal');

// Dropdown perfil
const perfilWrapper  = document.getElementById('perfil-wrapper');
const perfilBtn      = document.getElementById('perfil-btn');
const perfilDropdown = document.getElementById('perfil-dropdown');
const perfilBtnNome  = document.getElementById('perfil-btn-nome');
const perfilDdNome   = document.getElementById('perfil-dropdown-nome');
const statOfensiva   = document.getElementById('stat-ofensiva');
const statMoedas     = document.getElementById('stat-moedas');
const statVidas      = document.getElementById('stat-vidas');
const ddLatM1        = document.getElementById('dd-lat-m1');
const ddLatM2        = document.getElementById('dd-lat-m2');
const ddBarraM1      = document.getElementById('dd-barra-m1');
const ddBarraM2      = document.getElementById('dd-barra-m2');
const ddBtnM1        = document.getElementById('dd-btn-m1');
const ddBtnM2        = document.getElementById('dd-btn-m2');
const ddListaRanking = document.getElementById('dd-lista-ranking');

// Navegação
const btnNavAprender = document.getElementById('nav-aprender');
const btnNavMissoes  = document.getElementById('nav-missoes');
const btnNavConfig   = document.getElementById('nav-config');
const telaAprender   = document.getElementById('tela-aprender-central');
const telaMissoes    = document.getElementById('tela-missoes-central');
const telaConfig     = document.getElementById('tela-config-central');

// Modal de lição
const modalFase           = document.getElementById('modal-fase');
const btnFecharFase       = document.getElementById('fechar-fase');
const txtTituloPergunta   = document.getElementById('titulo-pergunta');
const containerOpcoes     = document.getElementById('container-opcoes');
const btnVerificar        = document.getElementById('btn-verificar-opcao');
const caixaFeedback       = document.getElementById('caixa-feedback');
const barraProgressoFase  = document.getElementById('progresso-fase');
const txtVidasModal       = document.getElementById('vidas-modal');
const txtContadorPerguntas= document.getElementById('contador-perguntas-fase');

// Modais de resultado
const modalCelebracao     = document.getElementById('modal-celebracao');
const btnFecharCelebracao = document.getElementById('btn-fechar-celebracao');
const celebracaoMoedas    = document.getElementById('celebracao-moedas');
const celebracaoAcertos   = document.getElementById('celebracao-acertos');
const celebracaoErros     = document.getElementById('celebracao-erros');
const celebracaoXP        = document.getElementById('celebracao-xp');
const modalEliminado      = document.getElementById('modal-eliminado');
const btnFecharEliminado  = document.getElementById('btn-fechar-eliminado');
const modalEliminadoTxt   = document.getElementById('modal-eliminado-texto');

// Assinatura
const btnGerenciarAssinatura = document.getElementById('btn-gerenciar-assinatura');
const modalAssinatura        = document.getElementById('modal-assinatura');
const btnFecharAssinatura    = document.getElementById('fechar-modal-assinatura');
const btnCancelarAssinatura  = document.getElementById('btn-cancelar-assinatura');

// Missões
const btnRecolherM1    = document.getElementById('btn-recolher-m1');
const btnRecolherM2    = document.getElementById('btn-recolher-m2');
const btnRecolherLatM1 = document.getElementById('btn-recolher-lat-m1');
const btnRecolherLatM2 = document.getElementById('btn-recolher-lat-m2');
const m1Exp  = document.getElementById('barra-expandida-m1');
const m1TxtExp= document.getElementById('texto-progresso-m1');
const m1Lat  = document.getElementById('barra-lateral-m1');
const m1TxtLat= document.getElementById('txt-lat-m1');
const m2Exp  = document.getElementById('barra-expandida-m2');
const m2TxtExp= document.getElementById('texto-progresso-m2');
const m2Lat  = document.getElementById('barra-lateral-m2');
const m2TxtLat= document.getElementById('txt-lat-m2');

// Configurações
const inputNomePerfil  = document.getElementById('input-nome-perfil');
const btnSalvarNome    = document.getElementById('btn-salvar-nome');
const btnResetarProgresso = document.getElementById('btn-resetar-progresso');
const btnCheatMoedas   = document.getElementById('btn-cheat-moedas');
const btnCheatOfensiva = document.getElementById('btn-cheat-ofensiva');
const btnCheatM1       = document.getElementById('btn-cheat-m1');
const btnOrdenarRanking= document.getElementById('btn-ordenar-ranking');
const btnAlternarTema  = document.getElementById('btn-alternar-tema');
const btnTamanhoFonte  = document.getElementById('btn-tamanho-fonte');

// Estado da lição em curso
let licaoFaseIndice        = 0;
let perguntaFaseIndice     = 0;
let vidasRestantesLicao    = 3;
let opcaoSelecionadaLocal  = null;
let acertosLicao           = 0;
let errosLicao             = 0;

/* =====================================================================
   Ofensiva e Vidas
   ===================================================================== */
function verificarSincroniaOfensiva() {
  const hojeStr = new Date().toISOString().split('T')[0];
  if (!estadoApp.ultimoAcessoDia) {
    estadoApp.ultimoAcessoDia = hojeStr;
    estadoApp.ofensiva = 1;
  } else if (estadoApp.ultimoAcessoDia !== hojeStr) {
    const anterior = new Date(estadoApp.ultimoAcessoDia + 'T00:00:00');
    const atual    = new Date(hojeStr + 'T00:00:00');
    const dif = Math.floor((atual - anterior) / 86400000);
    if (dif === 1) estadoApp.ofensiva++;
    else if (dif > 1) estadoApp.ofensiva = 1;
    estadoApp.ultimoAcessoDia = hojeStr;
  }
}

setInterval(() => {
  const hojeStr = new Date().toISOString().split('T')[0];
  if (estadoApp.ultimoAcessoDia && estadoApp.ultimoAcessoDia !== hojeStr) {
    verificarSincroniaOfensiva();
    atualizarInterface();
  }
}, 10000);

function processarRegeneracaoVidas() {
  if (estadoApp.vidasGlobais >= 5) { elTempoRecarga.textContent = ''; return; }
  const agora       = Date.now();
  const dezMin      = 10 * 60 * 1000;
  if (!estadoApp.ultimaPerdaVidaHora) estadoApp.ultimaPerdaVidaHora = agora;
  const decorrido   = agora - estadoApp.ultimaPerdaVidaHora;
  const vidasGanhas = Math.floor(decorrido / dezMin);

  if (vidasGanhas > 0) {
    estadoApp.vidasGlobais = Math.min(5, estadoApp.vidasGlobais + vidasGanhas);
    estadoApp.ultimaPerdaVidaHora = estadoApp.vidasGlobais >= 5 ? null : agora - (decorrido % dezMin);
    atualizarInterface();
  }
  if (estadoApp.vidasGlobais < 5 && estadoApp.ultimaPerdaVidaHora) {
    const resto = dezMin - ((agora - estadoApp.ultimaPerdaVidaHora) % dezMin);
    elTempoRecarga.textContent = `(+1 em ${Math.floor(resto / 60000)}:${String(Math.floor((resto % 60000) / 1000)).padStart(2, '0')})`;
  }
}
setInterval(processarRegeneracaoVidas, 1000);

/* =====================================================================
   Tema (Dark Mode)
   ===================================================================== */
function aplicarModoEscuro(ativo) {
  document.documentElement.classList.toggle('dark', ativo);
  document.body.classList.toggle('dark', ativo);
  document.body.classList.toggle('modo-escuro', ativo);
  localStorage.setItem(KEY_DARK_MODE, ativo ? '1' : '0');
  localStorage.setItem(LEGACY_DARK, String(ativo));
  if (btnAlternarTema) {
    btnAlternarTema.textContent = ativo ? '☀️ Modo Claro' : '🌓 Modo Escuro';
  }
}

btnAlternarTema && btnAlternarTema.addEventListener('click', () => {
  aplicarModoEscuro(!document.body.classList.contains('modo-escuro'));
});

/* =====================================================================
   Tamanho de Fonte
   ===================================================================== */
function aplicarTamanhoFonte() {
  conteudoPrincipal.classList.remove('fonte-grande', 'fonte-gigante');
  const labels = { normal: '🔍 Fonte: Normal', grande: '🔍 Fonte: Grande', gigante: '🔍 Fonte: Gigante' };
  if (estadoApp.tamanhoFonte === 'grande')  conteudoPrincipal.classList.add('fonte-grande');
  if (estadoApp.tamanhoFonte === 'gigante') conteudoPrincipal.classList.add('fonte-gigante');
  if (btnTamanhoFonte) btnTamanhoFonte.textContent = labels[estadoApp.tamanhoFonte] || labels.normal;
}

btnTamanhoFonte && btnTamanhoFonte.addEventListener('click', () => {
  const ciclo = { normal: 'grande', grande: 'gigante', gigante: 'normal' };
  estadoApp.tamanhoFonte = ciclo[estadoApp.tamanhoFonte] || 'normal';
  aplicarTamanhoFonte();
  salvarEstado();
});

/* =====================================================================
   Navegação de Telas
   ===================================================================== */
function alternarTela(abaAtiva, telaAtiva) {
  [btnNavAprender, btnNavMissoes, btnNavConfig].forEach(b => b.classList.remove('ativo'));
  [telaAprender, telaMissoes, telaConfig].forEach(t => t.classList.add('escondido'));
  abaAtiva.classList.add('ativo');
  telaAtiva.classList.remove('escondido');
}

btnNavAprender.addEventListener('click', () => alternarTela(btnNavAprender, telaAprender));
btnNavMissoes.addEventListener('click',  () => alternarTela(btnNavMissoes,  telaMissoes));
btnNavConfig.addEventListener('click',   () => alternarTela(btnNavConfig,   telaConfig));

/* =====================================================================
   Renderização da Interface
   ===================================================================== */
function salvarEstado() {
  localStorage.setItem(KEY_ESTADO, JSON.stringify(estadoApp));
}

function atualizarInterface() {
  salvarEstado();

  elMoedas.textContent   = estadoApp.moedas;
  elOfensiva.textContent = estadoApp.ofensiva;
  elVidas.textContent    = estadoApp.vidasGlobais;
  if (nomeExibicao) nomeExibicao.textContent = estadoApp.nomeUsuario;

  // Sincroniza foto e nome global do perfil
  const fotoGlobal = localStorage.getItem('meitrack_perfil_foto');
  if (fotoGlobal) document.querySelectorAll('[data-perfil-foto]').forEach(el => { el.src = fotoGlobal; });
  const nomeGlobal = localStorage.getItem('meitrack_perfil_nome');
  if (nomeGlobal) estadoApp.nomeUsuario = nomeGlobal;

  aplicarTamanhoFonte();
  renderizarTrilha();
  renderizarRanking();
  renderizarMissoes();
  atualizarDropdownPerfil();
}

function renderizarTrilha() {
  containerTrilha.innerHTML = '';
  for (let i = 1; i <= estadoApp.totalLicoes; i++) {
    const node = document.createElement('div');
    node.classList.add('licao');
    if (i < estadoApp.licaoAtual) {
      node.classList.add('concluida-100');
      node.textContent = '✓';
    } else if (i === estadoApp.licaoAtual) {
      node.classList.add(bancoLicoes[i] ? bancoLicoes[i].tipo : 'verde');
      node.innerHTML = `<span>${i}</span>`;
    } else {
      node.classList.add('bloqueada');
      node.textContent = '🔒';
    }
    node.addEventListener('click', () => { if (i === estadoApp.licaoAtual) abrirFase(i); });
    containerTrilha.appendChild(node);
  }
}

function renderizarMissoes() {
  const pM1 = Math.min((estadoApp.progressoM1 / 3) * 100, 100);
  const pM2 = Math.min((estadoApp.progressoM2 / 300) * 100, 100);

  if (m1Exp)   m1Exp.style.width   = `${pM1}%`;
  if (m1Lat)   m1Lat.style.width   = `${pM1}%`;
  if (m1TxtExp) m1TxtExp.textContent = `${estadoApp.progressoM1} / 3`;
  if (m1TxtLat) m1TxtLat.textContent = estadoApp.progressoM1;

  if (m2Exp)   m2Exp.style.width   = `${pM2}%`;
  if (m2Lat)   m2Lat.style.width   = `${pM2}%`;
  if (m2TxtExp) m2TxtExp.textContent = `${estadoApp.progressoM2} / 300`;
  if (m2TxtLat) m2TxtLat.textContent = estadoApp.progressoM2;

  const m1Pronta = estadoApp.progressoM1 >= 3;
  const m2Pronta = estadoApp.progressoM2 >= 300;

  [btnRecolherM1, btnRecolherLatM1].forEach(b => { if (b) b.disabled = !m1Pronta; });
  [btnRecolherM2, btnRecolherLatM2].forEach(b => { if (b) b.disabled = !m2Pronta; });
  if (ddBtnM1) ddBtnM1.disabled = !m1Pronta;
  if (ddBtnM2) ddBtnM2.disabled = !m2Pronta;
}

function renderizarRanking() {
  ulRanking.innerHTML = '';
  const jogador = listaCompetidores.find(c => c.isPlayer);
  if (jogador) { jogador.moedas = estadoApp.moedas; jogador.ofensiva = estadoApp.ofensiva; }

  let lista = [...listaCompetidores].sort((a, b) => b.moedas - a.moedas);
  if (estadoApp.rankingInvertido) lista.reverse();

  lista.forEach((c, idx) => {
    const li  = document.createElement('li');
    const pos = estadoApp.rankingInvertido ? listaCompetidores.length - idx : idx + 1;
    const medalhas = ['🥇', '🥈', '🥉'];
    const posStr = medalhas[pos - 1] || `<span class="posicao">${pos}</span>`;
    const isPlayer = c.isPlayer;
    li.innerHTML = `
      <div class="usuario-info">
        ${posStr}
        <span class="nome-user" style="${isPlayer ? 'color:var(--mei-orange-deep);font-weight:900;' : ''}">${isPlayer ? estadoApp.nomeUsuario : c.nome}</span>
      </div>
      <div class="pontos-container">
        <span class="pontos-moedas">🪙 ${c.moedas}</span>
        <span class="pontos-ofensiva">🔥 ${c.ofensiva}d</span>
      </div>`;
    ulRanking.appendChild(li);
  });
}

function atualizarDropdownPerfil() {
  if (perfilBtnNome) perfilBtnNome.textContent = estadoApp.nomeUsuario;
  if (perfilDdNome)  perfilDdNome.textContent  = estadoApp.nomeUsuario;
  if (statOfensiva)  statOfensiva.textContent  = estadoApp.ofensiva;
  if (statMoedas)    statMoedas.textContent    = estadoApp.moedas;
  if (statVidas)     statVidas.textContent     = estadoApp.vidasGlobais;

  const pM1 = Math.min((estadoApp.progressoM1 / 3) * 100, 100);
  const pM2 = Math.min((estadoApp.progressoM2 / 300) * 100, 100);
  if (ddLatM1)   ddLatM1.textContent  = estadoApp.progressoM1;
  if (ddBarraM1) ddBarraM1.style.width = `${pM1}%`;
  if (ddLatM2)   ddLatM2.textContent  = estadoApp.progressoM2;
  if (ddBarraM2) ddBarraM2.style.width = `${pM2}%`;
  if (ddBtnM1)   ddBtnM1.textContent  = estadoApp.progressoM1 >= 3  ? 'Recolher +50 🪙'  : '+50 🪙';
  if (ddBtnM2)   ddBtnM2.textContent  = estadoApp.progressoM2 >= 300 ? 'Recolher +100 🪙' : '+100 🪙';

  if (ddListaRanking) {
    ddListaRanking.innerHTML = '';
    const jogador = listaCompetidores.find(c => c.isPlayer);
    if (jogador) { jogador.moedas = estadoApp.moedas; }
    const top5 = [...listaCompetidores].sort((a, b) => b.moedas - a.moedas).slice(0, 5);
    top5.forEach((c, idx) => {
      const li = document.createElement('li');
      li.className = 'perfil-ranking__item' + (c.isPlayer ? ' perfil-ranking__item--player' : '');
      const medalhas = ['🥇', '🥈', '🥉'];
      li.innerHTML = `
        <span class="perfil-ranking__pos">${medalhas[idx] || (idx + 1)}</span>
        <span class="perfil-ranking__nome">${c.isPlayer ? estadoApp.nomeUsuario : c.nome}</span>
        <span class="perfil-ranking__pts">🪙 ${c.moedas}</span>`;
      ddListaRanking.appendChild(li);
    });
  }
}

/* =====================================================================
   Dropdown de Perfil
   ===================================================================== */
if (perfilBtn) {
  perfilBtn.addEventListener('click', e => {
    e.stopPropagation();
    const aberto = !perfilDropdown.hidden;
    perfilDropdown.hidden = aberto;
    perfilBtn.setAttribute('aria-expanded', String(!aberto));
  });
}
document.addEventListener('click', e => {
  if (perfilWrapper && !perfilWrapper.contains(e.target)) {
    perfilDropdown.hidden = true;
    perfilBtn.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !perfilDropdown.hidden) {
    perfilDropdown.hidden = true;
    perfilBtn.setAttribute('aria-expanded', 'false');
    perfilBtn.focus();
  }
});

/* =====================================================================
   Missões — Recolher Recompensas
   ─────────────────────────────────────────────────────────────────────
   // ── [API] ──────────────────────────────────────────────────────────
   // POST /api/missoes/recolher  { missaoId: 1, userId }
   // Retorna: { moedas: number, progressoResetado: true }
   // ───────────────────────────────────────────────────────────────────
   ===================================================================== */
function recolherPremioM1() {
  estadoApp.moedas      += 50;
  estadoApp.progressoM1  = 0;
  mostrarToast('Você recolheu +50 moedas da Missão Diária! 🎉', 'sucesso');
  atualizarInterface();
}

function recolherPremioM2() {
  estadoApp.moedas      += 100;
  estadoApp.progressoM2  = 0;
  mostrarToast('Você recolheu +100 moedas — Caçador de Ouro! 🏆', 'sucesso');
  atualizarInterface();
}

btnRecolherM1    && btnRecolherM1.addEventListener('click',    recolherPremioM1);
btnRecolherLatM1 && btnRecolherLatM1.addEventListener('click', recolherPremioM1);
ddBtnM1          && ddBtnM1.addEventListener('click',          recolherPremioM1);
btnRecolherM2    && btnRecolherM2.addEventListener('click',    recolherPremioM2);
btnRecolherLatM2 && btnRecolherLatM2.addEventListener('click', recolherPremioM2);
ddBtnM2          && ddBtnM2.addEventListener('click',          recolherPremioM2);

btnOrdenarRanking.addEventListener('click', () => {
  estadoApp.rankingInvertido = !estadoApp.rankingInvertido;
  atualizarInterface();
});

/* =====================================================================
   Modal de Lição
   ===================================================================== */
function abrirFase(num) {
  if (estadoApp.vidasGlobais <= 0) {
    mostrarToast('Sem vidas! Aguarde a recarga ou descanse um pouco. ❤️', 'aviso', 4000);
    return;
  }
  licaoFaseIndice     = num;
  perguntaFaseIndice  = 0;
  vidasRestantesLicao = 3;
  acertosLicao        = 0;
  errosLicao          = 0;
  modalFase.classList.remove('escondido');
  exibirPerguntaAtual();
}

function exibirPerguntaAtual() {
  opcaoSelecionadaLocal = null;
  caixaFeedback.classList.add('escondido');
  caixaFeedback.className = 'caixa-feedback escondido';
  btnVerificar.disabled = true;
  btnVerificar.textContent = 'VERIFICAR';

  txtVidasModal.textContent = vidasRestantesLicao;
  const licao = bancoLicoes[licaoFaseIndice];
  barraProgressoFase.style.width = `${(perguntaFaseIndice / licao.perguntas.length) * 100}%`;
  txtContadorPerguntas.textContent = `PERGUNTA ${perguntaFaseIndice + 1} DE ${licao.perguntas.length}`;

  const perg = licao.perguntas[perguntaFaseIndice];
  txtTituloPergunta.textContent = perg.titulo;
  containerOpcoes.innerHTML = '';

  perg.opcoes.forEach((op, idx) => {
    const b = document.createElement('button');
    b.className = 'botao-opcao';
    b.textContent = op;
    b.addEventListener('click', () => {
      document.querySelectorAll('.botao-opcao').forEach(x => x.classList.remove('selecionado'));
      b.classList.add('selecionado');
      opcaoSelecionadaLocal = idx;
      btnVerificar.disabled = false;
    });
    containerOpcoes.appendChild(b);
  });
}

btnVerificar.addEventListener('click', () => {
  const licao = bancoLicoes[licaoFaseIndice];

  if (btnVerificar.textContent === 'CONTINUAR') {
    perguntaFaseIndice++;
    if (perguntaFaseIndice >= licao.perguntas.length) {
      // Lição concluída
      modalFase.classList.add('escondido');
      const moedasGanhas = 25;

      estadoApp.moedas      += moedasGanhas;
      estadoApp.progressoM2 += moedasGanhas;
      if (estadoApp.licaoAtual === licaoFaseIndice) {
        estadoApp.licaoAtual++;
        estadoApp.progressoM1++;
      }

      // ── [API] ──────────────────────────────────────────────────────
      // POST /api/licoes/concluir  { licaoId, userId, acertos, erros, moedas: moedasGanhas }
      // Retorna: { novoNivel?, novaLicao, progressoAtualizado }
      // ───────────────────────────────────────────────────────────────

      celebracaoMoedas.textContent  = `+${moedasGanhas}`;
      celebracaoAcertos.textContent = acertosLicao;
      celebracaoErros.textContent   = errosLicao;
      celebracaoXP.textContent      = moedasGanhas;
      modalCelebracao.classList.remove('escondido');
      atualizarInterface();
    } else {
      exibirPerguntaAtual();
    }
    return;
  }

  const perg = licao.perguntas[perguntaFaseIndice];
  if (opcaoSelecionadaLocal === perg.correta) {
    acertosLicao++;
    caixaFeedback.textContent = '✅ Correto!';
    caixaFeedback.className = 'caixa-feedback caixa-feedback--correto';
    btnVerificar.textContent = 'CONTINUAR';
  } else {
    errosLicao++;
    caixaFeedback.innerHTML = `❌ Errado! A resposta era: <strong>${perg.opcoes[perg.correta]}</strong>`;
    caixaFeedback.className = 'caixa-feedback caixa-feedback--errado';
    vidasRestantesLicao--;
    txtVidasModal.textContent = vidasRestantesLicao;

    if (vidasRestantesLicao <= 0) {
      // Eliminado
      if (estadoApp.vidasGlobais >= 5) estadoApp.ultimaPerdaVidaHora = Date.now();
      estadoApp.vidasGlobais = Math.max(0, estadoApp.vidasGlobais - 1);
      setTimeout(() => {
        modalFase.classList.add('escondido');
        const textoRestante = estadoApp.vidasGlobais > 0
          ? `Você ainda tem ${estadoApp.vidasGlobais} vida(s) global(is).`
          : 'Nenhuma vida restante. Aguarde a recarga (10 min por vida).';
        modalEliminadoTxt.textContent = textoRestante;
        modalEliminado.classList.remove('escondido');
        atualizarInterface();
      }, 800);
    } else {
      btnVerificar.textContent = 'CONTINUAR';
    }
  }
  caixaFeedback.classList.remove('escondido');
});

// Fechar lição — substitui confirm()
btnFecharFase.addEventListener('click', async () => {
  const ok = await confirmar('Sair da Lição', 'Sair agora consome 1 vida global. Deseja continuar?', '💔');
  if (!ok) return;
  if (estadoApp.vidasGlobais >= 5) estadoApp.ultimaPerdaVidaHora = Date.now();
  estadoApp.vidasGlobais = Math.max(0, estadoApp.vidasGlobais - 1);
  modalFase.classList.add('escondido');
  mostrarToast('Você saiu da lição e perdeu 1 vida. 💔', 'aviso');
  atualizarInterface();
});

btnFecharCelebracao.addEventListener('click', () => modalCelebracao.classList.add('escondido'));
btnFecharEliminado.addEventListener('click',  () => modalEliminado.classList.add('escondido'));

/* =====================================================================
   Configurações — Ações
   ===================================================================== */

// Salvar nome
btnSalvarNome && btnSalvarNome.addEventListener('click', () => {
  const n = inputNomePerfil.value.trim();
  if (!n) { mostrarToast('Digite um nome válido.', 'aviso'); return; }

  // ── [API] ──────────────────────────────────────────────────────────
  // PATCH /api/usuario/nome  { userId, nome: n }
  // ───────────────────────────────────────────────────────────────────

  estadoApp.nomeUsuario = n;
  localStorage.setItem('meitrack_perfil_nome', n);
  inputNomePerfil.value = '';
  mostrarToast(`Nome atualizado para "${n}"! 👤`, 'sucesso');
  atualizarInterface();
});

// Resetar progresso — substitui confirm()
btnResetarProgresso && btnResetarProgresso.addEventListener('click', async () => {
  const ok = await confirmar(
    'Resetar Progresso',
    'Isso apagará todo o seu progresso permanentemente. Essa ação não pode ser desfeita.',
    '⚠️'
  );
  if (!ok) return;
  localStorage.removeItem(KEY_ESTADO);
  mostrarToast('Progresso resetado. A página será recarregada...', 'info', 2000);
  setTimeout(() => location.reload(), 2000);
});

// Assinatura
btnGerenciarAssinatura && btnGerenciarAssinatura.addEventListener('click', () => {
  modalAssinatura.classList.remove('escondido');
});
btnFecharAssinatura && btnFecharAssinatura.addEventListener('click', () => {
  modalAssinatura.classList.add('escondido');
});
btnCancelarAssinatura && btnCancelarAssinatura.addEventListener('click', async () => {
  const ok = await confirmar('Cancelar Assinatura', 'Tem certeza que deseja cancelar a renovação automática?', '👑');
  if (ok) mostrarToast('Cancelamento solicitado. Seu plano continua ativo até o fim do período.', 'info', 5000);
  modalAssinatura.classList.add('escondido');
});

/* =====================================================================
   Dev Cheats
   ===================================================================== */
btnCheatMoedas && btnCheatMoedas.addEventListener('click', () => {
  estadoApp.moedas      += 500;
  estadoApp.progressoM2 += 500;
  mostrarToast('+500 moedas adicionadas! 🪙', 'info');
  atualizarInterface();
});
btnCheatOfensiva && btnCheatOfensiva.addEventListener('click', () => {
  estadoApp.ofensiva++;
  mostrarToast(`Ofensiva simulada: ${estadoApp.ofensiva} dias 🔥`, 'info');
  atualizarInterface();
});
btnCheatM1 && btnCheatM1.addEventListener('click', () => {
  estadoApp.progressoM1 = 3;
  mostrarToast('Missão 1 forçada como concluída! 🎯', 'info');
  atualizarInterface();
});

/* =====================================================================
   Inicialização
   ===================================================================== */
(function init() {
  const salvo = localStorage.getItem(KEY_ESTADO);
  if (salvo) {
    try { estadoApp = { ...estadoApp, ...JSON.parse(salvo) }; }
    catch (e) { localStorage.removeItem(KEY_ESTADO); }
  }

  // ── [API] ──────────────────────────────────────────────────────────
  // GET /api/usuario/estado  { userId }
  // Retorna: { moedas, ofensiva, vidasGlobais, licaoAtual, ... }
  // Mesclar com estadoApp após a chamada.
  // ───────────────────────────────────────────────────────────────────

  const temaEscuro = localStorage.getItem(KEY_DARK_MODE) === '1'
    || localStorage.getItem(LEGACY_DARK) === 'true';
  aplicarModoEscuro(temaEscuro);

  verificarSincroniaOfensiva();
  atualizarInterface();
})();
