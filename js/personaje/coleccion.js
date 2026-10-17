// =====================================================
//  COLECCIÓN: monturas, pelajes de mascota y tintes especiales
//  Cada pieza se consigue de una forma: jefes de portal (con suerte), el titán semanal, logros, eventos de temporada
//  o las cadenas de misiones de los vecinos. Se ve y se elige en la pestaña Colección de la ventana del personaje.
//  Las monturas y los pelajes son el mismo dibujo con otros colores (se repinta la hoja una vez y se guarda).
// =====================================================
// col: h = tono nuevo (grados; null deja el suyo), s y l multiplican la saturación y la luz, m = saturación mínima
// (el jabalí casi no tiene color: sin un mínimo, el dorado quedaba beige)
const MONTURAS = [
  { id:'jabali',   n:'Jabalí',               col:null,                   origen:'Tu primera montura.' },
  { id:'veterano', n:'Jabalí veterano',      col:{ h:null, s:.3, l:.78 }, origen:'Termina «La última cacería» de Bruno, el cazador.' },
  { id:'escarcha', n:'Jabalí de escarcha',   col:{ h:200, s:1, l:1.15, m:.38 }, origen:'Lo suelta a veces la Mantis de Escarcha (jefe de rango C).', jefe:2, prob:.12 },
  { id:'magma',    n:'Jabalí de magma',      col:{ h:12, s:1.4, l:1.02, m:.62 }, origen:'Lo suelta a veces la Araña de Magma (jefe de rango B).', jefe:3, prob:.12 },
  { id:'runico',   n:'Jabalí rúnico',        col:{ h:186, s:1.3, l:1.1, m:.55 }, origen:'Termina «Ecos de la Primera Grieta» del Sabio Ruarc.' },
  { id:'vacio',    n:'Jabalí del vacío',     col:{ h:268, s:1.1, l:.85, m:.45 },    origen:'Lo suelta a veces el Monarca del Vacío (jefe de rango A).', jefe:4, prob:.12 },
  { id:'carmesi',  n:'Jabalí carmesí',       col:{ h:352, s:1.3, l:.9, m:.6 }, origen:'Lo suelta a veces el Monarca Carmesí (jefe de rango S).', jefe:5, prob:.12 },
  { id:'dorado',   n:'Jabalí dorado',        col:{ h:44, s:1.5, l:1.12, m:.65 }, origen:'Lo suelta a veces el titán semanal.', titan:.3 },
  { id:'animas',   n:'Jabalí de las Ánimas', col:{ h:28, s:1.4, l:1.06, m:.6 },  origen:'Tienda del Festival de las Ánimas (octubre).' }
];
const PELAJES = [
  { id:'normal',   n:'Pelaje original',      col:null,                   origen:'El color de siempre.' },
  { id:'queso',    n:'Pelaje de queso',      col:{ h:46, s:1.25, l:1.15 }, origen:'Termina «¿Dónde está Queso?» de Nalani.' },
  { id:'escarcha', n:'Pelaje de escarcha',   col:{ h:200, s:.75, l:1.25 }, origen:'Lo suelta a veces la Mantis de Escarcha (jefe de rango C).', jefe:2, prob:.08 },
  { id:'sombra',   n:'Pelaje de sombra',     col:{ h:265, s:.6, l:.62 },   origen:'Logro «Azote de monstruos» (derrota 1000 monstruos).', logro:'k1000' },
  { id:'dorado',   n:'Pelaje dorado',        col:{ h:44, s:1.5, l:1.12, m:.65 },  origen:'Logro: sube a tu mascota a nivel 10.', logro:'pet10' },
  { id:'brasa',    n:'Pelaje de brasa',      col:{ h:14, s:1.4, l:1.02, m:.6 }, origen:'Tienda de los Fuegos del Solsticio (junio y julio).' }
];
// tintes especiales: no se venden en el mercado (se añaden a TINTES y solo aparecen allí si ya son tuyos)
const TINTES_COL = [
  { id:'calabaza',   n:'Calabaza',   c:[236, 120, 28],  origen:'Tienda del Festival de las Ánimas (octubre).' },
  { id:'medianoche', n:'Medianoche', c:[48, 54, 120],   origen:'Termina «El registro perdido» de Roxy.' },
  { id:'aurora',     n:'Aurora',     c:[70, 214, 190],  origen:'Lo suelta a veces el titán semanal.', titan:.3 },
  { id:'monarca',    n:'Monarca',    c:[150, 44, 206],  origen:'Logro «El último deseo» (termina la historia).', logro:'hfin' }
];
for (const T of TINTES_COL) if (!TINTES.some(x => x.id === T.id)) TINTES.push({ ...T, evento:true });
const ORIGEN_TINTE_MERCADO = 'Se compra en el Mercado de Lumeria.';

