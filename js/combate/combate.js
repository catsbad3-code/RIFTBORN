// =====================================================
//  COMBATE
// =====================================================
// en el teléfono se apunta solo: primero al objetivo fijado (tocado o golpeado), si no al más cercano
// ---------- objetivo fijo (estilo WoW): Tab, clic o toque; se mantiene hasta que muere o lo quitas con Esc ----------
let VER_PLACAS = true; try { VER_PLACAS = localStorage.getItem('rb_placas') !== '0'; } catch (e) {}
const GCD = 1; // tiempo de recarga global de habilidades y poderes (el ataque básico no lo usa)
const objetivoValido = () => { const o = P && P.objetivo; return !!(o && !o.muerto && o.hp > 0 && enemigos.includes(o)); };
function fijarObjetivo(e){ if (P.objetivo !== e){ P.objetivo = e; if (e) sfx('click'); } }
function siguienteObjetivo(){
  if (E.tipo !== 'mazmorra') return;
  const lista = enemigos.filter(e => !e.muerto && Math.hypot(e.x - P.x, e.y - P.y) < 560 && lineaVision(P.x, P.y, e.x, e.y))
    .sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y));
  if (!lista.length){ P.objetivo = null; return; }
  const i = lista.indexOf(P.objetivo);
  fijarObjetivo(lista[(i + 1) % lista.length]);
}
// enemigo bajo un punto de la pantalla (para seleccionarlo con clic o toque)
function enemigoEnPantalla(sx, sy, radio = 46){
  const wx = sx + cam.x, wy = sy + cam.y; let toc = null, md = radio * radio;
  for (const en of enemigos){ if (en.muerto) continue; const d = (en.x - wx) ** 2 + (en.y - Math.min(40, altoDe(en) / 2) - wy) ** 2; if (d < md){ md = d; toc = en; } }
  return toc;
}
// a quién ataca un enemigo (objetivo del objetivo)
const unidadJugador = () => ({ nombre:PJ.nombre, hp:P.hp, maxHp:D.maxHp, color:'#7fc8ff' });
function objetivoDe(e){ return e && e.objetivo && e.objetivo !== P ? e.objetivo : unidadJugador(); }
// personaje amistoso seleccionado (ciudad e interiores)
const amigoValido = () => !!(P && P.amigo && E.npcs && E.npcs.includes(P.amigo));
function npcEnPantalla(sx, sy){
  if (!E.npcs) return null;
  const wx = sx + cam.x, wy = sy + cam.y; let toc = null, md = 44 * 44;
  for (const n of E.npcs){ const d = (n.x - wx) ** 2 + (n.y - 22 - wy) ** 2; if (d < md){ md = d; toc = n; } }
  return toc;
}
// retrato pixelado del objetivo: el dibujo del monstruo o del personaje
let retratoDe = null;
function pintarRetratoObjetivo(u){
  if (u === retratoDe) return; retratoDe = u;
  const c = $('oRetrato'); if (!c) return;
  const a = c.getContext('2d'), W = c.width;
  a.clearRect(0, 0, W, W);
  const g = a.createRadialGradient(W / 2, W / 2, 4, W / 2, W / 2, W / 2);
  g.addColorStop(0, u && (u.cam || u.spr) ? '#2a4a2a' : '#4a1a20'); g.addColorStop(1, '#0c0812'); a.fillStyle = g; a.fillRect(0, 0, W, W);
  if (!u) return;
  a.imageSmoothingEnabled = false;
  let img = null, sx, sy, w, h, cabeza = false;
  if (u.cam && CAM[u.cam]){ img = CAM_IMG; [sx, sy, w, h] = CAM[u.cam].ab[0]; cabeza = true; }
  else if (u.spr && NPC_SPR[u.spr]){ img = NPC_IMG; [sx, sy, w, h] = NPC_SPR[u.spr]; const o = NPC_SPR[u.spr][4] || 0; sy += o; h -= o; cabeza = true; }
  else {
    const n = sprDe(u); if (!n || !MON.tipos[n]) return;
    const idx = (u.jefe && n === 'arana') ? MON.tipos.arana_jefe : (u.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : MON.tipos[n].walk[0];
    img = MON_IMG; [sx, sy, w, h] = MON.cuadros[idx];
  }
  if (!img.complete || !img.naturalWidth){ retratoDe = null; return; }
  // personajes: la cabeza y los hombros; monstruos: entero
  if (cabeza){ h = Math.min(h, Math.round(w * .95)); }
  const k = Math.max(1, Math.floor(Math.min((W - 6) / w, (W - 6) / h)));
  const dw = w * k, dh = h * k;
  a.drawImage(img, sx, sy, w, h, Math.round((W - dw) / 2), cabeza ? 4 : Math.round(W - dh - 4), dw, dh);
}
function objetivoTactil(max = 360){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < Math.max(max, 420)) return P.objetivo;
  return enemigoCercano(P.x, P.y, max);
}
const A_DISTANCIA = ['mago', 'sacerdote', 'arquero'];
// ataque automático (teléfono): golpea solo cuando hay un monstruo a tu alcance
function autoAtaque(){
  if (!esTactil || !AJ_TEL.auto || E.tipo !== 'mazmorra' || P.cd1 > 0) return false;
  return !!objetivoTactil(A_DISTANCIA.includes(PJ.clase) ? 330 : 105);
}
function apuntar(){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < 620){ P.ang = Math.atan2(P.objetivo.y - P.y, P.objetivo.x - P.x); return; }
  if (!esTactil){ P.ang = Math.atan2(mouse.y + cam.y - (P.y - 20), mouse.x + cam.x - P.x); return; }
  const e = objetivoTactil(360);
  P.ang = e ? Math.atan2(e.y - P.y, e.x - P.x) : Math.atan2(P.ldy, P.ldx);
}
function enemigoCercano(x, y, max){
  let mejor = null, md = max * max;
  for (const e of enemigos){ const d = (e.x - x) ** 2 + (e.y - y) ** 2; if (d < md){ md = d; mejor = e; } }
  return mejor;
}
// punto del suelo hacia donde apuntas (para poderes de zona)
function puntoMira(max){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < max + 60) return { x:P.objetivo.x, y:P.objetivo.y };
  if (esTactil){ const e = objetivoTactil(max); if (e) return { x:e.x, y:e.y }; return { x:P.x + Math.cos(P.ang) * 180, y:P.y + Math.sin(P.ang) * 180 }; }
  const mx = mouse.x + cam.x, my = mouse.y + cam.y + 20, d = Math.hypot(mx - P.x, my - P.y);
  const k = d > max ? max / d : 1;
  return { x:P.x + (mx - P.x) * k, y:P.y + (my - P.y) * k };
}
// efecto visual tomado de la hoja de sprites
function efecto(n, x, y, esc, op = {}){
  efectos.push({ t:'spr', n, x, y, esc, rot:op.rot || 0, flipV:!!op.flipV, alt:op.alt || 0, vida:op.vida || .5, max:op.vida || .5,
    sigue:op.sigue ? { dx:x - P.x, dy:y - P.y } : null, detras:!!op.detras });
}
function efectoCorte(esc){
  const a = P.ang;
  efecto('corte', P.x + Math.cos(a) * 44, P.y + Math.sin(a) * 30, esc, { rot:a, flipV:Math.cos(a) < 0, alt:26, vida:.22 });
}

