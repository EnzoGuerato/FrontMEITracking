// =====================================================================
// cadastro.js · MEI Track
// Validação completa de cadastro + filtro de nomes ofensivos
// =====================================================================

/* Lista de termos proibidos — normalização aplicada antes da comparação */
const TERMOS_PROIBIDOS = [
  'puta','merda','caralho','porra','viado','fdp','fudeu','buceta',
  'cu','arrombado','babaca','idiota','imbecil','cuzao','vagabunda',
  'pinto','piroca','rola','xereca','boiola','viadinho','otario',
  'corno','nojento','safado'
];

/**
 * Normaliza texto para comparação: minúsculas, sem acentos,
 * substitui leetspeak comum e remove caracteres não-alfanuméricos.
 */
function normalizarTexto(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // remove acentos
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g,  'e')
    .replace(/[1!|]/g,'i')
    .replace(/[0]/g,  'o')
    .replace(/[5\$]/g,'s')
    .replace(/[^a-z0-9\s]/g, ''); // remove especiais restantes
}

/**
 * Retorna true se o nome contiver algum termo proibido.
 */
function contemTermoProibido(nome) {
  const norm = normalizarTexto(nome);
  return TERMOS_PROIBIDOS.some(t => norm.includes(t));
}

// ── Validação de campos ──────────────────────────────────────────────

function validarCampos(nome, email, senha, confirmaSenha, avisoNome, avisoEmail, avisoSenha, avisoGeral) {
  let valido = true;
  avisoNome.textContent  = '';
  avisoEmail.textContent = '';
  avisoSenha.textContent = '';
  avisoGeral.textContent = '';

  // Nome obrigatório
  if (!nome || nome.trim().length < 3) {
    avisoNome.textContent = 'O nome deve ter pelo menos 3 caracteres.';
    valido = false;
  } else if (contemTermoProibido(nome)) {
    avisoNome.textContent = '⚠️ Nome não permitido: contém termos inadequados.';
    valido = false;
  }

  // E-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    avisoEmail.textContent = 'Digite um e-mail válido (ex.: usuario@dominio.com).';
    valido = false;
  }

  // Senha mínimo 8 chars, 1 maiúscula, 1 caractere especial
  const testeMaius    = /[A-Z]/.test(senha);
  const testeEspecial = /[!@#$%^&*(),.?:{}|<>]/.test(senha);
  const testeLen      = senha.length >= 8;

  if (!testeLen) {
    avisoSenha.textContent = 'A senha deve ter no mínimo 8 caracteres.';
    valido = false;
  } else if (!testeMaius || !testeEspecial) {
    avisoSenha.textContent = 'A senha deve conter pelo menos uma letra maiúscula e um caractere especial.';
    valido = false;
  }

  // Confirmação de senha
  if (senha !== confirmaSenha) {
    avisoGeral.textContent = 'As senhas não coincidem!';
    valido = false;
  }

  return valido;
}

// ── Integração API ────────────────────────────────────────────────────

async function fazerCadastro(event) {
  if (event) event.preventDefault();

  const nomeInput          = document.getElementById('nome').value.trim();
  const emailInput         = document.getElementById('email').value.trim();
  const senhaInput         = document.getElementById('senha').value;
  const confirmaSenhaInput = document.getElementById('confirma-senha').value;

  const avisoNome  = document.getElementById('avisonome');
  const avisoEmail = document.getElementById('aviso');
  const avisoSenha = document.getElementById('avisosenha');
  const avisoGeral = document.getElementById('avisogeral');

  if (!validarCampos(nomeInput, emailInput, senhaInput, confirmaSenhaInput,
                     avisoNome, avisoEmail, avisoSenha, avisoGeral)) {
    return;
  }

  const bodyReq = { user: nomeInput, email: emailInput, senha: senhaInput };

  try {
    const btnCadastrar  = document.querySelector('.cadastrar-se h2');
    const textoOriginal = btnCadastrar.innerText;
    btnCadastrar.innerText = 'Cadastrando...';

    const resposta = await apiFetch('/user', 'POST', bodyReq);

    if (resposta.ok) {
      avisoGeral.style.color   = 'lightgreen';
      avisoGeral.textContent   = 'Cadastro realizado com sucesso! Redirecionando...';
      setTimeout(() => { window.location.href = '/Login.html'; }, 2000);
    } else {
      avisoGeral.style.color  = 'yellow';
      avisoGeral.textContent  = 'Erro ao realizar cadastro. Este e-mail ou usuário já pode existir.';
      btnCadastrar.innerText  = textoOriginal;
    }
  } catch (error) {
    avisoGeral.textContent = 'Erro de conexão. Tente novamente mais tarde.';
    console.error('Erro na requisição:', error);
    document.querySelector('.cadastrar-se h2').innerText = 'Cadastrar-se';
  }
}
