// banner mobile
function trocarBanners() {
  const banners = document.querySelectorAll(".banner-img");

  banners.forEach((banner) => {
    const isMobile = window.innerWidth <= 999;

    const mobile = banner.getAttribute("data-mobile");
    const desktop = banner.getAttribute("data-desktop");

    banner.src = isMobile ? mobile : desktop;
  });
}

/* roda só quando a estrutura do HTML estiver carregada */
window.addEventListener("DOMContentLoaded", trocarBanners);

/* roda novamente caso o usuário mude o tamanho da tela (ex: girar o celular) */
window.addEventListener("resize", trocarBanners);