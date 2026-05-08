
// Dark Mode
const trilho = document.getElementById("trilho");
const body = document.querySelector("body");
const imgLua = document.getElementById("img-lua");

const sol = "/Site/img/logo meizinho/trilho/iconsol(preto).png";
const lua = "/Site/img/logo meizinho/trilho/iconlua(branca).png";


trilho.addEventListener("click", () => {
  trilho.classList.toggle("dark");
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    imgLua.src = sol;
  } else {
    imgLua.src = lua;
  }
});


// Validar (visual)
function validarCampos(emailInput, avisoEmail, senhaInput, avisoSenha) {
  const valor = document.getElementById("email").value;
  const aviso = document.getElementById("aviso");

  if (!emailInput.value.includes("@")) {
    avisoEmail.textContent = "Email inválido";
    valido = false;
  } 
  if (senhaInput.value.trim() == "") {
    avisoSenha.textContent = "A senha não pode estar vazia";
    valido = false  
  }

  return valido;
}

// Integração API

async function fazerLogin(event) {
  if(event) event.preventDefault(); // Impedir pagina recarregar sozinha

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const avisoGeral = document.getElementById("avisosenha"); // mostrar erro API
  const avisoEmail = document.getElementById("aviso");

  // validação (pra n chamar API à toa)
  if (!validarCampos(emailInput, avisoEmail, senhaInput, avisoGeral)) {
    return;
  }

  const bodyReq = {
    email: emailInput.value,
    senha: senhaInput.value
  };

  try{ 
    // Muda botão entrar para carregando:
    const btnEntrar = document.querySelector(".entrar h2");
    const textoOriginal = btnEntrar.innerText;
    btnEntrar.innerText = "Carregando..."
    
    // Chama API:
    const resp = await apiFetch('/auth/login', 'POST', bodyReq);
    
    // tratamento resposta
    if(resp.ok) { // 200 ok

      const token = await resp.text(); // pega token

      // guarda Token no navegador
      localStorage.setItem('jwt_token', token);

      // manda pra Home (ALTERAR NO FUTURO)
      window.location.href = '../home/Home.html';

    } else if (resp.status === 400 || resp.status === 403) { // 400 ou 403 erro
      avisoGeral.textContent = "Email ou senha inválidos!";
      btnEntrar.innerText = textoOriginal;
    } else { // erro servidor
      avisoGeral.textContent = "Erro no servidor. Tente mais tarde.";
      btnEntrar.innerText = textoOriginal;
    }
  
  } catch (erro) { // falha ao conectar
    avisoGeral.textContent = "Não foi possivel conectar ao servidor.";
    console.error("Erro no login:", erro);
    document.querySelector(".entrar h2").innerText = "Entrar";
  } 
}
