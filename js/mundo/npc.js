// =====================================================
//  NPC CON MISIONES (estilo WoW: ! amarillo, ? gris o amarillo)
// =====================================================
const NPC_SPR = {"comandante": [2, 2, 51, 68], "sabia": [55, 2, 48, 68], "panda": [105, 2, 52, 68], "vance": [159, 2, 43, 68], "aiko": [204, 2, 42, 68], "tendera": [248, 2, 50, 68], "herrero": [300, 2, 46, 68], "clienta": [348, 2, 47, 68], "cliente": [397, 2, 44, 68], "leon": [443, 2, 47, 68], "kenji": [492, 2, 46, 68], "bruno": [540, 2, 46, 68], "adolfo": [590, 2, 48, 80, 12]};  // el 5.º valor: píxeles de gorro que el retrato se salta
const NPC_IMG = new Image();
let npcListo = false;
NPC_IMG.onload = () => npcListo = true;
NPC_IMG.src = 'img/personajes/npcs.png?v=' + VERSION;
const SUMA_RANGOS = desde => RANGOS.slice(desde).reduce((a, R) => a + (PJ.limpias[R.l] || 0), 0);
const MISIONES = {
  caza: { titulo:'Limpieza de grietas', texto:'Las criaturas que se escapan de los portales asustan a los vecinos. Entra en cualquier mazmorra y elimina monstruos.',
    meta:v => 15 + v * 10, objetivo:m => `Elimina ${m} monstruos`, cuenta:() => PJ.kills, oro:v => (60 + v * 30) * 100, xp:v => 90 + v * 50, pociones:1,
    fin:'Buen trabajo, cazador. La calle respira tranquila otra vez.' },
  portales: { titulo:'El latido de los portales', texto:'Siento que los portales laten cada vez más fuerte. Si no se despejan, acabarán por romperse. Despeja mazmorras hasta derrotar a su jefe.',
    meta:v => 2 + v, objetivo:m => `Despeja ${m} mazmorras`, cuenta:() => PJ.jefesTotal, oro:v => (120 + v * 50) * 100, xp:v => 160 + v * 80, pociones:2,
    fin:'El latido se calma. Gracias, los portales te temen.' },
  rango: { titulo:'Mercancía de alto rango', texto:'Pago bien los cristales de las mazmorras peligrosas. Despeja una mazmorra de rango D o superior y te recompensaré.',
    meta:v => 1 + v, objetivo:m => `Despeja ${m} mazmorra${m > 1 ? 's' : ''} de rango D o superior`, cuenta:() => SUMA_RANGOS(1), oro:v => (220 + v * 90) * 100, xp:v => 250 + v * 120, pociones:3,
    fin:'¡Qué cristales tan bonitos! Aquí tienes tu parte.' },
  gelatina: { titulo:'Jalea para los niños', texto:'Hago dulces con la gelatina de los limos de los portales. ¿Me traes un poco? Los limos la sueltan al morir.',
    recoge:'p_gelatina', meta:v => 6 + v * 2, objetivo:m => `Trae ${m} Gelatinas de limo`, oro:v => (50 + v * 20) * 100, xp:v => 80 + v * 40, pociones:1,
    fin:'¡Huele a fresa! Los niños se van a poner felices.' },
  seda: { titulo:'Hilo de sombra', texto:'Quiero tejer una capa con seda de araña de los portales. Las arañas tejedoras la sueltan al morir.',
    recoge:'p_seda', meta:v => 5 + v * 2, objetivo:m => `Trae ${m} Sedas de araña`, oro:v => (90 + v * 40) * 100, xp:v => 140 + v * 60, pociones:1,
    fin:'¡Qué suave! Mi capa va a quedar increíble.' },
  pinzas: { titulo:'Armas de garra', texto:'La guardia necesita garras de escorpión para reforzar las lanzas. Los escorpiones las sueltan al morir.',
    recoge:'p_pinza', meta:v => 5 + v * 2, objetivo:m => `Trae ${m} Garras de escorpión`, oro:v => (110 + v * 50) * 100, xp:v => 160 + v * 70, pociones:2,
    fin:'Con esto la entrada este estará mejor protegida.' },
  nucleos: { titulo:'El poder de los jefes', texto:'Estudio la energía de los portales. Cada jefe deja un núcleo al morir. Tráeme algunos y te pagaré bien.',
    recoge:'p_nucleo', meta:v => 2 + v, objetivo:m => `Trae ${m} Núcleos de jefe`, oro:v => (300 + v * 150) * 100, xp:v => 300 + v * 150, pociones:3,
    fin:'¡Fascinante! Este núcleo todavía late...' },
  guadanas: { titulo:'Cuchillas de mantis', texto:'Las guadañas de mantis cortan mejor que cualquier cuchillo de cocina. Tráeme unas cuantas y te pagaré.',
    recoge:'p_guadana', meta:v => 6 + v * 2, objetivo:m => `Trae ${m} Guadañas de mantis`, oro:v => (70 + v * 30) * 100, xp:v => 110 + v * 50, pociones:2,
    fin:'¡Perfectas! Mi cocina nunca estuvo tan afilada.' },
  colmillos: { titulo:'Trofeos de colmillo', texto:'Cazo jabalíes desde antes de que salieran los portales. Los de ahí dentro tienen colmillos enormes. Tráeme algunos para mi colección.',
    recoge:'p_colmillo', meta:v => 5 + v * 2, objetivo:m => `Trae ${m} Colmillos de jabalí`, oro:v => (80 + v * 40) * 100, xp:v => 120 + v * 60, pociones:1,
    fin:'¡Menudos colmillos! Este irá encima de mi chimenea.' },
  minerales: { titulo:'Metal para la forja', texto:'La forja tiene hambre de metal. Tráeme minerales de las vetas brillantes de las cuevas (pulsa E junto a ellas).',
    recoge:'m_*', meta:v => 8 + v * 4, objetivo:m => `Trae ${m} minerales de cualquier tipo`, oro:v => (80 + v * 40) * 100, xp:v => 130 + v * 60, pociones:1,
    fin:'¡Buen metal! Con esto forjaré armas para toda la ciudad.' }
};
const PARTE_DE = { p_gelatina:'slime', p_guadana:'mantis', p_pinza:'escorpion', p_seda:'arana', p_colmillo:'jabali' };
function dondeRecoge(k){
  if (k === 'm_*') return 'Vetas brillantes de las cuevas de cualquier rango (pulsa E junto a ellas)';
  if (k === 'p_nucleo') return 'El jefe de cualquier portal (cada jefe suelta uno)';
  const sp = PARTE_DE[k]; if (!sp) return '';
  const tipo = Object.keys(ENEM).find(t => ENEM[t].spr === sp);
  const r = RANGOS.map((R, i) => R.enemigos.includes(tipo) || JEFE_SPR[i] === sp ? R : null).filter(Boolean);
  return `${ENEM[tipo].n}: portales de rango ${r.map(R => `<b style="color:${R.color}">${R.l}</b>`).join(', ')}`;
}
// ¿alguna misión activa pide este objeto y aún faltan unidades?
function misionPide(k){
  if (!k || !PJ || !PJ.misiones) return false;
  for (const id in PJ.misiones){
    const m = PJ.misiones[id], M = MISIONES[id];
    if (m.estado === 'activa' && M && M.recoge === k && cuentaRecoge(k) < M.meta(m.veces)) return true;
  }
  return false;
}
const cuentaRecoge = k => k === 'm_*' ? Object.entries(PJ.mats || {}).reduce((a, [x, n]) => a + (x.startsWith('m_') ? n : 0), 0) : ((PJ.mats || {})[k] || 0);
function gastarRecoge(k, n){
  const claves = k === 'm_*' ? Object.keys(PJ.mats).filter(x => x.startsWith('m_')).sort((a, b) => APILABLES[a].valor - APILABLES[b].valor) : [k];
  for (const x of claves){ const q = Math.min(n, PJ.mats[x] || 0); PJ.mats[x] -= q; n -= q; if (PJ.mats[x] <= 0) delete PJ.mats[x]; if (!n) break; }
}
function estadoMision(id){
  PJ.misiones = PJ.misiones || {};
  const m = PJ.misiones[id] || (PJ.misiones[id] = { estado:'libre', base:0, veces:0 });
  const M = MISIONES[id], meta = M.meta(m.veces), prog = m.estado === 'activa' ? Math.min(meta, M.recoge ? cuentaRecoge(M.recoge) : M.cuenta() - m.base) : 0;
  return { m, M, meta, prog, lista: m.estado === 'activa' && prog >= meta };
}
function marcaNPC(n){
  if (!n.mision || !PJ) return null;
  const e = estadoMision(n.mision);
  if (e.m.estado === 'libre') return { c:'!', col:'#ffd23f' };
  return e.lista ? { c:'?', col:'#ffd23f' } : { c:'?', col:'#b8b8c4' };
}
let npcHablando = null;
function hablarNPC(n){
  npcHablando = n;
  const si = $('miSi'), no = $('miNo');
  si.disabled = false;
  $('miNombre').textContent = n.nombre;
  if (!n.mision){
    $('miTitulo').textContent = n.nombre;
    $('miCuerpo').innerHTML = `<p>${n.frases[Math.random() * n.frases.length | 0]}</p>`;
    si.classList.add('oculto'); no.textContent = 'Adiós';
    pantalla('pMision'); return;
  }
  const e = estadoMision(n.mision), { m, M, meta, prog } = e;
  const donde = M.recoge ? `<p class="mi-donde">📍 Dónde: ${dondeRecoge(M.recoge)}</p>` : '';
  const premio = `<div class="linea"><span>Recompensa</span><b>${dinero(M.oro(m.veces))} · ${M.xp(m.veces)} exp · ${M.pociones} poción${M.pociones > 1 ? 'es' : ''}</b></div>`;
  $('miTitulo').textContent = M.titulo;
  si.classList.remove('oculto');
  if (m.estado === 'libre'){
    $('miCuerpo').innerHTML = `<p>${M.texto}</p><div class="linea"><span>Objetivo</span><b>${M.objetivo(meta)}</b></div>${donde}${premio}`;
    si.textContent = 'Aceptar misión'; no.textContent = 'Ahora no';
    si.onclick = () => {
      m.estado = 'activa'; m.base = M.recoge ? 0 : M.cuenta();
      chat(`Misión aceptada: ${M.titulo}.`, '#ffd23f'); banner('Misión aceptada', M.titulo);
      pantalla(null); guardar();
    };
  } else if (!e.lista){
    $('miCuerpo').innerHTML = `<p>¿Todavía no? Vuelve cuando lo hayas conseguido.</p><div class="linea"><span>${M.objetivo(meta)}</span><b>${prog} / ${meta}</b></div>${donde}${premio}`;
    si.textContent = 'Abandonar'; no.textContent = 'Seguir';
    si.onclick = () => { m.estado = 'libre'; chat(`Has abandonado la misión ${M.titulo}.`, '#ff8a9b'); pantalla(null); guardar(); };
  } else {
    $('miCuerpo').innerHTML = `<p>${M.fin}</p><div class="linea"><span>${M.objetivo(meta)}</span><b style="color:#7dffa8">Completado</b></div>${premio}`;
    si.textContent = 'Completar misión'; no.textContent = 'Luego';
    si.onclick = () => {
      const oro = M.oro(m.veces), xp = M.xp(m.veces);
      if (M.recoge) gastarRecoge(M.recoge, meta);
      PJ.oro += oro; PJ.pociones += M.pociones;
      m.estado = 'libre'; m.veces++;
      chat(`Misión completada: ${M.titulo}. Recibes ${dineroTxt(oro)} y ${M.pociones} pociones.`, '#ffd23f');
      banner('Misión completada', M.titulo);
      pantalla(null); ganarXP(xp, true); guardar();
    };
  }
  pantalla('pMision');
}
// ---------- registro de misiones (L) ----------
let misSel = null;
function quienDa(id){
  for (const G of [CIUDAD, TIENDA]) for (const n of (G && G.npcs) || []) if (n.mision === id) return { n, lugar:G === TIENDA ? 'Mercado de Lumeria' : 'Ciudad de Lumeria' };
  return null;
}
function activas(){ return Object.keys(PJ.misiones || {}).filter(id => PJ.misiones[id].estado === 'activa' && MISIONES[id]); }
function renderMisiones(){
  if (!abierta('wMis')) return;
  const ids = activas();
  if (!ids.includes(misSel)) misSel = ids[0] || null;
  $('misLista').innerHTML = `<div class="mis-titulo">Misiones activas (${ids.length})</div>` + (ids.length ? ids.map(id => {
    const e = estadoMision(id);
    return `<button class="mis-item ${id === misSel ? 'sel' : ''}" data-mis="${id}"><span>${e.lista ? '✔ ' : ''}${MISIONES[id].titulo}</span><small>${e.prog}/${e.meta}</small></button>`;
  }).join('') : '<p class="mis-vacio">No tienes misiones. Busca a los personajes con un <b style="color:#ffd23f">!</b> amarillo sobre la cabeza.</p>');
  let det = '';
  if (misSel){
    const e = estadoMision(misSel), M = e.M, q = quienDa(misSel);
    det = `<h3>${M.titulo}</h3><p>${M.texto}</p>
      <h4>Objetivos</h4><p class="${e.lista ? 'ok' : ''}">- ${M.objetivo(e.meta)}: ${e.prog}/${e.meta}${e.lista ? ' (Completado)' : ''}</p>
      ${M.recoge ? `<h4>Dónde</h4><p>${dondeRecoge(M.recoge)}</p>` : ''}
      <h4>Entregar a</h4><p>${q ? `${q.n.nombre}, ${q.lugar}` : '—'}</p>
      <h4>Recompensas</h4><p>${dinero(M.oro(e.m.veces))} · ${M.xp(e.m.veces)} exp · ${M.pociones} poción${M.pociones > 1 ? 'es' : ''}</p>
      <div class="mis-acc"><button class="wbtn" id="misSeg">${e.m.sigue === false ? 'Seguir' : 'Dejar de seguir'}</button><button class="wbtn" id="misAband">Abandonar</button></div>`;
  } else det = '<p class="mis-vacio">Selecciona una misión para ver sus detalles.</p>';
  $('misDet').innerHTML = det;
  $('misLista').querySelectorAll('[data-mis]').forEach(b => b.onclick = () => { misSel = b.dataset.mis; renderMisiones(); });
  const sg = $('misSeg'); if (sg) sg.onclick = () => { const m = PJ.misiones[misSel]; m.sigue = m.sigue === false; guardar(); renderMisiones(); };
  const ab = $('misAband'); if (ab) ab.onclick = () => {
    if (ab.dataset.c !== '1'){ ab.dataset.c = '1'; ab.textContent = '¿Seguro?'; return; }
    PJ.misiones[misSel].estado = 'libre'; chat(`Has abandonado la misión ${MISIONES[misSel].titulo}.`, '#ff8a9b'); guardar(); renderMisiones();
  };
}
let firmaSeg = '';
function actualizarSeguimiento(){
  if (!PJ || !enJuego){ if (firmaSeg){ firmaSeg = ''; $('seguimiento').innerHTML = ''; } return; }
  const ids = activas().filter(id => PJ.misiones[id].sigue !== false);
  const filas = ids.map(id => { const e = estadoMision(id); return [id, MISIONES[id].titulo, e.prog, e.meta, e.lista, MISIONES[id].objetivo(e.meta)]; });
  const fh = filaHistoria();
  const f = JSON.stringify(filas) + PJ.segOculto + fh; if (f === firmaSeg) return; firmaSeg = f;
  const plegado = PJ.segOculto;
  $('seguimiento').innerHTML = (filas.length || fh) ? `<b class="seg-cab"><span>Misiones (${filas.length + (fh ? 1 : 0)})</span><button id="segTog" title="${plegado ? 'Mostrar' : 'Ocultar'}" aria-label="${plegado ? 'Mostrar misiones' : 'Ocultar misiones'}">${plegado ? '+' : '–'}</button></b>` + (plegado ? '' : fh + filas.map(([id, t, p, m, ok, obj]) =>
    `<div class="seg-m ${ok ? 'ok' : ''}" data-segmis="${id}"><span class="seg-t">${t}</span><span class="seg-o">- ${obj.replace(/^(Trae|Elimina|Despeja) \d+ /, '')}: ${p}/${m}</span>${ok ? '<span class="seg-o ok">Listo para entregar</span>' : ''}</div>`).join('')) : '';
  const tg = $('segTog'); if (tg) tg.onclick = () => { PJ.segOculto = !PJ.segOculto; firmaSeg = ''; guardar(); actualizarSeguimiento(); };
  $('seguimiento').querySelectorAll('[data-segmis]').forEach(d => d.onclick = () => { misSel = d.dataset.segmis; abrirVentana('wMis'); });
}

