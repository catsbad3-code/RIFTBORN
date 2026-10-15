// =====================================================
//  AMENAZA, GRUPO (TANQUE Y SANADORA) Y BUSCADOR DE MAZMORRAS
// =====================================================
let FUENTE = null;            // quién causa el daño que se está aplicando (para la amenaza)
let GRUPO = [];               // aliados controlados por el juego en la mazmorra
const amenazas = e => e.amen || (e.amen = new Map());
// el guerrero genera más amenaza (como en actitud defensiva); el tanque mucho más
const multAmenaza = u => u === P ? (PJ.clase === 'guerrero' ? 1.5 : 1) : (u.mult || 1);
function sumarAmenaza(e, u, n){ const m = amenazas(e); m.set(u, (m.get(u) || 0) + n * multAmenaza(u)); }
const vivo = u => u === P ? P.hp > 0 : u.vivo;
const unidadesGrupo = () => [P, ...GRUPO.filter(g => g.vivo)];
// cada enemigo ataca a quien tenga más amenaza (o a quien lo provocó); sin combate, al más cercano
function blancoEnemigo(e, dt){
  if (!e.aggro){
    let mejor = P, md = Math.hypot(P.x - e.x, P.y - e.y);
    for (const g of GRUPO) if (g.vivo){ const d = Math.hypot(g.x - e.x, g.y - e.y); if (d < md){ md = d; mejor = g; } }
    e.blanco = mejor; return mejor;
  }
  e.provocado = (e.provocado || 0) - dt; e.tBlanco = (e.tBlanco || 0) - dt;
  if (e.provocado > 0 && e.provocador && vivo(e.provocador)) e.blanco = e.provocador;
  else if (e.tBlanco <= 0 || !e.blanco || !vivo(e.blanco)){
    e.tBlanco = .5;
    let mejor = null, mv = -1;
    for (const [u, v] of amenazas(e)) if (vivo(u) && (u === P || GRUPO.includes(u)) && v > mv){ mv = v; mejor = u; }
    e.blanco = mejor || P;
  }
  e.objetivo = e.blanco;
  return e.blanco;
}
// daño de un monstruo a su blanco
function pegar(U, forzar, d, src){
  if (U === P){ if (forzar) P.inv = 0; golpearJugador(d, src); return; }
  danarAliado(U, d, src);
}
function danarAliado(g, d, src){
  if (!g.vivo) return;
  d *= 1 - g.def; g.hp -= d; g.golpe = .15;
  texto(g.x + rand(-6, 6), g.y - 60, Math.round(d), '#ff8a8a', 12);
  if (g.hp <= 0){ g.hp = 0; g.vivo = false; g.tRevive = 0; chat(`${g.nombre} ha muerto.`, '#ff8a9b'); chispas(g.x, g.y - 20, '#ffffff', 20, 160); }
}
function golpeAliado(p){
  for (const g of GRUPO) if (g.vivo && Math.hypot(p.x - g.x, p.y - g.y) < p.r + g.r){ danarAliado(g, p.dmg, p.src); return true; }
  return false;
}

