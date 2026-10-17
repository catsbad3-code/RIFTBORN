// =====================================================
//  PROGRESO: MISIONES DIARIAS, TITÁN SEMANAL, LOGROS, TÍTULOS Y TINTES
// =====================================================
const diaHoy = () => Math.floor(Date.now() / 86400000);
const semanaHoy = () => Math.floor((Date.now() / 86400000 + 3) / 7); // semanas que empiezan el lunes
const DIARIAS_POOL = [
  { id:'kills',     n:'Derrota 40 monstruos',             meta:40 },
  { id:'mazmorras', n:'Despeja 2 mazmorras',              meta:2 },
  { id:'jefes',     n:'Derrota a un jefe',                meta:1 },
  { id:'oro',       n:'Recoge 50 de plata en monedas',    meta:5000 },
  { id:'partes',    n:'Recoge 6 partes de monstruo',      meta:6 },
  { id:'pasos',     n:'Recorre la ciudad y las cuevas',   meta:300 },
  { id:'comida',    n:'Dale de comer a tu mascota',       meta:1 }
];
// las 3 misiones del día salen de la fecha: son las mismas para todos ese día
function diariasDeHoy(){
  let x = diaHoy() * 9301 + 49297; const pool = DIARIAS_POOL.slice(), elegidas = [];
  while (elegidas.length < 3){ x = (x * 9301 + 49297) % 233280; elegidas.push(pool.splice(x % pool.length, 1)[0]); }
  return elegidas;
}
function estadoDiarias(){
  if (!PJ.diarias || PJ.diarias.dia !== diaHoy()) PJ.diarias = { dia:diaHoy(), prog:{}, cobradas:{} };
  return PJ.diarias;
}
function contar(id, n = 1){
  if (!PJ) return;
  const d = estadoDiarias(), mis = diariasDeHoy().find(m => m.id === id);
  if (!mis || d.cobradas[id]) return;
  const antes = d.prog[id] || 0;
  d.prog[id] = Math.min(mis.meta, antes + n);
  if (antes < mis.meta && d.prog[id] >= mis.meta){ chat(`Misión diaria completada: ${mis.n}. Cóbrala en Desafíos (C).`, '#ffd100'); texto(P.x, P.y - 84, '¡Diaria completada!', '#ffd100', 15); }
}
const premioDiaria = () => ({ oro:3000 * (1 + rangoCazador()), xp:Math.round(PJ.xpSig * .15) });
function cobrarDiaria(id){
  const d = estadoDiarias(), mis = diariasDeHoy().find(m => m.id === id);
  if (!mis || d.cobradas[id] || (d.prog[id] || 0) < mis.meta) return;
  d.cobradas[id] = true; PJ.diariasTotal = (PJ.diariasTotal || 0) + 1;
  const pr = premioDiaria(); PJ.oro += pr.oro; darApilable('queso');
  chat(`Recompensa diaria: ${dineroTxt(pr.oro)}, ${pr.xp} de experiencia y una Galleta de queso.`, '#ffd100');
  ganarXP(pr.xp, true); guardar(); renderPj();
}

// Titán semanal: un portal dorado en la ciudad con un jefe mucho más fuerte; su cofre se cobra una vez por semana
const TITANES = ['Titán de Obsidiana', 'Reina Plaga', 'Coloso Errante', 'Devorador de Lunas'];
const titanDeLaSemana = () => TITANES[semanaHoy() % TITANES.length];
const titanHecho = () => PJ.semanal === semanaHoy();
function asegurarPortalTitan(){
  if (E.tipo !== 'ciudad' || portales.some(p => p.semanal)) return;
  const libres = CIUDAD.puntosPortal.filter(p => p.libre);
  if (!libres.length) return;
  const punto = libres[0]; punto.libre = false;
  portales.push({ x:punto.x, y:punto.y, punto, rango:Math.min(5, rangoCazador()), cierra:Infinity, nace:0, semanal:true });
}
function hacerTitan(){
  const j = jefeVivo; if (!j) return;
  j.hp = j.maxHp = Math.round(j.maxHp * 3); j.dmg *= 1.4; j.r = Math.round(j.r * 1.25); j.xp *= 3; j.oro *= 3;
  j.nombre = titanDeLaSemana(); j.color = '#ffd100'; E.semanal = true;
  $('jefeNombre').textContent = j.nombre;
}
function premioTitan(){
  if (!E.semanal || titanHecho()) return;
  PJ.semanal = semanaHoy(); PJ.semanalesTotal = (PJ.semanalesTotal || 0) + 1;
  const oro = 20000 * (1 + E.rango);
  PJ.oro += oro;
  botin.push({ t:'obj', x:E.jefePos.x, y:E.jefePos.y + 20, obj:crearObjeto(E.rango, 0, null, 4) });
  banner(`¡${titanDeLaSemana()} derrotado!`, `Cofre semanal: ${dineroTxt(oro)} y un objeto legendario.`);
  chat(`Cofre del titán semanal: ${dineroTxt(oro)} y un objeto legendario.`, '#ff8000');
}

