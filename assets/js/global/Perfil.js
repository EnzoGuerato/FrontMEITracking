/* =====================================================================
   Perfil.js · MEI Track
   Gerencia nome e foto do usuário via localStorage.
   Exporta funções globais: Perfil.getNome(), Perfil.getFoto(),
   Perfil.setNome(n), Perfil.setFoto(dataUrl), Perfil.aplicar()
   Deve ser incluído ANTES do DOMContentLoaded em todas as páginas.
   ===================================================================== */

(function () {
  'use strict';

  const KEY_NOME = 'meitrack_perfil_nome';
  const KEY_FOTO = 'meitrack_perfil_foto';
  const FOTO_PADRAO = 'duolingo/logo meizinho/profile.png';
  /* No duolingo, o caminho relativo é diferente */
  const FOTO_PADRAO_DUOLINGO = 'logo meizinho/profile.png';

  function getNome() {
    return localStorage.getItem(KEY_NOME) || 'Usuário';
  }

  function getFoto() {
    return localStorage.getItem(KEY_FOTO) || null;
  }

  function setNome(nome) {
    localStorage.setItem(KEY_NOME, nome.trim() || 'Usuário');
  }

  function setFoto(dataUrl) {
    localStorage.setItem(KEY_FOTO, dataUrl);
  }

  /* Aplica nome e foto em todos os elementos marcados na página */
  function aplicar() {
    const nome = getNome();
    const foto = getFoto();

    /* ── Nome ── */
    document.querySelectorAll('[data-perfil-nome]').forEach(el => {
      el.textContent = nome;
    });

    /* ── Foto ── */
    if (foto) {
      document.querySelectorAll('[data-perfil-foto]').forEach(el => {
        el.src = foto;
      });
    }
  }

  /* Executa ao carregar o DOM */
  document.addEventListener('DOMContentLoaded', aplicar);

  /* Expõe API global */
  window.Perfil = { getNome, getFoto, setNome, setFoto, aplicar };

})();
