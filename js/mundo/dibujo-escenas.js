// =====================================================
//  DIBUJO: ESCENAS
// =====================================================
// Ilustración del atardecer en la ciudad para el inicio de sesión y los menús
const FONDO_MENU = new Image();
let fondoListo = false;
FONDO_MENU.onload = () => fondoListo = true;
FONDO_MENU.src = 'img/interfaz/fondo-menu.jpg';
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
let menuFondoT = -1e9, menuFondoTam = '';
function dibujarMenuFondo(t){
  // el acercamiento es muy lento: basta con repintarlo 12 veces por segundo. Los paneles con cristal esmerilado de
  // encima recalculan su desenfoque cada vez que el fondo cambia, y eso era lo que bajaba los FPS del inicio
  const tam = W + 'x' + H + fondoListo;
  if (tam === menuFondoTam && t - menuFondoT < 83 && t >= menuFondoT) return;
  menuFondoT = t; menuFondoTam = tam;
  ctx.fillStyle = '#1a1440'; ctx.fillRect(0, 0, W, H);
  if (!fondoListo) return;
  // ajuste tipo "cover" con un acercamiento lento
  const iw = FONDO_MENU.width, ih = FONDO_MENU.height;
  const zoom = sinMovimiento ? 1.04 : 1.06 + .03 * Math.sin(t / 9000);
  const k = Math.max(W / iw, H / ih) * zoom;
  const dw = iw * k, dh = ih * k;
  const dx = (W - dw) / 2 + (sinMovimiento ? 0 : Math.sin(t / 13000) * W * .012);
  const dy = (H - dh) * .45;
  ctx.drawImage(FONDO_MENU, dx, dy, dw, dh);
}

function dibujarPortalViejo(x, y, color, t, esc = 1){
  ctx.save(); ctx.translate(x, y);
  const pulso = 1 + .05 * Math.sin(t / 300);
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 70 * esc);
  g.addColorStop(0, color + 'aa'); g.addColorStop(1, color + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 66 * esc, 78 * esc, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#05030a'; ctx.beginPath(); ctx.ellipse(0, 0, 26 * esc * pulso, 40 * esc * pulso, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  for (let k = 0; k < 3; k++){
    const a = t / 380 * (k % 2 ? -1 : 1) + k * 2;
    ctx.beginPath(); ctx.ellipse(0, 0, (28 - k * 7) * esc * pulso, (42 - k * 10) * esc * pulso, 0, a, a + 4.2); ctx.stroke();
  }
  ctx.restore();
}

// portal animado: fila = rango (0 E ... 5 S); (x, y) es el centro de la entrada
function dibujarPortal(x, y, fila, t, esc = 1){
  const col = COLOR_PORTAL[fila];
  if (!portalListo) return dibujarPortalViejo(x, y, col, t, esc);
  if (esc <= .02) return;
  const h = 150 * esc, w = h * PFW / PFH, dx = x - w / 2, dy = y + 40 * esc - h;
  // sombra y reflejo de color en el suelo
  ctx.fillStyle = 'rgba(4,2,10,.5)';
  ctx.beginPath(); ctx.ellipse(x, y + 38 * esc, 56 * esc, 15 * esc, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(x, y + 38 * esc, 4, x, y + 38 * esc, 80 * esc);
  g.addColorStop(0, col + '55'); g.addColorStop(1, col + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + 38 * esc, 80 * esc, 24 * esc, 0, 0, TAU); ctx.fill();
  const fr = sinMovimiento ? 0 : Math.floor(t / 130) % PFN;
  const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(PORTAL_IMG, fr * PFW, fila * PFH, PFW, PFH, Math.round(dx), Math.round(dy), Math.round(w), Math.round(h));
  ctx.imageSmoothingEnabled = suave;
}

// c y zona (en casillas) sirven para pintar las paredes en otro lienzo, como los trozos de cueva ya dibujados
function dibujarParedes(colorTope, colorCara, colorLinea, tintTope, tintCara, c = ctx, zona = null){
  const x0 = zona ? zona.x0 : Math.max(0, Math.floor(cam.x / T) - 1), x1 = zona ? zona.x1 : Math.min(E.cols - 1, Math.floor((cam.x + W) / T) + 1);
  const y0 = zona ? zona.y0 : Math.max(0, Math.floor(cam.y / T) - 1), y1 = zona ? zona.y1 : Math.min(E.rows - 1, Math.floor((cam.y + H) / T) + 1);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){
    if (!E.solido[y * E.cols + x] || (E.mueble && E.mueble[y * E.cols + x])) continue;
    c.fillStyle = colorTope; c.fillRect(x * T, y * T, T + .5, T + .5);
    if (tintTope){ c.fillStyle = tintTope; c.fillRect(x * T, y * T, T + .5, T + .5); }
    if (y + 1 < E.rows && !E.solido[(y + 1) * E.cols + x]){
      c.fillStyle = colorCara; c.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      if (tintCara){ c.fillStyle = tintCara; c.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5); }
      if (colorLinea){ c.fillStyle = colorLinea; c.fillRect(x * T, y * T + T * .45, T + .5, 2); }
    }
  }
}

