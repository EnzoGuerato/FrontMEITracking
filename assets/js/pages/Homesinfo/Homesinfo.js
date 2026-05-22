/* =====================================================================
   Homesinfo.js · Alternador de planos mensal / anual
   Cards: Grátis (sem alteração), Premium e Premium I.A
   IDs: #GratisPrice, #premiumPrice / #premiumText,
        #premium_IAPrice / #premium_IAText
   Badges "2 meses grátis" ficam visíveis apenas no modo anual.
   ===================================================================== */

(function () {
  'use strict';

  /* ── Preços ── */
  const PLANS = {
    premium: {
      monthly: { price: 'R$14,99', label: 'por mês' },
      yearly:  { price: 'R$149,90', label: 'por ano' }
    },
    premiumIA: {
      monthly: { price: 'R$19,99', label: 'por mês' },
      yearly:  { price: 'R$199,90', label: 'por ano' }
    }
  };

  /* ── Elementos ── */
  const monthlyBtn     = document.getElementById('monthlyBtn');
  const yearlyBtn      = document.getElementById('yearlyBtn');
  const premiumPrice   = document.getElementById('premiumPrice');
  const premiumText    = document.getElementById('premiumText');
  const premiumIAPrice = document.getElementById('premium_IAPrice');
  const premiumIAText  = document.getElementById('premium_IAText');

  /* Badges "2 meses grátis" — podem existir múltiplos */
  const badges = document.querySelectorAll('.badge-anual');

  if (!monthlyBtn || !yearlyBtn) return;

  /* ── Aplica os preços e visibilidade dos badges ── */
  function applyPrices(period) {
    const p  = PLANS.premium[period];
    const ia = PLANS.premiumIA[period];

    if (premiumPrice)   premiumPrice.textContent  = p.price;
    if (premiumText)    premiumText.textContent    = p.label;
    if (premiumIAPrice) premiumIAPrice.textContent = ia.price;
    if (premiumIAText)  premiumIAText.textContent  = ia.label;

    /* Mostra badges apenas no plano anual */
    badges.forEach(function (badge) {
      badge.style.display = period === 'yearly' ? 'inline-flex' : 'none';
    });
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
