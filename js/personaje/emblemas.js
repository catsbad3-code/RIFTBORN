// =====================================================
//  EMBLEMAS Y DURABILIDAD
// =====================================================
// durabilidad: el equipo se gasta al recibir golpes y al morir; roto (0) no da estadísticas. Se repara en la forja.
const durMaxDe = o => 60 + (o.rareza || 0) * 15;
function asegurarDur(o){ if (o && o.dur === undefined){ o.durMax = durMaxDe(o); o.dur = o.durMax; } return o; }
const roto = o => o && o.dur !== undefined && o.dur <= 0;
function gastarDur(frac, alAzar){
  const piezas = Object.values(PJ.equipo).filter(Boolean).map(asegurarDur);
  if (!piezas.length) return;
  const antes = piezas.filter(roto).length;
  if (alAzar){ const o = piezas[Math.random() * piezas.length | 0]; o.dur = Math.max(0, o.dur - 1); }
  else for (const o of piezas) o.dur = Math.max(0, Math.floor(o.dur - o.durMax * frac));
  if (piezas.filter(roto).length > antes){ derivar(); chat('Una pieza de tu equipo se ha roto: ya no te da estadísticas. Repárala en la forja.', '#ff5a5a'); }
  pintarDurabilidad();
}
const costeReparar = () => Object.values(PJ.equipo).filter(Boolean).map(asegurarDur).reduce((a, o) => a + (o.durMax - o.dur) * (o.nivel + 5) * 4 * (1 + o.rareza * .5), 0) | 0;
function reparar(){
  const c = costeReparar(); if (!c || PJ.oro < c) return false;
  PJ.oro -= c; for (const o of Object.values(PJ.equipo)) if (o){ asegurarDur(o); o.dur = o.durMax; }
  derivar(); pintarDurabilidad(); guardar(); return true;
}
// aviso de equipo dañado (como la figurita amarilla o roja de WoW)
function pintarDurabilidad(){
  const el = $('durAviso'); if (!el || !PJ) return;
  const piezas = Object.values(PJ.equipo).filter(Boolean).map(asegurarDur);
  const min = piezas.length ? Math.min(...piezas.map(o => o.dur / o.durMax)) : 1;
  el.classList.toggle('oculto', min > .25);
  el.classList.toggle('rojo', min <= 0);
  el.title = min <= 0 ? 'Tienes equipo roto' : 'Tu equipo está muy dañado';
  el.querySelector('span').textContent = min <= 0 ? 'Equipo roto' : `Equipo ${Math.round(min * 100)}%`;
}

// emblemas: los dan los jefes (más en el buscador, el titán y los jefes de mundo); se cambian por equipo épico
function darEmblemas(n, motivo){
  PJ.emblemas = (PJ.emblemas || 0) + n;
  texto(P.x, P.y - 96, `+${n} emblema${n > 1 ? 's' : ''}`, '#b98bff', 14);
  if (motivo) chat(`Recibes ${n} emblema${n > 1 ? 's' : ''} (${motivo}).`, '#b98bff');
}
const STAT_CLASE = { guerrero:['fue','vit'], sombra:['agi','fue'], mago:['int','vit'], sacerdote:['int','vit'], arquero:['agi','fue'] };
const PRECIO_EMB = { cabeza:30, amuleto:20, pecho:35, manos:20, piernas:30, pies:20, anillo:15, arma:45 };
function objetoEmblema(slot, rango){
  const nivel = UMBRAL_RANGO[rango] + 10, pres = (3 + nivel * .7) * RAREZAS[3].m * 1.15, [a, b] = STAT_CLASE[PJ.clase];
  const base = { arma:ARMA_CLASE[PJ.clase] }[slot] || RANURAS[slot].bases[0];
  const o = { id:'emb-' + slot + '-' + rango + '-' + Date.now().toString(36) + (uidObj++), slot, nombre:`${base} del Triunfo`, rareza:3, nivel,
    stats:{ [a]:Math.round(pres * .6), [b]:Math.round(pres * .4) } };
  if (slot === 'arma') o.dmg = Math.round(pres * 1.25);
  return asegurarDur(o);
}
function abrirEmblemas(msg){
  const r = rangoCazador(), em = PJ.emblemas || 0;
  let h = `<p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tus emblemas</span><b class="emb">${ic3('emblema')} ${em}</b></div>
    <p class="nota" style="margin:6px 0">Equipo épico para tu clase (nivel de objeto ${UMBRAL_RANGO[r] + 10}). Los emblemas se ganan derrotando jefes: más en el buscador de mazmorras, el titán semanal y los jefes de mundo.</p><div class="emb-lista">`;
  for (const slot of Object.keys(RANURAS)){
    const o = objetoEmblema(slot, r), p = PRECIO_EMB[slot];
    h += `<div class="emb-fila"><span class="emb-ic" style="--rc:${RAREZAS[3].c}">${icoObj(o)}</span><div><b style="color:${RAREZAS[3].c}">${o.nombre}</b>
      <small>${RANURAS[slot].n} · ${Object.entries(o.stats).map(([k, v]) => `+${v} ${NOMBRE_STAT[k]}`).join(', ')}${o.dmg ? ` · ${o.dmg} de daño` : ''}</small></div>
      <button class="btn" data-emb="${slot}" ${em < p || PJ.bolsa.length >= TAM_BOLSA ? 'disabled' : ''}>${p} ${ic3('emblema')}</button></div>`;
  }
  $('embCuerpo').innerHTML = h + '</div>';
  $('embCuerpo').querySelectorAll('[data-emb]').forEach(b => b.onclick = () => {
    const slot = b.dataset.emb, p = PRECIO_EMB[slot];
    if ((PJ.emblemas || 0) < p || PJ.bolsa.length >= TAM_BOLSA) return;
    const o = objetoEmblema(slot, rangoCazador()); PJ.emblemas -= p; PJ.bolsa.push(o); guardar(); sfx('botin');
    abrirEmblemas(`Compraste [${o.nombre}]. Está en tu mochila.`);
  });
  pantalla('pEmblemas');
}

