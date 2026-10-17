// =====================================================
//  MAZMORRAS (CUEVAS)
// =====================================================
// línea libre entre dos casillas de una grilla (para las rutas de patrulla)
function lineaGrilla(G, [x1, y1], [x2, y2]){
  const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2);
  for (let i = 1; i < n; i++){ const x = Math.round(x1 + (x2 - x1) * i / n), y = Math.round(y1 + (y2 - y1) * i / n); if (G.solido[y * G.cols + x]) return false; }
  return true;
}
// coloca un grupo de 1 a 3 monstruos en formación alrededor de una casilla, sin encimarse
function crearGrupoMonstruos(R, [cx, cy], idGrupo, patrulla){
  const n = Math.random() < .4 ? 1 : Math.random() < .67 ? 2 : 3, tipo = R.enemigos[Math.random() * R.enemigos.length | 0];
  const a0 = rand(0, TAU);
  for (let k = 0; k < n; k++){
    const a = a0 + k * TAU / n, d = n === 1 ? 0 : 30 + n * 6;
    const t = Math.random() < .7 ? tipo : R.enemigos[Math.random() * R.enemigos.length | 0];
    crearEnemigo(t, (cx + .5) * T + Math.cos(a) * d, (cy + .5) * T + Math.sin(a) * d * .8);
    const e = enemigos[enemigos.length - 1]; e.grupo = idGrupo;
    if (patrulla){ e.ruta = [{ x:e.x, y:e.y }, { x:(patrulla[0] + .5) * T + Math.cos(a) * d, y:(patrulla[1] + .5) * T + Math.sin(a) * d * .8 }]; e.tramo = 1; }
  }
}
function crearMazmorra(rango){
  const R = RANGOS[rango];
  let G, region, intentos = 0;
  while (true){
    G = nuevaGrilla(56, 56, 1); G.tipo = 'mazmorra'; G.rango = rango; G.R = R; G.nombre = `Portal rango ${R.l}: ${R.tema}`;
    for (let y = 1; y < G.rows - 1; y++) for (let x = 1; x < G.cols - 1; x++) G.solido[y * G.cols + x] = Math.random() < .45 ? 1 : 0;
    for (let it = 0; it < 5; it++){
      const nuevo = new Uint8Array(G.solido);
      for (let y = 1; y < G.rows - 1; y++) for (let x = 1; x < G.cols - 1; x++){
        let n = 0;
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) n += G.solido[(y + oy) * G.cols + x + ox];
        nuevo[y * G.cols + x] = n >= 5 ? 1 : 0;
      }
      G.solido = nuevo;
    }
    // quedarse con la región abierta más grande
    const visto = new Uint8Array(G.cols * G.rows); let mejor = [];
    for (let i = 0; i < G.solido.length; i++){
      if (G.solido[i] || visto[i]) continue;
      const pila = [i], reg = []; visto[i] = 1;
      while (pila.length){
        const j = pila.pop(); reg.push(j);
        const x = j % G.cols, y = (j / G.cols) | 0;
        for (const k of [j - 1, j + 1, j - G.cols, j + G.cols]){
          const kx = k % G.cols;
          if (k < 0 || k >= G.solido.length || G.solido[k] || visto[k] || Math.abs(kx - x) > 1) continue;
          visto[k] = 1; pila.push(k);
        }
      }
      if (reg.length > mejor.length) mejor = reg;
    }
    region = mejor;
    if (region.length > 950 || ++intentos > 25) break;
  }
  const enRegion = new Uint8Array(G.cols * G.rows); region.forEach(i => enRegion[i] = 1);
  for (let i = 0; i < G.solido.length; i++) if (!enRegion[i]) G.solido[i] = 1;

  const tallar = (cx, cy, r) => { for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++)
    if (x > 0 && y > 0 && x < G.cols - 1 && y < G.rows - 1 && Math.hypot(x - cx, y - cy) <= r + .3) G.solido[y * G.cols + x] = 0; };

  // inicio: la casilla abierta más a la izquierda
  let ini = region[0];
  for (const i of region) if (i % G.cols < ini % G.cols) ini = i;
  const sx = ini % G.cols, sy = (ini / G.cols) | 0;
  tallar(sx + 1, sy, 2);
  let dist = bfs(G, sx + 1, sy), jefe = 0;
  for (let i = 0; i < dist.length; i++) if (dist[i] > dist[jefe]) jefe = i;
  const jx = jefe % G.cols, jy = (jefe / G.cols) | 0;
  tallar(jx, jy, 4);
  dist = bfs(G, sx + 1, sy);

  G.inicio = { x:(sx + 1.5) * T, y:(sy + .5) * T };
  G.jefePos = { x:(jx + .5) * T, y:(jy + .5) * T };
  G.salida = { x:G.inicio.x, y:G.inicio.y };
  G.inter.push({ x:G.salida.x, y:G.salida.y, r:46, texto:'Salir de la mazmorra', accion:() => salirMazmorra(false) });

  // objetos de naturaleza según el tipo de cueva (pocos y sin bloquear el paso)
  G.props = [];
  const tiposDeco = TEXTURA_RANGO[rango].objetos;
  for (let k = 0, intentos = 0; k < 22 && intentos < 400; intentos++){
    const i = Math.random() * G.solido.length | 0;
    if (G.solido[i]) continue;
    const cx = i % G.cols, cy = (i / G.cols) | 0;
    if (!G.solido[(cy - 1) * G.cols + cx]) continue; // pegado a una pared
    if (Math.hypot(cx - sx, cy - sy) < 4 || Math.hypot(cx - jx, cy - jy) < 5) continue;
    const n = tiposDeco[Math.random() * tiposDeco.length | 0];
    G.props.push({ terr:true, spr:n, x:(cx + .5) * T, y:(cy + .55) * T, esc:n === 'pino' ? .55 : .42 });
    k++;
  }
  // vetas de mineral junto a las paredes (se extraen con E)
  const MIN = MINERAL_RANGO[rango];
  for (let k = 0, intentos = 0; k < 5 && intentos < 600; intentos++){
    const i = Math.random() * G.solido.length | 0;
    if (G.solido[i]) continue;
    const cx = i % G.cols, cy = (i / G.cols) | 0;
    if (!G.solido[(cy - 1) * G.cols + cx]) continue;
    if (Math.hypot(cx - sx, cy - sy) < 5 || Math.hypot(cx - jx, cy - jy) < 5) continue;
    const vx = (cx + .5) * T, vy = (cy + .6) * T;
    if (G.props.some(p => Math.hypot(p.x - vx, p.y - vy) < T * 4)) continue;
    const clave = Math.random() < .25 ? 'm_zinc' : MIN;
    const veta = { veta:true, clave, x:vx, y:vy };
    const it = { x:vx, y:vy, r:52, texto:`Extraer ${APILABLES[clave].n.toLowerCase()}`, accion:() => {
      const n = 1 + (Math.random() * 3 | 0); darApilable(clave, n);
      chispas(vx, vy - 14, '#d8d0c0', 16, 160); shake = Math.max(shake, 4);
      texto(P.x, P.y - 78, `+${n} ${APILABLES[clave].n}`, RAREZAS[APILABLES[clave].r].c, 14);
      chat(`Extraes ${n} × [${APILABLES[clave].n}].`, RAREZAS[APILABLES[clave].r].c);
      E.props = E.props.filter(p => p !== veta); E.inter = E.inter.filter(x => x !== it); guardar();
    } };
    G.props.push(veta); G.inter.push(it); G.obs.push({ x:vx, y:vy - 4, r:14 });
    k++;
  }
  // decoración del suelo
  for (let i = 0; i < G.solido.length; i++){
    if (G.solido[i] || Math.random() > .07) continue;
    G.deco.push({ x:(i % G.cols + Math.random()) * T, y:(((i / G.cols) | 0) + Math.random()) * T, t:Math.random() * 3 | 0, s:rand(.6, 1.3) });
  }

  // enemigos repartidos por toda la cueva (como en WoW): cada grupo en una zona abierta y lo más lejos posible de los demás
  const abierta = (x, y) => { for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (G.solido[(y + oy) * G.cols + x + ox]) return false; return true; };
  const candidatos = [];
  for (let i = 0; i < dist.length; i++){
    if (dist[i] < 9) continue;
    const x = i % G.cols, y = (i / G.cols) | 0;
    if (Math.hypot(x - jx, y - jy) < 7 || !abierta(x, y)) continue;
    candidatos.push([x, y]);
  }
  // muestreo por el punto más lejano: cubre toda la cueva sin amontonar grupos
  const puestos = [], total = 14 + rango, fijos = [[sx + 1, sy], [jx, jy]];
  const minDist = ([x, y]) => Math.min(...[...fijos, ...puestos].map(([px, py]) => Math.hypot(px - x, py - y)));
  while (puestos.length < total && candidatos.length){
    let mejor = null, md = -1;
    for (let k = 0; k < 60; k++){ const c = candidatos[Math.random() * candidatos.length | 0], d = minDist(c); if (d > md){ md = d; mejor = c; } }
    if (md < 5) break;
    puestos.push(mejor);
  }
  // algunos grupos patrullan entre su sitio y otro lejano
  G.patrullas = [];
  for (let k = 0; k < 2 + (rango > 2 ? 1 : 0) && candidatos.length; k++){
    const a = puestos[Math.random() * puestos.length | 0]; if (!a) break;
    let b = null, md = 0;
    for (let n = 0; n < 40; n++){ const c = candidatos[Math.random() * candidatos.length | 0], d = Math.hypot(c[0] - a[0], c[1] - a[1]); if (d > md && d < 18 && lineaGrilla(G, a, c)){ md = d; b = c; } }
    if (b && md > 6) G.patrullas.push([a, b]);
  }
  G.manadas = puestos;

  // minimapa con niebla
  G.explorado = new Uint8Array(G.cols * G.rows);
  G.mini = document.createElement('canvas'); G.mini.width = G.cols; G.mini.height = G.rows;
  G.miniCtx = G.mini.getContext('2d');
  return G;
}

