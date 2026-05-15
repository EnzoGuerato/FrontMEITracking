// =========================
// TAMANHO DA FONTE
// =========================

const fontSelect = document.getElementById("font-size-select");

// APLICA AO CARREGAR
const fonteSalva = localStorage.getItem("font-size");

if(fonteSalva){

    body.classList.remove(
        "font-grande",
        "font-x-grande"
    );

    if(fonteSalva !== "normal"){
        body.classList.add(`font-${fonteSalva}`);
    }

    if(fontSelect){
        fontSelect.value = fonteSalva;
    }
}


// EVENTO SELECT
if(fontSelect){

    fontSelect.addEventListener("change", () => {

        body.classList.remove(
            "font-grande",
            "font-x-grande"
        );

        const valor = fontSelect.value;

        if(valor !== "normal"){
            body.classList.add(`font-${valor}`);
        }

        localStorage.setItem("font-size", valor);

    });

}

//vip//
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTOS DOS BOTÕES
    ========================= */
    const monthlyBtn = document.getElementById("monthlyBtn");
    const yearlyBtn = document.getElementById("yearlyBtn");
  
    /* =========================
       ELEMENTOS DOS PLANOS
    ========================= */
    const premiumPrice = document.getElementById("premiumPrice");
    const premiumText = document.getElementById("premiumText");
  
    const premiumIAPrice = document.getElementById("premium_IAPrice");
    const premiumIAText = document.getElementById("premium_IAText");
  
    /* =========================
       VALORES (AJUSTE AQUI)
    ========================= */
    const plans = {
      monthly: {
        premium: 14.99,
        premiumIA: 19.99,
        label: "por mês"
      },
  
      yearly: {
        // exemplo: 2 meses grátis (10x o valor mensal)
        premium: (14.99 * 10).toFixed(2),
        premiumIA: (19.99 * 10).toFixed(2),
        label: "por ano"
      }
    };
  
    /* =========================
       FUNÇÃO: MENSAL
    ========================= */
    function setMonthly() {
      premiumPrice.textContent = `R$${plans.monthly.premium}`;
      premiumText.textContent = plans.monthly.label;
  
      premiumIAPrice.textContent = `R$${plans.monthly.premiumIA}`;
      premiumIAText.textContent = plans.monthly.label;
  
      monthlyBtn.classList.add("activePlan");
      yearlyBtn.classList.remove("activePlan");
    }
  
    /* =========================
       FUNÇÃO: ANUAL
    ========================= */
    function setYearly() {
      premiumPrice.textContent = `R$${plans.yearly.premium}`;
      premiumText.textContent = plans.yearly.label;
  
      premiumIAPrice.textContent = `R$${plans.yearly.premiumIA}`;
      premiumIAText.textContent = plans.yearly.label;
  
      yearlyBtn.classList.add("activePlan");
      monthlyBtn.classList.remove("activePlan");
    }
  
    /* =========================
       EVENTOS
    ========================= */
    monthlyBtn.addEventListener("click", setMonthly);
    yearlyBtn.addEventListener("click", setYearly);
  
    /* =========================
       INICIAL
    ========================= */
    setMonthly();
  
  
    /* =========================
       BANNER RESPONSIVO (OPCIONAL)
    ========================= */
    function updateBanner() {
      const banner = document.querySelector(".banner-img");
      if (!banner) return;
  
      const isMobile = window.innerWidth <= 768;
  
      const mobileSrc = banner.getAttribute("data-mobile");
      const desktopSrc = banner.getAttribute("data-desktop");
  
      banner.src = isMobile ? mobileSrc : desktopSrc;
    }
  
    window.addEventListener("resize", updateBanner);
    updateBanner();
  
  });