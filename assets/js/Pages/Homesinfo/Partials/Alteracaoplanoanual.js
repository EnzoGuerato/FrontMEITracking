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

    // Mostra todas as etiquetas de desconto anual
    badgesAnuais.forEach(badge => {
        badge.style.display = "inline-block";
    });
});