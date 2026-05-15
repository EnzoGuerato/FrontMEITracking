/* BOTÃO PREMIUM */
const premiumBtn = document.querySelector(".premiumBtn");

if (premiumBtn) {
    premiumBtn.addEventListener("click", () => {
        alert("Bem-vindo ao Premium!");
    });
}

/* BOTÕES PLANOS */
const monthlyBtn = document.getElementById("monthlyBtn");
const yearlyBtn = document.getElementById("yearlyBtn");

/* PREÇOS (O GratisPrice foi removido da lógica de alteração para não mudar) */
const premiumPrice = document.getElementById("premiumPrice");
const premium_IAPrice = document.getElementById("premium_IAPrice");

/* TEXTOS */
const premiumText = document.getElementById("premiumText");
const premium_IAText = document.getElementById("premium_IAText");

/* MENSAL */
monthlyBtn.addEventListener("click", () => {
    // Troca de Classes
    monthlyBtn.classList.add("activePlan");
    yearlyBtn.classList.remove("activePlan");

    // Atualiza Preços
    if (premiumPrice) premiumPrice.innerHTML = "R$14,99";
    if (premium_IAPrice) premium_IAPrice.innerHTML = "R$19,99";

    // Atualiza Textos
    if (premiumText) premiumText.innerHTML = "por mês";
    if (premium_IAText) premium_IAText.innerHTML = "por mês";
});

/* ANUAL */
yearlyBtn.addEventListener("click", () => {
    // Troca de Classes
    yearlyBtn.classList.add("activePlan");
    monthlyBtn.classList.remove("activePlan");

    // Atualiza Preços
    if (premiumPrice) premiumPrice.innerHTML = "R$149,99";
    if (premium_IAPrice) premium_IAPrice.innerHTML = "R$199,99";

    // Atualiza Textos
    if (premiumText) premiumText.innerHTML = "por ano";
    if (premium_IAText) premium_IAText.innerHTML = "por ano";
});

/* Seleciona todas as etiquetas de uma vez */
const badgesAnuais = document.querySelectorAll(".badge-anual");

/* No evento do botão MENSAL */
monthlyBtn.addEventListener("click", () => {
    // ... seu código de preços ...
    
    // Esconde todas as etiquetas
    badgesAnuais.forEach(badge => {
        badge.style.display = "none";
    });
});

/* No evento do botão ANUAL */
yearlyBtn.addEventListener("click", () => {
    // ... seu código de preços ...
    
    // Mostra todas as etiquetas
    badgesAnuais.forEach(badge => {
        badge.style.display = "inline-block";
    });
});