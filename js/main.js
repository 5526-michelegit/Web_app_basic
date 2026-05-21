// ----------------------------------------
// Attesa che il DOM sia completamente caricato
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  console.log('[Erotique] Pagina caricata correttamente.');

  // Selezione degli elementi del DOM necessari
  const navToggle   = document.getElementById('navToggle');
  const menuTendina = document.getElementById('menuTendina');

  // Verifica che gli elementi esistano nel DOM
  if (!navToggle || !menuTendina) {
    console.error('[Erotique] Elementi di navigazione non trovati nel DOM.');
    return;
  }

  // ----------------------------------------
  // 1. TOGGLE DEL MENU A TENDINA
  // Apre il menu se chiuso, lo chiude se aperto
  // ----------------------------------------
  navToggle.addEventListener('click', () => {
    const isAperto = navToggle.getAttribute('aria-expanded') === 'true';
    if (isAperto) {
      chiudiMenu();
      console.log('[Erotique] Menu chiuso.');
    } else {
      apriMenu();
      console.log('[Erotique] Menu aperto.');
    }
  });

  // ----------------------------------------
  // 2. CHIUSURA MENU AL CLICK ESTERNO
  // Chiude il menu se l'utente clicca fuori dalla navbar
  // ----------------------------------------
  document.addEventListener('click', (evento) => {
    const clickFuoriNav = !navToggle.contains(evento.target) && !menuTendina.contains(evento.target);
    if (clickFuoriNav) {
      chiudiMenu();
    }
  });

  // ----------------------------------------
  // 3. CHIUSURA CON TASTO ESCAPE (accessibilità)
  // ----------------------------------------
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      chiudiMenu();
      // Riporta il focus sul pulsante toggle
      navToggle.focus();
    }
  });

  // ----------------------------------------
  // FUNZIONI HELPER
  // ----------------------------------------

  /**
   * apriMenu() – Aggiunge le classi e gli attributi per mostrare il menu
   */
  function apriMenu() {
    menuTendina.classList.add('aperto');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * chiudiMenu() – Rimuove le classi e ripristina lo stato chiuso del menu
   */
  function chiudiMenu() {
    menuTendina.classList.remove('aperto');
    navToggle.setAttribute('aria-expanded', 'false');
  }

});