function usarHab(n){
  if (!enJuego || pantallaActual || E.tipo !== 'mazmorra') return;
  const c = CLASES[PJ.clase];
  if (n === 1){
    if (P.cd1 > 0) return;
    P.cd1 = c.h1.cd * (1 - Math.min(.35, D.s.agi * .005)) * D.cdK * (estados.rapido ? .5 : 1); sfx(sfxClase('ataque'), .08);
  } else {
    if (P.cd2 > 0 || P.gcd > 0) return;
    const coste2 = costeDe(c.h2);
    if (P.en < coste2){ texto(P.x, P.y - 74, recurso().sin, '#4fa3ff', 14); P.cd2 = .3; vibrar([20, 40, 20]); return; }
    P.cd2 = c.h2.cd * D.cdK; P.en -= coste2; P.gcd = GCD; vibrar(15); sfx(sfxClase('poder'));
  }
  apuntar();
  HAB[PJ.clase + n]();
}

const HAB = {
  guerrero1(){ pose('atk', DUR_ATK); golpeArco(84, 1.9, D.fis); fxArco(P.x, P.y, P.ang, 70, 1.9, '#e2443c'); },
  guerrero2(){
    pose('cast', .45);
    golpeCirculo(P.x, P.y, 140, D.fis * 2.3, { empuje:90 });
    fxAnillo(P.x, P.y, 12, 140, '#e2443c', .45); fxGrietas(P.x, P.y + 4, '#5a0c0c', .7);
    shake = 12; chispas(P.x, P.y, '#ff5a4a', 26, 260);
  },
  sombra1(){ pose('atk', DUR_ATK * .7); golpeArco(68, 1.4, D.fis * .85, .15); fxArco(P.x, P.y, P.ang + rand(-.3, .3), 54, 1.2, '#5ad84a', .16); if (enemigos.some(e => e.hp < e.maxHp && Math.hypot(e.x - P.x, e.y - P.y) < 68 + e.r) && Math.random() < .35) sumarCombo(1); },
  sombra2(){
    const x0 = P.x, y0 = P.y, a = P.ang;
    fxAnillo(x0, y0, 28, 4, '#5ad84a', .3);
    let paso = 0;
    while (paso < 220 && !solidoEn(P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 16)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; }
    colisiones(P); P.inv = Math.max(P.inv, .35);
    golpeLinea(x0, y0, P.x, P.y, 30, D.fis * 2.4);
    fxEstela(x0, y0, P.x, P.y, '#5ad84a', .35);
    fxAnillo(P.x, P.y, 4, 30, '#c8ff8a', .3);
    pose('oculto', .12);
  },
  mago1(){
    pose('atk', DUR_ATK);
    const a = P.ang;
    fxAnillo(P.x + Math.cos(a) * 18, P.y + Math.sin(a) * 10, 14, 4, '#4f9aff', .2);
    proys.push({ px:'arcano', x:P.x + Math.cos(a) * 22, y:P.y + Math.sin(a) * 22, vx:Math.cos(a) * 480, vy:Math.sin(a) * 480, r:9, alt:30,
      dmg:D.mag * 1.1, vida:1.1, color:'#4f9aff', aoe:50 });
  },
  mago2(){
    pose('cast', .5);
    const a = P.ang;
    proys.push({ bola:true, x:P.x + Math.cos(a) * 30, y:P.y + Math.sin(a) * 30, vx:Math.cos(a) * 210, vy:Math.sin(a) * 210, r:34, alt:22,
      dmg:D.mag * .45, vida:2.4, tick:0, color:'#4f9aff' });
    chispas(P.x, P.y - 30, '#4f9aff', 16, 160);
  }
};

