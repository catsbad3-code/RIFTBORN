// =====================================================
//  UTILIDADES
// =====================================================
const $ = id => document.getElementById(id);
const TAU = Math.PI * 2;
const T = 48; // tamaño de casilla
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angDif = (a, b) => { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
const escapar = s => String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

const cv = $('c'), ctx = cv.getContext('2d');
let W, H, DPR, INSET = 0;
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  INSET = parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0;
}
addEventListener('resize', resize); resize();

const esTactil = matchMedia('(pointer: coarse)').matches;
if (esTactil) document.body.classList.add('tactil');

// Pantalla completa: en el teléfono se activa sola al entrar al mundo (necesita un toque del jugador)
const docEl = document.documentElement;
const pcSoportada = !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
const enPantallaCompleta = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
const esApp = !!(matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone);
function pedirPantallaCompleta(){
  if (!pcSoportada || enPantallaCompleta()) return;
  const r = docEl.requestFullscreen ? docEl.requestFullscreen({ navigationUI:'hide' }) : docEl.webkitRequestFullscreen();
  if (r && r.then) r.then(() => { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); }).catch(() => {});
}
function alternarPantallaCompleta(){
  if (enPantallaCompleta()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  else pedirPantallaCompleta();
}
function marcarPantallaCompleta(){
  const on = enPantallaCompleta();
  for (const id of ['btnPantalla', 'btnPantallaPausa']){
    const b = $(id); if (!b) continue;
    b.classList.toggle('oculto', !pcSoportada || esApp);
    b.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
    if (id === 'btnPantallaPausa') b.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  }
  setTimeout(resize, 100);
}
document.addEventListener('fullscreenchange', marcarPantallaCompleta);
document.addEventListener('webkitfullscreenchange', marcarPantallaCompleta);

// Las cuentas y el guardado están en auth/auth.js

// =====================================================
//  DATOS DEL JUEGO
// =====================================================
const CLASES = {
  guerrero: { nombre:'Guerrero del Vacío', color:'#f2c46d', desc:'Resiste golpes y aplasta grupos enteros.',
    base:{ fue:14, agi:8, vit:14, int:6 },
    h1:{ n:'Tajo', d:'Corte en arco frente a ti.', cd:.45, ic:'⚔' },
    h2:{ n:'Golpe sísmico', d:'Onda que daña y empuja a todo a tu alrededor.', cd:4, coste:30, ic:'💥' } },
  sombra: { nombre:'Cazador de Sombras', color:'#9b7bff', desc:'Rápido, letal y difícil de atrapar.',
    base:{ fue:10, agi:16, vit:9, int:7 },
    h1:{ n:'Puñalada', d:'Golpes veloces con más crítico.', cd:.28, ic:'🗡' },
    h2:{ n:'Paso sombrío', d:'Te teletransportas atravesando y cortando enemigos.', cd:3, coste:25, ic:'🌑' } },
  mago: { nombre:'Mago de las Sombras', color:'#8a6bff', desc:'Canaliza las sombras y la magia oscura. Elegante y letal.',
    base:{ fue:6, agi:9, vit:9, int:16 },
    h1:{ n:'Lanzamiento de sombras', d:'Rayo de sombra que explota al impactar.', cd:.55, ic:'🌑' },
    h2:{ n:'Bola de sombra', d:'Vórtice que arrastra, daña y ralentiza a los enemigos.', cd:5, coste:35, ic:'🌀' } }
};

const RANGOS = [
  { l:'E', color:'#a8b3bf', tema:'Cueva Musgosa',    suelo:'#26332b', pared:'#121a15', cara:'#3a5240', acento:'#6fd36b', enemigos:['slime','jabali'],        jefe:'Rey Limo',           escala:1,   nivel:'1 a 9' },
  { l:'D', color:'#4fa3ff', tema:'Caverna de Arena', suelo:'#3d3324', pared:'#1c160c', cara:'#6c5b3c', acento:'#e0b060', enemigos:['escorpion','slime','jabali'],   jefe:'Rey Colmillo',    escala:2.3, nivel:'10 a 19' },
  { l:'C', color:'#5ee6d0', tema:'Gruta Helada',     suelo:'#2a3a48', pared:'#0f1820', cara:'#4b6a85', acento:'#9fd8ff', enemigos:['mantis','arana'],     jefe:'Mantis de Escarcha',   escala:4.6, nivel:'20 a 29' },
  { l:'B', color:'#b05cff', tema:'Cráter de Magma',  suelo:'#2e1612', pared:'#130605', cara:'#5c2316', acento:'#ff6a3d', enemigos:['escorpion','arana'],   jefe:'Araña de Magma',     escala:8.5, nivel:'30 a 44' },
  { l:'A', color:'#ff9a3d', tema:'Abismo del Vacío', suelo:'#1a1330', pared:'#08050f', cara:'#2e2250', acento:'#9b6bff', enemigos:['arana','mantis'],    jefe:'Monarca del Vacío',  escala:15,  nivel:'45 a 59' },
  { l:'S', color:'#e2445c', tema:'Grieta Roja',      suelo:'#2a0c12', pared:'#0e0205', cara:'#5a1420', acento:'#ff4f6b', enemigos:['escorpion','mantis','jabali'],      jefe:'Monarca Carmesí',    escala:26,  nivel:'60 o más' }
];
const UMBRAL_RANGO = [1, 10, 20, 30, 45, 60];
function rangoDeNivel(n){ let r = 0; for (let i = 0; i < 6; i++) if (n >= UMBRAL_RANGO[i]) r = i; return r; }
const rangoCazador = () => rangoDeNivel(PJ.nivel);

const ENEM = {
  slime:     { n:'Limo',               hp:42, dmg:5,  vel:70,  r:13, color:'#6fd36b', xp:6, oro:3, spr:'slime',     alto:42 },
  mantis:    { n:'Mantis acechadora',  hp:40, dmg:8,  vel:135, r:14, color:'#c9a050', xp:7, oro:4, spr:'mantis',    alto:64 },
  escorpion: { n:'Escorpión cangrejo', hp:75, dmg:10, vel:95,  r:17, color:'#d9603a', xp:9, oro:5, spr:'escorpion', alto:60 },
  arana:     { n:'Araña tejedora',     hp:52, dmg:9,  vel:150, r:15, color:'#7a80d0', xp:9, oro:5, spr:'arana',     alto:46, rango:true },
  jabali:    { n:'Jabalí furioso',     hp:90, dmg:12, vel:110, r:17, color:'#8a6a52', xp:10, oro:5, spr:'jabali',   alto:58 }
};

// =====================================================
//  PODERES, OBJETOS Y EQUIPO
// =====================================================
CLASES.guerrero.h1.spr = 'corte'; CLASES.guerrero.h2.spr = 'domo';
CLASES.sombra.h1.spr = 'corte';   CLASES.sombra.h2.spr = 'tp';
CLASES.mago.h1.spr = 'rayo';      CLASES.mago.h2.spr = 'bola';

// Poderes de las sombras: se aprenden al subir de nivel y van en la barra (Q F R 1 2 3 4)
const PODERES = {
  paso:     { n:'Paso de las sombras', d:'Te desvaneces y reapareces hacia donde apuntas, dañando a quien esté cerca al llegar.', nivel:2,  cd:6,  coste:20, ic:'tp' },
  luna:     { n:'Media luna oscura',   d:'Lanzas una media luna de sombra que atraviesa a todos los enemigos a su paso.', nivel:4,  cd:4,  coste:25, ic:'luna' },
  soldado:  { n:'Levántate',           d:'Invocas a un soldado de sombra que pelea a tu lado durante 22 segundos.', nivel:6,  cd:18, coste:40, ic:'soldado' },
  lluvia:   { n:'Lluvia de sombras',   d:'Haces caer sombras sobre la zona a la que apuntas durante un momento.', nivel:9,  cd:10, coste:45, ic:'lluvia' },
  ola:      { n:'Ola de sombra',       d:'Una ola enorme avanza, atraviesa y empuja a todos los enemigos.', nivel:12, cd:7,  coste:35, ic:'ola' },
  domo:     { n:'Erupción del abismo', d:'Las sombras estallan a tu alrededor y lanzan lejos a los enemigos.', nivel:16, cd:12, coste:50, ic:'domo' },
  ejercito: { n:'Ejército de sombras', d:'Levantas a tres soldados de sombra y recuperas parte de tu vida.', nivel:20, cd:60, coste:80, ic:'pilar' }
};
const TECLAS = ['Q','F','R','1','2','3','4'];
const CODIGO_TECLA = { KeyQ:'Q', KeyF:'F', KeyR:'R', Digit1:'1', Digit2:'2', Digit3:'3', Digit4:'4' };

const RAREZAS = [
  { n:'Común',      c:'#ffffff', m:1 },
  { n:'Poco común', c:'#1eff00', m:1.3 },
  { n:'Raro',       c:'#0070dd', m:1.7 },
  { n:'Épico',      c:'#a335ee', m:2.2 },
  { n:'Legendario', c:'#ff8000', m:3 }
];
const RANURAS = {
  cabeza:  { n:'Cabeza',  ic:'🪖', bases:['Capucha','Yelmo','Diadema'] },
  amuleto: { n:'Cuello',  ic:'📿', bases:['Amuleto','Colgante','Talismán'] },
  pecho:   { n:'Pecho',   ic:'🧥', bases:['Abrigo','Coraza','Túnica'] },
  manos:   { n:'Manos',   ic:'🧤', bases:['Guantes','Garras','Brazales'] },
  piernas: { n:'Piernas', ic:'👖', bases:['Pantalones','Grebas','Musleras'] },
  pies:    { n:'Pies',    ic:'👢', bases:['Botas','Sandalias','Escarpes'] },
  anillo:  { n:'Dedo',    ic:'💍', bases:['Anillo','Sello','Sortija'] },
  arma:    { n:'Arma',    ic:'🗡️', bases:['Espada','Daga','Báculo','Grimorio'] }
};
const IZQ = ['cabeza','amuleto','pecho','manos'], DER = ['piernas','pies','anillo','arma'];
const SUFIJOS = ['del Musgo','de Arena','de Escarcha','de Magma','del Vacío','Carmesí'];
const NOMBRE_STAT = { fue:'Fuerza', agi:'Agilidad', vit:'Vitalidad', int:'Inteligencia' };
const DESC_STAT = { fue:'daño físico', agi:'velocidad y crítico', vit:'vida y defensa', int:'energía y magia' };
const TAM_BOLSA = 24;

let uidObj = 0;
// íconos de objetos de uso, cofre y minerales
const IC3 = {"libro": 0, "corazon": 1, "bomba": 2, "pergamino": 3, "pocion": 4, "farol": 5, "tetera": 6, "bolsa": 7, "seta": 8, "calavera": 9, "escudo": 10, "cofre": 11, "m_plata": 12, "m_cobre": 13, "m_hierro": 14, "m_estano": 15, "m_plomo": 16, "m_zinc": 17, "m_oro": 18, "p_gelatina": 19, "p_guadana": 20, "p_colmillo": 21, "p_pinza": 22, "p_seda": 23, "p_nucleo": 24};
const IC3_URL = 'img/ic3.png';
const IC3_N = Object.keys(IC3).length;
const IC3_IMG = new Image(); IC3_IMG.src = IC3_URL;
const ic3 = k => `<span class="ic3" style="background-image:url(${IC3_URL});background-position:${(IC3[k] / (IC3_N - 1) * 100).toFixed(4)}% 0"></span>`;
function dibujarIc3(k, x, y, tam){ if (IC3_IMG.complete && IC3_IMG.width) ctx.drawImage(IC3_IMG, IC3[k] * 64, 0, 64, 64, x - tam / 2, y - tam / 2, tam, tam); }
// objetos que se apilan en la bolsa: consumibles y minerales
const APILABLES = {
  corazon:   { n:'Corazón de fénix',        d:'Restaura toda tu vida al instante.', valor:2500, usa:true, r:3 },
  seta:      { n:'Seta saltarina',          d:'Obtienes Celeridad durante 30 segundos.', valor:400, usa:true, r:1 },
  libro:     { n:'Tomo de furia',           d:'Obtienes Furia de sombras durante 30 segundos.', valor:800, usa:true, r:2 },
  pergamino: { n:'Pergamino de protección', d:'Obtienes Coraza de sombras durante 30 segundos.', valor:800, usa:true, r:2 },
  tetera:    { n:'Té de la posada',         d:'Recupera la mitad de tu energía y te deja Descansado 2 minutos.', valor:300, usa:true, r:1 },
  farol:     { n:'Farol purificador',       d:'Elimina todos tus efectos negativos (veneno, lentitud...).', valor:600, usa:true, r:1 },
  bomba:     { n:'Bomba de sombras',        d:'Explota a tu alrededor y daña a los enemigos cercanos. Solo dentro de los portales.', valor:700, usa:true, r:2 },
  m_cobre:   { n:'Mineral de cobre',  d:'Material. Se encuentra en las cuevas de rango E.', valor:300,   mat:true, r:0 },
  m_hierro:  { n:'Mineral de hierro', d:'Material. Se encuentra en las cuevas de rango D.', valor:900,   mat:true, r:0 },
  m_estano:  { n:'Mineral de estaño', d:'Material. Se encuentra en las cuevas de rango C.', valor:2000,  mat:true, r:1 },
  m_plata:   { n:'Mineral de plata',  d:'Material. Se encuentra en las cuevas de rango B.', valor:4000,  mat:true, r:1 },
  m_oro:     { n:'Pepita de oro',     d:'Material. Se encuentra en las cuevas de rango A.', valor:8000,  mat:true, r:2 },
  m_plomo:   { n:'Mineral del abismo',d:'Material. Se encuentra en las grietas de rango S.', valor:15000, mat:true, r:3 },
  m_zinc:    { n:'Mineral de cinc',   d:'Material común de las cuevas.', valor:200, mat:true, r:0 },
  p_gelatina:{ n:'Gelatina de limo',     d:'Parte de monstruo. La sueltan los limos. Se usa en misiones.', valor:120, mat:true, parte:true, r:0 },
  p_guadana: { n:'Guadaña de mantis',    d:'Parte de monstruo. La sueltan las mantis. Se usa en misiones.', valor:250, mat:true, parte:true, r:0 },
  p_pinza:   { n:'Garra de escorpión',   d:'Parte de monstruo. La sueltan los escorpiones. Se usa en misiones.', valor:350, mat:true, parte:true, r:1 },
  p_seda:    { n:'Seda de araña',        d:'Parte de monstruo. La sueltan las arañas. Se usa en misiones.', valor:400, mat:true, parte:true, r:1 },
  p_colmillo:{ n:'Colmillo de jabalí',   d:'Parte de monstruo. Lo sueltan los jabalíes. Se usa en misiones.', valor:300, mat:true, parte:true, r:0 },
  p_nucleo:  { n:'Núcleo de jefe',       d:'Corazón de energía que deja cada jefe de portal. Muy buscado en misiones.', valor:5000, mat:true, parte:true, r:3 }
};
const PARTE_MONSTRUO = { slime:'p_gelatina', mantis:'p_guadana', escorpion:'p_pinza', arana:'p_seda', jabali:'p_colmillo' };
const MINERAL_RANGO = ['m_cobre', 'm_hierro', 'm_estano', 'm_plata', 'm_oro', 'm_plomo'];
const CONSUMIBLES = ['seta', 'libro', 'pergamino', 'tetera', 'farol', 'bomba', 'corazon'];
function darApilable(k, n = 1){ PJ.mats = PJ.mats || {}; PJ.mats[k] = (PJ.mats[k] || 0) + n; }
function usarApilable(k){
  const A = APILABLES[k]; if (!A || !A.usa || !(PJ.mats[k] > 0)) return;
  if (k === 'bomba'){
    if (E.tipo !== 'mazmorra'){ texto(P.x, P.y - 74, 'Solo dentro de los portales', '#9a91c2', 14); return; }
    chispas(P.x, P.y, '#b05cff', 40, 320); shake = Math.max(shake, 12);
    for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - P.x, e.y - P.y) < 170) herir(e, D.poder * 3);
  }
  else if (k === 'corazon'){ if (P.hp >= D.maxHp){ texto(P.x, P.y - 70, 'Vida completa', '#9a91c2', 14); return; } P.hp = D.maxHp; texto(P.x, P.y - 70, 'Vida restaurada', '#7dffa8', 16); }
  else if (k === 'seta') ponerEfecto('agi_up', 30);
  else if (k === 'libro') ponerEfecto('atk_up', 30);
  else if (k === 'pergamino') ponerEfecto('def_up', 30);
  else if (k === 'tetera'){ P.en = Math.min(D.maxEn, P.en + D.maxEn * .5); ponerEfecto('spi_up', 120); }
  else if (k === 'farol'){ limpiarEfectos(true); texto(P.x, P.y - 70, 'Purificado', '#ffe3a1', 15); }
  PJ.mats[k]--; if (PJ.mats[k] <= 0) delete PJ.mats[k];
  chat(`Usas [${A.n}].`, '#ffe3a1'); guardar(); renderBolsa();
}
function venderApilable(k, todo){
  if (E.tipo !== 'tienda'){ chat('Solo puedes vender en el Mercado de Lumeria.', '#ff8a9b'); return; }
  const n = todo ? PJ.mats[k] : 1; if (!n) return;
  const v = APILABLES[k].valor * n; PJ.oro += v; PJ.mats[k] -= n; if (PJ.mats[k] <= 0) delete PJ.mats[k];
  chat(`Vendes ${n} × [${APILABLES[k].n}] por ${dineroTxt(v)}.`, '#f2c46d'); guardar(); renderBolsa();
}
function htmlTipApilable(k){
  const A = APILABLES[k], n = PJ.mats[k] || 0;
  return `<div style="display:flex;flex-direction:column"><span class="tn" style="color:${RAREZAS[A.r].c}">${A.n}</span>
    <span>${A.parte ? 'Parte de monstruo' : A.mat ? 'Material de oficio' : 'Consumible'}${n > 1 ? ` · Montón de ${n}` : ''}</span>
    <span class="${A.usa ? 'verde' : 'gris'}">${A.usa ? 'Uso: ' : ''}${A.d}</span>
    <span>Precio de venta: ${dinero(A.valor)}${n > 1 ? ` <span class="gris">(todo: </span>${dinero(A.valor * n)}<span class="gris">)</span>` : ''}</span>
    <div class="tsep"></div><span class="verde">${A.usa ? 'Clic derecho: usar' : E.tipo === 'tienda' ? 'Clic: vender' : 'Se vende en el Mercado'}</span></div>`;
}
// íconos pixelados de objetos: cada ranura (y cada tipo de arma) tiene varias variantes
const ICONOS_OBJ = {"cabeza": [0, 1, 2, 3], "amuleto": [4, 5, 6, 7], "pecho": [8, 9, 10, 11, 12, 13, 14], "manos": [15, 16, 17], "piernas": [18], "pies": [19, 20, 21], "anillo": [22, 23, 24, 25], "Espada": [26, 27, 28, 29, 30], "Daga": [31, 32, 33], "B\u00e1culo": [34, 35, 36, 37], "Grimorio": [38, 39, 40, 41], "pocion": [42], "b_veneno": [43], "b_atk_up": [44], "b_def_up": [45], "b_spi_up": [46], "b_agi_up": [47], "b_atk_dn": [48], "b_def_dn": [49], "b_spi_dn": [50], "b_agi_dn": [51]};
const ICONOS_URL = 'img/iconos.png';
const ICONOS_N = Object.values(ICONOS_OBJ).reduce((a, l) => a + l.length, 0);
function iconoDe(o){
  let lista = ICONOS_OBJ[o.slot];
  if (o.slot === 'arma') lista = ICONOS_OBJ[Object.keys(ICONOS_OBJ).find(k => o.nombre.startsWith(k)) || 'Espada'];
  if (!lista) return null;
  let h = 0; for (const ch of String(o.id)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return lista[Math.abs(h) % lista.length];
}
function icoObj(o){
  const i = iconoDe(o);
  if (i === null) return RANURAS[o.slot].ic;
  return `<span class="ico-obj" style="background-image:url(${ICONOS_URL});background-position:${(i / (ICONOS_N - 1) * 100).toFixed(4)}% 0"></span>`;
}
function crearObjeto(rango, minR = 0, slot = null, rarezaFija = null){
  const slots = Object.keys(RANURAS);
  slot = slot || slots[Math.random() * slots.length | 0];
  let r = rarezaFija;
  if (r === null){
    const x = Math.random();
    r = x < .55 ? 0 : x < .83 ? 1 : x < .95 ? 2 : x < .99 ? 3 : 4;
    r = Math.max(r, minR);
    if (minR >= 2 && Math.random() < .25) r = Math.min(4, r + 1);
  }
  const nivel = Math.max(1, UMBRAL_RANGO[rango] + (Math.random() * 8 | 0));
  const presupuesto = (3 + nivel * .7) * RAREZAS[r].m;
  const claves = ['fue','agi','vit','int'].sort(() => Math.random() - .5).slice(0, 1 + (r >= 2 ? 1 : 0) + (r >= 4 ? 1 : 0));
  const stats = {}; let resto = presupuesto;
  claves.forEach((k, i) => { const v = i === claves.length - 1 ? resto : resto * rand(.4, .7); stats[k] = Math.max(1, Math.round(v)); resto -= v; });
  const bases = RANURAS[slot].bases, base = bases[Math.random() * bases.length | 0];
  const obj = { id:Date.now().toString(36) + '-' + (uidObj++), slot, nombre:r === 4 ? `${base} del Monarca` : `${base} ${SUFIJOS[rango]}`, rareza:r, nivel, stats };
  if (slot === 'arma') obj.dmg = Math.round(presupuesto * 1.2);
  return obj;
}
const precioVenta = o => Math.round((4 + o.nivel) * (o.rareza + 1) * 157);
// dinero como en WoW: todo se guarda en cobre (100 cobre = 1 plata, 100 plata = 1 oro)
function dinero(c){
  c = Math.max(0, Math.floor(c));
  const g = Math.floor(c / 10000), p = Math.floor(c / 100) % 100, k = c % 100;
  let h = '';
  if (g) h += `<span class="mon">${g}<i class="m-o" title="oro"></i></span>`;
  if (g || p) h += `<span class="mon">${p}<i class="m-p" title="plata"></i></span>`;
  h += `<span class="mon">${k}<i class="m-c" title="cobre"></i></span>`;
  return `<span class="dinero">${h}</span>`;
}
function dineroTxt(c){
  c = Math.max(0, Math.floor(c));
  const g = Math.floor(c / 10000), p = Math.floor(c / 100) % 100, k = c % 100, r = [];
  if (g) r.push(`${g} de oro`); if (p) r.push(`${p} de plata`); if (k || !r.length) r.push(`${k} de cobre`);
  return r.length > 1 ? r.slice(0, -1).join(', ') + ' y ' + r[r.length - 1] : r[0];
}

// =====================================================
//  NAVEGACIÓN
// =====================================================
const PANTALLAS = ['pAuth','pMenu','pAyuda','pPersonajes','pCrear','pPausa','pPerfil','pTienda','pForja','pPortal','pMascota','pMuerte','pMision'];
const PANELES_JUEGO = ['pPausa','pPerfil','pTienda','pForja','pPortal','pMascota','pMision'];
let pantallaActual = null, ayudaVolver = 'pAuth', perfilVolver = null;
function pantalla(id){
  pantallaActual = id;
  PANTALLAS.forEach(p => $(p).classList.toggle('oculto', p !== id));
  sticks.mov = null; mouse.izq = false; holdAtk = false;
}
function ir(id){
  if (id === 'pMenu') $('saludo').textContent = `Bienvenido, ${cuenta().nombre}.`;
  if (id === 'pPersonajes') renderPersonajes();
  if (id === 'pCrear') renderCrear();
  if (id === 'pAyuda') ayudaVolver = pantallaActual || 'pAuth';
  pantalla(id);
}
document.querySelectorAll('[data-ir]').forEach(b => b.addEventListener('click', () => ir(b.dataset.ir)));
document.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', () => pantalla(null)));

let modoReg = false;
function setModo(reg){
  modoReg = reg;
  $('tabEntrar').classList.toggle('oculto', !reg);
  $('tabReg').classList.toggle('oculto', reg);
  $('lPass2').classList.toggle('oculto', !reg);
  $('aBtn').textContent = reg ? 'Crear cuenta' : 'Conectar';
  $('aPass').autocomplete = reg ? 'new-password' : 'current-password';
  $('aErr').textContent = '';
}
setModo(false);
try { const r = localStorage.getItem('rb_recordar'); if (r){ $('aUser').value = r; $('aRecordar').checked = true; } } catch (e) {}
$('tabEntrar').onclick = () => setModo(false);
$('tabReg').onclick = () => setModo(true);
$('btnCreditos').onclick = () => { $('aErr').textContent = ''; document.querySelector('.wl-copy').textContent = 'Riftborn: arte de la comunidad pixel art, código y diseño hechos con cariño. ¡Gracias por jugar!'; };
$('fAuth').addEventListener('submit', e => {
  e.preventDefault();
  const u = $('aUser').value, p = $('aPass').value;
  let err = modoReg ? registrar(u, p, $('aPass2').value) : null;
  if (!err) err = iniciarSesion(u, p);
  if (err){ $('aErr').textContent = err; return; }
  try { if ($('aRecordar').checked) localStorage.setItem('rb_recordar', u.trim()); else localStorage.removeItem('rb_recordar'); } catch (er) {}
  $('aPass').value = $('aPass2').value = '';
  setModo(false);
  ir('pPersonajes');
});
$('btnLogout').onclick = () => { usuario = null; DB.setSesion(null); setModo(false); pantalla('pAuth'); };
$('btnAyudaVolver').onclick = () => pantalla(ayudaVolver);

function migrar(pj){
  pj.limpias = pj.limpias || { E:0, D:0, C:0, B:0, A:0, S:0 };
  pj.kills = pj.kills || 0;
  pj.jefesTotal = pj.jefesTotal || 0;
  pj.tiempo = pj.tiempo || 0;
  if (pj.gato === undefined) pj.gato = 0;
  pj.equipo = pj.equipo || { cabeza:null, amuleto:null, pecho:null, manos:null, piernas:null, pies:null, anillo:null, arma:null };
  pj.bolsa = pj.bolsa || [];
  pj.misiones = pj.misiones || {};
  pj.mats = pj.mats || {};
  if (!pj.curvaDura){ pj.xpSig = xpNecesaria(pj.nivel || 1); pj.xp = Math.min(pj.xp || 0, pj.xpSig - 1); pj.curvaDura = true; }
  if (pj.hermandad && pj.hermandad.band === undefined) pj.hermandad.band = 0;
  if (pj.hermandad === undefined) pj.hermandad = null;
  if (!pj.monedaCobre){ pj.oro = Math.round((pj.oro || 0) * 100); pj.monedaCobre = true; }
  pj.barra = pj.barra || { Q:'paso', F:'luna', R:'soldado', '1':'lluvia', '2':'ola', '3':'domo', '4':'ejercito' };
  return pj;
}

let pjSel = null, rotSel = 0, borrarArmado = false;
const LUGAR_PJ = { posada:'Posada del Eclipse', tienda:'Mercado de Lumeria', asociacion:'Asociación de Cazadores', ciudad:'Ciudad de Lumeria', mazmorra:'Ciudad de Lumeria' };
function renderPersonajes(){
  const c = cuenta(), lista = $('listaPj');
  lista.innerHTML = '';
  if (!c.personajes.length){ lista.innerHTML = '<p class="ws-vacio">Aún no tienes personajes en este reino. Crea uno para despertar.</p>'; pjSel = null; }
  if (pjSel && !c.personajes.some(p => p.id === pjSel)) pjSel = null;
  if (!pjSel && c.personajes.length){ let u = null; try { u = localStorage.getItem('rb_ultimo'); } catch (e) {} pjSel = c.personajes.some(p => p.id === u) ? u : c.personajes[0].id; }
  c.personajes.forEach(pj => {
    const b = document.createElement('button'); b.className = 'ws-pj' + (pj.id === pjSel ? ' sel' : ''); b.type = 'button';
    b.innerHTML = `<b>${escapar(pj.nombre)}</b><span>Nivel ${pj.nivel} ${CLASES[pj.clase].nombre}</span><small>${LUGAR_PJ[pj.lugar] || 'Posada del Eclipse'}</small>`;
    b.onclick = () => { pjSel = pj.id; rotSel = 0; borrarArmado = false; renderPersonajes(); };
    b.ondblclick = () => entrarMundo();
    lista.appendChild(b);
  });
  $('btnNuevoPj').disabled = c.personajes.length >= 4;
  $('btnNuevoPj').textContent = c.personajes.length >= 4 ? 'Máximo 4 personajes' : 'Crear personaje';
  $('btnEntrarMundo').disabled = !pjSel;
  $('btnBorrarPj').disabled = !pjSel;
  $('btnBorrarPj').textContent = borrarArmado ? '¿Seguro? Pulsa otra vez' : 'Borrar personaje';
}
function entrarMundo(){
  if (!pjSel) return;
  if (esTactil) pedirPantallaCompleta();
  try { localStorage.setItem('rb_ultimo', pjSel); } catch (e) {}
  $('fundido').classList.add('ver');
  setTimeout(() => { empezar(pjSel); $('fundido').classList.remove('ver'); }, 450);
}
$('btnEntrarMundo').onclick = entrarMundo;
$('btnBorrarPj').onclick = () => {
  if (!pjSel) return;
  if (!borrarArmado){ borrarArmado = true; renderPersonajes(); return; }
  const cc = cuenta(); cc.personajes = cc.personajes.filter(x => x.id !== pjSel); guardarCuenta(cc);
  pjSel = null; borrarArmado = false; renderPersonajes();
};
$('rotIzq').onclick = $('rotIzq2').onclick = () => rotSel = (rotSel + 3) % 4;
$('rotDer').onclick = $('rotDer2').onclick = () => rotSel = (rotSel + 1) % 4;
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (pantallaActual === 'pPersonajes'){
    const c = cuenta(); if (!c) return;
    const i = c.personajes.findIndex(p => p.id === pjSel);
    if (e.code === 'Enter') entrarMundo();
    else if (e.code === 'ArrowDown' && i < c.personajes.length - 1){ pjSel = c.personajes[i + 1].id; renderPersonajes(); }
    else if (e.code === 'ArrowUp' && i > 0){ pjSel = c.personajes[i - 1].id; renderPersonajes(); }
    else if (e.code === 'ArrowLeft') rotSel = (rotSel + 3) % 4;
    else if (e.code === 'ArrowRight') rotSel = (rotSel + 1) % 4;
  }
});