function entrarPortal(portal){
  pantalla(null);
  quitarPortal(portal);
  $('fundido').classList.add('ver');
  setTimeout(() => {
    E = crearMazmorra(portal.rango); limpiarEscena(); modoCombate(true);
    colocar(E.inicio.x + 70, E.inicio.y);
    const R = E.R;
    E.manadas.forEach((pos, i) => {
      const pat = (E.patrullas || []).find(([a]) => a === pos);
      crearGrupoMonstruos(R, pos, i, pat ? pat[1] : null);
    });
    crearJefe();
    if (portal.semanal) hacerTitan();
    GRUPO = []; if (portal.grupo){ crearGrupo(); E.lfd = true; } else pintarGrupo(true);
    if (portal.mundo) hacerJefeMundo();
    $('fundido').classList.remove('ver');
    banner(`Portal de rango ${R.l}`, R.tema);
    chat(`Entras en un portal de rango ${R.l}: ${R.tema}.`, R.color);
  }, 600);
}

function salirMazmorra(despejada){
  $('fundido').classList.add('ver');
  setTimeout(() => { irCiudad('mazmorra'); $('fundido').classList.remove('ver'); if (!despejada) banner('Has escapado del portal', 'La mazmorra quedó sin despejar'); }, 600);
}

function mazmorraDespejada(){
  const R = E.R;
  E.despejada = true;
  avisarHistoria('jefe');
  PJ.limpias[R.l]++; PJ.jefesTotal++; contar('mazmorras'); darEmblemas(E.semanal ? 5 : 1, E.semanal ? 'titán semanal' : 'jefe derrotado'); premioTitan(); premioColeccion(E.rango, !!E.semanal); premioLFD(); premioJefeMundo();
  const oro = Math.round(80 * R.escala * rand(95, 110)), xp = Math.max(1, Math.round(120 * R.escala * factorXpPortal()));
  PJ.oro += oro;
  E.inter.push({ x:E.jefePos.x, y:E.jefePos.y, r:50, texto:'Volver a la ciudad', accion:() => salirMazmorra(true) });
  E.portalFinal = { x:E.jefePos.x, y:E.jefePos.y };
  banner('Mazmorra despejada', `Recompensa: ${dineroTxt(oro)} y ${xp} de experiencia. Un portal de salida apareció.`);
  chat(`${R.jefe} ha sido derrotado. Mazmorra despejada.`, '#ffd76a');
  chat(`Recibes ${dineroTxt(oro)}.`, '#f2c46d');
  ganarXP(xp, true);
  guardar();
}

