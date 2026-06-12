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



// ──────────────────────────────────────────
  // 3. CALIBRAZIONE LINEE TIPOGRAFICHE — APHRODITE
  // ──────────────────────────────────────────
// ──────────────────────────────────────────
// 3. CALIBRAZIONE LINEE TIPOGRAFICHE — APHRODITE
// ──────────────────────────────────────────
function calibraLineeAphrodite() {
  const zonaLinee = document.querySelector('.aphrodite-zona-linee');
  const testoEl   = document.querySelector('.aphrodite-testo');
  if (!zonaLinee || !testoEl) return;

  const cs         = window.getComputedStyle(testoEl);
  const fontSize   = parseFloat(cs.fontSize);
  const fontFamily = cs.fontFamily;
  const fontWeight = cs.fontWeight;

  // ── Misura metriche con Canvas ──
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  ctx.font     = `${fontWeight} ${fontSize}px ${fontFamily}`;

  const mX = ctx.measureText('x');
  const mH = ctx.measureText('H'); // cap-height (maiuscole)
  const mh = ctx.measureText('h'); // ascender-height minuscole (h, b, l)
  const mP = ctx.measureText('p'); // descender

  const xHeight  = mX.actualBoundingBoxAscent;  // cima 'x' sopra baseline
  const capHeight = mH.actualBoundingBoxAscent; // cima 'H' sopra baseline
  const ascHeight = mh.actualBoundingBoxAscent; // cima 'h' sopra baseline
  const descDepth = mP.actualBoundingBoxDescent; // fondo 'p' sotto baseline

  // ── Trova la baseline reale con span fantasma ──
  const ghost = document.createElement('span');
  ghost.textContent = 'H';
  ghost.style.cssText = `
    font-family: ${fontFamily};
    font-weight: ${fontWeight};
    font-size: ${fontSize}px;
    line-height: inherit;
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
  `;
  ghost.style.top  = cs.paddingTop;
  ghost.style.left = cs.paddingLeft;
  zonaLinee.appendChild(ghost);

  const ghostRect = ghost.getBoundingClientRect();
  const zonaRect  = zonaLinee.getBoundingClientRect();
  const mHDesc    = mH.actualBoundingBoxDescent; // quasi 0 per H

  // bottom del bounding box di 'H' ≈ baseline
  const baselineY = ghostRect.bottom - zonaRect.top - mHDesc;

  zonaLinee.removeChild(ghost);

  // ── Calcola le posizioni percentuali ──
  const zonaH = zonaLinee.offsetHeight;

  const pctBase        = (baselineY / zonaH) * 100;
  const pctX           = ((baselineY - xHeight)  / zonaH) * 100;
  const pctDiscendenti = ((baselineY + descDepth) / zonaH) * 100;

  // Linea maiuscole: cima H, nessun offset aggiuntivo
  const pctMaiuscole   = ((baselineY - capHeight) / zonaH) * 100;

  // Linea ascendenti: cima 'h' (minuscole con asta) — più alta delle maiuscole
  const pctAscendenti  = ((baselineY - ascHeight) / zonaH) * 100;

  zonaLinee.style.setProperty('--linea-base',        pctBase.toFixed(3) + '%');
  zonaLinee.style.setProperty('--linea-x',           pctX.toFixed(3) + '%');
  zonaLinee.style.setProperty('--linea-maiuscole',   pctMaiuscole.toFixed(3) + '%');
  zonaLinee.style.setProperty('--linea-ascendenti',  pctAscendenti.toFixed(3) + '%');
  zonaLinee.style.setProperty('--linea-discendenti', pctDiscendenti.toFixed(3) + '%');
}

// Prima chiamata con piccolo delay per garantire il rendering del font
setTimeout(calibraLineeAphrodite, 100);
window.addEventListener('resize', calibraLineeAphrodite);

// Ricalibra anche quando il font Google è caricato (evita flash)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(calibraLineeAphrodite);
}


});