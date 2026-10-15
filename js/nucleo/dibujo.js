// =====================================================
//  DIBUJO PRINCIPAL
// =====================================================
function draw(t){
  if (!enJuego){ ocultarNoche(); dibujarMenuFondo(t); return; }
  ctx.fillStyle = '#07050d'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const px1 = v => Math.round(v * DPR) / DPR;
  ctx.translate(px1(-cam.x + (Math.random() - .5) * shake), px1(-cam.y + (Math.random() - .5) * shake));

  if (E.tipo === 'ciudad') dibujarCiudad(t);
  else if (E.tipo === 'posada') dibujarPosadaInt(t);
  else if (E.tipo === 'tienda') dibujarTiendaInt(t);
  else if (E.tipo === 'asociacion') dibujarAsociacionInt(t);
  else if (E.tipo === 'casino') dibujarCasinoInt(t);
  else dibujarMazmorra(t);
  dibujarHuellas();
  dibujarAdornosEvento(t);

  for (const o of botin){
    if (o.t === 'oro'){
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(o.x, o.y + 7, 8, 3, 0, 0, TAU); ctx.fill();
      if (MONEDAS_IMG.complete && MONEDAS_IMG.width){ const k = (o.c || 1) >= 10000 ? 0 : (o.c || 1) >= 100 ? 1 : 2; ctx.drawImage(MONEDAS_IMG, k * 32, 0, 32, 32, o.x - 9, o.y - 11, 18, 18); }
      else { ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, TAU); ctx.fill(); }
    }
    else if (o.t === 'obj'){
      const c = RAREZAS[o.obj.rareza].c, b = 1 + .15 * Math.sin(t / 200 + o.x);
      const g = ctx.createRadialGradient(o.x, o.y, 2, o.x, o.y, 26 * b);
      g.addColorStop(0, c + 'aa'); g.addColorStop(1, c + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, 26 * b, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(o.x, o.y + 10, 11, 4, 0, 0, TAU); ctx.fill();
      dibujarIc3('cofre', o.x, o.y - 2, 26);
    }
    else if (o.t === 'esencia') dibujarEsencia(o, t);
    else {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(o.x, o.y + 9, 9, 3, 0, 0, TAU); ctx.fill();
      dibujarIc3(o.t === 'cons' ? o.k : 'pocion', o.x, o.y - 1, 22);
    }
  }

  dibujarEfectos(true);
  if (peligros.length) dibujarPeligros(t);

  // un aro marca a tu objetivo (en el teléfono, también al enemigo al que apuntas solo)
  if (E.tipo === 'mazmorra'){
    const o = esTactil ? objetivoTactil(360) : (objetivoValido() ? P.objetivo : null);
    if (o){
      const pul = 1 + .08 * Math.sin(t / 140), rr = Math.max(34, (o.r || 20) * 1.4) * pul;
      ctx.strokeStyle = o === P.objetivo ? 'rgba(255,215,106,.95)' : 'rgba(255,90,90,.85)'; ctx.lineWidth = 3;
      ctx.setLineDash([9, 6]); ctx.lineDashOffset = -t / 40;
      ctx.beginPath(); ctx.ellipse(o.x, o.y + (o.r || 20) * .6, rr, rr * .42, 0, 0, TAU); ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
    }
  }

  // entidades ordenadas por profundidad
  const lista = [{ y:P.y, f:() => dibujarJugador(t) }];
  if (M) lista.push({ y:M.y, f:() => dibujarMascota(t) });
  if (E.tipo === 'ciudad') for (const p of portales) lista.push({ y:p.y + 40, f:() => dibujarPortalCiudad(p, t) });
  if (E.props) for (const pr of E.props){ if (pr.x > cam.x - 200 && pr.x < cam.x + W + 200 && pr.y > cam.y - 40 && pr.y < cam.y + H + 300) lista.push({ y:pr.y, f:() => dibujarProp(pr) }); }
  for (const s of soldados) lista.push({ y:s.y, f:() => s.elemental ? dibujarElemental(s, t) : dibujarSoldado(s, t) });
  if (E.tipo === 'mazmorra') for (const g of GRUPO) lista.push({ y:g.y, f:() => dibujarAliado(g, t) });
  if (E.npcs) for (const n of E.npcs) lista.push({ y:n.y, f:() => (n.spr || n.cam) ? dibujarNPCSprite(n, t) : dibujarNPC(n.x, n.y, n.ropa, n.pelo, t) });
  const ahora = performance.now();
  cadaveres = cadaveres.filter(c => ahora - c.t0 < 1100);
  if (E.tipo === 'mazmorra') for (const c of cadaveres) lista.push({ y:c.pie - 30, f:() => dibujarCadaver(c) });
  for (const e of enemigos){
    if (e.x < cam.x - 80 || e.x > cam.x + W + 80 || e.y < cam.y - 80 || e.y > cam.y + H + 80) continue;
    lista.push({ y:e.y, f:() => dibujarEnemigo(e) });
  }
  lista.sort((a, b) => a.y - b.y).forEach(o => o.f());
  // flecha sobre la cabeza del objetivo
  if (E.tipo === 'mazmorra'){
    const o = esTactil ? objetivoTactil(360) : (objetivoValido() ? P.objetivo : null);
    if (o){
      const yy = o.y - altoDe(o) - 14 + 4 * Math.sin(t / 160);
      ctx.fillStyle = o === P.objetivo ? '#ffd76a' : '#ff6b6b'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o.x - 9, yy - 10); ctx.lineTo(o.x + 9, yy - 10); ctx.lineTo(o.x, yy); ctx.closePath(); ctx.stroke(); ctx.fill();
    }
  }
  dibujarLucesCiudad(t);
  if (E.etiquetas){
    for (const et of E.etiquetas) rotulo(et.txt, et.x, et.y, '600 15px Marcellus, Georgia, serif', '#e9e4ff', null, 0, true);
  }

  for (const p of proysE){ ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ff4f8b'; ctx.lineWidth = 2; ctx.stroke(); }
  for (const p of proys){
    if (p.px){ dibujarProyPx(p, t); continue; }
    if (spriteListo && p.spr){
      const a = Math.atan2(p.vy, p.vx);
      ctx.globalAlpha = Math.min(1, p.vida * 4);
      dibujarEfecto(p.spr, p.x, p.y - (p.alt || 0), p.esc || .5, a, Math.cos(a) < 0);
      ctx.globalAlpha = 1; continue;
    }
    if (spriteListo && p.bola){
      const esc = .75 + .08 * Math.sin(t / 80) + (p.vida < .3 ? (.3 - p.vida) * 2 : 0);
      ctx.globalAlpha = Math.min(1, p.vida * 3); dibujarVortice(p, t, esc); ctx.globalAlpha = 1; continue;
    }
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
  }

  dibujarEfectos(false);
  dibujarFxPx(t);
  for (const p of particulas){ ctx.globalAlpha = Math.max(0, p.vida / p.max); ctx.fillStyle = p.color; ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  for (const tx of textos){
    ctx.globalAlpha = Math.min(1, tx.vida * 2);
    rotulo(tx.txt, tx.x, tx.y, `700 ${tx.size}px Rajdhani, sans-serif`, tx.color, null, 0, true);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // iluminación
  const sx = P.x - cam.x, sy = P.y - 20 - cam.y;
  if (E.tipo === 'mazmorra') ctx.drawImage(penumbra('cueva'), Math.round(sx - W), Math.round(sy - H), W * 2, H * 2);
  else if (esInterior()) ctx.drawImage(penumbra('interior'), 0, 0, W, H);

  dibujarNocheCiudad();
  dibujarClima(t);
  dibujarMinimapa();

  if (sticks.mov){
    const s = sticks.mov; let dx = s.x - s.ox, dy = s.y - s.oy; const d = Math.hypot(dx, dy);
    if (d > 55){ dx = dx / d * 55; dy = dy / d * 55; }
    ctx.strokeStyle = 'rgba(233,228,255,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.ox, s.oy, 55, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(123,77,255,.5)'; ctx.beginPath(); ctx.arc(s.ox + dx, s.oy + dy, 24, 0, TAU); ctx.fill();
  }
}

