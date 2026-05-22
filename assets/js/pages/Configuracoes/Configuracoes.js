/* =====================================================================
   Configuracoes.js
   Gerencia modo escuro e tamanho de fonte globalmente via localStorage.
   ===================================================================== */

(function () {
  'use strict';

  /* ── Chaves de armazenamento ── */
  const KEY_DARK  = 'meitrack_dark_mode';
  const KEY_FONT  = 'meitrack_font_size';

  /* ── Limites de fonte (%) ── */
  const FONT_MIN  = 80;
  const FONT_MAX  = 140;
  const FONT_STEP = 10;

  /* ── Elementos ── */
  const darkToggle   = document.getElementById('darkModeToggle');
  const fontIncrease = document.getElementById('fontIncrease');
  const fontDecrease = document.getElementById('fontDecrease');
  const fontValue    = document.getElementById('fontValue');
  const previewText  = document.getElementById('previewText');

  /* ================================================================
     MODO ESCURO
     Aplica/remove a classe .dark no <body> e salva no localStorage.
  ================================================================ */
  function applyDark(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (darkToggle) darkToggle.checked = isDark;
    localStorage.setItem(KEY_DARK, isDark ? '1' : '0');
  }

  function loadDark() {
    const saved = localStorage.getItem(KEY_DARK);
    /* Se nunca foi definido, respeita preferência do sistema */
    if (saved === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyDark(prefersDark);
    } else {
      applyDark(saved === '1');
    }
  }

  if (darkToggle) {
    darkToggle.addEventListener('change', () => applyDark(darkToggle.checked));
  }

  /* ================================================================
     TAMANHO DE FONTE
     Altera font-size no <html> e salva no localStorage.
  ================================================================ */
  function applyFont(size) {
    /* Garante que está dentro dos limites */
    size = Math.min(FONT_MAX, Math.max(FONT_MIN, size));
    document.documentElement.style.fontSize = size + '%';
    if (fontValue) fontValue.textContent = size + '%';
    localStorage.setItem(KEY_FONT, size);

    /* Atualiza estado dos botões */
    if (fontDecrease) fontDecrease.disabled = size <= FONT_MIN;
    if (fontIncrease) fontIncrease.disabled = size >= FONT_MAX;
  }

  function loadFont() {
    const saved = parseInt(localStorage.getItem(KEY_FONT), 10);
    applyFont(isNaN(saved) ? 100 : saved);
  }

  if (fontIncrease) {
    fontIncrease.addEventListener('click', () => {
      const current = parseInt(localStorage.getItem(KEY_FONT) || '100', 10);
      applyFont(current + FONT_STEP);
    });
  }

  if (fontDecrease) {
    fontDecrease.addEventListener('click', () => {
      const current = parseInt(localStorage.getItem(KEY_FONT) || '100', 10);
      applyFont(current - FONT_STEP);
    });
  }

  /* ================================================================
     INICIALIZAÇÃO
  ================================================================ */
  loadDark();
  loadFont();

})();
