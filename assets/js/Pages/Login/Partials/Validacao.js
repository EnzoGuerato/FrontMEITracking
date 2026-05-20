// Validar (visual)
function validarCampos(emailInput, avisoEmail, senhaInput, avisoSenha) {
  const valor = document.getElementById("email").value; // Sem uso prático aqui
  const aviso = document.getElementById("aviso");       // Sem uso prático aqui

  if (!emailInput.value.includes("@")) {
    avisoEmail.textContent = "Email inválido";
    valido = false;
  } 
  if (senhaInput.value.trim() == "") {
    avisoSenha.textContent = "A senha não pode estar vazia";
    valido = false;  
  }

  return valido;
}