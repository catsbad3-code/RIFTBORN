// =====================================================
//  SPRITES DEL PERSONAJE
// =====================================================
const ATLAS = {"idle0":[0,0,59,127,33.5,125.0],"idle1":[61,0,60,127,31.5,126.0],"idle2":[123,0,59,127,30.0,126.0],"idle3":[184,0,52,128,28.0,127.0],"arriba":[238,0,53,102,26.0,100.0],"abajo":[293,0,49,103,23.5,101.0],"izq":[344,0,38,103,17.5,101.0],"der":[384,0,37,103,16.5,101.0],"walk0":[423,0,73,111,38.5,110.0],"walk1":[498,0,71,111,30.0,110.0],"walk2":[571,0,74,110,37.5,109.0],"walk3":[647,0,82,109,34.0,109.0],"walk4":[731,0,82,109,33.5,108.0],"walk5":[815,0,88,107,37.0,107.0],"walk6":[905,0,72,104,35.5,103.0],"atk0":[0,130,91,117,42.0,117.0],"atk1":[93,130,86,114,34.0,113.0],"atk2":[181,130,63,111,32.5,110.0],"atk3":[246,130,84,104,42.5,103.0],"cast":[332,130,57,101,28.0,99.0],"invocar":[391,130,49,100,23.5,98.0],"rayo":[442,130,217,41,207,20.5],"bola":[661,130,79,92,39.5,46.0],"mano":[742,130,56,47,4,23.5],"luna":[800,130,96,35,48.0,17.5],"ola":[0,249,105,75,52.5,37.5],"domo":[107,249,174,82,87.0,82],"tp":[283,249,119,159,59.5,159],"soldado":[404,249,144,168,72.0,168],"lluvia":[550,249,186,166,93.0,166],"corte":[738,249,45,33,22.5,16.5],"pilar":[785,249,97,91,48.5,91]};
const SPR = new Image();
let spriteListo = false;
SPR.onload = () => { spriteListo = true; alCargar(dibujarAvatar); };
SPR.src = 'img/efectos/spr.png';
const grupoDe = n => ['arriba','abajo','izq','der'].includes(n) ? 'dir' : n.replace(/\d+$/, '');
const EFECTOS_SPR = ['rayo','bola','mano','luna','ola','domo','tp','soldado','lluvia','corte','pilar'];
const ALTO_GRUPO = {};
for (const [n, f] of Object.entries(ATLAS)){ if (EFECTOS_SPR.includes(n)) continue; const g = grupoDe(n); ALTO_GRUPO[g] = Math.max(ALTO_GRUPO[g] || 0, f[3]); }
const ALTO_PJ = 66;
const DUR_ATK = .48; // duración de la animación de ataque

