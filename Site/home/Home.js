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

//banner mobile//

function trocarBanners() {

  const banners = document.querySelectorAll(".banner-img");

  banners.forEach((banner) => {

    const isMobile = window.innerWidth <= 999;

    const mobile = banner.getAttribute("data-mobile");
    const desktop = banner.getAttribute("data-desktop");

    banner.src = isMobile ? mobile : desktop;

  });

}

/* roda só quando tudo estiver carregado */
window.addEventListener("DOMContentLoaded", trocarBanners);

/* troca ao redimensionar */
window.addEventListener("resize", trocarBanners);