// ---------- vecinos que pasean ----------
const CAM = {"eldrin": {"ab": [[2, 2, 55, 65, 26.8, 65.4], [59, 2, 57, 66, 27.6, 64.6], [118, 2, 57, 66, 27.1, 65.4], [177, 2, 57, 66, 27.4, 64.6]], "ar": [[236, 2, 54, 66, 26.3, 64.6], [292, 2, 57, 66, 28.9, 64.6], [351, 2, 56, 66, 28.2, 64.6], [409, 2, 56, 66, 27.9, 64.6]], "iz": [[467, 2, 44, 66, 25.8, 64.6], [513, 2, 51, 65, 26.5, 64.6], [566, 2, 47, 66, 25.1, 64.6], [615, 2, 47, 65, 25.4, 64.6]], "de": [[664, 2, 46, 67, 18.7, 66.2], [712, 2, 48, 67, 21.5, 67.0], [762, 2, 46, 66, 22.3, 66.2], [810, 2, 43, 66, 18.8, 66.2]]}, "ruarc": {"ab": [[855, 2, 52, 67, 25.9, 67.0], [909, 2, 52, 67, 26.0, 66.2], [963, 2, 50, 67, 25.2, 66.2], [2, 71, 50, 67, 25.3, 66.2]], "ar": [[54, 71, 48, 65, 23.6, 64.6], [104, 71, 48, 66, 23.0, 64.6], [154, 71, 48, 66, 23.2, 64.6], [204, 71, 47, 65, 22.5, 63.9]], "iz": [[253, 71, 48, 65, 25.1, 63.9], [303, 71, 48, 65, 25.3, 63.9], [353, 71, 48, 65, 25.1, 63.9], [403, 71, 47, 65, 24.3, 63.9]], "de": [[452, 71, 48, 67, 22.6, 66.2], [502, 71, 48, 67, 22.6, 66.2], [552, 71, 48, 67, 22.6, 66.2], [602, 71, 47, 67, 22.1, 66.2]]}, "nalani": {"ab": [[651, 71, 43, 68, 22.8, 67.0], [696, 71, 44, 68, 23.3, 67.0], [742, 71, 43, 68, 22.9, 67.0], [787, 71, 43, 68, 22.8, 67.0]], "ar": [[832, 71, 41, 66, 19.2, 65.4], [875, 71, 42, 66, 19.5, 65.4], [919, 71, 41, 66, 19.3, 65.4], [962, 71, 41, 66, 19.0, 65.4]], "iz": [[2, 141, 37, 60, 19.9, 59.1], [41, 141, 37, 60, 20.0, 59.1], [80, 141, 36, 60, 19.7, 59.1], [118, 141, 36, 60, 19.6, 59.1]], "de": [[156, 141, 36, 60, 15.8, 59.1], [194, 141, 35, 60, 15.7, 59.1], [231, 141, 35, 60, 15.6, 59.1], [268, 141, 35, 60, 15.6, 59.1]]}, "calebe": {"ab": [[305, 141, 65, 67, 36.3, 67.0], [372, 141, 60, 68, 33.8, 67.0], [434, 141, 58, 68, 32.2, 67.0], [494, 141, 67, 67, 39.6, 66.2]], "ar": [[563, 141, 59, 65, 25.0, 65.4], [624, 141, 57, 65, 24.1, 65.4], [683, 141, 55, 66, 23.2, 64.6], [740, 141, 55, 66, 23.6, 65.4]], "iz": [[797, 141, 56, 65, 33.1, 64.6], [855, 141, 51, 65, 28.7, 63.9], [908, 141, 51, 66, 28.6, 64.6], [961, 141, 54, 65, 31.2, 63.9]], "de": [[2, 211, 53, 65, 21.2, 65.4], [57, 211, 52, 66, 21.7, 65.4], [111, 211, 51, 66, 21.4, 65.4], [164, 211, 52, 65, 21.6, 65.4]]}, "benja": {"ab": [[218, 211, 34, 67, 17.7, 67.0], [254, 211, 34, 68, 17.2, 67.0], [290, 211, 35, 67, 17.2, 66.2], [327, 211, 35, 67, 17.0, 66.2]], "ar": [[364, 211, 33, 66, 16.1, 65.4], [399, 211, 33, 66, 16.6, 65.4], [434, 211, 34, 66, 17.1, 65.4], [470, 211, 33, 66, 16.7, 65.4]], "iz": [[505, 211, 33, 67, 17.8, 66.2], [540, 211, 33, 65, 17.2, 65.4], [575, 211, 33, 65, 17.4, 65.4], [610, 211, 33, 65, 17.2, 65.4]], "de": [[645, 211, 33, 66, 15.2, 65.4], [680, 211, 33, 65, 15.4, 64.6], [715, 211, 33, 66, 15.1, 65.4], [750, 211, 33, 66, 15.5, 64.6]]}, "claire": {"ab": [[785, 211, 55, 67, 32.0, 67.0], [842, 211, 53, 68, 30.4, 67.0], [897, 211, 61, 67, 36.4, 67.0], [960, 211, 55, 67, 32.2, 67.0]], "ar": [[2, 281, 56, 68, 23.9, 67.0], [60, 281, 48, 68, 22.1, 67.0], [110, 281, 62, 68, 22.9, 67.0], [174, 281, 56, 68, 23.9, 67.0]], "iz": [[232, 281, 52, 62, 27.6, 61.5], [286, 281, 41, 62, 19.8, 61.5], [329, 281, 43, 62, 20.0, 61.5], [374, 281, 51, 62, 27.0, 61.5]], "de": [[427, 281, 50, 62, 22.9, 65.4], [479, 281, 40, 66, 21.7, 65.4], [521, 281, 41, 62, 21.3, 65.4], [564, 281, 50, 62, 22.8, 65.4]]}};
const CAM_IMG = new Image();
let camListo = false;
CAM_IMG.onload = () => camListo = true;
CAM_IMG.src = 'img/personajes/caminantes.png?v=' + VERSION;
function updateCaminantes(dt){
  for (const n of E.npcs){
    if (!n.ruta) continue;
    const dP = Math.hypot(P.x - n.x, P.y - n.y);
    const charla = pantallaActual === 'pMision' && npcHablando === n;
    if (charla || dP < 54){
      // se detiene y te mira
      n.mov = false;
      const dx = P.x - n.x, dy = P.y - n.y;
      n.dir = Math.abs(dy) > Math.abs(dx) * 1.3 ? (dy < 0 ? 'ar' : 'ab') : (dx > 0 ? 'de' : 'iz'); n.paso = 0;
      continue;
    }
    if (n.espera > 0){ n.espera -= dt; n.mov = false; if (n.espera <= 0) n.dest = rand(n.ruta[0], n.ruta[1]); continue; }
    const dx = n.dest - n.x;
    if (Math.abs(dx) < 3){ n.espera = rand(1.5, 4); n.mov = false; n.dir = 'ab'; n.paso = 0; continue; }
    const v = 46 * dt * Math.sign(dx);
    n.x += Math.abs(v) > Math.abs(dx) ? dx : v;
    n.mov = true; n.dir = dx > 0 ? 'de' : 'iz'; n.paso += Math.abs(v);
    n.ob.x = n.x; n.it.x = n.x;
  }
}
function dibujarNPCSprite(n, t){
  const pie = n.y + 12;
  ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(n.x, pie, 17, 6, 0, 0, TAU); ctx.fill();
  if (P && n === P.amigo){ ctx.strokeStyle = 'rgba(125,255,168,.9)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.lineDashOffset = -t / 50; ctx.beginPath(); ctx.ellipse(n.x, pie, 22, 8, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
  const alto = n.spr && NPC_SPR[n.spr] ? NPC_SPR[n.spr][3] - 2 : 66;
  if (n.cam){
    if (!camListo) return;
    // cada dirección usa sus propios cuadros, anclados al centro del cuerpo y a los pies
    const lista = CAM[n.cam][n.dir || 'ab'];
    const f = n.mov ? lista[Math.floor(n.paso / 11) % lista.length] : lista[0];
    const [sx, sy, w, h, ax, ay] = f, k = 1; // pixel art: ya está a su tamaño
    const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(CAM_IMG, sx, sy, w, h, Math.round(n.x - ax * k), Math.round(pie - ay * k), Math.round(w * k), Math.round(h * k));
    ctx.imageSmoothingEnabled = suave;
  } else {
    if (!npcListo) return;
    const [sx, sy, w, h] = NPC_SPR[n.spr], suave = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(NPC_IMG, sx, sy, w, h, Math.round(n.x - w / 2), Math.round(pie - h), w, h);
    ctx.imageSmoothingEnabled = suave;
  }
  // nombre y signo de misión
  const ny = pie - alto - 8;
  rotulo(n.nombre, n.x, ny, '700 13px Rajdhani, sans-serif', n.mision ? '#ffd76a' : '#9fe39a', 'rgba(0,0,0,.85)', 3);
  const mk = marcaNPC(n);
  if (mk){
    const by = ny - 16 + (sinMovimiento ? 0 : Math.sin(t / 260) * 3);
    rotulo(mk.c, n.x, Math.round(by), '900 30px Marcellus, Georgia, serif', mk.col, '#2a1a00', 5);
  }
}

function dibujarNPC(x, y, ropa, pelo, t){
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x, y + 12, 14, 5, 0, 0, TAU); ctx.fill();
  const r = Math.sin(t / 400) * 1.5;
  ctx.fillStyle = ropa; ctx.beginPath(); ctx.ellipse(x, y - 4 + r, 13, 17, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e7c3a0'; ctx.beginPath(); ctx.arc(x, y - 28 + r, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = pelo; ctx.beginPath(); ctx.arc(x, y - 31 + r, 10, Math.PI, TAU); ctx.fill();
}

function dibujarMazmorra(t){
  const R = E.R, tex = TEXTURA_RANGO[E.rango];
  ctx.fillStyle = patron(tex.suelo) || R.suelo; ctx.fillRect(cam.x - 10, cam.y - 10, W + 20, H + 20);
  if (terrListo){ ctx.globalAlpha = tex.tinte; ctx.fillStyle = R.suelo; ctx.fillRect(cam.x - 10, cam.y - 10, W + 20, H + 20); ctx.globalAlpha = 1; }
  if (!terrListo) for (const d of E.deco){
    if (d.x < cam.x - 40 || d.x > cam.x + W + 40 || d.y < cam.y - 40 || d.y > cam.y + H + 40) continue;
    if (d.t === 0){ ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(d.x, d.y, 10 * d.s, 0, TAU); ctx.fill(); }
    else if (d.t === 1){
      ctx.fillStyle = R.acento; ctx.globalAlpha = .55 + .25 * Math.sin(t / 500 + d.x);
      ctx.beginPath(); ctx.moveTo(d.x, d.y - 12 * d.s); ctx.lineTo(d.x + 5 * d.s, d.y); ctx.lineTo(d.x - 5 * d.s, d.y); ctx.fill();
      ctx.globalAlpha = 1;
    } else { ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(d.x, d.y, 6 * d.s, 3 * d.s); }
  }
  dibujarParedes(patron('piedra') || R.pared, patron('muro') || R.cara, null, terrListo ? R.pared + 'd9' : null, terrListo ? R.cara + '99' : null);
  // portal de salida
  if (E.salida) dibujarPortal(E.salida.x, E.salida.y, 3, t, .7);
  if (E.portalFinal) dibujarPortal(E.portalFinal.x, E.portalFinal.y, 4, t, .85);
}