function dibujarFrame(n, x, y, esc, flip, rot = 0){
  const [sx, sy, w, h, ax, ay] = ATLAS[n];
  ctx.save(); ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(SPR, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  ctx.restore();
}

let hOroPrev = -1, hPocPrev = -1;
const MONEDAS_IMG = new Image();
MONEDAS_IMG.src = 'img/interfaz/ui-1.png';
function dibujarAvatar(){
  const av = $('avatar'), a = av.getContext('2d');
  a.clearRect(0, 0, av.width, av.height);
  const g = a.createRadialGradient(56, 40, 6, 56, 56, 70);
  g.addColorStop(0, PJ ? CLASES[PJ.clase].color : '#7b4dff'); g.addColorStop(1, '#120d24');
  a.fillStyle = g; a.fillRect(0, 0, av.width, av.height);
  if (!gatosListo || !PJ){ document.addEventListener('gatoslistos', dibujarAvatar, { once:true }); return; }
  // cabeza del gato
  const [sx, sy, w] = cuadroGato(PJ.gato, GATOS_DIR[PJ.gato].q_ab ? 'q_ab' : 'ab', 0), lado = Math.min(w, Math.round(70 / (GATOS_DIR[PJ.gato].k || 1)));
  a.imageSmoothingEnabled = !gatoPx(PJ.gato);
  a.drawImage(hojaJugador(), sx + (w - lado) / 2, sy, lado, lado, 4, 8, 104, 104);
}

const ALTO_GATO_PJ = 62;
// dir: 'ab' de frente, 'ar' de espalda, 'lado'. Si un gato no tiene una vista, usa la más parecida.
function cuadroGato(tipo, dir, i){
  const g = GATOS_DIR[tipo];
  let set = g[dir];
  if (!set || !set.length) set = dir === 'ar' ? (g.lado.length ? g.lado : g.ab) : g.ab;
  return set[((i % set.length) + set.length) % set.length];
}
// =====================================================
//  EQUIPO VISIBLE (pixel art dibujado píxel a píxel)
// =====================================================
// o contorno, W/S hoja clara/oscura, G/g oro, H mango, B/b madera, P páginas, R color de la rareza, r rareza oscura
const EQ_PIX = {
  Espada:   { agarre:15, filas:['...o...','..oWo..','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','ooGRGoo','oGGGGGo','.oogoo.','..oHo..','..oHo..','..oGo..','...o...'] },
  Daga:     { agarre:8,  filas:['..o..','.oWo.','.oWSo','.oWSo','.oWSo','oGRGo','.oHo.','.oHo.','.oGo.','..o..'] },
  Báculo:   { agarre:14, filas:['..ooo..','.oRRWo.','oRRRRWo','oRRRRRo','orRRRro','.orrro.','..oBo..','..oBo..','..oBo..','..obo..','..oBo..','..oBo..','..oBo..','..obo..','..oBo..','..oBo..','..oBo..','..obo..','...o...'] },
  Arco:     { agarre:9,  filas:['.oo.....','.WoRo...','.W.oBo..','.W.oBo..','.W..oBo.','.W..oBo.','.W...oBo','.W...oBo','.W...oHo','.W...oHo','.W...oHo','.W...oBo','.W...oBo','.W..oBo.','.W..oBo.','.W.oBo..','.W.oBo..','.WoRo...','.oo.....'] },
  Grimorio: { agarre:4,  filas:['ooooooooo','oRRRRRRRo','oRRGGGRRo','oRRGrGRRo','oRRGGGRRo','oRRRRRRRo','oPPPPPPPo','ooooooooo'] },
  Yelmo:    { filas:['......oooooo......','....ooSSSSSSoo....','...oSWWWWWWWSSo...','..oSWWWWWWWWWSSo..','.oSWWWWWWWWWWWSSo.','.oSSSSSSSSSSSSSSo.','oGGGGGGGRRGGGGGGGo','oooooooooooooooooo'] },
  Diadema:  { filas:['o.....o.....o','Go...oRo...oG','oGo.oGGGo.oGo','oGGGGGGGGGGGo','oGRGGGRGGGRGo','ooooooooooooo'] },
  Calabaza: { filas:['.......gg.......','......g.........','..oooooooooooo..','.oOOOOOOOOOOOOo.','oOOyyOOOOOOyyOOo','oOOOyyOOOOyyOOOo','oOOOOOOOOOOOOOOo','oOOyOyyOOyyOyOOo','.oOOyyyyyyyyOOo.','..oooooooooooo..'] },
  Gorro:    { filas:['...........WW...','..........WWW...','........orrro...','......orrrro....','.....orrrrro....','....orrrrrrro...','...orrrrrrrrro..','..WWWWWWWWWWWWW.','.WWWWWWWWWWWWWWW'] },
  Capucha:  { filas:['.........oo......','........oRRo.....','.......oRRRo.....','......oRRRRo.....','.....oRRRRRRo....','....oRRRRRRRo....','...oRRRRRRRRRo...','...oRRRRRRRRRo...','..oGGGGGGGGGGGo..','.orRRRRRRRRRRRro.','ooooooooooooooooo'] }
};
const EQ_COL = { O:'#ff8a1e', y:'#ffe25a', r:'#d8283c', o:'#1a1210', W:'#eef2f6', S:'#9aa6b4', G:'#e8b84a', g:'#9a6a1c', H:'#6b3f1f', B:'#8a5a2b', b:'#5a3816', P:'#efe3c4' };
const EQ_CACHE = new Map();
function pixEquipo(base, rareza){
  const clave = base + rareza;
  if (EQ_CACHE.has(clave)) return EQ_CACHE.get(clave);
  const def = EQ_PIX[base], filas = def.filas, w = Math.max(...filas.map(f => f.length));
  const c = document.createElement('canvas'); c.width = w; c.height = filas.length;
  const a = c.getContext('2d'), R = RAREZAS[rareza] ? RAREZAS[rareza].c : '#9a9a9a';
  // rareza oscura: el mismo color a media luz
  const r = '#' + [1, 3, 5].map(i => Math.round(parseInt(R.slice(i, i + 2), 16) * .55).toString(16).padStart(2, '0')).join('');
  filas.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === '.') return; a.fillStyle = ch === 'R' ? R : ch === 'r' ? r : EQ_COL[ch]; a.fillRect(x, y, 1, 1); }));
  const out = { c, w, h:filas.length, agarre:def.agarre || 0 };
  EQ_CACHE.set(clave, out);
  return out;
}
// tope de la cabeza de un cuadro (fila del primer píxel opaco en la columna del ancla), leído una vez
const TOPE_CACHE = new Map();
function topeCabeza(img, fr){
  const clave = img.src + '|' + fr[0] + ',' + fr[1];
  if (TOPE_CACHE.has(clave)) return TOPE_CACHE.get(clave);
  const [sx, sy, w, h, ax] = fr, c = document.createElement('canvas'); c.width = w; c.height = h;
  const a = c.getContext('2d'); a.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  const d = a.getImageData(0, 0, w, h).data, x = Math.round(ax);
  let y = 0;
  while (y < h && d[(y * w + x) * 4 + 3] < 128) y++;
  TOPE_CACHE.set(clave, y);
  return y;
}
const baseObjeto = o => o && Object.keys(EQ_PIX).find(b => o.nombre.startsWith(b));
// dibuja casco y arma alrededor del gato. El contexto ya está en los pies del gato (y reflejado si mira a la derecha).
// capa 'atras': lo que va detrás del cuerpo (arma en la espalda); 'frente': casco y arma en la mano
function dibujarEquipoGato(c, img, fr, set, esc, equipo, capa){
  if (!equipo || !img.complete) return;
  const [, , w, h, ax, ay] = fr, vista = set.replace('q_', '');
  const arma = equipo.arma, bArma = baseObjeto(arma), cab = equipo.cabeza, bCab = baseObjeto(cab);
  const pinta = (p, x, y) => c.drawImage(p.c, 0, 0, p.w, p.h, Math.round(x), Math.round(y), p.w * esc, p.h * esc);
  const arriba = -ay * esc, mano = arriba + Math.round(h * .74) * esc;
  if (bArma && ((capa === 'atras') === (vista === 'ar'))){
    const p = pixEquipo(bArma, arma.rareza);
    const x = vista === 'ab' ? (w - ax - 7) * esc : vista === 'ar' ? (-ax + 1) * esc - p.w * esc : 3 * esc;
    pinta(p, x, mano - p.agarre * esc);
  }
  if (bCab && capa === 'frente'){
    const p = pixEquipo(bCab, cab.rareza), tope = topeCabeza(img, fr);
    pinta(p, -Math.round(p.w / 2) * esc, arriba + (tope + 5) * esc - p.h * esc);
  }
}

