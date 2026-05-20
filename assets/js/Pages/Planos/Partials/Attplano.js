/* MENSAL*/
monthlyBtn.addEventListener("click", () => {

    /* CLASSE (Aplica o visual ativo no botão Mensal) */
    monthlyBtn.classList.add("activePlan");
    yearlyBtn.classList.remove("activePlan");

    /* PREÇOS (Altera os valores na tela) */
    premiumPrice.innerHTML = "R$14,99";
    premium_IAPrice.innerHTML = "R$19,99";

    /* TEXTO (Altera o período de cobrança) */
    premiumText.innerHTML = "por mês";
    premium_IAText.innerHTML = "por mês";
});