// Logros: cada uno da un título que puedes llevar sobre el nombre
const LOGROS = [
  { id:'k1',      n:'Primera presa',          d:'Derrota a tu primer monstruo.',       titulo:'el Novato',             ok:p => p.kills >= 1 },
  { id:'k100',    n:'Exterminador',           d:'Derrota 100 monstruos.',             titulo:'Exterminador',          ok:p => p.kills >= 100 },
  { id:'k1000',   n:'Azote de monstruos',     d:'Derrota 1000 monstruos.',            titulo:'Azote de monstruos',    ok:p => p.kills >= 1000 },
  { id:'j1',      n:'Matajefes',              d:'Derrota a tu primer jefe.',          titulo:'Matajefes',             ok:p => p.jefesTotal >= 1 },
  { id:'j25',     n:'Leyenda de los portales',d:'Derrota 25 jefes.',                  titulo:'Leyenda de los portales', ok:p => p.jefesTotal >= 25 },
  { id:'s1',      n:'Señor del Abismo',       d:'Despeja una grieta de rango S.',     titulo:'Señor del Abismo',      ok:p => (p.limpias.S || 0) >= 1 },
  { id:'n10',     n:'Veterano',               d:'Llega al nivel 10.',                 titulo:'el Veterano',           ok:p => p.nivel >= 10 },
  { id:'n30',     n:'Maestro de las sombras', d:'Llega al nivel 30.',                 titulo:'Maestro de las sombras', ok:p => p.nivel >= 30 },
  { id:'rico',    n:'Gato rico',              d:'Junta 50 de oro.',                   titulo:'el Adinerado',          ok:p => p.oro >= 500000 },
  { id:'pet10',   n:'Amigo de las ratas',     d:'Sube a tu mascota a nivel 10.',      titulo:'Amigo de las ratas',    ok:p => p.mascota && p.mascota.nivel >= 10 },
  { id:'d10',     n:'Constante',              d:'Cobra 10 misiones diarias.',         titulo:'el Constante',          ok:p => (p.diariasTotal || 0) >= 10 },
  { id:'t1',      n:'Cazatitanes',            d:'Derrota a un titán semanal.',        titulo:'Cazatitanes',           ok:p => (p.semanalesTotal || 0) >= 1 },
  { id:'h1',      n:'Trasnochador',           d:'Juega una hora con este personaje.', titulo:'el Trasnochador',       ok:p => p.tiempo >= 3600 },
  { id:'tal',     n:'Erudito',                d:'Reparte 5 puntos de talento.',       titulo:'el Erudito',            ok:p => talentosGastados(p) >= 5 },
  { id:'hllave',  n:'Guardián de la llave',   d:'Descubre el secreto del ratón (capítulo 4).', titulo:'Guardián de la Llave', ok:p => ((p.historia || {}).cap || 0) >= 3 },
  { id:'hfin',    n:'El último deseo',        d:'Termina el primer arco de la historia.', titulo:'Amigo de Aldric',      ok:p => ((p.historia || {}).cap || 0) >= HISTORIA.length },
  { id:'moda',    n:'A la moda',              d:'Tiñe tu ropa en el mercado.',        titulo:'el Elegante',           ok:p => (p.tintes || []).length > 0 }
];
function revisarLogros(){
  if (!PJ || !P) return;
  PJ.logros = PJ.logros || {};
  for (const L of LOGROS){
    if (PJ.logros[L.id] || !L.ok(PJ)) continue;
    PJ.logros[L.id] = true; sfx('logro');
    banner(`Logro: ${L.n}`, `Nuevo título: «${L.titulo}». Elígelo en Desafíos (C).`);
    chat(`Logro conseguido: [${L.n}]. Título desbloqueado: ${L.titulo}.`, '#ff8000');
    chispas(P.x, P.y - 30, '#ffd100', 30, 200);
    guardar();
  }
  logrosColeccion();   // algunos logros también dan una pieza de colección
}
const tituloActual = () => { const L = PJ && PJ.titulo && LOGROS.find(x => x.id === PJ.titulo); return L && PJ.logros && PJ.logros[L.id] ? L.titulo : ''; };

