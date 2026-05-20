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