const coleccion = () => {
  PJ.coleccion = PJ.coleccion || {};
  const c = PJ.coleccion;
  c.monturas = c.monturas || ['jabali']; c.pelajes = c.pelajes || ['normal'];
  return c;
};
const montura = () => MONTURAS.find(m => m.id === (PJ && PJ.monturaSel)) || MONTURAS[0];
const pelajeMascota = () => PELAJES.find(p => p.id === (PJ && PJ.mascota && PJ.mascota.pelaje)) || PELAJES[0];

// ---------- hojas con otros colores ----------
function rgbAhsl(r, g, b){
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hslArgb(h, s, l){
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, k = h / 360;
  const f = t => { t = (t + 1) % 1; return 255 * (t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p); };
  return [f(k + 1 / 3), f(k), f(k - 1 / 3)];
}
const HOJAS_COL = new Map();
function hojaRecoloreada(img, col, clave){
  if (!col || !img.complete || !img.naturalWidth) return img;
  if (HOJAS_COL.has(clave)) return HOJAS_COL.get(clave);
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const a = c.getContext('2d', { willReadFrequently:true }); a.drawImage(img, 0, 0);
  const id = a.getImageData(0, 0, c.width, c.height), d = id.data;
  for (let i = 0; i < d.length; i += 4){
    if (d[i + 3] < 8) continue;
    const [h, s, l] = rgbAhsl(d[i], d[i + 1], d[i + 2]);
    if (l < .1) continue;                                   // el contorno queda igual
    const [r, g, b] = hslArgb(col.h === null ? h : col.h, Math.min(1, Math.max(col.m || 0, s * col.s)), Math.min(.97, l * col.l));
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  a.putImageData(id, 0, 0);
  HOJAS_COL.set(clave, c); return c;
}
const hojaMontura = id => { const m = MONTURAS.find(x => x.id === id) || MONTURAS[0]; return hojaRecoloreada(MON_IMG, m.col, 'm|' + m.id); };
const hojaRata = id => { const p = PELAJES.find(x => x.id === id) || PELAJES[0]; return hojaRecoloreada(RATAS_IMG, p.col, 'r|' + p.id); };

// ---------- conseguir piezas ----------
// tipo: 'montura', 'pelaje' o 'tinte'. Devuelve true si es nueva.
function darColeccion(tipo, id, silencio){
  if (!PJ) return false;
  const c = coleccion();
  const lista = tipo === 'montura' ? c.monturas : tipo === 'pelaje' ? c.pelajes : (PJ.tintes = PJ.tintes || []);
  if (lista.includes(id)) return false;
  lista.push(id);
  const def = (tipo === 'montura' ? MONTURAS : tipo === 'pelaje' ? PELAJES : TINTES).find(x => x.id === id);
  if (!silencio && def){
    const que = tipo === 'montura' ? 'Nueva montura' : tipo === 'pelaje' ? 'Nuevo pelaje para tu mascota' : 'Nuevo tinte';
    banner(`¡${que}!`, `${def.n} · elígelo en Colección (C)`);
    chat(`${que}: [${def.n}]. Puedes usarlo desde la pestaña Colección de tu personaje.`, '#ff8000');
    sfx('logro');
    if (P) chispas(P.x, P.y - 30, '#ff8000', 30, 200);
  }
  guardar();
  return true;
}
// al despejar una mazmorra: los jefes de rango alto y el titán a veces sueltan una pieza
function premioColeccion(rango, titan){
  const todas = [...MONTURAS.map(x => ['montura', x]), ...PELAJES.map(x => ['pelaje', x]), ...TINTES_COL.map(x => ['tinte', x])];
  for (const [tipo, x] of todas){
    const prob = titan ? x.titan : (x.jefe === rango ? x.prob : 0);
    if (prob && Math.random() < prob && darColeccion(tipo, x.id)) return;   // como mucho una pieza por mazmorra
  }
}
// los logros que dan pieza (también los que ya tenías antes de existir la colección)
function logrosColeccion(){
  if (!PJ || !PJ.logros) return;
  for (const [tipo, lista] of [['pelaje', PELAJES], ['tinte', TINTES_COL], ['montura', MONTURAS]])
    for (const x of lista) if (x.logro && PJ.logros[x.logro]) darColeccion(tipo, x.id);
}

// ---------- pestaña Colección ----------
function htmlColeccion(){
  const c = coleccion(), tintes = PJ.tintes || [];
  const total = MONTURAS.length + PELAJES.length + TINTES.length + 1;
  const tengo = c.monturas.length + c.pelajes.length + tintes.length + 1;
  const tarjeta = (clave, n, tiene, sel, origen) => `<button type="button" class="col-item ${tiene ? '' : 'bloq'} ${sel ? 'sel' : ''}" data-col="${clave}" ${tiene ? '' : 'aria-disabled="true"'} title="${tiene ? n : origen}">
      <canvas width="72" height="58" data-colcv="${clave}"></canvas><b>${tiene ? n : '???'}</b><small>${tiene ? (sel ? 'En uso' : 'Usar') : origen}</small></button>`;
  let h = `<div class="col-cab"><b>Colección</b><span>${tengo} / ${total}</span></div>`;
  h += `<h4 class="col-sec">Monturas</h4><div class="col-grid">${MONTURAS.map(m => tarjeta('m:' + m.id, m.n, c.monturas.includes(m.id), montura().id === m.id, m.origen)).join('')}</div>`;
  h += `<h4 class="col-sec">Pelajes de mascota</h4>${PJ.mascota ? '' : '<p class="nota">Consigue una mascota para poder usarlos.</p>'}
    <div class="col-grid">${PELAJES.map(p => tarjeta('p:' + p.id, p.n, c.pelajes.includes(p.id), PJ.mascota && pelajeMascota().id === p.id, p.origen)).join('')}</div>`;
  h += `<h4 class="col-sec">Tintes de ropa</h4><div class="col-grid">${tarjeta('t:', 'Original', true, !PJ.tinte, '')}${TINTES.map(t => tarjeta('t:' + t.id, t.n, tintes.includes(t.id), PJ.tinte === t.id, t.origen || ORIGEN_TINTE_MERCADO)).join('')}</div>`;
  return h;
}
function pintarTarjetaCol(cv){
  const [tipo, id] = cv.dataset.colcv.split(':'), a = cv.getContext('2d'), W2 = cv.width, H2 = cv.height;
  const bloq = cv.parentElement.classList.contains('bloq');
  a.clearRect(0, 0, W2, H2); a.imageSmoothingEnabled = false;
  let img, sx, sy, w, h;
  if (tipo === 'm'){ if (!monListo) return; [sx, sy, w, h] = MON.cuadros[MON.tipos.jabali.idle[0]]; img = hojaMontura(id); }
  else if (tipo === 'p'){ if (!ratasListo) return; [sx, sy, w, h] = RATAS_DIR[PJ.mascota ? PJ.mascota.tipo : 0].ab[0]; img = hojaRata(id); }
  else { if (!gatosListo) return; [sx, sy, w, h] = cuadroGato(PJ.gato, 'ab', 0); img = hojaGato(PJ.gato, id || null); }
  if (bloq) img = siluetaBlanca(img instanceof HTMLImageElement ? img : (tipo === 'm' ? MON_IMG : tipo === 'p' ? RATAS_IMG : imgGato(PJ.gato)), '#000');
  const k = Math.min((W2 - 6) / w, (H2 - 4) / h), kk = k >= 1 ? Math.floor(k) : k;
  a.globalAlpha = bloq ? .55 : 1;
  a.drawImage(img, sx, sy, w, h, Math.round((W2 - w * kk) / 2), Math.round(H2 - 2 - h * kk), Math.round(w * kk), Math.round(h * kk));
  a.globalAlpha = 1;
}
function enlazarColeccion(cuerpo){
  cuerpo.querySelectorAll('[data-colcv]').forEach(pintarTarjetaCol);
  cuerpo.querySelectorAll('.col-item:not(.bloq)').forEach(b => b.onclick = () => {
    const [tipo, id] = b.dataset.col.split(':');
    if (tipo === 'm'){ PJ.monturaSel = id; if (window.pintarIcoMontura) pintarIcoMontura(); }
    else if (tipo === 'p'){ if (!PJ.mascota) return; PJ.mascota.pelaje = id; if (window.pintarIcoPet) pintarIcoPet(); }
    else { PJ.tinte = id || null; dibujarAvatar(); }
    guardar(); renderPj();
  });
}