// escena 3/4 con pedestal al estilo de la pantalla de personajes de WoW
function dibujarEscenaPj(cv, gato, clase, t, rot, mascota){
  const a = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, pie = h * .8;
  a.clearRect(0, 0, w, h);
  const col = CLASES[clase].color;
  // haz de luz
  const luz = a.createLinearGradient(0, 0, 0, pie);
  luz.addColorStop(0, 'rgba(255,240,200,0)'); luz.addColorStop(1, 'rgba(255,230,170,.16)');
  a.fillStyle = luz; a.beginPath(); a.moveTo(cx - 40, 0); a.lineTo(cx + 40, 0); a.lineTo(cx + 150, pie); a.lineTo(cx - 150, pie); a.fill();
  // pedestal de piedra
  a.fillStyle = '#1a1612'; a.beginPath(); a.ellipse(cx, pie + 16, 170, 46, 0, 0, TAU); a.fill();
  const pd = a.createLinearGradient(0, pie - 30, 0, pie + 16);
  pd.addColorStop(0, '#6b6355'); pd.addColorStop(1, '#2c2620');
  a.fillStyle = pd; a.beginPath(); a.ellipse(cx, pie, 165, 42, 0, 0, TAU); a.fill();
  a.strokeStyle = '#8c826e'; a.lineWidth = 2; a.beginPath(); a.ellipse(cx, pie, 165, 42, 0, 0, TAU); a.stroke();
  // anillo de runas con el color de la clase
  a.save(); a.shadowColor = col; a.shadowBlur = 18; a.strokeStyle = col; a.globalAlpha = .55 + .2 * Math.sin(t / 700);
  a.lineWidth = 3; a.beginPath(); a.ellipse(cx, pie, 120, 30, 0, 0, TAU); a.stroke();
  a.lineWidth = 1.5; a.setLineDash([6, 10]); a.lineDashOffset = -t / 60; a.beginPath(); a.ellipse(cx, pie, 140, 36, 0, 0, TAU); a.stroke();
  a.restore();
  a.fillStyle = 'rgba(0,0,0,.5)'; a.beginPath(); a.ellipse(cx, pie, 70, 15, 0, 0, TAU); a.fill();
  if (!gatosListo) return;
  const dirs = ['ab', 'lado', 'ar', 'lado'], dir = dirs[rot];
  let flip = rot === 3;
  const g = GATOS_DIR[gato];
  let set = dir;
  if (rot === 3 && g.de && g.de.length){ set = 'de'; flip = false; }
  const [sx, sy, fw, fh, ax, ay] = cuadroGato(gato, g['q_' + set] && g['q_' + set].length ? 'q_' + set : set, Math.floor(t / 700)), esc = (h * .62) / 96, r = Math.sin(t / 520);
  a.save(); a.translate(cx, pie + 4); a.scale((flip ? -1 : 1) * (1 - .01 * r), 1 + .018 * r);
  a.drawImage(GATOS_IMG, sx, sy, fw, fh, -ax * esc, -ay * esc, fw * esc, fh * esc);
  a.restore();
  if (mascota && ratasListo){
    const q = cuadroRata(mascota.tipo, 'abajo', false, 0, true);
    pintarGato(a, mascota.tipo, cx + 120, pie + 14, 86, t, false, false, 0, null, q.img, q.fr);
  }
}

let claseElegida = 'mago';
let gatoPj = 0;
const ICONO_CLASE = { guerrero:'⚔️', sombra:'🗡️', mago:'🔮' };
const NOMBRES_AL = ['Kael','Mira','Thorne','Luna','Vex','Nyx','Rayo','Sombra','Bigotes','Zarpa','Eclipse','Ónix','Ceniza','Runa','Michi','Garra'];
function renderCrear(){
  $('cNombre').value = ''; $('cErr').textContent = ''; rotSel = 0;
  const gc = $('gatosPj'); gc.innerHTML = '';
  TIPOS_GATO.forEach((nombre, i) => {
    const b = document.createElement('button'); b.className = 'wc-ic'; b.type = 'button'; b.title = nombre;
    b.setAttribute('aria-pressed', i === gatoPj); b.setAttribute('aria-label', nombre);
    const c = document.createElement('canvas'); c.width = c.height = 64; b.appendChild(c);
    b.onclick = () => { gatoPj = i; gc.querySelectorAll('.wc-ic').forEach(x => x.setAttribute('aria-pressed', x === b)); $('gatoNom').textContent = nombre; };
    gc.appendChild(b);
    const pintar = () => { const a = c.getContext('2d'), [sx, sy, w] = cuadroGato(i, GATOS_DIR[i].q_ab ? 'q_ab' : 'ab', 0), l = Math.min(w, 70); a.fillStyle = '#1d1638'; a.fillRect(0, 0, 64, 64); a.drawImage(GATOS_IMG, sx + (w - l) / 2, sy, l, l, 2, 4, 60, 60); };
    if (gatosListo) pintar(); else GATOS_IMG.addEventListener('load', pintar, { once:true });
  });
  const sub = document.createElement('p'); sub.className = 'wc-sub'; sub.id = 'gatoNom'; sub.textContent = TIPOS_GATO[gatoPj];
  gc.after(sub);
  if (gc.nextElementSibling && gc.nextElementSibling.nextElementSibling && gc.nextElementSibling.nextElementSibling.id === 'gatoNom') gc.nextElementSibling.remove();
  const cont = $('clases'); cont.innerHTML = '';
  Object.entries(CLASES).forEach(([id, c]) => {
    const b = document.createElement('button'); b.className = 'wc-ic'; b.type = 'button'; b.title = c.nombre;
    b.style.background = `radial-gradient(${c.color}66, #100c08 70%)`;
    b.setAttribute('aria-pressed', id === claseElegida); b.textContent = ICONO_CLASE[id] || '★';
    b.onclick = () => { claseElegida = id; cont.querySelectorAll('.wc-ic').forEach(x => x.setAttribute('aria-pressed', x === b)); infoClase(); };
    cont.appendChild(b);
  });
  infoClase();
}
function infoClase(){
  const c = CLASES[claseElegida];
  $('claseInfo').innerHTML = `<div class="wpanel-tit">Clase</div><h3 style="color:${c.color}">${c.nombre}</h3><p>${c.desc}</p>
    <dl><dt>Clic izquierdo: ${c.h1.n}</dt><dd>${c.h1.d}</dd><dt>Clic derecho: ${c.h2.n}</dt><dd>${c.h2.d}</dd>
    <dt>Atributos iniciales</dt><dd>Fuerza ${c.base.fue}, Agilidad ${c.base.agi}, Vitalidad ${c.base.vit}, Inteligencia ${c.base.int}</dd></dl>`;
}
$('btnAleatorio').onclick = () => { $('cNombre').value = NOMBRES_AL[Math.random() * NOMBRES_AL.length | 0] + (Math.random() < .5 ? '' : NOMBRES_AL[Math.random() * NOMBRES_AL.length | 0].toLowerCase()); };
$('btnNuevoPj').onclick = () => ir('pCrear');
$('btnCrear').onclick = () => {
  const nombre = $('cNombre').value.trim();
  if (nombre.length < 2){ $('cErr').textContent = 'Ponle un nombre de al menos 2 letras.'; return; }
  const c = cuenta();
  if (c.personajes.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())){ $('cErr').textContent = 'Ya tienes un personaje con ese nombre.'; return; }
  const pj = migrar({ id:Date.now().toString(36), nombre, clase:claseElegida, nivel:1, xp:0, xpSig:xpNecesaria(1),
    stats:{ ...CLASES[claseElegida].base }, puntos:0, oro:3000, monedaCobre:true, curvaDura:true, pociones:3, arma:0 });
  pj.gato = gatoPj;
  pj.equipo.arma = crearObjeto(0, 0, 'arma', 0);
  pj.equipo.pecho = crearObjeto(0, 0, 'pecho', 0);
  c.personajes.push(pj); guardarCuenta(c);
  pjSel = pj.id; rotSel = 0;
  ir('pPersonajes');
};

// =====================================================
//  ESTADO DE PARTIDA
// =====================================================
let enJuego = false, PJ, D, P, E, CIUDAD;
let enemigos = [], proys = [], proysE = [], botin = [], efectos = [], particulas = [], textos = [], soldados = [], zonas = [];
let portales = [], timerPortal = 0;
let cam = { x:0, y:0 }, shake = 0, timerGuardado = 0, interCerca = null, jefeVivo = null, campo = null, timerCampo = 0;

function statsTotales(){
  const s = { ...PJ.stats }; let dmg = 0;
  for (const it of Object.values(PJ.equipo)) if (it){ for (const k in it.stats) s[k] += it.stats[k]; dmg += it.dmg || 0; }
  return { s, dmg };
}
function derivar(){
  const { s, dmg } = statsTotales(), n = PJ.nivel;
  D = {
    s, dmgArma:dmg,
    maxHp: Math.round(60 + s.vit * 8 + n * 6),
    maxEn: Math.round(50 + s.int * 3),
    fis: s.fue * 1.3 + PJ.arma * 5 + dmg + n,
    mag: s.int * 1.5 + PJ.arma * 5 + dmg + n,
    vel: Math.min(310, 165 + s.agi * 2.4),
    crit: Math.min(.5, .05 + s.agi * .006),
    def: Math.min(.45, s.vit * .006),
    regEn: 6 + s.int * .3,
    regHp: s.vit * .06
  };
  D.poder = Math.max(D.fis, D.mag);
}

function empezar(id){
  PJ = migrar(cuenta().personajes.find(p => p.id === id));
  derivar();
  P = { x:0, y:0, mx:0, my:0, pose:{ n:'', t:0, dur:1 }, r:14, hp:D.maxHp, en:D.maxEn, ang:Math.PI / 2, ldx:0, ldy:1,
        cd1:0, cd2:0, cdPoc:0, cdP:{}, inv:0, golpe:0 };
  const c = CLASES[PJ.clase];
  $('mAtk').textContent = c.h1.ic; $('mHab').textContent = c.h2.ic;
  enJuego = true; document.body.classList.add('jugando');
  portales = []; CIUDAD = crearCiudad();
  construirBarra();
  pantalla(null);
  M = null;
  irPosada('cama');
  if (PJ.mascota && PJ.mascotaActiva) invocarMascota(true);
  banner(`Bienvenido, cazador ${PJ.nombre}`, 'Despiertas en la posada');
  dibujarAvatar();
  if (window.pintarIcoPet) pintarIcoPet();
}

function guardar(){
  if (!PJ) return;
  const c = cuenta(), i = c.personajes.findIndex(p => p.id === PJ.id);
  PJ.lugar = E ? E.tipo : 'posada';
  if (i >= 0){ c.personajes[i] = PJ; guardarCuenta(c); }
  timerGuardado = 0;
}

function limpiarEscena(){
  enemigos = []; proys = []; proysE = []; botin = []; efectos = []; particulas = []; textos = []; soldados = []; zonas = [];
  jefeVivo = null; campo = null; $('jefe').classList.add('oculto');
  if (P) P.objetivo = null;
  interCerca = null; $('btnInteractuar').classList.add('oculto');
}
const esInterior = () => E.tipo === 'posada' || E.tipo === 'tienda' || E.tipo === 'asociacion';
function colocar(x, y){ P.x = x; P.y = y; P.vx = P.vy = 0; centrarCam(true); if (M){ M.x = x - 34; M.y = y + 8; colisiones(M); } }
function pose(n, dur){ P.pose = { n, t:dur, dur }; }

// =====================================================
//  ESCENAS: GRILLA
// =====================================================
function nuevaGrilla(cols, rows, lleno = 0){
  return { cols, rows, w:cols * T, h:rows * T, solido:new Uint8Array(cols * rows).fill(lleno), obs:[], inter:[], deco:[] };
}
function setMueble(G, x0, y0, x1, y1){
  setSolido(G, x0, y0, x1, y1);
  G.mueble = G.mueble || new Uint8Array(G.cols * G.rows);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) G.mueble[y * G.cols + x] = 1;
}
function setSolido(G, x0, y0, x1, y1, v = 1){
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (x >= 0 && y >= 0 && x < G.cols && y < G.rows) G.solido[y * G.cols + x] = v;
}
const esSolido = (cx, cy) => cx < 0 || cy < 0 || cx >= E.cols || cy >= E.rows || E.solido[cy * E.cols + cx] === 1;
const solidoEn = (x, y) => esSolido(Math.floor(x / T), Math.floor(y / T));

