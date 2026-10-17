// =====================================================
//  MONSTRUOS (sprites animados)
// =====================================================
const MON = {"cuadros": [[2, 2, 79, 66], [83, 2, 78, 65], [163, 2, 75, 64], [240, 2, 79, 65], [321, 2, 93, 57], [416, 2, 75, 70], [493, 2, 67, 57], [562, 2, 71, 38], [635, 2, 94, 62], [731, 2, 94, 61], [827, 2, 85, 61], [914, 2, 85, 61], [2, 74, 70, 59], [74, 74, 116, 66], [192, 74, 81, 65], [275, 74, 101, 40], [378, 74, 44, 44], [424, 74, 40, 48], [466, 74, 44, 44], [512, 74, 48, 40], [562, 74, 72, 60], [636, 74, 64, 52], [702, 74, 74, 48], [778, 74, 58, 46], [838, 74, 96, 48], [2, 142, 90, 50], [94, 142, 91, 48], [187, 142, 97, 48], [286, 142, 90, 49], [378, 142, 82, 49], [462, 142, 85, 48], [549, 142, 85, 48], [636, 142, 85, 48], [723, 142, 93, 48], [818, 142, 88, 49], [908, 142, 84, 68], [2, 212, 95, 77], [99, 212, 91, 57], [192, 212, 100, 48], [294, 212, 104, 49], [400, 212, 77, 49], [479, 212, 65, 55], [546, 212, 62, 52], [610, 212, 61, 62], [673, 212, 61, 67], [736, 212, 68, 57], [806, 212, 68, 55], [2, 291, 233, 152], [237, 291, 61, 59], [300, 291, 64, 59], [366, 291, 60, 58], [428, 291, 64, 58], [494, 291, 64, 60], [560, 291, 65, 58], [627, 291, 66, 55], [695, 291, 68, 54], [765, 291, 62, 60], [829, 291, 63, 61], [894, 291, 63, 62], [2, 445, 64, 61], [68, 445, 63, 61], [133, 445, 65, 61], [200, 445, 66, 61], [268, 445, 64, 60], [334, 445, 177, 132]], "tipos": {"mantis": {"mira": -1, "walk": [0, 1, 2, 3], "atk": [4, 5], "muere": [6, 7]}, "escorpion": {"mira": -1, "walk": [8, 9, 10, 11], "atk": [12, 13], "muere": [14, 15]}, "slime": {"mira": 0, "walk": [16, 17, 18, 19], "atk": [20, 21], "muere": [22, 23, 24, 25]}, "arana": {"mira": 1, "walk": [26, 27, 28, 29, 30, 31, 32, 33], "atk": [34, 35, 36, 37, 38, 39], "muere": [40, 41, 42, 43, 44, 45, 46]}, "arana_jefe": 47, "jabali": {"mira": 1, "idle": [48, 49, 50, 51], "walk": [56, 57, 58, 59, 60, 61, 62, 63], "atk": [52, 53, 54, 55], "muere": [55]}, "jabali_jefe": 64}};
const MON_IMG = new Image();
let monListo = false;
MON_IMG.onload = () => monListo = true;
MON_IMG.src = 'img/monstruos/monstruos.png?v=' + VERSION;
const JEFE_SPR = ['slime', 'jabali', 'mantis', 'arana', 'arana', 'mantis'];
let cadaveres = [];
function sprDe(e){ return e.jefe ? JEFE_SPR[E.rango] : (ENEM[e.tipo] && ENEM[e.tipo].spr); }
function altoDe(e){
  const n = sprDe(e);
  if (e.jefe) return n === 'slime' ? 110 : n === 'jabali' ? 130 : 150;
  return ENEM[e.tipo].alto;
}
function pintarMonstruo(n, idx, x, pie, alto, ref, flip, flash, brillo){
  // pixel art: cada cuadro ya está al tamaño con que se ve; los jefes se agrandan a escala entera
  const [sx, sy, w, h] = MON.cuadros[idx], k = Math.max(1, Math.round(alto / ref));
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(x), Math.round(pie)); if (flip) ctx.scale(-1, 1);
  if (brillo){ ctx.shadowColor = brillo; ctx.shadowBlur = 22; }
  ctx.drawImage(MON_IMG, sx, sy, w, h, -Math.round(w * k / 2), -h * k, w * k, h * k);
  ctx.shadowBlur = 0;
  if (flash > 0){ ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, flash * 6) * .7; ctx.drawImage(MON_IMG, sx, sy, w, h, -Math.round(w * k / 2), -h * k, w * k, h * k); }
  ctx.restore();
  return h * k;
}
function dibujarEnemigo(e){
  const n = sprDe(e);
  if (!monListo || !n) return dibujarEnemigoViejo(e);
  if (AVISOS_ATAQUE && e.jefe && e.aviso > 0){
    ctx.strokeStyle = 'rgba(226,68,92,.45)'; ctx.lineWidth = e.r * 1.6;
    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.cdir) * 340, e.y + Math.sin(e.cdir) * 340); ctx.stroke();
  }
  const D = MON.tipos[n], t = performance.now();
  // hacia dónde mira según su movimiento
  if (e.ux === undefined){ e.ux = e.x; e.face = 1; }
  const dx = e.x - e.ux; if (Math.abs(dx) > .4) e.face = dx > 0 ? 1 : -1; e.ux = e.x;
  const mira = (e.jefe && n === 'jabali') ? -1 : D.mira;
  const flip = mira !== 0 && e.face !== mira;
  dibujarAviso(e);
  const pie = e.y + e.r * .8;
  ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 1.25, e.r * .45, 0, 0, TAU); ctx.fill();
  // aura de la fase: más grande y roja cuanto más enfadado está el jefe
  if (e.jefe && e.fase > 1){
    const pul = 1 + .1 * Math.sin(t / (e.fase > 2 ? 90 : 160));
    ctx.strokeStyle = e.fase > 2 ? 'rgba(255,60,80,.8)' : 'rgba(255,170,60,.7)'; ctx.lineWidth = e.fase > 2 ? 4 : 3;
    ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 1.6 * pul, e.r * .6 * pul, 0, 0, TAU); ctx.stroke();
    if (e.rugido > 0){ ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 2.2, e.r * .8, 0, 0, TAU); ctx.fill(); }
  }
  if (e.lento > 0){ ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 1.4, e.r * .55, 0, 0, TAU); ctx.stroke(); }
  const cerca = Math.hypot(P.x - e.x, P.y - e.y) < e.r + P.r + 26;
  const lista = e.at ? D.atk : (D.idle && !e.mueve) ? D.idle : D.walk;
  const idx = (e.jefe && n === 'arana') ? MON.tipos.arana_jefe : (e.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : lista[(Math.floor(t / (cerca ? 160 : 130) + (e.hx || 0) * .01) % lista.length + lista.length) % lista.length];
  const ref = MON.cuadros[(e.jefe && n === 'arana') ? MON.tipos.arana_jefe : (e.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : D.walk[0]][3];
  const alto = pintarMonstruo(n, idx, e.x, pie, altoDe(e), ref, flip, e.flash, e.jefe ? e.color : null);
  placaEnemigo(e, pie - alto);
}
// placa de vida sobre el enemigo (estilo WoW, tecla V): nombre y barra en píxeles; la del objetivo resalta
function placaEnemigo(e, tope){
  const obj = e === P.objetivo;
  if (!VER_PLACAS && !obj){
    if (e.jefe || e.hp >= e.maxHp) return;
    const bw = Math.max(26, e.r * 2.2), by = Math.round(tope - 8);
    ctx.fillStyle = '#2a2148'; ctx.fillRect(Math.round(e.x - bw / 2), by, Math.round(bw), 4);
    ctx.fillStyle = '#e2445c'; ctx.fillRect(Math.round(e.x - bw / 2), by, Math.round(bw * Math.max(0, e.hp / e.maxHp)), 4);
    return;
  }
  if (!obj && !e.aggro && Math.hypot(e.x - P.x, e.y - P.y) > 420) return;
  const w = e.jefe ? 90 : 56, h = obj ? 7 : 5, x = Math.round(e.x - w / 2), y = Math.round(tope - 12 - h);
  ctx.globalAlpha = obj || e.aggro ? 1 : .75;
  ctx.fillStyle = obj ? '#ffffff' : '#000000'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#2a0c10'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = e.aggro ? '#d8283c' : '#d8b02c'; ctx.fillRect(x, y, Math.round(w * Math.max(0, e.hp / e.maxHp)), h);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x, y, Math.round(w * Math.max(0, e.hp / e.maxHp)), 1);
  rotulo(e.nombre, e.x, y - 3, `700 ${obj ? 12 : 11}px Rajdhani, sans-serif`, obj ? '#ffffff' : (e.aggro ? '#ff8a8a' : '#ffe08a'), 'rgba(0,0,0,.85)', 3);
  ctx.globalAlpha = 1;
}
function dibujarCadaver(c){
  const D = MON.tipos[c.n], edad = (performance.now() - c.t0) / 1000;
  const lista = D.muere, idx = lista[Math.min(lista.length - 1, Math.floor(edad / .14))];
  ctx.globalAlpha = Math.max(0, 1 - Math.max(0, edad - .7) / .4);
  pintarMonstruo(c.n, idx, c.x, c.pie, c.alto, c.ref, c.flip, 0, null);
  ctx.globalAlpha = 1;
}

function dibujarEnemigoViejo(e){
  if (AVISOS_ATAQUE && e.jefe && e.aviso > 0){
    ctx.strokeStyle = 'rgba(226,68,92,.45)'; ctx.lineWidth = e.r * 1.6;
    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.cdir) * 340, e.y + Math.sin(e.cdir) * 340); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(e.x + 3, e.y + e.r * .7, e.r, e.r * .45, 0, 0, TAU); ctx.fill();
  if (e.jefe){ ctx.shadowColor = e.color; ctx.shadowBlur = 25; }
  ctx.fillStyle = e.flash > 0 ? '#ffffff' : e.color;
  ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  if (e.lento > 0){ ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 2; ctx.stroke(); }
  const a = e.aggro ? Math.atan2(P.y - e.y, P.x - e.x) : Math.atan2((e.wy - e.y) || 1, e.wx - e.x || 0);
  const ox = Math.cos(a), oy = Math.sin(a), er = Math.max(2, e.r * .16);
  ctx.fillStyle = e.aggro ? '#ff5050' : '#20182e';
  ctx.beginPath();
  ctx.arc(e.x + ox * e.r * .5 - oy * e.r * .32, e.y + oy * e.r * .5 + ox * e.r * .32, er, 0, TAU);
  ctx.arc(e.x + ox * e.r * .5 + oy * e.r * .32, e.y + oy * e.r * .5 - ox * e.r * .32, er, 0, TAU);
  ctx.fill();
  if (!e.jefe && e.hp < e.maxHp){
    ctx.fillStyle = '#2a2148'; ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2, 4);
    ctx.fillStyle = '#e2445c'; ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2 * Math.max(0, e.hp / e.maxHp), 4);
  }
}