function modoCombate(on){ document.body.classList.toggle('combate', on); }

// =====================================================
//  ENEMIGOS
// =====================================================
// dificultad de todas las mazmorras: los monstruos y los jefes aguantan y pegan más (el oro y la experiencia no cambian)
const DIFICULTAD = { vida:1.4, dano:1.3, vel:1.08 };
function crearEnemigo(tipo, x, y, aggro = false){
  const T0 = ENEM[tipo], s = E.R.escala, hp = Math.round(T0.hp * s * DIFICULTAD.vida);
  const e = { tipo, nombre:T0.n, x, y, r:T0.r, hp, maxHp:hp, dmg:T0.dmg * s * DIFICULTAD.dano, vel:T0.vel * DIFICULTAD.vel, color:T0.color, rango:!!T0.rango,
    xp:Math.round(T0.xp * s), oro:Math.round(T0.oro * s), cd:rand(.5, 2), cdGolpe:0, aggro, hx:x, hy:y, wx:x, wy:y, flash:0, lento:0 };
  colisiones(e); enemigos.push(e);
}
// cada tipo de monstruo ataca distinto: preparan el golpe (aviso rojo) y luego lo lanzan
const ATAQUES = {
  slime:     { alcance:140, carga:.5, golpe:.32, fin:.45, cd:[2, 2.8] },   // salto aplastante
  mantis:    { alcance:76,  carga:.32, golpe:.3, fin:.3,  cd:[1.4, 2] },   // doble tajo
  escorpion: { alcance:118, carga:.55, golpe:.2, fin:.5,  cd:[2.2, 3] },   // aguijonazo en línea
  jabali:    { alcance:360, min:110, carga:.65, golpe:.7, fin:.8, cd:[3, 4] } // embestida
};
function ataqueMonstruo(e, dx, dy, d, dt, lento){
  const U = e.blanco || P; // a quién ataca (jugador o un aliado)
  const n = ENEM[e.tipo] && ENEM[e.tipo].spr, A = ATAQUES[n];
  if (!A) return false;
  if (!e.at){
    if (e.cd > 0 || d > A.alcance || (A.min && d < A.min) || !lineaVision(e.x, e.y, U.x, U.y)) return false;
    e.at = { fase:'carga', t:A.carga, ux:dx / d, uy:dy / d, tx:U.x, ty:U.y, golpeo:0 };
    if (Math.abs(dx) > 2) e.face = dx > 0 ? 1 : -1;
    return true;
  }
  const at = e.at; at.t -= dt;
  if (at.fase === 'carga'){
    if (n !== 'jabali' && n !== 'escorpion'){ const d2 = Math.hypot(U.x - e.x, U.y - e.y) || 1; at.ux = (U.x - e.x) / d2; at.uy = (U.y - e.y) / d2; at.tx = U.x; at.ty = U.y; }
    if (at.t <= 0){ at.fase = 'golpe'; at.t = A.golpe; }
    return true;
  }
  if (at.fase === 'golpe'){
    const pd = Math.hypot(U.x - e.x, U.y - e.y);
    if (n === 'slime'){
      e.x += at.ux * 430 * lento * dt; e.y += at.uy * 430 * lento * dt; colisiones(e);
      if (!at.golpeo && pd < e.r + U.r + 10){ at.golpeo = 1; pegar(U, true, e.dmg * 1.3, e); }
      if (at.t <= 0){ chispas(e.x, e.y + 8, '#6fd36b', 10, 120); }
    } else if (n === 'mantis'){
      const golpes = [A.golpe, A.golpe * .45];
      for (let k = 0; k < 2; k++){
        if (at.golpeo === k && at.t <= golpes[k]){
          at.golpeo++;
          const ang = Math.atan2(U.y - e.y, U.x - e.x) - Math.atan2(at.uy, at.ux);
          if (pd < 92 && Math.cos(ang) > .2){ pegar(U, true, e.dmg * .9, e); }
          chispas(e.x + at.ux * 40, e.y + at.uy * 40, '#e8e0a0', 6, 160);
        }
      }
    } else if (n === 'escorpion'){
      if (!at.golpeo){
        at.golpeo = 1;
        const px = U.x - e.x, py = U.y - e.y, largo = px * at.ux + py * at.uy, lado = Math.abs(px * at.uy - py * at.ux);
        if (largo > -10 && largo < 135 && lado < 26){ pegar(U, true, e.dmg * 1.5, e); if (U === P) ponerEfecto('def_dn', 4); }
        chispas(e.x + at.ux * 110, e.y + at.uy * 110, '#ff6a3d', 8, 160);
      }
    } else if (n === 'jabali'){
      const ox = e.x, oy = e.y;
      e.x += at.ux * 520 * lento * dt; e.y += at.uy * 520 * lento * dt; colisiones(e);
      if (Math.hypot(e.x - ox, e.y - oy) < 520 * lento * dt * .3){ at.fase = 'fin'; at.t = A.fin + .6; shake = Math.max(shake, 6); chispas(e.x + at.ux * e.r, e.y + at.uy * e.r, '#c8b49a', 12, 160); texto(e.x, e.y - 50, 'Aturdido', '#ffe3a1', 13); return true; }
      if (!at.golpeo && pd < e.r + U.r + 8){
        at.golpeo = 1; pegar(U, true, e.dmg * 1.6, e);
        U.x += at.ux * 60; U.y += at.uy * 60; colisiones(U); shake = Math.max(shake, 10);
      }
    }
    if (at.fase === 'golpe' && at.t <= 0){ at.fase = 'fin'; at.t = A.fin; }
    return true;
  }
  if (at.t <= 0){ e.at = null; e.cd = rand(A.cd[0], A.cd[1]); }
  return true;
}
// el aviso rojo de ataque está desactivado: en las mazmorras no se anticipa por dónde atacará el monstruo
const AVISOS_ATAQUE = false;
function dibujarAviso(e){
  const at = e.at; if (!AVISOS_ATAQUE || !at || at.fase !== 'carga') return;
  const n = ENEM[e.tipo] && ENEM[e.tipo].spr, A = ATAQUES[n], k = 1 - at.t / A.carga;
  ctx.save(); ctx.globalAlpha = .18 + .3 * k; ctx.fillStyle = '#ff3040'; ctx.strokeStyle = '#ff3040'; ctx.lineWidth = 2;
  if (n === 'slime'){ ctx.beginPath(); ctx.ellipse(at.tx, at.ty + 8, 34 * k + 10, 14 * k + 4, 0, 0, TAU); ctx.fill(); }
  else if (n === 'mantis'){ const a = Math.atan2(at.uy, at.ux); ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.arc(e.x, e.y, 92, a - 1.2, a + 1.2); ctx.closePath(); ctx.fill(); }
  else {
    const largo = n === 'jabali' ? 380 : 135, ancho = n === 'jabali' ? e.r * 2 : 26;
    ctx.translate(e.x, e.y); ctx.rotate(Math.atan2(at.uy, at.ux));
    ctx.fillRect(0, -ancho / 2, largo, ancho); ctx.globalAlpha = .6; ctx.fillRect(0, -ancho / 2, largo * k, ancho);
  }
  ctx.restore();
}
function crearJefe(){
  const R = E.R, s = R.escala, hp = Math.round(750 * s * DIFICULTAD.vida);
  jefeVivo = { jefe:true, nombre:R.jefe, x:E.jefePos.x, y:E.jefePos.y, r:40, hp, maxHp:hp, dmg:16 * s * DIFICULTAD.dano, vel:80, color:R.acento,
    xp:Math.round(160 * s), oro:Math.round(120 * s), cd:2, cdGolpe:0, aggro:false, flash:0, lento:0, patron:0, aviso:0, carga:0, cdir:0 };
  enemigos.push(jefeVivo);
  $('jefeNombre').textContent = R.jefe;
}

const DIR8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function direccionHacia(e, U = P){
  const dx = U.x - e.x, dy = U.y - e.y, d = Math.hypot(dx, dy) || 1;
  if (d < 240 && lineaVision(e.x, e.y, U.x, U.y)) return [dx / d, dy / d];
  if (!campo) return [dx / d, dy / d];
  const cx = Math.floor(e.x / T), cy = Math.floor(e.y / T);
  let md = campo[cy * E.cols + cx]; if (md < 0) md = 1e9;
  let mejor = null;
  for (const [ox, oy] of DIR8){
    const nx = cx + ox, ny = cy + oy;
    if (esSolido(nx, ny)) continue;
    if (ox && oy && (esSolido(cx + ox, cy) || esSolido(cx, cy + oy))) continue;
    const v = campo[ny * E.cols + nx];
    if (v >= 0 && v < md){ md = v; mejor = [nx, ny]; }
  }
  if (!mejor) return [dx / d, dy / d];
  const tx = (mejor[0] + .5) * T - e.x, ty = (mejor[1] + .5) * T - e.y, td = Math.hypot(tx, ty) || 1;
  return [tx / td, ty / td];
}

