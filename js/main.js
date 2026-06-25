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
// ──────────────────────────────────────────
const ptTesto     = document.getElementById('ptTesto');
const ptNumero    = document.getElementById('ptNumero');
const ptSlider    = document.getElementById('ptSlider');
const ptPlus      = document.getElementById('ptPlus');
const ptMinus     = document.getElementById('ptMinus');
const ptAreaTesto = document.querySelector('.pt-area-testo');

if (!ptTesto || !ptNumero || !ptSlider || !ptPlus || !ptMinus) return;

const PT_TO_PX    = 96 / 72;
const PT_MIN      = 6;
const PT_MAX      = 400;
const PT_DEFAULT  = 72;
let ptCorrente            = PT_DEFAULT;
let utenteHaInteragitoPt  = false; // evita che il resize scavalchi una scelta manuale

function aggiornaPt(nuovoPt) {
  ptCorrente = Math.max(PT_MIN, Math.min(PT_MAX, Math.round(nuovoPt)));
  ptTesto.style.fontSize = (ptCorrente * PT_TO_PX) + 'px';
  ptNumero.textContent   = ptCorrente;
  ptSlider.value         = ptCorrente;
}

// Calcola il pt massimo che fa stare il testo su una riga nello spazio
// realmente disponibile, senza mai superare il valore di default (72pt).
function calcolaPtAdattivo() {
  if (!ptAreaTesto) return PT_DEFAULT;

  const cs         = window.getComputedStyle(ptTesto);
  const fontFamily = cs.fontFamily;
  const fontWeight = cs.fontWeight;

  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  const refPx  = 200; // dimensione di riferimento per la misura
  ctx.font     = `${fontWeight} ${refPx}px ${fontFamily}`;
  const larghezzaRiferimento = ctx.measureText(ptTesto.textContent).width;
  if (!larghezzaRiferimento) return PT_DEFAULT;

  const csArea   = window.getComputedStyle(ptAreaTesto);
  const padLeft  = parseFloat(csArea.paddingLeft)  || 0;
  const padRight = parseFloat(csArea.paddingRight) || 0;
  const larghezzaDisponibile = (ptAreaTesto.clientWidth - padLeft - padRight) * 0.92; // margine di sicurezza

  const pxMassimo = (larghezzaDisponibile / larghezzaRiferimento) * refPx;
  const ptMassimo = pxMassimo / PT_TO_PX;

  return Math.max(PT_MIN, Math.min(PT_DEFAULT, Math.floor(ptMassimo)));
}

function impostaDimensioneIniziale() {
  if (utenteHaInteragitoPt) return; // non toccare se l'utente ha già scelto un valore
  aggiornaPt(calcolaPtAdattivo());
}

// Inizializzazione
impostaDimensioneIniziale();

// Pulsanti + e −
ptPlus .addEventListener('click', () => { utenteHaInteragitoPt = true; aggiornaPt(ptCorrente + 1); });
ptMinus.addEventListener('click', () => { utenteHaInteragitoPt = true; aggiornaPt(ptCorrente - 1); });

// Slider (drag manuale con il pallino)
ptSlider.addEventListener('input', () => { utenteHaInteragitoPt = true; aggiornaPt(Number(ptSlider.value)); });

// Ricalcola la dimensione iniziale se la finestra cambia (es. rotazione schermo),
// ma solo se l'utente non ha ancora interagito manualmente
window.addEventListener('resize', impostaDimensioneIniziale);

// Ricalcola anche dopo il caricamento effettivo del font, per misure accurate
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(impostaDimensioneIniziale);
}



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