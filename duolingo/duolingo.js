let estadoApp = {
  moedas: 100,
  ofensiva: 0,
  vidasGlobais: 5,
  ultimoAcessoDia: "", 
  ultimaPerdaVidaHora: null, 
  licaoAtual: 1,
  totalLicoes: 20,
  nomeUsuario: "Jogador_01",
  progressoM1: 0,
  progressoM2: 0,
  rankingInvertido: false,
  tamanhoFonte: "normal" // Opções: normal, grande, gigante
};

const bancoLicoesExpandido = {
  1: { 
    tipo: "verde", 
    perguntas: [ 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "errada 2", "correta 3"], correta: 3 } 
    ] 
  },
  2: { 
    tipo: "azul", 
    perguntas: [ 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 } 
    ] 
  },
  3: { 
    tipo: "laranja", 
    perguntas: [ 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 } 
    ] 
  },
  4: { 
    tipo: "roxo", 
    perguntas: [ 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 } 
    ] 
  },
  5: { 
    tipo: "ouro", 
    perguntas: [ 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 }, 
      { titulo: "sua pergunta aqui", opcoes: ["correta 0", "errada 1", "errada 2", "errada 3"], correta: 0 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "errada 1", "correta 2", "errada 3"], correta: 2 }, 
      { titulo: "sua pergunta aqui", opcoes: ["errada 0", "correta 1", "errada 2", "errada 3"], correta: 1 } 
    ] 
  }
};

// Estruturação em loop das 20 fases restantes
for(let k=6; k<=20; k++){ 
  bancoLicoesExpandido[k] = { 
    tipo: k%5===0?"ouro":k%4===0?"roxo":k%3===0?"laranja":k%2===0?"azul":"verde", 
    perguntas: bancoLicoesExpandido[1].perguntas 
  }; 
}

let listaCompetidores = [
  { nome: "Luis_Nativo", moedas: 1250, ofensiva: 45 },
  { nome: "Fernanda_Eng", moedas: 980, ofensiva: 12 },
  { nome: "Carlos_BR", moedas: 720, ofensiva: 8 },
  { nome: "Jogador_01", moedas: 100, ofensiva: 0, isPlayer: true },
  { nome: "Amanda_Silv", moedas: 410, offensive: 3 }
];

// Instanciamento DOM
const elOfensiva = document.getElementById("contador-ofensiva");
const elMoedas = document.getElementById("contador-moedas");
const elVidas = document.getElementById("contador-vidas");
const elTempoRecarga = document.getElementById("tempo-recarga");
const containerTrilha = document.getElementById("container-trilha-licoes");
const nomeExibicao = document.getElementById("nome-exibicao-perfil");
const ulRanking = document.getElementById("lista-ranking");
const conteudoPrincipal = document.getElementById("conteudo-principal");

const btnNavAprender = document.getElementById("nav-aprender");
const btnNavMissoes = document.getElementById("nav-missoes");
const btnNavConfig = document.getElementById("nav-config");
const telaAprender = document.getElementById("tela-aprender-central");
const telaMissoes = document.getElementById("tela-missoes-central");
const telaConfig = document.getElementById("tela-config-central");

const modalFase = document.getElementById("modal-fase");
const btnFecharFase = document.getElementById("fechar-fase");
const txtTituloPergunta = document.getElementById("titulo-pergunta");
const containerOpcoes = document.getElementById("container-opcoes");
const btnVerificar = document.getElementById("btn-verificar-opcao");
const caixaFeedback = document.getElementById("caixa-feedback");
const preenchimentoProgresso = document.getElementById("progresso-fase");
const txtVidasModal = document.getElementById("vidas-modal");
const txtContadorPerguntas = document.getElementById("contador-perguntas-fase");