function pintarSueloCiudad(cx2, G){
  const pc = n => PAT_CIU[n] || null;
  const tile = (n, x, y) => { const [sx, sy, w, h] = CIU['t_' + n]; cx2.drawImage(CIU_IMG, sx, sy, w, h, x, y, T + .5, T + .5); };
  cx2.fillStyle = patron('cesped') || '#2f4a2c'; cx2.fillRect(0, 0, G.w, G.h);
  const zona = (n, c, r, w, h, fb) => { cx2.fillStyle = pc(n) || fb; cx2.fillRect(c * T, r * T, w * T, h * T); };
  // aceras a ambos lados de las dos avenidas
  for (const r of [7, 11, 19, 23]) zona('acera', 1, r, 38, 1, '#8a8478');
  // paseo peatonal norte-sur y plaza de losas
  zona('ladrillo', 18.5, 12, 3, 7, '#7a6a5a'); zona('ladrillo', 18.5, 24, 3, 5, '#7a6a5a');
  // la plaza queda entre las dos aceras: no las pisa
  const recortePlaza = () => { cx2.save(); cx2.beginPath(); cx2.rect(0, 12 * T, G.w, 7 * T); cx2.clip(); };
  recortePlaza();
  cx2.fillStyle = pc('losa') || '#8a8478'; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 212, 0, TAU); cx2.fill();
  cx2.fillStyle = pc('rombo') || '#99907f'; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 190, 0, TAU); cx2.fill();
  cx2.restore();
  // avenidas de asfalto con línea central, alcantarillas y pasos de cebra
  zona('asfalto', 1, 8, 38, 3, '#2a2a2e'); zona('asfalto', 1, 20, 38, 3, '#2a2a2e');
  if (ciuListo){
    for (let c = 1; c < 39; c++){
      if (c >= 18 && c <= 21) continue;
      tile('linea_h', c * T, 9 * T); tile('linea_h', c * T, 21 * T);
    }
    for (const [c, r] of [[6, 10], [33, 8], [9, 20], [30, 22]]) tile('alcant', c * T, r * T);
    for (let k = 0; k < 3; k++) for (const r of [8, 9, 10, 20, 21, 22]) tile('cebra', (18.5 + k) * T, r * T);
  }
  // bordillos
  for (const [y0, y1] of [[8, 11], [20, 23]]){
    cx2.fillStyle = 'rgba(205,200,188,.75)'; cx2.fillRect(T, y0 * T - 3, 38 * T, 3); cx2.fillRect(T, y1 * T, 38 * T, 3);
    cx2.fillStyle = 'rgba(0,0,0,.35)'; cx2.fillRect(T, y0 * T, 38 * T, 4); cx2.fillRect(T, y1 * T + 3, 38 * T, 3);
  }
  recortePlaza(); cx2.strokeStyle = 'rgba(205,200,188,.7)'; cx2.lineWidth = 4; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 212, 0, TAU); cx2.stroke(); cx2.restore();
  // tono nocturno para que luzcan las farolas
  cx2.fillStyle = 'rgba(12,10,35,.34)'; cx2.fillRect(0, 0, G.w, G.h);
  // muralla
  for (let y = 0; y < G.rows; y++) for (let x = 0; x < G.cols; x++){
    if (!G.solido[y * G.cols + x] || (x > 0 && y > 0 && x < G.cols - 1 && y < G.rows - 1)) continue;
    cx2.fillStyle = patron('muro') || '#1b1826'; cx2.fillRect(x * T, y * T, T + .5, T + .5);
    cx2.fillStyle = 'rgba(10,8,25,.6)'; cx2.fillRect(x * T, y * T, T + .5, T + .5);
    if (y + 1 < G.rows && !G.solido[(y + 1) * G.cols + x]){
      cx2.fillStyle = patron('muro') || '#47425e'; cx2.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      cx2.fillStyle = 'rgba(10,8,25,.25)'; cx2.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      cx2.fillStyle = 'rgba(0,0,0,.35)'; cx2.fillRect(x * T, y * T + T * .45, T + .5, 2);
    }
  }
  // charcos de luz bajo las farolas
  for (const f of G.farolas){
    const g = cx2.createRadialGradient(f.x, f.y, 4, f.x, f.y, 120);
    g.addColorStop(0, 'rgba(255,205,120,.28)'); g.addColorStop(1, 'rgba(255,205,120,0)');
    cx2.fillStyle = g; cx2.beginPath(); cx2.ellipse(f.x, f.y, 120, 80, 0, 0, TAU); cx2.fill();
  }
}

