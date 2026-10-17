// =====================================================
//  MONTURA: el jabalí (el mismo de los portales, domado y con silla)
//  Solo en la ciudad: en los portales y dentro de los edificios se va a pie, y al salir se vuelve a montar solo.
// =====================================================
const VEL_MONTURA = 1.6;
const enMontura = () => !!(P && P.montura && E && E.tipo === 'ciudad' && P.hp > 0);
function toggleMontura(){
  if (!enJuego || pantallaActual || !P) return;
  if (E.tipo !== 'ciudad' && !P.montura){ texto(P.x, P.y - 74, 'El jabalí solo se puede montar en la ciudad', '#9a91c2', 14); return; }
  P.montura = !P.montura;
  PJ.montado = P.montura;
  sfx(P.montura ? 'montar' : 'click');
  chispas(P.x, P.y + 6, '#c8a878', 14, 120);
  texto(P.x, P.y - 90, P.montura ? `Montas: ${montura().n}` : 'Te bajas de la montura', '#ffd76a', 14);
  $('btnMontura').setAttribute('aria-pressed', P.montura);
}
// el ratón no cabe en el jabalí: al montar se guarda y al bajar (o al entrar en un edificio o un portal) vuelve solo
function ratonYMontura(){
  const ahora = enMontura();
  if (ahora === !!P.montAnt) return;
  P.montAnt = ahora;
  if (ahora){
    if (M){ chispas(M.x, M.y - 15, '#b9a3ff', 14, 120); M = null; P.ratonGuardado = true; }   // PJ.mascotaActiva sigue igual: al bajar vuelve
  } else if (P.ratonGuardado){
    P.ratonGuardado = false;
    if (PJ.mascota && !M){ invocarMascota(true); M.x = P.x - 30; M.y = P.y + 10; colisiones(M); chispas(M.x, M.y - 15, '#b9a3ff', 14, 120); }
  }
}
// silueta de cada cuadro del jabalí (una vez): dónde empieza el lomo (sin la cresta oscura) y dónde acaba la barriga
const PERFIL_JAB = new Map();
function perfilJabali(idx){
  if (PERFIL_JAB.has(idx)) return PERFIL_JAB.get(idx);
  const [sx, sy, w, h] = MON.cuadros[idx];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const a = c.getContext('2d', { willReadFrequently:true }); a.drawImage(MON_IMG, sx, sy, w, h, 0, 0, w, h);
  const d = a.getImageData(0, 0, w, h).data, lomo = [], panza = [];
  for (let x = 0; x < w; x++){
    lomo[x] = -1; panza[x] = -1;
    // el lomo empieza donde hay tres píxeles claros de cuerpo seguidos (la cresta es más oscura y tiene brillos sueltos)
    const claro = y => { const k = (y * w + x) * 4; return d[k + 3] > 127 && d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11 > 110; };
    for (let y = 0; y < h - 2; y++) if (claro(y) && claro(y + 1) && claro(y + 2)){ lomo[x] = y; break; }
    for (let y = h - 1; y >= 0; y--){ if (d[(y * w + x) * 4 + 3] > 127){ panza[x] = y; break; } }
  }
  const r = { w, h, lomo, panza }; PERFIL_JAB.set(idx, r); return r;
}
// de los cuadros de caminar de lado, el de las piernas juntas (paso intermedio): visto de lado es una sola pierna
const CUADRO_JINETE = new Map();
function cuadroJinete(){
  const clave = PJ.gato + '|' + (PJ.tinte || '');
  if (CUADRO_JINETE.has(clave)) return CUADRO_JINETE.get(clave);
  const lista = GATOS_DIR[PJ.gato].lado; let mejor = lista[0], min = 1e9;
  for (const fr of lista){
    const [sx, sy, w, h] = fr, c = document.createElement('canvas'); c.width = w; c.height = h;
    const a = c.getContext('2d', { willReadFrequently:true }); a.drawImage(hojaJugador(), sx, sy, w, h, 0, 0, w, h);
    const d = a.getImageData(0, Math.round(h * .8), w, h - Math.round(h * .8)).data;
    let x0 = w, x1 = -1;
    for (let k = 0; k < d.length; k += 4) if (d[k + 3] > 127){ const x = (k / 4) % w; if (x < x0) x0 = x; if (x > x1) x1 = x; }
    if (x1 - x0 < min){ min = x1 - x0; mejor = fr; }
  }
  // la pierna de ese cuadro: dónde está (columnas) y de qué color es el pantalón (lo más repetido, sin el contorno)
  const [sx, sy, w, h] = mejor, hr = Math.round(h * .74), c = document.createElement('canvas'); c.width = w; c.height = h;
  const a = c.getContext('2d', { willReadFrequently:true }); a.drawImage(hojaJugador(), sx, sy, w, h, 0, 0, w, h);
  const d = a.getImageData(0, 0, w, h).data, n = {}, nz = {};
  let px0 = w, px1 = -1, col = '#333', m = 0, zap = '#333', mz = 0;
  for (let y = hr; y < h; y++) for (let x = 0; x < w; x++){
    const k = (y * w + x) * 4; if (d[k + 3] < 128) continue;
    if (y >= h - 6){ if (x < px0) px0 = x; if (x > px1) px1 = x; }   // las columnas de la pierna, por los pies (sin la cola)
    if (d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11 < 28) continue;
    const cc = `rgb(${d[k]},${d[k + 1]},${d[k + 2]})`;
    if (y >= h - 4){ nz[cc] = (nz[cc] || 0) + 1; if (nz[cc] > mz){ mz = nz[cc]; zap = cc; } continue; }   // el zapato
    if (y < hr + 2) continue;
    n[cc] = (n[cc] || 0) + 1; if (n[cc] > m){ m = n[cc]; col = cc; }
  }
  const r = { fr:mejor, hr, px0, px1, pantalon:col, zapato:zap };
  CUADRO_JINETE.set(clave, r); return r;
}
// el jinete completo, como en los juegos 2D de lado:
//  - el jabalí (al doble), con la cresta recortada a lo largo del lomo para que no tape al jinete
//  - una silla de verdad, del mismo tamaño de píxel que el gato: manta, faldón de cuero que cae por el costado,
//    asiento hundido, borrén trasero y cuerno delantero, todo siguiendo la curva del lomo
//  - el gato sentado: el cuerpo de la cadera para arriba y una sola pierna (la del lado que se ve), con muslo,
//    rodilla, espinilla y zapato sombreados con los colores de su ropa, y el pie en el estribo
// Todo se pinta mirando a la derecha y se refleja entero para ir a la izquierda. Devuelve dónde queda la cabeza.
const K_MONTURA = 2;
function dibujarJinete(t, mov, derecha, pie){
  if (!monListo) return pie - ALTO_GATO_PJ;
  const K = K_MONTURA, D = MON.tipos.jabali, lista = mov ? D.walk : D.idle;
  const idx = lista[(mov ? Math.floor(P.paso / 12) : Math.floor(t / 260)) % lista.length];
  const [bx, by] = MON.cuadros[idx], { w, h, lomo } = perfilJabali(idx);
  const X0 = Math.round(P.x) + (derecha ? -1 : 1) * Math.round(w * K / 2), Y0 = Math.round(pie + 4) - h * K;
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie + 2, w * K * .42, 10, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.imageSmoothingEnabled = false;
  ctx.translate(X0, Y0); if (!derecha) ctx.scale(-1, 1);
  const px = (x, y, a, b, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), a, b); };
  // línea del lomo suavizada (en píxeles del jabalí)
  const linea = x => { let a = 0, n = 0; for (let k = Math.round(x) - 2; k <= Math.round(x) + 2; k++) if (lomo[k] >= 0){ a += lomo[k]; n++; } return n ? a / n : h * .35; };
  let xa = 0, xb = w - 1; while (xa < w && lomo[xa] < 0) xa++; while (xb > 0 && lomo[xb] < 0) xb--;
  // --- el jabalí, con la cresta corta ---
  ctx.save(); ctx.scale(K, K);
  ctx.beginPath(); ctx.rect(-4, -60, w + 8, h + 70);
  ctx.moveTo(xa, -60); for (let x = xa; x <= xb; x++) ctx.lineTo(x, linea(x) - 3); ctx.lineTo(xb + 1, -60); ctx.closePath();
  ctx.clip('evenodd');
  ctx.drawImage(hojaMontura(PJ.monturaSel), bx, by, w, h, 0, 0, w, h);
  ctx.restore();
  // --- la silla, en píxeles de pantalla; (0,0) es el centro del asiento ---
  const sc = Math.round(w * .44), aX = sc * K, aY = Math.round((linea(sc) - 1) * K);
  const yb = x => Math.round((linea((aX + x) / K) - 1) * K) - aY;   // altura del lomo bajo cada columna
  const O = '#120a0e', CUERO = '#7a4420', CUERO_C = '#a2602c', CUERO_O = '#4e2812';
  ctx.save(); ctx.translate(aX, aY);
  // manta: asoma por delante y por detrás de la silla
  for (let x = -19; x <= 17; x++){ const y = yb(x); px(x, y - 1, 1, 8, O); }
  for (let x = -18; x <= 16; x++){ const y = yb(x); px(x, y, 1, 5, '#a01c28'); px(x, y + 5, 1, 1, '#e8b84a'); if (x % 3 === 0) px(x, y + 6, 1, 1, '#e8b84a'); }
  // faldón de cuero que cae por el costado (esquinas redondeadas y costura)
  for (let x = -12; x <= 9; x++){
    const y = yb(x), alto = 12 - (x === -12 || x === 9 ? 2 : x === -11 || x === 8 ? 1 : 0);
    px(x, y - 1, 1, alto + 2, O);
  }
  for (let x = -11; x <= 8; x++){
    const y = yb(x), alto = 12 - (x === -11 || x === 8 ? 1 : 0);
    px(x, y, 1, alto, CUERO); px(x, y + alto - 1, 1, 1, CUERO_O);
    if (x > -10 && x < 7 && x % 2 === 0) px(x, y + alto - 3, 1, 1, '#d8a060');   // costura
  }
  // asiento: hundido en el centro, con el borrén trasero alto y curvo
  for (let x = -12; x <= 8; x++){ const y = yb(x) - 3 + (Math.abs(x + 2) < 5 ? 1 : 0); px(x, y - 1, 1, 4, O); px(x, y, 1, 2, CUERO_C); }
  const yc = yb(-13);
  px(-16, yc - 9, 4, 10, O); px(-15, yc - 8, 2, 8, CUERO); px(-15, yc - 8, 1, 7, CUERO_C); px(-13, yc - 4, 2, 4, CUERO);
  // cuerno delantero
  const yh = yb(9);
  px(8, yh - 9, 4, 9, O); px(9, yh - 8, 2, 7, CUERO); px(7, yh - 10, 6, 3, O); px(8, yh - 9, 4, 1, CUERO_C);
  // --- el gato: cuerpo de la cadera para arriba ---
  const J = cuadroJinete(), fr = J.fr, [sx, sy, fw, fh, ax, ay] = fr, esc = escGato(PJ.gato, ALTO_GATO_PJ / 96);
  const yCad = yb(0) - 2, equipoJ = { ...PJ.equipo, arma:null };   // a caballo, sin el arma en la mano (flotaría)
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 400, 400 + yCad); ctx.clip();
  ctx.translate(-2, yCad - J.hr * esc + fh * esc); ctx.scale(-1, 1);   // el dibujo del gato mira a la izquierda
  ctx.drawImage(hojaJugador(), sx, sy, fw, fh, -ax * esc, -ay * esc, fw * esc, fh * esc);
  dibujarEquipoGato(ctx, imgGato(PJ.gato), fr, 'lado', esc, equipoJ, 'frente');
  ctx.restore();
  // --- la pierna del lado que se ve ---
  const PN = J.pantalon, ZP = J.zapato, Y = yCad;
  // correa del estribo (por detrás de la pierna)
  px(4, yb(4) + 6, 2, Y + 15 - yb(4) - 6, CUERO_O);
  // contornos: muslo, rodilla, espinilla y zapato
  px(-4, Y - 2, 12, 7, O); px(5, Y - 1, 6, 9, O); px(4, Y + 4, 7, 11, O); px(3, Y + 12, 11, 6, O);
  // muslo (redondeado), con brillo arriba y sombra abajo
  px(-3, Y - 1, 10, 5, PN); px(-3, Y - 1, 10, 1, 'rgba(255,255,255,.22)'); px(-3, Y + 3, 9, 1, 'rgba(0,0,0,.28)');
  // rodilla y espinilla
  px(6, Y, 4, 7, PN); px(9, Y + 1, 1, 5, 'rgba(255,255,255,.18)');
  px(5, Y + 5, 5, 9, PN); px(5, Y + 5, 1, 9, 'rgba(0,0,0,.25)');
  // zapato con la punta hacia delante y la suela clara
  px(4, Y + 13, 9, 3, ZP); px(12, Y + 14, 1, 2, ZP); px(4, Y + 13, 9, 1, 'rgba(255,255,255,.25)'); px(4, Y + 16, 9, 1, '#e8e4dc');
  // estribo de hierro bajo la suela
  px(2, Y + 17, 12, 2, O); px(3, Y + 17, 10, 1, '#c8c8d8'); px(2, Y + 14, 1, 3, '#9a9aa8'); px(13, Y + 14, 1, 3, '#9a9aa8');
  ctx.restore();
  ctx.restore();
  return Y0 + aY + yCad - J.hr * esc;
}

