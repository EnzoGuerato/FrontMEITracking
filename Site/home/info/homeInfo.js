/* BOTÃO PREMIUM */
const premiumBtn = document.querySelector(".premiumBtn");


/* EVENTO */
premiumBtn.addEventListener("click", () => {

    alert("Bem-vindo ao Premium!");

});


/* LOGIN */
const loginBtn = document.querySelector(".loginBtn");


/* EVENTO */
loginBtn.addEventListener("click", () => {

    alert("tem q logar nessa prr.");

});


/* BOTÕES PLANOS */
const monthlyBtn = document.getElementById("monthlyBtn");

const yearlyBtn = document.getElementById("yearlyBtn");


/* PREÇOS */
const premiumPrice = document.getElementById("premiumPrice");

const Premium_IAPrice = document.getElementById("premium_IAPrice");


/* TEXTOS */
const premiumText = document.getElementById("premiumText");

const premium_IAText = document.getElementById("premium_IAText");



/* MENSAL*/


monthlyBtn.addEventListener("click", () => {

    /* CLASSE */
    monthlyBtn.classList.add("activePlan");

    yearlyBtn.classList.remove("activePlan");


    /* PREÇOS */
    premiumPrice.innerHTML = "R$14,99";

    premium_IAPrice.innerHTML = "R$19,99";


    /* TEXTO */
    premiumText.innerHTML = "por mês";

    premium_IAText.innerHTML = "por mês";

});


/* ANUAL  */


yearlyBtn.addEventListener("click", () => {

    /* CLASSE */
    yearlyBtn.classList.add("activePlan");

    monthlyBtn.classList.remove("activePlan");


    /* PREÇOS */
    premiumPrice.innerHTML = "R$149,99";

    premium_IAPrice.innerHTML = "R$199,99";


    /* TEXTO */
    premiumText.innerHTML = "por ano";

    premium_IAText.innerHTML = "por ano";

});