// ---------- textos ya dibujados (rendimiento) ----------
// dibujar letras en el lienzo es caro: los nombres y números que se repiten se dibujan una vez en un lienzo chico y se reutilizan
const ROTULOS = new Map();
let fuentesListas = false;
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fuentesListas = true; ROTULOS.clear(); });
function rotulo(txt, x, y, font, fill, stroke = null, lw = 0, sombra = false){
  txt = String(txt);
  if (!fuentesListas){
    ctx.font = font; ctx.textAlign = 'center';
    if (sombra){ ctx.fillStyle = '#000'; ctx.fillText(txt, x + 1, y + 1); }
    if (stroke){ ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.strokeText(txt, x, y); }
    ctx.fillStyle = fill; ctx.fillText(txt, x, y); return;
  }
  const clave = txt + '|' + font + '|' + fill + '|' + stroke + '|' + lw + '|' + sombra + '|' + DPR;
  let r = ROTULOS.get(clave);
  if (!r){
    if (ROTULOS.size > 600) ROTULOS.clear();
    const m = document.createElement('canvas').getContext('2d'); m.font = font;
    const px = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)[1]), pad = Math.ceil(lw / 2) + 2;
    const w = Math.ceil(m.measureText(txt).width) + pad * 2 + 1, h = Math.ceil(px * 1.35) + pad * 2 + 1, base = pad + Math.ceil(px);
    const c = document.createElement('canvas'); c.width = Math.ceil(w * DPR); c.height = Math.ceil(h * DPR);
    const a = c.getContext('2d'); a.scale(DPR, DPR); a.font = font; a.textAlign = 'center'; a.lineJoin = 'miter';
    if (sombra){ a.fillStyle = '#000'; a.fillText(txt, w / 2 + 1, base + 1); }
    if (stroke){ a.lineWidth = lw; a.strokeStyle = stroke; a.strokeText(txt, w / 2, base); }
    a.fillStyle = fill; a.fillText(txt, w / 2, base);
    r = { c, w, h, base }; ROTULOS.set(clave, r);
  }
  const dx = Math.round((x - r.w / 2) * DPR) / DPR, dy = Math.round((y - r.base) * DPR) / DPR;
  ctx.drawImage(r.c, dx, dy, r.w, r.h);
}
// silueta blanca de una hoja de sprites (para el destello al recibir daño); se calcula una vez por imagen
const SILUETAS = new Map();
// silueta de un color (blanca para el destello al recibir un golpe). Se hace con composición y no con el filtro del
// lienzo, que Safari del iPhone no tiene
function siluetaBlanca(img, col = '#fff'){
  let m = SILUETAS.get(col); if (!m) SILUETAS.set(col, m = new Map());
  let c = m.get(img);
  if (!c && img.naturalWidth){
    c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const a = c.getContext('2d'); a.drawImage(img, 0, 0); a.globalCompositeOperation = 'source-in'; a.fillStyle = col; a.fillRect(0, 0, c.width, c.height);
    m.set(img, c);
  }
  return c || img;
}
// zarpazo en pixel art: tres garras que barren un arco delante del gato
function zarpazoPixel(x, y, ang, k, col){
  if (k <= .05 || k >= .95) return;
  const tam = 3, arco = 1.7, ini = ang - arco / 2;
  for (let g = 0; g < 3; g++){
    const r = 30 + g * 7, fin = ini + arco * Math.min(1, k * 1.6), desde = Math.max(ini, fin - .9);
    for (let a = desde; a <= fin; a += .07){
      const px = Math.round((x + Math.cos(a) * r) / tam) * tam, py = Math.round((y + Math.sin(a) * r * .6) / tam) * tam;
      const cola = (a - desde) / Math.max(.01, fin - desde);
      ctx.globalAlpha = Math.min(1, .35 + cola) * (k > .7 ? (1 - k) / .3 : 1);
      ctx.fillStyle = cola > .7 ? '#ffffff' : col;
      ctx.fillRect(px, py, tam, tam);
    }
  }
  ctx.globalAlpha = 1;
}
function dibujarJugador(t){
  if (P.inv > 0 && P.golpe > -0.25 && Math.floor(t / 60) % 2 && !gatoPx(PJ.gato)) return;
  const pie = P.y + 13;
  if (!gatosListo){
    ctx.fillStyle = '#120d24'; ctx.strokeStyle = CLASES[PJ.clase].color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(P.x, P.y, P.r, 0, TAU); ctx.fill(); ctx.stroke(); return;
  }
  const GD = GATOS_DIR[PJ.gato], escG = escGato(PJ.gato, ALTO_GATO_PJ / 96);
  // pixel art: caído es el cuadro de frente girado 90° (sin perder píxeles), con la cabeza a la izquierda
  if (P.hp <= 0 && GD.px){
    const [sx, sy, w, h] = GD.ab[0];
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(P.x), Math.round(pie - w * escG / 2)); ctx.rotate(-Math.PI / 2);
    ctx.drawImage(hojaJugador(), sx, sy, w, h, -w * escG / 2, -h * escG / 2, w * escG, h * escG);
    ctx.restore();
    return;
  }
  if (P.hp <= 0 && GD.muerto && GD.muerto.length){
    const [sx, sy, w, h, ax, ay] = GD.muerto[0];
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.drawImage(imgGato(PJ.gato), sx, sy, w, h, P.x - ax * escG, pie - ay * escG, w * escG, h * escG);
    return;
  }
  const mov = Math.hypot(P.mx, P.my) > .2, pose = P.pose.t > 0 ? P.pose.n : null;
  if (pose === 'oculto') return;
  // hacia dónde mira: al caminar, según el movimiento; al atacar, según donde apunta
  const dirDe = (vx, vy) => Math.abs(vy) > Math.abs(vx) * 1.15 ? (vy < 0 ? 'ar' : 'ab') : 'lado';
  // en diagonal no cambia de vista a cada rato: hace falta un giro claro para pasar de lado a frente/espalda o al revés
  if (mov){
    const ax = Math.abs(P.mx), ay = Math.abs(P.my);
    if (P.dirV === 'lado') { if (ay > ax * 1.5) P.dirV = P.my < 0 ? 'ar' : 'ab'; }
    else if (ax > ay * .9) P.dirV = 'lado';
    else P.dirV = P.my < 0 ? 'ar' : 'ab';
  }
  let dir = P.dirV || 'ab', derecha = !P.mira;
  let f = 0, kx = 1, ky = 1, alza = 0, rot = 0;
  if (pose){
    const k = 1 - P.pose.t / P.pose.dur, s = Math.sin(k * Math.PI);
    dir = dirDe(Math.cos(P.ang), Math.sin(P.ang)); derecha = Math.cos(P.ang) > 0;
    if (pose === 'atk'){ kx = 1 + .12 * s; ky = 1 - .09 * s; rot = dir === 'lado' ? (derecha ? 1 : -1) * .18 * s : 0; alza = dir === 'lado' ? 0 : -6 * s; }
    else { alza = -12 * s; kx = 1 - .06 * s; ky = 1 + .1 * s; }
  } else if (mov){
    // los pasos avanzan según la distancia recorrida
    // un cuadro cada 14 px; rebote suave en cada pisada y leve balanceo al ir de lado
    const k = P.paso / 14;
    f = Math.floor(k);
    alza = -(1 - Math.cos(k * Math.PI * 2)) * 1.1;
    if (dir === 'lado') rot = Math.sin(k * Math.PI) * .035;
    ky = 1 + Math.cos(k * Math.PI * 2) * .015;
  } else {
    const r = Math.sin(t / 420); ky = 1 + .025 * r; kx = 1 - .012 * r;
  }
  // montado: el jinete entero (jabalí, silla, gato sentado y su pierna) lo pinta dibujarJinete
  let subida = 0, cabeza = 0;
  const montado = enMontura(), jinete = montado && !pose && GD.px;
  if (jinete){ cabeza = dibujarJinete(t, mov, P.ladoMont !== false, pie); subida = 1; }
  // la vista de lado mira a la izquierda en la hoja: se refleja para ir a la derecha
  // si el gato tiene vista propia hacia la derecha se usa; si no, se refleja
  const usarDe = dir === 'lado' && derecha && GD.de && GD.de.length;
  const flip = dir === 'lado' && derecha && !usarDe;
  let setV = usarDe ? 'de' : dir, fV = f;
  // quieto: si el gato tiene cuadros de reposo, se usan (pies en el suelo, respiración suave)
  if (!mov && !pose && GD['q_' + setV] && GD['q_' + setV].length){ setV = 'q_' + setV; fV = Math.floor(t / 700); kx = 1; ky = 1; }
  // pixel art: la caminata ya trae el rebote en sus cuadros; nada de girar ni estirar (deformaría los píxeles)
  let dxA = 0, dyA = 0, kAtk = 0;
  if (GD.px){
    alza = mov && !pose ? 0 : Math.round(alza);
    if (!mov && !pose) alza = Math.sin(t / 420) > .6 ? -1 : 0;
    rot = 0; kx = 1; ky = 1;
    // ataque: estocada hacia donde apunta (en píxeles enteros); al recibir un golpe, retrocede y tiembla
    if (pose === 'atk'){ kAtk = 1 - P.pose.t / P.pose.dur; const s2 = Math.sin(kAtk * Math.PI); dxA = Math.round(Math.cos(P.ang) * 5 * s2); dyA = Math.round(Math.sin(P.ang) * 3 * s2); alza = 0; }
    if (P.golpe > 0) dxA += Math.floor(t / 45) % 2 ? 2 : -2;
  }
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, setV, fV), esc = escG;
  // sombra y aro con el color de la clase
  if (!subida){
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 17, 6, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = CLASES[PJ.clase].color + '88'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(P.x, pie, 19, 7, 0, 0, TAU); ctx.stroke();
  }
  if (P.golpe > 0 && !GD.px) ctx.globalAlpha = .65;
  // pixel art: tras el destello blanco, parpadea semitransparente mientras es invulnerable
  if (GD.px && P.inv > 0 && P.golpe <= 0 && Math.floor(t / 60) % 2) ctx.globalAlpha = .45;
  if (!jinete){
  ctx.save();
  if (GD.px){ ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(P.x) + dxA, Math.round(pie + alza) + dyA); }
  else ctx.translate(P.x, pie + alza);
  if (rot) ctx.rotate(rot); ctx.scale(flip ? -kx : kx, ky);
  // pixel art: al recibir un golpe parpadea en blanco (silueta) en vez de volverse transparente
  const hojaG = GD.px && P.golpe > 0 && Math.floor(t / 50) % 2 === 0 ? siluetaBlanca(imgGato(PJ.gato)) : hojaJugador();
  const frG = [sx, sy, w, h, ax, ay];
  if (GD.px) dibujarEquipoGato(ctx, imgGato(PJ.gato), frG, setV, esc, PJ.equipo, 'atras');
  ctx.drawImage(hojaG, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  if (GD.px) dibujarEquipoGato(ctx, imgGato(PJ.gato), frG, setV, esc, PJ.equipo, 'frente');
  ctx.restore();
  }
  ctx.globalAlpha = 1;
  if (GD.px && pose === 'atk') zarpazoPixel(Math.round(P.x) + dxA, Math.round(pie) - 26, P.ang, kAtk, CLASES[PJ.clase].color);
  // nombre sobre la cabeza, estilo MMO
  const ny = jinete ? cabeza - 10 : pie - ALTO_GATO_PJ - 10;
  rotulo(PJ.nombre, P.x, ny, '700 14px Rajdhani, sans-serif', '#7fc8ff', 'rgba(0,0,0,.85)', 3);
  const tit = tituloActual();
  if (tit) rotulo(`«${tit}»`, P.x, ny - 15, '600 12px Rajdhani, sans-serif', '#ffd100', 'rgba(0,0,0,.85)', 3);
  ctx.font = '700 14px Rajdhani, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)';
  if (PJ.hermandad){
    const hy = ny - (tit ? 30 : 15); ctx.font = '600 12px Rajdhani, sans-serif';
    const tx = `<${PJ.hermandad.nombre}>`;
    ctx.strokeText(tx, P.x, hy); ctx.fillStyle = '#7dffa8'; ctx.fillText(tx, P.x, hy);
  }
}