// Tintes de ropa: cambian el color de la chaqueta, la corbata o la sudadera (cada gato su prenda)
const TINTES = [
  { id:'carmesi',   n:'Carmesí',   c:[200, 40, 48] },
  { id:'cobalto',   n:'Cobalto',   c:[52, 96, 220] },
  { id:'esmeralda', n:'Esmeralda', c:[36, 160, 84] },
  { id:'dorado',    n:'Dorado',    c:[222, 168, 40] },
  { id:'lavanda',   n:'Lavanda',   c:[156, 110, 228] },
  { id:'nieve',     n:'Nieve',     c:[226, 226, 236] },
  { id:'rosa',      n:'Rosa',      c:[232, 108, 170] }
];
const PRECIO_TINTE = 3000;
const PRENDA_GATO = ['chaqueta', 'corbata y parche', null, 'sudadera'];
function esRopa(tipo, r, g, b){
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0, lum = r * .3 + g * .59 + b * .11;
  if (tipo === 0) return sat < .2 && lum >= 24 && lum < 110;
  if (tipo === 1) return sat < .16 && lum >= 14 && lum < 80;
  if (tipo === 3){ if (sat < .25 || mx < 40) return false; const h = mx === r ? (g - b) / (mx - mn) : mx === g ? 2 + (b - r) / (mx - mn) : 4 + (r - g) / (mx - mn); const hue = (h * 60 + 360) % 360; return hue > 235 && hue < 305; }
  return false;
}
const HOJAS_TENIDAS = new Map();
function hojaGato(tipo, tinte){
  const img = imgGato(tipo), T = tinte && TINTES.find(x => x.id === tinte);
  if (!T || !PRENDA_GATO[tipo] || !img.complete || !img.naturalWidth) return img;
  const clave = tipo + '|' + tinte;
  if (HOJAS_TENIDAS.has(clave)) return HOJAS_TENIDAS.get(clave);
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const a = c.getContext('2d'); a.drawImage(img, 0, 0);
  const id = a.getImageData(0, 0, c.width, c.height), d = id.data;
  // máscara de ropa; en el Gato Ejecutivo se quitan las líneas finas del contorno (apertura 3×3): quedan la corbata y el parche
  const W0 = c.width, H0 = c.height, ropa = new Uint8Array(W0 * H0);
  for (let j = 0; j < W0 * H0; j++) ropa[j] = d[j * 4 + 3] >= 128 && esRopa(tipo, d[j * 4], d[j * 4 + 1], d[j * 4 + 2]) ? 1 : 0;
  if (tipo === 1){
    const todos = (m, x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){ const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W0 || yy >= H0 || !m[yy * W0 + xx]) return false; } return true; };
    const alguno = (m, x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){ const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W0 && yy < H0 && m[yy * W0 + xx]) return true; } return false; };
    const ero = new Uint8Array(W0 * H0);
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) ero[y * W0 + x] = ropa[y * W0 + x] && todos(ropa, x, y) ? 1 : 0;
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) ropa[y * W0 + x] = ropa[y * W0 + x] && alguno(ero, x, y) ? 1 : 0;
  }
  for (let i = 0; i < d.length; i += 4){
    if (!ropa[i / 4]) continue;
    const L = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255, k = tipo === 3 ? .3 + 1.3 * L : .35 + 1.9 * L;
    d[i] = Math.min(255, T.c[0] * k); d[i + 1] = Math.min(255, T.c[1] * k); d[i + 2] = Math.min(255, T.c[2] * k);
  }
  a.putImageData(id, 0, 0);
  HOJAS_TENIDAS.set(clave, c);
  return c;
}
const hojaJugador = () => hojaGato(PJ.gato, PJ.tinte);
function abrirTintes(msg){
  const prenda = PRENDA_GATO[PJ.gato], mios = PJ.tintes || [];
  let h = `<p style="color:var(--xp);min-height:1.3em">${msg || ''}</p><div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>`;
  if (!prenda) h += '<p class="nota" style="margin-top:10px">Tu gato no lleva ropa que se pueda teñir.</p>';
  else {
    h += `<p class="nota" style="margin:8px 0">Tiñe tu ${prenda}. Cada color se paga una vez; después puedes cambiarlo gratis.</p><div class="tintes">`;
    h += `<button class="tinte ${!PJ.tinte ? 'sel' : ''}" data-tinte=""><canvas width="64" height="72"></canvas><span>Original</span></button>`;
    for (const T of TINTES){
      const tiene = mios.includes(T.id);
      if (T.evento && !tiene) continue;
      h += `<button class="tinte ${PJ.tinte === T.id ? 'sel' : ''}" data-tinte="${T.id}" ${!tiene && PJ.oro < PRECIO_TINTE ? 'disabled' : ''}><canvas width="64" height="72"></canvas><span>${T.n}</span><small>${tiene ? 'Tuyo' : dineroTxt(PRECIO_TINTE).replace(/ de /g, ' ')}</small></button>`;
    }
    h += '</div>';
  }
  h += '<button class="btn" id="tVolver" style="margin-top:10px">Volver al mostrador</button>';
  $('tiendaCuerpo').innerHTML = h;
  $('tVolver').onclick = () => abrirTienda();
  $('tiendaCuerpo').querySelectorAll('.tinte').forEach(b => {
    const id = b.dataset.tinte, cv = b.querySelector('canvas'), a = cv.getContext('2d'), fr = cuadroGato(PJ.gato, 'ab', 0), [sx, sy, w, hh] = fr;
    a.imageSmoothingEnabled = false; a.drawImage(hojaGato(PJ.gato, id || null), sx, sy, w, hh, Math.round((64 - w) / 2), 72 - hh - 4, w, hh);
    b.onclick = () => {
      if (id && !mios.includes(id)){
        if (PJ.oro < PRECIO_TINTE) return;
        PJ.oro -= PRECIO_TINTE; PJ.tintes = [...mios, id];
      }
      PJ.tinte = id || null; guardar(); dibujarAvatar();
      abrirTintes(id ? `Tu ${prenda} ahora es ${TINTES.find(x => x.id === id).n.toLowerCase()}.` : `Tu ${prenda} vuelve a su color original.`);
    };
  });
}