// Botões das Missões (Central e Lateral)
const btnRecolherM1 = document.getElementById("btn-recolher-m1");
const btnRecolherM2 = document.getElementById("btn-recolher-m2");
const btnRecolherLatM1 = document.getElementById("btn-recolher-lat-m1");
const btnRecolherLatM2 = document.getElementById("btn-recolher-lat-m2");

const m1Exp = document.getElementById("barra-expandida-m1");
const m1TxtExp = document.getElementById("texto-progresso-m1");
const m1Lat = document.getElementById("barra-lateral-m1");
const m1TxtLat = document.getElementById("txt-lat-m1");
const m2Exp = document.getElementById("barra-expandida-m2");
const m2TxtExp = document.getElementById("texto-progresso-m2");
const m2Lat = document.getElementById("barra-lateral-m2");
const m2TxtLat = document.getElementById("txt-lat-m2");

const inputNomePerfil = document.getElementById("input-nome-perfil");
const btnSalvarNome = document.getElementById("btn-salvar-nome");
const btnResetarProgresso = document.getElementById("btn-resetar-progresso");
const btnCheatMoedas = document.getElementById("btn-cheat-moedas");
const btnCheatOfensiva = document.getElementById("btn-cheat-ofensiva");
const btnCheatM1 = document.getElementById("btn-cheat-m1");
const btnOrdenarRanking = document.getElementById("btn-ordenar-ranking");
const btnTamanhoFonte = document.getElementById("btn-tamanho-fonte");

let licaoFaseIndice = 0;
let perguntaFaseIndice = 0;
let vidasRestantesLicao = 3;
let opcaoSelecionadaLocal = null;

