// ============================================================
// MAIN.JS — Erotique Alternate
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  console.log('[Erotique] Pagina caricata correttamente.');

  // ──────────────────────────────────────────
  // 1. NAVIGAZIONE
  // ──────────────────────────────────────────
  const navToggle  = document.getElementById('navToggle');
  const menuTendina = document.getElementById('menuTendina');

  if (!navToggle || !menuTendina) {
    console.error('[Erotique] Elementi di navigazione non trovati.');
    return;
  }

  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? chiudiMenu() : apriMenu();
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !menuTendina.contains(e.target)) chiudiMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { chiudiMenu(); navToggle.focus(); }
  });

  function apriMenu()  { menuTendina.classList.add('aperto');    navToggle.setAttribute('aria-expanded', 'true');  }
  function chiudiMenu(){ menuTendina.classList.remove('aperto'); navToggle.setAttribute('aria-expanded', 'false'); }

  // ──────────────────────────────────────────
  // 2. SEZIONE PT
  // Solo pulsanti + / − e slider manuale.
  // Scroll e tastiera NON modificano il valore.
  // ──────────────────────────────────────────
  const ptTesto  = document.getElementById('ptTesto');
  const ptNumero = document.getElementById('ptNumero');
  const ptSlider = document.getElementById('ptSlider');
  const ptPlus   = document.getElementById('ptPlus');
  const ptMinus  = document.getElementById('ptMinus');

  if (!ptTesto || !ptNumero || !ptSlider || !ptPlus || !ptMinus) return;

  // 1 pt tipografico = 96/72 px (standard 96 dpi)
  const PT_TO_PX = 96 / 72;
  const PT_MIN   = 6;
  const PT_MAX   = 400;
  let ptCorrente = 72;

  function aggiornaPt(nuovoPt) {
    ptCorrente = Math.max(PT_MIN, Math.min(PT_MAX, Math.round(nuovoPt)));
    ptTesto.style.fontSize = (ptCorrente * PT_TO_PX) + 'px';
    ptNumero.textContent   = ptCorrente;
    ptSlider.value         = ptCorrente;
  }

  // Inizializzazione
  aggiornaPt(ptCorrente);

  // Pulsanti + e −
  ptPlus .addEventListener('click', () => aggiornaPt(ptCorrente + 1));
  ptMinus.addEventListener('click', () => aggiornaPt(ptCorrente - 1));

  // Slider (drag manuale con il pallino)
  ptSlider.addEventListener('input', () => aggiornaPt(Number(ptSlider.value)));

});