const trilho = document.getElementById("trilho");
const body = document.querySelector("body");
const imgLua = document.getElementById("img-lua");

const sol = "/Site/Login/logo meizinho/trilho/iconsol(preto).png";
const lua = "/Site/Login/logo meizinho/trilho/iconlua(branca).png";

trilho.addEventListener("click", () => {
  trilho.classList.toggle("dark");
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    imgLua.src = sol;
  } else {
    imgLua.src = lua;
  }
});

function validaremail() {
    const valor = document.getElementById("email").value;
    const aviso = document.getElementById("aviso");
  
    if (!valor.includes("@")) {
      aviso.textContent = "e-mail não valido";
    } else {
      aviso.textContent = "";
      console.log("Valor válido:", valor);
    }
  }

function validarsenha() {
    const valorsenha = document.getElementById("senha").value;
    const avisosenha = document.getElementById("avisosenha");
  
    const testeMaius = /[A-Z]/.test(valorsenha);
    const testEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(valorsenha);
  
    if (!testeMaius) {
      avisosenha.textContent = "A senha deve conter uma letra maiúscula.";
      return false;
    }
  
    if (!testEspecial) {
      avisosenha.textContent = "A senha deve ter caracteres especiais.";
      return false;
    }
  
    avisosenha.textContent = "";
    return true;
  }