function updateAliados(dt){
  // soldados de sombra
  soldados.forEach((s, i) => {
    s.vida -= dt; s.cd -= dt; s.golpe -= dt;
    if (s.elemental){
      let obj = objetivoValido() ? P.objetivo : null, md = 400;
      if (!obj) for (const e of enemigos){ const d = Math.hypot(e.x - s.x, e.y - s.y); if (d < md && e.aggro){ md = d; obj = e; } }
      const tx = P.x - 50, ty = P.y + 10, dd = Math.hypot(tx - s.x, ty - s.y);
      if (dd > 30){ s.x += (tx - s.x) / dd * Math.min(220, dd * 3) * dt; s.y += (ty - s.y) / dd * Math.min(220, dd * 3) * dt; colisiones(s); }
      if (obj && s.cd <= 0 && Math.hypot(obj.x - s.x, obj.y - s.y) < 420){
        s.cd = 1.4; const a = Math.atan2(obj.y - s.y, obj.x - s.x);
        proys.push({ px:'hielo', x:s.x, y:s.y, vx:Math.cos(a) * 460, vy:Math.sin(a) * 460, r:8, alt:30, dmg:D.mag * .6, vida:1.1, color:'#9fd8ff', aoe:30, lento:1.5 });
      }
      return;
    }
    if (Math.hypot(s.x - P.x, s.y - P.y) > 520){ s.x = P.x - 40; s.y = P.y + 10; colisiones(s); }
    let obj = null, md = 380;
    for (const e of enemigos){
      const d = Math.hypot(e.x - s.x, e.y - s.y);
      if (d < md && Math.hypot(e.x - P.x, e.y - P.y) < 520){ md = d; obj = e; }
    }
    const tx = obj ? obj.x : P.x + Math.cos(i * 2.1 + 1) * 60, ty = obj ? obj.y : P.y + Math.sin(i * 2.1 + 1) * 40;
    const para = obj ? obj.r + s.r + 6 : 20;
    const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy) || 1;
    if (d > para){
      const v = obj ? 230 : Math.min(260, (d - para) * 4);
      s.x += dx / d * v * dt; s.y += dy / d * v * dt;
      if (Math.abs(dx) > 4) s.flip = dx < 0;
      colisiones(s);
    } else if (obj && s.cd <= 0){
      s.cd = .75; s.golpe = .18;
      herir(obj, D.poder * .7);
      chispas(obj.x, obj.y - 10, '#7b4dff', 8, 160);
    }
    if (s.vida <= 0){ efecto('tp', s.x, s.y + 10, .5, { vida:.45 }); chispas(s.x, s.y - 30, '#7b4dff', 14, 140); }
  });
  soldados = soldados.filter(s => s.vida > 0);

  // zonas de daño (lluvia de sombras)
  for (const z of zonas){
    z.t -= dt;
    if (z.t <= 0 && z.ticks > 0){
      z.t = z.cada; z.ticks--;
      golpeCirculo(z.x, z.y, z.r, z.dmg, z.lento ? { lento:z.lento } : {});
      chispas(z.x + rand(-z.r, z.r) * .7, z.y + rand(-z.r, z.r) * .5, z.col || '#8a6bff', 6, 90);
    }
  }
  zonas = zonas.filter(z => z.ticks > 0);
  enemigos = enemigos.filter(e => !e.muerto);
}

