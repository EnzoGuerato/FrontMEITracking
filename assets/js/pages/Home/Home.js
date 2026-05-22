/* =====================================================================
   Home.js · Alternador de planos mensal / anual
   Cards: #premiumPrice / #premiumText  e  #premium_IAPrice / #premium_IAText
   ===================================================================== */

(function () {
  'use strict';

  /* ── Preços ── */
  const PLANS = {
    premium: {
      monthly: { price: 'R$14,99', label: 'por mês' },
      yearly:  { price: 'R$149,90', label: 'por ano · 2 meses grátis' }
    },
    premiumIA: {
      monthly: { price: 'R$19,99', label: 'por mês' },
      yearly:  { price: 'R$199,90', label: 'por ano · 2 meses grátis' }
    }
  };

  /* ── Elementos ── */
  const monthlyBtn     = document.getElementById('monthlyBtn');
  const yearlyBtn      = document.getElementById('yearlyBtn');
  const premiumPrice   = document.getElementById('premiumPrice');
  const premiumText    = document.getElementById('premiumText');
  const premiumIAPrice = document.getElementById('premium_IAPrice');
  const premiumIAText  = document.getElementById('premium_IAText');

  if (!monthlyBtn || !yearlyBtn) return;

  /* ── Aplica os preços ── */
  function applyPrices(period) {
    const p  = PLANS.premium[period];
    const ia = PLANS.premiumIA[period];

    if (premiumPrice)   premiumPrice.textContent   = p.price;
    if (premiumText)    premiumText.textContent     = p.label;
    if (premiumIAPrice) premiumIAPrice.textContent  = ia.price;
    if (premiumIAText)  premiumIAText.textContent   = ia.label;
  }

  /* ── Atualiza botões ativos ── */
  function setActive(active, inactive) {
    active.classList.add('activePlan');
    inactive.classList.remove('activePlan');
  }

  /* ── Eventos ── */
  monthlyBtn.addEventListener('click', function () {
    setActive(monthlyBtn, yearlyBtn);
    applyPrices('monthly');
  });

  yearlyBtn.addEventListener('click', function () {
    setActive(yearlyBtn, monthlyBtn);
    applyPrices('yearly');
  });

  /* ── Estado inicial ── */
  applyPrices('monthly');

})();
