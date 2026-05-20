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