// el suelo de la ciudad no cambia: se pinta una sola vez en un lienzo aparte y luego solo se copia la parte visible
let cacheCiudad = null;
function dibujarCiudad(t){
  const G = E;
  const clave = [ciuListo, terrListo, PATRONES.cesped, PATRONES.muro];
  if (!cacheCiudad || cacheCiudad.G !== G || cacheCiudad.clave.some((v, k) => v !== clave[k])){
    const c = cacheCiudad && cacheCiudad.G === G ? cacheCiudad.c : document.createElement('canvas');
    c.width = G.w; c.height = G.h;
    const cx2 = c.getContext('2d');
    pintarSueloCiudad(cx2, G);
    cacheCiudad = { c, G, clave };
  }
  const sx = Math.max(0, Math.floor(cam.x) - 2), sy = Math.max(0, Math.floor(cam.y) - 2);
  const sw = Math.min(G.w - sx, Math.ceil(W) + 4), sh = Math.min(G.h - sy, Math.ceil(H) + 4);
  if (sw > 0 && sh > 0) ctx.drawImage(cacheCiudad.c, sx, sy, sw, sh, sx, sy, sw, sh);
}

// halo de las bombillas por encima de todo
// brillo redondo ya pintado (se reutiliza en vez de crear un degradado en cada cuadro)
const BRILLOS = {};
function brillo(col, r){
  const k = col + r; if (BRILLOS[k]) return BRILLOS[k];
  const c = document.createElement('canvas'); c.width = c.height = r * 2; const a = c.getContext('2d');
  const g = a.createRadialGradient(r, r, 1, r, r, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  a.fillStyle = g; a.fillRect(0, 0, r * 2, r * 2);
  return BRILLOS[k] = c;
}
function dibujarLucesCiudad(t){
  if (E.tipo !== 'ciudad') return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingEnabled = true;
  const parpadeo = .7 + oscuridad() * 1.2, b = brillo('rgb(255,215,140)', 34);
  ctx.globalAlpha = Math.min(1, .45 * parpadeo);
  for (const f of E.farolas) for (const [dx, dy] of f.luces) ctx.drawImage(b, f.x + dx - 34, f.y + dy - 34, 68, 68);
  ctx.restore();
}

function dibujarPortalCiudad(p, t){
  const R = RANGOS[p.rango], esc = Math.min(1, p.nace / .8);
  dibujarPortal(p.x, p.y, p.rango, t, esc);
  // textos ya dibujados (rotulo): el del tiempo cambia una vez por segundo
  const letra = p.mundo ? '☠' : p.semanal ? '♛' : R.l;
  rotulo(letra, p.x, Math.round(p.y - 117 * esc), '28px Marcellus, Georgia, serif', p.mundo ? '#ff4f6b' : p.semanal ? '#ffd100' : R.color, null, 0, true);
  const txt = p.mundo ? `Jefe de mundo: ${jefeMundoNombre()}${jefeMundoHecho() ? ' (derrotado)' : ''}` : p.semanal ? `Titán semanal: ${titanDeLaSemana()}${titanHecho() ? ' (derrotado)' : ''}` : `Rango ${R.l}, se cierra en ${formatoTiempo(p.cierra)}`;
  rotulo(txt, p.x, p.y + 66, '600 13px Rajdhani, sans-serif', p.cierra < 30 ? '#ff8a9b' : '#e9e4ff', 'rgba(0,0,0,.7)', 3);
}

// paredes interiores: madera con ventanas (posada) y piedra (mercado)
const PAR = {"madera": [0, 0, 110, 88], "piedra": [112, 0, 192, 31], "antorcha": [306, 0, 16, 22]};
const PAR_IMG = new Image();
let parListo = false;
PAR_IMG.onload = () => parListo = true;
PAR_IMG.src = 'img/mundo/par.webp';
function dibujarParedInterior(G, tipo){
  if (!parListo){ dibujarParedes('#24170e', patron('madera') || '#6b4a30', '#8a6440', null, 'rgba(40,18,5,.4)'); return; }
  const [base, filo] = tipo === 'piedra' ? ['#363b4f', '#8d97ad'] : ['#6e4a32', '#c29463'];
  // muros laterales e inferior con moldura
  const [sx, sy, w, h] = PAR[tipo], alto = 1.8 * T, k = alto / h, ancho = w * k;
  const tope = T - alto - 4 - T * .3;
  ctx.fillStyle = base;
  ctx.fillRect(0, tope, T, G.h - tope); ctx.fillRect(G.w - T, tope, T, G.h - tope); ctx.fillRect(0, G.h - T, G.w, T);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.fillRect(T, G.h - T + 4, G.w - 2 * T, 6);
  ctx.fillStyle = filo;
  ctx.fillRect(T - 4, tope + T * .3, 4, G.h - T + 4 - tope - T * .3); ctx.fillRect(G.w - T, tope + T * .3, 4, G.h - T + 4 - tope - T * .3);
  ctx.fillRect(T - 4, G.h - T, G.w - 2 * T + 8, 4);
  // pared del fondo, en tiras que se repiten
  const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  for (let x = T; x < G.w - T; x += ancho){
    const dw = Math.min(ancho, G.w - T - x);
    ctx.drawImage(PAR_IMG, sx, sy, dw / k, h, Math.round(x), Math.round(T - alto), Math.ceil(dw), Math.round(alto));
  }
  ctx.fillStyle = filo; ctx.fillRect(T - 4, T - alto - 4, G.w - 2 * T + 8, 4);
  ctx.fillStyle = base; ctx.fillRect(0, tope, G.w, T * .3);
  // sombra al pie de la pared
  const g = ctx.createLinearGradient(0, T, 0, T + 16); g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(T, T, G.w - 2 * T, 16);
  if (tipo === 'piedra'){
    const [ax, ay, aw, ah] = PAR.antorcha;
    for (const cx of [4 * T, 9.5 * T]) ctx.drawImage(PAR_IMG, ax, ay, aw, ah, cx - aw, T - alto * .78, aw * 2, ah * 2);
  }
  ctx.imageSmoothingEnabled = suave;
}
function dibujarSueloInterior(G){
  ctx.fillStyle = PAT_SUELO || patron('madera') || '#5a3d26'; ctx.fillRect(0, 0, G.w, G.h);
  ctx.fillStyle = 'rgba(40,20,5,.12)'; ctx.fillRect(0, 0, G.w, G.h);
  if (G.alfombras) G.alfombras.forEach(dibujarMueble);
}
function dibujarPuertaInterior(G){
  const yb = G.h - T;
  ctx.fillStyle = '#3a2214'; ctx.fillRect(G.puerta - T + 8, yb, 2 * T - 16, T);
  ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(G.puerta + 20, yb + 22, 3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6b1f2a'; ctx.fillRect(G.puerta - T + 10, yb - .45 * T, 2 * T - 20, 14);
}
function dibujarPosadaInt(t){
  const G = E;
  dibujarSueloInterior(G);
  dibujarParedInterior(G, 'madera');
  dibujarPuertaInterior(G);
}
function dibujarTiendaInt(t){
  const G = E;
  dibujarSueloInterior(G);
  dibujarParedInterior(G, 'piedra');
  dibujarPuertaInterior(G);
}