function colisiones(o){
  for (let pase = 0; pase < 2; pase++){
    const x0 = Math.floor((o.x - o.r) / T), x1 = Math.floor((o.x + o.r) / T);
    const y0 = Math.floor((o.y - o.r) / T), y1 = Math.floor((o.y + o.r) / T);
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++){
      if (!esSolido(cx, cy)) continue;
      const nx = clamp(o.x, cx * T, cx * T + T), ny = clamp(o.y, cy * T, cy * T + T);
      const dx = o.x - nx, dy = o.y - ny, d = Math.hypot(dx, dy);
      if (d < o.r){
        if (d > 0){ o.x = nx + dx / d * o.r; o.y = ny + dy / d * o.r; }
        else o.y = cy * T + T + o.r;
      }
    }
  }
  for (const b of E.obs){
    const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy), m = o.r + b.r;
    if (d < m && d > 0){ o.x = b.x + dx / d * m; o.y = b.y + dy / d * m; }
  }
}
function lineaVision(x1, y1, x2, y2){
  const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / 20);
  for (let i = 1; i < n; i++) if (solidoEn(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n)) return false;
  return true;
}
function bfs(G, sx, sy){
  const dist = new Int16Array(G.cols * G.rows).fill(-1), cola = new Int32Array(G.cols * G.rows);
  if (sx < 0 || sy < 0 || sx >= G.cols || sy >= G.rows || G.solido[sy * G.cols + sx]) return dist;
  let a = 0, b = 0; cola[b++] = sy * G.cols + sx; dist[sy * G.cols + sx] = 0;
  while (a < b){
    const i = cola[a++], x = i % G.cols, y = (i / G.cols) | 0;
    for (const [ox, oy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx = x + ox, ny = y + oy;
      if (nx < 0 || ny < 0 || nx >= G.cols || ny >= G.rows) continue;
      const j = ny * G.cols + nx;
      if (G.solido[j] || dist[j] >= 0) continue;
      dist[j] = dist[i] + 1; cola[b++] = j;
    }
  }
  return dist;
}

// =====================================================
//  CIUDAD
// =====================================================
function crearCiudad(){
  const G = nuevaGrilla(40, 30); G.tipo = 'ciudad'; G.nombre = 'Ciudad de Lumeria';
  setSolido(G, 0, 0, 40, 1); setSolido(G, 0, 29, 40, 30); setSolido(G, 0, 0, 1, 30); setSolido(G, 39, 0, 40, 30);
  G.props = []; G.edificios = []; G.etiquetas = [];
  // edificio: sprite, centro x, base y, escala, nombre
  const edificio = (spr, cx, base, esc, nombre) => {
    const A = spr.startsWith('c_') ? CASAS : EDIF;
    const w = A[spr][2] * esc, h = A[spr][3] * esc;
    G.props.push({ spr, x:cx, y:base, esc, casa:spr.startsWith('c_') });
    const x0 = Math.round((cx - w / 2 + 10) / T), x1 = Math.round((cx + w / 2 - 10) / T);
    const y0 = Math.round((base - h * .55) / T), y1 = Math.round(base / T);
    setSolido(G, x0, y0, x1, y1);
    G.edificios.push({ x:x0, y:y0, w:x1 - x0, h:y1 - y0 });
    if (nombre) G.etiquetas.push({ txt:nombre, x:cx, y:base - h - 6 });
  };
  edificio('c_posada',     20 * T,   7 * T,  .85,  'Posada del Eclipse');
  edificio('c_asociacion', 7 * T,    7 * T,  .9,   'Asociación de Cazadores');
  edificio('c_mercado',    32.5 * T, 7 * T,  1.25, 'Mercado');
  // casas del sur: el tejado queda pegado al borde de la acera (fila 24)
  const alSur = (spr, cx, esc) => edificio(spr, cx, 24 * T + 4 + CASAS[spr][3] * esc, esc);
  alSur('c_casa', 6 * T, 1.15); alSur('c_casamod', 34 * T, 1.05); alSur('c_cabana', 13.5 * T, .95); alSur('c_apart', 27 * T, .95);
  // torii sobre el paseo del sur (se puede pasar por debajo)
  G.props.push({ spr:'c_torii', casa:true, x:20 * T, y:25.6 * T, esc:1.1 });
  G.obs.push({ x:20 * T - 46, y:25.6 * T - 6, r:8 }, { x:20 * T + 46, y:25.6 * T - 6, r:8 });
  const pon = (spr, c, r, esc, rObs, extra) => {
    G.props.push(Object.assign({ ciu:true, spr, x:c * T, y:r * T, esc }, extra || {}));
    if (rObs) G.obs.push({ x:c * T, y:r * T - 6, r:rObs });
  };
  // jardineras con flores junto a la puerta de la posada
  pon('jardinera', 20 - 80 / T, 7.3, .75, 13); pon('jardinera2', 20 + 80 / T, 7.3, .75, 13);
  // estatua del Rey Gato en el centro de la plaza (inmóvil)
  G.fuente = { x:20 * T, y:15 * T, r:52 };
  G.obs.push({ x:G.fuente.x, y:G.fuente.y + 14, r:G.fuente.r });
  G.props.push({ estatua:true, x:G.fuente.x, y:G.fuente.y + 50, esc:.95 });
  // bancos y papelera de la plaza
  pon('banco', 16.4, 15.4, 1, 20); pon('banco', 23.6, 15.4, 1, 20); pon('papelera', 24.6, 15.5, .7, 9);
  // farolas en las aceras (más una doble junto al paseo sur)
  G.farolas = [];
  for (const [c, r] of [[12, 11.75], [28, 11.75], [12, 19.6], [28, 19.6]]){
    pon('farola', c, r, .75, 7); G.farolas.push({ x:c * T, y:r * T, luces:[[0, -78]] });
  }
  pon('farola2', 17.2, 23.75, .8, 7); G.farolas.push({ x:17.2 * T, y:23.75 * T, luces:[[-34, -80], [34, -80]] });
  // mobiliario urbano, sin recargar
  pon('semaforo', 17.95, 11.8, .7, 7); pon('semaforo', 22.05, 19.6, .7, 7);
  pon('hidrante', 24.6, 11.75, .62, 9);
  pon('parada', 10.3, 23.9, 1.05, 0); G.obs.push({ x:9.6 * T, y:23.6 * T, r:20 }, { x:11 * T, y:23.6 * T, r:20 });
  pon('papelera', 12.4, 23.85, .7, 9);
  pon('bolardo', 18.75, 18.9, .6, 6); pon('bolardo', 21.25, 18.9, .6, 6);
  pon('bicis', 36.4, 7.8, .8, 0); G.obs.push({ x:36.4 * T, y:7.6 * T, r:22 });
  pon('buzon', 8.9, 7.8, .75, 9);
  // árboles: verdes y otoñales
  const ARB = [['arbol_a', 1], ['otono_a', 1], ['arbol_c', 1.1], ['arbol_b', 1], ['otono_b', 1.15], ['arbol_d', 1.1], ['arbol_a', 1], ['otono_c', 1.15], ['arbol_b', 1], ['arbol_m', 1.1]];
  G.arboles = [[2,13],[2,15.8],[2,18.2],[37.5,13],[37.5,15.8],[37.5,18.2],[11,27.5],[18,27.5],[22,27.5],[30,27.5]].map(([c, r]) => ({ x:c * T, y:r * T, r:20 }));
  G.arboles.forEach((a, k) => { G.obs.push(a); G.props.push({ ciu:true, spr:ARB[k][0], x:a.x, y:a.y + 16, esc:ARB[k][1] }); });
  // vegetación decorativa (no bloquea el paso)
  [[3.4,14.4,'flores'],[36.6,14.4,'flores'],[3.4,17,'pasto'],[36.6,17,'pasto']]
    .forEach(([c, r, n]) => G.props.push({ terr:true, spr:n, x:c * T, y:r * T, esc:.45 }));
  G.inter.push({ x:20 * T, y:7 * T + 22, r:58, texto:'Entrar a la posada', accion:() => irPosada('puerta') });
  G.inter.push({ x:32.5 * T, y:7 * T + 22, r:58, texto:'Entrar al mercado', accion:irTienda });
  G.inter.push({ x:6.6 * T, y:7 * T + 22, r:54, texto:'Entrar a la Asociación de Cazadores', accion:irAsociacion });
  // habitantes: algunos dan misiones
  G.npcs = [
    { cam:'claire', nombre:'Comandante Claire', x:12, y:7.62, ruta:[9.6, 15], mision:'caza' },
    { cam:'ruarc', nombre:'Sabio Ruarc', x:17.3, y:13.1, ruta:[16.2, 18], mision:'portales' },
    { spr:'panda', nombre:'Bao, el mercader', x:27.4, y:7.62, mision:'rango' },
    { cam:'eldrin', nombre:'Eldrin, el elfo', x:35.6, y:19.45, ruta:[32.6, 37.4], mision:'nucleos', frases:['Dicen que el Rey Gato de la estatua fue el primer cazador de rango S.', 'Los portales rojos son de rango S. Si ves uno, no entres sin preparación.', 'En el mercado el herrero puede forjarte un arma mejor.'] },
    { cam:'calebe', nombre:'Calebe, el guardia', x:36.6, y:11.75, ruta:[32.5, 37.6], mision:'pinzas', frases:['Vigilo la entrada este de la ciudad. Nada pasa sin que yo lo vea.', 'Los monstruos de rango A huelen el miedo. No se lo des.'] },
    { cam:'benja', nombre:'Benja', x:23.2, y:23.62, ruta:[21.6, 26], mision:'seda', frases:['Espero el autobús... aunque desde que salieron los portales ya no pasa.', 'Mi hermano es cazador de rango C. ¡Quiero ser como él!'] },
    { spr:'bruno', nombre:'Bruno, el cazador', x:30.5, y:19.45, mision:'colmillos', frases:['Los jabalíes cargan en línea recta: apártate cuando veas la marca roja.'] },
    { cam:'nalani', nombre:'Nalani', x:5, y:19.45, ruta:[2.6, 8.4], mision:'gelatina', frases:['¡Hola! Duerme en la posada para recuperar toda tu vida.', 'Si subes de nivel, la Asociación te reevalúa y cambia tu rango.', 'Mi rata mascota se llama Queso. ¿Y la tuya?'] }
  ].map(n => ({ ...n, x:n.x * T, y:n.y * T }));
  for (const n of G.npcs){
    n.ob = { x:n.x, y:n.y, r:14 }; G.obs.push(n.ob);
    n.it = { x:n.x, y:n.y + 10, r:56, texto:`Hablar con ${n.nombre}`, accion:() => hablarNPC(n) }; G.inter.push(n.it);
    if (n.ruta){ n.ruta = n.ruta.map(c => c * T); n.dest = n.x; n.espera = Math.random() * 2; n.dir = 'ab'; n.paso = 0; }
  }
  G.puntosPortal = [[8,12],[32,12],[8,18],[32,18],[14,12.5],[26,12.5],[14,19],[26,19],[20,22.5],[6,15],[34,15]].map(([c, r]) => ({ x:c * T, y:r * T, libre:true }));
  return G;
}

function irCiudad(desde){
  E = CIUDAD; limpiarEscena(); modoCombate(false);
  if (desde === 'posada') colocar(20 * T, 9 * T);
  else if (desde === 'tienda') colocar(32.5 * T, 9 * T);
  else if (desde === 'asociacion') colocar(6.6 * T, 9 * T);
  else colocar(20 * T, 17.6 * T);
  chat('Entras en la Ciudad de Lumeria.', '#ffd76a');
  while (portales.length < 3) crearPortal();
  guardar();
}

function rangoPortalAleatorio(){
  const r = rangoCazador(), x = Math.random();
  if (x < .45) return r;
  if (x < .75) return Math.max(0, r - 1);
  if (x < .95) return Math.min(5, r + 1);
  return Math.min(5, r + 2);
}
function crearPortal(){
  const libres = CIUDAD.puntosPortal.filter(p => p.libre);
  if (!libres.length) return;
  const punto = libres[Math.random() * libres.length | 0];
  punto.libre = false;
  portales.push({ x:punto.x, y:punto.y, punto, rango:rangoPortalAleatorio(), cierra:3600, nace:0 });
}
function quitarPortal(p){ p.punto.libre = true; portales = portales.filter(x => x !== p); }

// =====================================================
//  POSADA (INTERIOR)
// =====================================================
function crearPosada(){
  // habitación de hotel: cama, ropero, una planta y la puerta
  const G = nuevaGrilla(10, 8); G.tipo = 'posada'; G.nombre = 'Tu habitación en la posada';
  setSolido(G, 0, 0, 10, 1); setSolido(G, 0, 7, 10, 8); setSolido(G, 0, 0, 1, 8); setSolido(G, 9, 0, 10, 8);
  setMueble(G, 1, 1, 4, 3);   // cama
  setMueble(G, 7, 1, 9, 2);   // ropero
  G.obs.push({ x:8.4 * T, y:6.2 * T, r:12 }); // planta
  G.obs.push({ x:7.9 * T, y:4.5 * T, r:20 }); // sillón
  G.alfombras = [{ mu:true, spr:'rug_rojo', x:5 * T, y:5.6 * T, esc:1.35 }];
  G.props = [
    { mu:true, spr:'cama', x:2.5 * T, y:3 * T - 4, esc:1.19 },
    { mu:true, spr:'sillon', x:7.9 * T, y:5 * T, esc:1.05 },
    { spr:'ropero', x:8 * T,    y:2 * T + 4,   esc:.62 },
    { spr:'maceta', x:8.4 * T,  y:6.5 * T,     esc:.45 }
  ];
  G.puerta = 5 * T;
  G.inter.push({ x:2 * T, y:3.5 * T, r:62, texto:'Dormir en la cama', accion:descansar });
  G.inter.push({ x:5 * T, y:6.4 * T, r:50, texto:'Salir a la ciudad', accion:() => irCiudad('posada') });
  return G;
}
function crearTienda(){
  // mercado: la tendera vende pociones y el herrero forja armas
  const G = nuevaGrilla(12, 9); G.tipo = 'tienda'; G.nombre = 'Mercado de Lumeria';
  setSolido(G, 0, 0, 12, 1); setSolido(G, 0, 8, 12, 9); setSolido(G, 0, 0, 1, 9); setSolido(G, 11, 0, 12, 9);
  setMueble(G, 1, 1, 3, 2); setMueble(G, 9, 1, 11, 2);  // estanterías
  setMueble(G, 4, 1, 9, 4);                              // mostrador y trastienda
  setMueble(G, 9, 5, 11, 6);                             // forja del herrero
  setMueble(G, 9, 7, 11, 8); setMueble(G, 1, 7, 3, 8);   // armero y armaduras
  G.obs.push({ x:8.4 * T, y:5.4 * T, r:14 });
  G.alfombras = [{ mu:true, spr:'alf_azul', x:6 * T, y:6.9 * T, esc:1.25 }];
  G.props = [
    { mu:true, spr:'estante2',  x:2 * T,    y:2 * T + 4,  esc:1.3 },
    { mu:true, spr:'estante1',  x:10 * T,   y:2 * T + 4,  esc:1.3 },
    { mu:true, spr:'cajas',     x:4.95 * T, y:2.2 * T,    esc:.85 },
    { mu:true, spr:'barriles',  x:7.9 * T,  y:2.6 * T,    esc:.62 },
    { mostrador:true, x:6.5 * T, y:4 * T + 2, esc:.94 },
    { mu:true, spr:'chimenea',  x:10 * T,   y:6.1 * T,    esc:1.3 },
    { mu:true, spr:'armero',    x:10 * T,   y:8 * T,      esc:1.15 },
    { mu:true, spr:'armaduras', x:2 * T,    y:8 * T,      esc:.9 }
  ];
  G.npcs = [
    { spr:'tendera', nombre:'Mei, la tendera', x:6.5 * T, y:2.4 * T, mision:'guadanas' },
    { spr:'herrero', nombre:'Thorvald, el herrero', x:8.4 * T, y:5.4 * T, mision:'minerales' }
  ];
  G.puerta = 6 * T;
  G.inter.push({ x:6.5 * T, y:4.5 * T, r:62, texto:'Hablar con la tendera', accion:abrirTienda });
  G.inter.push({ x:8.4 * T, y:6.6 * T, r:62, texto:'Usar la forja del herrero', accion:abrirForja });
  G.inter.push({ x:6 * T, y:7.4 * T, r:50, texto:'Salir a la ciudad', accion:() => irCiudad('tienda') });
  return G;
}
const POSADA = crearPosada();
const TIENDA = crearTienda();
function crearAsociacion(){
  // salón de la Asociación: recepción de hermandades, tablón de clasificación y evaluador de rango
  const G = nuevaGrilla(14, 10); G.tipo = 'asociacion'; G.nombre = 'Asociación de Cazadores';
  setSolido(G, 0, 0, 14, 1); setSolido(G, 0, 9, 14, 10); setSolido(G, 0, 0, 1, 10); setSolido(G, 13, 0, 14, 10);
  setMueble(G, 5, 2, 9, 3);                          // mostrador de recepción
  setMueble(G, 1, 1, 3, 2); setMueble(G, 11, 1, 13, 2);
  G.obs.push({ x:1.6 * T, y:7.6 * T, r:16 }, { x:12.4 * T, y:7.6 * T, r:16 });
  G.alfombras = [{ mu:true, spr:'alf_verde', x:7 * T, y:7.4 * T, esc:1.6 }];
  G.props = [
    { mostrador:true, x:7 * T, y:3.1 * T, esc:.8 },
    { mu:true, spr:'estante_armas', x:2 * T, y:2.1 * T, esc:1.2 },
    { mu:true, spr:'estante3', x:12 * T, y:2.1 * T, esc:.75 },
    { mu:true, spr:'brasero', x:1.6 * T, y:8 * T, esc:1 },
    { mu:true, spr:'brasero', x:12.4 * T, y:8 * T, esc:1 },
    { mu:true, spr:'armaduras', x:4 * T, y:2.1 * T, esc:.8 }
  ];
  G.npcs = [
    { spr:'clienta', nombre:'Lucía, la registradora', x:7 * T, y:2.3 * T },
    { spr:'cliente', nombre:'Ren, el evaluador', x:11 * T, y:5.2 * T }
  ];
  G.obs.push({ x:11 * T, y:5.2 * T, r:14 });
  G.tablon = { x:3 * T, y:4.2 * T };
  G.obs.push({ x:G.tablon.x, y:G.tablon.y, r:24 });
  G.puerta = 7 * T;
  G.inter.push({ x:7 * T, y:4.4 * T, r:64, texto:'Registro de hermandades', accion:abrirHermandad });
  G.inter.push({ x:11 * T, y:6.1 * T, r:56, texto:'Evaluación de rango', accion:abrirEvaluacion });
  G.inter.push({ x:G.tablon.x, y:G.tablon.y + 50, r:56, texto:'Tablón de clasificación', accion:abrirClasificacion });
  G.inter.push({ x:7 * T, y:8.4 * T, r:50, texto:'Salir a la ciudad', accion:() => irCiudad('asociacion') });
  return G;
}
const ASOCIACION = crearAsociacion();
function irAsociacion(){
  E = ASOCIACION; limpiarEscena(); modoCombate(false);
  colocar(7 * T, 7.4 * T);
  chat('Entras en la Asociación de Cazadores.', '#ffd76a');
}
function dibujarAsociacionInt(t){
  const G = E;
  dibujarSueloInterior(G);
  dibujarParedInterior(G, 'piedra');
  // estandartes de las hermandades en la pared
  [0, 1, 3, 4].forEach((b, k) => dibujarBandera(b, (5 + k * 1.25) * T, T - 1.62 * T, 64));
  // estandarte de tu hermandad, más grande
  if (PJ && PJ.hermandad){
    const x = 10.6 * T, y = T - 1.7 * T;
    dibujarBandera(PJ.hermandad.band || 0, x, y, 80);
    ctx.fillStyle = '#fff'; ctx.font = '700 11px Rajdhani, sans-serif'; ctx.textAlign = 'center';
    ctx.lineWidth = 3; ctx.strokeStyle = '#000'; ctx.strokeText(PJ.hermandad.siglas, x, y + 92); ctx.fillText(PJ.hermandad.siglas, x, y + 92);
  }
  // tablón de anuncios
  const tb = G.tablon;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(tb.x - 40, tb.y + 14, 80, 8);
  ctx.fillStyle = '#5a3d22'; ctx.fillRect(tb.x - 4, tb.y - 10, 8, 26);
  ctx.fillStyle = '#7a5232'; ctx.fillRect(tb.x - 42, tb.y - 62, 84, 56);
  ctx.strokeStyle = '#3a2512'; ctx.lineWidth = 3; ctx.strokeRect(tb.x - 42, tb.y - 62, 84, 56);
  [['#efe2c0', -32, -54], ['#e9d7a8', -4, -56], ['#f5ecd5', 16, -50], ['#e9d7a8', -24, -32]].forEach(([c, dx, dy]) => {
    ctx.fillStyle = c; ctx.fillRect(tb.x + dx, tb.y + dy, 20, 18);
    ctx.fillStyle = '#b8862f'; ctx.fillRect(tb.x + dx + 8, tb.y + dy + 1, 4, 3);
  });
  dibujarPuertaInterior(G);
}

// ---------- hermandades ----------
const PRECIO_HERMANDAD = 5000; // 50 de plata
const COLORES_HERM = ['#8a1c1c', '#e8641c', '#3a2b2e', '#1fb89a', '#6bc26b', '#5b3aa0', '#a9c9c9', '#b49cf0'];
const NOMBRES_BAND = ['Espada', 'Corona', 'Puño', 'Martillo', 'Arco', 'Sol negro', 'Cruz', 'Lis'];
const BAND_URL = 'img/band.png';
const BAND_IMG = new Image(); BAND_IMG.src = BAND_URL;
const bandPos = i => `background-image:url(${BAND_URL});background-position:${(i / 7 * 100).toFixed(3)}% 0`;
function dibujarBandera(i, x, y, alto){
  if (!BAND_IMG.complete || !BAND_IMG.width) return;
  const w = alto / 2, suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(BAND_IMG, i * 100, 0, 100, 200, Math.round(x - w / 2), Math.round(y), Math.round(w), Math.round(alto));
  ctx.imageSmoothingEnabled = suave;
}
const nivelHerm = h => Math.min(10, 1 + Math.floor((PJ.jefesTotal - h.jefesBase) / 3));
const bonoHerm = () => PJ && PJ.hermandad ? (nivelHerm(PJ.hermandad) - 1) * .02 : 0;
let colorHerm = COLORES_HERM[0];
function abrirHermandad(msg){
  const h = PJ.hermandad, si = $('miSi'), no = $('miNo');
  $('miNombre').textContent = 'Lucía, la registradora';
  si.classList.remove('oculto'); no.textContent = 'Cerrar';
  if (!h){
    $('miTitulo').textContent = 'Fundar una hermandad';
    $('miCuerpo').innerHTML = `<p>Las hermandades reúnen a los cazadores bajo un mismo estandarte. Cuantas más mazmorras despeje tu hermandad, más sube de nivel y más botín reciben sus miembros.</p>
      ${msg ? `<p class="error">${msg}</p>` : ''}
      <label class="campo" style="margin-top:8px">Nombre de la hermandad<input id="hNombreH" maxlength="22" placeholder="Por ejemplo, Garras del Eclipse"></label>
      <label class="campo">Siglas (2 a 4 letras)<input id="hSiglas" maxlength="4" placeholder="GDE" style="text-transform:uppercase"></label>
      <p class="tenue" style="margin:6px 0 4px">Estandarte: <b id="bandNom">${NOMBRES_BAND[COLORES_HERM.indexOf(colorHerm)]}</b></p>
      <div class="herm-colores">${COLORES_HERM.map((c, i) => `<button type="button" class="herm-band" data-c="${c}" style="${bandPos(i)}" aria-pressed="${c === colorHerm}" aria-label="Estandarte ${NOMBRES_BAND[i]}"></button>`).join('')}</div>
      <div class="linea"><span>Coste de registro</span><b>${dinero(PRECIO_HERMANDAD)}</b></div>
      <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>`;
    $('miCuerpo').querySelectorAll('.herm-band').forEach(b => b.onclick = () => { colorHerm = b.dataset.c; $('bandNom').textContent = NOMBRES_BAND[COLORES_HERM.indexOf(colorHerm)]; $('miCuerpo').querySelectorAll('.herm-band').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    si.textContent = 'Fundar hermandad'; si.disabled = PJ.oro < PRECIO_HERMANDAD;
    si.onclick = () => {
      const n = $('hNombreH').value.trim(), sg = $('hSiglas').value.trim().toUpperCase();
      if (n.length < 3) return abrirHermandad('El nombre necesita al menos 3 letras.');
      if (!/^[A-ZÑ0-9]{2,4}$/.test(sg)) return abrirHermandad('Las siglas deben tener de 2 a 4 letras o números.');
      if (PJ.oro < PRECIO_HERMANDAD) return abrirHermandad('No tienes suficiente dinero.');
      PJ.oro -= PRECIO_HERMANDAD;
      PJ.hermandad = { nombre:n, siglas:sg, color:colorHerm, band:COLORES_HERM.indexOf(colorHerm), rango:'Maestro de la hermandad', fundada:Date.now(), jefesBase:PJ.jefesTotal };
      chat(`Has fundado la hermandad <${n}>.`, '#7dffa8'); banner('Hermandad fundada', `<${n}> [${sg}]`);
      guardar(); abrirHermandad();
    };
  } else {
    const nv = nivelHerm(h), sig = nv < 10 ? 3 - ((PJ.jefesTotal - h.jefesBase) % 3) : 0;
    const otros = (cuenta().personajes || []).filter(p => p.id !== PJ.id && p.hermandad && p.hermandad.nombre === h.nombre);
    $('miTitulo').textContent = `<${h.nombre}>`;
    $('miCuerpo').innerHTML = `${msg ? `<p class="error">${msg}</p>` : ''}
      <div class="herm-cab"><span class="herm-escudo band" style="${bandPos(h.band || 0)}"></span>
        <div><b>${escapar(h.nombre)}</b><small>Nivel ${nv} de hermandad</small></div></div>
      <div class="linea"><span>Tu rango</span><b>${h.rango}</b></div>
      <div class="linea"><span>Miembros</span><b>${1 + otros.length}</b></div>
      <div class="linea"><span>Bono de la hermandad</span><b>+${Math.round(bonoHerm() * 100)}% de dinero y experiencia</b></div>
      <div class="linea"><span>Siguiente nivel</span><b>${nv < 10 ? `Despeja ${sig} mazmorra${sig > 1 ? 's' : ''} más` : 'Nivel máximo'}</b></div>
      <div class="linea"><span>Fundada</span><b>${new Date(h.fundada).toLocaleDateString()}</b></div>
      <p class="tenue" style="margin-top:8px">Tus otros personajes de esta cuenta pueden unirse a tu hermandad hablando con Lucía.</p>`;
    si.textContent = 'Abandonar hermandad'; si.disabled = false;
    si.onclick = () => {
      if (si.dataset.confirma !== '1'){ si.dataset.confirma = '1'; si.textContent = '¿Seguro? Pulsa otra vez'; return; }
      si.dataset.confirma = ''; chat(`Has abandonado <${h.nombre}>.`, '#ff8a9b'); PJ.hermandad = null; guardar(); abrirHermandad();
    };
  }
  // unirse a la hermandad de otro personaje de la cuenta
  if (!h){
    const ajenas = [...new Map((cuenta().personajes || []).filter(p => p.id !== PJ.id && p.hermandad).map(p => [p.hermandad.nombre, p.hermandad])).values()];
    if (ajenas.length){
      $('miCuerpo').insertAdjacentHTML('beforeend', `<p class="tenue" style="margin-top:10px">O únete a la hermandad de otro de tus personajes:</p>` +
        ajenas.map((x, i) => `<button class="btn" data-unir="${i}" style="width:100%;margin-top:6px"><span>Unirse a &lt;${escapar(x.nombre)}&gt;</span><span>Gratis</span></button>`).join(''));
      $('miCuerpo').querySelectorAll('[data-unir]').forEach(b => b.onclick = () => {
        const x = ajenas[+b.dataset.unir];
        PJ.hermandad = { ...x, rango:'Miembro', jefesBase:Math.min(PJ.jefesTotal, PJ.jefesTotal) };
        chat(`Te has unido a <${x.nombre}>.`, '#7dffa8'); guardar(); abrirHermandad();
      });
    }
  }
  si.dataset.confirma = '';
  pantalla('pMision');
}
function abrirEvaluacion(){
  const r = rangoCazador(), R = RANGOS[r], si = $('miSi');
  $('miNombre').textContent = 'Ren, el evaluador';
  $('miTitulo').textContent = 'Evaluación de rango';
  $('miCuerpo').innerHTML = `<div class="herm-cab"><span class="herm-escudo" style="background:${R.color};color:#120d24">${R.l}</span>
      <div><b>Cazador de rango ${R.l}</b><small>Nivel ${PJ.nivel}</small></div></div>
    ${RANGOS.map((x, i) => `<div class="linea"><span style="color:${x.color}">Rango ${x.l}</span><b>${i <= r ? '✓ Alcanzado' : `Desde el nivel ${UMBRAL_RANGO[i]}`}</b></div>`).join('')}
    <p class="tenue" style="margin-top:8px">Los portales de tu rango o menor son seguros. Los de rango superior dan mejor botín, pero son mucho más peligrosos.</p>`;
  si.classList.add('oculto'); $('miNo').textContent = 'Gracias';
  pantalla('pMision');
}
function abrirClasificacion(){
  const lista = [...(cuenta().personajes || [])].sort((a, b) => b.nivel - a.nivel || b.jefesTotal - a.jefesTotal);
  $('miNombre').textContent = 'Tablón de la Asociación';
  $('miTitulo').textContent = 'Clasificación de cazadores';
  $('miCuerpo').innerHTML = lista.map((p, i) => `<div class="linea"><span>${i + 1}. ${escapar(p.nombre)}${p.hermandad ? ` <small style="color:${p.hermandad.color}">&lt;${escapar(p.hermandad.siglas)}&gt;</small>` : ''}</span>
      <b>Nivel ${p.nivel} · ${p.jefesTotal || 0} jefes</b></div>`).join('') +
    '<p class="tenue" style="margin-top:8px">Solo aparecen los cazadores de tu cuenta. Cuando el juego esté en un servidor, aquí se verá a todos los jugadores.</p>';
  $('miSi').classList.add('oculto'); $('miNo').textContent = 'Cerrar';
  pantalla('pMision');
}

function irPosada(lugar){
  E = POSADA; limpiarEscena(); modoCombate(false);
  if (lugar === 'cama') colocar(3.6 * T, 2.2 * T); else colocar(5 * T, 5.2 * T);
  chat('Entras en tu habitación de la posada.', '#ffd76a');
}
function irTienda(){
  E = TIENDA; limpiarEscena(); modoCombate(false);
  colocar(6 * T, 6.3 * T);
  chat('Entras en el Mercado de Lumeria.', '#ffd76a');
}

function descansar(){
  $('fundido').classList.add('ver');
  setTimeout(() => {
    P.hp = D.maxHp; P.en = D.maxEn; guardar();
    limpiarEfectos(true); ponerEfecto('spi_up', 300);
    $('fundido').classList.remove('ver');
    banner('Has descansado', 'Vida y energía al máximo. Partida guardada.');
  }, 700);
}

const precioPocion = () => (15 + rangoCazador() * 20) * 100;
const precioArma = () => Math.round(60 * Math.pow(PJ.arma + 1, 1.6)) * 100;

// encargo (misión) del NPC de la tienda, accesible desde su panel
function npcTienda(spr){ return TIENDA.npcs.find(n => n.spr === spr); }
function botonEncargo(spr){
  const n = npcTienda(spr); if (!n || !n.mision) return '';
  const mk = marcaNPC(n), M = MISIONES[n.mision];
  return `<button class="btn principal" id="enc_${spr}"><span><b style="color:${mk ? mk.col : '#fff'}">${mk ? mk.c : ''}</b> Encargo: ${M.titulo}</span><span></span></button>`;
}
function enlazarEncargo(spr){ const b = $('enc_' + spr); if (b) b.onclick = () => hablarNPC(npcTienda(spr)); }
const valorMinerales = () => Object.entries(PJ.mats || {}).reduce((a, [k, n]) => a + (k.startsWith('m_') ? APILABLES[k].valor * n : 0), 0);
function abrirTienda(msg){
  const p = precioPocion();
  $('tiendaCuerpo').innerHTML = `
    <p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>
    <div class="linea"><span>Pociones en tu bolsa</span><b>🧪 ${PJ.pociones}</b></div>
    <div class="compras">
      <button class="btn" id="cP1" ${PJ.oro < p ? 'disabled' : ''}><span>Comprar 1 poción</span><span>${dinero(p)}</span></button>
      <button class="btn" id="cP5" ${PJ.oro < p * 5 ? 'disabled' : ''}><span>Comprar 5 pociones</span><span>${dinero(p * 5)}</span></button>
      <button class="btn" id="cTe" ${PJ.oro < 600 ? 'disabled' : ''}><span class="tienda-ic">${ic3('tetera')}Té de la posada</span><span>${dinero(600)}</span></button>
      <button class="btn" id="cFarol" ${PJ.oro < 1200 ? 'disabled' : ''}><span class="tienda-ic">${ic3('farol')}Farol purificador</span><span>${dinero(1200)}</span></button>
      ${botonEncargo('tendera')}
      <button class="btn dorado" id="cMin" ${valorMinerales() ? '' : 'disabled'}><span>Vender todos los minerales</span><span>${dinero(valorMinerales())}</span></button>
    </div>
    <p class="nota" style="margin-top:10px">Cada poción recupera casi la mitad de tu vida. Para vender equipo u objetos, abre tu mochila (B) aquí dentro del mercado.</p>`;
  enlazarEncargo('tendera');
  $('cTe').onclick = () => { if (PJ.oro >= 600){ PJ.oro -= 600; darApilable('tetera'); guardar(); abrirTienda('Compraste un Té de la posada.'); } };
  $('cFarol').onclick = () => { if (PJ.oro >= 1200){ PJ.oro -= 1200; darApilable('farol'); guardar(); abrirTienda('Compraste un Farol purificador.'); } };
  $('cMin').onclick = () => { const v = valorMinerales(); if (!v) return; for (const k in PJ.mats) if (k.startsWith('m_')) delete PJ.mats[k]; PJ.oro += v; guardar(); abrirTienda(`Vendiste tus minerales por ${dineroTxt(v)}.`); };
  const comprar = n => { if (PJ.oro >= p * n){ PJ.oro -= p * n; PJ.pociones += n; guardar(); abrirTienda(`Compraste ${n} ${n > 1 ? 'pociones' : 'poción'}.`); } };
  $('cP1').onclick = () => comprar(1);
  $('cP5').onclick = () => comprar(5);
  pantalla('pTienda');
}

function abrirForja(msg){
  const p = precioArma(), max = PJ.arma >= 20;
  $('forjaCuerpo').innerHTML = `
    <p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tu arma</span><b>+${PJ.arma}</b></div>
    <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>
    <div class="linea"><span>Cada mejora</span><b>+5 de daño físico y mágico</b></div>
    <div class="compras">
      <button class="btn dorado" id="cArma" ${PJ.oro < p || max ? 'disabled' : ''}><span>${max ? 'Tu arma está al máximo' : `Forjar a +${PJ.arma + 1}`}</span><span>${dinero(p)}</span></button>
      ${botonEncargo('herrero')}
    </div>`;
  enlazarEncargo('herrero');
  $('cArma').onclick = () => { if (PJ.oro >= p && !max){ PJ.oro -= p; PJ.arma++; derivar(); guardar(); chispas(P.x, P.y, '#ff9a3d', 20, 180); abrirForja(`El herrero templó tu arma. Ahora es +${PJ.arma}.`); } };
  pantalla('pForja');
}

// =====================================================
//  MAZMORRAS (CUEVAS)
// =====================================================
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

  // enemigos
  const candidatos = [];
  for (let i = 0; i < dist.length; i++){
    if (dist[i] < 10) continue;
    const x = i % G.cols, y = (i / G.cols) | 0;
    if (Math.hypot(x - jx, y - jy) < 7) continue;
    candidatos.push(i);
  }
  candidatos.sort(() => Math.random() - .5);
  const puestos = [], total = 12 + rango;
  for (const i of candidatos){
    if (puestos.length >= total) break;
    const x = i % G.cols, y = (i / G.cols) | 0;
    if (puestos.some(([px, py]) => Math.hypot(px - x, py - y) < 5)) continue;
    puestos.push([x, y]);
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
    for (const [x, y] of E.manadas){
      const n = 1 + (Math.random() * 3 | 0);
      for (let k = 0; k < n; k++) crearEnemigo(R.enemigos[Math.random() * R.enemigos.length | 0], (x + .5) * T + rand(-20, 20), (y + .5) * T + rand(-20, 20));
    }
    crearJefe();
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
  PJ.limpias[R.l]++; PJ.jefesTotal++;
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
function crearEnemigo(tipo, x, y, aggro = false){
  const T0 = ENEM[tipo], s = E.R.escala, hp = Math.round(T0.hp * s);
  const e = { tipo, nombre:T0.n, x, y, r:T0.r, hp, maxHp:hp, dmg:T0.dmg * s, vel:T0.vel, color:T0.color, rango:!!T0.rango,
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
  const n = ENEM[e.tipo] && ENEM[e.tipo].spr, A = ATAQUES[n];
  if (!A) return false;
  if (!e.at){
    if (e.cd > 0 || d > A.alcance || (A.min && d < A.min) || !lineaVision(e.x, e.y, P.x, P.y)) return false;
    e.at = { fase:'carga', t:A.carga, ux:dx / d, uy:dy / d, tx:P.x, ty:P.y, golpeo:0 };
    if (Math.abs(dx) > 2) e.face = dx > 0 ? 1 : -1;
    return true;
  }
  const at = e.at; at.t -= dt;
  if (at.fase === 'carga'){
    if (n !== 'jabali' && n !== 'escorpion'){ const d2 = Math.hypot(P.x - e.x, P.y - e.y) || 1; at.ux = (P.x - e.x) / d2; at.uy = (P.y - e.y) / d2; at.tx = P.x; at.ty = P.y; }
    if (at.t <= 0){ at.fase = 'golpe'; at.t = A.golpe; }
    return true;
  }
  if (at.fase === 'golpe'){
    const pd = Math.hypot(P.x - e.x, P.y - e.y);
    if (n === 'slime'){
      e.x += at.ux * 430 * lento * dt; e.y += at.uy * 430 * lento * dt; colisiones(e);
      if (!at.golpeo && pd < e.r + P.r + 10){ at.golpeo = 1; P.inv = 0; golpearJugador(e.dmg * 1.3, e); }
      if (at.t <= 0){ chispas(e.x, e.y + 8, '#6fd36b', 10, 120); }
    } else if (n === 'mantis'){
      const golpes = [A.golpe, A.golpe * .45];
      for (let k = 0; k < 2; k++){
        if (at.golpeo === k && at.t <= golpes[k]){
          at.golpeo++;
          const ang = Math.atan2(P.y - e.y, P.x - e.x) - Math.atan2(at.uy, at.ux);
          if (pd < 92 && Math.cos(ang) > .2){ P.inv = 0; golpearJugador(e.dmg * .9, e); }
          chispas(e.x + at.ux * 40, e.y + at.uy * 40, '#e8e0a0', 6, 160);
        }
      }
    } else if (n === 'escorpion'){
      if (!at.golpeo){
        at.golpeo = 1;
        const px = P.x - e.x, py = P.y - e.y, largo = px * at.ux + py * at.uy, lado = Math.abs(px * at.uy - py * at.ux);
        if (largo > -10 && largo < 135 && lado < 26){ P.inv = 0; golpearJugador(e.dmg * 1.5, e); ponerEfecto('def_dn', 4); }
        chispas(e.x + at.ux * 110, e.y + at.uy * 110, '#ff6a3d', 8, 160);
      }
    } else if (n === 'jabali'){
      const ox = e.x, oy = e.y;
      e.x += at.ux * 520 * lento * dt; e.y += at.uy * 520 * lento * dt; colisiones(e);
      if (Math.hypot(e.x - ox, e.y - oy) < 520 * lento * dt * .3){ at.fase = 'fin'; at.t = A.fin + .6; shake = Math.max(shake, 6); chispas(e.x + at.ux * e.r, e.y + at.uy * e.r, '#c8b49a', 12, 160); texto(e.x, e.y - 50, 'Aturdido', '#ffe3a1', 13); return true; }
      if (!at.golpeo && pd < e.r + P.r + 8){
        at.golpeo = 1; P.inv = 0; golpearJugador(e.dmg * 1.6, e);
        P.x += at.ux * 60; P.y += at.uy * 60; colisiones(P); shake = Math.max(shake, 10);
      }
    }
    if (at.fase === 'golpe' && at.t <= 0){ at.fase = 'fin'; at.t = A.fin; }
    return true;
  }
  if (at.t <= 0){ e.at = null; e.cd = rand(A.cd[0], A.cd[1]); }
  return true;
}
function dibujarAviso(e){
  const at = e.at; if (!at || at.fase !== 'carga') return;
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
  const R = E.R, s = R.escala, hp = Math.round(750 * s);
  jefeVivo = { jefe:true, nombre:R.jefe, x:E.jefePos.x, y:E.jefePos.y, r:40, hp, maxHp:hp, dmg:16 * s, vel:80, color:R.acento,
    xp:Math.round(160 * s), oro:Math.round(120 * s), cd:2, cdGolpe:0, aggro:false, flash:0, lento:0, patron:0, aviso:0, carga:0, cdir:0 };
  enemigos.push(jefeVivo);
  $('jefeNombre').textContent = R.jefe;
}

const DIR8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function direccionHacia(e){
  const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1;
  if (d < 240 && lineaVision(e.x, e.y, P.x, P.y)) return [dx / d, dy / d];
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

// =====================================================
//  ENTRADA
// =====================================================
const keys = {}, mouse = { x:0, y:0, izq:false }, sticks = { mov:null };
let holdAtk = false;

addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  keys[e.code] = true;
  if (!enJuego) return;
  if (e.code === 'Escape'){
    if (!$('wMenu').classList.contains('oculto')){ $('wMenu').classList.add('oculto'); return; }
    if (pantallaActual === null){ if (hayVentanas()) cerrarVentanas(); else pausar(); }
    else if (PANELES_JUEGO.includes(pantallaActual)) pantalla(null);
    return;
  }
  const vent = { KeyC:'wPj', KeyB:'wBolsa', KeyI:'wBolsa', KeyP:'wLibro', KeyL:'wMis' };
  if (vent[e.code] && pantallaActual === null){
    if (e.code === 'KeyC') wTab = 'personaje';
    alternarVentana(vent[e.code]);
    return;
  }
  if (pantallaActual) return;
  if (e.code === 'KeyH') beberPocion();
  if (e.code === 'KeyE' && interCerca) interCerca.accion();
  if (e.code === 'KeyG') toggleMascota();
  const tecla = CODIGO_TECLA[e.code];
  if (tecla && !e.repeat) usarPoder(PJ.barra[tecla]);
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouse.izq = false; });

cv.addEventListener('pointerdown', e => {
  if (!enJuego || pantallaActual) return;
  if (e.pointerType === 'mouse'){
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (e.button === 0) mouse.izq = true;
    if (e.button === 2) usarHab(2);
    return;
  }
  e.preventDefault();
  if (e.clientX < W * .6 && !sticks.mov) sticks.mov = { id:e.pointerId, ox:e.clientX, oy:e.clientY, x:e.clientX, y:e.clientY };
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse'){ mouse.x = e.clientX; mouse.y = e.clientY; return; }
  if (sticks.mov && sticks.mov.id === e.pointerId){ sticks.mov.x = e.clientX; sticks.mov.y = e.clientY; }
});
const soltar = e => {
  if (e.pointerType === 'mouse'){ if (e.button === 0) mouse.izq = false; return; }
  if (sticks.mov && sticks.mov.id === e.pointerId) sticks.mov = null;
};
addEventListener('pointerup', soltar);
addEventListener('pointercancel', soltar);
cv.addEventListener('contextmenu', e => e.preventDefault());

$('mAtk').addEventListener('pointerdown', e => { e.preventDefault(); holdAtk = true; });
['pointerup','pointercancel','pointerleave'].forEach(ev => $('mAtk').addEventListener(ev, () => holdAtk = false));
$('mHab').addEventListener('pointerdown', e => { e.preventDefault(); usarHab(2); });
$('mPoc').addEventListener('pointerdown', e => { e.preventDefault(); beberPocion(); });

$('btnMenuJuego').onclick = pausar;
$('btnPantalla').onclick = alternarPantallaCompleta;
$('btnPantallaPausa').onclick = alternarPantallaCompleta;
marcarPantallaCompleta();
$('btnMascota').onclick = toggleMascota;
$('btnBolsa').onclick = () => alternarVentana('wBolsa');
$('btnLibro').onclick = () => alternarVentana('wLibro');
$('btnMis').onclick = () => alternarVentana('wMis');
$('btnPerfil').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPersonaje').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPuntos').onclick = () => abrirPerfil('personaje');
$('btnInteractuar').onclick = () => { if (interCerca) interCerca.accion(); };
$('btnSeguir').onclick = () => pantalla(null);
$('btnVerPerfil').onclick = () => abrirPerfil('personaje');
$('btnGuardar').onclick = () => { guardar(); $('notaGuardado').textContent = E.tipo === 'mazmorra' ? 'Partida guardada. Si sales ahora, apareces en la ciudad.' : 'Partida guardada.'; };
$('btnSalir').onclick = () => { guardar(); cerrarVentanas(); enJuego = false; document.body.classList.remove('jugando', 'combate'); M = null; ir('pPersonajes'); };
$('btnRevivir').onclick = () => { P.hp = D.maxHp; P.en = D.maxEn; P.inv = 2; pantalla(null); irPosada('cama'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && enJuego && !pantallaActual) pausar(); });

function pausar(){ $('notaGuardado').textContent = ''; pantalla('pPausa'); }

// =====================================================
//  PERFIL: PERSONAJE, BOLSA, LIBRO DE PODERES Y REGISTRO
// =====================================================
let pestana = 'personaje', seleccion = null, wTab = 'personaje';
const VENTANAS = ['wPj', 'wLibro', 'wBolsa', 'wMis'];
$('icoMochila').innerHTML = ic3('bolsa');
// botones del panel con íconos pixelados (se ejecuta cuando ya cargó todo el script)
setTimeout(function(){
  const ico = (id, html) => { const b = $(id); if (b) b.innerHTML = html; };
  const casco = ICONOS_OBJ.cabeza[0];
  ico('btnPersonaje', `<span class="ico-obj" style="background-image:url(${ICONOS_URL});background-position:${(casco / (ICONOS_N - 1) * 100).toFixed(4)}% 0"></span>`);
  ico('btnLibro', ic3('libro')); ico('btnMis', ic3('pergamino')); ico('btnBolsa', ic3('bolsa'));
  ico('btnMenuJuego', ic3('escudo')); ico('mPoc', ic3('pocion'));
  ico('btnMascota', '<canvas width="64" height="64" id="icoPet"></canvas>');
  const pintarPet = () => { const c = $('icoPet'); if (!c || !ratasListo) return; const a = c.getContext('2d'); a.clearRect(0, 0, 64, 64);
    const [sx, sy, w, h] = RATAS_DIR[PJ && PJ.mascota ? PJ.mascota.tipo : 0].ab[0], k = Math.min(60 / w, 60 / h);
    a.imageSmoothingEnabled = false; a.drawImage(RATAS_IMG, sx, sy, w, h, 32 - w * k / 2, 62 - h * k, w * k, h * k); };
  if (ratasListo) pintarPet(); else RATAS_IMG.addEventListener('load', pintarPet, { once:true });
  window.pintarIcoPet = pintarPet;
}, 0); $('icoLibro').innerHTML = ic3('libro'); $('icoMis').innerHTML = ic3('pergamino');
const abierta = id => !$(id).classList.contains('oculto');
function abrirVentana(id){ $(id).classList.remove('oculto'); renderVentana(id); }
function cerrarVentana(id){ $(id).classList.add('oculto'); ocultarTip(); $('wMenu').classList.add('oculto'); }
function alternarVentana(id){ abierta(id) ? cerrarVentana(id) : abrirVentana(id); }
function hayVentanas(){ return VENTANAS.some(abierta); }
function cerrarVentanas(){ VENTANAS.forEach(cerrarVentana); }
function abrirPerfil(tab){
  if (pantallaActual && PANELES_JUEGO.includes(pantallaActual)) pantalla(null);
  if (tab === 'bolsa') return abrirVentana('wBolsa');
  if (tab === 'poderes') return abrirVentana('wLibro');
  wTab = tab === 'registro' ? 'registro' : 'personaje'; abrirVentana('wPj');
}
function renderVentana(id){
  if (!PJ || !abierta(id)) return;
  if (id === 'wPj') renderPj(); else if (id === 'wBolsa') renderBolsa(); else if (id === 'wMis') renderMisiones(); else renderLibro();
}
function renderPerfil(){ VENTANAS.forEach(renderVentana); }
document.querySelectorAll('[data-wcerrar]').forEach(b => b.onclick = () => cerrarVentana(b.dataset.wcerrar));
document.querySelectorAll('[data-wtab]').forEach(b => b.onclick = () => { wTab = b.dataset.wtab; renderPj(); });
// arrastrar ventanas por la cabecera
document.querySelectorAll('.wv-cab').forEach(cab => {
  cab.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || innerWidth < 820) return;
    const v = cab.parentElement, r = v.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
    v.style.right = 'auto'; v.style.bottom = 'auto'; v.style.transform = 'none'; v.style.left = r.left + 'px'; v.style.top = r.top + 'px';
    const mover = ev => { v.style.left = clamp(ev.clientX - ox, 0, innerWidth - 60) + 'px'; v.style.top = clamp(ev.clientY - oy, 0, innerHeight - 40) + 'px'; };
    const fin = () => { removeEventListener('pointermove', mover); removeEventListener('pointerup', fin); };
    addEventListener('pointermove', mover); addEventListener('pointerup', fin);
  });
});

