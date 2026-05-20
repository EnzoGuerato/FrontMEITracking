// DARK MODE - CAPTURA DE ELEMENTOS E CAMINHOS
const trilho = document.getElementById("trilho");
const body = document.querySelector("body");
const imgLua = document.getElementById("img-lua");

const sol = "/Site/img/logo meizinho/trilho/iconsol(preto).png";
const lua = "/Site/img/logo meizinho/trilho/iconlua(branca).png";


// APLICA DARK MODE SALVO ANTERIORMENTE
if(localStorage.getItem("dark-mode") === "true"){
    body.classList.add("dark");

    if(trilho){
        trilho.classList.add("dark");
    }

    if(imgLua){
        imgLua.src = sol;
    }
}