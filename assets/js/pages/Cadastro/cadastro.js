// Lógica de Validação de Cadastro

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
}

// Validação de senha

function validarSenha(senha, confirmaSenha, avisoSenha, avisoGeral) {
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

async function fazerCadastro(event) {
    if(event) event.preventDefault(); // Evita recarregar a página

    // Puxando valores
    const nomeInput = document.getElementById("nome").value;
    const emailInput = document.getElementById("email").value;
    const senhaInput = document.getElementById("senha").value;
    const confirmaSenhaInput = document.getElementById("confirma-senha").value;

    // Puxando campo de erros
    const avisoEmail = document.getElementById("aviso");
    const avisoSenha = document.getElementById("avisosenha");
    const avisoGeral = document.getElementById("avisogeral");

    // Valida Campos
    if(!validarCampos(emailInput, senhaInput, confirmaSenhaInput, avisoEmail, avisoSenha, avisoGeral)) {
        return; // Se os campos não forem válidos, não prossegue
    }

    // Json
    const bodyReq = {
        user: nomeInput,
        email: emailInput,
        senha: senhaInput
    };

    try{
        // Botão Carregando
        const btnCadastrar = document.querySelector(".cadastrar-se h2");
        const textoOriginal = btnCadastrar.innerText;
        btnCadastrar.innerText = "Cadastrando..."; // Feedback visual
        
        // API /user
        const resposta = await apiFetch("/user", "POST", bodyReq);

        //Tratar resposta
        if(resposta.ok){ // 200 ou 201
            avisoGeral.style.color = "lightgreen";
            avisoGeral.textContent = "Cadastro realizado com sucesso! Redirecionando...";

            // Esperar 2 segundos e redirecionar
            setTimeout(() => {
                window.location.href = "/Login.html";
            }, 2000);
        } else { // Erro 400 ou Email existente
            avisoGeral.style.color = "yellow";
            avisoGeral.textContent = "Erro ao realizar cadastro. Este email ou usuario já pode existir.";
            btnCadastrar.innerText = textoOriginal; // Voltar texto do botão
        }
    } catch (error) {
        avisoGeral.textContent = "Erro de conexão. Tente novamente mais tarde.";
        console.error("Erro na requisição:", error);
        document.querySelector(".cadastrar-se h2").innerText = "Cadastrar-se"; // Voltar texto do botão       
    }
}