function verificarSincroniaOfensiva() {
  const hojeStr = new Date().toISOString().split('T')[0];
  if (!estadoApp.ultimoAcessoDia) {
    estadoApp.ultimoAcessoDia = hojeStr;
    estadoApp.ofensiva = 1;
  } else if (estadoApp.ultimoAcessoDia !== hojeStr) {
    const dataAnterior = new Date(estadoApp.ultimoAcessoDia + "T00:00:00");
    const dataAtual = new Date(hojeStr + "T00:00:00");
    const dif = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
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
  if (estadoApp.vidasGlobais >= 5) { elTempoRecarga.innerText = ""; return; }
  const agora = Date.now();
  if (!estadoApp.ultimaPerdaVidaHora) estadoApp.ultimaPerdaVidaHora = agora;
  const dezMinutos = 10 * 60 * 1000;
  const tempoDecorrido = agora - estadoApp.ultimaPerdaVidaHora;
  const vidasGanhas = Math.floor(tempoDecorrido / dezMinutos);

  if (vidasGanhas > 0) {
    estadoApp.vidasGlobais = Math.min(5, estadoApp.vidasGlobais + vidasGanhas);
    estadoApp.ultimaPerdaVidaHora = estadoApp.vidasGlobais >= 5 ? null : agora - (tempoDecorrido % dezMinutos);
    atualizarInterface();
  }
  if (estadoApp.vidasGlobais < 5 && estadoApp.ultimaPerdaVidaHora) {
    const resto = dezMinutos - ((agora - estadoApp.ultimaPerdaVidaHora) % dezMinutos);
    elTempoRecarga.innerText = `(+1 em ${Math.floor(resto/60000)}:${String(Math.floor((resto%60000)/1000)).padStart(2,'0')})`;
  }
}
setInterval(processarRegeneracaoVidas, 1000);

function aplicarTamanhoFonte() {
  conteudoPrincipal.classList.remove("fonte-grande", "fonte-gigante");
  
  if (estadoApp.tamanhoFonte === "grande") {
    conteudoPrincipal.classList.add("fonte-grande");
    btnTamanhoFonte.innerText = "🔍 Fonte: Grande";
  } else if (estadoApp.tamanhoFonte === "gigante") {
    conteudoPrincipal.classList.add("fonte-gigante");
    btnTamanhoFonte.innerText = "🔍 Fonte: Gigante";
  } else {
    btnTamanhoFonte.innerText = "🔍 Fonte: Normal";
  }
}

function atualizarInterface() {
  localStorage.setItem("estado_meizinho_v3", JSON.stringify(estadoApp));
  elMoedas.innerText = estadoApp.moedas;
  elOfensiva.innerText = estadoApp.ofensiva;
  elVidas.innerText = estadoApp.vidasGlobais;
  nomeExibicao.innerText = estadoApp.nomeUsuario;
  
  aplicarTamanhoFonte();
  renderizarTrilha();
  renderizarRanking();
  renderizarMissoes();
}

function alternarTela(abaAtiva, telaAtiva) {
  [btnNavAprender, btnNavMissoes, btnNavConfig].forEach(b => b.classList.remove("ativo"));
  [telaAprender, telaMissoes, telaConfig].forEach(t => t.classList.add("escondido"));
  abaAtiva.classList.add("ativo");
  telaAtiva.classList.remove("escondido");
}
btnNavAprender.addEventListener("click", () => alternarTela(btnNavAprender, telaAprender));
btnNavMissoes.addEventListener("click", () => alternarTela(btnNavMissoes, telaMissoes));
btnNavConfig.addEventListener("click", () => alternarTela(btnNavConfig, telaConfig));

function renderizarTrilha() {
  containerTrilha.innerHTML = "";
  for (let i = 1; i <= estadoApp.totalLicoes; i++) {
    const node = document.createElement("div");
    node.classList.add("licao");
    if (i < estadoApp.licaoAtual) { node.classList.add("concluida-100"); node.innerHTML = "✓"; }
    else if (i === estadoApp.licaoAtual) { node.classList.add(bancoLicoesExpandido[i].tipo); node.innerHTML = `<span>${i}</span>`; }
    else { node.classList.add("bloqueada"); node.innerHTML = "🔒"; }
    node.addEventListener("click", () => { if (i === estadoApp.licaoAtual) abrirFase(i); });
    containerTrilha.appendChild(node);
  }
}

function renderizarMissoes() {
  // Missão 1: 3 Lições
  const pctM1 = Math.min((estadoApp.progressoM1 / 3) * 100, 100);
  m1Exp.style.width = `${pctM1}%`; m1Lat.style.width = `${pctM1}%`;
  m1TxtExp.innerText = `Progresso: ${estadoApp.progressoM1} / 3`; m1TxtLat.innerText = estadoApp.progressoM1;
  
  const m1Pronta = estadoApp.progressoM1 >= 3;
  btnRecolherM1.disabled = !m1Pronta;
  btnRecolherLatM1.disabled = !m1Pronta;
  if(m1Pronta) {
    btnRecolherM1.innerText = "Recolher Recompensa (+50 🪙)";
    btnRecolherLatM1.innerText = "Recolher +50 🪙";
  } else {
    btnRecolherM1.innerText = "Bloqueado";
    btnRecolherLatM1.innerText = "Recolher";
  }

  // Missão 2: 300 Moedas
  const pctM2 = Math.min((estadoApp.progressoM2 / 300) * 100, 100);
  m2Exp.style.width = `${pctM2}%`; m2Lat.style.width = `${pctM2}%`;
  m2TxtExp.innerText = `Progresso: ${estadoApp.progressoM2} / 300`; m2TxtLat.innerText = estadoApp.progressoM2;
  
  const m2Pronta = estadoApp.progressoM2 >= 300;
  btnRecolherM2.disabled = !m2Pronta;
  btnRecolherLatM2.disabled = !m2Pronta;
  if(m2Pronta) {
    btnRecolherM2.innerText = "Recolher Recompensa (+100 🪙)";
    btnRecolherLatM2.innerText = "Recolher +100 🪙";
  } else {
    btnRecolherM2.innerText = "Bloqueado";
    btnRecolherLatM2.innerText = "Recolher";
  }
}

function recolherPremioM1() {
  estadoApp.moedas += 50;
  estadoApp.progressoM1 = 0; 
  alert("Você recolheu 50 moedas da Missão Diária! 🎉");
  atualizarInterface();
}
function recolherPremioM2() {
  estadoApp.moedas += 100;
  estadoApp.progressoM2 = 0; 
  alert("Você recolheu 100 moedas da Missão Caçador de Ouro! 🎉");
  atualizarInterface();
}

btnRecolherM1.addEventListener("click", recolherPremioM1);
btnRecolherLatM1.addEventListener("click", recolherPremioM1);
btnRecolherM2.addEventListener("click", recolherPremioM2);
btnRecolherLatM2.addEventListener("click", recolherPremioM2);

function renderizarRanking() {
  ulRanking.innerHTML = "";
  let pInRank = listaCompetidores.find(c => c.isPlayer);
  if(pInRank) { pInRank.moedas = estadoApp.moedas; pInRank.ofensiva = estadoApp.ofensiva; }
  let ordenado = [...listaCompetidores].sort((a, b) => b.moedas - a.moedas);
  if(estadoApp.rankingInvertido) ordenado.reverse();

  ordenado.forEach((c, idx) => {
    const li = document.createElement("li");
    let pos = estadoApp.rankingInvertido ? listaCompetidores.length - idx : idx + 1;
    let med = `<span class="posicao">${pos}</span>`;
    if (pos === 1) med = '🥇'; else if (pos === 2) med = '🥈'; else if (pos === 3) med = '🥉';
    li.innerHTML = `
      <div class="usuario-info">${med} <span class="nome-user" style="${c.isPlayer?'font-weight:900;color:#1cb0f6;':''}">${c.isPlayer?estadoApp.nomeUsuario:c.nome}</span></div>
      <div class="pontos-container"><span class="pontos-moedas">🪙 ${c.moedas}</span><span class="pontos-ofensiva">🔥 ${c.ofensiva}d</span></div>
    `;
    ulRanking.appendChild(li);
  });
}
btnOrdenarRanking.addEventListener("click", () => { estadoApp.rankingInvertido = !estadoApp.rankingInvertido; atualizarInterface(); });

function abrirFase(num) {
  if (estadoApp.vidasGlobais <= 0) { alert("Sem vidas globais! Espere a recarga."); return; }
  licaoFaseIndice = num; perguntaFaseIndice = 0; vidasRestantesLicao = 3;
  modalFase.classList.remove("escondido");
  exibirPerguntaAtual();
}

function exibirPerguntaAtual() {
  opcaoSelecionadaLocal = null; caixaFeedback.classList.add("escondido"); btnVerificar.disabled = true; btnVerificar.innerText = "VERIFICAR";
  txtVidasModal.innerText = `❤️ ${vidasRestantesLicao}`;
  const licao = bancoLicoesExpandido[licaoFaseIndice];
  preenchimentoProgresso.style.width = `${(perguntaFaseIndice / licao.perguntas.length) * 100}%`;
  txtContadorPerguntas.innerText = `PERGUNTA ${perguntaFaseIndice + 1} DE ${licao.perguntas.length}`;
  const perg = licao.perguntas[perguntaFaseIndice];
  txtTituloPergunta.innerText = perg.titulo;
  containerOpcoes.innerHTML = "";
  perg.opcoes.forEach((op, idx) => {
    const b = document.createElement("button"); b.classList.add("botao-opcao"); b.innerText = op;
    b.addEventListener("click", () => { document.querySelectorAll(".botao-opcao").forEach(x=>x.classList.remove("selecionado")); b.classList.add("selecionado"); opcaoSelecionadaLocal = idx; btnVerificar.disabled = false; });
    containerOpcoes.appendChild(b);
  });
}

btnVerificar.addEventListener("click", () => {
  const licao = bancoLicoesExpandido[licaoFaseIndice];
  if (btnVerificar.innerText === "CONTINUAR") {
    perguntaFaseIndice++;
    if (perguntaFaseIndice >= licao.perguntas.length) {
      modalFase.classList.add("escondido");
      estadoApp.moedas += 25;
      estadoApp.progressoM2 += 25; 
      if (estadoApp.licaoAtual === licaoFaseIndice) { estadoApp.licaoAtual++; estadoApp.progressoM1++; } 
      alert("Lição concluída! +25 moedas adicionadas.");
      atualizarInterface();
    } else { exibirPerguntaAtual(); }
    return;
  }
  const perg = licao.perguntas[perguntaFaseIndice];
  if (opcaoSelecionadaLocal === perg.correta) {
    caixaFeedback.innerText = "Correto!"; caixaFeedback.className = "mensagem-feedback correto"; btnVerificar.innerText = "CONTINUAR";
  } else {
    caixaFeedback.innerText = `Errado! Certo era: ${perg.opcoes[perg.correta]}`; caixaFeedback.className = "mensagem-feedback errado";
    vidasRestantesLicao--; txtVidasModal.innerText = `❤️ ${vidasRestantesLicao}`;
    if (vidasRestantesLicao <= 0) {
      alert("Eliminado! Você perdeu 1 Vida Global.");
      if (estadoApp.vidasGlobais >= 5) estadoApp.ultimaPerdaVidaHora = Date.now();
      estadoApp.vidasGlobais = Math.max(0, estadoApp.vidasGlobais - 1);
      modalFase.classList.add("escondido");
      atualizarInterface();
    } else { btnVerificar.innerText = "CONTINUAR"; }
  }
  caixaFeedback.classList.remove("escondido");
});

btnFecharFase.addEventListener("click", () => {
  if(confirm("Sair removerá 1 Vida Global. Confirmar?")) {
    modalFase.classList.add("escondido");
    if (estadoApp.vidasGlobais >= 5) estadoApp.ultimaPerdaVidaHora = Date.now();
    estadoApp.vidasGlobais = Math.max(0, estadoApp.vidasGlobais - 1);
    atualizarInterface();
  }
});

btnSalvarNome.addEventListener("click", () => { const n = inputNomePerfil.value.trim(); if(n){ estadoApp.nomeUsuario = n; inputNomePerfil.value=""; atualizarInterface(); } });
btnResetarProgresso.addEventListener("click", () => { if(confirm("Resetar tudo?")){ localStorage.removeItem("estado_meizinho_v3"); location.reload(); } });

// Painel de Testes
btnCheatMoedas.addEventListener("click", () => { estadoApp.moedas += 500; estadoApp.progressoM2 += 500; atualizarInterface(); });
btnCheatOfensiva.addEventListener("click", () => { estadoApp.ofensiva++; atualizarInterface(); });
btnCheatM1.addEventListener("click", () => { estadoApp.progressoM1 = 3; atualizarInterface(); });

const btnAlternarTema = document.getElementById("btn-alternar-tema");
btnAlternarTema.addEventListener("click", () => { document.body.classList.toggle("modo-escuro"); localStorage.setItem("modo_escuro", document.body.classList.contains("modo-escuro")); });

// Lógica para alternar o tamanho da fonte (Normal -> Grande -> Gigante -> Normal)
btnTamanhoFonte.addEventListener("click", () => {
  if (estadoApp.tamanhoFonte === "normal") {
    estadoApp.tamanhoFonte = "grande";
  } else if (estadoApp.tamanhoFonte === "grande") {
    estadoApp.tamanhoFonte = "gigante";
  } else {
    estadoApp.tamanhoFonte = "normal";
  }
  atualizarInterface();
});

(function() {
  const salvos = localStorage.getItem("estado_meizinho_v3");
  if (salvos) estadoApp = JSON.parse(salvos);
  if(localStorage.getItem("modo_escuro") === "true") document.body.classList.add("modo-escuro");
  verificarSincroniaOfensiva();
  atualizarInterface();
})();