function usarPoder(id){
  if (!enJuego || pantallaActual || !id) return;
  const pw = PODERES[id];
  if (PJ.nivel < pw.nivel){ texto(P.x, P.y - 74, `Se aprende en el nivel ${pw.nivel}`, '#9a91c2', 14); return; }
  if (E.tipo !== 'mazmorra'){ texto(P.x, P.y - 74, 'Los poderes solo funcionan dentro de los portales', '#9a91c2', 14); return; }
  if ((P.cdP[id] || 0) > 0 || P.gcd > 0) return;
  if (pw.clase && pw.clase !== PJ.clase) return;
  if (P.en < costeDe(pw)){ texto(P.x, P.y - 74, recurso().sin, '#4fa3ff', 14); vibrar([20, 40, 20]); return; }
  P.en -= costeDe(pw); P.cdP[id] = pw.cd * D.cdK; P.gcd = GCD; vibrar(15); sfx(sfxClase('poder'));
  apuntar();
  PODER_FN[id]();
}

const PODER_FN = {
  paso(){
    ponerEfecto('agi_up', 5);
    efecto('tp', P.x, P.y + 14, .55, { vida:.55 });
    const a = P.ang; let paso = 0;
    while (paso < 260 && !solidoEn(P.x + Math.cos(a) * 18, P.y + Math.sin(a) * 18)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; }
    colisiones(P); P.inv = Math.max(P.inv, .4);
    efecto('tp', P.x, P.y + 14, .55, { vida:.55 });
    golpeCirculo(P.x, P.y, 80, D.poder * 1.4);
    chispas(P.x, P.y - 20, '#7b4dff', 20, 200);
    pose('oculto', .15);
  },
  luna(){
    pose('atk', DUR_ATK);
    const a = P.ang;
    proys.push({ spr:'luna', esc:.9, perfora:true, hits:new Set(), x:P.x + Math.cos(a) * 20, y:P.y + Math.sin(a) * 20,
      vx:Math.cos(a) * 520, vy:Math.sin(a) * 520, r:24, alt:28, dmg:D.poder * 1.6, vida:1.1, color:'#8a6bff' });
  },
  soldado(){ pose('invocar', .6); invocarSoldado(22, 1); ponerEfecto('atk_up', 12); },
  lluvia(){
    pose('cast', .6);
    const p = puntoMira(320);
    efecto('lluvia', p.x, p.y + 55, .85, { vida:1.5 });
    zonas.push({ x:p.x, y:p.y, r:115, ticks:5, cada:.28, t:.15, dmg:D.poder * .9 });
  },
  ola(){
    pose('atk', DUR_ATK);
    const a = P.ang;
    proys.push({ spr:'ola', esc:1, perfora:true, empuje:50, hits:new Set(), x:P.x + Math.cos(a) * 30, y:P.y + Math.sin(a) * 30,
      vx:Math.cos(a) * 360, vy:Math.sin(a) * 360, r:42, alt:20, dmg:D.poder * 2.2, vida:1.1, color:'#6a4dff' });
  },
  domo(){
    pose('cast', .5);
    efecto('domo', P.x, P.y + 20, 1.6, { vida:.8, detras:true });
    golpeCirculo(P.x, P.y, 160, D.poder * 2.6, { empuje:130 });
    shake = 14; chispas(P.x, P.y, '#8a6bff', 40, 300);
  },
  ejercito(){
    ponerEfecto('def_up', 15);
    pose('invocar', .8);
    for (let i = 0; i < 3; i++) invocarSoldado(28, i);
    const c = Math.round(D.maxHp * .3); P.hp = Math.min(D.maxHp, P.hp + c);
    texto(P.x, P.y - 74, '+' + c, '#7dffa8', 17);
    banner('¡Levántense!', 'Tu ejército de sombras responde');
  }
};