// ---- miembros del grupo ----
const ROL = {
  tanque:  { n:'Tanque',   ic:'🛡', col:'#4fa3ff' },
  sanador: { n:'Sanadora', ic:'✚', col:'#7dffa8' },
  dps:     { n:'Daño',     ic:'⚔', col:'#ff8a8a' }
};
function crearGrupo(){
  const libres = [1, 2, 3].filter(t => t !== PJ.gato), tq = libres[0], sn = libres[1];
  const arma = (n, r) => ({ nombre:n + ' del grupo', rareza:r, slot:'arma', stats:{} }), cab = (n, r) => ({ nombre:n + ' del grupo', rareza:r, slot:'cabeza', stats:{} });
  GRUPO = [
    { rol:'tanque', nombre:'Bruma', gato:tq, maxHp:Math.round(D.maxHp * 1.9), def:.5, mult:6, vel:D.vel * .95, cd:0, cdProv:0, equipo:{ arma:arma('Espada', 3), cabeza:cab('Yelmo', 3) } },
    { rol:'sanador', nombre:'Lumi', gato:sn, maxHp:Math.round(D.maxHp * 1.15), def:.2, mult:1, vel:D.vel * .95, cd:0, cdAtk:0, equipo:{ arma:arma('Báculo', 3), cabeza:cab('Capucha', 3) } }
  ];
  GRUPO.forEach((g, i) => Object.assign(g, { x:P.x - 40 + i * 30, y:P.y + 30, r:14, hp:g.maxHp, vivo:true, paso:0, dir:'ab', flip:false, mov:false, golpe:0, tRevive:0 }));
  pintarGrupo(true);
  chat('Te has unido a un grupo: Bruma (tanque) y Lumi (sanadora).', '#4fa3ff');
}
function disolverGrupo(){ if (GRUPO.length) chat('Tu grupo se ha disuelto.', '#9a91c2'); GRUPO = []; pintarGrupo(true); }
function enCombate(){ return enemigos.some(e => e.aggro && !e.muerto); }
function moverAliado(g, tx, ty, para, dt){
  const dx = tx - g.x, dy = ty - g.y, d = Math.hypot(dx, dy) || 1;
  if (d > 600){ g.x = P.x - 30; g.y = P.y + 20; colisiones(g); return; }
  if (d > para){
    const v = Math.min(g.vel * dt, d - para), ox = g.x, oy = g.y;
    g.x += dx / d * v; g.y += dy / d * v; colisiones(g);
    g.mov = Math.hypot(g.x - ox, g.y - oy) > .2; g.paso += v;
    g.dir = Math.abs(dy) > Math.abs(dx) * 1.3 ? (dy < 0 ? 'ar' : 'ab') : 'lado'; if (Math.abs(dx) > 2) g.flip = dx > 0;
  } else g.mov = false;
}
function updateGrupo(dt){
  if (!GRUPO.length) return;
  const combate = enCombate();
  for (const g of GRUPO){
    g.golpe -= dt; g.cd -= dt;
    if (!g.vivo){
      // fuera de combate vuelven a levantarse
      if (!combate){ g.tRevive += dt; if (g.tRevive > 5){ g.vivo = true; g.hp = g.maxHp * .5; chat(`${g.nombre} vuelve a levantarse.`, '#7dffa8'); chispas(g.x, g.y - 20, '#7dffa8', 20, 140); } }
      continue;
    }
    if (!combate) g.hp = Math.min(g.maxHp, g.hp + g.maxHp * .06 * dt);
    if (g.rol === 'tanque') iaTanque(g, dt, combate);
    else iaSanador(g, dt, combate);
  }
  pintarGrupo();
}
function iaTanque(g, dt, combate){
  g.cdProv -= dt; g.cdTrueno = (g.cdTrueno || 0) - dt;
  // atronar: golpe en área que le da mucha amenaza con todos los enemigos cercanos
  if (combate && g.cdTrueno <= 0 && enemigos.some(e => e.aggro && !e.muerto && Math.hypot(e.x - g.x, e.y - g.y) < 150)){
    g.cdTrueno = 5; FUENTE = g;
    for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - g.x, e.y - g.y) < 150){ herir(e, D.poder * .2); sumarAmenaza(e, g, D.poder * 3); }
    FUENTE = null; chispas(g.x, g.y, '#4fa3ff', 22, 220); texto(g.x, g.y - 70, 'Atronar', '#4fa3ff', 12);
  }
  // provoca a quien esté atacando a otro
  if (g.cdProv <= 0) for (const e of enemigos){
    if (e.muerto || !e.aggro || e.blanco === g || Math.hypot(e.x - g.x, e.y - g.y) > 420) continue;
    provocarA(e, g); g.cdProv = 3; texto(g.x, g.y - 70, '¡Provocar!', '#4fa3ff', 13); break;
  }
  // primero va a por quien ataque a sus compañeros; si no, al objetivo del jugador o al enemigo más cercano
  let obj = null;
  { let md = 480; for (const e of enemigos){ if (e.muerto || !e.aggro || e.blanco === g) continue; const d = Math.hypot(e.x - g.x, e.y - g.y); if (d < md){ md = d; obj = e; } } }
  if (!obj && objetivoValido() && P.objetivo.aggro) obj = P.objetivo;
  if (!obj){ let md = 360; for (const e of enemigos){ if (e.muerto || !(e.aggro || Math.hypot(e.x - P.x, e.y - P.y) < 220)) continue; const d = Math.hypot(e.x - g.x, e.y - g.y); if (d < md){ md = d; obj = e; } } }
  if (obj){
    moverAliado(g, obj.x, obj.y, obj.r + g.r + 4, dt);
    if (Math.hypot(obj.x - g.x, obj.y - g.y) < obj.r + g.r + 14 && g.cd <= 0){
      g.cd = 1.1; g.golpe = .15; FUENTE = g; herir(obj, D.poder * .4); FUENTE = null;
      chispas(obj.x, obj.y - 10, '#4fa3ff', 6, 140);
    }
  } else moverAliado(g, P.x + 46, P.y - 10, 18, dt);
}
function iaSanador(g, dt, combate){
  // se queda detrás del jugador
  const a = Math.atan2(P.ldy || 1, P.ldx || 0) + Math.PI;
  moverAliado(g, P.x + Math.cos(a) * 80, P.y + Math.sin(a) * 50, 22, dt);
  if (g.cd > 0) return;
  let peor = null, pct = .88;
  for (const u of unidadesGrupo()){ const hp = u === P ? P.hp / D.maxHp : u.hp / u.maxHp; if (hp < pct){ pct = hp; peor = u; } }
  if (peor){
    g.cd = 1.5; g.golpe = .2;
    const max = peor === P ? D.maxHp : peor.maxHp, c = Math.round(max * .2);
    if (peor === P) P.hp = Math.min(D.maxHp, P.hp + c); else peor.hp = Math.min(peor.maxHp, peor.hp + c);
    texto(peor.x, peor.y - 76, '+' + c, '#7dffa8', 14); chispas(peor.x, peor.y - 20, '#7dffa8', 12, 120);
    efectos.push({ t:'linea', x:g.x, y:g.y - 30, x2:peor.x, y2:peor.y - 30, vida:.25, max:.25, color:'#7dffa8' });
    for (const e of enemigos) if (e.aggro && !e.muerto) sumarAmenaza(e, g, c * .12);
    return;
  }
  // si nadie necesita curación, ataca al objetivo del jugador
  g.cdAtk = (g.cdAtk || 0) - dt;
  if (combate && objetivoValido() && g.cdAtk <= 0 && Math.hypot(P.objetivo.x - g.x, P.objetivo.y - g.y) < 380){
    g.cdAtk = 2.2; FUENTE = g; herir(P.objetivo, D.poder * .25); FUENTE = null;
    efectos.push({ t:'linea', x:g.x, y:g.y - 30, x2:P.objetivo.x, y2:P.objetivo.y - 20, vida:.2, max:.2, color:'#ffe08a' });
  }
}
function dibujarAliado(g, t){
  if (!gatosListo) return;
  const pie = Math.round(g.y + 12), img = imgGato(g.gato);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(g.x, pie, 15, 5, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = ROL[g.rol].col + '99'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(g.x, pie, 17, 6, 0, 0, TAU); ctx.stroke();
  ctx.save(); ctx.imageSmoothingEnabled = false;
  if (!g.vivo){
    const [sx, sy, w, h] = GATOS_DIR[g.gato].ab[0];
    ctx.globalAlpha = .7; ctx.translate(Math.round(g.x), Math.round(pie - w / 2)); ctx.rotate(-Math.PI / 2);
    ctx.drawImage(img, sx, sy, w, h, -w / 2, -h / 2, w, h); ctx.restore(); return;
  }
  const fr = cuadroGato(g.gato, g.dir, g.mov ? Math.floor(g.paso / 14) : 0), [sx, sy, w, h, ax, ay] = fr;
  const flip = g.dir === 'lado' && g.flip;
  ctx.translate(Math.round(g.x), pie + (!g.mov && Math.sin(t / 420 + g.x) > .6 ? -1 : 0)); ctx.scale(flip ? -1 : 1, 1);
  dibujarEquipoGato(ctx, img, fr, g.dir, 1, g.equipo, 'atras');
  ctx.drawImage(g.golpe > 0 && g.rol === 'tanque' ? siluetaBlanca(img) : img, sx, sy, w, h, -ax, -ay, w, h);
  dibujarEquipoGato(ctx, img, fr, g.dir, 1, g.equipo, 'frente');
  ctx.restore();
  rotulo(g.nombre, g.x, pie - h - 10, '700 12px Rajdhani, sans-serif', '#a8d8ff', 'rgba(0,0,0,.85)', 3);
}
// marcos de grupo (a la derecha, bajo el minimapa)
let firmaGrupo = '';
function pintarGrupo(forzar){
  const c = $('grupo'); if (!c) return;
  const f = GRUPO.map(g => g.nombre + g.vivo).join('|');
  if (!forzar && f === firmaGrupo){
    // misma estructura: sólo se mueven las barras de vida
    c.querySelectorAll('.gm i b').forEach((b, i) => { const g = GRUPO[i]; if (!g) return; const w = Math.max(0, Math.round(g.hp / g.maxHp * 1000) / 10) + '%'; if (b.style.width !== w) b.style.width = w; });
    return;
  }
  firmaGrupo = f;
  c.classList.toggle('oculto', !GRUPO.length);
  c.innerHTML = GRUPO.map(g => `<div class="gm ${g.vivo ? '' : 'muerto'}"><span class="gm-rol" style="color:${ROL[g.rol].col}" title="${ROL[g.rol].n}">${ROL[g.rol].ic}</span>
    <div><b>${g.nombre}</b><i><b style="width:${Math.max(0, g.hp / g.maxHp * 100)}%"></b></i></div></div>`).join('');
}

// ---- buscador de mazmorras ----
const LFD = { buscando:false, t:0, total:0, rango:0, listo:false, tListo:0 };
function abrirBuscador(msg){
  if (!enJuego) return;
  const mio = rangoCazador(), hoy = PJ.lfdDia === diaHoy();
  let opciones = '';
  for (let r = 0; r <= mio; r++) opciones += `<option value="${r}" ${r === (LFD.rango ?? mio) ? 'selected' : ''}>Mazmorra aleatoria de rango ${RANGOS[r].l} (${RANGOS[r].nivel})</option>`;
  $('buscCuerpo').innerHTML = `<p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tu rol</span><b style="color:${ROL.dps.col}">${ROL.dps.ic} Daño</b></div>
    <div class="linea"><span>Grupo</span><b>${ROL.tanque.ic} Tanque · ${ROL.sanador.ic} Sanadora · tú</b></div>
    <label class="busc-sel">Mazmorra <select id="buscRango" ${LFD.buscando ? 'disabled' : ''}>${opciones}</select></label>
    <div class="linea"><span>Recompensa</span><b>2 emblemas${hoy ? '' : ' + bolsa del día (1.ª mazmorra: dinero y 2 emblemas más)'}</b></div>
    <p class="nota" style="margin-top:8px">${LFD.buscando ? `Buscando grupo… ${formatoTiempo(LFD.total)}` : 'Te juntamos con un tanque y una sanadora y te llevamos a una mazmorra aleatoria.'}</p>
    <div class="compras"><button class="btn ${LFD.buscando ? '' : 'principal'}" id="buscBtn">${LFD.buscando ? 'Salir de la cola' : 'Buscar grupo'}</button></div>`;
  $('buscBtn').onclick = () => {
    if (LFD.buscando){ LFD.buscando = false; actualizarOjo(); abrirBuscador('Saliste de la cola.'); return; }
    if (E.tipo === 'mazmorra'){ abrirBuscador('No puedes buscar grupo dentro de una mazmorra.'); return; }
    LFD.rango = +$('buscRango').value; LFD.buscando = true; LFD.t = rand(3, 7); LFD.total = 0; actualizarOjo();
    chat('Te uniste a la cola del buscador de mazmorras.', '#4fa3ff'); pantalla(null);
  };
  pantalla('pBuscador');
}
function updateBuscador(dt){
  if (LFD.listo){ LFD.tListo -= dt; $('listoT').textContent = Math.ceil(LFD.tListo); if (LFD.tListo <= 0){ LFD.listo = false; pantalla(null); chat('No aceptaste a tiempo: saliste de la cola.', '#ff8a9b'); actualizarOjo(); } return; }
  if (!LFD.buscando) return;
  LFD.total += dt; LFD.t -= dt;
  if (tSegOjo++ % 20 === 0) actualizarOjo();
  if (LFD.t <= 0 && E.tipo !== 'mazmorra' && !pantallaActual){
    LFD.buscando = false; LFD.listo = true; LFD.tListo = 40; sfx('logro');
    $('listoTxt').textContent = `Mazmorra aleatoria de rango ${RANGOS[LFD.rango].l}: ${RANGOS[LFD.rango].tema}`;
    pantalla('pListo'); actualizarOjo();
  }
}
let tSegOjo = 0;
function actualizarOjo(){
  const o = $('ojoLFD'); if (!o) return;
  o.classList.toggle('oculto', !LFD.buscando);
  if (LFD.buscando) o.querySelector('span').textContent = formatoTiempo(LFD.total);
}
function aceptarGrupo(){
  LFD.listo = false; actualizarOjo();
  entrarPortal({ x:0, y:0, punto:{ libre:true }, rango:LFD.rango, grupo:true });
}
function premioLFD(){
  if (!E.lfd) return;
  let em = 2, txt = '';
  if (PJ.lfdDia !== diaHoy()){ PJ.lfdDia = diaHoy(); em += 2; const oro = 8000 * (1 + E.rango); PJ.oro += oro; txt = ` y la bolsa del día (${dineroTxt(oro)})`; }
  darEmblemas(em, `buscador de mazmorras${txt}`);
}

