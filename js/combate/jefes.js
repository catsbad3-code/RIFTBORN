// =====================================================
//  JEFES CON FASES: al 66% y al 33% de vida rugen, se vuelven más rápidos y estrenan ataques
//  Los ataques nuevos marcan el suelo antes de golpear (círculos que se llenan): hay que salir a tiempo.
// =====================================================
let peligros = [];
const PATRONES_FASE = [null,
  ['anillo', 'carga', 'invocar'],
  ['anillo', 'lluvia', 'carga', 'pisoton', 'invocar', 'lluvia'],
  ['espiral', 'lluvia', 'pisoton', 'carga', 'charcos', 'espiral', 'invocar']];
const faseDe = e => e.hp < e.maxHp * .34 ? 3 : e.hp < e.maxHp * .67 ? 2 : 1;
function cambioFase(e, fase){
  e.fase = fase; e.rugido = 1.3; e.vel *= 1.15; e.patron = -1; e.cd = 1.6; e.aviso = 0; e.carga = 0;
  banner(fase === 2 ? `¡${e.nombre} se enfurece!` : `¡${e.nombre} desata todo su poder!`, fase === 2 ? 'Fase 2: vigila el suelo' : 'Fase final');
  chat(fase === 2 ? `${e.nombre} entra en la fase 2.` : `${e.nombre} entra en su fase final.`, '#ff6b7f');
  sfx('jefe'); shake = 18; fxAnillo(e.x, e.y, 20, 220, e.color, .6); fxAnillo(e.x, e.y, 10, 160, '#ffffff', .4); chispas(e.x, e.y - 30, e.color, 50, 300);
  // el rugido aparta a todos de un empujón
  for (const U of [P, ...GRUPO.filter(g => g.vivo)]){
    const dx = U.x - e.x, dy = U.y - e.y, d = Math.hypot(dx, dy) || 1;
    if (d < 200){ U.x += dx / d * (200 - d) * .8; U.y += dy / d * (200 - d) * .8; colisiones(U); }
  }
}
// marca en el suelo que estalla al acabarse el tiempo (o charco que quema mientras dura)
function marcarSuelo(x, y, r, aviso, dmg, src, op = {}){ peligros.push({ x, y, r, t:aviso, max:aviso, dmg, src, col:op.col || (op.charco ? src.color : '#ff4f5f'), charco:op.charco || 0, tick:0 }); }
function ataqueEspecial(e, tipo, dx, dy, enf){
  const U = e.blanco || P;
  if (tipo === 'anillo'){
    const n = enf ? 20 : 14, off = rand(0, TAU);
    for (let i = 0; i < n; i++){ const a = off + i * TAU / n; proysE.push({ x:e.x, y:e.y, vx:Math.cos(a) * 210, vy:Math.sin(a) * 210, r:8, dmg:e.dmg * .7, vida:3.5, color:e.color, src:e }); }
    shake = Math.max(shake, 5);
  } else if (tipo === 'carga'){
    e.aviso = enf ? .45 : .7; e.cdir = Math.atan2(dy, dx);
  } else if (tipo === 'invocar'){
    for (let i = 0; i < (enf ? 4 : 3); i++) crearEnemigo(E.R.enemigos[i % E.R.enemigos.length], e.x + rand(-70, 70), e.y + rand(-70, 70), true);
    chispas(e.x, e.y, e.color, 20, 200);
  } else if (tipo === 'lluvia'){
    // círculos que caen sobre ti y a tu alrededor
    const n = e.fase >= 3 ? 9 : 6;
    marcarSuelo(U.x, U.y, 64, 1.2, e.dmg * 1.2, e);
    for (let i = 1; i < n; i++){ const a = rand(0, TAU), r = rand(70, 240); marcarSuelo(U.x + Math.cos(a) * r, U.y + Math.sin(a) * r * .8, 64, 1.1 + i * .06, e.dmg * 1.2, e); }
    texto(e.x, e.y - 90, '¡Cuidado arriba!', '#ffd76a', 15);
  } else if (tipo === 'pisoton'){
    // un gran golpe alrededor del jefe: hay que alejarse
    e.quieto = 1.1; marcarSuelo(e.x, e.y, 200, 1.1, e.dmg * 1.6, e, { col:'#ff5a3a' });
    texto(e.x, e.y - 90, '¡Aléjate!', '#ff8a5a', 16);
  } else if (tipo === 'espiral'){
    e.espiral = 2.6; e.angEsp = rand(0, TAU); e.tEsp = 0; e.quieto = 2.6;
  } else if (tipo === 'charcos'){
    for (let i = 0; i < 3; i++){ const a = rand(0, TAU), r = i ? rand(60, 160) : 0; marcarSuelo(U.x + Math.cos(a) * r, U.y + Math.sin(a) * r * .8, 70, .7, e.dmg * .3, e, { charco:6 }); }
  }
}
function actualizarJefe(e, dx, dy, d, dt){
  const U = e.blanco || P;
  if (!e.aggro && d < 430 && lineaVision(e.x, e.y, P.x, P.y)){
    e.aggro = true; E.jefeVisto = true; $('jefe').classList.remove('oculto'); banner(e.nombre, 'Jefe de la mazmorra'); shake = 10;
  }
  if (!e.aggro) return;
  const fase = faseDe(e);
  if (fase > (e.fase || 1)) cambioFase(e, fase);
  // mientras ruge no se mueve ni recibe daño
  if (e.rugido > 0){ e.rugido -= dt; if (Math.random() < .4) chispas(e.x, e.y - 30, e.color, 2, 120); colisiones(e); return; }
  const lento = e.lento > 0 ? .6 : 1, enf = e.hp < e.maxHp / 2;
  e.quieto = (e.quieto || 0) - dt;
  if (e.espiral > 0){
    // espiral de proyectiles que gira
    e.espiral -= dt; e.tEsp -= dt;
    if (e.tEsp <= 0){ e.tEsp = .09; e.angEsp += .32; for (const k of [0, Math.PI]){ const a = e.angEsp + k; proysE.push({ x:e.x, y:e.y, vx:Math.cos(a) * 200, vy:Math.sin(a) * 200, r:7, dmg:e.dmg * .5, vida:3.2, color:e.color, src:e }); } }
  }
  if (e.carga > 0){
    e.carga -= dt;
    e.x += Math.cos(e.cdir) * e.vel * 4.4 * dt; e.y += Math.sin(e.cdir) * e.vel * 4.4 * dt;
    if (Math.random() < .5) chispas(e.x, e.y, e.color, 2, 80);
  } else if (e.aviso > 0){
    e.aviso -= dt;
    if (e.aviso <= 0) e.carga = .5;
  } else {
    if (e.quieto <= 0){ const [vx, vy] = direccionHacia(e, U); e.x += vx * e.vel * lento * dt; e.y += vy * e.vel * lento * dt; }
    if (e.cd <= 0 && !(e.espiral > 0)){
      const lista = PATRONES_FASE[e.fase || 1];
      e.patron = (e.patron + 1) % lista.length;
      ataqueEspecial(e, lista[e.patron], dx, dy, enf);
      e.cd = (e.fase || 1) >= 3 ? 1.7 : enf ? 2 : 2.8;
    }
  }
  colisiones(e);
  if (d < e.r + U.r + 4 && e.cdGolpe <= 0){ e.cdGolpe = .9; pegar(U, false, e.dmg, e); }
}
// las marcas del suelo: se llenan y estallan, o queman mientras duran
function updatePeligros(dt){
  for (const p of peligros){
    p.t -= dt;
    if (p.t > 0) continue;
    const dentro = U => Math.hypot(U.x - p.x, (U.y - p.y) / .8) < p.r + (U.r || 14);
    if (!p.charco){
      if (!p.hecho){
        p.hecho = true;
        if (dentro(P)) golpearJugador(p.dmg, p.src);
        for (const g of GRUPO) if (g.vivo && dentro(g)) danarAliado(g, p.dmg * .6, p.src);
        fxAnillo(p.x, p.y, 8, p.r, p.col, .3); chispas(p.x, p.y, p.col, p.r > 120 ? 40 : 14, p.r > 120 ? 300 : 180); shake = Math.max(shake, p.r > 120 ? 12 : 5);
      }
    } else {
      p.charco -= dt; p.tick -= dt;
      if (p.tick <= 0){ p.tick = .5; if (dentro(P)){ golpearJugador(p.dmg, p.src); ponerEfecto('agi_dn', 1.2); } }
    }
  }
  peligros = peligros.filter(p => p.t > 0 || (p.charco > 0) );
}
function dibujarPeligros(t){
  for (const p of peligros){
    const ry = p.r * .8;
    if (p.t > 0){
      // aviso: borde rojo y un relleno que crece hasta estallar
      const k = 1 - p.t / p.max;
      ctx.globalAlpha = .18; ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, ry, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = .35 + .3 * k; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * k, ry * k, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = .9; ctx.strokeStyle = p.col; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t / 50;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, ry, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
    } else if (p.charco > 0){
      // charco que burbujea
      ctx.globalAlpha = Math.min(1, p.charco) * .55; ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, ry, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = Math.min(1, p.charco) * .8; ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 4; i++){ const a = t / 600 + i * 1.7, r = p.r * .55 * ((i * .37 + t / 1500) % 1); pxCuadro(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * .8, '#ffffff', 3); }
    }
  }
  ctx.globalAlpha = 1;
}