// ---------- descripción emergente (tooltip) ----------
function lineasObj(o, titulo){
  const R = RAREZAS[o.rareza], tipo = o.slot === 'arma' ? (o.nombre.split(' ')[0]) : '';
  let h = titulo ? `<span class="gris">${titulo}</span>` : '';
  h += `<span class="tn" style="color:${R.c}">${escapar(o.nombre)}</span>`;
  h += `<span class="amar">Nivel de objeto ${o.nivel}</span>`;
  h += `<div class="fila"><span>${RANURAS[o.slot].n}</span><span>${tipo}</span></div>`;
  if (o.dmg) h += `<div class="fila"><span>${Math.round(o.dmg * .85)} - ${Math.round(o.dmg * 1.15)} de daño</span><span>Velocidad 2,40</span></div>`;
  for (const [k, v] of Object.entries(o.stats)) h += `<span>+${v} ${NOMBRE_STAT[k]}</span>`;
  h += `<span class="gris">${R.n}</span>`;
  h += `<span>Precio de venta: ${dinero(precioVenta(o))}</span>`;
  return h;
}
function htmlTip(o, comparar){
  const eq = comparar && PJ.equipo[o.slot];
  let dif = '';
  if (comparar && eq){
    const d = [], claves = new Set([...Object.keys(o.stats), ...Object.keys(eq.stats)]);
    if (o.dmg || eq.dmg) claves.add('dmg');
    for (const k of claves){
      const v = k === 'dmg' ? (o.dmg || 0) - (eq.dmg || 0) : (o.stats[k] || 0) - (eq.stats[k] || 0);
      if (v) d.push(`<span class="${v > 0 ? 'verde' : 'rojo'}">${v > 0 ? '+' : ''}${v} ${k === 'dmg' ? 'daño' : NOMBRE_STAT[k]}</span>`);
    }
    dif = `<div class="tsep"></div><span class="amar">Si lo equipas:</span>${d.length ? d.join('') : '<span class="gris">Sin cambios</span>'}`;
  }
  const actual = `<div style="display:flex;flex-direction:column">${lineasObj(o)}${dif}<div class="tsep"></div><span class="verde">${comparar ? 'Clic derecho: equipar' : 'Clic derecho: quitar'}</span></div>`;
  if (eq) return `<div class="doble"><div style="display:flex;flex-direction:column">${lineasObj(eq, 'Equipado actualmente')}</div>${actual}</div>`;
  return actual;
}
function htmlTipPocion(){
  return `<div style="display:flex;flex-direction:column"><span class="tn" style="color:#fff">Poción de vida</span>
    <span>Montón de ${PJ.pociones}</span><span class="verde">Uso: recupera una parte de tu vida.</span>
    <span class="gris">Tecla H. La tendera del mercado vende más.</span><div class="tsep"></div><span class="verde">Clic: beber</span></div>`;
}
function mostrarTip(html, x, y){
  const t = $('wTip'); t.innerHTML = html; t.classList.remove('oculto');
  const r = t.getBoundingClientRect();
  let px = x + 18, py = y - r.height - 10;
  if (px + r.width > innerWidth - 6) px = x - r.width - 18;
  if (px < 6) px = 6;
  if (py < 6) py = Math.min(innerHeight - r.height - 6, y + 18);
  t.style.left = px + 'px'; t.style.top = py + 'px';
}
function ocultarTip(){ $('wTip').classList.add('oculto'); }
function menuEn(x, y, opciones){
  const m = $('wMenu'); m.innerHTML = '';
  for (const [txt, fn, extra] of opciones){
    const b = document.createElement('button'); b.innerHTML = `<span>${txt}</span>${extra || ''}`;
    if (fn === null){ b.disabled = true; b.style.color = '#7a7a7a'; b.style.cursor = 'default'; }
    b.onclick = ev => { ev.stopPropagation(); m.classList.add('oculto'); ocultarTip(); fn && fn(); };
    m.appendChild(b);
  }
  m.classList.remove('oculto');
  const r = m.getBoundingClientRect();
  m.style.left = clamp(x, 6, innerWidth - r.width - 6) + 'px'; m.style.top = clamp(y, 6, innerHeight - r.height - 6) + 'px';
}
addEventListener('pointerdown', e => { if (!e.target.closest('#wMenu') && !e.target.closest('[data-bo],[data-eq],[data-pocion],[data-hz],[data-st]')) $('wMenu').classList.add('oculto'); }, true);
const objDe = el => el.dataset.bo ? PJ.bolsa.find(x => x.id === el.dataset.bo) : el.dataset.eq ? PJ.equipo[el.dataset.eq] : null;
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse' || !PJ) return;
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el){ ocultarTip(); return; }
  if (el.dataset.pocion !== undefined) return mostrarTip(htmlTipPocion(), e.clientX, e.clientY);
  if (el.dataset.st) return mostrarTip(htmlTipApilable(el.dataset.st), e.clientX, e.clientY);
  const o = objDe(el); if (o) mostrarTip(htmlTip(o, !!el.dataset.bo), e.clientX, e.clientY);
});
document.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || $('wTip').classList.contains('oculto')) return;
  if (!e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]')) return ocultarTip();
  const t = $('wTip'), r = t.getBoundingClientRect();
  let px = e.clientX + 18, py = e.clientY - r.height - 10;
  if (px + r.width > innerWidth - 6) px = e.clientX - r.width - 18;
  if (py < 6) py = Math.min(innerHeight - r.height - 6, e.clientY + 18);
  t.style.left = Math.max(6, px) + 'px'; t.style.top = py + 'px';
});
document.addEventListener('contextmenu', e => {
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el) return;
  e.preventDefault(); ocultarTip();
  if (el.dataset.bo) equipar(el.dataset.bo);
  else if (el.dataset.eq && PJ.equipo[el.dataset.eq]) quitarEquipo(el.dataset.eq);
  else if (el.dataset.pocion !== undefined) beberPocion();
  else if (el.dataset.st) usarApilable(el.dataset.st);
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el || !PJ) return;
  const r = el.getBoundingClientRect(), x = r.right + 4, y = r.top;
  if (el.dataset.pocion !== undefined){ beberPocion(); renderBolsa(); return; }
  if (el.dataset.st){
    const k = el.dataset.st, A = APILABLES[k];
    if (e.pointerType && e.pointerType !== 'mouse') mostrarTip(htmlTipApilable(k), r.left, r.top);
    const op = [];
    if (A.usa) op.push(['Usar', () => usarApilable(k)]);
    if (E.tipo === 'tienda'){
      op.push(['Vender 1', () => venderApilable(k, false), dinero(A.valor)]);
      if (PJ.mats[k] > 1) op.push([`Vender ${PJ.mats[k]}`, () => venderApilable(k, true), dinero(A.valor * PJ.mats[k])]);
    } else op.push(['Vender (solo en la tienda)', null]);
    op.push(['Cancelar']);
    menuEn(x, y, op); return;
  }
  const o = objDe(el); if (!o) return;
  if (e.pointerType && e.pointerType !== 'mouse') mostrarTip(htmlTip(o, !!el.dataset.bo), r.left, r.top);
  if (el.dataset.bo) menuEn(x, y, [['Equipar', () => equipar(o.id)], E.tipo === 'tienda' ? ['Vender', () => vender(o.id), dinero(precioVenta(o))] : ['Vender (solo en la tienda)', null], ['Cancelar']]);
  else menuEn(x, y, [['Quitar', () => quitarEquipo(el.dataset.eq)], ['Cancelar']]);
});

// ---------- ventana del personaje ----------
function slotHTML(k){
  const o = PJ.equipo[k], rs = RANURAS[k];
  return `<button class="wslot ${o ? 'lleno' : ''}" data-eq="${k}" style="--rc:${o ? RAREZAS[o.rareza].c : '#555'}" aria-label="${rs.n}${o ? ': ' + escapar(o.nombre) : ''}">
    ${o ? icoObj(o) : `<span class="vac">${rs.ic}</span>`}</button>`;
}
function renderPj(){
  if (!abierta('wPj')) return;
  const c = CLASES[PJ.clase], R = RANGOS[rangoCazador()];
  $('wPjTitulo').textContent = PJ.nombre;
  document.querySelectorAll('[data-wtab]').forEach(b => b.setAttribute('aria-selected', b.dataset.wtab === wTab));
  const rc = $('wPjRetrato').getContext('2d'); rc.clearRect(0, 0, 96, 96); rc.drawImage($('avatar'), 0, 0, 96, 96);
  const cuerpo = $('wPjCuerpo');
  if (wTab === 'personaje'){
    const fila = (n, v, k) => `<div class="pd-fila"><span>${n}</span><b ${v.id ? `id="${v.id}"` : ''} class="${v.extra ? 'verde' : ''}">${v.t}${k ? `<button class="pd-mas" data-stat="${k}" ${PJ.puntos ? '' : 'disabled'} aria-label="Subir ${n}">+</button>` : ''}</b></div>`;
    const at = ['fue','agi','vit','int'].map(k => fila(NOMBRE_STAT[k], { t:D.s[k], extra:D.s[k] > PJ.stats[k] }, k)).join('');
    const cb = [['Vida', `${Math.ceil(P.hp)}/${D.maxHp}`], ['Energía', `${Math.floor(P.en)}/${D.maxEn}`], ['Daño físico', Math.round(D.fis)], ['Daño mágico', Math.round(D.mag)],
      ['Crítico', Math.round(D.crit * 100) + '%'], ['Defensa', Math.round(D.def * 100) + '%'], ['Velocidad', Math.round(D.vel)], ['Forja', '+' + PJ.arma]]
      .map(([n, v]) => fila(n, { t:v, id:n === 'Vida' ? 'pdVida' : n === 'Energía' ? 'pdEn' : '' })).join('');
    cuerpo.innerHTML = `<p class="pd-sub">Nivel ${PJ.nivel} ${c.nombre} · <span style="color:${R.color}">Rango ${R.l}</span></p>
      <div class="pd"><div class="pd-col">${IZQ.map(slotHTML).join('')}</div>
        <div class="pd-mod"><canvas id="figura" width="240" height="300"></canvas></div>
        <div class="pd-col">${DER.filter(k => k !== 'arma').map(slotHTML).join('')}</div></div>
      <div class="pd-abajo">${slotHTML('arma')}</div>
      ${PJ.puntos ? `<p class="pd-puntos">Tienes ${PJ.puntos} puntos de atributo para repartir</p>` : ''}
      <div class="pd-stats"><div class="pd-caja"><h4>Atributos</h4>${at}</div><div class="pd-caja"><h4>Combate</h4>${cb}</div></div>`;
    cuerpo.querySelectorAll('.pd-mas').forEach(b => b.onclick = () => { if (PJ.puntos <= 0) return; PJ.stats[b.dataset.stat]++; PJ.puntos--; recalcular(); });
  } else if (wTab === 'mascota'){
    cuerpo.innerHTML = PJ.mascota
      ? `<div class="pd-caja" style="text-align:center"><h4>${escapar(PJ.mascota.nombre)}</h4><p>${TIPOS_RATA[PJ.mascota.tipo]}</p>
         <p class="gris" style="color:#9d9d9d;margin:6px 0">${M ? 'Te acompaña ahora mismo.' : 'Está descansando en las sombras.'}</p>
         <button class="wbtn" id="wPet">${M ? 'Guardar mascota' : 'Invocar mascota'}</button></div>`
      : `<div class="pd-caja" style="text-align:center"><h4>Sin mascota</h4><p>Pulsa G o el botón de la huella para elegir tu primera mascota.</p></div>`;
    const b = $('wPet'); if (b) b.onclick = () => { toggleMascota(); renderPj(); };
  } else cuerpo.innerHTML = htmlRegistro();
}

// ---------- mochila ----------
function renderBolsa(){
  if (!abierta('wBolsa')) return;
  let h = '<div class="wbag">', n = 0;
  if (PJ.pociones > 0){ h += `<button class="wslot lleno" data-pocion style="--rc:#ffffff" aria-label="Pociones de vida">${ic3('pocion')}<span class="cnt">${PJ.pociones}</span></button>`; n++; }
  for (const k of Object.keys(APILABLES)){
    const c = (PJ.mats || {})[k]; if (!c) continue;
    h += `<button class="wslot lleno" data-st="${k}" style="--rc:${RAREZAS[APILABLES[k].r].c}" aria-label="${APILABLES[k].n}">${ic3(k)}${c > 1 ? `<span class="cnt">${c}</span>` : ''}</button>`; n++;
  }
  for (const o of PJ.bolsa){ h += `<button class="wslot lleno" data-bo="${o.id}" style="--rc:${RAREZAS[o.rareza].c}" aria-label="${escapar(o.nombre)}">${icoObj(o)}</button>`; n++; }
  const total = Math.max(28, Math.ceil(n / 4) * 4);
  for (; n < total; n++) h += '<div class="wslot"></div>';
  h += `</div><div class="wbag-pie"><span>${PJ.bolsa.length}/${TAM_BOLSA}</span>${dinero(PJ.oro)}</div>`;
  $('wBolsaCuerpo').innerHTML = h;
}

// ---------- libro de hechizos ----------
function renderLibro(){
  if (!abierta('wLibro')) return;
  const c = CLASES[PJ.clase];
  let h = `<div class="wl-hechizos"><div class="wl-sec">${c.nombre}</div>
    <div class="wl-h"><canvas data-icono="${c.h1.spr}" width="80" height="80"></canvas><div><b>${c.h1.n}</b><small>Clic izquierdo</small></div></div>
    <div class="wl-h"><canvas data-icono="${c.h2.spr}" width="80" height="80"></canvas><div><b>${c.h2.n}</b><small>Clic derecho · ${c.h2.coste} energía</small></div></div>
    <div class="wl-sec">Sombras</div>`;
  for (const [id, pw] of Object.entries(PODERES)){
    const bloq = PJ.nivel < pw.nivel, tecla = TECLAS.find(t => PJ.barra[t] === id);
    h += `<div class="wl-h ${bloq ? 'bloq' : ''}" data-hz="${id}" title="${pw.d}"><canvas data-icono="${pw.ic}" width="80" height="80" ${bloq ? '' : `draggable="true" data-arrastra="${id}"`}></canvas>
      <div><b>${pw.n}</b><small>${bloq ? `Nivel ${pw.nivel}` : `${pw.coste} energía · ${pw.cd} s${tecla ? ` · tecla ${tecla}` : ''}`}</small></div></div>`;
  }
  h += '<p class="wl-nota">Arrastra un poder a tu barra de acción, o tócalo para elegir su tecla.</p></div>';
  const cu = $('wLibroCuerpo'); cu.innerHTML = h;
  cu.querySelectorAll('canvas[data-icono]').forEach(cv => pintarIcono(cv, cv.dataset.icono));
  cu.querySelectorAll('[data-arrastra]').forEach(cv => cv.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', cv.dataset.arrastra); e.dataTransfer.effectAllowed = 'copy'; }));
  cu.querySelectorAll('.wl-h[data-hz]:not(.bloq)').forEach(el => el.onclick = e => {
    const r = el.getBoundingClientRect(), id = el.dataset.hz;
    menuEn(r.left + 20, r.bottom, [...TECLAS.map(t => [`Poner en la tecla ${t}`, () => asignar(id, t), PODERES[PJ.barra[t]] && PJ.barra[t] !== id ? `<small style="color:#9d9d9d">${PODERES[PJ.barra[t]].n}</small>` : '']), ['Cancelar']]);
  });
}
function prepararSoltarBarra(){
  for (const b of barraEls){
    if (b.tipo !== 'poder') continue;
    b.el.addEventListener('dragover', e => { e.preventDefault(); b.el.classList.add('soltar'); });
    b.el.addEventListener('dragleave', () => b.el.classList.remove('soltar'));
    b.el.addEventListener('drop', e => { e.preventDefault(); b.el.classList.remove('soltar'); const id = e.dataTransfer.getData('text/plain'); if (PODERES[id]) asignar(id, b.tecla); });
  }
}

function tarjeta(o){
  const lineas = [];
  if (o.dmg) lineas.push(`<span>+${o.dmg} de daño</span>`);
  for (const [k, v] of Object.entries(o.stats)) lineas.push(`<span>+${v} de ${NOMBRE_STAT[k]}</span>`);
  return `<div class="tarjeta" style="--rc:${RAREZAS[o.rareza].c}"><b>${escapar(o.nombre)}</b>
    <small>${RAREZAS[o.rareza].n}, ${RANURAS[o.slot].n.toLowerCase()}, nivel de objeto ${o.nivel}</small>${lineas.join('')}</div>`;
}
function comparacion(o){
  const eq = PJ.equipo[o.slot];
  if (!eq) return '<p class="nota" style="margin-top:6px">No llevas nada en esa ranura.</p>';
  const dif = [], claves = new Set([...Object.keys(o.stats), ...Object.keys(eq.stats)]);
  if (o.dmg || eq.dmg) claves.add('dmg');
  for (const k of claves){
    const v = k === 'dmg' ? (o.dmg || 0) - (eq.dmg || 0) : (o.stats[k] || 0) - (eq.stats[k] || 0);
    if (!v) continue;
    dif.push(`<span class="${v > 0 ? 'verde' : 'rojo'}">${v > 0 ? '+' : ''}${v} ${k === 'dmg' ? 'de daño' : NOMBRE_STAT[k]}</span>`);
  }
  return `<p class="nota" style="margin-top:6px">Si lo equipas en lugar de ${escapar(eq.nombre)}: ${dif.length ? dif.join(', ') : 'sin cambios'}</p>`;
}

function htmlPersonaje(){
  const c = CLASES[PJ.clase], R = RANGOS[rangoCazador()];
  const ranura = k => {
    const o = PJ.equipo[k], rs = RANURAS[k];
    return `<button class="ranura ${o ? '' : 'vacia'} ${seleccion && seleccion.slot === k ? 'sel' : ''}" data-ranura="${k}" style="--rc:${o ? RAREZAS[o.rareza].c : '#3a3066'}">
      <span>${o ? icoObj(o) : rs.ic}</span><small>${o ? escapar(o.nombre) : rs.n}</small></button>`;
  };
  let det = '<p class="nota">Toca una ranura para ver lo que llevas puesto o cambiarlo por algo de tu bolsa.</p>';
  if (seleccion && seleccion.slot){
    const k = seleccion.slot, o = PJ.equipo[k];
    const opciones = PJ.bolsa.filter(x => x.slot === k);
    det = (o ? tarjeta(o) + `<div class="acciones-obj"><button class="btn" data-quitar="${k}">Quitar</button></div>` : `<p class="nota">No llevas nada en ${RANURAS[k].n.toLowerCase()}.</p>`)
      + `<div class="lista-obj">${opciones.length ? opciones.map(x => `<button class="mini-obj" data-equipar="${x.id}" style="--rc:${RAREZAS[x.rareza].c}"><span>${escapar(x.nombre)}</span><small>Equipar</small></button>`).join('') : '<p class="nota">No tienes otros objetos para esta ranura en tu bolsa.</p>'}</div>`;
  }
  let attrs = '';
  for (const k of ['fue','agi','vit','int']){
    const extra = D.s[k] - PJ.stats[k];
    attrs += `<span>${NOMBRE_STAT[k]} <small class="tenue">(${DESC_STAT[k]})</small></span>
      <span class="val">${D.s[k]}${extra ? ` <small class="verde">+${extra}</small>` : ''}</span>
      <button class="mas" data-stat="${k}" ${PJ.puntos ? '' : 'disabled'} aria-label="Subir ${NOMBRE_STAT[k]}">+</button>`;
  }
  return `<p class="sub">${c.nombre}, nivel ${PJ.nivel}. <span style="color:${R.color}">Cazador de rango ${R.l}</span></p>
    <div class="equipo">
      <div class="col">${IZQ.map(ranura).join('')}</div>
      <div class="figura"><canvas id="figura" width="240" height="300"></canvas></div>
      <div class="col">${DER.map(ranura).join('')}</div>
    </div>
    <div class="detalle">${det}</div>
    <div class="dos">
      <div><h3>Atributos</h3>
        <p class="puntos" style="color:${PJ.puntos ? 'var(--corona)' : 'var(--tenue)'}">${PJ.puntos ? `Tienes ${PJ.puntos} puntos para repartir` : 'Sin puntos por repartir'}</p>
        <div class="stats">${attrs}</div></div>
      <div><h3>Combate</h3><div class="derivados" style="grid-template-columns:1fr auto">
        <span>Vida</span><b>${Math.ceil(P.hp)} / ${D.maxHp}</b><span>Energía</span><b>${Math.floor(P.en)} / ${D.maxEn}</b>
        <span>Daño físico</span><b>${Math.round(D.fis)}</b><span>Daño mágico</span><b>${Math.round(D.mag)}</b>
        <span>Poder de sombra</span><b>${Math.round(D.poder)}</b><span>Crítico</span><b>${Math.round(D.crit * 100)}%</b>
        <span>Defensa</span><b>${Math.round(D.def * 100)}%</b><span>Velocidad</span><b>${Math.round(D.vel)}</b>
        <span>Forja del arma</span><b>+${PJ.arma}</b></div></div>
    </div>`;
}

function htmlBolsa(){
  let celdas = '';
  for (let i = 0; i < TAM_BOLSA; i++){
    const o = PJ.bolsa[i];
    celdas += o ? `<button class="celda ${seleccion && seleccion.id === o.id ? 'sel' : ''}" data-obj="${o.id}" style="--rc:${RAREZAS[o.rareza].c}" title="${escapar(o.nombre)}">${icoObj(o)}</button>`
                : '<div class="celda vacia"></div>';
  }
  let det = '<p class="nota">Toca un objeto para verlo, equiparlo o venderlo. Los monstruos y jefes de los portales sueltan equipo.</p>';
  const o = seleccion && PJ.bolsa.find(x => x.id === seleccion.id);
  if (o) det = tarjeta(o) + comparacion(o) + `<div class="acciones-obj">
      <button class="btn principal" data-equipar="${o.id}">Equipar</button>
      <button class="btn" data-vender="${o.id}">Vender por 🪙 ${precioVenta(o)}</button></div>`;
  return `<p class="sub">${PJ.bolsa.length} de ${TAM_BOLSA} espacios ocupados. Oro: 🪙 ${PJ.oro}. Pociones: 🧪 ${PJ.pociones}</p>
    <div class="bolsa">${celdas}</div><div class="detalle">${det}</div>`;
}

function htmlPoderes(){
  const c = CLASES[PJ.clase];
  let h = `<p class="sub">Aprendes poderes nuevos al subir de nivel. Toca una tecla para colocar cada poder en tu barra de acción.</p>
    <div class="libro"><h3>Ataques de tu clase</h3>
    <div class="hechizo"><canvas data-icono="${c.h1.spr}" width="112" height="112"></canvas><div><b>${c.h1.n}</b><small>Clic izquierdo</small><p>${c.h1.d}</p></div></div>
    <div class="hechizo"><canvas data-icono="${c.h2.spr}" width="112" height="112"></canvas><div><b>${c.h2.n}</b><small>Clic derecho, ${c.h2.coste} de energía</small><p>${c.h2.d}</p></div></div>
    <h3 style="margin-top:6px">Poderes de las sombras</h3>`;
  for (const [id, pw] of Object.entries(PODERES)){
    const bloq = PJ.nivel < pw.nivel;
    h += `<div class="hechizo ${bloq ? 'bloq' : ''}"><canvas data-icono="${pw.ic}" width="112" height="112"></canvas><div>
      <b>${pw.n}</b><small>${bloq ? `Se aprende en el nivel ${pw.nivel}` : `${pw.coste} de energía, recarga de ${pw.cd} segundos`}</small><p>${pw.d}</p>
      ${bloq ? '' : `<div class="teclas">${TECLAS.map(t => `<button data-asignar="${id}" data-tecla="${t}" aria-pressed="${PJ.barra[t] === id}">${t}</button>`).join('')}</div>`}
    </div></div>`;
  }
  return h + '</div>';
}

function htmlRegistro(){
  const r = rangoCazador(), R = RANGOS[r];
  const sig = r < 5 ? `Próxima reevaluación de rango en el nivel ${UMBRAL_RANGO[r + 1]}.` : 'Has alcanzado el rango más alto.';
  return `<div class="perfil-cab">
      <div class="rango-grande" style="color:${R.color}">${R.l}</div>
      <div><h3>${escapar(PJ.nombre)}</h3><p>${CLASES[PJ.clase].nombre}, nivel ${PJ.nivel}</p><p>Cazador de rango ${R.l}. ${sig}</p></div>
    </div>
    <p class="tenue" style="font-size:.95rem">Experiencia ${PJ.xp} de ${PJ.xpSig}</p>
    <div class="xpbar"><span style="width:${PJ.xp / PJ.xpSig * 100}%"></span></div>
    <h3>Mazmorras despejadas</h3><div class="registro">
      ${RANGOS.map(x => `<div><b style="color:${x.color}">${x.l}</b><span>${PJ.limpias[x.l]}</span></div>`).join('')}
    </div>
    <div class="seccion">
      <div class="linea"><span>Jefes derrotados</span><b>${PJ.jefesTotal}</b></div>
      <div class="linea"><span>Monstruos eliminados</span><b>${PJ.kills}</b></div>
      <div class="linea"><span>Mascota</span><b>${PJ.mascota ? `${escapar(PJ.mascota.nombre)} (${TIPOS_RATA[PJ.mascota.tipo]})` : 'Aún no tienes'}</b></div>
      <div class="linea"><span>Tiempo de juego</span><b>${Math.floor(PJ.tiempo / 3600)} h ${Math.floor(PJ.tiempo / 60) % 60} min</b></div>
    </div>`;
}

function renderPerfil(){
  document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === pestana));
  $('vTitulo').textContent = { personaje:PJ.nombre, bolsa:'Bolsa', poderes:'Libro de poderes', registro:'Registro de cazador' }[pestana];
  const cuerpo = $('vCuerpo'), scroll = cuerpo.scrollTop;
  cuerpo.innerHTML = { personaje:htmlPersonaje, bolsa:htmlBolsa, poderes:htmlPoderes, registro:htmlRegistro }[pestana]();
  cuerpo.scrollTop = scroll;
  cuerpo.querySelectorAll('[data-ranura]').forEach(b => b.onclick = () => { seleccion = { slot:b.dataset.ranura }; renderPerfil(); });
  cuerpo.querySelectorAll('[data-obj]').forEach(b => b.onclick = () => { seleccion = { id:b.dataset.obj }; renderPerfil(); });
  cuerpo.querySelectorAll('[data-equipar]').forEach(b => b.onclick = () => equipar(b.dataset.equipar));
  cuerpo.querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => quitarEquipo(b.dataset.quitar));
  cuerpo.querySelectorAll('[data-vender]').forEach(b => b.onclick = () => vender(b.dataset.vender));
  cuerpo.querySelectorAll('[data-asignar]').forEach(b => b.onclick = () => asignar(b.dataset.asignar, b.dataset.tecla));
  cuerpo.querySelectorAll('canvas[data-icono]').forEach(c => pintarIcono(c, c.dataset.icono));
  cuerpo.querySelectorAll('.mas').forEach(b => b.onclick = () => {
    if (PJ.puntos <= 0) return;
    PJ.stats[b.dataset.stat]++; PJ.puntos--; recalcular();
  });
}

function recalcular(){
  const hpA = D.maxHp, enA = D.maxEn;
  derivar();
  P.hp = clamp(P.hp + (D.maxHp - hpA), 1, D.maxHp);
  P.en = clamp(P.en + (D.maxEn - enA), 0, D.maxEn);
  guardar(); renderPerfil();
}
function equipar(id){
  const i = PJ.bolsa.findIndex(o => o.id === id); if (i < 0) return;
  const o = PJ.bolsa[i], antes = PJ.equipo[o.slot];
  PJ.equipo[o.slot] = o; PJ.bolsa.splice(i, 1);
  if (antes) PJ.bolsa.push(antes);
  seleccion = pestana === 'personaje' ? { slot:o.slot } : null;
  recalcular();
}
function quitarEquipo(slot){
  if (PJ.bolsa.length >= TAM_BOLSA){ banner('Tu bolsa está llena', 'Vende algo antes de quitarte este objeto'); return; }
  PJ.bolsa.push(PJ.equipo[slot]); PJ.equipo[slot] = null; recalcular();
}
function vender(id){
  if (E.tipo !== 'tienda'){ chat('Solo puedes vender en el Mercado de Lumeria.', '#ff8a9b'); return; }
  const i = PJ.bolsa.findIndex(o => o.id === id); if (i < 0) return;
  PJ.oro += precioVenta(PJ.bolsa[i]); PJ.bolsa.splice(i, 1); seleccion = null; guardar(); renderPerfil();
}
function asignar(id, tecla){
  const anterior = PJ.barra[tecla], donde = TECLAS.find(t => PJ.barra[t] === id);
  PJ.barra[tecla] = id;
  if (donde && donde !== tecla) PJ.barra[donde] = anterior;
  guardar(); construirBarra(); renderPerfil();
}