// pestaña Desafíos de la ventana de personaje
function htmlDesafios(){
  const d = estadoDiarias(), mis = diariasDeHoy(), pr = premioDiaria();
  const resta = 86400 - (Date.now() / 1000 % 86400), hRes = Math.floor(resta / 3600), mRes = Math.floor(resta / 60) % 60;
  let h = `<div class="pd-caja des-caja"><h4>Misiones diarias <small>se renuevan en ${hRes} h ${mRes} min</small></h4>`;
  for (const m of mis){
    const v = d.prog[m.id] || 0, hecha = v >= m.meta, cobrada = d.cobradas[m.id];
    const txt = m.id === 'oro' ? `${Math.floor(v / 100)}/${m.meta / 100}` : `${v}/${m.meta}`;
    h += `<div class="des-mis ${cobrada ? 'hecha' : ''}"><div><b>${m.n}</b><i><b style="width:${Math.round(v / m.meta * 100)}%"></b></i><small>${cobrada ? 'Cobrada' : txt}</small></div>
      ${cobrada ? '<span class="des-ok">✓</span>' : `<button class="wbtn" data-cobrar="${m.id}" ${hecha ? '' : 'disabled'}>Cobrar</button>`}</div>`;
  }
  h += `<p class="nota">Cada una da ${dineroTxt(pr.oro)}, ${pr.xp} de experiencia y una Galleta de queso.</p></div>`;
  h += `<div class="pd-caja des-caja"><h4>Titán semanal</h4><p><b style="color:#ffd100">${titanDeLaSemana()}</b> espera tras el portal dorado de la ciudad.</p>
    <p class="nota">${titanHecho() ? 'Ya lo derrotaste esta semana. El próximo titán llega el lunes.' : 'Derrótalo para abrir el cofre semanal: mucho dinero y un objeto legendario.'}</p></div>`;
  const logros = PJ.logros || {}, n = LOGROS.filter(L => logros[L.id]).length;
  h += `<div class="pd-caja des-caja"><h4>Logros <small>${n}/${LOGROS.length}</small></h4>
    <label class="des-titulo">Título <select id="selTitulo"><option value="">Sin título</option>${LOGROS.filter(L => logros[L.id]).map(L => `<option value="${L.id}" ${PJ.titulo === L.id ? 'selected' : ''}>${L.titulo}</option>`).join('')}</select></label><div class="des-logros">`;
  for (const L of LOGROS) h += `<div class="des-logro ${logros[L.id] ? '' : 'bloq'}" title="${L.d}">${ic3('trofeo')}<div><b>${L.n}</b><small>${L.d}</small><small class="des-tit">Título: ${L.titulo}</small></div></div>`;
  return h + '</div></div>';
}
function enlazarDesafios(){
  document.querySelectorAll('[data-cobrar]').forEach(b => b.onclick = () => cobrarDiaria(b.dataset.cobrar));
  const s = $('selTitulo'); if (s) s.onchange = () => { PJ.titulo = s.value || null; guardar(); };
}

