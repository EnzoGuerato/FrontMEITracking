// DARK MODE

const trilho = document.getElementById("trilho");
const body = document.querySelector("body");
const imgLua = document.getElementById("img-lua");

const sol = "/Site/img/logo meizinho/trilho/iconsol(preto).png";
const lua = "/Site/img/logo meizinho/trilho/iconlua(branca).png";


// VERIFICA SE DARK MODE ESTÁ SALVO
if(localStorage.getItem("dark-mode") === "true"){

    body.classList.add("dark");
    trilho.classList.add("dark");

    if(imgLua){
        imgLua.src = sol;
    }
}


// EVENTO DO BOTÃO
trilho.addEventListener("click", () => {

    trilho.classList.toggle("dark");
    body.classList.toggle("dark");

    const darkAtivo = body.classList.contains("dark");

    // SALVA NO NAVEGADOR
    localStorage.setItem("dark-mode", darkAtivo);

    // TROCA ÍCONE
    if(darkAtivo){
        imgLua.src = sol;
    }else{
        imgLua.src = lua;
    }

});