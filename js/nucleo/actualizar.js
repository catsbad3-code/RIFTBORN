// =====================================================
//  ACTUALIZAR
// =====================================================
function centrarCam(inmediato, dt = 0){
  const tx = E.w <= W ? (E.w - W) / 2 : clamp(P.x - W / 2, 0, E.w - W);
  const ty = E.h <= H ? (E.h - H) / 2 : clamp(P.y - 20 - H / 2, 0, E.h - H);
  if (inmediato){ cam.x = tx; cam.y = ty; }
  else { const k = 1 - Math.exp(-dt * 9); cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k; }
}

function update(dt){
  PJ.tiempo += dt;
  actualizarPrologo(dt); actualizarHistoria(dt);
  // movimiento
  let mx = 0, my = 0;
  if (keys.KeyW || keys.ArrowUp) my--;
  if (keys.KeyS || keys.ArrowDown) my++;
  if (keys.KeyA || keys.ArrowLeft) mx--;
  if (keys.KeyD || keys.ArrowRight) mx++;
  if (sticks.mov){
    const dx = sticks.mov.x - sticks.mov.ox, dy = sticks.mov.y - sticks.mov.oy, d = Math.hypot(dx, dy);
    if (d > 6){ const m = Math.min(d, 55) / 55; mx = dx / d * m; my = dy / d * m; }
  }
  const ml = Math.hypot(mx, my);
  if (ml > 1){ mx /= ml; my /= ml; }
  if (ml > .15){ P.ldx = mx / ml; P.ldy = my / ml; if (E.tipo !== 'mazmorra') P.ang = Math.atan2(my, mx); }
  const vel = (esInterior() ? D.vel * .8 : D.vel) * efMod.vel() * (enMontura() ? VEL_MONTURA : 1);
  if (Math.abs(mx) > .2) P.ladoMont = mx > 0;
  ratonYMontura();
  // aceleración y frenado suaves (independiente de los FPS)
  const resp = 1 - Math.exp(-dt * (ml > .05 ? 14 : 18));
  P.vx = (P.vx || 0) + (mx * vel - (P.vx || 0)) * resp;
  P.vy = (P.vy || 0) + (my * vel - (P.vy || 0)) * resp;
  if (ml < .05 && Math.hypot(P.vx, P.vy) < 4){ P.vx = 0; P.vy = 0; }
  const px = P.x, py = P.y;
  P.x += P.vx * dt; P.y += P.vy * dt;
  colisiones(P);
  // si una pared frena el paso, la velocidad se ajusta (deslizar sin "pegarse")
  if (dt > 0){ P.vx = (P.x - px) / dt; P.vy = (P.y - py) / dt; }
  const rapidez = Math.hypot(P.vx, P.vy);
  P.mx = P.vx / vel; P.my = P.vy / vel;
  P.paso = (P.paso || 0) + rapidez * dt;
  ambientePaso();
  // cambiar de lado solo con un movimiento claro (evita parpadeos)
  if (Math.abs(P.vx) > 30) P.mira = P.vx < 0;
  P.pose.t -= dt;
  for (const k in P.cdP) P.cdP[k] -= dt;
  P.tObj = (P.tObj || 0) - dt;

  P.hp = Math.min(D.maxHp, P.hp + (D.regHp + (E.tipo !== 'mazmorra' ? D.maxHp * .03 : 0)) * dt);
  P.en = Math.min(D.maxEn, P.en + D.regEn * efMod.regEn() * dt);
  updateRecurso(dt);
  updateFxPx(dt);
  if (P.escudo > 0){ P.tEscudo -= dt; if (P.tEscudo <= 0) P.escudo = 0; }
  if (estados.tormenta && E.tipo === 'mazmorra'){ P.tTorm = (P.tTorm || 0) - dt; if (P.tTorm <= 0){ P.tTorm = .5; golpeCirculo(P.x, P.y, 64, D.fis * .5); } }
  updateEfectos(dt);
  P.cd1 -= dt; P.cd2 -= dt; P.cdPoc -= dt; P.cdDev = (P.cdDev || 0) - dt; P.inv -= dt; P.golpe -= dt; P.gcd = Math.max(0, (P.gcd || 0) - dt);
  if (P.objetivo && !objetivoValido()) P.objetivo = null;

  // portales de la ciudad (avanzan siempre)
  timerPortal -= dt;
  if (timerPortal <= 0){ timerPortal = 30; if (portales.length < 5) crearPortal(); }
  asegurarPortalTitan(); asegurarGrietaMundo(); asegurarPuesto();
  for (const p of portales){ p.cierra -= dt; p.nace += dt; }
  for (const p of portales.filter(p => p.cierra <= 0)) quitarPortal(p);

  // interacción
  let cerca = null, md = 1e9;
  for (const it of E.inter){ const d = Math.hypot(P.x - it.x, P.y - it.y); if (d < it.r && d < md){ md = d; cerca = it; } }
  if (E.tipo === 'ciudad') for (const p of portales){
    const d = Math.hypot(P.x - p.x, P.y - p.y);
    if (d < 70 && d < md){ md = d; cerca = { texto:`Portal de rango ${RANGOS[p.rango].l}`, accion:() => abrirPanelPortal(p) }; }
  }
  if ((cerca && cerca.texto) !== (interCerca && interCerca.texto)){
    $('btnInteractuar').textContent = cerca ? cerca.texto + (esTactil ? '' : ' (E)') : '';
    $('btnInteractuar').classList.toggle('oculto', !cerca);
  }
  interCerca = cerca;

  if (E.tipo === 'mazmorra') updateMazmorra(dt);
  updateMascota(dt);
  if (E.npcs) updateCaminantes(dt);
  updateHuellas(dt);

  // botín
  for (const o of botin){
    const dx = P.x - o.x, dy = P.y - o.y, d = Math.hypot(dx, dy);
    if (d < 100){ const s = 380 * (1 - d / 100) + 80; o.x += dx / d * s * dt; o.y += dy / d * s * dt; }
    if (d < P.r + 8){
      if (o.t === 'obj'){
        if (PJ.bolsa.length >= TAM_BOLSA){ if (!o.aviso){ texto(P.x, P.y - 74, 'Tu bolsa está llena', '#ff8a9b', 14); chat('Tu bolsa está llena.', '#ff8a9b'); o.aviso = true; } continue; }
        PJ.bolsa.push(o.obj); sfx('botin'); texto(P.x, P.y - 78, o.obj.nombre, RAREZAS[o.obj.rareza].c, 15);
        chat(`Recibes botín: [${o.obj.nombre}]`, RAREZAS[o.obj.rareza].c);
      }
      else if (o.t === 'oro'){ const c = Math.round((o.c || 1) * (1 + bonoHerm() + bonoOroMascota())); PJ.oro += c; contar('oro', c); sfx('moneda', .05); texto(P.x + 14, P.y - 60, '+' + dineroTxt(c).replace(/ de /g, ' '), '#f2c46d', 13); chat(`Despojas ${dineroTxt(c)}.`, '#f2c46d'); }
      else if (o.t === 'cons'){ darApilable(o.k); if (o.k.startsWith('p_')) contar('partes'); const A = APILABLES[o.k]; texto(P.x, P.y - 78, A.n, RAREZAS[A.r].c, 14); chat(`Recibes botín: [${A.n}]`, RAREZAS[A.r].c); }
      else if (o.t === 'esencia') devorarEsencia(o);
      else { PJ.pociones++; texto(P.x, P.y - 74, '+1 poción', '#7dffa8', 15); chat('Recibes botín: [Poción de vida]', '#7dffa8'); }
      o.tomado = true;
    }
  }
  { const ahora = performance.now(); botin = botin.filter(o => !o.tomado && !(o.t === 'esencia' && ahora - o.t0 > 25000)); }   // las esencias se desvanecen a los 25 s

  for (const p of particulas){ p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .92; p.vy *= .92; p.vida -= dt; }
  particulas = particulas.filter(p => p.vida > 0);
  for (const t of textos){ t.y -= 38 * dt; t.vida -= dt; }
  textos = textos.filter(t => t.vida > 0);
  for (const f of efectos){ f.vida -= dt; if (f.sigue){ f.x = P.x + f.sigue.dx; f.y = P.y + f.sigue.dy; } }
  efectos = efectos.filter(f => f.vida > 0);
  shake *= .87;

  centrarCam(false, dt);
  timerGuardado += dt;
  if (timerGuardado > 45) guardar();
  actualizarHUD();
}