function dibujarSoldado(s, t){
  const k = Math.max(0, Math.min(1, (s.max - s.vida) / .4, s.vida / .6));
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(s.x, s.y + 12, 22, 7, 0, 0, TAU); ctx.fill();
  const esc = 88 / ATLAS.soldado[3] * (s.golpe > 0 ? 1.08 : 1);
  dibujarFrame('soldado', s.x, s.y + 12 + Math.sin(t / 300 + s.x) * 1.5, esc, s.flip);
  ctx.globalAlpha = 1;
}

function dibujarEfecto(n, x, y, esc, rot = 0, flipV = false){
  const [sx, sy, w, h, ax, ay] = ATLAS[n];
  ctx.save(); ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (flipV) ctx.scale(1, -1);
  ctx.drawImage(SPR, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  ctx.restore();
}
function dibujarEfectos(detras){
  for (const f of efectos){
    if (!!f.detras !== detras) continue;
    const k = f.vida / f.max;
    if (f.t === 'spr'){
      if (!spriteListo) continue;
      ctx.globalAlpha = k < .4 ? k / .4 : 1;
      const pop = 1 + Math.max(0, k - .85) * 1.2;
      dibujarEfecto(f.n, f.x, f.y - f.alt, f.esc * pop, f.rot, f.flipV);
    } else if (f.t === 'linea'){
      ctx.globalAlpha = k;
      ctx.strokeStyle = f.color; ctx.lineWidth = 14 * k; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

