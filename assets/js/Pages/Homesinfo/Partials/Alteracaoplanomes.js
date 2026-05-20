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

    // Esconde todas as etiquetas de desconto anual
    badgesAnuais.forEach(badge => {
        badge.style.display = "none";
    });
});