function updateMazmorra(dt){
  if (!esTactil) apuntar();
  if (mouse.izq || holdAtk || autoAtaque()) usarHab(1);

  // exploración
  const pcx = Math.floor(P.x / T), pcy = Math.floor(P.y / T);
  for (let y = pcy - 5; y <= pcy + 5; y++) for (let x = pcx - 6; x <= pcx + 6; x++){
    if (x < 0 || y < 0 || x >= E.cols || y >= E.rows) continue;
    const i = y * E.cols + x;
    if (E.explorado[i]) continue;
    E.explorado[i] = 1;
    E.miniCtx.fillStyle = E.solido[i] ? '#2a2440' : '#8a82a8';
    E.miniCtx.fillRect(x, y, 1, 1);
  }

  timerCampo -= dt;
  // el mapa de caminos solo se rehace cuando el gato cambia de casilla (o cada 2 s por si acaso)
  if (timerCampo <= 0 || !campo || campo.x !== pcx || campo.y !== pcy || campo.E !== E){ timerCampo = 2; campo = bfs(E, pcx, pcy); campo.x = pcx; campo.y = pcy; campo.E = E; }

  for (const e of enemigos){
    const U = blancoEnemigo(e, dt);
    const dx = U.x - e.x, dy = U.y - e.y, d = Math.hypot(dx, dy) || 1;
    const lento = e.lento > 0 ? .45 : 1;
    e.lento -= dt; e.flash -= dt; e.cd -= dt; e.cdGolpe -= dt;
    e.aturdido = (e.aturdido || 0) - dt; e.raiz = (e.raiz || 0) - dt; e.vuln = (e.vuln || 0) - dt;
    if (e.dot){ e.dot.t -= dt; e.dot.tick -= dt; if (e.dot.tick <= 0){ e.dot.tick = 1; herir(e, e.dot.dps, -1); if (e.muerto) continue; } if (e.dot.t <= 0) e.dot = null; }
    if (e.aturdido > 0){ e.mueve = false; continue; }
    if (e.jefe){ actualizarJefe(e, dx, dy, d, dt); continue; }

    if (!e.aggro && d < 300 && lineaVision(e.x, e.y, U.x, U.y)) e.aggro = true;
    // si un monstruo del grupo entra en combate, sus compañeros también (como en WoW)
    if (e.aggro && e.grupo !== undefined && !e.avisoGrupo){ e.avisoGrupo = true; for (const o of enemigos) if (o !== e && o.grupo === e.grupo && !o.aggro){ o.aggro = true; o.avisoGrupo = true; } }
    if (e.aggro && d > 900) e.aggro = false;

    let vx = 0, vy = 0, vel = e.vel * lento;
    if (e.aggro && ataqueMonstruo(e, dx, dy, d, dt, lento)){ e.mueve = true; continue; }
    if (e.aggro){
      [vx, vy] = direccionHacia(e, U);
      if (e.rango){
        const vision = lineaVision(e.x, e.y, U.x, U.y);
        if (vision && d < 190){ vx = -dx / d; vy = -dy / d; }
        else if (vision && d < 300){ vx = -dy / d * .6; vy = dx / d * .6; }
        if (vision && e.cd <= 0 && d < 480){
          e.cd = rand(1.8, 2.6);
          const a = Math.atan2(dy, dx);
          e.tiros = (e.tiros || 0) + 1;
          const tela = e.tiros % 3 === 0;
          proysE.push({ x:e.x, y:e.y, vx:Math.cos(a) * (tela ? 200 : 260), vy:Math.sin(a) * (tela ? 200 : 260), r:tela ? 10 : 6, dmg:e.dmg * (tela ? .5 : 1), vida:2.6, color:tela ? '#f2f2f2' : e.color, src:e, tela });
        }
      }
    } else if (e.ruta){
      // patrulla: va y vuelve entre dos puntos, despacio
      vel *= .35;
      const p = e.ruta[e.tramo], wd = Math.hypot(p.x - e.x, p.y - e.y);
      if (wd < 12){ e.tramo = 1 - e.tramo; e.cd = Math.max(e.cd, rand(1, 2.5)); }
      else if (e.cd < 0){ vx = (p.x - e.x) / wd; vy = (p.y - e.y) / wd; }
    } else {
      // quieto en su sitio, con algún paso corto (no se van juntando con otros grupos)
      vel *= .25;
      const wd = Math.hypot(e.wx - e.x, e.wy - e.y);
      if (wd < 6 || Math.random() < .003){ if (Math.random() < .5){ e.wx = e.hx + rand(-34, 34); e.wy = e.hy + rand(-34, 34); } else { e.wx = e.x; e.wy = e.y; } }
      else { vx = (e.wx - e.x) / wd; vy = (e.wy - e.y) / wd; }
    }
    if (!e.aggro && e.avisoGrupo) e.avisoGrupo = false;
    if (e.raiz > 0){ vx = 0; vy = 0; }
    e.x += vx * vel * dt; e.y += vy * vel * dt;
    e.mueve = Math.abs(vx) + Math.abs(vy) > .05;
    colisiones(e);
    if (d < e.r + U.r + 4 && e.cdGolpe <= 0){ e.cdGolpe = 1; pegar(U, false, e.dmg * .6, e); }
  }
  for (let i = 0; i < enemigos.length; i++){
    const a = enemigos[i];
    for (let j = i + 1; j < enemigos.length; j++){
      const b = enemigos[j], dx = b.x - a.x, dy = b.y - a.y, m = a.r + b.r, d2 = dx * dx + dy * dy;
      if (d2 < m * m && d2 > 0){
        const d = Math.sqrt(d2), p = (m - d) / 2, ux = dx / d, uy = dy / d, wa = a.jefe ? 0 : 1, wb = b.jefe ? 0 : 1;
        a.x -= ux * p * wa; a.y -= uy * p * wa; b.x += ux * p * wb; b.y += uy * p * wb;
      }
    }
  }
  enemigos = enemigos.filter(e => !e.muerto);

  updateAliados(dt);
  updateGrupo(dt);
  for (const p of proys){
    if (p.perfora){
      p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
      if (solidoEn(p.x, p.y)){ p.vida = 0; chispas(p.x, p.y, p.color, 10, 140); continue; }
      for (const e of enemigos){
        if (e.muerto || p.hits.has(e) || Math.hypot(e.x - p.x, e.y - p.y) > e.r + p.r) continue;
        p.hits.add(e); herir(e, p.dmg);
        if (p.empuje && !e.jefe){ const d = Math.hypot(p.vx, p.vy); e.x += p.vx / d * p.empuje; e.y += p.vy / d * p.empuje; colisiones(e); }
        chispas(e.x, e.y - 10, p.color, 6, 140);
      }
      continue;
    }
    if (p.bola){
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; p.vy *= .985; p.vida -= dt; p.tick -= dt;
      if (solidoEn(p.x, p.y)){ p.vx = p.vy = 0; }
      if (p.tick <= 0){
        p.tick = .25;
        for (const e of enemigos){ if (Math.hypot(p.x - e.x, p.y - e.y) < 70 + e.r){ herir(e, p.dmg); e.lento = 1; } }
      }
      for (const e of enemigos){
        const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
        if (!e.jefe && d < 130 && d > 8){ e.x += dx / d * 90 * dt; e.y += dy / d * 90 * dt; }
      }
      if (Math.random() < .5) chispas(p.x + rand(-25, 25), p.y + rand(-25, 25), '#9fd8ff', 1, 60);
      if (p.vida <= 0){
        golpeCirculo(p.x, p.y, 85, p.dmg * 2.5);
        chispas(p.x, p.y, '#4f9aff', 30, 240); fxAnillo(p.x, p.y, 10, 90, '#9fd8ff', .35); shake = Math.max(shake, 6);
      }
      continue;
    }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
    let choca = solidoEn(p.x, p.y);
    if (!choca) for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r + 6){ choca = true; break; }
    if (choca || p.vida <= 0){
      if (choca){
        golpeCirculo(p.x, p.y, p.aoe, p.dmg, { lento:p.lento, quema:p.quema });
        chispas(p.x, p.y - (p.alt || 0), p.color, 14, 170);
      }
      p.vida = 0;
    }
  }
  proys = proys.filter(p => p.vida > 0);
  enemigos = enemigos.filter(e => !e.muerto);

  for (const p of proysE){
    p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
    if (solidoEn(p.x, p.y)) p.vida = 0;
    else if (golpeAliado(p)) p.vida = 0;
    else if (Math.hypot(p.x - P.x, p.y - P.y) < p.r + P.r - 2){ golpearJugador(p.dmg, p.src); if (p.tela){ ponerEfecto('agi_dn', 2.5); texto(P.x, P.y - 90, '¡Atrapado en la telaraña!', '#f2f2f2', 13); } p.vida = 0; }
  }
  proysE = proysE.filter(p => p.vida > 0);
  if (peligros.length) updatePeligros(dt);
}