function dibujarFigura(t){
  const c = $('figura'); if (!c) return;
  const a = c.getContext('2d');
  a.clearRect(0, 0, c.width, c.height);
  const g = a.createRadialGradient(120, 170, 10, 120, 170, 170);
  g.addColorStop(0, CLASES[PJ.clase].color + '55'); g.addColorStop(1, '#0e0a1c');
  a.fillStyle = g; a.fillRect(0, 0, c.width, c.height);
  a.fillStyle = 'rgba(0,0,0,.45)'; a.beginPath(); a.ellipse(120, 274, 50, 12, 0, 0, TAU); a.fill();
  if (!gatosListo) return;
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, 'ab', 0), esc = 190 / 96, r = Math.sin(t / 420);
  a.save(); a.translate(110, 274); a.scale(1 - .012 * r, 1 + .025 * r);
  a.drawImage(GATOS_IMG, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  a.restore();
  if (PJ.mascota && ratasListo){
    // ciclo: despierto mirando a los lados, luego se duerme
    const ciclo = (t / 1000) % 16, flip = ciclo < 7 && Math.floor(ciclo / 2.5) % 2 === 1;
    const q = cuadroRata(PJ.mascota.tipo, flip ? 'lado' : 'abajo', false, 0, true);
    pintarGato(a, PJ.mascota.tipo, 196, 280, 74, t, false, false, ciclo, null, q.img, q.fr);
    a.font = '700 13px Rajdhani, sans-serif'; a.textAlign = 'center'; a.fillStyle = '#e9e4ff';
    a.fillText(PJ.mascota.nombre, 196, 296);
  }
}

// ----- Iconos y barra de acción -----
function pintarIcono(c, spr){
  const a = c.getContext('2d'), s = c.width;
  a.clearRect(0, 0, s, s);
  const g = a.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s * .7);
  g.addColorStop(0, '#2e2160'); g.addColorStop(1, '#0b0817');
  a.fillStyle = g; a.fillRect(0, 0, s, s);
  if (spr === 'pocion'){
    a.fillStyle = '#c9b8ff'; a.fillRect(s * .42, s * .14, s * .16, s * .16);
    a.fillStyle = '#e2445c'; a.beginPath(); a.arc(s / 2, s * .58, s * .27, 0, TAU); a.fill();
    a.fillStyle = 'rgba(255,255,255,.4)'; a.beginPath(); a.arc(s * .42, s * .5, s * .07, 0, TAU); a.fill();
    return;
  }
  if (!spr) return;
  if (!spriteListo){ SPR.addEventListener('load', () => pintarIcono(c, spr), { once:true }); return; }
  const [sx, sy, w, h] = ATLAS[spr], k = Math.min(s * .9 / w, s * .9 / h);
  a.drawImage(SPR, sx, sy, w, h, (s - w * k) / 2, (s - h * k) / 2, w * k, h * k);
}

let barraEls = [];
function construirBarra(){
  const b = $('barra'); b.innerHTML = ''; barraEls = [];
  const c = CLASES[PJ.clase];
  const crear = (cls, tecla, spr, titulo, fn, info) => {
    const el = document.createElement('button');
    el.className = 'accion ' + cls; el.title = titulo; el.setAttribute('aria-label', titulo);
    el.innerHTML = `<canvas width="96" height="96"></canvas><kbd>${tecla}</kbd><b class="bloq"></b><i class="num"></i>`;
    pintarIcono(el.querySelector('canvas'), spr);
    el.addEventListener('pointerdown', e => { e.preventDefault(); fn(); });
    b.appendChild(el); barraEls.push({ el, ...info });
  };
  const sep = () => { const s = document.createElement('span'); s.className = 'sep'; b.appendChild(s); };
  crear('clic', 'Izq', c.h1.spr, c.h1.n, () => usarHab(1), { tipo:'h1' });
  crear('clic', 'Der', c.h2.spr, c.h2.n, () => usarHab(2), { tipo:'h2' });
  sep();
  TECLAS.forEach(t => {
    const pw = PODERES[PJ.barra[t]];
    crear('', t, pw ? pw.ic : null, pw ? pw.n : 'Vacío', () => usarPoder(PJ.barra[t]), { tipo:'poder', tecla:t });
  });
  sep();
  crear('poc', 'H', 'pocion', 'Poción de vida', beberPocion, { tipo:'poc' });
  prepararSoltarBarra();
}
function actualizarBarra(){
  const c = CLASES[PJ.clase];
  for (const b of barraEls){
    let cd = 0, bloq = '', num = '';
    if (b.tipo === 'h1') cd = clamp(P.cd1 / c.h1.cd, 0, 1);
    else if (b.tipo === 'h2') cd = P.en < c.h2.coste ? 1 : clamp(P.cd2 / c.h2.cd, 0, 1);
    else if (b.tipo === 'poc'){ cd = clamp(P.cdPoc, 0, 1); num = PJ.pociones; }
    else {
      const id = PJ.barra[b.tecla], pw = PODERES[id];
      if (pw && PJ.nivel < pw.nivel) bloq = 'Nv ' + pw.nivel;
      else if (pw) cd = P.en < pw.coste ? 1 : clamp((P.cdP[id] || 0) / pw.cd, 0, 1);
    }
    if (b.cd !== cd){ b.el.style.setProperty('--cd', cd); b.cd = cd; }
    if (b.bloq !== bloq){ b.el.querySelector('.bloq').textContent = bloq; b.el.classList.toggle('bloqueado', !!bloq); b.bloq = bloq; }
    if (b.num !== num){ b.el.querySelector('.num').textContent = num; b.num = num; }
  }
}

function abrirPanelPortal(portal){
  const R = RANGOS[portal.rango], mio = rangoCazador();
  $('poLetra').textContent = R.l; $('poLetra').style.color = R.color;
  $('poTitulo').textContent = `Portal de rango ${R.l}`;
  let aviso = '';
  if (portal.rango > mio + 1) aviso = '<p class="aviso" style="margin-top:10px">Este portal supera por mucho tu rango. Lo más probable es que no salgas con vida.</p>';
  else if (portal.rango > mio) aviso = '<p class="aviso" style="margin-top:10px">Este portal está por encima de tu rango. Entra con cuidado.</p>';
  else if (portal.rango < mio) aviso = `<p class="aviso" style="margin-top:10px;color:#9d9d9d">Portal por debajo de tu rango: solo darás ${mio - portal.rango === 1 ? 'el 25%' : 'el 5%'} de la experiencia.</p>`;
  $('poCuerpo').innerHTML = `
    <div class="linea"><span>Mazmorra</span><b>${R.tema}</b></div>
    <div class="linea"><span>Nivel recomendado</span><b>${R.nivel}</b></div>
    <div class="linea"><span>Tu rango</span><b style="color:${RANGOS[mio].color}">${RANGOS[mio].l} (nivel ${PJ.nivel})</b></div>
    <div class="linea"><span>Jefe</span><b>${R.jefe}</b></div>
    <div class="linea"><span>Recompensa al despejar</span><b>${dinero(Math.round(80 * R.escala) * 100)} y más</b></div>
    <div class="linea"><span>Se cierra en</span><b>${formatoTiempo(portal.cierra)}</b></div>${aviso}`;
  const btn = $('btnEntrarPortal');
  btn.className = 'btn ' + (portal.rango > mio ? 'peligro' : 'principal');
  btn.onclick = () => entrarPortal(portal);
  pantalla('pPortal');
}
const formatoTiempo = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// =====================================================
//  COMBATE
// =====================================================
function apuntar(){
  if (!esTactil){ P.ang = Math.atan2(mouse.y + cam.y - (P.y - 20), mouse.x + cam.x - P.x); return; }
  const e = enemigoCercano(P.x, P.y, 360);
  P.ang = e ? Math.atan2(e.y - P.y, e.x - P.x) : Math.atan2(P.ldy, P.ldx);
}
function enemigoCercano(x, y, max){
  let mejor = null, md = max * max;
  for (const e of enemigos){ const d = (e.x - x) ** 2 + (e.y - y) ** 2; if (d < md){ md = d; mejor = e; } }
  return mejor;
}
// punto del suelo hacia donde apuntas (para poderes de zona)
function puntoMira(max){
  if (esTactil){ const e = enemigoCercano(P.x, P.y, max); if (e) return { x:e.x, y:e.y }; return { x:P.x + Math.cos(P.ang) * 180, y:P.y + Math.sin(P.ang) * 180 }; }
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
    P.cd1 = c.h1.cd * (1 - Math.min(.35, D.s.agi * .005));
  } else {
    if (P.cd2 > 0) return;
    if (P.en < c.h2.coste){ texto(P.x, P.y - 74, 'Sin energía', '#4fa3ff', 14); P.cd2 = .3; return; }
    P.cd2 = c.h2.cd; P.en -= c.h2.coste;
  }
  apuntar();
  HAB[PJ.clase + n]();
}

const HAB = {
  guerrero1(){ pose('atk', DUR_ATK); golpeArco(84, 1.9, D.fis); efectoCorte(1.5); },
  guerrero2(){
    pose('cast', .45);
    golpeCirculo(P.x, P.y, 140, D.fis * 2.3, { empuje:90 });
    efecto('domo', P.x, P.y + 16, 1.2, { vida:.55, detras:true });
    shake = 12; chispas(P.x, P.y, '#f2c46d', 26, 260);
  },
  sombra1(){ pose('atk', DUR_ATK * .7); golpeArco(68, 1.4, D.fis * .85, .15); efectoCorte(1.1); },
  sombra2(){
    efecto('tp', P.x, P.y + 14, .5, { vida:.45 });
    const x0 = P.x, y0 = P.y, a = P.ang;
    let paso = 0;
    while (paso < 220 && !solidoEn(P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 16)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; }
    colisiones(P); P.inv = Math.max(P.inv, .35);
    golpeLinea(x0, y0, P.x, P.y, 30, D.fis * 2.4);
    efectos.push({ t:'linea', x:x0, y:y0, x2:P.x, y2:P.y, vida:.3, max:.3, color:'#7b4dff' });
    efecto('tp', P.x, P.y + 14, .5, { vida:.45 });
    pose('oculto', .12);
  },
  mago1(){
    pose('atk', DUR_ATK);
    const a = P.ang, flipV = Math.cos(a) < 0;
    efecto('mano', P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 10, .6, { rot:a, flipV, alt:32, vida:.3, sigue:true });
    proys.push({ x:P.x + Math.cos(a) * 22, y:P.y + Math.sin(a) * 22, vx:Math.cos(a) * 480, vy:Math.sin(a) * 480, r:9, alt:30,
      dmg:D.mag * 1.1, vida:1.1, color:'#8a6bff', aoe:50, spr:'rayo', esc:.5 });
  },
  mago2(){
    pose('cast', .5);
    const a = P.ang;
    proys.push({ bola:true, x:P.x + Math.cos(a) * 30, y:P.y + Math.sin(a) * 30, vx:Math.cos(a) * 210, vy:Math.sin(a) * 210, r:34, alt:22,
      dmg:D.mag * .45, vida:2.4, tick:0, color:'#8a6bff' });
    chispas(P.x, P.y - 30, '#8a6bff', 16, 160);
  }
};

function usarPoder(id){
  if (!enJuego || pantallaActual || !id) return;
  const pw = PODERES[id];
  if (PJ.nivel < pw.nivel){ texto(P.x, P.y - 74, `Se aprende en el nivel ${pw.nivel}`, '#9a91c2', 14); return; }
  if (E.tipo !== 'mazmorra'){ texto(P.x, P.y - 74, 'Los poderes solo funcionan dentro de los portales', '#9a91c2', 14); return; }
  if ((P.cdP[id] || 0) > 0) return;
  if (P.en < pw.coste){ texto(P.x, P.y - 74, 'Sin energía', '#4fa3ff', 14); return; }
  P.en -= pw.coste; P.cdP[id] = pw.cd;
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

function invocarSoldado(dur, i = 0){
  if (soldados.length >= 5){ const s = soldados.shift(); efecto('tp', s.x, s.y + 10, .5, { vida:.4 }); }
  const a = P.ang + Math.PI + (i - 1) * .9;
  const s = { x:P.x + Math.cos(a) * 50, y:P.y + Math.sin(a) * 40, r:16, vida:dur, max:dur, cd:.5, golpe:0, flip:false, idx:soldados.length };
  colisiones(s); soldados.push(s);
  efecto('tp', s.x, s.y + 10, .6, { vida:.6 });
  chispas(s.x, s.y - 30, '#7b4dff', 20, 180);
}

function golpeArco(alcance, arco, dmg, critExtra = 0){
  for (const e of enemigos){
    const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy);
    if (d < alcance + e.r && (Math.abs(angDif(Math.atan2(dy, dx), P.ang)) < arco / 2 || d < e.r + P.r + 4)) herir(e, dmg, critExtra);
  }
}
function golpeCirculo(x, y, radio, dmg, op = {}){
  for (const e of enemigos){
    const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy) || 1;
    if (d < radio + e.r){
      herir(e, dmg);
      if (op.empuje && !e.jefe){ e.x += dx / d * op.empuje; e.y += dy / d * op.empuje; colisiones(e); }
      if (op.lento) e.lento = op.lento;
    }
  }
}
function golpeLinea(x1, y1, x2, y2, ancho, dmg){
  const lx = x2 - x1, ly = y2 - y1, l2 = lx * lx + ly * ly || 1;
  for (const e of enemigos){
    const t = clamp(((e.x - x1) * lx + (e.y - y1) * ly) / l2, 0, 1);
    if (Math.hypot(e.x - (x1 + lx * t), e.y - (y1 + ly * t)) < ancho + e.r) herir(e, dmg, .2);
  }
}

function herir(e, dmg, critExtra = 0){
  if (e.muerto) return;
  dmg *= rand(.9, 1.1) * efMod.dmg();
  const crit = Math.random() < D.crit + critExtra;
  if (crit) dmg *= 1.8;
  e.hp -= dmg; e.flash = .1; e.aggro = true;
  P.objetivo = e; P.tObj = 6;
  texto(e.x + rand(-8, 8), e.y - e.r - 4, Math.round(dmg), crit ? '#f2c46d' : '#ffffff', crit ? 19 : 14);
  if (e.hp <= 0) matar(e);
}

function matar(e){
  e.muerto = true; PJ.kills++;
  { const n = sprDe(e); if (n && !(e.jefe && (n === 'arana' || n === 'jabali'))){ const D = MON.tipos[n]; cadaveres.push({ n, x:e.x, pie:e.y + e.r * .8, alto:altoDe(e), ref:MON.cuadros[D.walk[0]][3], flip:D.mira !== 0 && (e.face || 1) !== D.mira, t0:performance.now() }); } }
  chispas(e.x, e.y, e.color, e.jefe ? 70 : 14, e.jefe ? 340 : 200);
  ganarXP(e.xp);
  const monedas = e.jefe ? 10 : 1 + (Math.random() < .4 ? 1 : 0);
  for (let k = 0; k < monedas; k++) botin.push({ t:'oro', x:e.x + rand(-e.r, e.r), y:e.y + rand(-e.r, e.r), c:Math.max(1, Math.round(Math.max(1, e.oro / monedas) * rand(55, 145))) });
  if (Math.random() < (e.jefe ? 1 : .05)) botin.push({ t:'pocion', x:e.x, y:e.y });
  { const pk = PARTE_MONSTRUO[sprDe(e)];
    const np = e.jefe ? 3 : (misionPide(pk) ? 1 : (Math.random() < .4 ? 1 : 0));
    if (pk) for (let k = 0; k < np; k++) botin.push({ t:'cons', x:e.x + rand(-22, 22), y:e.y + rand(-22, 22), k:pk });
    if (e.jefe) botin.push({ t:'cons', x:e.x, y:e.y - 10, k:'p_nucleo' }); }
  const nCons = e.jefe ? 2 : (Math.random() < .07 ? 1 : 0);
  for (let k = 0; k < nCons; k++) botin.push({ t:'cons', x:e.x + rand(-20, 20), y:e.y + rand(-20, 20), k:CONSUMIBLES[Math.random() * (e.jefe ? CONSUMIBLES.length : CONSUMIBLES.length - 1) | 0] });
  const nObj = e.jefe ? 2 : (Math.random() < .08 ? 1 : 0);
  for (let k = 0; k < nObj; k++) botin.push({ t:'obj', x:e.x + rand(-24, 24), y:e.y + rand(-24, 24), obj:crearObjeto(E.rango, e.jefe ? 2 : 0) });
  if (e.jefe){
    jefeVivo = null; $('jefe').classList.add('oculto'); shake = 20;
    mazmorraDespejada();
  }
}

// curva de experiencia mucho más exigente (crece casi con el cuadrado del nivel)
function xpNecesaria(n){ return Math.round(60 * Math.pow(n, 2.15) + 60 * n); }
// como en WoW: los portales por debajo de tu rango dan muy poca experiencia
function factorXpPortal(){
  if (E.tipo !== 'mazmorra') return 1;
  const dif = rangoCazador() - E.rango;
  return dif <= 0 ? 1 : dif === 1 ? .25 : .05;
}
function ganarXP(x, sinFactor){
  if (!sinFactor) x = Math.max(1, Math.round(x * factorXpPortal()));
  x = Math.round(x * (1 + bonoHerm()));
  const rAntes = rangoCazador();
  PJ.xp += x;
  texto(P.x, P.y - 72, `+${x} exp`, '#5ee6d0', 13);
  chat(`Ganas ${x} puntos de experiencia.`, '#b9a3ff');
  const nivelAntes = PJ.nivel;
  let subio = false;
  while (PJ.xp >= PJ.xpSig){
    PJ.xp -= PJ.xpSig; PJ.nivel++; PJ.puntos += 3;
    PJ.xpSig = xpNecesaria(PJ.nivel); subio = true;
  }
  if (subio){
    derivar(); P.hp = D.maxHp; P.en = D.maxEn;
    const rDesp = rangoCazador();
    chat(`¡Has alcanzado el nivel ${PJ.nivel}!`, '#ffd76a');
    for (const pw of Object.values(PODERES)) if (pw.nivel > nivelAntes && pw.nivel <= PJ.nivel) chat(`Has aprendido un nuevo poder: ${pw.n}.`, '#ffd76a');
    if (rDesp > rAntes) chat(`Reevaluación: ahora eres cazador de rango ${RANGOS[rDesp].l}.`, RANGOS[rDesp].color);
    if (rDesp > rAntes) banner(`Reevaluación: rango ${RANGOS[rDesp].l}`, `Ahora eres un cazador de rango ${RANGOS[rDesp].l}`);
    else banner(`Nivel ${PJ.nivel}`, 'Tienes puntos nuevos para repartir en tu perfil');
    chispas(P.x, P.y - 20, '#f2c46d', 40, 280);
    guardar();
  }
}

// =====================================================
//  BUFFS Y DEBUFFS
// =====================================================
const EFECTOS = {
  atk_up:  { n:'Furia de sombras',   d:'+20% de daño',               ic:'b_atk_up' },
  def_up:  { n:'Coraza de sombras',  d:'Recibes 30% menos daño',     ic:'b_def_up' },
  spi_up:  { n:'Descansado',         d:'+60% de energía recuperada', ic:'b_spi_up' },
  agi_up:  { n:'Celeridad',          d:'+25% de velocidad',          ic:'b_agi_up' },
  veneno:  { n:'Veneno',             d:'Pierdes vida cada segundo',  ic:'b_veneno', malo:true },
  atk_dn:  { n:'Debilidad',          d:'-20% de daño',               ic:'b_atk_dn', malo:true },
  def_dn:  { n:'Armadura rota',      d:'Recibes 25% más daño',       ic:'b_def_dn', malo:true },
  spi_dn:  { n:'Mente nublada',      d:'-50% de energía recuperada', ic:'b_spi_dn', malo:true },
  agi_dn:  { n:'Lentitud',           d:'-35% de velocidad',          ic:'b_agi_dn', malo:true }
};
// qué debuff deja cada monstruo al golpearte (y con qué probabilidad)
const DEBUFF_MONSTRUO = { slime:['agi_dn', 3, .35], mantis:['atk_dn', 5, .3], escorpion:['def_dn', 5, .3], arana:['veneno', 4, .45], jabali:['agi_dn', 2, .3] };
let estados = {}, pilaTxt = 0, tPila = 0;
function ponerEfecto(id, seg){
  const nuevo = !estados[id];
  estados[id] = { t:Math.max(seg, estados[id] ? estados[id].t : 0), max:seg };
  if (nuevo){
    const ef = EFECTOS[id];
    const ahora = performance.now(); pilaTxt = ahora - tPila < 600 ? pilaTxt + 1 : 0; tPila = ahora;
    texto(P.x, P.y - 88 - pilaTxt * 15, ef.n, ef.malo ? '#ff8a9b' : '#7dffa8', 13);
    chat(ef.malo ? `Sufres ${ef.n}: ${ef.d.toLowerCase()}.` : `Obtienes ${ef.n}: ${ef.d.toLowerCase()}.`, ef.malo ? '#ff8a9b' : '#7dffa8');
  }
  pintarBuffs(true);
}
const efMod = {
  dmg:   () => (estados.atk_up ? 1.2 : 1) * (estados.atk_dn ? .8 : 1),
  recibe:() => (estados.def_up ? .7 : 1) * (estados.def_dn ? 1.25 : 1),
  vel:   () => (estados.agi_up ? 1.25 : 1) * (estados.agi_dn ? .65 : 1),
  regEn: () => (estados.spi_up ? 1.6 : 1) * (estados.spi_dn ? .5 : 1)
};
let tBuffs = 0, tVeneno = 0;
function updateEfectos(dt){
  for (const id in estados){ estados[id].t -= dt; if (estados[id].t <= 0){ delete estados[id]; pintarBuffs(true); } }
  if (estados.veneno && P.hp > 0){
    const d = D.maxHp * .025 * dt; P.hp = Math.max(1, P.hp - d);
    tVeneno += dt; if (tVeneno > 1){ tVeneno = 0; texto(P.x, P.y - 70, Math.round(D.maxHp * .025), '#8dff6a', 13); }
  }
  tBuffs -= dt; if (tBuffs <= 0){ tBuffs = .25; pintarBuffs(); }
}
function limpiarEfectos(soloMalos){
  for (const id in estados) if (!soloMalos || EFECTOS[id].malo) delete estados[id];
  pintarBuffs(true);
}
let firmaBuffs = '';
function pintarBuffs(forzar){
  const cont = $('buffs'); if (!cont) return;
  const ids = Object.keys(estados).sort((a, b) => (EFECTOS[a].malo ? 1 : 0) - (EFECTOS[b].malo ? 1 : 0));
  const firma = ids.join(',');
  if (forzar || firma !== firmaBuffs){
    firmaBuffs = firma;
    cont.innerHTML = ids.map(id => {
      const ef = EFECTOS[id], i = ICONOS_OBJ[ef.ic][0];
      return `<span class="buff ${ef.malo ? 'malo' : ''}" data-ef="${id}" title="${ef.n}: ${ef.d}" style="background-image:url(${ICONOS_URL});background-position:${(i / (ICONOS_N - 1) * 100).toFixed(4)}% 0"><i></i></span>`;
    }).join('');
  }
  cont.querySelectorAll('.buff').forEach(el => {
    const e = estados[el.dataset.ef]; if (!e) return;
    const t = Math.ceil(e.t);
    el.querySelector('i').textContent = t >= 60 ? `${Math.ceil(t / 60)}m` : `${t}s`;
    el.classList.toggle('fin', e.t < 3);
  });
}

function golpearJugador(d, src){
  if (P.inv > 0) return;
  d *= (1 - D.def) * efMod.recibe();
  if (src && !src.jefe){
    const db = DEBUFF_MONSTRUO[sprDe(src)];
    if (db && Math.random() < db[2]) ponerEfecto(db[0], db[1]);
  } else if (src && src.jefe && Math.random() < .25){
    const db = DEBUFF_MONSTRUO[sprDe(src)]; if (db) ponerEfecto(db[0], db[1] + 2);
  }
  P.hp -= d; P.inv = .45; P.golpe = .2; shake = Math.max(shake, 7);
  texto(P.x, P.y - 70, Math.round(d), '#ff6b7f', 15);
  chispas(P.x, P.y - 20, '#e2445c', 8, 150);
  if (P.hp <= 0){
    P.hp = 0;
    const perdida = Math.floor(PJ.oro * .15); PJ.oro -= perdida; guardar();
    $('muerteTxt').textContent = perdida ? `Perdiste ${dineroTxt(perdida)}. Despertarás en tu cama de la posada.` : 'Despertarás en tu cama de la posada.';
    limpiarEfectos(false);
    pantalla('pMuerte');
  }
}

function beberPocion(){
  if (!enJuego || pantallaActual || P.cdPoc > 0) return;
  if (PJ.pociones <= 0){ texto(P.x, P.y - 70, 'Sin pociones', '#ff8a9b', 14); return; }
  if (P.hp >= D.maxHp){ texto(P.x, P.y - 70, 'Vida completa', '#9a91c2', 14); return; }
  PJ.pociones--; P.cdPoc = 1;
  const c = Math.round(D.maxHp * .45); P.hp = Math.min(D.maxHp, P.hp + c);
  texto(P.x, P.y - 70, '+' + c, '#7dffa8', 17); chispas(P.x, P.y - 20, '#7dffa8', 16, 120);
}

function chispas(x, y, color, n, v = 180){
  for (let i = 0; i < n && particulas.length < 500; i++){
    const a = rand(0, TAU), s = rand(v * .3, v);
    particulas.push({ x, y, vx:Math.cos(a) * s, vy:Math.sin(a) * s, vida:rand(.25, .6), max:.6, color, r:rand(1.5, 3.5) });
  }
}
function texto(x, y, txt, color, size){ if (textos.length < 70) textos.push({ x, y, txt, color, size, vida:.8 }); }

// ventana de chat: se mueve desde la cabecera y cambia de tamaño desde la esquina
(function(){
  const ch = $('chat');
  const guardarChat = () => { try { localStorage.setItem('rb_chat', JSON.stringify({ l:ch.style.left, b:ch.style.bottom, w:ch.style.width, h:ch.style.height, min:ch.classList.contains('min') })); } catch (e) {} };
  try { const g = JSON.parse(localStorage.getItem('rb_chat') || 'null'); if (g){ Object.assign(ch.style, { left:g.l, bottom:g.b, width:g.w, height:g.h }); ch.classList.toggle('min', !!g.min); } } catch (e) {}
  const arrastre = (el, fn) => el.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    e.preventDefault(); const r = ch.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
    const mover = ev => fn(r, ev.clientX - x0, ev.clientY - y0);
    const fin = () => { removeEventListener('pointermove', mover); removeEventListener('pointerup', fin); guardarChat(); };
    addEventListener('pointermove', mover); addEventListener('pointerup', fin);
  });
  arrastre($('chatCab'), (r, dx, dy) => { ch.style.left = clamp(r.left + dx, 0, innerWidth - 120) + 'px'; ch.style.bottom = clamp(innerHeight - r.bottom - dy, 0, innerHeight - 60) + 'px'; });
  arrastre($('chatRs'), (r, dx, dy) => { ch.style.width = clamp(r.width + dx, 200, innerWidth - r.left - 8) + 'px'; ch.style.height = clamp(r.height - dy, 90, r.bottom - 8) + 'px'; });
  $('chatMin').onclick = () => { ch.classList.toggle('min'); $('chatMin').textContent = ch.classList.contains('min') ? '+' : '–'; guardarChat(); };
  if (ch.classList.contains('min')) $('chatMin').textContent = '+';
})();
function chat(txt, color = '#e9e4ff'){
  const c = $('chatLog'), p = document.createElement('p');
  const abajo = c.scrollHeight - c.scrollTop - c.clientHeight < 30;
  p.textContent = txt; p.style.color = color; c.appendChild(p);
  while (c.children.length > 120) c.firstChild.remove();
  if (abajo) c.scrollTop = c.scrollHeight;
}
let bannerT;
function banner(titulo, sub){
  const b = $('banner');
  b.innerHTML = escapar(titulo) + (sub ? `<small>${escapar(sub)}</small>` : '');
  b.classList.add('ver'); clearTimeout(bannerT); bannerT = setTimeout(() => b.classList.remove('ver'), 2800);
}

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
  const vel = (esInterior() ? D.vel * .8 : D.vel) * efMod.vel();
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
  // cambiar de lado solo con un movimiento claro (evita parpadeos)
  if (Math.abs(P.vx) > 30) P.mira = P.vx < 0;
  P.pose.t -= dt;
  for (const k in P.cdP) P.cdP[k] -= dt;
  P.tObj = (P.tObj || 0) - dt;

  P.hp = Math.min(D.maxHp, P.hp + (D.regHp + (E.tipo !== 'mazmorra' ? D.maxHp * .03 : 0)) * dt);
  P.en = Math.min(D.maxEn, P.en + D.regEn * efMod.regEn() * dt);
  updateEfectos(dt);
  P.cd1 -= dt; P.cd2 -= dt; P.cdPoc -= dt; P.inv -= dt; P.golpe -= dt;

  // portales de la ciudad (avanzan siempre)
  timerPortal -= dt;
  if (timerPortal <= 0){ timerPortal = 30; if (portales.length < 5) crearPortal(); }
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

  // botín
  for (const o of botin){
    const dx = P.x - o.x, dy = P.y - o.y, d = Math.hypot(dx, dy);
    if (d < 100){ const s = 380 * (1 - d / 100) + 80; o.x += dx / d * s * dt; o.y += dy / d * s * dt; }
    if (d < P.r + 8){
      if (o.t === 'obj'){
        if (PJ.bolsa.length >= TAM_BOLSA){ if (!o.aviso){ texto(P.x, P.y - 74, 'Tu bolsa está llena', '#ff8a9b', 14); chat('Tu bolsa está llena.', '#ff8a9b'); o.aviso = true; } continue; }
        PJ.bolsa.push(o.obj); texto(P.x, P.y - 78, o.obj.nombre, RAREZAS[o.obj.rareza].c, 15);
        chat(`Recibes botín: [${o.obj.nombre}]`, RAREZAS[o.obj.rareza].c);
      }
      else if (o.t === 'oro'){ const c = Math.round((o.c || 1) * (1 + bonoHerm())); PJ.oro += c; texto(P.x + 14, P.y - 60, '+' + dineroTxt(c).replace(/ de /g, ' '), '#f2c46d', 13); chat(`Despojas ${dineroTxt(c)}.`, '#f2c46d'); }
      else if (o.t === 'cons'){ darApilable(o.k); const A = APILABLES[o.k]; texto(P.x, P.y - 78, A.n, RAREZAS[A.r].c, 14); chat(`Recibes botín: [${A.n}]`, RAREZAS[A.r].c); }
      else { PJ.pociones++; texto(P.x, P.y - 74, '+1 poción', '#7dffa8', 15); chat('Recibes botín: [Poción de vida]', '#7dffa8'); }
      o.tomado = true;
    }
  }
  botin = botin.filter(o => !o.tomado);

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
  if (mouse.izq || holdAtk) usarHab(1);

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
  if (timerCampo <= 0){ timerCampo = .25; campo = bfs(E, pcx, pcy); }

  for (const e of enemigos){
    const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1;
    const lento = e.lento > 0 ? .45 : 1;
    e.lento -= dt; e.flash -= dt; e.cd -= dt; e.cdGolpe -= dt;
    if (e.jefe){ actualizarJefe(e, dx, dy, d, dt); continue; }

    if (!e.aggro && d < 300 && lineaVision(e.x, e.y, P.x, P.y)) e.aggro = true;
    if (e.aggro && d > 900) e.aggro = false;

    let vx = 0, vy = 0, vel = e.vel * lento;
    if (e.aggro && ataqueMonstruo(e, dx, dy, d, dt, lento)){ e.mueve = true; continue; }
    if (e.aggro){
      [vx, vy] = direccionHacia(e);
      if (e.rango){
        const vision = lineaVision(e.x, e.y, P.x, P.y);
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
    } else {
      vel *= .3;
      const wd = Math.hypot(e.wx - e.x, e.wy - e.y);
      if (wd < 10 || Math.random() < .004){ e.wx = e.hx + rand(-90, 90); e.wy = e.hy + rand(-90, 90); }
      else { vx = (e.wx - e.x) / wd; vy = (e.wy - e.y) / wd; }
    }
    e.x += vx * vel * dt; e.y += vy * vel * dt;
    e.mueve = Math.abs(vx) + Math.abs(vy) > .05;
    colisiones(e);
    if (d < e.r + P.r + 4 && e.cdGolpe <= 0){ e.cdGolpe = 1; golpearJugador(e.dmg * .6, e); }
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
      if (Math.random() < .5) chispas(p.x + rand(-25, 25), p.y + rand(-25, 25), '#6a4dff', 1, 60);
      if (p.vida <= 0){
        golpeCirculo(p.x, p.y, 85, p.dmg * 2.5);
        chispas(p.x, p.y, '#8a6bff', 30, 240); shake = Math.max(shake, 6);
      }
      continue;
    }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt;
    let choca = solidoEn(p.x, p.y);
    if (!choca) for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r + 6){ choca = true; break; }
    if (choca || p.vida <= 0){
      if (choca){
        golpeCirculo(p.x, p.y, p.aoe, p.dmg);
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
    else if (Math.hypot(p.x - P.x, p.y - P.y) < p.r + P.r - 2){ golpearJugador(p.dmg, p.src); if (p.tela){ ponerEfecto('agi_dn', 2.5); texto(P.x, P.y - 90, '¡Atrapado en la telaraña!', '#f2f2f2', 13); } p.vida = 0; }
  }
  proysE = proysE.filter(p => p.vida > 0);
}

