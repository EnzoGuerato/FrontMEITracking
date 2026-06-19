/* =====================================================================
   Preferencias.js  ·  Script global de preferências do usuário
   Deve ser incluído em TODAS as páginas (preferencialmente no <head>
   com defer, ou no início do <body>) para evitar flash de tema errado.
   ===================================================================== */

(function () {
  'use strict';

  /* Modo escuro */
  const dark = localStorage.getItem('meitrack_dark_mode');
  if (dark === '1') {
    document.documentElement.classList.add('dark');
    /* Também aplica no body assim que ele existir */
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('dark');
    });
  }

  /* Tamanho de fonte */
  const fontSize = parseInt(localStorage.getItem('meitrack_font_size'), 10);
  if (!isNaN(fontSize) && fontSize !== 100) {
    document.documentElement.style.fontSize = fontSize + '%';
  }

  /* Perfil: aplica nome e foto nos elementos marcados */
  document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('meitrack_perfil_nome') || 'Usuário';
    const foto = localStorage.getItem('meitrack_perfil_foto');

    document.querySelectorAll('[data-perfil-nome]').forEach(function (el) {
      el.textContent = nome;
    });

    if (foto) {
      document.querySelectorAll('[data-perfil-foto]').forEach(function (el) {
        el.src = foto;
      });
    }
  });

})();
