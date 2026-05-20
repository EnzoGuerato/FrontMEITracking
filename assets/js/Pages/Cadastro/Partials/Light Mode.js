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