function actualizarJefe(e, dx, dy, d, dt){
  if (!e.aggro && d < 430 && lineaVision(e.x, e.y, P.x, P.y)){
    e.aggro = true; E.jefeVisto = true; $('jefe').classList.remove('oculto'); banner(e.nombre, 'Jefe de la mazmorra'); shake = 10;
  }
  if (!e.aggro) return;
  const lento = e.lento > 0 ? .6 : 1, enf = e.hp < e.maxHp / 2;
  if (e.carga > 0){
    e.carga -= dt;
    e.x += Math.cos(e.cdir) * e.vel * 4.4 * dt; e.y += Math.sin(e.cdir) * e.vel * 4.4 * dt;
    if (Math.random() < .5) chispas(e.x, e.y, e.color, 2, 80);
  } else if (e.aviso > 0){
    e.aviso -= dt;
    if (e.aviso <= 0) e.carga = .5;
  } else {
    const [vx, vy] = direccionHacia(e);
    e.x += vx * e.vel * lento * dt; e.y += vy * e.vel * lento * dt;
    if (e.cd <= 0){
      e.patron = (e.patron + 1) % 3;
      if (e.patron === 0){
        const n = enf ? 20 : 14, off = rand(0, TAU);
        for (let i = 0; i < n; i++){ const a = off + i * TAU / n; proysE.push({ x:e.x, y:e.y, vx:Math.cos(a) * 210, vy:Math.sin(a) * 210, r:8, dmg:e.dmg * .7, vida:3.5, color:e.color, src:e }); }
        shake = Math.max(shake, 5);
      } else if (e.patron === 1){
        e.aviso = enf ? .45 : .7; e.cdir = Math.atan2(dy, dx);
      } else {
        for (let i = 0; i < (enf ? 4 : 3); i++) crearEnemigo(E.R.enemigos[i % E.R.enemigos.length], e.x + rand(-70, 70), e.y + rand(-70, 70), true);
        chispas(e.x, e.y, e.color, 20, 200);
      }
      e.cd = enf ? 2 : 2.8;
    }
  }
  colisiones(e);
  if (d < e.r + P.r + 4 && e.cdGolpe <= 0){ e.cdGolpe = .9; golpearJugador(e.dmg, e); }
}

function actualizarHUD(){
  const r = rangoCazador(), R = RANGOS[r];
  $('hNombre').textContent = PJ.nombre;
  $('hNivel').textContent = PJ.nivel;
  $('hRango').textContent = R.l; $('hRango').style.color = R.color;
  $('hpFill').style.width = (P.hp / D.maxHp * 100) + '%';
  $('hpTxt').textContent = `${Math.ceil(P.hp)} / ${D.maxHp}`;
  $('enFill').style.width = (P.en / D.maxEn * 100) + '%';
  $('enTxt').textContent = `${Math.floor(P.en)} / ${D.maxEn}`;
  $('xpFill').style.width = (PJ.xp / PJ.xpSig * 100) + '%';
  $('xpTxt').textContent = `${PJ.xp} / ${PJ.xpSig}`;
  // marco de objetivo: el jefe en combate, o el último enemigo golpeado
  let ob = null;
  if (jefeVivo && jefeVivo.aggro) ob = jefeVivo;
  else if (P.objetivo && !P.objetivo.muerto && P.tObj > 0) ob = P.objetivo;
  const mo = $('marcoObjetivo');
  mo.classList.toggle('oculto', !ob);
  if (ob){
    mo.classList.toggle('elite', !!ob.jefe);
    $('oNombre').textContent = ob.nombre;
    $('oRango').textContent = ob.jefe ? 'Jefe' : (E.R ? E.R.l : ''); $('oRango').style.color = E.R ? E.R.color : '#fff';
    $('oFill').style.width = Math.max(0, ob.hp / ob.maxHp * 100) + '%';
    $('oTxt').textContent = `${Math.max(0, Math.ceil(ob.hp))} / ${ob.maxHp}`;
    $('oColor').style.background = ob.color;
  }
  if (hPocPrev !== PJ.pociones){ hPocPrev = PJ.pociones; $('hPoc').innerHTML = `${ic3('pocion')}<b>${PJ.pociones}</b>`; }
  $('btnPuntos').classList.toggle('oculto', !PJ.puntos);
  if (PJ.puntos) $('btnPuntos').textContent = `${PJ.puntos} puntos por repartir`;
  actualizarBarra();
  const c = CLASES[PJ.clase];
  const cd1 = clamp(P.cd1 / c.h1.cd, 0, 1), cd2 = P.en < c.h2.coste ? 1 : clamp(P.cd2 / c.h2.cd, 0, 1), cdp = clamp(P.cdPoc, 0, 1);
  $('mAtk').style.setProperty('--cd', cd1); $('mHab').style.setProperty('--cd', cd2); $('mPoc').style.setProperty('--cd', cdp);
}

// =====================================================
//  SPRITES DEL PERSONAJE
// =====================================================
const ATLAS = {"idle0":[0,0,59,127,33.5,125.0],"idle1":[61,0,60,127,31.5,126.0],"idle2":[123,0,59,127,30.0,126.0],"idle3":[184,0,52,128,28.0,127.0],"arriba":[238,0,53,102,26.0,100.0],"abajo":[293,0,49,103,23.5,101.0],"izq":[344,0,38,103,17.5,101.0],"der":[384,0,37,103,16.5,101.0],"walk0":[423,0,73,111,38.5,110.0],"walk1":[498,0,71,111,30.0,110.0],"walk2":[571,0,74,110,37.5,109.0],"walk3":[647,0,82,109,34.0,109.0],"walk4":[731,0,82,109,33.5,108.0],"walk5":[815,0,88,107,37.0,107.0],"walk6":[905,0,72,104,35.5,103.0],"atk0":[0,130,91,117,42.0,117.0],"atk1":[93,130,86,114,34.0,113.0],"atk2":[181,130,63,111,32.5,110.0],"atk3":[246,130,84,104,42.5,103.0],"cast":[332,130,57,101,28.0,99.0],"invocar":[391,130,49,100,23.5,98.0],"rayo":[442,130,217,41,207,20.5],"bola":[661,130,79,92,39.5,46.0],"mano":[742,130,56,47,4,23.5],"luna":[800,130,96,35,48.0,17.5],"ola":[0,249,105,75,52.5,37.5],"domo":[107,249,174,82,87.0,82],"tp":[283,249,119,159,59.5,159],"soldado":[404,249,144,168,72.0,168],"lluvia":[550,249,186,166,93.0,166],"corte":[738,249,45,33,22.5,16.5],"pilar":[785,249,97,91,48.5,91]};
const SPR = new Image();
let spriteListo = false;
SPR.onload = () => { spriteListo = true; dibujarAvatar(); };
SPR.src = 'img/spr.png';
const grupoDe = n => ['arriba','abajo','izq','der'].includes(n) ? 'dir' : n.replace(/\d+$/, '');
const EFECTOS_SPR = ['rayo','bola','mano','luna','ola','domo','tp','soldado','lluvia','corte','pilar'];
const ALTO_GRUPO = {};
for (const [n, f] of Object.entries(ATLAS)){ if (EFECTOS_SPR.includes(n)) continue; const g = grupoDe(n); ALTO_GRUPO[g] = Math.max(ALTO_GRUPO[g] || 0, f[3]); }
const ALTO_PJ = 66;
const DUR_ATK = .48; // duración de la animación de ataque

function dibujarFrame(n, x, y, esc, flip, rot = 0){
  const [sx, sy, w, h, ax, ay] = ATLAS[n];
  ctx.save(); ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(SPR, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  ctx.restore();
}

let hOroPrev = -1, hPocPrev = -1;
const MONEDAS_IMG = new Image();
MONEDAS_IMG.src = 'img/ui-1.png';
function dibujarAvatar(){
  const av = $('avatar'), a = av.getContext('2d');
  a.clearRect(0, 0, av.width, av.height);
  const g = a.createRadialGradient(56, 40, 6, 56, 56, 70);
  g.addColorStop(0, PJ ? CLASES[PJ.clase].color : '#7b4dff'); g.addColorStop(1, '#120d24');
  a.fillStyle = g; a.fillRect(0, 0, av.width, av.height);
  if (!gatosListo || !PJ){ GATOS_IMG.addEventListener('load', dibujarAvatar, { once:true }); return; }
  // cabeza del gato
  const [sx, sy, w] = cuadroGato(PJ.gato, GATOS_DIR[PJ.gato].q_ab ? 'q_ab' : 'ab', 0), lado = Math.min(w, 70);
  a.imageSmoothingEnabled = true;
  a.drawImage(GATOS_IMG, sx + (w - lado) / 2, sy, lado, lado, 4, 8, 104, 104);
}

const ALTO_GATO_PJ = 62;
// dir: 'ab' de frente, 'ar' de espalda, 'lado'. Si un gato no tiene una vista, usa la más parecida.
function cuadroGato(tipo, dir, i){
  const g = GATOS_DIR[tipo];
  let set = g[dir];
  if (!set || !set.length) set = dir === 'ar' ? (g.lado.length ? g.lado : g.ab) : g.ab;
  return set[((i % set.length) + set.length) % set.length];
}
function dibujarJugador(t){
  if (P.inv > 0 && P.golpe > -0.25 && Math.floor(t / 60) % 2) return;
  const pie = P.y + 13;
  if (!gatosListo){
    ctx.fillStyle = '#120d24'; ctx.strokeStyle = CLASES[PJ.clase].color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(P.x, P.y, P.r, 0, TAU); ctx.fill(); ctx.stroke(); return;
  }
  const GD = GATOS_DIR[PJ.gato], escG = ALTO_GATO_PJ / 96;
  if (P.hp <= 0 && GD.muerto && GD.muerto.length){
    const [sx, sy, w, h, ax, ay] = GD.muerto[0];
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.drawImage(GATOS_IMG, sx, sy, w, h, P.x - ax * escG, pie - ay * escG, w * escG, h * escG);
    return;
  }
  const mov = Math.hypot(P.mx, P.my) > .2, pose = P.pose.t > 0 ? P.pose.n : null;
  if (pose === 'oculto') return;
  // hacia dónde mira: al caminar, según el movimiento; al atacar, según donde apunta
  const dirDe = (vx, vy) => Math.abs(vy) > Math.abs(vx) * 1.15 ? (vy < 0 ? 'ar' : 'ab') : 'lado';
  if (mov) { P.dirV = dirDe(P.mx, P.my); }
  let dir = P.dirV || 'ab', derecha = !P.mira;
  let f = 0, kx = 1, ky = 1, alza = 0, rot = 0;
  if (pose){
    const k = 1 - P.pose.t / P.pose.dur, s = Math.sin(k * Math.PI);
    dir = dirDe(Math.cos(P.ang), Math.sin(P.ang)); derecha = Math.cos(P.ang) > 0;
    if (pose === 'atk'){ kx = 1 + .12 * s; ky = 1 - .09 * s; rot = dir === 'lado' ? (derecha ? 1 : -1) * .18 * s : 0; alza = dir === 'lado' ? 0 : -6 * s; }
    else { alza = -12 * s; kx = 1 - .06 * s; ky = 1 + .1 * s; }
  } else if (mov){
    // los pasos avanzan según la distancia recorrida
    f = Math.floor(P.paso / 16);
    alza = -Math.abs(Math.sin(P.paso / 16 * Math.PI)) * 2.2;
  } else {
    const r = Math.sin(t / 420); ky = 1 + .025 * r; kx = 1 - .012 * r;
  }
  // la vista de lado mira a la izquierda en la hoja: se refleja para ir a la derecha
  // si el gato tiene vista propia hacia la derecha se usa; si no, se refleja
  const usarDe = dir === 'lado' && derecha && GD.de && GD.de.length;
  const flip = dir === 'lado' && derecha && !usarDe;
  let setV = usarDe ? 'de' : dir, fV = f;
  // quieto: si el gato tiene cuadros de reposo, se usan (pies en el suelo, respiración suave)
  if (!mov && !pose && GD['q_' + setV] && GD['q_' + setV].length){ setV = 'q_' + setV; fV = Math.floor(t / 700); kx = 1; ky = 1; }
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, setV, fV), esc = escG;
  // sombra y aro con el color de la clase
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 17, 6, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = CLASES[PJ.clase].color + '88'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(P.x, pie, 19, 7, 0, 0, TAU); ctx.stroke();
  if (P.golpe > 0) ctx.globalAlpha = .65;
  ctx.save(); ctx.translate(P.x, pie + alza); if (rot) ctx.rotate(rot); ctx.scale(flip ? -kx : kx, ky);
  ctx.drawImage(GATOS_IMG, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  ctx.restore();
  ctx.globalAlpha = 1;
  // nombre sobre la cabeza, estilo MMO
  const ny = pie - ALTO_GATO_PJ - 10;
  ctx.font = '700 14px Rajdhani, sans-serif'; ctx.textAlign = 'center';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.strokeText(PJ.nombre, P.x, ny);
  ctx.fillStyle = '#7fc8ff'; ctx.fillText(PJ.nombre, P.x, ny);
  if (PJ.hermandad){
    const hy = ny - 15; ctx.font = '600 12px Rajdhani, sans-serif';
    const tx = `<${PJ.hermandad.nombre}>`;
    ctx.strokeText(tx, P.x, hy); ctx.fillStyle = '#7dffa8'; ctx.fillText(tx, P.x, hy);
  }
}

function updateAliados(dt){
  // soldados de sombra
  soldados.forEach((s, i) => {
    s.vida -= dt; s.cd -= dt; s.golpe -= dt;
    if (Math.hypot(s.x - P.x, s.y - P.y) > 520){ s.x = P.x - 40; s.y = P.y + 10; colisiones(s); }
    let obj = null, md = 380;
    for (const e of enemigos){
      const d = Math.hypot(e.x - s.x, e.y - s.y);
      if (d < md && Math.hypot(e.x - P.x, e.y - P.y) < 520){ md = d; obj = e; }
    }
    const tx = obj ? obj.x : P.x + Math.cos(i * 2.1 + 1) * 60, ty = obj ? obj.y : P.y + Math.sin(i * 2.1 + 1) * 40;
    const para = obj ? obj.r + s.r + 6 : 20;
    const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy) || 1;
    if (d > para){
      const v = obj ? 230 : Math.min(260, (d - para) * 4);
      s.x += dx / d * v * dt; s.y += dy / d * v * dt;
      if (Math.abs(dx) > 4) s.flip = dx < 0;
      colisiones(s);
    } else if (obj && s.cd <= 0){
      s.cd = .75; s.golpe = .18;
      herir(obj, D.poder * .7);
      chispas(obj.x, obj.y - 10, '#7b4dff', 8, 160);
    }
    if (s.vida <= 0){ efecto('tp', s.x, s.y + 10, .5, { vida:.45 }); chispas(s.x, s.y - 30, '#7b4dff', 14, 140); }
  });
  soldados = soldados.filter(s => s.vida > 0);

  // zonas de daño (lluvia de sombras)
  for (const z of zonas){
    z.t -= dt;
    if (z.t <= 0 && z.ticks > 0){
      z.t = z.cada; z.ticks--;
      golpeCirculo(z.x, z.y, z.r, z.dmg);
      chispas(z.x + rand(-z.r, z.r) * .7, z.y + rand(-z.r, z.r) * .5, '#8a6bff', 6, 90);
    }
  }
  zonas = zonas.filter(z => z.ticks > 0);
  enemigos = enemigos.filter(e => !e.muerto);
}

function dibujarSoldado(s, t){
  const k = Math.max(0, Math.min(1, (s.max - s.vida) / .4, s.vida / .6));
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(s.x, s.y + 12, 22, 7, 0, 0, TAU); ctx.fill();
  const esc = 88 / ATLAS.soldado[3] * (s.golpe > 0 ? 1.08 : 1);
  dibujarFrame('soldado', s.x, s.y + 12 + Math.sin(t / 300 + s.x) * 1.5, esc, s.flip);
  ctx.globalAlpha = 1;
}

