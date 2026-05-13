// Mudar a cor de fundo
const trilho = document.getElementById("trilho");
const body = document.querySelector("body");
const imgLua = document.getElementById("img-lua");

const sol = "/Site/Login/logo meizinho/trilho/iconsol(preto).png";
const lua = "/Site/Login/logo meizinho/trilho/iconlua(branca).png";

trilho.addEventListener("click", () => {
  trilho.classList.toggle("dark");
  body.classList.toggle("dark");

  imgLua.src = body.classList.contains("dark") ? sol : lua;
});

// Lógica de Validação

function validarCampos(email, senha, confirmaSenha, avisoEmail, avisoSenha, avisoGeral) {
  let valido = true;
  avisoEmail.textContent = "";
  avisoSenha.textContent = "";
  avisoGeral.textContent = "";

  // Validação Email
  if(!email.includes("@")) {
    avisoEmail.textContent = "Email inválido";
    valido = false;
  }

  // Valida se a senha é forte
  const testeMaius = /[A-Z]/.test(senha);
  const testeEspecial = /[!@#$%^&*(),.?:{}|<>]/.test(senha)

  if(!testeMaius || !testeEspecial) {
    avisoSenha.textContent = "A senha deve conter uma lera maiúscula e um caractere especial.";
    valido = false;
  }

  // Valida senha igual
  if (senha !== confirmaSenha) {
    avisoGeral.textContent = "As senhas não conhecidem!";
    valido = false;
  }

  return valido;
}

// Integração API (cadastro)

async function fazerCadastro(event){
  if(event) event.preventDefault(); //Impede que a pag recarregue

  // Puxando valores
  const nomeInput = document.getElementById("nome").value;
  const emailInput = document.getElementById("email").value;
  const senhaInput = document.getElementById("senha").value;
  const confirmaSenhaInput = document.getElementById("confirma-senha").value;

  // Puxando campo de erros
  const avisoEmail = document.getElementById("aviso");
  const avisoSenha = document.getElementById("avisosenha");
  const avisoGeral = document.getElementById("avisoGeral")

  // Valida campos
  if (!validarCampos(emailInput, senhaInput, confirmaSenhaInput, avisoEmail, avisoSenha, avisoGeral)){
    return;
  }

  // JSON
  const bodyReq = {
    user: nomeInput,
    email: emailInput,
    senha: senhaInput,
    xpTotal: 0,
    nivel: 1
  };

  try{
    // botão carregando
    const btnCadastrar = document.querySelector(".cadastrar-se h2");
    const textoOriginal = btnCadastrar.innerText;
    btnCadastrar.innerText = "Carregando...";

    // API /user
    const resposta = await apiFetch('/user', 'POST', bodyReq);

    // Tratamento resposta
    if (resposta.ok) { // 200 ou 201
      avisoGeral.style.color = "lightgreen";
      avisoGeral.textContent = "Cadastro realizado com sucesso! Redirecionando...";

      // espera 2 seg
      setTimeout(() => {
        window.location.href = '../Login/Login.html';
      }, 2000);
    } else {
      // Erro 400 ou Email existe

      avisoGeral.style.color = "yellow";
      avisoGeral.textContent = "Erro ao cadastrar. Este email ou usuário pode já existir.";
      btnCadastrar.innerText = textoOriginal;
    }
  } catch (erro) {
    avisoGeral.textContent = "Não foi possível conectar ao servidor.";
    console.error("Erro no cadastro:", erro);
    document.querySelector(".cadastrar-se h2").innerText = "Cadastrar-se";
  }
}