const CARTEL = {};
function dibujarMinimapa(){
  const bajo = H < 500; // teléfono acostado: minimapa más chico para dejar ver el mundo
  const s = bajo ? 92 : W < 600 ? 104 : 140, r = s / 2, cx = W - r - (bajo ? 10 : 16);
  const cy = INSET + (esTactil ? (bajo ? 74 : 84) : 30) + r;
  const nombre = E.tipo === 'mazmorra' && !E.tutorial ? `Rango ${E.R.l}: ${E.R.tema}` : E.nombre;
  const colorZona = E.tipo === 'mazmorra' ? E.R.color : '#ffd76a';
  // placa con el nombre de la zona
  ctx.font = '15px Marcellus, Georgia, serif'; ctx.textAlign = 'center';
  // la placa nunca se sale de la pantalla: se corre hacia dentro y, si hace falta, se achica la letra
  const izq = W < 600 ? 244 : 8; // a la derecha del marco del jugador en pantallas chicas
  const claveCartel = nombre + '|' + W + '|' + fuentesListas;
  if (CARTEL.clave !== claveCartel){
    let fs = 15, tw = ctx.measureText(nombre).width + 24;
    while (tw > W - izq - 8 && fs > 9){ fs--; ctx.font = `${fs}px Marcellus, Georgia, serif`; tw = ctx.measureText(nombre).width + 16; }
    Object.assign(CARTEL, { clave:claveCartel, fs, tw });
  }
  const fs = CARTEL.fs, tw = CARTEL.tw; ctx.font = `${fs}px Marcellus, Georgia, serif`;
  const pxp = clamp(cx, izq + tw / 2, W - tw / 2 - 8);
  MINI.cx = cx; MINI.cy = cy; MINI.r = r; MINI.px = pxp; MINI.tw = tw; MINI.ok = true;
  ctx.fillStyle = 'rgba(15,11,28,.85)'; ctx.fillRect(pxp - tw / 2, cy - r - 24, tw, 20);
  ctx.strokeStyle = '#b8933f'; ctx.lineWidth = 1; ctx.strokeRect(pxp - tw / 2 + .5, cy - r - 23.5, tw - 1, 19);
  ctx.fillStyle = colorZona; ctx.fillText(nombre, pxp, cy - r - 9);
  if (esInterior()) return;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.fillStyle = 'rgba(12,8,25,.95)'; ctx.fillRect(cx - r, cy - r, s, s);
  const pcx = P.x / T, pcy = P.y / T;
  if (E.tipo === 'ciudad'){
    const k = 3.2, mx = wx => cx + (wx / T - pcx) * k, my = wy => cy + (wy / T - pcy) * k;
    ctx.fillStyle = '#2c4a2c'; ctx.fillRect(mx(0), my(0), E.cols * k, E.rows * k);
    ctx.fillStyle = '#5a5470';
    ctx.fillRect(mx(T), my(8 * T), (E.cols - 2) * k, 3 * k); ctx.fillRect(mx(T), my(20 * T), (E.cols - 2) * k, 3 * k);
    ctx.fillStyle = '#8a8478'; ctx.fillRect(mx(18.5 * T), my(11 * T), 3 * k, 9 * k); ctx.fillRect(mx(18.5 * T), my(23 * T), 3 * k, 6 * k);
    ctx.beginPath(); ctx.arc(mx(E.fuente.x), my(E.fuente.y), 212 / T * k, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7a6a4a';
    for (const b of E.edificios) ctx.fillRect(mx(b.x * T), my(b.y * T), b.w * k, b.h * k);
    const po = E.edificios[0]; ctx.fillStyle = '#f2c46d'; ctx.fillRect(mx(po.x * T), my(po.y * T), po.w * k, po.h * k);
    ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(mx(E.fuente.x), my(E.fuente.y), 5, 0, TAU); ctx.fill();
    for (const n of E.npcs || []){ const mk = marcaNPC(n); if (!mk) continue; ctx.fillStyle = mk.col; ctx.font = '900 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(mk.c, mx(n.x), my(n.y) + 4); }
    for (const p of portales){ ctx.fillStyle = RANGOS[p.rango].color; ctx.beginPath(); ctx.arc(mx(p.x), my(p.y), 4.5, 0, TAU); ctx.fill(); }
  } else {
    const k = 4;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(E.mini, cx - pcx * k, cy - pcy * k, E.cols * k, E.rows * k);
    ctx.imageSmoothingEnabled = true;
    const punto = (wx, wy, c, rr) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + (wx / T - pcx) * k, cy + (wy / T - pcy) * k, rr, 0, TAU); ctx.fill(); };
    if (E.salida) punto(E.salida.x, E.salida.y, '#9b7bff', 4);
    if (jefeVivo && E.jefeVisto) punto(jefeVivo.x, jefeVivo.y, '#e2445c', 5);
    if (E.portalFinal) punto(E.portalFinal.x, E.portalFinal.y, '#f2c46d', 5);
    for (const e of enemigos) if (!e.jefe && e.aggro) punto(e.x, e.y, '#ff6b6b', 2);
  }
  // flecha del jugador
  const a = Math.atan2(P.ldy, P.ldx);
  ctx.fillStyle = '#ffffff'; ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 7);
  ctx.lineTo(cx + Math.cos(a + 2.5) * 5, cy + Math.sin(a + 2.5) * 5);
  ctx.lineTo(cx + Math.cos(a - 2.5) * 5, cy + Math.sin(a - 2.5) * 5); ctx.fill();
  ctx.restore();
  // aro dorado
  ctx.strokeStyle = '#120c1a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#b8933f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, TAU); ctx.stroke();
  if (E.tipo === 'mazmorra'){
    ctx.font = '600 13px Rajdhani, sans-serif'; ctx.fillStyle = '#000'; ctx.fillText(E.despejada ? 'Despejada' : `${enemigos.length} monstruos`, cx + 1, cy + r + 19);
    ctx.fillStyle = '#c9c2e6'; ctx.fillText(E.despejada ? 'Despejada' : `${enemigos.length} monstruos`, cx, cy + r + 18);
  }
}