// la interfaz sólo se toca cuando un valor cambia (escribir en la página en cada cuadro es caro)
const HUD_EL = {}, HUD_V = {};
const hudEl = id => HUD_EL[id] || (HUD_EL[id] = $(id));
function hudT(id, v){ v = String(v); if (HUD_V['t' + id] !== v){ HUD_V['t' + id] = v; hudEl(id).textContent = v; } }
function hudS(id, prop, v){ const k = 's' + id + prop; if (typeof v === 'number') v = String(Math.round(v * 1000) / 1000); else if (typeof v === 'string' && v.endsWith('%')) v = Math.round(parseFloat(v) * 10) / 10 + '%'; if (HUD_V[k] !== v){ HUD_V[k] = v; if (prop.startsWith('--')) hudEl(id).style.setProperty(prop, v); else hudEl(id).style[prop] = v; } }
function hudC(id, cls, on){ const k = 'c' + id + cls; on = !!on; if (HUD_V[k] !== on){ HUD_V[k] = on; hudEl(id).classList.toggle(cls, on); } }
function actualizarHUD(){
  const r = rangoCazador(), R = RANGOS[r];
  hudT('hNombre', PJ.nombre);
  hudT('hNivel', PJ.nivel);
  hudT('hRango', R.l); hudS('hRango', 'color', R.color);
  hudS('hpFill', 'width', (P.hp / D.maxHp * 100) + '%');
  hudT('hpTxt', `${Math.ceil(P.hp)} / ${D.maxHp}`);
  hudS('enFill', 'width', (P.en / D.maxEn * 100) + '%');
  hudT('enTxt', `${recurso().n} ${Math.floor(P.en)} / ${D.maxEn}`);
  if ($('enFill').dataset.clase !== PJ.clase){ $('enFill').dataset.clase = PJ.clase; $('enFill').style.background = recurso().col; }
  const cb = PJ.clase === 'sombra' ? (P.combo || 0) : -1;
  if ($('combo').dataset.n !== String(cb)){ $('combo').dataset.n = cb; $('combo').innerHTML = cb < 0 ? '' : [0, 1, 2, 3, 4].map(i => `<i class="${i < cb ? 'on' : ''}"></i>`).join(''); }
  hudS('xpFill', 'width', (PJ.xp / PJ.xpSig * 100) + '%');
  hudT('xpTxt', `${PJ.xp} / ${PJ.xpSig}`);
  // marco de objetivo: tu objetivo, el jefe en combate, o el personaje amistoso que seleccionaste
  let ob = null;
  if (objetivoValido()) ob = P.objetivo;
  else if (jefeVivo && jefeVivo.aggro) ob = jefeVivo;
  const amigo = !ob && amigoValido() ? P.amigo : null;
  hudC('marcoObjetivo', 'oculto', !ob && !amigo);
  hudC('marcoObjetivo', 'amistoso', !!amigo);
  pintarRetratoObjetivo(ob || amigo);
  if (amigo){
    hudC('marcoObjetivo', 'elite', false);
    hudT('oNombre', amigo.nombre);
    hudT('oRango', 'Amistoso'); hudS('oRango', 'color', '#7dffa8');
    hudS('oFill', 'width', '100%'); hudT('oTxt', amigo.mision ? 'Tiene una misión para ti' : 'Habitante de Lumeria');
  }
  if (ob){
    hudC('marcoObjetivo', 'elite', !!ob.jefe);
    hudT('oNombre', ob.nombre);
    hudT('oRango', ob.jefe ? 'Jefe' : (E.R ? E.R.l : '')); hudS('oRango', 'color', E.R ? E.R.color : '#fff');
    hudS('oFill', 'width', Math.max(0, ob.hp / ob.maxHp * 100) + '%');
    hudT('oTxt', `${Math.max(0, Math.ceil(ob.hp))} / ${ob.maxHp}`);
    const oo = objetivoDe(ob);
    hudT('odoNombre', oo.nombre);
    hudS('odoFill', 'width', Math.max(0, oo.hp / oo.maxHp * 100) + '%');
  }
  hudC('marcoOdO', 'oculto', !ob || !ob.aggro);
  if (hPocPrev !== PJ.pociones){ hPocPrev = PJ.pociones; $('hPoc').innerHTML = `${ic3('pocion')}<b>${PJ.pociones}</b>`; }
  hudC('btnPuntos', 'oculto', !PJ.puntos);
  if (PJ.puntos) hudT('btnPuntos', `${PJ.puntos} puntos por repartir`);
  actualizarBarra();
  const c = CLASES[PJ.clase];
  const cd1 = clamp(P.cd1 / c.h1.cd, 0, 1), cd2 = P.en < costeDe(c.h2) ? 1 : clamp(P.cd2 / c.h2.cd, 0, 1), cdp = clamp(P.cdPoc, 0, 1);
  hudS('mAtk', '--cd', cd1); hudS('mHab', '--cd', cd2); hudS('mPoc', '--cd', cdp);
}

