/* ANUAL  */
yearlyBtn.addEventListener("click", () => {

    /* CLASSE (Aplica o visual ativo no botão Anual) */
    yearlyBtn.classList.add("activePlan");
    monthlyBtn.classList.remove("activePlan");

    /* PREÇOS (Altera os valores na tela) */
    premiumPrice.innerHTML = "R$149,99";
    premium_IAPrice.innerHTML = "R$199,99";

    /* TEXTO (Altera o período de cobrança) */
    premiumText.innerHTML = "por ano";
    premium_IAText.innerHTML = "por ano";
});