function dibujarEfecto(n, x, y, esc, rot = 0, flipV = false){
  const [sx, sy, w, h, ax, ay] = ATLAS[n];
  ctx.save(); ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (flipV) ctx.scale(1, -1);
  ctx.drawImage(SPR, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  ctx.restore();
}
function dibujarEfectos(detras){
  for (const f of efectos){
    if (!!f.detras !== detras) continue;
    const k = f.vida / f.max;
    if (f.t === 'spr'){
      if (!spriteListo) continue;
      ctx.globalAlpha = k < .4 ? k / .4 : 1;
      const pop = 1 + Math.max(0, k - .85) * 1.2;
      dibujarEfecto(f.n, f.x, f.y - f.alt, f.esc * pop, f.rot, f.flipV);
    } else if (f.t === 'linea'){
      ctx.globalAlpha = k;
      ctx.strokeStyle = f.color; ctx.lineWidth = 14 * k; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// =====================================================
//  EDIFICIOS Y OBJETOS (atlas pixelado)
// =====================================================
// [x, y, ancho, alto] de cada sprite; se dibujan anclados abajo al centro
// edificios pixelados de la ciudad
const CASAS = {"c_asociacion":[0,0,176,210],"c_posada":[178,0,219,182],"c_mercado":[399,0,126,117],"c_casa":[527,0,82,115],"c_casamod":[611,0,106,118],"c_apart":[719,0,128,123],"c_cabana":[849,0,123,144],"c_torii":[974,0,100,88]};
const CASAS_IMG = new Image();
let casasListo = false;
CASAS_IMG.onload = () => casasListo = true;
CASAS_IMG.src = 'img/casas.webp';
const EDIF = {"casa":[0,0,168,127],"casamod":[170,0,171,125],"apart":[343,0,147,147],"hotel":[492,0,151,144],"cabana":[645,0,168,132],"cama":[0,149,145,112],"sofa":[147,149,170,91],"mesa":[319,149,162,105],"cocina":[483,149,157,117],"libreria":[642,149,135,116],"mercado":[0,268,145,114],"oficinas":[147,268,153,125],"farola":[302,268,37,105],"banco":[341,268,104,66],"arbol":[447,268,88,109],"arbusto":[537,268,99,71],"maceta":[638,268,67,95],"ropero":[707,268,121,124]};
const EDIF_IMG = new Image();
let edifListo = false;
EDIF_IMG.onload = () => edifListo = true;
EDIF_IMG.src = 'img/edif.png';
function dibujarProp(pr){
  if (pr.veta){
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, 22, 6, 0, 0, TAU); ctx.fill();
    dibujarIc3(pr.clave, pr.x, pr.y - 20, 44);
    const b = .5 + .5 * Math.sin(performance.now() / 400 + pr.x);
    ctx.fillStyle = `rgba(255,255,230,${.35 + .5 * b})`; ctx.fillRect(pr.x + 10, pr.y - 36, 2, 6); ctx.fillRect(pr.x + 8, pr.y - 34, 6, 2);
    return;
  }
  if (pr.mostrador){
    if (!MOSTRADOR_IMG.complete || !MOSTRADOR_IMG.width) return;
    const dw = MOSTRADOR_IMG.width * pr.esc, dh = MOSTRADOR_IMG.height * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(pr.x - dw / 2 + 4, pr.y - 6, dw - 8, 8);
    ctx.drawImage(MOSTRADOR_IMG, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  if (pr.mu) return dibujarMueble(pr);
  if (pr.casa){
    if (!casasListo) return;
    const [sx, sy, w, h] = CASAS[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .5, 10, 0, 0, TAU); ctx.fill();
    const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(CASAS_IMG, sx, sy, w, h, Math.round(pr.x - dw / 2), Math.round(pr.y - dh), Math.round(dw), Math.round(dh));
    ctx.imageSmoothingEnabled = suave;
    return;
  }
  if (pr.estatua){
    if (!estatuaLista) return;
    const dw = ESTATUA_IMG.width * pr.esc, dh = ESTATUA_IMG.height * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 4, dw * .5, 14, 0, 0, TAU); ctx.fill();
    ctx.drawImage(ESTATUA_IMG, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  if (pr.ciu){
    if (!ciuListo) return;
    const n = pr.anim ? pr.anim + (sinMovimiento ? 0 : Math.floor(performance.now() / 130) % pr.nf) : pr.spr;
    const [sx, sy, w, h] = CIU[n], dw = w * pr.esc, dh = h * pr.esc;
    if (pr.sombra !== false){
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .42, Math.max(3, dh * .06), 0, 0, TAU); ctx.fill();
    }
    ctx.drawImage(CIU_IMG, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  const atlas = pr.terr ? TERR : EDIF, img = pr.terr ? TERR_IMG : EDIF_IMG;
  if (pr.terr ? !terrListo : !edifListo) return;
  const [sx, sy, w, h] = atlas[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
  ctx.fillStyle = 'rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .46, Math.max(4, dh * .06), 0, 0, TAU); ctx.fill();
  ctx.drawImage(img, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
}

// =====================================================
//  TERRENOS Y NATURALEZA (catálogo pixelado)
// =====================================================
const TERR = {"t_cesped":[0,0,64,64],"t_tierra":[66,0,64,64],"t_piedra":[132,0,64,64],"t_arena":[198,0,64,64],"t_adoquin":[264,0,64,64],"t_madera":[330,0,64,64],"t_tierrahierba":[396,0,64,64],"t_nieve":[462,0,64,64],"t_muro":[528,0,64,64],"t_acera":[594,0,64,64],"arbolg":[660,0,94,105],"pino":[0,107,84,101],"flores":[86,107,88,68],"pasto":[176,107,90,75],"roca":[268,107,107,83],"tronco":[377,107,100,64],"cactus":[479,107,76,97],"fogata":[557,107,119,99]};
const TERR_IMG = new Image();
let terrListo = false;
const PATRONES = {};
TERR_IMG.onload = () => {
  for (const n of Object.keys(TERR)){
    if (!n.startsWith('t_')) continue;
    const c = document.createElement('canvas'); c.width = c.height = T;
    const a = c.getContext('2d'), [sx, sy, w, h] = TERR[n];
    a.drawImage(TERR_IMG, sx, sy, w, h, 0, 0, T, T);
    PATRONES[n.slice(2)] = ctx.createPattern(c, 'repeat');
  }
  terrListo = true;
};
TERR_IMG.src = 'img/terr.png';
const patron = n => PATRONES[n] || null;
// texturas pintadas de césped y tierra (reemplazan a las del catálogo)
const TEX2 = {"cesped_viejo": [0, 0, 135, 84], "tierra2": [135, 0, 135, 84], "arena2": [270, 0, 135, 84], "lava": [405, 0, 135, 84], "roca": [540, 0, 135, 84], "tierraroja": [675, 0, 135, 84]};
const TEX2_IMG = new Image();
TEX2_IMG.onload = () => {
  const poner = () => {
    for (const n of Object.keys(TEX2)){
      const [sx, sy, w, h] = TEX2[n], c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(TEX2_IMG, sx, sy, w, h, 0, 0, w, h);
      PATRONES[n] = ctx.createPattern(c, 'repeat');
    }
  };
  if (terrListo) poner(); else TERR_IMG.addEventListener('load', () => setTimeout(poner, 0), { once:true });
};
TEX2_IMG.src = 'img/tex2.webp';
// césped de la ciudad
const CESPED_IMG = new Image();
CESPED_IMG.onload = () => {
  const poner = () => { PATRONES.cesped = ctx.createPattern(CESPED_IMG, 'repeat'); };
  if (terrListo) poner(); else TERR_IMG.addEventListener('load', () => setTimeout(poner, 5), { once:true });
};
CESPED_IMG.src = 'img/cesped.webp';

// =====================================================
//  CIUDAD MODERNA Y PORTALES ANIMADOS (sprites)
// =====================================================
const CIU = {"arbol_a":[0,0,93,111],"farola":[95,0,30,111],"arbol_b":[127,0,87,107],"farola2":[216,0,92,106],"otono_a":[310,0,86,105],"semaforo":[398,0,25,104],"fuente0":[425,0,105,102],"fuente1":[532,0,105,102],"fuente2":[639,0,105,102],"fuente3":[746,0,105,102],"fuente4":[853,0,105,102],"senal":[960,0,31,98],"arbol_c":[0,113,65,89],"arbol_m":[67,113,66,89],"arbol_d":[135,113,62,88],"otono_c":[199,113,52,83],"otono_b":[253,113,53,82],"parada":[308,113,88,64],"t_asfalto":[398,113,64,64],"t_asfalto2":[464,113,64,64],"t_alcant":[530,113,64,64],"t_linea_h":[596,113,64,64],"t_linea_v":[662,113,64,64],"t_doble_h":[728,113,64,64],"t_cebra":[794,113,64,64],"t_acera":[860,113,64,64],"t_ladrillo":[926,113,64,64],"t_rombo":[0,204,64,64],"t_losa":[66,204,64,64],"hidrante":[132,204,33,59],"papelera":[167,204,26,46],"buzon":[195,204,23,45],"jardinera2":[220,204,29,40],"bolardo":[251,204,17,40],"jardinera":[270,204,29,39],"banco":[301,204,59,37],"bicis":[362,204,71,36]};
const CIU_IMG = new Image();
let ciuListo = false;
const PAT_CIU = {};
CIU_IMG.onload = () => {
  for (const n of Object.keys(CIU)){
    if (!n.startsWith('t_')) continue;
    const c = document.createElement('canvas'); c.width = c.height = T;
    const a = c.getContext('2d'), [sx, sy, w, h] = CIU[n];
    a.drawImage(CIU_IMG, sx, sy, w, h, 0, 0, T, T);
    PAT_CIU[n.slice(2)] = ctx.createPattern(c, 'repeat');
  }
  ciuListo = true;
};
CIU_IMG.src = 'img/ciu.webp';
const PORTAL_IMG = new Image();
let portalListo = false;
PORTAL_IMG.onload = () => portalListo = true;
PORTAL_IMG.src = 'img/portal.webp';
const ESTATUA_IMG = new Image();
let estatuaLista = false;
ESTATUA_IMG.onload = () => estatuaLista = true;
ESTATUA_IMG.src = 'img/estatua.webp';
// muebles de interior (posada y mercado) y suelo de madera
const MU = {"barriles": [0, 0, 137, 102], "cama": [139, 0, 121, 78], "alf_azul": [262, 0, 150, 78], "rug_rojo": [414, 0, 76, 77], "alf_verde": [492, 0, 73, 75], "oso": [567, 0, 76, 72], "cajas": [0, 104, 120, 69], "armaduras": [122, 104, 107, 67], "mesa": [231, 104, 73, 66], "sillon": [306, 104, 48, 61], "brasero": [356, 104, 37, 57], "sofa": [395, 104, 77, 56], "armero": [474, 104, 78, 56], "suelo": [554, 104, 56, 56], "estante_armas": [612, 104, 72, 49], "chimenea": [0, 175, 74, 48], "estante1": [76, 175, 74, 47], "estante2": [152, 175, 72, 47], "estante3": [226, 175, 145, 47]};
const MOSTRADOR_IMG = new Image();
MOSTRADOR_IMG.src = 'img/mostrador.webp';
const MU_IMG = new Image();
let muListo = false, PAT_SUELO = null;
MU_IMG.onload = () => {
  const [sx, sy, w, h] = MU.suelo, c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(MU_IMG, sx, sy, w, h, 0, 0, w, h);
  PAT_SUELO = ctx.createPattern(c, 'repeat'); muListo = true;
};
MU_IMG.src = 'img/mu.webp';
function dibujarMueble(pr){
  if (!muListo) return;
  const [sx, sy, w, h] = MU[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
  ctx.drawImage(MU_IMG, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
}
const PFW = 66, PFH = 122, PFN = 9; // cuadros del portal pixelado
// una fila por rango: E plata, D azul, C turquesa, B violeta, A dorado, S rojo
const COLOR_PORTAL = ['#c8d4e6', '#4fa3ff', '#5ee6d0', '#b05cff', '#ffb347', '#ff4a5c'];
function tileCiu(n, x, y){
  if (!ciuListo) return;
  const [sx, sy, w, h] = CIU['t_' + n];
  ctx.drawImage(CIU_IMG, sx, sy, w, h, x, y, T + .5, T + .5);
}
// suelo, tinte y objetos de cada tipo de cueva (E, D, C, B, A, S)
const TEXTURA_RANGO = [
  { suelo:'tierra2',    tinte:.18, objetos:['roca','tronco','pasto','flores'] },
  { suelo:'arena2',     tinte:.2,  objetos:['cactus','roca'] },
  { suelo:'nieve',      tinte:.5,  objetos:['pino','roca'] },
  { suelo:'lava',       tinte:.3,  objetos:['roca','fogata'] },
  { suelo:'roca',       tinte:.3,  objetos:['roca'] },
  { suelo:'tierraroja', tinte:.3,  objetos:['roca','fogata'] }
];

// =====================================================
//  MASCOTA (GATOS)
// =====================================================
// 4 gatos x 6 cuadros de caminar: [x, y, ancho, alto, anclaX, anclaY]
// Gatos jugables: vistas de frente (ab), espalda (ar) y lado (mirando a la IZQUIERDA en la hoja)
// cada cuadro: [x, y, ancho, alto, anclaX, anclaY]
const GATOS_DIR = [{"muerto":[[0,0,128,65,63.5,65]],"q_ab":[[139,196,63,94,26.2,94],[204,196,62,94,26.2,94]],"ab":[[268,196,62,94,34.1,94],[332,196,64,94,36.1,94],[398,196,62,95,35.4,95],[462,196,63,94,35.1,94]],"q_ar":[[527,196,59,95,26.2,95],[588,196,59,95,26.2,95]],"ar":[[649,196,59,95,26.6,95],[710,196,59,95,26.8,95],[771,196,59,94,31.9,94],[832,196,59,95,31.9,95]],"q_lado":[[893,196,68,94,25.8,94],[963,196,68,94,25.9,94]],"lado":[[1033,196,69,95,25.7,95],[1104,196,69,95,26.3,95],[1175,196,69,95,25.9,95],[1246,196,70,95,26.7,95]],"q_de":[[1318,196,68,95,40.7,95],[0,294,62,95,19.8,95]],"de":[[64,294,70,95,42.4,95],[136,294,70,96,42.6,96],[208,294,69,95,42.1,95],[279,294,70,96,42.4,96]]},{"ab":[[130,0,76,96,32.0,96],[208,0,77,96,31.5,96],[287,0,77,96,31.5,96],[366,0,79,96,31.5,96]],"ar":[[447,0,86,96,48.5,96],[535,0,81,96,37.5,96],[618,0,75,96,35.0,96],[695,0,74,96,31.5,96],[771,0,73,96,32.0,96]],"lado":[[846,0,82,96,34.0,96],[930,0,82,96,32.0,96],[1014,0,84,96,33.0,96],[1100,0,85,96,36.5,96],[1187,0,80,96,35.5,96],[1269,0,80,96,35.0,96]],"de":[[0,98,86,96,49.5,96],[88,98,76,96,42.5,96],[166,98,87,96,50.0,96],[255,98,75,96,44.0,96],[332,98,77,96,43.5,96],[411,98,72,96,42.5,96]],"muerto":[[485,98,122,56,60.5,56]]},{"ab":[[609,98,95,96,36.5,96]],"ar":[[706,98,94,96,35.5,96]],"lado":[[802,98,92,96,32.5,96],[896,98,98,96,33.0,96],[996,98,93,96,34.0,96]]},{"ab":[[1091,98,73,96,30.5,96],[1166,98,72,96,28.0,96]],"ar":[[1240,98,70,96,28.0,96],[1312,98,66,96,36.5,96],[0,196,67,96,36.0,96]],"lado":[[69,196,68,96,25.0,96]]}];
const GATOS = null;
const GATOS_IMG = new Image();
let gatosListo = false;
GATOS_IMG.onload = () => gatosListo = true;
GATOS_IMG.src = 'img/gatos.png';
const TIPOS_GATO = ['Gato Carmesí', 'Gato Ejecutivo', 'Gato Calicó', 'Gato Misterioso'];
// Mascotas: 4 ratas con 4 direcciones (ar arriba, ab abajo, iz izquierda, de derecha) de 4 cuadros
// cada cuadro: [x, y, ancho, alto, anclaX, anclaY]
const RATAS_DIR = [{"ar":[[0,0,55,84,26.0,82],[57,0,56,84,26.5,82],[115,0,57,84,28.5,82],[174,0,53,84,25.5,82]],"ab":[[229,0,53,84,25.0,82],[284,0,56,84,27.0,82],[342,0,54,84,25.5,82],[398,0,52,84,26.0,82]],"iz":[[452,0,49,84,24.5,82],[503,0,49,84,24.0,82],[554,0,47,84,24.0,82],[603,0,42,84,19.5,82]],"de":[[647,0,51,84,21.5,82],[700,0,52,84,21.5,82],[754,0,51,84,22.0,82],[807,0,49,84,17.5,82]]},{"ar":[[858,0,53,84,24.5,82],[913,0,55,84,25.5,82],[970,0,52,84,25.5,82],[1024,0,52,84,26.0,82]],"ab":[[0,86,52,84,26.0,82],[54,86,54,84,25.5,82],[110,86,52,84,25.0,82],[164,86,51,84,25.5,82]],"iz":[[217,86,54,84,30.5,82],[273,86,51,84,30.5,82],[326,86,51,84,30.5,82],[379,86,48,84,31.0,82]],"de":[[429,86,46,84,18.0,82],[477,86,46,84,17.5,82],[525,86,47,84,21.0,82],[574,86,48,84,19.0,82]]},{"ar":[[624,86,54,84,24.5,82],[680,86,53,84,24.5,82],[735,86,58,84,27.5,82],[795,86,54,84,27.0,82]],"ab":[[851,86,54,84,25.5,82],[907,86,62,84,30.5,82],[971,86,56,84,27.5,82],[1029,86,55,84,27.5,82]],"iz":[[0,172,59,84,34.0,82],[61,172,57,84,33.0,82],[120,172,56,84,32.5,82],[178,172,53,84,30.0,82]],"de":[[233,172,59,84,23.0,82],[294,172,58,84,25.5,82],[354,172,58,84,27.5,82],[414,172,58,84,25.5,82]]},{"ar":[[474,172,55,84,25.5,82],[531,172,55,84,25.0,82],[588,172,55,84,26.0,81],[645,172,53,84,27.5,82]],"ab":[[700,172,52,84,25.0,82],[754,172,53,84,25.0,82],[809,172,53,84,26.0,82],[864,172,52,84,24.5,82]],"iz":[[918,172,55,84,29.0,81],[975,172,54,84,29.5,82],[1031,172,51,84,28.0,82],[0,258,51,84,26.5,82]],"de":[[53,258,55,84,21.5,82],[110,258,54,84,20.5,82],[166,258,53,84,23.5,82],[221,258,53,84,21.5,81]]}];
const RATAS_IMG = new Image();
let ratasListo = false;
RATAS_IMG.onload = () => ratasListo = true;
RATAS_IMG.src = 'img/ratas.png';
const TIPOS_RATA = ['Rata Mensajera', 'Rata Quesera', 'Rata Ejecutiva', 'Rata Misteriosa'];
const ALTO_GATO = 50; // altura de la mascota en el mundo
let M = null, gatoElegido = 0;

function toggleMascota(){
  if (!enJuego || pantallaActual) return;
  if (!PJ.mascota){ abrirElegirMascota(); return; }
  if (M){
    chispas(M.x, M.y - 15, '#b9a3ff', 18, 140);
    texto(M.x, M.y - 50, `${PJ.mascota.nombre} vuelve a las sombras`, '#b9a3ff', 13);
    M = null; PJ.mascotaActiva = false;
  } else invocarMascota(false);
  guardar();
}

function invocarMascota(silencio){
  M = { x:P.x - 34, y:P.y + 8, r:10, mov:false, flip:false };
  colisiones(M);
  PJ.mascotaActiva = true;
  if (!silencio){
    chispas(M.x, M.y - 15, '#b9a3ff', 26, 170);
    texto(M.x, M.y - 52, `¡${PJ.mascota.nombre}!`, '#f2c46d', 16);
  }
}

function dibujarGatoEn(c, tipo, atlas = null, img = GATOS_IMG){
  const a = c.getContext('2d'), [sx, sy, w, h] = atlas ? atlas[tipo * 6] : cuadroGato(tipo, 'ab', 0);
  a.clearRect(0, 0, c.width, c.height);
  const k = Math.min(c.width / w, c.height / h) * .95;
  a.drawImage(img, sx, sy, w, h, (c.width - w * k) / 2, (c.height - h * k) / 2, w * k, h * k);
}

function abrirElegirMascota(){
  $('mNombre').value = ''; $('mErr').textContent = '';
  const cont = $('gatosOpc'); cont.innerHTML = '';
  TIPOS_RATA.forEach((nombre, i) => {
    const b = document.createElement('button'); b.className = 'gato';
    b.setAttribute('aria-pressed', i === gatoElegido);
    const c = document.createElement('canvas'); c.width = 152; c.height = 152;
    b.append(c, document.createTextNode(nombre));
    b.onclick = () => { gatoElegido = i; cont.querySelectorAll('.gato').forEach(x => x.setAttribute('aria-pressed', x === b)); };
    cont.appendChild(b);
    const pintar = () => { const [sx, sy, w, h] = RATAS_DIR[i].ab[0], a = c.getContext('2d'), k = Math.min(c.width / w, c.height / h) * .9;
      a.clearRect(0, 0, c.width, c.height); a.drawImage(RATAS_IMG, sx, sy, w, h, (c.width - w * k) / 2, (c.height - h * k) / 2, w * k, h * k); };
    if (ratasListo) pintar(); else RATAS_IMG.addEventListener('load', pintar, { once:true });
  });
  pantalla('pMascota');
}
$('btnInvocarPet').onclick = () => {
  const n = $('mNombre').value.trim();
  if (n.length < 2){ $('mErr').textContent = 'Ponle un nombre de al menos 2 letras.'; return; }
  PJ.mascota = { tipo:gatoElegido, nombre:n };
  if (window.pintarIcoPet) pintarIcoPet();
  pantalla(null);
  invocarMascota(false);
  banner(`${n} se une a ti`, esTactil ? 'Toca la huella para invocarlo o guardarlo' : 'Pulsa G o toca la huella para invocarlo o guardarlo');
  guardar();
};

function updateMascota(dt){
  if (!M) return;
  const dx = P.x - M.x, dy = P.y - M.y, d = Math.hypot(dx, dy);
  if (d > 450){ M.x = P.x - 34; M.y = P.y + 8; colisiones(M); return; }
  M.mov = false;
  M.quieto = (M.quieto || 0) + dt;
  // mira a los lados de vez en cuando mientras espera despierto
  if (M.quieto > 2 && M.quieto < 6 && Math.random() < dt * .35) M.flip = !M.flip;
  // en reposo mira a la cámara y, de vez en cuando, hacia un lado
  if (!M.mov && M.quieto > .4) M.dir = (M.quieto > 2 && M.quieto < 6 && Math.sin(M.quieto * 1.7) > .55) ? 'lado' : 'abajo';
  if (d > 55){
    const v = Math.min(D.vel * 1.15, (d - 40) * 4);
    M.x += dx / d * v * dt; M.y += dy / d * v * dt;
    M.mov = v > 25;
    M.paso = (M.paso || 0) + v * dt;
    if (M.mov) M.quieto = 0;
    if (Math.abs(dx) > 6) M.flip = dx < 0;
    // dirección con margen para que no cambie de vista a cada rato
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ay > ax * 1.3) M.dir = dy < 0 ? 'arriba' : 'abajo';
    else if (ax > ay * .8) M.dir = 'lado';
    colisiones(M);
  }
}

// Dibuja al gato en cualquier canvas. Quieto: respira y mira a los lados; tras un rato se echa a dormir.
function pintarGato(c, tipo, x, pie, alto, t, mov, flip, quieto, atlas = GATOS, img = GATOS_IMG, cuadro = null){
  const f = mov ? Math.floor(t / 1000 * 10) % 6 : 0;
  const [sx, sy, w, h, ax, ay] = cuadro || atlas[tipo * 6 + f];
  const esc = alto / 84, dormido = !mov && quieto > 6;
  let kx = 1, ky = 1;
  if (!mov){
    const fase = Math.sin(t / (dormido ? 750 : 420));
    if (dormido){ ky = .86 + .025 * fase; kx = 1.07 - .012 * fase; }
    else { ky = 1 + .025 * fase; kx = 1 - .012 * fase; }
  }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, pie, alto * .29 * kx, alto * .1, 0, 0, TAU); c.fill();
  c.save(); c.translate(x, pie); c.scale(flip ? -kx : kx, ky);
  c.drawImage(img, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  c.restore();
  if (dormido){
    c.textAlign = 'left';
    for (let k = 0; k < 3; k++){
      const p = (t / 1000 * .55 + k / 3) % 1;
      c.globalAlpha = Math.sin(p * Math.PI);
      c.font = `700 ${Math.round(alto * (.16 + p * .12))}px Rajdhani, sans-serif`;
      c.fillStyle = '#c9b8ff';
      c.fillText('z', x + alto * .2 + p * alto * .3, pie - alto * .8 - p * alto * .55);
    }
    c.globalAlpha = 1;
  }
}

// Elige el cuadro de la rata: de lado, de frente o de espalda según hacia dónde camina
function cuadroRata(tipo, dir, mov, paso, izq){
  const clave = dir === 'arriba' ? 'ar' : dir === 'lado' ? (izq ? 'iz' : 'de') : 'ab';
  const set = RATAS_DIR[tipo][clave];
  return { img:RATAS_IMG, fr:set[mov ? Math.floor(paso / 14) % set.length : 0] };
}
function dibujarMascota(t){
  if (!ratasListo) return;
  const pie = M.y + 8;
  // la hoja ya trae izquierda y derecha: no hace falta reflejar
  const q = cuadroRata(PJ.mascota.tipo, M.dir || 'abajo', M.mov, M.paso || 0, M.flip);
  pintarGato(ctx, PJ.mascota.tipo, M.x, pie, ALTO_GATO, t, M.mov, false, M.quieto || 0, null, q.img, q.fr);
  ctx.font = '700 12px Rajdhani, sans-serif'; ctx.textAlign = 'center';
  ctx.fillStyle = '#000'; ctx.fillText(PJ.mascota.nombre, M.x + 1, pie - ALTO_GATO - 3);
  ctx.fillStyle = '#e9e4ff'; ctx.fillText(PJ.mascota.nombre, M.x, pie - ALTO_GATO - 4);
}

// =====================================================
//  DIBUJO: ESCENAS
// =====================================================
// Ilustración del atardecer en la ciudad para el inicio de sesión y los menús
const FONDO_MENU = new Image();
let fondoListo = false;
FONDO_MENU.onload = () => fondoListo = true;
FONDO_MENU.src = 'img/fondo-menu.jpg';
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
function dibujarMenuFondo(t){
  ctx.fillStyle = '#1a1440'; ctx.fillRect(0, 0, W, H);
  if (!fondoListo) return;
  // ajuste tipo "cover" con un acercamiento lento
  const iw = FONDO_MENU.width, ih = FONDO_MENU.height;
  const zoom = sinMovimiento ? 1.04 : 1.06 + .03 * Math.sin(t / 9000);
  const k = Math.max(W / iw, H / ih) * zoom;
  const dw = iw * k, dh = ih * k;
  const dx = (W - dw) / 2 + (sinMovimiento ? 0 : Math.sin(t / 13000) * W * .012);
  const dy = (H - dh) * .45;
  ctx.drawImage(FONDO_MENU, dx, dy, dw, dh);
}

function dibujarPortalViejo(x, y, color, t, esc = 1){
  ctx.save(); ctx.translate(x, y);
  const pulso = 1 + .05 * Math.sin(t / 300);
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 70 * esc);
  g.addColorStop(0, color + 'aa'); g.addColorStop(1, color + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 66 * esc, 78 * esc, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#05030a'; ctx.beginPath(); ctx.ellipse(0, 0, 26 * esc * pulso, 40 * esc * pulso, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  for (let k = 0; k < 3; k++){
    const a = t / 380 * (k % 2 ? -1 : 1) + k * 2;
    ctx.beginPath(); ctx.ellipse(0, 0, (28 - k * 7) * esc * pulso, (42 - k * 10) * esc * pulso, 0, a, a + 4.2); ctx.stroke();
  }
  ctx.restore();
}

// portal animado: fila = rango (0 E ... 5 S); (x, y) es el centro de la entrada
function dibujarPortal(x, y, fila, t, esc = 1){
  const col = COLOR_PORTAL[fila];
  if (!portalListo) return dibujarPortalViejo(x, y, col, t, esc);
  if (esc <= .02) return;
  const h = 150 * esc, w = h * PFW / PFH, dx = x - w / 2, dy = y + 40 * esc - h;
  // sombra y reflejo de color en el suelo
  ctx.fillStyle = 'rgba(4,2,10,.5)';
  ctx.beginPath(); ctx.ellipse(x, y + 38 * esc, 56 * esc, 15 * esc, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(x, y + 38 * esc, 4, x, y + 38 * esc, 80 * esc);
  g.addColorStop(0, col + '55'); g.addColorStop(1, col + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + 38 * esc, 80 * esc, 24 * esc, 0, 0, TAU); ctx.fill();
  const fr = sinMovimiento ? 0 : Math.floor(t / 130) % PFN;
  const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(PORTAL_IMG, fr * PFW, fila * PFH, PFW, PFH, Math.round(dx), Math.round(dy), Math.round(w), Math.round(h));
  ctx.imageSmoothingEnabled = suave;
}

function dibujarParedes(colorTope, colorCara, colorLinea, tintTope, tintCara){
  const x0 = Math.max(0, Math.floor(cam.x / T) - 1), x1 = Math.min(E.cols - 1, Math.floor((cam.x + W) / T) + 1);
  const y0 = Math.max(0, Math.floor(cam.y / T) - 1), y1 = Math.min(E.rows - 1, Math.floor((cam.y + H) / T) + 1);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){
    if (!E.solido[y * E.cols + x] || (E.mueble && E.mueble[y * E.cols + x])) continue;
    ctx.fillStyle = colorTope; ctx.fillRect(x * T, y * T, T + .5, T + .5);
    if (tintTope){ ctx.fillStyle = tintTope; ctx.fillRect(x * T, y * T, T + .5, T + .5); }
    if (y + 1 < E.rows && !E.solido[(y + 1) * E.cols + x]){
      ctx.fillStyle = colorCara; ctx.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      if (tintCara){ ctx.fillStyle = tintCara; ctx.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5); }
      if (colorLinea){ ctx.fillStyle = colorLinea; ctx.fillRect(x * T, y * T + T * .45, T + .5, 2); }
    }
  }
}

function pintarSueloCiudad(cx2, G){
  const pc = n => PAT_CIU[n] || null;
  const tile = (n, x, y) => { const [sx, sy, w, h] = CIU['t_' + n]; cx2.drawImage(CIU_IMG, sx, sy, w, h, x, y, T + .5, T + .5); };
  cx2.fillStyle = patron('cesped') || '#2f4a2c'; cx2.fillRect(0, 0, G.w, G.h);
  const zona = (n, c, r, w, h, fb) => { cx2.fillStyle = pc(n) || fb; cx2.fillRect(c * T, r * T, w * T, h * T); };
  // aceras a ambos lados de las dos avenidas
  for (const r of [7, 11, 19, 23]) zona('acera', 1, r, 38, 1, '#8a8478');
  // paseo peatonal norte-sur y plaza de losas
  zona('ladrillo', 18.5, 12, 3, 7, '#7a6a5a'); zona('ladrillo', 18.5, 24, 3, 5, '#7a6a5a');
  // la plaza queda entre las dos aceras: no las pisa
  const recortePlaza = () => { cx2.save(); cx2.beginPath(); cx2.rect(0, 12 * T, G.w, 7 * T); cx2.clip(); };
  recortePlaza();
  cx2.fillStyle = pc('losa') || '#8a8478'; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 212, 0, TAU); cx2.fill();
  cx2.fillStyle = pc('rombo') || '#99907f'; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 190, 0, TAU); cx2.fill();
  cx2.restore();
  // avenidas de asfalto con línea central, alcantarillas y pasos de cebra
  zona('asfalto', 1, 8, 38, 3, '#2a2a2e'); zona('asfalto', 1, 20, 38, 3, '#2a2a2e');
  if (ciuListo){
    for (let c = 1; c < 39; c++){
      if (c >= 18 && c <= 21) continue;
      tile('linea_h', c * T, 9 * T); tile('linea_h', c * T, 21 * T);
    }
    for (const [c, r] of [[6, 10], [33, 8], [9, 20], [30, 22]]) tile('alcant', c * T, r * T);
    for (let k = 0; k < 3; k++) for (const r of [8, 9, 10, 20, 21, 22]) tile('cebra', (18.5 + k) * T, r * T);
  }
  // bordillos
  for (const [y0, y1] of [[8, 11], [20, 23]]){
    cx2.fillStyle = 'rgba(205,200,188,.75)'; cx2.fillRect(T, y0 * T - 3, 38 * T, 3); cx2.fillRect(T, y1 * T, 38 * T, 3);
    cx2.fillStyle = 'rgba(0,0,0,.35)'; cx2.fillRect(T, y0 * T, 38 * T, 4); cx2.fillRect(T, y1 * T + 3, 38 * T, 3);
  }
  recortePlaza(); cx2.strokeStyle = 'rgba(205,200,188,.7)'; cx2.lineWidth = 4; cx2.beginPath(); cx2.arc(G.fuente.x, G.fuente.y, 212, 0, TAU); cx2.stroke(); cx2.restore();
  // tono nocturno para que luzcan las farolas
  cx2.fillStyle = 'rgba(12,10,35,.34)'; cx2.fillRect(0, 0, G.w, G.h);
  // muralla
  for (let y = 0; y < G.rows; y++) for (let x = 0; x < G.cols; x++){
    if (!G.solido[y * G.cols + x] || (x > 0 && y > 0 && x < G.cols - 1 && y < G.rows - 1)) continue;
    cx2.fillStyle = patron('muro') || '#1b1826'; cx2.fillRect(x * T, y * T, T + .5, T + .5);
    cx2.fillStyle = 'rgba(10,8,25,.6)'; cx2.fillRect(x * T, y * T, T + .5, T + .5);
    if (y + 1 < G.rows && !G.solido[(y + 1) * G.cols + x]){
      cx2.fillStyle = patron('muro') || '#47425e'; cx2.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      cx2.fillStyle = 'rgba(10,8,25,.25)'; cx2.fillRect(x * T, y * T + T * .45, T + .5, T * .55 + .5);
      cx2.fillStyle = 'rgba(0,0,0,.35)'; cx2.fillRect(x * T, y * T + T * .45, T + .5, 2);
    }
  }
  // charcos de luz bajo las farolas
  for (const f of G.farolas){
    const g = cx2.createRadialGradient(f.x, f.y, 4, f.x, f.y, 120);
    g.addColorStop(0, 'rgba(255,205,120,.28)'); g.addColorStop(1, 'rgba(255,205,120,0)');
    cx2.fillStyle = g; cx2.beginPath(); cx2.ellipse(f.x, f.y, 120, 80, 0, 0, TAU); cx2.fill();
  }
}

// el suelo de la ciudad no cambia: se pinta una sola vez en un lienzo aparte y luego solo se copia la parte visible
let cacheCiudad = null;
function dibujarCiudad(t){
  const G = E;
  const clave = [ciuListo, terrListo, PATRONES.cesped, PATRONES.muro];
  if (!cacheCiudad || cacheCiudad.G !== G || cacheCiudad.clave.some((v, k) => v !== clave[k])){
    const c = cacheCiudad && cacheCiudad.G === G ? cacheCiudad.c : document.createElement('canvas');
    c.width = G.w; c.height = G.h;
    const cx2 = c.getContext('2d');
    pintarSueloCiudad(cx2, G);
    cacheCiudad = { c, G, clave };
  }
  const sx = Math.max(0, Math.floor(cam.x) - 2), sy = Math.max(0, Math.floor(cam.y) - 2);
  const sw = Math.min(G.w - sx, Math.ceil(W) + 4), sh = Math.min(G.h - sy, Math.ceil(H) + 4);
  if (sw > 0 && sh > 0) ctx.drawImage(cacheCiudad.c, sx, sy, sw, sh, sx, sy, sw, sh);
}

// halo de las bombillas por encima de todo
function dibujarLucesCiudad(t){
  if (E.tipo !== 'ciudad') return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const parpadeo = 1;
  for (const f of E.farolas) for (const [dx, dy] of f.luces){
    const x = f.x + dx, y = f.y + dy;
    const g = ctx.createRadialGradient(x, y, 1, x, y, 34);
    g.addColorStop(0, `rgba(255,215,140,${.45 * parpadeo})`); g.addColorStop(1, 'rgba(255,215,140,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 34, y - 34, 68, 68);
  }
  ctx.restore();
}

function dibujarPortalCiudad(p, t){
  const R = RANGOS[p.rango], esc = Math.min(1, p.nace / .8);
  dibujarPortal(p.x, p.y, p.rango, t, esc);
  ctx.textAlign = 'center';
  ctx.font = '28px Marcellus, Georgia, serif';
  ctx.fillStyle = '#000'; ctx.fillText(R.l, p.x + 1, p.y - 117 * esc + 1);
  ctx.fillStyle = R.color; ctx.fillText(R.l, p.x, p.y - 117 * esc);
  ctx.font = '600 13px Rajdhani, sans-serif'; ctx.fillStyle = p.cierra < 30 ? '#ff8a9b' : '#e9e4ff';
  ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3;
  const txt = `Rango ${R.l}, se cierra en ${formatoTiempo(p.cierra)}`;
  ctx.strokeText(txt, p.x, p.y + 66); ctx.fillText(txt, p.x, p.y + 66);
}

// paredes interiores: madera con ventanas (posada) y piedra (mercado)
const PAR = {"madera": [0, 0, 110, 88], "piedra": [112, 0, 192, 31], "antorcha": [306, 0, 16, 22]};
const PAR_IMG = new Image();
let parListo = false;
PAR_IMG.onload = () => parListo = true;
PAR_IMG.src = 'img/par.webp';
function dibujarParedInterior(G, tipo){
  if (!parListo){ dibujarParedes('#24170e', patron('madera') || '#6b4a30', '#8a6440', null, 'rgba(40,18,5,.4)'); return; }
  const [base, filo] = tipo === 'piedra' ? ['#363b4f', '#8d97ad'] : ['#6e4a32', '#c29463'];
  // muros laterales e inferior con moldura
  const [sx, sy, w, h] = PAR[tipo], alto = 1.8 * T, k = alto / h, ancho = w * k;
  const tope = T - alto - 4 - T * .3;
  ctx.fillStyle = base;
  ctx.fillRect(0, tope, T, G.h - tope); ctx.fillRect(G.w - T, tope, T, G.h - tope); ctx.fillRect(0, G.h - T, G.w, T);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.fillRect(T, G.h - T + 4, G.w - 2 * T, 6);
  ctx.fillStyle = filo;
  ctx.fillRect(T - 4, tope + T * .3, 4, G.h - T + 4 - tope - T * .3); ctx.fillRect(G.w - T, tope + T * .3, 4, G.h - T + 4 - tope - T * .3);
  ctx.fillRect(T - 4, G.h - T, G.w - 2 * T + 8, 4);
  // pared del fondo, en tiras que se repiten
  const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  for (let x = T; x < G.w - T; x += ancho){
    const dw = Math.min(ancho, G.w - T - x);
    ctx.drawImage(PAR_IMG, sx, sy, dw / k, h, Math.round(x), Math.round(T - alto), Math.ceil(dw), Math.round(alto));
  }
  ctx.fillStyle = filo; ctx.fillRect(T - 4, T - alto - 4, G.w - 2 * T + 8, 4);
  ctx.fillStyle = base; ctx.fillRect(0, tope, G.w, T * .3);
  // sombra al pie de la pared
  const g = ctx.createLinearGradient(0, T, 0, T + 16); g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(T, T, G.w - 2 * T, 16);
  if (tipo === 'piedra'){
    const [ax, ay, aw, ah] = PAR.antorcha;
    for (const cx of [4 * T, 9.5 * T]) ctx.drawImage(PAR_IMG, ax, ay, aw, ah, cx - aw, T - alto * .78, aw * 2, ah * 2);
  }
  ctx.imageSmoothingEnabled = suave;
}
function dibujarSueloInterior(G){
  ctx.fillStyle = PAT_SUELO || patron('madera') || '#5a3d26'; ctx.fillRect(0, 0, G.w, G.h);
  ctx.fillStyle = 'rgba(40,20,5,.12)'; ctx.fillRect(0, 0, G.w, G.h);
  if (G.alfombras) G.alfombras.forEach(dibujarMueble);
}
function dibujarPuertaInterior(G){
  const yb = G.h - T;
  ctx.fillStyle = '#3a2214'; ctx.fillRect(G.puerta - T + 8, yb, 2 * T - 16, T);
  ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(G.puerta + 20, yb + 22, 3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6b1f2a'; ctx.fillRect(G.puerta - T + 10, yb - .45 * T, 2 * T - 20, 14);
}
function dibujarPosadaInt(t){
  const G = E;
  dibujarSueloInterior(G);
  dibujarParedInterior(G, 'madera');
  dibujarPuertaInterior(G);
}
function dibujarTiendaInt(t){
  const G = E;
  dibujarSueloInterior(G);
  dibujarParedInterior(G, 'piedra');
  dibujarPuertaInterior(G);
}

// =====================================================
//  NPC CON MISIONES (estilo WoW: ! amarillo, ? gris o amarillo)
// =====================================================
const NPC_SPR = {"comandante": [0, 0, 62, 84], "sabia": [64, 0, 58, 84], "panda": [124, 0, 64, 84], "vance": [190, 0, 52, 84], "aiko": [244, 0, 51, 84], "tendera": [297, 0, 61, 84], "herrero": [360, 0, 56, 84], "clienta": [418, 0, 57, 84], "cliente": [477, 0, 54, 84], "leon": [533, 0, 57, 84], "kenji": [592, 0, 56, 84], "bruno": [650, 0, 56, 84]};
const NPC_IMG = new Image();
let npcListo = false;
NPC_IMG.onload = () => npcListo = true;
NPC_IMG.src = 'img/npc.webp';
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
  const f = JSON.stringify(filas) + PJ.segOculto; if (f === firmaSeg) return; firmaSeg = f;
  const plegado = PJ.segOculto;
  $('seguimiento').innerHTML = filas.length ? `<b class="seg-cab"><span>Misiones (${filas.length})</span><button id="segTog" title="${plegado ? 'Mostrar' : 'Ocultar'}" aria-label="${plegado ? 'Mostrar misiones' : 'Ocultar misiones'}">${plegado ? '+' : '–'}</button></b>` + (plegado ? '' : filas.map(([id, t, p, m, ok, obj]) =>
    `<div class="seg-m ${ok ? 'ok' : ''}" data-segmis="${id}"><span class="seg-t">${t}</span><span class="seg-o">- ${obj.replace(/^(Trae|Elimina|Despeja) \d+ /, '')}: ${p}/${m}</span>${ok ? '<span class="seg-o ok">Listo para entregar</span>' : ''}</div>`).join('')) : '';
  const tg = $('segTog'); if (tg) tg.onclick = () => { PJ.segOculto = !PJ.segOculto; firmaSeg = ''; guardar(); actualizarSeguimiento(); };
  $('seguimiento').querySelectorAll('[data-segmis]').forEach(d => d.onclick = () => { misSel = d.dataset.segmis; abrirVentana('wMis'); });
}

// ---------- vecinos que pasean ----------
const CAM = {"eldrin": {"ab": [[0, 0, 67, 82, 32.8, 82], [69, 0, 70, 81, 33.8, 81], [141, 0, 70, 82, 33.2, 82], [213, 0, 70, 81, 33.6, 81]], "ar": [[285, 0, 66, 81, 32.2, 81], [353, 0, 70, 81, 35.5, 81], [425, 0, 69, 81, 34.6, 81], [496, 0, 69, 81, 34.3, 81]], "iz": [[567, 0, 54, 81, 31.6, 81], [623, 0, 62, 81, 32.4, 81], [687, 0, 57, 81, 30.7, 81], [746, 0, 57, 81, 31.0, 81]], "de": [[805, 0, 56, 83, 22.5, 83], [863, 0, 58, 84, 26.1, 84], [923, 0, 56, 83, 27.1, 83], [981, 0, 52, 83, 22.7, 83]]}, "ruarc": {"ab": [[1035, 0, 63, 84, 31.7, 84], [1100, 0, 63, 83, 31.8, 83], [1165, 0, 61, 83, 30.8, 83], [1228, 0, 61, 83, 30.9, 83]], "ar": [[1291, 0, 59, 81, 28.8, 81], [0, 86, 58, 81, 28.0, 81], [60, 86, 58, 81, 28.2, 81], [120, 86, 57, 80, 27.4, 80]], "iz": [[179, 86, 58, 80, 30.7, 80], [239, 86, 59, 80, 30.9, 80], [300, 86, 59, 80, 30.7, 80], [361, 86, 57, 80, 29.6, 80]], "de": [[420, 86, 58, 83, 27.5, 83], [480, 86, 58, 83, 27.5, 83], [540, 86, 58, 83, 27.5, 83], [600, 86, 57, 83, 26.9, 83]]}, "nalani": {"ab": [[659, 86, 52, 84, 27.8, 84], [713, 86, 53, 84, 28.4, 84], [768, 86, 52, 84, 27.9, 84], [822, 86, 52, 84, 27.7, 84]], "ar": [[876, 86, 50, 82, 23.1, 82], [928, 86, 51, 82, 23.6, 82], [981, 86, 50, 82, 23.3, 82], [1033, 86, 50, 82, 22.9, 82]], "iz": [[1085, 86, 44, 74, 24.1, 74], [1131, 86, 44, 74, 24.2, 74], [1177, 86, 43, 74, 23.8, 74], [1222, 86, 43, 74, 23.7, 74]], "de": [[1267, 86, 43, 74, 18.9, 74], [1312, 86, 42, 74, 18.7, 74], [1356, 86, 42, 74, 18.6, 74], [0, 172, 42, 74, 18.6, 74]]}, "calebe": {"ab": [[44, 172, 80, 84, 44.9, 84], [126, 172, 74, 84, 41.8, 84], [202, 172, 71, 84, 39.7, 84], [275, 172, 83, 83, 49.1, 83]], "ar": [[360, 172, 72, 82, 30.6, 82], [434, 172, 70, 82, 29.4, 82], [506, 172, 67, 81, 28.3, 81], [575, 172, 67, 82, 28.7, 82]], "iz": [[644, 172, 69, 81, 40.9, 81], [715, 172, 62, 80, 35.3, 80], [779, 172, 62, 81, 35.1, 81], [843, 172, 66, 80, 38.4, 80]], "de": [[911, 172, 65, 82, 25.7, 82], [978, 172, 63, 82, 26.3, 82], [1043, 172, 62, 82, 26.0, 82], [1107, 172, 63, 82, 26.2, 82]]}, "benja": {"ab": [[1172, 172, 41, 84, 21.2, 84], [1215, 172, 41, 84, 20.6, 84], [1258, 172, 42, 83, 20.6, 83], [1302, 172, 42, 83, 20.3, 83]], "ar": [[1346, 172, 40, 82, 19.2, 82], [0, 258, 40, 82, 19.8, 82], [42, 258, 41, 82, 20.5, 82], [85, 258, 40, 82, 20.0, 82]], "iz": [[127, 258, 40, 83, 21.4, 83], [169, 258, 39, 82, 20.6, 82], [210, 258, 39, 82, 20.9, 82], [251, 258, 39, 82, 20.6, 82]], "de": [[292, 258, 39, 82, 18.1, 82], [333, 258, 39, 81, 18.3, 81], [374, 258, 39, 82, 17.9, 82], [415, 258, 39, 81, 18.4, 81]]}, "claire": {"ab": [[456, 258, 68, 84, 39.5, 84], [526, 258, 65, 84, 37.4, 84], [593, 258, 75, 84, 45.0, 84], [670, 258, 68, 84, 39.7, 84]], "ar": [[740, 258, 69, 84, 29.2, 84], [811, 258, 58, 84, 26.9, 84], [871, 258, 76, 84, 27.9, 84], [949, 258, 69, 84, 29.1, 84]], "iz": [[1020, 258, 63, 77, 33.8, 77], [1085, 258, 50, 77, 23.9, 77], [1137, 258, 52, 77, 24.2, 77], [1191, 258, 62, 77, 33.1, 77]], "de": [[1255, 258, 61, 82, 27.9, 82], [1318, 258, 49, 82, 26.3, 82], [0, 344, 50, 82, 25.8, 82], [52, 344, 61, 82, 27.8, 82]]}};
const CAM_IMG = new Image();
let camListo = false;
CAM_IMG.onload = () => camListo = true;
CAM_IMG.src = 'img/cam.webp';
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
  const alto = 66;
  if (n.cam){
    if (!camListo) return;
    // cada dirección usa sus propios cuadros, anclados al centro del cuerpo y a los pies
    const lista = CAM[n.cam][n.dir || 'ab'];
    const f = n.mov ? lista[Math.floor(n.paso / 11) % lista.length] : lista[0];
    const [sx, sy, w, h, ax, ay] = f, k = alto / 84;
    const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(CAM_IMG, sx, sy, w, h, Math.round(n.x - ax * k), Math.round(pie - ay * k), Math.round(w * k), Math.round(h * k));
    ctx.imageSmoothingEnabled = suave;
  } else {
    if (!npcListo) return;
    const [sx, sy, w, h] = NPC_SPR[n.spr], k = alto / h, r = 0;
    ctx.drawImage(NPC_IMG, sx, sy, w, h, n.x - w * k / 2, pie - alto * (1 + r), w * k, alto * (1 + r));
  }
  // nombre y signo de misión
  const ny = pie - alto - 8;
  ctx.textAlign = 'center'; ctx.font = '700 13px Rajdhani, sans-serif';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.strokeText(n.nombre, n.x, ny);
  ctx.fillStyle = n.mision ? '#ffd76a' : '#9fe39a'; ctx.fillText(n.nombre, n.x, ny);
  const mk = marcaNPC(n);
  if (mk){
    const by = ny - 16 + (sinMovimiento ? 0 : Math.sin(t / 260) * 3);
    ctx.font = '900 30px Marcellus, Georgia, serif';
    ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a00'; ctx.strokeText(mk.c, n.x, by);
    ctx.fillStyle = mk.col; ctx.fillText(mk.c, n.x, by);
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
  dibujarPortal(E.salida.x, E.salida.y, 3, t, .7);
  if (E.portalFinal) dibujarPortal(E.portalFinal.x, E.portalFinal.y, 4, t, .85);
}

// =====================================================
//  DIBUJO PRINCIPAL
// =====================================================
function draw(t){
  if (!enJuego){ dibujarMenuFondo(t); return; }
  ctx.fillStyle = '#07050d'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  const px1 = v => Math.round(v * DPR) / DPR;
  ctx.translate(px1(-cam.x + (Math.random() - .5) * shake), px1(-cam.y + (Math.random() - .5) * shake));

  if (E.tipo === 'ciudad') dibujarCiudad(t);
  else if (E.tipo === 'posada') dibujarPosadaInt(t);
  else if (E.tipo === 'tienda') dibujarTiendaInt(t);
  else if (E.tipo === 'asociacion') dibujarAsociacionInt(t);
  else dibujarMazmorra(t);

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
    else {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(o.x, o.y + 9, 9, 3, 0, 0, TAU); ctx.fill();
      dibujarIc3(o.t === 'cons' ? o.k : 'pocion', o.x, o.y - 1, 22);
    }
  }

  dibujarEfectos(true);

  // entidades ordenadas por profundidad
  const lista = [{ y:P.y, f:() => dibujarJugador(t) }];
  if (M) lista.push({ y:M.y, f:() => dibujarMascota(t) });
  if (E.tipo === 'ciudad') for (const p of portales) lista.push({ y:p.y + 40, f:() => dibujarPortalCiudad(p, t) });
  if (E.props) for (const pr of E.props){ if (pr.x > cam.x - 200 && pr.x < cam.x + W + 200 && pr.y > cam.y - 40 && pr.y < cam.y + H + 300) lista.push({ y:pr.y, f:() => dibujarProp(pr) }); }
  for (const s of soldados) lista.push({ y:s.y, f:() => dibujarSoldado(s, t) });
  if (E.npcs) for (const n of E.npcs) lista.push({ y:n.y, f:() => (n.spr || n.cam) ? dibujarNPCSprite(n, t) : dibujarNPC(n.x, n.y, n.ropa, n.pelo, t) });
  const ahora = performance.now();
  cadaveres = cadaveres.filter(c => ahora - c.t0 < 1100);
  if (E.tipo === 'mazmorra') for (const c of cadaveres) lista.push({ y:c.pie - 30, f:() => dibujarCadaver(c) });
  for (const e of enemigos){
    if (e.x < cam.x - 80 || e.x > cam.x + W + 80 || e.y < cam.y - 80 || e.y > cam.y + H + 80) continue;
    lista.push({ y:e.y, f:() => dibujarEnemigo(e) });
  }
  lista.sort((a, b) => a.y - b.y).forEach(o => o.f());
  dibujarLucesCiudad(t);
  if (E.etiquetas){
    ctx.font = '600 15px Marcellus, Georgia, serif'; ctx.textAlign = 'center';
    for (const et of E.etiquetas){ ctx.fillStyle = '#000'; ctx.fillText(et.txt, et.x + 1, et.y + 1); ctx.fillStyle = '#e9e4ff'; ctx.fillText(et.txt, et.x, et.y); }
  }

  for (const p of proysE){ ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ff4f8b'; ctx.lineWidth = 2; ctx.stroke(); }
  for (const p of proys){
    if (spriteListo && p.spr){
      const a = Math.atan2(p.vy, p.vx);
      ctx.globalAlpha = Math.min(1, p.vida * 4);
      dibujarEfecto(p.spr, p.x, p.y - (p.alt || 0), p.esc || .5, a, Math.cos(a) < 0);
      ctx.globalAlpha = 1; continue;
    }
    if (spriteListo && p.bola){
      const esc = .75 + .08 * Math.sin(t / 80) + (p.vida < .3 ? (.3 - p.vida) * 2 : 0);
      ctx.globalAlpha = Math.min(1, p.vida * 3); dibujarFrame('bola', p.x, p.y - p.alt, esc, false, t / 250); ctx.globalAlpha = 1; continue;
    }
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
  }

  dibujarEfectos(false);
  for (const p of particulas){ ctx.globalAlpha = Math.max(0, p.vida / p.max); ctx.fillStyle = p.color; ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  for (const tx of textos){
    ctx.globalAlpha = Math.min(1, tx.vida * 2); ctx.font = `700 ${tx.size}px Rajdhani, sans-serif`;
    ctx.fillStyle = '#000'; ctx.fillText(tx.txt, tx.x + 1, tx.y + 1);
    ctx.fillStyle = tx.color; ctx.fillText(tx.txt, tx.x, tx.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // iluminación
  const sx = P.x - cam.x, sy = P.y - 20 - cam.y;
  if (E.tipo === 'mazmorra'){
    const g = ctx.createRadialGradient(sx, sy, 120, sx, sy, Math.max(360, Math.min(W, H) * .75));
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.88)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else if (esInterior()){
    const g = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(255,160,60,.06)'); g.addColorStop(1, 'rgba(20,8,0,.55)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  dibujarMinimapa();

  if (sticks.mov){
    const s = sticks.mov; let dx = s.x - s.ox, dy = s.y - s.oy; const d = Math.hypot(dx, dy);
    if (d > 55){ dx = dx / d * 55; dy = dy / d * 55; }
    ctx.strokeStyle = 'rgba(233,228,255,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.ox, s.oy, 55, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(123,77,255,.5)'; ctx.beginPath(); ctx.arc(s.ox + dx, s.oy + dy, 24, 0, TAU); ctx.fill();
  }
}

// =====================================================
//  MONSTRUOS (sprites animados)
// =====================================================
const MON = {"cuadros": [[0, 0, 73, 61], [75, 0, 72, 60], [149, 0, 70, 59], [221, 0, 73, 60], [296, 0, 87, 52], [385, 0, 70, 65], [457, 0, 62, 52], [521, 0, 66, 34], [589, 0, 95, 62], [686, 0, 95, 61], [783, 0, 86, 61], [871, 0, 86, 61], [0, 67, 70, 59], [72, 67, 118, 66], [192, 67, 82, 65], [276, 67, 102, 39], [380, 67, 21, 21], [403, 67, 19, 23], [424, 67, 21, 21], [447, 67, 23, 19], [472, 67, 35, 29], [509, 67, 31, 25], [542, 67, 36, 23], [580, 67, 28, 22], [610, 67, 47, 23], [659, 67, 44, 24], [705, 67, 62, 32], [769, 67, 66, 32], [837, 67, 61, 33], [900, 67, 56, 33], [958, 67, 58, 32], [0, 135, 58, 32], [60, 135, 58, 32], [120, 135, 63, 32], [185, 135, 60, 33], [247, 135, 57, 46], [306, 135, 65, 52], [373, 135, 62, 38], [437, 135, 68, 32], [507, 135, 71, 33], [580, 135, 52, 33], [634, 135, 44, 37], [680, 135, 42, 35], [724, 135, 41, 42], [767, 135, 41, 45], [810, 135, 46, 38], [858, 135, 46, 37], [0, 189, 182, 118], [184, 189, 55, 53], [241, 189, 58, 53], [301, 189, 54, 52], [357, 189, 58, 52], [417, 189, 58, 54], [477, 189, 59, 52], [538, 189, 60, 49], [600, 189, 61, 48], [663, 189, 56, 54], [721, 189, 57, 55], [780, 189, 57, 56], [839, 189, 58, 55], [899, 189, 57, 55], [958, 189, 59, 55], [0, 309, 60, 55], [62, 309, 58, 54], [122, 309, 125, 93]], "tipos": {"mantis": {"mira": -1, "walk": [0, 1, 2, 3], "atk": [4, 5], "muere": [6, 7]}, "escorpion": {"mira": -1, "walk": [8, 9, 10, 11], "atk": [12, 13], "muere": [14, 15]}, "slime": {"mira": 0, "walk": [16, 17, 18, 19], "atk": [20, 21], "muere": [22, 23, 24, 25]}, "arana": {"mira": 1, "walk": [26, 27, 28, 29, 30, 31, 32, 33], "atk": [34, 35, 36, 37, 38, 39], "muere": [40, 41, 42, 43, 44, 45, 46]}, "arana_jefe": 47, "jabali": {"mira": 1, "idle": [48, 49, 50, 51], "walk": [56, 57, 58, 59, 60, 61, 62, 63], "atk": [52, 53, 54, 55], "muere": [55]}, "jabali_jefe": 64}};
const MON_IMG = new Image();
let monListo = false;
MON_IMG.onload = () => monListo = true;
MON_IMG.src = 'img/mon.webp';
const JEFE_SPR = ['slime', 'jabali', 'mantis', 'arana', 'arana', 'mantis'];
let cadaveres = [];
function sprDe(e){ return e.jefe ? JEFE_SPR[E.rango] : (ENEM[e.tipo] && ENEM[e.tipo].spr); }
function altoDe(e){
  const n = sprDe(e);
  if (e.jefe) return n === 'slime' ? 110 : n === 'jabali' ? 130 : 150;
  return ENEM[e.tipo].alto;
}
function pintarMonstruo(n, idx, x, pie, alto, ref, flip, flash, brillo){
  const [sx, sy, w, h] = MON.cuadros[idx], k = alto / ref;
  ctx.save(); ctx.translate(x, pie); if (flip) ctx.scale(-1, 1);
  if (brillo){ ctx.shadowColor = brillo; ctx.shadowBlur = 22; }
  ctx.drawImage(MON_IMG, sx, sy, w, h, -w * k / 2, -h * k, w * k, h * k);
  ctx.shadowBlur = 0;
  if (flash > 0){ ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, flash * 6) * .7; ctx.drawImage(MON_IMG, sx, sy, w, h, -w * k / 2, -h * k, w * k, h * k); }
  ctx.restore();
  return h * k;
}
function dibujarEnemigo(e){
  const n = sprDe(e);
  if (!monListo || !n) return dibujarEnemigoViejo(e);
  if (e.jefe && e.aviso > 0){
    ctx.strokeStyle = 'rgba(226,68,92,.45)'; ctx.lineWidth = e.r * 1.6;
    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.cdir) * 340, e.y + Math.sin(e.cdir) * 340); ctx.stroke();
  }
  const D = MON.tipos[n], t = performance.now();
  // hacia dónde mira según su movimiento
  if (e.ux === undefined){ e.ux = e.x; e.face = 1; }
  const dx = e.x - e.ux; if (Math.abs(dx) > .4) e.face = dx > 0 ? 1 : -1; e.ux = e.x;
  const mira = (e.jefe && n === 'jabali') ? -1 : D.mira;
  const flip = mira !== 0 && e.face !== mira;
  dibujarAviso(e);
  const pie = e.y + e.r * .8;
  ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 1.25, e.r * .45, 0, 0, TAU); ctx.fill();
  if (e.lento > 0){ ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(e.x, pie - 2, e.r * 1.4, e.r * .55, 0, 0, TAU); ctx.stroke(); }
  const cerca = Math.hypot(P.x - e.x, P.y - e.y) < e.r + P.r + 26;
  const lista = e.at ? D.atk : (D.idle && !e.mueve) ? D.idle : D.walk;
  const idx = (e.jefe && n === 'arana') ? MON.tipos.arana_jefe : (e.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : lista[(Math.floor(t / (cerca ? 160 : 130) + (e.hx || 0) * .01) % lista.length + lista.length) % lista.length];
  const ref = MON.cuadros[(e.jefe && n === 'arana') ? MON.tipos.arana_jefe : (e.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : D.walk[0]][3];
  const alto = pintarMonstruo(n, idx, e.x, pie, altoDe(e), ref, flip, e.flash, e.jefe ? e.color : null);
  if (!e.jefe && e.hp < e.maxHp){
    const bw = Math.max(26, e.r * 2.2), by = pie - alto - 8;
    ctx.fillStyle = '#2a2148'; ctx.fillRect(e.x - bw / 2, by, bw, 4);
    ctx.fillStyle = '#e2445c'; ctx.fillRect(e.x - bw / 2, by, bw * Math.max(0, e.hp / e.maxHp), 4);
  }
}
function dibujarCadaver(c){
  const D = MON.tipos[c.n], edad = (performance.now() - c.t0) / 1000;
  const lista = D.muere, idx = lista[Math.min(lista.length - 1, Math.floor(edad / .14))];
  ctx.globalAlpha = Math.max(0, 1 - Math.max(0, edad - .7) / .4);
  pintarMonstruo(c.n, idx, c.x, c.pie, c.alto, c.ref, c.flip, 0, null);
  ctx.globalAlpha = 1;
}

function dibujarEnemigoViejo(e){
  if (e.jefe && e.aviso > 0){
    ctx.strokeStyle = 'rgba(226,68,92,.45)'; ctx.lineWidth = e.r * 1.6;
    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.cdir) * 340, e.y + Math.sin(e.cdir) * 340); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(e.x + 3, e.y + e.r * .7, e.r, e.r * .45, 0, 0, TAU); ctx.fill();
  if (e.jefe){ ctx.shadowColor = e.color; ctx.shadowBlur = 25; }
  ctx.fillStyle = e.flash > 0 ? '#ffffff' : e.color;
  ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  if (e.lento > 0){ ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 2; ctx.stroke(); }
  const a = e.aggro ? Math.atan2(P.y - e.y, P.x - e.x) : Math.atan2((e.wy - e.y) || 1, e.wx - e.x || 0);
  const ox = Math.cos(a), oy = Math.sin(a), er = Math.max(2, e.r * .16);
  ctx.fillStyle = e.aggro ? '#ff5050' : '#20182e';
  ctx.beginPath();
  ctx.arc(e.x + ox * e.r * .5 - oy * e.r * .32, e.y + oy * e.r * .5 + ox * e.r * .32, er, 0, TAU);
  ctx.arc(e.x + ox * e.r * .5 + oy * e.r * .32, e.y + oy * e.r * .5 - ox * e.r * .32, er, 0, TAU);
  ctx.fill();
  if (!e.jefe && e.hp < e.maxHp){
    ctx.fillStyle = '#2a2148'; ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2, 4);
    ctx.fillStyle = '#e2445c'; ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2 * Math.max(0, e.hp / e.maxHp), 4);
  }
}

function dibujarMinimapa(){
  const bajo = H < 500; // teléfono acostado: minimapa más chico para dejar ver el mundo
  const s = bajo ? 92 : W < 600 ? 104 : 140, r = s / 2, cx = W - r - (bajo ? 10 : 16);
  const cy = INSET + (esTactil ? (bajo ? 74 : 84) : 30) + r;
  const nombre = E.tipo === 'mazmorra' ? `Rango ${E.R.l}: ${E.R.tema}` : E.nombre;
  const colorZona = E.tipo === 'mazmorra' ? E.R.color : '#ffd76a';
  // placa con el nombre de la zona
  ctx.font = '15px Marcellus, Georgia, serif'; ctx.textAlign = 'center';
  // la placa nunca se sale de la pantalla: se corre hacia dentro y, si hace falta, se achica la letra
  let fs = 15, tw = ctx.measureText(nombre).width + 24;
  const izq = W < 600 ? 244 : 8; // a la derecha del marco del jugador en pantallas chicas
  while (tw > W - izq - 8 && fs > 9){ fs--; ctx.font = `${fs}px Marcellus, Georgia, serif`; tw = ctx.measureText(nombre).width + 16; }
  const pxp = clamp(cx, izq + tw / 2, W - tw / 2 - 8);
  ctx.fillStyle = 'rgba(15,11,28,.85)'; ctx.fillRect(pxp - tw / 2, cy - r - 24, tw, 20);
  ctx.strokeStyle = '#b8933f'; ctx.lineWidth = 1; ctx.strokeRect(pxp - tw / 2 + .5, cy - r - 23.5, tw - 1, 19);
  ctx.fillStyle = colorZona; ctx.fillText(nombre, pxp, cy - r - 9);
  if (esInterior()) return;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.fillStyle = 'rgba(12,8,25,.95)'; ctx.fillRect(cx - r, cy - r, s, s);
  const pcx = P.x / T, pcy = P.y / T;
  if (E.tipo === 'ciudad'){
    const k = 3.2, mx = wx => cx + (wx / T - pcx) * k, my = wy => cy + (wy / T - pcy) * k;
    ctx.fillStyle = '#2c4a2c'; ctx.fillRect(mx(0), my(0), E.cols * k, E.rows * k);
    ctx.fillStyle = '#5a5470';
    ctx.fillRect(mx(T), my(8 * T), (E.cols - 2) * k, 3 * k); ctx.fillRect(mx(T), my(20 * T), (E.cols - 2) * k, 3 * k);
    ctx.fillStyle = '#8a8478'; ctx.fillRect(mx(18.5 * T), my(11 * T), 3 * k, 9 * k); ctx.fillRect(mx(18.5 * T), my(23 * T), 3 * k, 6 * k);
    ctx.beginPath(); ctx.arc(mx(E.fuente.x), my(E.fuente.y), 212 / T * k, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7a6a4a';
    for (const b of E.edificios) ctx.fillRect(mx(b.x * T), my(b.y * T), b.w * k, b.h * k);
    const po = E.edificios[0]; ctx.fillStyle = '#f2c46d'; ctx.fillRect(mx(po.x * T), my(po.y * T), po.w * k, po.h * k);
    ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(mx(E.fuente.x), my(E.fuente.y), 5, 0, TAU); ctx.fill();
    for (const n of E.npcs || []){ const mk = marcaNPC(n); if (!mk) continue; ctx.fillStyle = mk.col; ctx.font = '900 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(mk.c, mx(n.x), my(n.y) + 4); }
    for (const p of portales){ ctx.fillStyle = RANGOS[p.rango].color; ctx.beginPath(); ctx.arc(mx(p.x), my(p.y), 4.5, 0, TAU); ctx.fill(); }
  } else {
    const k = 4;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(E.mini, cx - pcx * k, cy - pcy * k, E.cols * k, E.rows * k);
    ctx.imageSmoothingEnabled = true;
    const punto = (wx, wy, c, rr) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + (wx / T - pcx) * k, cy + (wy / T - pcy) * k, rr, 0, TAU); ctx.fill(); };
    punto(E.salida.x, E.salida.y, '#9b7bff', 4);
    if (jefeVivo && E.jefeVisto) punto(jefeVivo.x, jefeVivo.y, '#e2445c', 5);
    if (E.portalFinal) punto(E.portalFinal.x, E.portalFinal.y, '#f2c46d', 5);
    for (const e of enemigos) if (!e.jefe && e.aggro) punto(e.x, e.y, '#ff6b6b', 2);
  }
  // flecha del jugador
  const a = Math.atan2(P.ldy, P.ldx);
  ctx.fillStyle = '#ffffff'; ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 7);
  ctx.lineTo(cx + Math.cos(a + 2.5) * 5, cy + Math.sin(a + 2.5) * 5);
  ctx.lineTo(cx + Math.cos(a - 2.5) * 5, cy + Math.sin(a - 2.5) * 5); ctx.fill();
  ctx.restore();
  // aro dorado
  ctx.strokeStyle = '#120c1a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#b8933f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, TAU); ctx.stroke();
  if (E.tipo === 'mazmorra'){
    ctx.font = '600 13px Rajdhani, sans-serif'; ctx.fillStyle = '#000'; ctx.fillText(E.despejada ? 'Despejada' : `${enemigos.length} monstruos`, cx + 1, cy + r + 19);
    ctx.fillStyle = '#c9c2e6'; ctx.fillText(E.despejada ? 'Despejada' : `${enemigos.length} monstruos`, cx, cy + r + 18);
  }
}

// =====================================================
//  BUCLE E INICIO
// =====================================================
let last = performance.now();
let firmaBolsa = '', firmaPj = '', tSeg = 0;
function loop(t){
  if (++tSeg % 15 === 0){ actualizarSeguimiento(); if (abierta('wMis') && enJuego) renderMisiones(); }
  const dt = Math.min((t - last) / 1000, .05); last = t;
  if (enJuego && !pantallaActual) update(dt);
  draw(t);
  if (enJuego && wTab === 'personaje' && abierta('wPj')) dibujarFigura(t);
  if (pantallaActual === 'pPersonajes' && pjSel){ const pj = cuenta() && cuenta().personajes.find(p => p.id === pjSel); if (pj) dibujarEscenaPj($('selCv'), pj.gato || 0, pj.clase, t, rotSel, pj.mascota); }
  else if (pantallaActual === 'pPersonajes') $('selCv').getContext('2d').clearRect(0, 0, 520, 560);
  if (pantallaActual === 'pCrear') dibujarEscenaPj($('crearCv'), gatoPj, claseElegida, t, rotSel, null);
  if (enJuego && PJ){
    const fb = PJ.bolsa.length + '|' + PJ.bolsa.map(o => o.id).join(',') + '|' + PJ.pociones + '|' + PJ.oro + '|' + JSON.stringify(PJ.mats);
    if (fb !== firmaBolsa){ firmaBolsa = fb; renderBolsa(); }
    const fp = [PJ.nivel, PJ.puntos, JSON.stringify(PJ.stats), Object.values(PJ.equipo).map(o => o ? o.id : '-').join(','), PJ.arma, wTab, !!M].join('|');
    if (fp !== firmaPj){ firmaPj = fp; renderPj(); }
    if (abierta('wPj') && wTab === 'personaje'){ const v = $('pdVida'), en = $('pdEn'); if (v) v.textContent = `${Math.ceil(P.hp)}/${D.maxHp}`; if (en) en.textContent = `${Math.floor(P.en)}/${D.maxEn}`; }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

(function iniciar(){
  const s = DB.sesion();
  if (s && DB.leer()[s]){ usuario = s; ir('pPersonajes'); }
  else pantalla('pAuth');
})();
