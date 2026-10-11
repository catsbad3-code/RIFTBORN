// =====================================================
//  UTILIDADES
// =====================================================
const VERSION = '1.15.0'; // también en index.html (estilos y scripts)
const $ = id => document.getElementById(id);
// ---------- todo el mundo en pixel art ----------
// cada hoja del mundo tiene una versión en pixel art (img/px) con cada dibujo reducido al tamaño con que se ve en pantalla.
// Al dibujar una parte de la hoja original se usa su versión pixelada; el mundo se dibuja sin suavizar.
const PX_HOJAS = {"img/terr.png":{"src":"img/px/terr.png","r":{"0,0":[2,2,48,48],"66,0":[52,2,48,48],"132,0":[102,2,48,48],"198,0":[152,2,48,48],"264,0":[202,2,48,48],"330,0":[252,2,48,48],"396,0":[302,2,48,48],"462,0":[352,2,48,48],"528,0":[402,2,48,48],"594,0":[452,2,48,48],"660,0":[502,2,70,79],"0,107":[574,2,46,56],"86,107":[622,2,40,31],"176,107":[664,2,40,34],"268,107":[706,2,45,35],"377,107":[753,2,42,27],"479,107":[797,2,32,41],"557,107":[831,2,50,42]}},"img/ciu.webp":{"src":"img/px/ciu.png","r":{"0,0":[2,2,93,111],"95,0":[97,2,22,83],"127,0":[121,2,87,107],"216,0":[210,2,74,85],"310,0":[286,2,86,105],"398,0":[374,2,18,73],"425,0":[394,2,79,76],"532,0":[475,2,79,76],"639,0":[556,2,79,76],"746,0":[637,2,79,76],"853,0":[718,2,79,76],"960,0":[799,2,23,74],"0,113":[824,2,65,89],"67,113":[891,2,66,89],"135,113":[959,2,62,88],"199,113":[2,115,52,83],"253,113":[56,115,53,82],"308,113":[111,115,88,64],"398,113":[201,115,48,48],"464,113":[251,115,48,48],"530,113":[301,115,49,49],"596,113":[352,115,49,49],"662,113":[403,115,48,48],"728,113":[453,115,48,48],"794,113":[503,115,49,49],"860,113":[554,115,48,48],"926,113":[604,115,48,48],"0,204":[654,115,48,48],"66,204":[704,115,48,48],"132,204":[754,115,20,37],"167,204":[776,115,18,32],"195,204":[796,115,17,34],"220,204":[815,115,22,30],"251,204":[839,115,10,24],"270,204":[851,115,22,29],"301,204":[875,115,59,37],"362,204":[936,115,57,29]}},"img/edif.png":{"src":"img/px/edif.png","r":{"0,0":[2,2,104,79],"170,0":[108,2,106,78],"343,0":[216,2,91,91],"492,0":[309,2,94,89],"645,0":[405,2,104,82],"0,149":[511,2,90,69],"147,149":[603,2,105,56],"319,149":[710,2,100,65],"483,149":[812,2,97,73],"642,149":[911,2,84,72],"0,268":[2,95,90,71],"147,268":[94,95,95,78],"302,268":[191,95,23,65],"341,268":[216,95,64,41],"447,268":[282,95,55,68],"537,268":[339,95,61,44],"638,268":[402,95,30,43],"707,268":[434,95,75,77]}},"img/mu.webp":{"src":"img/px/mu.png","r":{"0,0":[2,2,85,63],"139,0":[89,2,121,78],"262,0":[212,2,150,78],"414,0":[364,2,76,77],"492,0":[442,2,73,75],"567,0":[517,2,76,72],"0,104":[595,2,102,59],"122,104":[699,2,86,54],"231,104":[787,2,73,66],"306,104":[862,2,48,61],"356,104":[912,2,37,57],"395,104":[2,82,77,56],"474,104":[81,82,78,56],"554,104":[161,82,56,56],"612,104":[219,82,72,49],"0,175":[293,82,74,48],"76,175":[369,82,74,47],"152,175":[445,82,72,47],"226,175":[519,82,109,35]}},"img/spr.png":{"src":"img/px/spr.png","r":{"0,0":[2,2,49,105],"61,0":[53,2,49,105],"123,0":[104,2,49,105],"184,0":[155,2,43,105],"238,0":[200,2,44,84],"293,0":[246,2,40,85],"344,0":[288,2,31,85],"384,0":[321,2,30,85],"423,0":[353,2,60,91],"498,0":[415,2,58,91],"571,0":[475,2,61,91],"647,0":[538,2,67,90],"731,0":[607,2,67,90],"815,0":[676,2,72,88],"905,0":[750,2,59,86],"0,130":[811,2,75,96],"93,130":[888,2,71,94],"181,130":[961,2,52,91],"246,130":[2,109,69,86],"332,130":[73,109,47,83],"391,130":[122,109,40,82],"442,130":[164,109,86,16],"661,130":[252,109,60,70],"742,130":[314,109,34,28],"800,130":[350,109,86,32],"0,249":[438,109,86,62],"107,249":[526,109,174,82],"283,249":[702,109,71,95],"404,249":[775,109,75,88],"550,249":[852,109,158,141],"738,249":[2,252,37,27],"785,249":[41,252,86,81]}},"img/casas.webp":{"src":"img/px/casas.png","r":{"0,0":[2,2,158,189],"178,0":[162,2,186,155],"399,0":[350,2,126,117],"527,0":[478,2,82,115],"611,0":[562,2,106,118],"719,0":[670,2,122,117],"849,0":[794,2,117,137],"974,0":[913,2,100,88]}},"img/par.webp":{"src":"img/px/par.png","r":{"0,0":[2,2,110,88],"112,0":[114,2,192,31],"306,0":[308,2,16,22]}},"img/band.png":{"src":"img/px/band.png","r":{"0,0":[2,2,32,64],"100,0":[36,2,32,64],"200,0":[70,2,32,64],"300,0":[104,2,32,64],"400,0":[138,2,32,64],"500,0":[172,2,32,64],"600,0":[206,2,32,64],"700,0":[240,2,32,64]}},"img/portal.webp":{"src":"img/px/portal.png","r":{"0,0":[2,2,66,122],"66,0":[70,2,66,122],"132,0":[138,2,66,122],"198,0":[206,2,66,122],"264,0":[274,2,66,122],"330,0":[342,2,66,122],"396,0":[410,2,66,122],"462,0":[478,2,66,122],"528,0":[546,2,66,122],"0,122":[614,2,66,122],"66,122":[682,2,66,122],"132,122":[750,2,66,122],"198,122":[818,2,66,122],"264,122":[886,2,66,122],"330,122":[954,2,66,122],"396,122":[2,126,66,122],"462,122":[70,126,66,122],"528,122":[138,126,66,122],"0,244":[206,126,66,122],"66,244":[274,126,66,122],"132,244":[342,126,66,122],"198,244":[410,126,66,122],"264,244":[478,126,66,122],"330,244":[546,126,66,122],"396,244":[614,126,66,122],"462,244":[682,126,66,122],"528,244":[750,126,66,122],"0,366":[818,126,57,105],"66,366":[877,126,57,105],"132,366":[936,126,57,105],"198,366":[2,250,57,105],"264,366":[61,250,57,105],"330,366":[120,250,57,105],"396,366":[179,250,57,105],"462,366":[238,250,57,105],"528,366":[297,250,57,105],"0,488":[356,250,66,122],"66,488":[424,250,66,122],"132,488":[492,250,66,122],"198,488":[560,250,66,122],"264,488":[628,250,66,122],"330,488":[696,250,66,122],"396,488":[764,250,66,122],"462,488":[832,250,66,122],"528,488":[900,250,66,122],"0,610":[2,374,66,122],"66,610":[70,374,66,122],"132,610":[138,374,66,122],"198,610":[206,374,66,122],"264,610":[274,374,66,122],"330,610":[342,374,66,122],"396,610":[410,374,66,122],"462,610":[478,374,66,122],"528,610":[546,374,66,122]}},"img/estatua.webp":{"src":"img/px/estatua.png","r":{"0,0":[2,2,128,190]}},"img/mostrador.webp":{"src":"img/px/mostrador.png","r":{"0,0":[2,2,205,61]}},"img/tex2.webp":{"src":"img/px/tex2.png","r":{"0,0":[2,2,135,84],"135,0":[139,2,135,84],"270,0":[276,2,135,84],"405,0":[413,2,135,84],"540,0":[550,2,135,84],"675,0":[687,2,135,84]}}};
const PX_IMG = {};
let pxPend = Object.keys(PX_HOJAS).length;
for (const [orig, h] of Object.entries(PX_HOJAS)){
  const im = new Image();
  im.onload = () => { h.listo = true; if (--pxPend === 0) setTimeout(rehacerPatrones, 0); };
  im.src = h.src + '?v=' + VERSION; h.img = im; PX_IMG[orig] = h;
}
// los patrones de suelo se arman con las versiones pixeladas
function rehacerPatrones(){ if (typeof enJuego !== 'undefined' && enJuego && typeof construirBarra === 'function') construirBarra(); for (const im of [typeof TERR_IMG !== 'undefined' && TERR_IMG, typeof TEX2_IMG !== 'undefined' && TEX2_IMG, typeof CIU_IMG !== 'undefined' && CIU_IMG, typeof MU_IMG !== 'undefined' && MU_IMG]) if (im && im.complete && im.naturalWidth && im.onload) im.onload(); }
const pxDe = img => { if (!img || !img.src) return null; if (img.__px !== undefined) return img.__px; const m = img.src.match(/img\/[^?]+/); return img.__px = (m && PX_IMG[m[0]]) || null; };
{
  const dibujar = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...a){
    const h = pxDe(img);
    if (h && h.listo){
      if (a.length === 8){ const r = h.r[Math.round(a[0]) + ',' + Math.round(a[1])]; if (r) return dibujar.call(this, h.img, r[0], r[1], r[2], r[3], a[4], a[5], a[6], a[7]); }
      else { const r = h.r['0,0']; if (r){ const [dx, dy, dw = img.naturalWidth, dh = img.naturalHeight] = a; return dibujar.call(this, h.img, r[0], r[1], r[2], r[3], dx, dy, dw, dh); } }
    }
    return dibujar.call(this, img, ...a);
  };
}

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
    b.classList.toggle('oculto', !esTactil || !pcSoportada || esApp);
    b.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
    if (id === 'btnPantallaPausa') b.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  }
  setTimeout(resize, 100);
}
document.addEventListener('fullscreenchange', marcarPantallaCompleta);
document.addEventListener('webkitfullscreenchange', marcarPantallaCompleta);
// vibración corta al usar poderes en el teléfono (en PC no hace nada)
// ajustes solo del teléfono: tamaño de botones y ataque automático
const AJ_TEL = { tam:1, auto:false };
try { Object.assign(AJ_TEL, JSON.parse(localStorage.getItem('rb_tel') || '{}')); } catch (e) {}
const TAMANOS = ['Chicos', 'Normales', 'Grandes'];
function aplicarAjustesTel(){
  document.body.classList.toggle('bt-chico', esTactil && AJ_TEL.tam === 0);
  document.body.classList.toggle('bt-grande', esTactil && AJ_TEL.tam === 2);
  const t = $('btnTamTel'), a = $('btnAutoTel');
  if (t) t.textContent = 'Botones: ' + TAMANOS[AJ_TEL.tam];
  if (a) a.textContent = 'Ataque automático: ' + (AJ_TEL.auto ? 'Sí' : 'No');
  try { localStorage.setItem('rb_tel', JSON.stringify(AJ_TEL)); } catch (e) {}
}
const vibrar = p => { if (esTactil && navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };

// Las cuentas y el guardado están en auth/auth.js

// =====================================================
//  DATOS DEL JUEGO
// =====================================================
const CLASES = {
  guerrero: { nombre:'Guerrero del Vacío', color:'#e2443c', desc:'Resiste golpes y aplasta grupos enteros.',
    base:{ fue:14, agi:8, vit:14, int:6 },
    h1:{ n:'Tajo', d:'Corte en arco frente a ti.', cd:.45, ic:'⚔' },
    h2:{ n:'Golpe sísmico', d:'Onda que daña y empuja a todo a tu alrededor.', cd:4, coste:30, ic:'💥' } },
  sombra: { nombre:'Cazador de Sombras', color:'#5ad84a', desc:'Rápido, letal y difícil de atrapar.',
    base:{ fue:10, agi:16, vit:9, int:7 },
    h1:{ n:'Puñalada', d:'Golpes veloces con más crítico.', cd:.28, ic:'🗡' },
    h2:{ n:'Paso sombrío', d:'Te teletransportas atravesando y cortando enemigos.', cd:3, coste:25, ic:'🌑' } },
  mago: { nombre:'Mago de las Sombras', color:'#4f9aff', desc:'Canaliza las sombras y la magia oscura. Elegante y letal.',
    base:{ fue:6, agi:9, vit:9, int:16 },
    h1:{ n:'Lanzamiento de sombras', d:'Rayo de sombra que explota al impactar.', cd:.55, ic:'🌑' },
    h2:{ n:'Bola de sombra', d:'Vórtice que arrastra, daña y ralentiza a los enemigos.', cd:5, coste:35, ic:'🌀' } },
  sacerdote: { nombre:'Sacerdote de la Luz', color:'#ffe066', desc:'Sana sus heridas y las de su grupo, y castiga con luz sagrada.',
    base:{ fue:6, agi:8, vit:12, int:14 },
    h1:{ n:'Castigo', d:'Un rayo de luz sagrada que daña al impactar.', cd:.55, ic:'✝' },
    h2:{ n:'Luz sanadora', d:'Te cura a ti y a tu grupo un 22% de la vida y daña a los enemigos cercanos.', cd:6, coste:30, ic:'✨' } },
  arquero: { nombre:'Arquero Errante', color:'#ff9a3d', desc:'Ataca desde lejos con su arco y nunca deja que se le acerquen.',
    base:{ fue:8, agi:15, vit:10, int:7 },
    h1:{ n:'Disparo', d:'Una flecha rápida y precisa.', cd:.5, ic:'🏹' },
    h2:{ n:'Disparo múltiple', d:'Cinco flechas en abanico frente a ti.', cd:4, coste:30, ic:'🎯' } }
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
CLASES.guerrero.h1.spr = 'px:espada'; CLASES.guerrero.h2.spr = 'px:onda';
CLASES.sombra.h1.spr = 'px:daga';     CLASES.sombra.h2.spr = 'px:capa';
CLASES.mago.h1.spr = 'px:estrella';   CLASES.mago.h2.spr = 'px:espiral';
CLASES.sacerdote.h1.spr = 'px:cruz';  CLASES.sacerdote.h2.spr = 'px:halo';
CLASES.arquero.h1.spr = 'px:flecha';  CLASES.arquero.h2.spr = 'px:arco';

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
// Talentos de cada clase: 1 punto cada 2 niveles (desde el 3), hasta 3 rangos por talento
const TALENTOS = {
  guerrero: [
    { id:'piel',    n:'Piel de hierro',   d:'+6% de vida máxima por rango.',              ic:'domo',  f:(D, r) => D.maxHp = Math.round(D.maxHp * (1 + .06 * r)) },
    { id:'furia',   n:'Furia',            d:'+7% de daño físico por rango.',              ic:'corte', f:(D, r) => D.fis *= 1 + .07 * r },
    { id:'muralla', n:'Muralla',          d:'+3% de defensa por rango.',                  ic:'domo',  f:(D, r) => D.def = Math.min(.6, D.def + .03 * r) },
    { id:'vigor',   n:'Vigor',            d:'+35% de regeneración de vida por rango.',    ic:'pilar', f:(D, r) => D.regHp *= 1 + .35 * r },
    { id:'ritmo',   n:'Ritmo de batalla', d:'-6% de tiempo de recarga por rango.',        ic:'luna',  f:(D, r) => D.cdK *= 1 - .06 * r }
  ],
  sombra: [
    { id:'filo',    n:'Filo oculto',      d:'+3% de golpe crítico por rango.',            ic:'corte', f:(D, r) => D.crit = Math.min(.65, D.crit + .03 * r) },
    { id:'letal',   n:'Golpe letal',      d:'+7% de daño físico por rango.',              ic:'luna',  f:(D, r) => D.fis *= 1 + .07 * r },
    { id:'viento',  n:'Pies de viento',   d:'+4% de velocidad por rango.',                ic:'tp',    f:(D, r) => D.vel = Math.min(340, D.vel * (1 + .04 * r)) },
    { id:'evasion', n:'Evasión',          d:'+3% de defensa por rango.',                  ic:'tp',    f:(D, r) => D.def = Math.min(.6, D.def + .03 * r) },
    { id:'ritmo',   n:'Danza de sombras', d:'-6% de tiempo de recarga por rango.',        ic:'ola',   f:(D, r) => D.cdK *= 1 - .06 * r }
  ],
  mago: [
    { id:'mente',   n:'Mente vasta',      d:'+10% de energía máxima por rango.',          ic:'bola',  f:(D, r) => D.maxEn = Math.round(D.maxEn * (1 + .1 * r)) },
    { id:'arcano',  n:'Poder arcano',     d:'+7% de daño mágico por rango.',              ic:'rayo',  f:(D, r) => D.mag *= 1 + .07 * r },
    { id:'flujo',   n:'Flujo',            d:'+20% de regeneración de energía por rango.', ic:'lluvia',f:(D, r) => D.regEn *= 1 + .2 * r },
    { id:'escudo',  n:'Escudo de maná',   d:'+3% de defensa por rango.',                  ic:'domo',  f:(D, r) => D.def = Math.min(.6, D.def + .03 * r) },
    { id:'ritmo',   n:'Tiempo arcano',    d:'-6% de tiempo de recarga por rango.',        ic:'bola',  f:(D, r) => D.cdK *= 1 - .06 * r }
  ],
  sacerdote: [
    { id:'fe',      n:'Fe inquebrantable',d:'+6% de vida máxima por rango.',              ic:'px:halo',  f:(D, r) => D.maxHp = Math.round(D.maxHp * (1 + .06 * r)) },
    { id:'luz',     n:'Luz abrasadora',   d:'+7% de daño mágico por rango.',              ic:'px:sol',   f:(D, r) => D.mag *= 1 + .07 * r },
    { id:'calma',   n:'Calma interior',   d:'+20% de regeneración de energía por rango.', ic:'px:ala',   f:(D, r) => D.regEn *= 1 + .2 * r },
    { id:'gracia',  n:'Gracia',           d:'+35% de regeneración de vida por rango.',    ic:'px:cruz',  f:(D, r) => D.regHp *= 1 + .35 * r },
    { id:'ritmo',   n:'Plegaria veloz',   d:'-6% de tiempo de recarga por rango.',        ic:'px:escudo',f:(D, r) => D.cdK *= 1 - .06 * r }
  ],
  arquero: [
    { id:'punteria',n:'Puntería',         d:'+3% de golpe crítico por rango.',            ic:'px:diana', f:(D, r) => D.crit = Math.min(.65, D.crit + .03 * r) },
    { id:'tension', n:'Cuerda tensa',     d:'+7% de daño físico por rango.',              ic:'px:arco',  f:(D, r) => D.fis *= 1 + .07 * r },
    { id:'viento',  n:'Paso ligero',      d:'+4% de velocidad por rango.',                ic:'px:ala',   f:(D, r) => D.vel = Math.min(340, D.vel * (1 + .04 * r)) },
    { id:'cuero',   n:'Cuero curtido',    d:'+3% de defensa por rango.',                  ic:'px:escudo',f:(D, r) => D.def = Math.min(.6, D.def + .03 * r) },
    { id:'ritmo',   n:'Carcaj sin fondo', d:'-6% de tiempo de recarga por rango.',        ic:'px:lluviaf',f:(D, r) => D.cdK *= 1 - .06 * r }
  ]
};
const MAX_RANGO_TAL = 3;
const puntosTalento = pj => Math.max(0, Math.floor((pj.nivel - 1) / 2));
const talentosGastados = pj => Object.values(pj.talentos || {}).reduce((a, b) => a + b, 0);
function aplicarTalentos(D){
  for (const t of TALENTOS[PJ.clase] || []){ const r = (PJ.talentos || {})[t.id] || 0; if (r) t.f(D, r); }
}
function subirTalento(id){
  const t = (TALENTOS[PJ.clase] || []).find(x => x.id === id), r = PJ.talentos[id] || 0;
  if (!t || r >= MAX_RANGO_TAL || talentosGastados(PJ) >= puntosTalento(PJ)) return;
  PJ.talentos[id] = r + 1;
  const hpAntes = D.maxHp, enAntes = D.maxEn;
  derivar(); P.hp += Math.max(0, D.maxHp - hpAntes); P.en += Math.max(0, D.maxEn - enAntes);
  texto(P.x, P.y - 78, `${t.n} ${r + 1}/${MAX_RANGO_TAL}`, '#ffd100', 14);
  guardar(); renderLibro();
}
function reiniciarTalentos(){
  PJ.talentos = {}; derivar(); P.hp = Math.min(P.hp, D.maxHp); P.en = Math.min(P.en, D.maxEn); guardar(); renderLibro();
}
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
  arma:    { n:'Arma',    ic:'🗡️', bases:['Espada','Daga','Báculo','Grimorio','Arco'] }
};
const IZQ = ['cabeza','amuleto','pecho','manos'], DER = ['piernas','pies','anillo','arma'];
const SUFIJOS = ['del Musgo','de Arena','de Escarcha','de Magma','del Vacío','Carmesí'];
const NOMBRE_STAT = { fue:'Fuerza', agi:'Agilidad', vit:'Vitalidad', int:'Inteligencia' };
const DESC_STAT = { fue:'daño físico', agi:'velocidad y crítico', vit:'vida y defensa', int:'energía y magia' };
const TAM_BOLSA = 24;

let uidObj = 0;
// íconos de objetos de uso, cofre y minerales
const IC3 = {"libro": 0, "corazon": 1, "bomba": 2, "pergamino": 3, "pocion": 4, "farol": 5, "tetera": 6, "bolsa": 7, "seta": 8, "calavera": 9, "escudo": 10, "cofre": 11, "m_plata": 12, "m_cobre": 13, "m_hierro": 14, "m_estano": 15, "m_plomo": 16, "m_zinc": 17, "m_oro": 18, "p_gelatina": 19, "p_guadana": 20, "p_colmillo": 21, "p_pinza": 22, "p_seda": 23, "p_nucleo": 24, "queso": 25, "tinte": 26, "trofeo": 27, "emblema": 28, "caramelo": 29, "regalo": 30, "bombon": 31, "brasa": 32, "pescado": 33, "guiso": 34, "tarta": 35};
const IC3_URL = 'img/ic3.png?v=' + VERSION;
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
  queso:     { n:'Galleta de queso',        d:'Alimenta a tu mascota: llena su barriga y le da experiencia.', valor:150, usa:true, r:1 },
  tetera:    { n:'Té de la posada',         d:'Recupera la mitad de tu energía y te deja Descansado 2 minutos.', valor:300, usa:true, r:1 },
  farol:     { n:'Farol purificador',       d:'Elimina todos tus efectos negativos (veneno, lentitud...).', valor:600, usa:true, r:1 },
  pescado:   { n:'Pescado a la parrilla',   d:'Bien alimentado: +10% de daño durante 10 minutos.', valor:250, usa:true, r:1, comida:'com_atk' },
  guiso:     { n:'Guiso del chef',          d:'Bien alimentado: recibes un 10% menos de daño durante 10 minutos.', valor:250, usa:true, r:1, comida:'com_def' },
  tarta:     { n:'Tarta de nata',           d:'Bien alimentado: +10% de velocidad y +30% de energía recuperada durante 10 minutos.', valor:250, usa:true, r:1, comida:'com_vel' },
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
  else if (k === 'queso'){ if (!alimentarMascota()) return; }
  else if (A.comida){
    // solo un plato a la vez, como el «Bien alimentado» de WoW
    for (const c of ['com_atk', 'com_def', 'com_vel']) if (c !== A.comida) delete estados[c];
    ponerEfecto(A.comida, 600); sfx('comer');
  }
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
let ICONO_ARCO = null;
function icoObj(o){
  if (o.slot === 'arma' && o.nombre.startsWith('Arco')){
    if (!ICONO_ARCO){ const p = pixEquipo('Arco', 2), c = document.createElement('canvas'); c.width = c.height = 24; const a = c.getContext('2d');
      a.translate(12, 12); a.rotate(Math.PI / 4); a.drawImage(p.c, -p.w / 2, -p.h / 2); ICONO_ARCO = c.toDataURL(); }
    return `<span class="ico-obj" style="background-image:url(${ICONO_ARCO})"></span>`;
  }
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
  return asegurarDur(obj);
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
const PANTALLAS = ['pAuth','pMenu','pAyuda','pPersonajes','pCrear','pPausa','pPerfil','pTienda','pForja','pPortal','pMascota','pMuerte','pMision', 'pBuscador', 'pListo', 'pEmblemas', 'pEvento', 'pCasino', 'pDialogo', 'pPrologo', 'pVideos'];
const PANELES_JUEGO = ['pPausa','pPerfil','pTienda','pForja','pPortal','pMascota','pMision','pBuscador','pEmblemas','pEvento','pCasino'];
let pantallaActual = null, ayudaVolver = 'pAuth', perfilVolver = null;
function pantalla(id){
  pantallaActual = id;
  document.body.classList.toggle('con-son-flot', !enJuego && id !== 'pPrologo');   // en las cinemáticas taparía «Saltar»
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
  pj.devorar = pj.devorar || { esencias:{}, aprendidas:[], equipada:null };
  if (pj.prologo === undefined) pj.prologo = true;   // el prólogo solo lo viven los gatos recién creados
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
  pj.talentos = pj.talentos || {};
  barraDeClase(pj);
  if (!('5' in pj.barra)){ const h = BARRA_CLASE[pj.clase] || []; ['5', '6', '7', '8'].forEach((t, i) => pj.barra[t] = h[i] || null); }
  pj.logros = pj.logros || {}; pj.tintes = pj.tintes || [];
  pj.emblemas = pj.emblemas || 0;
  for (const o of [...Object.values(pj.equipo), ...pj.bolsa]) if (o) asegurarDur(o);
  if (pj.mascota){ pj.mascota.nivel = pj.mascota.nivel || 1; pj.mascota.xp = pj.mascota.xp || 0; if (pj.mascota.hambre === undefined) pj.mascota.hambre = 100; }
  return pj;
}

let pjSel = null, rotSel = 0, borrarArmado = false;
const LUGAR_PJ = { posada:'Posada del Eclipse', tienda:'Mercado de Lumeria', asociacion:'Asociación de Cazadores', casino:'Casino de Lumeria', ciudad:'Ciudad de Lumeria', mazmorra:'Ciudad de Lumeria' };
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

// tamaño de cada "píxel" del escenario de personajes
const PX_ESC = 4, ESC_PX = { cv:null, base:null };
// pedestal de piedra con baldosas, borde y sombra, píxel a píxel (se calcula una vez)
function pedestalPixel(lw, lh, py){
  const img = new ImageData(lw, lh), d = img.data, cx = lw / 2;
  py = Math.round(py);
  const rx = 41, ry = 10, alto = 6;
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const pon = (x, y, c, al = 255) => { if (x < 0 || y < 0 || x >= lw || y >= lh) return; const i = (y * lw + x) * 4, [r, g, bl] = typeof c === 'string' ? hex(c) : c; d[i] = r; d[i + 1] = g; d[i + 2] = bl; d[i + 3] = al; };
  const azar = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
  const TOP = ['#8a8070', '#7c7262', '#6e6555', '#958b7a'], LADO = ['#4e463b', '#443d33', '#3a342b'];
  const forma = new Uint8Array(lw * lh);
  // haz de luz en franjas
  for (let y = 0; y < py; y++){
    const k = y / py, ancho = 10 + k * 28, al = Math.floor(k * 4) * 9;
    if (!al) continue;
    for (let x = Math.floor(cx - ancho); x <= Math.ceil(cx + ancho); x++) pon(x, y, '#ffe6aa', al);
  }
  // sombra en el suelo
  for (let y = py; y < lh; y++) for (let x = 0; x < lw; x++){
    const dx = (x + .5 - cx) / (rx + 5), dy = (y + .5 - py - alto - 2) / (ry + 3);
    if (dx * dx + dy * dy <= 1) pon(x, y, '#000000', 110);
  }
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++){
    const dx = (x + .5 - cx) / rx, dyt = (y + .5 - py) / ry, rt = dx * dx + dyt * dyt;
    if (rt <= 1){
      // cara de arriba: anillos de baldosas
      const r = Math.sqrt(rt), anillo = Math.min(2, Math.floor(r * 3)), ang = (Math.atan2(dyt, dx) + Math.PI) / TAU;
      const n = 6 + anillo * 6, seg = ang * n, borde = Math.abs(seg - Math.round(seg)) * Math.PI * 2 * r * rx / n;
      const juntaAnillo = Math.abs(r * 3 - Math.round(r * 3)) < .09 && r > .2;
      let c = TOP[Math.floor(azar(anillo, Math.floor(seg)) * TOP.length)];
      if (r > .9) c = dyt < 0 ? '#a69c88' : '#7a705f';
      else if (juntaAnillo || (anillo > 0 && borde < .5)) c = '#4a4337';
      else if (dyt < -.3 && azar(x, y) < .12) c = '#a09683';
      pon(x, y, c); forma[y * lw + x] = 1;
    } else if (Math.abs(dx) <= 1 && y > py){
      // costado del pedestal: hileras de bloques
      const fondo = py + alto + ry * Math.sqrt(1 - dx * dx);
      if (y + .5 <= fondo){
        const fila = Math.floor((y - py - ry * Math.sqrt(1 - dx * dx)) / 2.5 + 8), col = Math.floor((x + (fila % 2) * 3) / 6);
        let c = LADO[Math.floor(azar(fila, col) * LADO.length)];
        if ((x + (fila % 2) * 3) % 6 === 0) c = '#2a251f';
        if (dx > .55) c = '#2f2a23'; else if (dx < -.6) c = '#5a5245';
        if (y + 1.5 > fondo) c = '#221e19';
        pon(x, y, c); forma[y * lw + x] = 1;
      }
    }
  }
  // contorno oscuro
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++){
    if (forma[y * lw + x]) continue;
    const vec = (xx, yy) => xx >= 0 && yy >= 0 && xx < lw && yy < lh && forma[yy * lw + xx];
    if (vec(x - 1, y) || vec(x + 1, y) || vec(x, y - 1) || vec(x, y + 1)) pon(x, y, '#120e0b');
  }
  return img;
}
// anillo de runas animado con el color de la clase, en píxeles
function runasPixel(b, cx, py, col, t){
  const brillo = .55 + .2 * Math.sin(t / 700);
  b.fillStyle = 'rgba(0,0,0,.45)';
  for (let y = -4; y <= 4; y++){ const m = Math.round(17 * Math.sqrt(Math.max(0, 1 - (y / 4.5) ** 2))); if (m) b.fillRect(Math.round(cx - m), py + y, m * 2, 1); }
  const anillo = (rx, ry, paso, dash, al) => {
    const n = Math.round(TAU * rx * 1.2), vistos = new Set();
    for (let i = 0; i < n; i++){
      const u = i / n, ang = u * TAU;
      if (dash && ((u * paso + t / 4000) % 1) > .45) continue;
      const x = Math.round(cx + Math.cos(ang) * rx - .5), y = Math.round(py + Math.sin(ang) * ry - .5), k = x + ',' + y;
      if (vistos.has(k)) continue; vistos.add(k);
      b.globalAlpha = al * .35; b.fillStyle = col; b.fillRect(x, y - 1, 1, 3);
      b.globalAlpha = al; b.fillRect(x, y, 1, 1);
    }
  };
  anillo(30, 7.5, 0, false, brillo);
  anillo(35, 9, 18, true, brillo * .8);
  b.globalAlpha = 1;
}

// escena 3/4 con pedestal al estilo de la pantalla de personajes de WoW
function dibujarEscenaPj(cv, gato, clase, t, rot, mascota, equipo = null, tinte = null){
  const a = cv.getContext('2d'), w = cv.width, h = cv.height, cx = w / 2, pie = h * .8;
  a.clearRect(0, 0, w, h);
  const col = CLASES[clase].color;
  // escenario en pixel art: se pinta en baja resolución y se amplía sin suavizar
  const lw = Math.round(w / PX_ESC), lh = Math.round(h / PX_ESC);
  if (!ESC_PX.cv || ESC_PX.cv.width !== lw || ESC_PX.cv.height !== lh){ ESC_PX.cv = document.createElement('canvas'); ESC_PX.cv.width = lw; ESC_PX.cv.height = lh; ESC_PX.base = null; }
  const b = ESC_PX.cv.getContext('2d');
  if (!ESC_PX.base) ESC_PX.base = pedestalPixel(lw, lh, pie / PX_ESC);
  b.clearRect(0, 0, lw, lh);
  b.putImageData(ESC_PX.base, 0, 0);
  runasPixel(b, lw / 2, Math.round(pie / PX_ESC), col, t);
  a.imageSmoothingEnabled = false;
  a.drawImage(ESC_PX.cv, 0, 0, w, h);
  a.imageSmoothingEnabled = true;
  if (!gatosListo) return;
  const dirs = ['ab', 'lado', 'ar', 'lado'], dir = dirs[rot];
  let flip = rot === 3;
  const g = GATOS_DIR[gato];
  let set = dir;
  if (rot === 3 && g.de && g.de.length){ set = 'de'; flip = false; }
  const [sx, sy, fw, fh, ax, ay] = cuadroGato(gato, g['q_' + set] && g['q_' + set].length ? 'q_' + set : set, Math.floor(t / 700)), esc = escGato(gato, (h * .62) / 96), r = Math.sin(t / 520), px = gatoPx(gato);
  a.save(); a.translate(cx, pie + 4);
  // pixel art: sin estirar (respira subiendo un píxel); los demás respiran escalando
  if (px){ a.imageSmoothingEnabled = false; a.translate(0, r > .6 ? -esc : 0); a.scale(flip ? -1 : 1, 1); }
  else a.scale((flip ? -1 : 1) * (1 - .01 * r), 1 + .018 * r);
  const frE = [sx, sy, fw, fh, ax, ay], setE = g['q_' + set] && g['q_' + set].length ? 'q_' + set : set;
  if (px) dibujarEquipoGato(a, imgGato(gato), frE, setE, esc, equipo, 'atras');
  a.drawImage(hojaGato(gato, tinte), sx, sy, fw, fh, -ax * esc, -ay * esc, fw * esc, fh * esc);
  if (px) dibujarEquipoGato(a, imgGato(gato), frE, setE, esc, equipo, 'frente');
  a.restore();
  if (mascota && ratasListo){
    const q = cuadroRata(mascota.tipo, 'abajo', false, 0, true);
    pintarGato(a, mascota.tipo, cx + 120, pie + 14, 86, t, false, false, 0, null, q.img, q.fr);
  }
}

let claseElegida = 'mago';
// el arma con la que empieza cada clase (y la de sus emblemas)
const ARMA_CLASE = { guerrero:'Espada', sombra:'Daga', mago:'Báculo', sacerdote:'Báculo', arquero:'Arco' };
let gatoPj = 0;
const ICONO_CLASE = { guerrero:'⚔️', sombra:'🗡️', mago:'🔮', sacerdote:'✨', arquero:'🏹' };
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
    const pintar = () => { const a = c.getContext('2d'), [sx, sy, w] = cuadroGato(i, GATOS_DIR[i].q_ab ? 'q_ab' : 'ab', 0), l = Math.min(w, Math.round(70 / (GATOS_DIR[i].k || 1))); a.imageSmoothingEnabled = !gatoPx(i); a.fillStyle = '#1d1638'; a.fillRect(0, 0, 64, 64); a.drawImage(imgGato(i), sx + (w - l) / 2, sy, l, l, 2, 4, 60, 60); };
    if (gatosListo) pintar(); else document.addEventListener('gatoslistos', pintar, { once:true });
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
  // en el teléfono en vertical no cabe la ficha: el nombre y la descripción van bajo los iconos
  $('claseNom').innerHTML = `<b style="color:${c.color}">${c.nombre}</b><br>${c.desc}`;
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
  pj.gato = gatoPj; pj.prologo = false;
  pj.equipo.arma = crearObjeto(0, 0, 'arma', 0);
  { const a = pj.equipo.arma, b = ARMA_CLASE[pj.clase]; a.nombre = b + a.nombre.slice(a.nombre.indexOf(' ')); }
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
  for (const it of Object.values(PJ.equipo)) if (it && !roto(it)){ for (const k in it.stats) s[k] += it.stats[k]; dmg += it.dmg || 0; }
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
  D.cdK = 1;
  ajustarRecurso(D);
  aplicarTalentos(D);
  D.poder = Math.max(D.fis, D.mag);
}

function empezar(id){
  PJ = migrar(cuenta().personajes.find(p => p.id === id));
  derivar();
  P = { x:0, y:0, mx:0, my:0, pose:{ n:'', t:0, dur:1 }, r:14, hp:D.maxHp, en:PJ.clase === 'guerrero' ? 0 : D.maxEn, combo:0, ang:Math.PI / 2, ldx:0, ldy:1,
        cd1:0, cd2:0, cdPoc:0, cdP:{}, inv:0, golpe:0 };
  const c = CLASES[PJ.clase];
  $('mAtk').innerHTML = '<canvas width="64" height="64"></canvas>'; $('mHab').innerHTML = '<canvas width="64" height="64"></canvas>';
  pintarIconoBoton($('mAtk').firstChild, c.h1.spr); pintarIconoBoton($('mHab').firstChild, c.h2.spr);
  enJuego = true; document.body.classList.add('jugando');
  portales = []; CIUDAD = crearCiudad();
  construirBarra();
  pantalla(null);
  M = null; prologo = null;
  if (!PJ.prologo) iniciarPrologo();
  else {
    irPosada('cama');
    if (PJ.mascota && PJ.mascotaActiva) invocarMascota(true);
    banner(`Bienvenido, cazador ${PJ.nombre}`, 'Despiertas en la posada');
  }
  pintarDurabilidad();
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
  enemigos = []; proys = []; proysE = []; botin = []; efectos = []; particulas = []; textos = []; soldados = []; zonas = []; huellas = []; clima = [];
  jefeVivo = null; campo = null; $('jefe').classList.add('oculto');
  if (P) P.objetivo = null;
  interCerca = null; $('btnInteractuar').classList.add('oculto');
}
const esInterior = () => E.tipo === 'posada' || E.tipo === 'tienda' || E.tipo === 'asociacion' || E.tipo === 'casino';
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
        else { const l = casillaLibreCerca(cx, cy); if (l){ o.x = l[0]; o.y = l[1]; } }
      }
    }
  }
  for (const b of E.obs){
    const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy), m = o.r + b.r;
    if (d < m && d > 0){ o.x = b.x + dx / d * m; o.y = b.y + dy / d * m; }
  }
}
// si algo queda con el centro dentro de una casilla sólida, sale a la casilla libre más cercana (antes se empujaba siempre hacia abajo)
function casillaLibreCerca(cx, cy){
  for (let r = 1; r <= 6; r++){
    let mejor = null, md = 1e9;
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++){
      if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== r || esSolido(x, y)) continue;
      const d = (x - cx) ** 2 + (y - cy) ** 2; if (d < md){ md = d; mejor = [x * T + T / 2, y * T + T / 2]; }
    }
    if (mejor) return mejor;
  }
  return null;
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
    const R = spr === 'casino' ? CAS.fachada : (spr.startsWith('c_') ? CASAS : EDIF)[spr];
    const w = R[2] * esc, h = R[3] * esc;
    G.props.push(spr === 'casino' ? { casino:true, x:cx, y:base, esc } : { spr, x:cx, y:base, esc, casa:spr.startsWith('c_') });
    const x0 = Math.round((cx - w / 2 + 10) / T), x1 = Math.round((cx + w / 2 - 10) / T);
    const y0 = Math.round((base - h * .55) / T), y1 = Math.round(base / T);
    setSolido(G, x0, y0, x1, y1);
    G.edificios.push({ x:x0, y:y0, w:x1 - x0, h:y1 - y0 });
    if (nombre) G.etiquetas.push({ txt:nombre, x:cx, y:base - h - 6 });
  };
  edificio('c_posada',     20 * T,   7 * T,  .85,  'Posada del Eclipse');
  edificio('c_asociacion', 7 * T,    7 * T,  .9,   'Asociación de Cazadores');
  edificio('c_mercado',    32.5 * T, 7 * T,  1.25, 'Mercado');
  edificio('casino',       26.4 * T, 7 * T,  1,    'Casino');
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
  G.farolas.push({ x:26.4 * T, y:7 * T, luces:[[-56, -148], [0, -150], [56, -148]] });  // letrero del casino
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
  G.inter.push({ x:26.4 * T, y:7 * T + 22, r:46, texto:'Entrar al casino', accion:irCasino });
  // habitantes: algunos dan misiones
  G.npcs = [
    { cam:'claire', nombre:'Comandante Claire', x:12, y:7.62, ruta:[9.6, 15], mision:'caza' },
    { cam:'ruarc', nombre:'Sabio Ruarc', x:17.3, y:13.1, ruta:[16.2, 18], mision:'portales' },
    { spr:'panda', nombre:'Bao, el mercader', x:29.6, y:7.62, mision:'rango' },
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
  disolverGrupo();
  E = CIUDAD; limpiarEscena(); modoCombate(false);
  if (desde === 'posada') colocar(20 * T, 9 * T);
  else if (desde === 'tienda') colocar(32.5 * T, 9 * T);
  else if (desde === 'asociacion') colocar(6.6 * T, 9 * T);
  else if (desde === 'casino') colocar(26.4 * T, 9 * T);
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
    { spr:'cliente', nombre:'Ren, el evaluador', x:11 * T, y:5.2 * T },
    { spr:'vance', nombre:'Vance, intendente de emblemas', x:3 * T, y:7 * T }
  ];
  G.obs.push({ x:3 * T, y:7 * T, r:14 });
  G.inter.push({ x:3 * T, y:7.9 * T, r:56, texto:'Intendente de emblemas', accion:() => abrirEmblemas() });
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

// =====================================================
//  CASINO: tres tragaperras y una ruleta
// =====================================================
const CAS = {"fachada":[0,0,184,168],"tragaperras":[186,0,48,76],"ruleta":[236,0,132,88],"alfombra":[370,0,48,48],"pared":[420,0,64,88],"sim0":[486,0,28,28],"sim1":[516,0,28,28],"sim2":[546,0,28,28],"sim3":[576,0,28,28],"sim4":[606,0,28,28],"sim5":[636,0,28,28],"fogon":[666,0,60,64],"mesa":[728,0,200,120],"sim6":[930,0,28,28],"sim7":[960,0,28,28]};
const CAS_IMG = new Image();
let casListo = false, PAT_ALFOMBRA = null;
CAS_IMG.onload = () => {
  const [sx, sy, w, h] = CAS.alfombra, c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(CAS_IMG, sx, sy, w, h, 0, 0, w, h);
  PAT_ALFOMBRA = ctx.createPattern(c, 'repeat'); casListo = true;
};
CAS_IMG.src = 'img/casino.png?v=' + VERSION;
function dibujarCas(n, x, y, esc = 1){
  if (!casListo) return;
  const [sx, sy, w, h] = CAS[n], dw = w * esc, dh = h * esc;
  ctx.drawImage(CAS_IMG, sx, sy, w, h, Math.round(x - dw / 2), Math.round(y - dh), Math.round(dw), Math.round(dh));
}
function crearCasino(){
  const G = nuevaGrilla(12, 9); G.tipo = 'casino'; G.nombre = 'Casino de Lumeria';
  setSolido(G, 0, 0, 12, 1); setSolido(G, 0, 8, 12, 9); setSolido(G, 0, 0, 1, 9); setSolido(G, 11, 0, 12, 9);
  G.props = [];
  // tres tragaperras contra la pared del fondo
  [2.5, 4.5, 6.5].forEach((c, i) => {
    setMueble(G, Math.floor(c), 1, Math.floor(c) + 1, 2);
    G.props.push({ cas:'tragaperras', x:c * T, y:2 * T + 6, luz:i });
    G.inter.push({ x:c * T, y:2.9 * T, r:40, texto:`Jugar: ${['tragaperras de 3 líneas', 'tragaperras de 5 líneas', 'tragaperras de 7 líneas'][i]}`, accion:() => abrirTragaperras(i) });
  });
  // la ruleta
  // la mesa bloquea toda su superficie (de 3.8 a 6.3 casillas): así el gato no puede quedar tapado detrás de ella
  setMueble(G, 6, 3, 11, 6);
  // se ordena por el borde de su zona sólida (6 casillas) y se dibuja 0.3 casillas más abajo:
  // así, si el gato está delante, siempre se pinta encima de la mesa
  G.props.push({ cas:'ruleta', x:8.3 * T, y:6 * T, dy:.3 * T });
  G.inter.push({ x:8.3 * T, y:6.75 * T, r:70, texto:'Jugar a la ruleta', accion:abrirRuleta });
  // Adolfo, el chef, con su fogón en la esquina
  setMueble(G, 9, 1, 11, 2);
  G.props.push({ cas:'fogon', x:9.9 * T, y:2 * T + 4 });
  G.npcs = [{ spr:'adolfo', nombre:'Adolfo, el chef', x:8.5 * T, y:2.55 * T }];
  G.obs.push({ x:8.5 * T, y:2.55 * T, r:14 });
  G.inter.push({ x:8.5 * T, y:3.3 * T, r:46, texto:'Hablar con Adolfo', accion:abrirAdolfo });
  G.puerta = 6 * T;
  G.inter.push({ x:6 * T, y:7.4 * T, r:50, texto:'Salir a la ciudad', accion:() => irCiudad('casino') });
  return G;
}
const CASINO = crearCasino();
function irCasino(){
  E = CASINO; limpiarEscena(); modoCombate(false);
  colocar(6 * T, 6.6 * T);
  chat('Entras en el Casino de Lumeria.', '#ffd76a');
}
function dibujarCasinoInt(t){
  const G = E;
  ctx.fillStyle = PAT_ALFOMBRA || '#6a1226'; ctx.fillRect(0, 0, G.w, G.h);
  // pared del fondo y muros
  const alto = 1.8 * T, tope = T - alto - 4 - T * .3;
  ctx.fillStyle = '#2a1236';
  ctx.fillRect(0, tope, T, G.h - tope); ctx.fillRect(G.w - T, tope, T, G.h - tope); ctx.fillRect(0, G.h - T, G.w, T);
  ctx.fillStyle = '#b8862f';
  ctx.fillRect(T - 4, T * .3 + tope, 4, G.h - T + 4 - tope - T * .3); ctx.fillRect(G.w - T, T * .3 + tope, 4, G.h - T + 4 - tope - T * .3);
  ctx.fillRect(T - 4, G.h - T, G.w - 2 * T + 8, 4);
  if (casListo){
    const [sx, sy, w, h] = CAS.pared, k = alto / h, ancho = w * k;
    for (let x = T; x < G.w - T; x += ancho){
      const dw = Math.min(ancho, G.w - T - x);
      ctx.drawImage(CAS_IMG, sx, sy, dw / k, h, Math.round(x), Math.round(T - alto), Math.ceil(dw), Math.round(alto));
    }
  }
  ctx.fillStyle = '#f2c14e'; ctx.fillRect(T - 4, T - alto - 4, G.w - 2 * T + 8, 4);
  ctx.fillStyle = '#2a1236'; ctx.fillRect(0, tope, G.w, T * .3);
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(T, T, G.w - 2 * T, 10);
  dibujarPuertaInterior(G);
}
function dibujarPropCasino(pr){
  const t = performance.now() / 1000;
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  if (pr.cas === 'tragaperras'){
    ctx.fillRect(pr.x - 20, pr.y - 6, 40, 8);
    dibujarCas('tragaperras', pr.x, pr.y);
    // la bombilla de arriba parpadea, cada máquina a su ritmo
    if (!sinMovimiento && Math.floor(t * 3 + pr.luz) % 2){ ctx.fillStyle = '#ff5a5a'; ctx.fillRect(pr.x - 6, pr.y - 74, 8, 4); }
    return;
  }
  if (pr.cas === 'fogon'){
    ctx.fillRect(pr.x - 28, pr.y - 6, 56, 8);
    dibujarCas('fogon', pr.x, pr.y);
    // vapor que sube de la olla
    if (!sinMovimiento) for (let k = 0; k < 3; k++){
      const u = (t * .6 + k / 3) % 1;
      ctx.fillStyle = `rgba(235,240,248,${.55 * (1 - u)})`;
      ctx.fillRect(Math.round(pr.x - 6 + k * 6 + Math.sin(u * 6 + k) * 3), Math.round(pr.y - 64 - u * 26), 4, 4);
    }
    return;
  }
  ctx.fillRect(pr.x - 94, pr.y + pr.dy - 6, 188, 8);
  dibujarCas('mesa', pr.x, pr.y + pr.dy);
}

// ---------- Adolfo, el chef ----------
const PLATOS_ADOLFO = [['pescado', 600], ['guiso', 600], ['tarta', 600]];
const FRASES_ADOLFO = [
  '¡Bienvenido! Nadie gana en la ruleta con el estómago vacío.',
  'Mi guiso lleva tres horas al fuego. El secreto es el cariño... y un poco de pimienta.',
  'Los cazadores que comen bien vuelven de las mazmorras. Los otros... no tanto.',
  '¿La tragaperras te ha dejado sin plata? Un pescado a la parrilla lo arregla todo.'
];
function abrirAdolfo(msg){
  npcHablando = null; casJuego++;
  const si = $('miSi'), no = $('miNo');
  $('miNombre').textContent = 'Adolfo, el chef';
  $('miTitulo').textContent = 'La cocina de Adolfo';
  $('miCuerpo').innerHTML = `<p>${msg || FRASES_ADOLFO[Math.random() * FRASES_ADOLFO.length | 0]}</p>
    ${PLATOS_ADOLFO.map(([k, precio]) => `<button class="btn chef-plato" data-plato="${k}" ${PJ.oro < precio ? 'disabled' : ''}>
      <span class="tienda-ic">${ic3(k)}<span><b>${APILABLES[k].n}</b><small>${APILABLES[k].d}</small></span></span><span>${dinero(precio)}</span></button>`).join('')}
    <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>
    <p class="tenue" style="margin-top:6px">Los platos van a tu bolsa. Cómelos con clic derecho cuando quieras; solo hace efecto uno a la vez.</p>`;
  $('miCuerpo').querySelectorAll('.chef-plato').forEach(b => b.onclick = () => {
    const [k, precio] = PLATOS_ADOLFO.find(x => x[0] === b.dataset.plato);
    if (PJ.oro < precio) return;
    PJ.oro -= precio; darApilable(k); guardar(); renderBolsa(); sfx('moneda');
    chat(`Compras [${APILABLES[k].n}] a Adolfo.`, '#ffe3a1');
    abrirAdolfo(`¡Aquí tienes tu ${APILABLES[k].n.toLowerCase()}! Buen provecho.`);
  });
  si.classList.add('oculto'); no.textContent = 'Adiós';
  pantalla('pMision');
}

// ---------- juegos (a casi toda la pantalla) ----------
const SIMBOLOS = ['Pez', 'Ovillo', 'Huella', 'Campana', 'Diamante', 'Siete', 'Comodín', 'Bonus'];
const COMODIN = 6, BONUS = 7;
const PESO_SIM = [12, 10, 8, 6, 4, 2, 2, 1];
const PESO_TOTAL = PESO_SIM.reduce((a, b) => a + b, 0);
let casJuego = 0;
function simboloAzar(){
  let r = Math.random() * PESO_TOTAL;
  for (let i = 0; i < PESO_SIM.length; i++){ r -= PESO_SIM[i]; if (r < 0) return i; }
  return 0;
}
// las tres máquinas: 3 rodillos y 3 líneas, 5 rodillos y 5 líneas, 5 rodillos y 7 líneas
// cada línea dice en qué fila (0 arriba, 1 medio, 2 abajo) cae en cada rodillo
const LINEAS_5 = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2], [0, 0, 1, 2, 2], [2, 2, 1, 0, 0]];
const MAQUINAS = [
  { n:'Tragaperras clásica', rod:3, lineas:[[1, 1, 1], [0, 0, 0], [2, 2, 2]], color:'#c0283c', giros:{ 3:5 } },
  { n:'Tragaperras de 5 líneas', rod:5, lineas:LINEAS_5.slice(0, 5), color:'#2a6ad0', giros:{ 3:8, 4:12, 5:20 } },
  { n:'Tragaperras de 7 líneas', rod:5, lineas:LINEAS_5, color:'#7a2ab0', giros:{ 3:8, 4:12, 5:20 } }
];
// premios por línea (veces la apuesta de la línea), como en una máquina real:
// - el Comodín sustituye a cualquier símbolo menos al Bonus, y también paga por sí solo
// - el Bonus paga en cualquier posición (veces la apuesta total) y da giros gratis, donde todo paga el doble
// - con 3 rodillos: tres iguales en la línea; dos peces desde la izquierda devuelven la apuesta
// - con 5 rodillos: 3, 4 o 5 iguales desde la izquierda; Diamante, Siete y Comodín pagan ya con 2
// (con estos números, cada máquina devuelve de media un 92-94 % de lo apostado)
const PAGO_3 = [5, 8, 12, 23, 52, 190, 380, 0];
const PAGO_5 = { 2:[0, 0, 0, 0, 1, 2, 4, 0], 3:[3, 4, 7, 11, 28, 70, 140, 0], 4:[9, 14, 23, 46, 115, 370, 750, 0], 5:[28, 55, 90, 185, 460, 1400, 3700, 0] };
const PAGO_BONUS3 = { 3:20 }, PAGO_BONUS5 = { 3:2, 4:10, 5:50 };
const MULT_GRATIS = 2;
function pagoSimbolo(M, s, n){
  if (M.rod === 3) return n === 3 ? PAGO_3[s] : (s === 0 && n === 2 ? 1 : 0);
  return (PAGO_5[n] && PAGO_5[n][s]) || 0;
}
// mira una línea de izquierda a derecha y devuelve su mejor premio (o null)
function evalLinea(M, seq){
  if (seq[0] === BONUS) return null;
  let kw = 0; while (kw < seq.length && seq[kw] === COMODIN) kw++;
  const base = kw < seq.length && seq[kw] !== BONUS ? seq[kw] : COMODIN;
  let k = kw;
  if (base !== COMODIN) while (k < seq.length && (seq[k] === base || seq[k] === COMODIN)) k++;
  const a = pagoSimbolo(M, base, k), b = kw ? pagoSimbolo(M, COMODIN, kw) : 0;
  if (!a && !b) return null;
  return a >= b ? { s:base, k, x:a } : { s:COMODIN, k:kw, x:b };
}
function premiosTirada(M, celdas){
  const lineas = [];
  M.lineas.forEach((L, li) => { const r = evalLinea(M, L.map((f, k) => celdas[k][f])); if (r) lineas.push({ li, ...r }); });
  let nb = 0; for (const rr of celdas) for (const s of rr) if (s === BONUS) nb++;
  const tb = M.rod === 3 ? PAGO_BONUS3 : PAGO_BONUS5, nbE = Math.min(nb, M.rod);
  return { lineas, bonus:{ n:nb, x:tb[nbE] || 0, giros:M.giros[nbE] || 0 } };
}
const COL_LINEA = ['#ff4a5c', '#ffd23f', '#4fd0ff', '#7dffa8', '#ff8af0', '#ffa04a', '#b08aff'];
const APUESTAS = [100, 1000, 10000];   // por línea: 1 de plata, 10 de plata, 1 de oro
const FICHAS = [100, 1000, 10000, 50000];
const COL_FICHA = { 100:['#ecece6', '#7a7a80'], 1000:['#d02838', '#fff'], 10000:['#2a6ad0', '#fff'], 50000:['#1c1c22', '#f2c14e'] };
const etMoneda = v => `<span class="dinero"><span class="mon">${v >= 10000 ? v / 10000 : v / 100}<i class="${v >= 10000 ? 'm-o' : 'm-p'}"></i></span></span>`;
const txtFicha = v => v >= 10000 ? `${v / 10000}o` : `${v / 100}p`;
// ventana de juego común: lienzo que ocupa casi toda la pantalla y una barra de botones abajo
function abrirMesa(titulo){
  npcHablando = null;
  $('casTitulo').textContent = titulo;
  pantalla('pCasino');
  const cv = $('casCan'), c = cv.getContext('2d');
  const medir = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(10, Math.round(r.width)), h = Math.max(10, Math.round(r.height));
    if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)){ cv.width = Math.round(w * d); cv.height = Math.round(h * d); }
    c.setTransform(d, 0, 0, d, 0, 0); c.imageSmoothingEnabled = false;
    return { w, h };
  };
  return { cv, c, medir, juego:++casJuego };
}
const mesaAbierta = j => casJuego === j && pantallaActual === 'pCasino';
function oroMesa(v){ $('casOro').innerHTML = dinero(v); }
function rRect(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ======== TRAGAPERRAS ========
let casApuesta = 100;
function abrirTragaperras(maq){
  const M = MAQUINAS[maq], { cv, c, medir, juego } = abrirMesa(M.n);
  const N = M.rod, NL = M.lineas.length, total = () => casApuesta * NL;
  // cada rodillo es una tira de 64 símbolos; se ven 3 filas
  const TIRA = 64, rod = Array.from({ length:N }, () => ({ tira:Array.from({ length:TIRA }, simboloAzar), pos:Math.random() * TIRA | 0, ini:0, fin:0, t0:0, dur:0, parado:true }));
  let girando = false, pendiente = 0, tirada = null, ganado = 0, palanca = 0, lyPalanca = null;
  let gratis = 0, enGratis = false, ganadoGratis = 0, auto = false, info = false, sigAuto = 0, contador = 0, monedas = [], grande = 0;
  let msg = 'Elige tu apuesta por línea y tira de la palanca.';
  $('casPie').innerHTML = `<div class="casp-grupo"><span>Apuesta por línea</span>${APUESTAS.map(v => `<button type="button" class="btn cas-ap" data-ap="${v}" aria-pressed="${v === casApuesta}">${etMoneda(v)}</button>`).join('')}
      <button type="button" class="btn cas-ap" id="tgMax">Máx.</button></div>
    <div class="casp-grupo"><span>${NL} líneas · Total</span><b id="tgTotal"></b></div>
    <div class="casp-grupo casp-acc"><button type="button" class="btn" id="tgInfo">Premios</button><button type="button" class="btn" id="tgAuto" aria-pressed="false">Auto</button>
      <button type="button" class="btn" data-cerrar-cas>Salir</button><button type="button" class="btn principal" id="casGirar">Girar</button></div>`;
  const pie = $('casPie');
  const refrescar = () => {
    $('tgTotal').innerHTML = gratis || enGratis ? `<span style="color:#ff8af0">Giros gratis: ${gratis}</span>` : dinero(total());
    $('casGirar').disabled = girando || (!gratis && PJ.oro < total());
    $('casGirar').textContent = gratis ? `Giro gratis (${gratis})` : 'Girar';
    $('tgAuto').setAttribute('aria-pressed', auto); $('tgAuto').textContent = auto ? 'Parar' : 'Auto';
    $('tgInfo').setAttribute('aria-pressed', info);
    pie.querySelectorAll('[data-ap]').forEach(b => { b.disabled = girando || gratis > 0; b.setAttribute('aria-pressed', +b.dataset.ap === casApuesta); });
    $('tgMax').disabled = girando || gratis > 0;
    oroMesa(PJ.oro - pendiente);
  };
  pie.querySelectorAll('[data-ap]').forEach(b => b.onclick = () => { if (girando || gratis) return; casApuesta = +b.dataset.ap; refrescar(); });
  $('tgMax').onclick = () => {
    if (girando || gratis) return;
    // la apuesta más alta que puedes pagar
    casApuesta = [...APUESTAS].reverse().find(v => v * NL <= PJ.oro) || APUESTAS[0]; refrescar();
  };
  $('tgInfo').onclick = () => { info = !info; refrescar(); };
  $('tgAuto').onclick = () => { auto = !auto; sigAuto = performance.now() + 300; refrescar(); };
  pie.querySelector('[data-cerrar-cas]').onclick = () => pantalla(null);
  const celdasAzar = () => Array.from({ length:N }, () => [simboloAzar(), simboloAzar(), simboloAzar()]);
  const premioTotal = (r, mult) => (r.lineas.reduce((a, l) => a + l.x, 0) * casApuesta + r.bonus.x * total()) * mult;
  function girar(){
    if (girando) return;
    const esGratis = gratis > 0;
    if (!esGratis && PJ.oro < total()){ auto = false; msg = 'No tienes dinero para esa apuesta.'; refrescar(); return; }
    info = false;
    if (esGratis){ gratis--; } else { enGratis = false; ganadoGratis = 0; }
    const celdas = celdasAzar(), mult = esGratis ? MULT_GRATIS : 1;
    tirada = premiosTirada(M, celdas); tirada.mult = mult; tirada.gratis = esGratis;
    ganado = premioTotal(tirada, mult);
    // se cobra y se paga al momento (cerrar la ventana no cambia nada); la cifra se actualiza al parar
    const coste = esGratis ? 0 : total();
    PJ.oro += ganado - coste; pendiente = ganado;
    PJ.casino = PJ.casino || { jugadas:0, ganado:0 }; PJ.casino.jugadas++; PJ.casino.ganado += ganado - coste;
    guardar();
    const ahora = performance.now();
    rod.forEach((R, k) => {
      R.ini = R.pos; R.fin = R.pos + 26 + k * 6; R.t0 = ahora; R.dur = 1000 + k * 330; R.parado = false;
      for (let f = 0; f < 3; f++) R.tira[(R.fin + 1 + f) % TIRA] = celdas[k][f];
    });
    // con dos Bonus ya a la vista, el último rodillo tarda más (como en las máquinas de verdad)
    const bonusAntes = celdas.slice(0, N - 1).flat().filter(s => s === BONUS).length;
    if (bonusAntes >= 2){ const R = rod[N - 1]; R.dur += 900; R.fin += 14; for (let f = 0; f < 3; f++) R.tira[(R.fin + 1 + f) % TIRA] = celdas[N - 1][f]; }
    girando = true; palanca = 1; contador = 0; grande = 0; msg = esGratis ? `Giro gratis · premios x${MULT_GRATIS}` : 'Girando…'; sfx('poder'); refrescar();
  }
  $('casGirar').onclick = girar;
  cv.onclick = e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (info){ info = false; refrescar(); return; }
    if (lyPalanca && Math.hypot(x - lyPalanca.x, y - lyPalanca.y) < lyPalanca.r) girar();
  };
  refrescar();
  // al cerrar la ventana con giros gratis pendientes, se juegan al momento para no perderlos
  function cerrarGratis(){
    if (!gratis) return;
    let suma = 0;
    while (gratis > 0){ gratis--; const r = premiosTirada(M, celdasAzar()); suma += premioTotal(r, MULT_GRATIS); gratis += r.bonus.giros; }
    PJ.oro += suma; PJ.casino.ganado += suma; guardar();
    chat(`Tus giros gratis pendientes se jugaron solos: ganas ${dineroTxt(suma)}.`, '#ffd23f');
  }

  function pintarInfo(w, h){
    const mov = w < 600, k = mov ? 1 : Math.min(1.5, w / 900);
    c.fillStyle = 'rgba(12,4,10,.97)'; c.fillRect(0, 0, w, h);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#ffe9a0'; c.font = `700 ${Math.round(20 * k)}px Marcellus, Georgia, serif`; c.fillText('Tabla de premios', w / 2, 22 * k);
    // símbolos y lo que paga cada uno (veces la apuesta por línea)
    // en el teléfono, una columna (los premios de 5 rodillos no caben en dos)
    const cols = mov ? 1 : 4, cw = Math.min(300 * k, (w - 20) / cols), x0 = (w - cw * cols) / 2, fh = Math.round((mov ? 40 : 46) * k), ic = Math.round((mov ? 30 : 34) * k);
    for (let s = 0; s < SIMBOLOS.length; s++){
      const x = x0 + (s % cols) * cw, y = 44 * k + Math.floor(s / cols) * fh;
      const [sx, sy, sw, sh] = CAS['sim' + s];
      if (casListo) c.drawImage(CAS_IMG, sx, sy, sw, sh, x + 4, y, ic, ic);
      let t;
      if (s === BONUS) t = M.rod === 3 ? `3: x${PAGO_BONUS3[3]} del total + ${M.giros[3]} giros` : `3·4·5: x${PAGO_BONUS5[3]}·${PAGO_BONUS5[4]}·${PAGO_BONUS5[5]} total + giros`;
      else if (M.rod === 3) t = `3: x${PAGO_3[s]}` + (s === 0 ? ' · 2: x1' : '');
      else t = [2, 3, 4, 5].filter(n => PAGO_5[n][s]).map(n => `${n}: x${PAGO_5[n][s]}`).join(' · ');
      c.textAlign = 'left';
      c.fillStyle = s >= COMODIN ? '#ffd23f' : '#d8d0e8'; c.font = `700 ${Math.round(12 * k)}px Rajdhani, sans-serif`;
      c.fillText(SIMBOLOS[s] + (s === COMODIN ? ' (sustituye a todos)' : s === BONUS ? ' (en cualquier lugar)' : ''), x + ic + 10, y + ic * .3);
      c.fillStyle = '#f4f0e6'; c.font = `600 ${Math.round(11.5 * k)}px Rajdhani, sans-serif`; c.fillText(t, x + ic + 10, y + ic * .75);
    }
    // dibujo de cada línea
    const yL = 44 * k + Math.ceil(SIMBOLOS.length / cols) * fh + 14 * k, ml = mov ? 4 : 7;
    const lw = Math.min(130 * k, (w - 20) / Math.min(NL, ml) - 10), ch = lw / N * .7;
    c.textAlign = 'center'; c.fillStyle = '#ffe9a0'; c.font = `700 ${Math.round(14 * k)}px Rajdhani, sans-serif`; c.fillText(`Las ${NL} líneas`, w / 2, yL);
    M.lineas.forEach((L, li) => {
      const x = (w - Math.min(NL, ml) * (lw + 10)) / 2 + (li % ml) * (lw + 10) + 5, y = yL + 14 * k + Math.floor(li / ml) * (ch * 3 + 26 * k);
      for (let r = 0; r < N; r++) for (let f = 0; f < 3; f++){ c.fillStyle = L[r] === f ? COL_LINEA[li] : '#3a2a3a'; c.fillRect(x + r * lw / N + 1, y + f * ch + 1, lw / N - 2, ch - 2); }
      c.fillStyle = COL_LINEA[li]; c.font = `700 ${Math.round(12 * k)}px Rajdhani, sans-serif`; c.fillText(`Línea ${li + 1}`, x + lw / 2, y + ch * 3 + 10 * k);
    });
    c.fillStyle = '#b8a8c8'; c.font = `600 ${Math.round(12 * k)}px Rajdhani, sans-serif`;
    c.fillText('Las líneas pagan de izquierda a derecha.', w / 2, h - 34 * k);
    c.fillText(`En los giros gratis todo paga x${MULT_GRATIS}. Toca para volver.`, w / 2, h - 16 * k);
  }
  function pintar(ahora){
    const { w, h } = medir();
    c.clearRect(0, 0, w, h);
    // la máquina (y su palanca a la derecha) cabe siempre en el lienzo, también en el teléfono
    // en pantallas bajas (teléfono acostado) el letrero, los marcadores y el mensaje son más finos y no hay bandeja
    const comp = h < 460, pad = w < 600 || comp ? 70 : 110, sep = w < 600 || comp ? 4 : 8;
    const lh = comp ? 30 : 46, mh = comp ? 26 : 34, msgH = comp ? 24 : 34, bandeja = comp ? 0 : 26;
    const extra = 10 + lh + 6 + mh + 24 + 20 + msgH + 8 + bandeja + 10;   // todo lo que no son rodillos
    const s = Math.max(20, Math.floor(Math.min((w - pad - 50 - sep * (N - 1)) / N, (h - extra - 12) / 3, 150)));
    const vw = s * N + sep * (N - 1), vh = s * 3;
    const cabW = vw + pad, cabH = vh + extra, cx = Math.round((w - cabW - 40) / 2), cy = Math.max(4, Math.round((h - cabH) / 2));
    // mueble
    c.fillStyle = 'rgba(0,0,0,.4)'; rRect(c, cx + 8, cy + 10, cabW, cabH, 26); c.fill();
    const col = enGratis || gratis ? '#b02a90' : M.color;
    const gr = c.createLinearGradient(cx, 0, cx + cabW, 0);
    gr.addColorStop(0, '#3a0a14'); gr.addColorStop(.12, col); gr.addColorStop(.5, col); gr.addColorStop(.88, '#3a0a14');
    c.fillStyle = gr; rRect(c, cx, cy, cabW, cabH, 24); c.fill();
    c.strokeStyle = '#f2c14e'; c.lineWidth = 5; rRect(c, cx + 3, cy + 3, cabW - 6, cabH - 6, 22); c.stroke();
    // letrero con bombillas
    const lx = cx + 24, ly = cy + 10, lw = cabW - 48;
    c.fillStyle = '#1c0a14'; rRect(c, lx, ly, lw, lh, 10); c.fill();
    c.strokeStyle = '#b8862f'; c.lineWidth = 3; rRect(c, lx, ly, lw, lh, 10); c.stroke();
    const nb = Math.floor(lw / 16), fase = Math.floor(ahora / 160), fiesta = (ganado && !girando) || gratis;
    for (let i = 0; i < nb; i++){
      const on = (i + fase) % 3 === 0 || (fiesta && Math.floor(ahora / 120) % 2);
      c.fillStyle = on ? '#fff3b0' : '#8a6a2a';
      const rb = comp ? 2 : 3, yb = comp ? 4 : 6;
      c.beginPath(); c.arc(lx + 8 + i * (lw - 16) / (nb - 1), ly + yb, rb, 0, TAU); c.fill();
      c.beginPath(); c.arc(lx + 8 + i * (lw - 16) / (nb - 1), ly + lh - yb, rb, 0, TAU); c.fill();
    }
    c.fillStyle = '#ffe9a0'; c.font = `700 ${Math.min(comp ? 13 : 24, lw / 16)}px Marcellus, Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(gratis || enGratis ? `GIROS GRATIS · x${MULT_GRATIS}` : `${NL} LÍNEAS · ${N} RODILLOS`, lx + lw / 2, ly + lh / 2 + 1);
    // marcadores: crédito, apuesta y ganancia (la ganancia sube poco a poco, como en las máquinas)
    const my0 = ly + lh + 6, mw = (lw - 16) / 3;
    if (!girando && ganado > contador) contador = Math.min(ganado, contador + Math.max(1, ganado / 45));
    [['CRÉDITO', dineroTxtCorto(PJ.oro - pendiente)], ['APUESTA', gratis || (enGratis && girando) ? 'GRATIS' : dineroTxtCorto(total())], ['GANANCIA', dineroTxtCorto(girando ? 0 : contador)]].forEach(([t, v], k) => {
      const x = lx + k * (mw + 8);
      c.fillStyle = '#0c0408'; rRect(c, x, my0, mw, mh, 6); c.fill();
      c.strokeStyle = '#6a4a1a'; c.lineWidth = 2; rRect(c, x, my0, mw, mh, 6); c.stroke();
      c.fillStyle = '#b8a070'; c.font = `700 ${comp ? 7 : 9}px Rajdhani, sans-serif`; c.fillText(t, x + mw / 2, my0 + mh * .26);
      c.fillStyle = k === 2 && contador > 0 && !girando ? '#7dffa8' : '#ff4a3c'; c.font = `700 ${w < 600 || comp ? 12 : 16}px "Courier New", monospace`; c.fillText(v, x + mw / 2, my0 + mh * .68);
    });
    // ventana de rodillos
    const vx = cx + (cabW - vw) / 2, vy = my0 + mh + 14 + 10;
    c.fillStyle = '#1c1424'; rRect(c, vx - 12, vy - 10, vw + 24, vh + 20, 12); c.fill();
    c.strokeStyle = '#f2c14e'; c.lineWidth = 4; rRect(c, vx - 12, vy - 10, vw + 24, vh + 20, 12); c.stroke();
    const ganadoras = new Set();
    if (tirada && !girando){
      for (const pr of tirada.lineas){ const L = M.lineas[pr.li]; for (let k = 0; k < pr.k; k++) ganadoras.add(k * 3 + L[k]); }
      if (tirada.bonus.x || tirada.bonus.giros) for (let k = 0; k < N; k++) for (let f = 0; f < 3; f++) if (rod[k].tira[(rod[k].pos + 1 + f) % TIRA] === BONUS) ganadoras.add(k * 3 + f);
    }
    for (let k = 0; k < N; k++){
      const R = rod[k], x0 = vx + k * (s + sep);
      let p = R.pos;
      if (!R.parado){
        const u = Math.min(1, (ahora - R.t0) / R.dur);
        p = R.ini + (R.fin - R.ini) * (1 - Math.pow(1 - u, 3));
        if (u >= 1){ R.parado = true; R.pos = R.fin % TIRA; p = R.pos; sfx('golpe'); }
      }
      const g = c.createLinearGradient(0, vy, 0, vy + vh);
      g.addColorStop(0, '#9a968c'); g.addColorStop(.18, '#f4f0e6'); g.addColorStop(.82, '#f4f0e6'); g.addColorStop(1, '#9a968c');
      c.fillStyle = g; c.fillRect(x0, vy, s, vh);
      // el rodillo que hace esperar (dos Bonus a la vista) se ilumina
      if (!R.parado && R.dur > 2000 && k === N - 1){ c.fillStyle = `rgba(255,90,208,${.25 + .2 * Math.sin(ahora / 80)})`; c.fillRect(x0, vy, s, vh); }
      c.save(); c.beginPath(); c.rect(x0, vy, s, vh); c.clip();
      const base = Math.floor(p), frac = p - base, tam = Math.floor(s * .78 / 28) * 28 || Math.floor(s * .78);
      for (let f = 0; f < 5; f++){
        // la fila f se dibuja centrada en (f - 0.5) casillas: f = 1, 2 y 3 son las tres filas visibles
        const sim = R.tira[(base + f) % TIRA], yc = vy + (f - .5) * s - frac * s;
        const brilla = R.parado && f >= 1 && f <= 3 && ganadoras.has(k * 3 + f - 1);
        const esc = brilla ? 1 + .06 * Math.sin(ahora / 110) : 1, t2 = Math.round(tam * esc);
        if (brilla){ c.fillStyle = 'rgba(255,233,160,.45)'; c.fillRect(x0 + 2, yc - s / 2 + 2, s - 4, s - 4); }
        const [sx, sy, sw, sh] = CAS['sim' + sim];
        if (casListo) c.drawImage(CAS_IMG, sx, sy, sw, sh, Math.round(x0 + (s - t2) / 2), Math.round(yc - t2 / 2), t2, t2);
      }
      c.restore();
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x0, vy, s, 6); c.fillRect(x0, vy + vh - 6, s, 6);
    }
    // números de línea a los lados: las líneas que empiezan (o acaban) en la misma fila se reparten
    // en vertical dentro de esa fila, para que se vean todas (en la de 7 líneas hay hasta 3 por fila)
    const posLado = (fila, li, lado) => {
      const grupo = M.lineas.map((L, j) => j).filter(j => M.lineas[j][lado ? N - 1 : 0] === fila), n = grupo.length, k = grupo.indexOf(li);
      const paso = Math.min(22, (s - 4) / n);
      return vy + (fila + .5) * s + (k - (n - 1) / 2) * paso;
    };
    M.lineas.forEach((L, li) => {
      const gana = tirada && !girando && tirada.lineas.some(p => p.li === li);
      for (const [xx, yy] of [[vx - 24, posLado(L[0], li, 0)], [vx + vw + 24, posLado(L[N - 1], li, 1)]]){
        c.fillStyle = COL_LINEA[li]; c.beginPath(); c.arc(xx, yy, gana ? 11 : 9, 0, TAU); c.fill();
        if (gana){ c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke(); }
        c.fillStyle = '#1c1424'; c.font = '700 11px Rajdhani, sans-serif'; c.fillText(li + 1, xx, yy + 1);
      }
    });
    // líneas ganadoras: se muestran todas y luego una a una, como en las máquinas
    if (tirada && !girando && tirada.lineas.length){
      const ciclo = Math.floor(ahora / 900) % (tirada.lineas.length + 1);
      const lista = ciclo === 0 ? tirada.lineas : [tirada.lineas[ciclo - 1]];
      for (const pr of lista){
        const L = M.lineas[pr.li];
        c.strokeStyle = COL_LINEA[pr.li]; c.lineWidth = 5; c.lineJoin = 'round'; c.globalAlpha = .9;
        c.beginPath();
        for (let k = 0; k < N; k++){ const xx = vx + k * (s + sep) + s / 2, yy = vy + (L[k] + .5) * s; k ? c.lineTo(xx, yy) : c.moveTo(xx - s / 2, yy); }
        c.lineTo(vx + (N - 1) * (s + sep) + s, vy + (L[N - 1] + .5) * s);
        c.stroke(); c.globalAlpha = 1;
        for (let k = 0; k < pr.k; k++){ c.strokeStyle = COL_LINEA[pr.li]; c.lineWidth = 3; c.strokeRect(vx + k * (s + sep) + 3, vy + L[k] * s + 3, s - 6, s - 6); }
      }
      if (ciclo > 0){
        const pr = tirada.lineas[ciclo - 1];
        msg = `Línea ${pr.li + 1}: ${pr.k} × ${SIMBOLOS[pr.s]} = ${dineroTxtCorto(pr.x * casApuesta * tirada.mult)}`;
      } else if (ganado) msg = mensajeGanado();
    }
    // mensaje
    const my = vy + vh + 10 + 10 + msgH / 2;
    c.fillStyle = '#1c0a14'; rRect(c, vx - 12, my - msgH / 2, vw + 24, msgH, 8); c.fill();
    c.fillStyle = ganado && !girando ? '#7dffa8' : gratis || enGratis ? '#ff8af0' : '#ffe9a0';
    let fs = w < 600 || comp ? 13 : 17;
    do { c.font = `700 ${fs}px Rajdhani, sans-serif`; } while (c.measureText(msg).width > vw + 16 && --fs > 8);
    c.fillText(msg, vx + vw / 2, my + 1);
    // bandeja de monedas y palanca
    if (bandeja){
      c.fillStyle = '#2a1a10'; rRect(c, cx + cabW / 2 - 70, cy + cabH - 30, 140, 16, 6); c.fill();
      c.strokeStyle = '#b8862f'; c.lineWidth = 3; rRect(c, cx + cabW / 2 - 70, cy + cabH - 30, 140, 16, 6); c.stroke();
    }
    palanca = Math.max(0, palanca - .02);
    // la palanca baja al girar y vuelve sola
    const largo = Math.min(110, cabH * .3), px = cx + cabW + 20, py0 = cy + cabH * .5 - 75 + largo * .5;
    const bx = px, by = py0 + 75 - Math.cos(palanca * 2.6) * largo;
    c.fillStyle = '#5a5f6a'; rRect(c, px - 10, py0 + 50, 24, 50, 6); c.fill();
    c.strokeStyle = '#b8c0c8'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(px + 2, py0 + 75); c.lineTo(bx + 2, by); c.stroke(); c.lineCap = 'butt';
    const gb = c.createRadialGradient(bx - 4, by - 4, 2, bx, by, 15); gb.addColorStop(0, '#ff9a9a'); gb.addColorStop(1, '#b01828');
    c.fillStyle = gb; c.beginPath(); c.arc(bx + 2, by, 15, 0, TAU); c.fill();
    lyPalanca = { x:bx + 2, y:by, r:30 };
    // gran premio: letrero y lluvia de monedas
    if (grande > 0){
      for (const m of monedas){
        m.vy += 12; m.x += m.vx / 60; m.y += m.vy / 60;
        c.fillStyle = '#f2c14e'; c.beginPath(); c.ellipse(m.x, m.y, 7 * Math.abs(Math.cos(ahora / 120 + m.f)), 7, 0, 0, TAU); c.fill();
        c.strokeStyle = '#b8862f'; c.lineWidth = 1.5; c.stroke();
      }
      monedas = monedas.filter(m => m.y < h + 20);
      const a = Math.min(1, grande / 30), e2 = 1 + .08 * Math.sin(ahora / 120);
      c.save(); c.globalAlpha = a; c.translate(w / 2, h * .42); c.scale(e2, e2);
      c.font = `900 ${w < 600 ? 34 : 56}px Marcellus, Georgia, serif`; c.lineWidth = 8; c.strokeStyle = '#4a0a18'; c.strokeText('¡GRAN PREMIO!', 0, 0);
      c.fillStyle = '#ffd23f'; c.fillText('¡GRAN PREMIO!', 0, 0);
      c.font = `700 ${w < 600 ? 20 : 28}px Rajdhani, sans-serif`; c.strokeText(dineroTxtCorto(ganado), 0, w < 600 ? 34 : 48); c.fillStyle = '#7dffa8'; c.fillText(dineroTxtCorto(ganado), 0, w < 600 ? 34 : 48);
      c.restore();
      grande--;
    }
    if (info) pintarInfo(w, h);
  }
  function mensajeGanado(){
    const partes = [];
    if (tirada.lineas.length) partes.push(`${tirada.lineas.length} línea${tirada.lineas.length > 1 ? 's' : ''}`);
    if (tirada.bonus.x) partes.push(`${tirada.bonus.n} Bonus`);
    return `¡Ganas ${dineroTxtCorto(ganado)}! (${partes.join(' + ')}${tirada.mult > 1 ? `, x${tirada.mult}` : ''})`;
  }
  function alParar(ahora){
    girando = false; pendiente = 0;
    if (tirada.gratis) ganadoGratis += ganado;
    if (tirada.bonus.giros){
      gratis += tirada.bonus.giros; enGratis = true;
      banner('¡Giros gratis!', `${tirada.bonus.giros} giros con premios x${MULT_GRATIS}`); sfx('logro');
      chat(`¡${tirada.bonus.n} Bonus en la ${M.n.toLowerCase()}! Ganas ${tirada.bonus.giros} giros gratis.`, '#ff8af0');
    }
    if (tirada.gratis && !gratis){ enGratis = false; msg = `Fin de los giros gratis: ganaste ${dineroTxtCorto(ganadoGratis)}`; }
    else msg = ganado ? mensajeGanado() : gratis ? `Quedan ${gratis} giros gratis` : 'Nada esta vez. ¿Otra tirada?';
    if (ganado >= total() * 15){
      grande = 150; sfx('nivel');
      monedas = Array.from({ length:60 }, () => ({ x:Math.random() * cv.clientWidth, y:-20 - Math.random() * 200, vx:(Math.random() - .5) * 80, vy:Math.random() * 120, f:Math.random() * 6 }));
      chat(`¡Gran premio en la ${M.n.toLowerCase()}! Ganas ${dineroTxt(ganado)}.`, '#ffd23f');
    } else if (ganado) sfx('botin');
    // los giros gratis (y el modo automático) siguen solos
    sigAuto = ahora + (ganado ? 1400 : 650);
    refrescar();
  }
  function bucle(){
    if (!mesaAbierta(juego)){ cerrarGratis(); return; }
    const ahora = performance.now();
    pintar(ahora);
    if (girando){
      if (ahora % 90 < 18) sfx('click', .07);
      if (rod.every(R => R.parado)) alParar(ahora);
    } else if ((gratis || auto) && !info && ahora >= sigAuto){
      if (!gratis && PJ.oro < total()){ auto = false; msg = 'Sin dinero: el modo automático se detiene.'; refrescar(); }
      else girar();
    }
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);
}
// dinero en texto corto para los marcadores (1o 25p 3c)
function dineroTxtCorto(v){
  v = Math.max(0, Math.floor(v));
  const o = Math.floor(v / 10000), p = Math.floor(v / 100) % 100, k = v % 100;
  return [o ? `${o}o` : '', p || o ? `${p}p` : '', !o && (k || !p) ? `${k}c` : ''].filter(Boolean).join(' ');
}

// ======== RULETA EUROPEA ========
const ORDEN_RULETA = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const ROJOS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const colorNum = n => n === 0 ? 'verde' : ROJOS.has(n) ? 'rojo' : 'negro';
const COL_NUM = { verde:'#1f8a44', rojo:'#c0202e', negro:'#16141c' };
// el paño: casillas en unidades (14 de ancho x 5 de alto, como la mesa de verdad); paga = veces lo apostado (incluida la apuesta)
const PANO = (() => {
  const L = [{ id:'0', x0:0, y0:0, x1:1, y1:3, t:'0', nums:[0], paga:36, col:'verde' }];
  for (let n = 1; n <= 36; n++){
    const cI = (n - 1) / 3 | 0, r = 2 - (n - 1) % 3;
    L.push({ id:'n' + n, x0:1 + cI, y0:r, x1:2 + cI, y1:r + 1, t:String(n), nums:[n], paga:36, col:colorNum(n) });
  }
  for (let r = 0; r < 3; r++) L.push({ id:'col' + r, x0:13, y0:r, x1:14, y1:r + 1, t:'2 a 1', nums:Array.from({ length:12 }, (_, i) => 3 * i + 3 - r), paga:3 });
  ['1.ª 12', '2.ª 12', '3.ª 12'].forEach((t, k) => L.push({ id:'doc' + k, x0:1 + 4 * k, y0:3, x1:5 + 4 * k, y1:4, t, nums:Array.from({ length:12 }, (_, i) => 12 * k + i + 1), paga:3 }));
  const todos = Array.from({ length:36 }, (_, i) => i + 1);
  [['bajo', '1-18', n => n <= 18], ['par', 'PAR', n => n % 2 === 0], ['rojo', '◆', n => ROJOS.has(n)], ['negro', '◆', n => !ROJOS.has(n)], ['impar', 'IMPAR', n => n % 2 === 1], ['alto', '19-36', n => n >= 19]]
    .forEach(([id, t, f], i) => L.push({ id, x0:1 + 2 * i, y0:4, x1:3 + 2 * i, y1:5, t, nums:todos.filter(f), paga:2, rombo:id === 'rojo' ? 'rojo' : id === 'negro' ? 'negro' : null }));
  return L;
})();
let rulHistorial = [], rulUltima = null, rulFicha = 1000;
function abrirRuleta(){
  const { cv, c, medir, juego } = abrirMesa('Ruleta europea');
  const PASO = TAU / 37;
  let apuestas = {}, girando = false, pendiente = 0, res = null, msg = 'Pon tus fichas en el paño y pulsa Girar.';
  let rot = Math.random() * TAU, bolaRel = null, bola = { a:0, r:0 }, t0 = 0, rot0 = 0, rot1 = 0, bolaFin = 0, ultimo = performance.now(), cajas = [];
  const totalAp = () => Object.values(apuestas).reduce((a, b) => a + b, 0);
  $('casPie').innerHTML = `<div class="casp-grupo"><span>Ficha</span>${FICHAS.map(v => `<button type="button" class="btn cas-ap cas-ficha" data-ficha="${v}" aria-pressed="${v === rulFicha}"><i style="background:${COL_FICHA[v][0]};border-color:${COL_FICHA[v][1]}"></i>${etMoneda(v)}</button>`).join('')}</div>
    <div class="casp-grupo"><span>Apostado</span><b id="ruTotal"></b></div>
    <div class="casp-grupo casp-acc"><button type="button" class="btn" id="ruBorrar">Borrar</button><button type="button" class="btn" id="ruRepetir">Repetir</button>
      <button type="button" class="btn" data-cerrar-cas>Salir</button><button type="button" class="btn principal" id="casGirar">Girar</button></div>`;
  const refrescar = () => {
    $('ruTotal').innerHTML = dinero(totalAp());
    $('casGirar').disabled = girando || !totalAp();
    $('ruBorrar').disabled = girando || !totalAp();
    $('ruRepetir').disabled = girando || !rulUltima || Object.values(rulUltima).reduce((a, b) => a + b, 0) > PJ.oro;
    oroMesa(PJ.oro - pendiente - (girando ? 0 : totalAp()));
  };
  $('casPie').querySelectorAll('.cas-ficha').forEach(b => b.onclick = () => {
    rulFicha = +b.dataset.ficha;
    $('casPie').querySelectorAll('.cas-ficha').forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  $('casPie').querySelector('[data-cerrar-cas]').onclick = () => pantalla(null);
  $('ruBorrar').onclick = () => { if (!girando){ apuestas = {}; refrescar(); } };
  $('ruRepetir').onclick = () => { if (!girando && rulUltima){ apuestas = { ...rulUltima }; msg = 'Apuesta repetida.'; refrescar(); } };
  function poner(id, quitar){
    if (girando) return;
    if (quitar){ if (apuestas[id]){ apuestas[id] = Math.max(0, apuestas[id] - rulFicha); if (!apuestas[id]) delete apuestas[id]; refrescar(); } return; }
    if (totalAp() + rulFicha > PJ.oro){ msg = 'No te queda dinero para esa ficha.'; return; }
    apuestas[id] = (apuestas[id] || 0) + rulFicha; sfx('moneda'); res = null; refrescar();
  }
  const enCasilla = e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    return cajas.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
  };
  cv.onclick = e => { const b = enCasilla(e); if (b) poner(b.id, false); };
  cv.oncontextmenu = e => { e.preventDefault(); const b = enCasilla(e); if (b) poner(b.id, true); };
  $('casGirar').onclick = () => {
    const t = totalAp();
    if (girando || !t || t > PJ.oro) return;
    const n = ORDEN_RULETA[Math.random() * 37 | 0];
    let gana = 0;
    for (const [id, v] of Object.entries(apuestas)){ const B = PANO.find(b => b.id === id); if (B.nums.includes(n)) gana += v * B.paga; }
    PJ.oro += gana - t; pendiente = gana; res = { n, gana, t };
    PJ.casino = PJ.casino || { jugadas:0, ganado:0 }; PJ.casino.jugadas++; PJ.casino.ganado += gana - t;
    rulUltima = { ...apuestas }; guardar();
    // la rueda gira a un lado y la bola al otro; al final la bola cae en la casilla del número
    const i = ORDEN_RULETA.indexOf(n);
    rot0 = rot; rot1 = rot0 + TAU * 2.2 + Math.random() * TAU;
    bolaFin = rot1 + (i + .5) * PASO; bolaRel = null;
    t0 = performance.now(); girando = true; msg = 'No va más.'; sfx('poder'); refrescar();
  };
  refrescar();

  function rueda(cx, cy, R, ahora){
    // sombra y madera exterior
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.arc(cx + 6, cy + 8, R, 0, TAU); c.fill();
    let g = c.createRadialGradient(cx - R * .3, cy - R * .3, R * .2, cx, cy, R);
    g.addColorStop(0, '#a8602a'); g.addColorStop(.7, '#6a3412'); g.addColorStop(1, '#3a1a06');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
    c.strokeStyle = '#d8a860'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * .97, 0, TAU); c.stroke();
    // pista de la bola
    g = c.createRadialGradient(cx, cy, R * .74, cx, cy, R * .92);
    g.addColorStop(0, '#2a1608'); g.addColorStop(.6, '#5a3416'); g.addColorStop(1, '#1e0e04');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * .92, 0, TAU); c.fill();
    // rombos deflectores
    c.fillStyle = '#f2c14e';
    for (let k = 0; k < 8; k++){
      const a = k * TAU / 8 + TAU / 16, x = cx + Math.cos(a) * R * .8, y = cy + Math.sin(a) * R * .8, d = R * .035;
      c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(-d * 1.8, 0); c.lineTo(0, -d); c.lineTo(d * 1.8, 0); c.lineTo(0, d); c.closePath(); c.fill(); c.restore();
    }
    // casillas numeradas (giran con la rueda)
    const r1 = R * .73, r2 = R * .5, rN = R * .665;
    c.fillStyle = '#c8a050'; c.beginPath(); c.arc(cx, cy, r1 + 2, 0, TAU); c.fill();
    for (let i = 0; i < 37; i++){
      const a = rot + i * PASO, n = ORDEN_RULETA[i];
      c.fillStyle = COL_NUM[colorNum(n)];
      c.beginPath(); c.arc(cx, cy, r1, a, a + PASO); c.arc(cx, cy, r2, a + PASO, a, true); c.closePath(); c.fill();
      // fondo del bolsillo, más oscuro
      c.fillStyle = 'rgba(0,0,0,.35)';
      c.beginPath(); c.arc(cx, cy, R * .6, a, a + PASO); c.arc(cx, cy, r2, a + PASO, a, true); c.closePath(); c.fill();
      c.save(); c.translate(cx + Math.cos(a + PASO / 2) * rN, cy + Math.sin(a + PASO / 2) * rN); c.rotate(a + PASO / 2 + Math.PI / 2);
      c.fillStyle = '#fff'; c.font = `700 ${Math.max(8, R * .07)}px Rajdhani, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(n, 0, 0); c.restore();
    }
    c.strokeStyle = '#e8c070'; c.lineWidth = Math.max(1, R * .008);
    for (let i = 0; i < 37; i++){ const a = rot + i * PASO; c.beginPath(); c.moveTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); c.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); c.stroke(); }
    c.beginPath(); c.arc(cx, cy, R * .6, 0, TAU); c.stroke();
    // cono central de madera y torreta dorada
    g = c.createRadialGradient(cx - R * .12, cy - R * .12, R * .05, cx, cy, r2);
    g.addColorStop(0, '#d89858'); g.addColorStop(.6, '#9a5a28'); g.addColorStop(1, '#5a2e10');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r2, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,220,150,.35)'; c.lineWidth = 1;
    for (let k = 0; k < 8; k++){ const a = rot + k * TAU / 8; c.beginPath(); c.moveTo(cx + Math.cos(a) * R * .14, cy + Math.sin(a) * R * .14); c.lineTo(cx + Math.cos(a) * r2 * .95, cy + Math.sin(a) * r2 * .95); c.stroke(); }
    c.strokeStyle = '#f2c14e'; c.lineWidth = R * .03; c.lineCap = 'round';
    for (let k = 0; k < 4; k++){
      const a = rot + k * Math.PI / 2, x = cx + Math.cos(a) * R * .3, y = cy + Math.sin(a) * R * .3;
      c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
      g = c.createRadialGradient(x - 2, y - 2, 1, x, y, R * .04); g.addColorStop(0, '#fff3b0'); g.addColorStop(1, '#b8862f');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, R * .04, 0, TAU); c.fill();
    }
    c.lineCap = 'butt';
    g = c.createRadialGradient(cx - R * .03, cy - R * .03, 1, cx, cy, R * .09); g.addColorStop(0, '#fff3b0'); g.addColorStop(.5, '#f2c14e'); g.addColorStop(1, '#8a5a1a');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * .09, 0, TAU); c.fill();
    // bola
    if (bola.r){
      const x = cx + Math.cos(bola.a) * R * bola.r, y = cy + Math.sin(bola.a) * R * bola.r, rb = Math.max(4, R * .035);
      c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.arc(x + 2, y + 2, rb, 0, TAU); c.fill();
      g = c.createRadialGradient(x - rb * .4, y - rb * .4, 1, x, y, rb); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b8bcc8');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, rb, 0, TAU); c.fill();
    }
  }
  function ficha(x, y, v, r){
    // pila de fichas: una por cada ficha grande que cabe en el valor, hasta 5
    const vals = []; let resto = v;
    for (const f of [...FICHAS].reverse()) while (resto >= f && vals.length < 5){ vals.push(f); resto -= f; }
    if (!vals.length) vals.push(FICHAS[0]);
    vals.reverse().forEach((f, k) => {
      const yy = y - k * r * .28, [cf, cb] = COL_FICHA[f];
      c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.arc(x + 1.5, yy + 2, r, 0, TAU); c.fill();
      c.fillStyle = cf; c.beginPath(); c.arc(x, yy, r, 0, TAU); c.fill();
      c.strokeStyle = cb; c.lineWidth = r * .28; c.setLineDash([r * .5, r * .5]); c.beginPath(); c.arc(x, yy, r * .82, 0, TAU); c.stroke(); c.setLineDash([]);
      c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.beginPath(); c.arc(x, yy, r, 0, TAU); c.stroke();
    });
    const top = y - (vals.length - 1) * r * .28;
    c.fillStyle = COL_FICHA[vals[vals.length - 1]][1]; c.font = `700 ${Math.max(8, r * .8)}px Rajdhani, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(v >= 10000 ? `${+(v / 10000).toFixed(1)}o` : `${Math.round(v / 100)}p`, x, top + 1);
  }
  function pano(ox, oy, u, vertical){
    cajas = [];
    // a lo alto (teléfono) se gira la mesa: el 0 arriba y las apuestas exteriores a la izquierda
    const caja = B => vertical ? { x:ox + (5 - B.y1) * u, y:oy + B.x0 * u, w:(B.y1 - B.y0) * u, h:(B.x1 - B.x0) * u } : { x:ox + B.x0 * u, y:oy + B.y0 * u, w:(B.x1 - B.x0) * u, h:(B.y1 - B.y0) * u };
    const W = (vertical ? 5 : 14) * u, H = (vertical ? 14 : 5) * u;
    // borde de madera y paño verde
    c.fillStyle = '#4e2a10'; rRect(c, ox - u * .45, oy - u * .45, W + u * .9, H + u * .9, u * .35); c.fill();
    c.fillStyle = '#7a4a24'; rRect(c, ox - u * .3, oy - u * .3, W + u * .6, H + u * .6, u * .25); c.fill();
    const g = c.createRadialGradient(ox + W / 2, oy + H / 2, 10, ox + W / 2, oy + H / 2, Math.max(W, H) * .7);
    g.addColorStop(0, '#2a9a54'); g.addColorStop(1, '#156a34');
    c.fillStyle = g; c.fillRect(ox - u * .15, oy - u * .15, W + u * .3, H + u * .3);
    const gan = res && !girando ? res.n : null;
    for (const B of PANO){
      const b = caja(B); cajas.push({ ...b, id:B.id });
      if (B.col){ c.fillStyle = COL_NUM[B.col]; c.fillRect(b.x + 3, b.y + 3, b.w - 6, b.h - 6); }
      if (gan !== null && B.nums.includes(gan) && B.nums.length === 1 && Math.floor(performance.now() / 300) % 2){ c.fillStyle = 'rgba(255,233,160,.45)'; c.fillRect(b.x, b.y, b.w, b.h); }
      c.strokeStyle = '#f4f0e6'; c.lineWidth = 2; c.strokeRect(b.x + .5, b.y + .5, b.w, b.h);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      if (B.rombo){
        c.fillStyle = COL_NUM[B.rombo]; c.strokeStyle = '#f4f0e6'; c.lineWidth = 1.5;
        const mx = b.x + b.w / 2, my = b.y + b.h / 2, dx = Math.min(b.w, b.h * 2) * .28, dy = Math.min(b.h, b.w) * .3;
        c.beginPath(); c.moveTo(mx - dx, my); c.lineTo(mx, my - dy); c.lineTo(mx + dx, my); c.lineTo(mx, my + dy); c.closePath(); c.fill(); c.stroke();
      } else {
        c.fillStyle = '#f4f0e6'; c.font = `700 ${Math.max(9, u * (B.nums.length === 1 ? .42 : .34))}px ${B.nums.length === 1 ? 'Marcellus, Georgia, serif' : 'Rajdhani, sans-serif'}`;
        c.save(); c.translate(b.x + b.w / 2, b.y + b.h / 2);
        if (vertical && b.h > b.w * 1.5) c.rotate(-Math.PI / 2);
        c.fillText(B.t, 0, 1); c.restore();
      }
    }
    // fichas apostadas
    for (const [id, v] of Object.entries(apuestas)){ const b = cajas.find(x => x.id === id); if (b) ficha(b.x + b.w / 2, b.y + b.h / 2, v, Math.max(7, u * .3)); }
    // marcador del número ganador
    if (gan !== null){
      const b = cajas.find(x => x.id === (gan === 0 ? '0' : 'n' + gan)), x = b.x + b.w / 2, y = b.y + b.h / 2 - u * .1;
      c.fillStyle = '#f4f0e6'; c.beginPath(); c.arc(x, y - u * .25, u * .16, 0, TAU); c.fill();
      c.fillStyle = '#d8dce4'; c.fillRect(x - u * .1, y - u * .15, u * .2, u * .3);
    }
  }
  function pintar(ahora){
    const { w, h } = medir();
    c.clearRect(0, 0, w, h);
    const vertical = w / h < 1.1;
    let R, cxR, cyR, u, ox, oy;
    if (!vertical){
      // rueda a la izquierda y paño a la derecha; arriba quedan el historial y el mensaje
      R = Math.min(h * .44, w * (h < 520 ? .16 : .2)); cxR = 14 + R; cyR = h / 2 + 8;
      const arriba = h < 360 ? 58 : 70, aw = w - (cxR + R + 30) - 14, ah = h - arriba - 14;
      u = Math.min(aw / 14.9, ah / 5.9); ox = cxR + R + 30 + (aw - 14 * u) / 2; oy = arriba + (ah - 5 * u) / 2;
    } else {
      // en el teléfono de pie: la rueda arriba, más pequeña, y el paño (de pie) aprovecha el resto
      R = Math.min(w * .24, h * .13); cxR = w / 2; cyR = 38 + R;
      const top = cyR + R + 26, ah = h - top - 8, aw = w - 24;
      u = Math.min(aw / 5.9, ah / 14.6); ox = (w - 5 * u) / 2; oy = top + (ah - 14 * u) / 2;
    }
    rueda(cxR, cyR, R, ahora);
    pano(ox, oy, u, vertical);
    // historial y mensaje
    const hx0 = vertical ? 10 : cxR + R + 40, hy = vertical ? 18 : 22;
    c.textAlign = 'left'; c.textBaseline = 'middle';
    rulHistorial.forEach((n, k) => {
      const x = hx0 + 14 + k * 30;
      if (x > w - 14) return;
      c.fillStyle = COL_NUM[colorNum(n)]; c.beginPath(); c.arc(x, hy, 12, 0, TAU); c.fill();
      c.strokeStyle = k ? '#b8862f' : '#fff3b0'; c.lineWidth = k ? 1.5 : 3; c.stroke();
      c.fillStyle = '#fff'; c.font = '700 12px Rajdhani, sans-serif'; c.textAlign = 'center'; c.fillText(n, x, hy + 1);
    });
    c.textAlign = vertical ? 'center' : 'left';
    c.fillStyle = res && !girando ? (res.gana ? '#7dffa8' : '#ff8a9b') : '#ffe9a0'; c.font = `700 ${vertical || h < 360 ? 15 : 18}px Rajdhani, sans-serif`;
    c.fillText(msg, vertical ? w / 2 : hx0, vertical ? cyR + R + 10 : hy + 30);
  }
  function bucle(){
    if (!mesaAbierta(juego)) return;
    const ahora = performance.now(), dt = Math.min(.05, (ahora - ultimo) / 1000); ultimo = ahora;
    if (girando){
      const D = 6000, u = Math.min(1, (ahora - t0) / D), e = 1 - Math.pow(1 - u, 3);
      rot = rot0 + (rot1 - rot0) * e;
      // la bola gira al revés por la pista, pierde fuerza, cae al cono, rebota y se queda en su casilla
      // ángulo de la bola respecto a la rueda: empieza 7 vueltas por detrás y llega a su casilla al 80 %
      const v = Math.min(1, u / .8), eb = 1 - Math.pow(1 - v, 2.2);
      bola.a = rot + (bolaFin - rot1) + TAU * 7 * (1 - eb);   // la rueda avanza y la bola va al revés
      if (u < .6) bola.r = .85;
      else if (u < .8){ const k = (u - .6) / .2; bola.r = .85 - .23 * k + Math.abs(Math.sin(k * Math.PI * 3)) * .06 * (1 - k); }
      else bola.r = .62;
      if (u < .8 && Math.random() < .3) sfx('click', .05 + u * .25);
      if (u >= 1){
        girando = false; bolaRel = bolaFin - rot1; pendiente = 0;
        rulHistorial = [res.n, ...rulHistorial].slice(0, 14);
        const nombre = { verde:'verde', rojo:'rojo', negro:'negro' }[colorNum(res.n)];
        msg = `Sale el ${res.n} ${nombre}. ` + (res.gana ? `¡Ganas ${dineroTxt(res.gana)}!` : 'La banca se lleva las fichas.');
        if (res.gana){ sfx(res.gana >= res.t * 10 ? 'nivel' : 'botin'); if (res.gana >= res.t * 10){ banner('¡Pleno en la ruleta!', `Ganas ${dineroTxt(res.gana)}`); chat(`¡Pleno al ${res.n} en la ruleta! Ganas ${dineroTxt(res.gana)}.`, '#ffd23f'); } }
        apuestas = {}; refrescar();
      }
    } else {
      rot += dt * .25;                     // la rueda sigue girando despacio
      if (bolaRel !== null){ bola.a = rot + bolaRel; bola.r = .62; }
    }
    pintar(ahora);
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);
}

// =====================================================
//  PRÓLOGO: el gato que renació en otro mundo
//  (un gato callejero muere en nuestro mundo, renace en una mazmorra de Lumeria
//   y allí conoce al ratón sellado que le enseña todo y se convierte en su mejor amigo)
// =====================================================
let prologo = null;      // { paso, cine } mientras dura el prólogo
let dlg = null;          // diálogo abierto (estilo novela visual)
let nombrandoRaton = null;

const NOMBRE_HABLANTE = { voz:'La Voz del Mundo', eco:'Voz misteriosa', narr:'' };
const COLOR_HABLANTE = { gato:'#ffd76a', raton:'#ff9ad8', eco:'#c8a8ff', voz:'#7ae8ff', narr:'#d8d0e8' };
const nombreHablante = q => q === 'gato' ? PJ.nombre : q === 'raton' ? (PJ.mascota ? PJ.mascota.nombre : 'Ratón sellado') : NOMBRE_HABLANTE[q];
// lo que se dice según la clase (las habilidades que despierta al renacer)
const habClic = () => esTactil ? 'el botón de ataque' : 'el clic izquierdo';
const habDer = () => esTactil ? 'el botón de habilidad' : 'el clic derecho';

// ---------- diálogos ----------
function dialogo(lineas, alTerminar){
  dlg = { lineas, i:0, fin:alTerminar };
  pantalla('pDialogo');
  mostrarLinea();
  requestAnimationFrame(bucleDialogo);
}
function mostrarLinea(){
  const [quien, t] = dlg.lineas[dlg.i];
  dlg.txt = window.tr(typeof t === 'function' ? t() : t); dlg.t0 = performance.now(); dlg.lleno = false;   // se traduce entero antes de escribirlo letra a letra
  const caja = $('pDialogo');
  caja.dataset.quien = quien;
  $('dlgNombre').textContent = nombreHablante(quien);
  $('dlgNombre').style.color = COLOR_HABLANTE[quien];
  $('dlgTexto').textContent = '';
  pintarRetrato($('dlgRetrato'), quien);
  sfx('click');
}
function bucleDialogo(){
  if (!dlg || pantallaActual !== 'pDialogo') return;
  const n = Math.floor((performance.now() - dlg.t0) / 24);
  if (!dlg.lleno){
    $('dlgTexto').textContent = dlg.txt.slice(0, n);
    if (n >= dlg.txt.length) dlg.lleno = true;
  }
  requestAnimationFrame(bucleDialogo);
}
function avanzarDialogo(){
  if (!dlg) return;
  if (!dlg.lleno){ dlg.lleno = true; $('dlgTexto').textContent = dlg.txt; return; }
  if (++dlg.i < dlg.lineas.length){ mostrarLinea(); return; }
  terminarDialogo();
}
function terminarDialogo(){
  if (!dlg) return;
  const fin = dlg.fin; dlg = null;
  pantalla(null);
  if (fin) fin();
}
$('pDialogo').addEventListener('click', e => { if (e.target.id === 'dlgSaltar') terminarDialogo(); else avanzarDialogo(); });

// retratos: el gato del jugador, el ratón (o su sombra mientras no se deja ver) y la Voz del Mundo
function pintarRetrato(cv, quien){
  const c = cv.getContext('2d'), S = cv.width;
  c.clearRect(0, 0, S, S); c.imageSmoothingEnabled = false;
  if (quien === 'narr'){ cv.style.display = 'none'; return; }
  cv.style.display = '';
  c.fillStyle = '#1d1638'; c.fillRect(0, 0, S, S);
  if (quien === 'voz'){
    const g = c.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.3, '#7ae8ff'); g.addColorStop(1, 'rgba(20,40,80,0)');
    c.fillStyle = g; c.fillRect(0, 0, S, S);
    c.strokeStyle = 'rgba(200,250,255,.7)'; c.lineWidth = 2;
    for (const r of [S * .22, S * .34]){ c.beginPath(); c.arc(S / 2, S / 2, r, 0, TAU); c.stroke(); }
    return;
  }
  if (quien === 'gato'){
    if (!gatosListo) return;
    const [sx, sy, w] = cuadroGato(PJ.gato || 0, GATOS_DIR[PJ.gato || 0].q_ab ? 'q_ab' : 'ab', 0), l = Math.min(w, Math.round(70 / (GATOS_DIR[PJ.gato || 0].k || 1)));
    c.imageSmoothingEnabled = !gatoPx(PJ.gato || 0);
    c.drawImage(imgGato(PJ.gato || 0), sx + (w - l) / 2, sy, l, l, 4, 6, S - 8, S - 8);
    return;
  }
  // el ratón: mientras habla por telepatía solo se ve su silueta
  if (!ratasListo) return;
  const tipo = PJ.mascota ? PJ.mascota.tipo : 0, [sx, sy, w, h] = RATAS_DIR[tipo].ab[0], k = Math.max(1, Math.floor(Math.min(S / w, S / h) * .85));
  if (quien === 'eco') c.filter = 'brightness(0)';
  c.drawImage(RATAS_IMG, sx, sy, w, h, Math.round((S - w * k) / 2), Math.round((S - h * k) / 2 + 4), w * k, h * k);
  c.filter = 'none';
  if (quien === 'eco'){ c.fillStyle = '#c8a8ff'; c.font = `900 ${S * .4}px Marcellus, Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', S / 2, S / 2 + 4); }
}

// ---------- cinemática ----------
const CINE = [
  { escena:'calle', lineas:[
    ['narr', 'Hace no mucho, en otro mundo, vivía un gato sin dueño.'],
    ['narr', 'Dormía en los tejados, comía lo que el barrio le dejaba... y nunca, nunca se rendía.'] ] },
  { escena:'luces', lineas:[
    ['narr', 'Una noche de tormenta, dos luces doblaron la esquina.'],
    ['narr', 'Fueron demasiado rápidas.'] ] },
  { escena:'vacio', lineas:[
    ['voz', '«Alma detectada... Confirmado: alma de gato.»'],
    ['voz', '«Deseo detectado: "No quiero que todo termine así".»'],
    ['voz', '«Petición aceptada. Iniciando renacimiento en el mundo de Lumeria...»'],
    ['voz', () => `«Habilidades adquiridas: ${CLASES[PJ.clase].h1.n} y ${CLASES[PJ.clase].h2.n}.»`],
    ['voz', '«Habilidad única adquirida: Devorar.»'],
    ['voz', '«Título adquirido: Renacido.»'] ] },
  { escena:'cueva', lineas:[
    ['narr', 'Cuando abriste los ojos, el aire olía a piedra húmeda... y a magia.'] ] }
];
let cine = null;
function iniciarCinematica(alTerminar, lista = CINE){
  cine = { lista, e:0, l:0, t0:performance.now(), te:performance.now(), fin:alTerminar, flash:0 };
  pantalla('pPrologo');
  lineaCine();
  requestAnimationFrame(bucleCine);
}
function lineaCine(){
  const [quien, t] = cine.lista[cine.e].lineas[cine.l];
  cine.txt = window.tr(typeof t === 'function' ? t() : t); cine.t0 = performance.now(); cine.lleno = false;
  $('prTexto').className = 'pr-texto' + (quien !== 'narr' ? ' voz' : '');
  $('prTexto').style.color = { monarca:'#ff7a7a', aldric:'#ffe48a' }[quien] || '';
  $('prTexto').textContent = '';
  // el destello blanco cuando las luces llegan
  if (cine.lista[cine.e].escena === 'luces' && cine.l === 1){ cine.flash = 1; sfx('golpe'); }
  if (cine.lista[cine.e].escena === 'vacio' && cine.l === 4) sfx('logro');
  if (quien === 'monarca' && cine.l === 0) sfx('jefe');
}
function avanzarCine(){
  if (!cine) return;
  if (!cine.lleno){ cine.lleno = true; $('prTexto').textContent = cine.txt; return; }
  if (++cine.l >= cine.lista[cine.e].lineas.length){
    cine.l = 0;
    if (++cine.e >= cine.lista.length){ terminarCine(); return; }
    cine.te = performance.now();
  }
  lineaCine();
}
function terminarCine(){
  if (!cine) return;
  const fin = cine.fin; cine = null;
  pantalla(null);
  if (fin) fin();
}
$('pPrologo').addEventListener('click', e => { if (e.target.id === 'prSaltar') terminarCine(); else avanzarCine(); });

// la escena se pinta a 320x180 (con píxeles grandes) y el gato encima, a escala entera
const CINE_BB = document.createElement('canvas'); CINE_BB.width = 320; CINE_BB.height = 180;
function azarFijo(n){ const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
function bucleCine(){
  if (!cine || pantallaActual !== 'pPrologo') return;
  const ahora = performance.now(), n = Math.floor((ahora - cine.t0) / 26);
  if (!cine.lleno){ $('prTexto').textContent = cine.txt.slice(0, n); if (n >= cine.txt.length) cine.lleno = true; }
  pintarCine(ahora);
  requestAnimationFrame(bucleCine);
}
// cv y cn: también pinta las miniaturas de la sala de vídeos (un lienzo pequeño y una escena fija)
function pintarCine(ahora, cv = $('prCan'), cn = cine){
  if (cv.id === 'prCan'){
    const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(r.width * d) || cv.height !== Math.round(r.height * d)){ cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); }
  }
  const c = cv.getContext('2d'), w = cv.width, h = cv.height, b = CINE_BB.getContext('2d');
  const esc = cn.lista[cn.e].escena, t = (ahora - cn.te) / 1000;
  b.imageSmoothingEnabled = false;
  b.fillStyle = '#000'; b.fillRect(0, 0, 320, 180);
  if (esc === 'calle' || esc === 'luces'){
    // cielo, edificios con ventanas, farola, acera y carretera mojada
    const g = b.createLinearGradient(0, 0, 0, 130); g.addColorStop(0, '#070818'); g.addColorStop(1, '#1d2246');
    b.fillStyle = g; b.fillRect(0, 0, 320, 130);
    for (let i = 0; i < 9; i++){
      const x = i * 38 - 6, alto = 50 + azarFijo(i) * 60, y = 128 - alto;
      b.fillStyle = i % 2 ? '#14162c' : '#1a1c36'; b.fillRect(x, y, 34, alto);
      for (let wy = y + 6; wy < 122; wy += 10) for (let wx = x + 4; wx < x + 30; wx += 8)
        if (azarFijo(wx * 7 + wy) > .55){ b.fillStyle = azarFijo(wx + wy * 3) > .5 ? '#ffd27a' : '#e8a84a'; b.fillRect(wx, wy, 4, 5); }
    }
    b.fillStyle = '#3a3a48'; b.fillRect(0, 126, 320, 10); b.fillStyle = '#4c4c5c'; b.fillRect(0, 126, 320, 2);
    b.fillStyle = '#16161e'; b.fillRect(0, 136, 320, 44);
    for (let x = 0; x < 320; x += 30) { b.fillStyle = '#c8b860'; b.fillRect(x + ((t * 0) | 0), 157, 14, 2); }
    // reflejos en el asfalto
    b.fillStyle = 'rgba(255,210,120,.12)'; for (let i = 0; i < 9; i++) if (azarFijo(i + 3) > .4) b.fillRect(i * 38 + 6, 140 + (i % 3) * 8, 10, 2);
    // farola con su halo
    b.fillStyle = '#2a2a34'; b.fillRect(236, 70, 3, 58); b.fillRect(228, 68, 14, 3);
    const hg = b.createRadialGradient(232, 74, 1, 232, 74, 40); hg.addColorStop(0, 'rgba(255,220,150,.55)'); hg.addColorStop(1, 'rgba(255,220,150,0)');
    b.fillStyle = hg; b.fillRect(190, 34, 84, 100);
    b.fillStyle = '#fff3b0'; b.fillRect(230, 71, 5, 3);
    // luces del coche que se acercan
    if (esc === 'luces'){
      const k = Math.min(1, t / 2.2), x = 330 - k * 150, rad = 6 + k * 40;
      for (const dy of [0, 14]){
        const lg = b.createRadialGradient(x, 140 + dy, 1, x, 140 + dy, rad);
        lg.addColorStop(0, 'rgba(255,255,230,1)'); lg.addColorStop(.3, 'rgba(255,240,180,.6)'); lg.addColorStop(1, 'rgba(255,240,180,0)');
        b.fillStyle = lg; b.fillRect(x - rad, 140 + dy - rad, rad * 2, rad * 2);
      }
    }
    // lluvia
    b.fillStyle = 'rgba(160,180,255,.55)';
    for (let i = 0; i < 90; i++){
      const x = (azarFijo(i) * 340 + ahora * .02 * (1 + azarFijo(i + 9))) % 340 - 10, y = (azarFijo(i + 50) * 190 + ahora * .25 * (1 + azarFijo(i + 7))) % 190 - 10;
      b.fillRect(x | 0, y | 0, 1, 5);
    }
  } else if (esc === 'vacio'){
    for (let i = 0; i < 70; i++){
      const x = azarFijo(i) * 320, y = (azarFijo(i + 40) * 180 - t * (4 + azarFijo(i + 3) * 10) + 400) % 180, a = .3 + .7 * Math.abs(Math.sin(t + i));
      b.fillStyle = `rgba(160,230,255,${a})`; b.fillRect(x | 0, y | 0, 1, 1);
    }
    const p = .75 + .25 * Math.sin(t * 2.4), og = b.createRadialGradient(160, 80, 2, 160, 80, 70 * p);
    og.addColorStop(0, 'rgba(220,250,255,.9)'); og.addColorStop(.35, 'rgba(122,232,255,.35)'); og.addColorStop(1, 'rgba(20,40,80,0)');
    b.fillStyle = og; b.fillRect(0, 0, 320, 180);
  } else if (esc === 'cueva'){
    const a = Math.min(1, t / 2.5);
    b.fillStyle = '#1a120c'; b.fillRect(0, 0, 320, 180);
    for (let i = 0; i < 160; i++){ b.fillStyle = azarFijo(i) > .5 ? '#2a1e14' : '#3a2a1c'; b.fillRect((azarFijo(i + 1) * 320) | 0, (azarFijo(i + 2) * 120) | 0, 6 + (azarFijo(i + 3) * 10 | 0), 4); }
    b.fillStyle = '#4a3624'; b.fillRect(0, 120, 320, 60);
    for (let i = 0; i < 40; i++){ b.fillStyle = '#5a4430'; b.fillRect((azarFijo(i + 70) * 320) | 0, 122 + ((azarFijo(i + 71) * 56) | 0), 5, 2); }
    // cristales que brillan en las paredes
    for (const [x, y] of [[40, 70], [270, 52], [210, 96]]){ b.fillStyle = `rgba(122,232,255,${.5 + .3 * Math.sin(t * 2 + x)})`; b.fillRect(x, y, 4, 10); b.fillRect(x + 4, y + 4, 3, 6); }
    b.fillStyle = `rgba(0,0,0,${1 - a})`; b.fillRect(0, 0, 320, 180);
  }
  else pintarEscenaHistoria(b, esc, t, ahora);
  c.imageSmoothingEnabled = false;
  // la escena ocupa todo el lienzo (sin deformarse: se recorta lo que sobra)
  const k = Math.max(w / 320, h / 180), ox = (w - 320 * k) / 2, oy = (h - 180 * k) / 2;
  c.drawImage(CINE_BB, ox, oy, 320 * k, 180 * k);
  // en nuestro mundo era un gato normal, a cuatro patas (se pinta en la escena, con píxeles grandes)
  if (esc === 'calle' || esc === 'luces'){
    const x = esc === 'calle' ? ((t * 22) % 360) - 20 : 150, paso = esc === 'calle' ? Math.floor(ahora / 140) % 4 : 0;
    gatoCallejero(b, Math.round(x), 135, PJ.gato || 0, paso);
    c.drawImage(CINE_BB, ox, oy, 320 * k, 180 * k);
  }
  // el gato renacido (ya con su ropa de cazador), dibujado encima a su tamaño
  if (gatosListo && (esc === 'vacio' || esc === 'cueva' || esc === 'alba')){
    const tipo = PJ.gato || 0;
    let f, x, y, voltear = false, alfa = 1, alto = 30;
    if (esc === 'vacio'){ f = cuadroGato(tipo, 'ab', 0); x = 160; y = 100 + Math.sin(t * 1.6) * 3; alfa = .55 + .2 * Math.sin(t * 3); alto = 40; }
    else if (esc === 'alba'){ f = cuadroGato(tipo, 'ab', 0); x = 140; y = 158; alto = 34; }
    else { f = cuadroGato(tipo, 'ab', 0); x = 160; y = 150; alfa = Math.min(1, t / 2.5); }
    const [sx, sy, fw, fh] = f, s = alto * k / fh, dw = fw * s, dh = fh * s;
    c.save(); c.globalAlpha = alfa;
    if (esc === 'vacio') c.globalCompositeOperation = 'lighter';
    c.imageSmoothingEnabled = !gatoPx(tipo);
    c.translate(Math.round(ox + x * k), Math.round(oy + y * k));
    if (voltear) c.scale(-1, 1);
    c.drawImage(imgGato(tipo), sx, sy, fw, fh, Math.round(-dw / 2), Math.round(-dh), Math.round(dw), Math.round(dh));
    c.restore();
  }
  if (esc === 'alba' && ratasListo){
    const tipo = PJ.mascota ? PJ.mascota.tipo : 0, [sx, sy, fw, fh] = RATAS_DIR[tipo].ab[0], s = 16 * k / fh;
    c.imageSmoothingEnabled = false; c.drawImage(RATAS_IMG, sx, sy, fw, fh, Math.round(ox + 172 * k - fw * s / 2), Math.round(oy + 158 * k - fh * s), Math.round(fw * s), Math.round(fh * s));
  }
  // destello blanco
  if (cn.flash > 0){ c.fillStyle = `rgba(255,255,255,${Math.min(1, cn.flash)})`; c.fillRect(0, 0, w, h); cn.flash -= .012; }
}

// escenas de la historia, pintadas a 320x180 como las del prólogo
function siluetaHeroe(b, x, pie, col, capa, brazo){
  // un caballero de pie, con capa y la espada en alto (brazo: 0 abajo, 1 arriba)
  const r = (dx, dy, w, h, c) => { b.fillStyle = c; b.fillRect(x + dx, pie + dy, w, h); };
  r(-7, -34, 14, 26, capa); r(-9, -12, 4, 6, capa); r(5, -12, 4, 6, capa);
  r(-4, -8, 3, 8, col); r(1, -8, 3, 8, col);
  r(-5, -30, 10, 22, col); r(-4, -38, 8, 8, col); r(-4, -36, 8, 2, '#000');
  if (brazo){ r(5, -44, 3, 16, col); r(6, -70, 2, 26, '#f4f0e0'); r(3, -46, 8, 2, col); }
  else { r(5, -28, 3, 14, col); r(7, -30, 2, 26, '#f4f0e0'); }
}
function pintarEscenaHistoria(b, esc, t, ahora){
  if (esc === 'recuerdo'){
    // un recuerdo en sepia: el héroe y su compañero ratón frente a una grieta
    const g = b.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, '#5a4026'); g.addColorStop(1, '#2a1a0c');
    b.fillStyle = g; b.fillRect(0, 0, 320, 180);
    b.fillStyle = '#3a2814'; for (let i = 0; i < 8; i++){ const x = i * 44, h = 20 + azarFijo(i + 9) * 30; b.fillRect(x, 130 - h, 46, h); }
    b.fillStyle = '#6a4a2a'; b.fillRect(0, 130, 320, 50);
    for (let i = 0; i < 50; i++){ b.fillStyle = '#7a5a36'; b.fillRect((azarFijo(i) * 320) | 0, 132 + ((azarFijo(i + 1) * 46) | 0), 6, 2); }
    // la grieta que cierran
    const p = .7 + .3 * Math.sin(t * 3);
    b.fillStyle = `rgba(255,220,150,${.35 * p})`; b.fillRect(214, 40, 30, 90);
    b.fillStyle = '#1a0c04'; for (let y = 44; y < 128; y += 4) b.fillRect(226 + Math.round(Math.sin(y * .4) * 4), y, 6, 4);
    b.fillStyle = '#ffe7b0'; for (let y = 46; y < 126; y += 8) b.fillRect(228 + Math.round(Math.sin(y * .4) * 4), y, 2, 3);
    siluetaHeroe(b, 150, 132, '#c8a060', '#8a3a1a', t > 1.5 ? 1 : 0);
    // el ratón a sus pies
    b.fillStyle = '#d8c8a8'; b.fillRect(168, 126, 8, 5); b.fillRect(174, 123, 4, 4); b.fillStyle = '#1a0c04'; b.fillRect(176, 124, 1, 1); b.fillStyle = '#d8c8a8'; b.fillRect(164, 128, 4, 1);
    // polvo dorado y viñeta del recuerdo
    for (let i = 0; i < 30; i++){ const x = (azarFijo(i) * 320 + t * 6) % 320, y = (azarFijo(i + 30) * 180 - t * 4 + 360) % 180; b.fillStyle = `rgba(255,230,170,${.25 + .3 * Math.sin(t + i)})`; b.fillRect(x | 0, y | 0, 1, 1); }
    const v = b.createRadialGradient(160, 90, 60, 160, 90, 200); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,10,0,.75)');
    b.fillStyle = v; b.fillRect(0, 0, 320, 180);
  } else if (esc === 'grieta'){
    // de noche, sobre Lumeria, el cielo se rasga en rojo
    const g = b.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, '#12040a'); g.addColorStop(1, '#2a0c1a');
    b.fillStyle = g; b.fillRect(0, 0, 320, 180);
    const p = .6 + .4 * Math.sin(t * 4), ab = Math.min(1, t / 1.6);
    const rg = b.createRadialGradient(160, 50, 2, 160, 50, 120 * ab); rg.addColorStop(0, `rgba(255,80,90,${.6 * p})`); rg.addColorStop(1, 'rgba(255,40,60,0)');
    b.fillStyle = rg; b.fillRect(0, 0, 320, 160);
    b.fillStyle = '#ff4f6b'; for (let x = 160 - 90 * ab; x < 160 + 90 * ab; x += 3){ const y = 50 + Math.sin(x * .19) * 6 + Math.sin(x * .07) * 8, h = 3 + (1 - Math.abs(x - 160) / 90) * 10; b.fillRect(x | 0, (y - h / 2) | 0, 3, h | 0); }
    b.fillStyle = '#ffe0e0'; for (let x = 160 - 70 * ab; x < 160 + 70 * ab; x += 6){ b.fillRect(x | 0, (50 + Math.sin(x * .19) * 6 + Math.sin(x * .07) * 8) | 0, 2, 1); }
    // ciudad en silueta
    for (let i = 0; i < 10; i++){ const x = i * 33, h = 30 + azarFijo(i + 2) * 45; b.fillStyle = '#0a0308'; b.fillRect(x, 140 - h, 31, h); if (i === 4){ b.fillRect(x + 10, 140 - h - 20, 10, 20); b.fillRect(x + 13, 140 - h - 28, 4, 8); }
      for (let wy = 140 - h + 6; wy < 134; wy += 9) if (azarFijo(i * 13 + wy) > .6){ b.fillStyle = '#ffb060'; b.fillRect(x + 6 + ((azarFijo(wy) * 18) | 0), wy, 3, 4); } }
    b.fillStyle = '#0a0308'; b.fillRect(0, 140, 320, 40);
    for (let i = 0; i < 40; i++){ const x = azarFijo(i) * 320, y = (azarFijo(i + 9) * 140 + t * 20 * (1 + azarFijo(i))) % 140; b.fillStyle = `rgba(255,90,110,${.5 + .4 * Math.sin(t * 2 + i)})`; b.fillRect(x | 0, y | 0, 1, 2); }
  } else if (esc === 'monarca'){
    // el Monarca del Vacío, derrotado, entre sombras moradas
    b.fillStyle = '#08040f'; b.fillRect(0, 0, 320, 180);
    for (let i = 0; i < 80; i++){ const a = azarFijo(i) * TAU + t * .3, r = 30 + azarFijo(i + 5) * 120; b.fillStyle = `rgba(155,107,255,${.2 + .4 * azarFijo(i + 1)})`; b.fillRect((160 + Math.cos(a) * r) | 0, (90 + Math.sin(a) * r * .6) | 0, 2, 2); }
    const og = b.createRadialGradient(160, 92, 4, 160, 92, 80); og.addColorStop(0, 'rgba(90,40,160,.55)'); og.addColorStop(1, 'rgba(20,8,40,0)'); b.fillStyle = og; b.fillRect(0, 0, 320, 180);
    // silueta con corona, encorvada; se va deshaciendo
    const des = Math.min(1, t / 6);
    b.fillStyle = '#000'; b.fillRect(130, 70, 60, 80); b.fillRect(140, 46, 40, 30); b.fillRect(120, 90, 14, 50); b.fillRect(186, 90, 14, 50);
    for (const dx of [140, 152, 164, 176]) b.fillRect(dx, 38, 4, 10);
    b.fillStyle = `rgba(255,60,80,${.7 + .3 * Math.sin(t * 5)})`; b.fillRect(150, 58, 6, 3); b.fillRect(164, 58, 6, 3);
    for (let i = 0; i < 60 * des; i++){ b.fillStyle = '#1a0c2a'; b.fillRect((130 + azarFijo(i) * 60) | 0, (70 + azarFijo(i + 3) * 80 - t * 6 * azarFijo(i + 7)) | 0, 3, 3); }
  } else if (esc === 'alba'){
    // amanece sobre una colina: el espíritu de Aldric se despide
    const g = b.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, '#2a3a7a'); g.addColorStop(.55, '#e88a5a'); g.addColorStop(1, '#ffd27a');
    b.fillStyle = g; b.fillRect(0, 0, 320, 180);
    const sy = 120 - Math.min(30, t * 6), sg = b.createRadialGradient(240, sy, 2, 240, sy, 60); sg.addColorStop(0, 'rgba(255,250,220,1)'); sg.addColorStop(.25, 'rgba(255,220,140,.7)'); sg.addColorStop(1, 'rgba(255,200,120,0)');
    b.fillStyle = sg; b.fillRect(160, sy - 60, 160, 120);
    b.fillStyle = '#3a2a3a'; for (let x = 0; x < 320; x += 2){ const h = 34 + Math.sin(x * .02) * 10 + Math.sin(x * .07) * 3; b.fillRect(x, 160 - h + 20, 2, h); }
    b.fillStyle = '#2a4a2a'; b.fillRect(0, 158, 320, 22); b.fillStyle = '#3a6a32'; for (let x = 0; x < 320; x += 5) b.fillRect(x, 156 + (azarFijo(x) * 3 | 0), 2, 3);
    // el espíritu dorado, cada vez más transparente
    b.globalAlpha = Math.max(0, .85 - t * .06); siluetaHeroe(b, 196, 158, '#ffe48a', '#ffd04a', 0); b.globalAlpha = 1;
    for (let i = 0; i < 24; i++){ const y = (158 - ((t * 18 + azarFijo(i) * 80) % 90)) | 0; b.fillStyle = `rgba(255,240,180,${.6 * azarFijo(i + 2)})`; b.fillRect((186 + azarFijo(i + 4) * 22) | 0, y, 1, 2); }
  }
}

// gato callejero de lado (mirando a la derecha), unos 18x12 píxeles; paso = cuadro de la caminata
const PELAJE = [['#c0392b', '#7a1e14', '#e8705c'], ['#8a8a96', '#4a4a56', '#b8b8c4'], ['#e8a050', '#a8602a', '#fff3e0'], ['#2a2236', '#120c1c', '#6a4a8a']];
function gatoCallejero(b, x, pie, tipo, paso){
  const [c1, c2, c3] = PELAJE[tipo] || PELAJE[0], o = '#0c0810';
  const px = (dx, dy, w, h, col) => { b.fillStyle = col; b.fillRect(x + dx, pie + dy, w, h); };
  // cola en curva hacia arriba
  px(-9, -15, 2, 2, o); px(-10, -13, 2, 4, o); px(-9, -10, 2, 2, o); px(-9, -14, 1, 1, c1); px(-9, -12, 1, 2, c1);
  // patas largas y finas, alternadas al caminar
  const pa = [[1, -1], [0, 0], [-1, 1], [0, 0]][paso];
  for (const [dx, d] of [[-6, pa[0]], [-4, pa[1]], [2, pa[1]], [4, pa[0]]]){ px(dx + d, -5, 2, 5, o); px(dx + d, -5, 1, 4, c2); }
  // cuerpo corto y redondeado
  px(-8, -10, 13, 6, o); px(-7, -11, 11, 1, o); px(-7, -10, 11, 5, c1); px(-5, -6, 8, 1, c3); px(-6, -10, 3, 1, c3);
  // cabeza grande con orejas puntiagudas
  px(3, -16, 8, 7, o); px(4, -15, 6, 5, c1); px(3, -18, 2, 3, o); px(9, -18, 2, 3, o); px(4, -17, 1, 2, c2); px(9, -17, 1, 2, c2);
  px(8, -13, 1, 1, '#ffd23f'); px(5, -13, 1, 1, '#ffd23f'); px(10, -11, 1, 1, '#ff9ab0'); px(4, -11, 2, 1, c3);
}

// ---------- la gruta del renacer (mazmorra del tutorial) ----------
function crearGruta(){
  const R = RANGOS[0], G = nuevaGrilla(34, 14, 1);
  G.tipo = 'mazmorra'; G.rango = 0; G.R = R; G.nombre = 'Gruta del Renacer'; G.tutorial = true;
  const abrir = (x0, y0, x1, y1) => setSolido(G, x0, y0, x1, y1, 0);
  abrir(2, 4, 8, 10); abrir(8, 6, 14, 8); abrir(14, 3, 21, 11); abrir(21, 6, 26, 8); abrir(26, 3, 32, 11);
  // unas rocas para que no parezcan cajas
  for (const [x, y] of [[2, 4], [7, 9], [14, 3], [20, 10], [14, 10], [26, 3], [31, 10], [31, 3]]) setSolido(G, x, y, x + 1, y + 1, 1);
  G.inicio = { x:4 * T, y:7 * T };
  G.salida = null;
  G.jefePos = { x:29.5 * T, y:6.5 * T };
  G.props = [{ cristal:true, x:29.5 * T, y:6.3 * T }];
  G.obs.push({ x:29.5 * T, y:6.1 * T, r:24 });
  for (const [n, x, y] of [['roca', 3.2, 9.4], ['roca', 19.8, 3.6], ['tronco', 16, 10.3], ['flores', 27.2, 10.4], ['pasto', 5.5, 4.6]])
    G.props.push({ terr:true, spr:n, x:x * T, y:y * T, esc:.42 });
  for (let i = 0; i < G.solido.length; i++){
    if (G.solido[i] || Math.random() > .07) continue;
    G.deco.push({ x:(i % G.cols + Math.random()) * T, y:(((i / G.cols) | 0) + Math.random()) * T, t:Math.random() * 3 | 0, s:rand(.6, 1.3) });
  }
  G.manadas = [];
  G.explorado = new Uint8Array(G.cols * G.rows);
  G.mini = document.createElement('canvas'); G.mini.width = G.cols; G.mini.height = G.rows;
  G.miniCtx = G.mini.getContext('2d');
  return G;
}
function iniciarPrologo(){
  E = crearGruta(); limpiarEscena(); modoCombate(true);
  colocar(E.inicio.x, E.inicio.y);
  prologo = { paso:0, cine:true };
  // los limos que guardan el túnel (más flojos que en un portal normal)
  for (const [x, y] of [[16.5, 5.5], [18.5, 8.5], [17.2, 7]]){
    crearEnemigo('slime', x * T, y * T);
    const e = enemigos[enemigos.length - 1]; e.dmg *= .5; e.hp = e.maxHp = Math.round(e.maxHp * .8); e.tuto = true;
  }
  iniciarCinematica(() => { prologo.cine = false; prologo.t = 0; });
}
// el guion: cada paso espera a que el gato llegue a un sitio o termine algo
function actualizarPrologo(dt){
  if (!prologo || prologo.cine || !E.tutorial || pantallaActual) return;
  const p = prologo, c = CLASES[PJ.clase];
  p.t = (p.t || 0) + dt;
  if (p.paso === 0 && p.t > .6){
    p.paso = 1;
    dialogo([
      ['gato', '¿Miau...? ¿Dónde estoy? Esto no es mi calle.'],
      ['gato', 'Me siento... distinto. Más fuerte. Y oigo cosas que antes no oía.'],
      ['narr', esTactil ? 'Muévete con el joystick de la izquierda.' : 'Muévete con W, A, S, D o con las flechas.']
    ]);
  } else if (p.paso === 1 && P.x > 7.5 * T){
    p.paso = 2;
    dialogo([
      ['eco', '...¿Hola? ¿Hay alguien ahí? ¡Por fin! Llevo trescientos años hablando solo.'],
      ['gato', '¿Quién habla? ¡Sal de donde estés!'],
      ['eco', 'Ojalá pudiera. Sigue el túnel, pequeño. Pero cuidado: hay limos. No son listos, pero muerden.']
    ]);
  } else if (p.paso === 2 && P.x > 13.6 * T){
    p.paso = 3;
    dialogo([
      ['eco', '¡Ahí están! Al renacer despertaste habilidades. Úsalas.'],
      ['eco', () => `Con ${habClic()} usas ${c.h1.n}. Con ${habDer()}, tu habilidad única: ${c.h2.n}.`],
      ['eco', 'Y si te hieren, bebe una poción. ¡Vamos, gatito, enséñales quién manda!']
    ]);
  } else if (p.paso === 3 && !enemigos.some(e => e.tuto && !e.muerto)){
    p.paso = 4;
    dialogo([
      ['eco', '¡Ja! Nada mal para un gato recién nacido.'],
      ['eco', 'Por cierto: renaciste con una habilidad única, Devorar. Cuando un monstruo deje su esencia morada, pásale por encima.'],
      ['eco', 'Si devoras bastantes esencias del mismo monstruo, aprenderás su habilidad. Se usa con la Z.'],
      ['eco', 'Sigue hacia el fondo de la cueva. Estoy ahí. No me voy a ir a ninguna parte... literalmente.']
    ]);
  } else if (p.paso === 4 && P.x > 25.6 * T){
    p.paso = 5;
    dialogo([
      ['eco', 'Aquí. Mira dentro del cristal.'],
      ['gato', '¿Un... ratón? ¿Me has guiado tú todo este tiempo?'],
      ['eco', 'Sí, soy un ratón. No pongas esa cara. Un héroe me encerró aquí hace trescientos años por comerme su queso.'],
      ['gato', 'En mi otra vida te habría perseguido por todo el tejado.'],
      ['eco', 'En tu otra vida. En esta, si me sacas de aquí, seré tu amigo. El primero que tengas en este mundo.'],
      ['narr', esTactil ? 'Acércate al cristal y toca el botón de acción para romperlo.' : 'Acércate al cristal y pulsa E para romperlo.']
    ], () => E.inter.push({ x:29.5 * T, y:7.4 * T, r:70, texto:'Romper el cristal', accion:romperCristal }));
  }
}
function romperCristal(){
  if (!prologo || prologo.paso !== 5) return;
  prologo.paso = 6;
  E.inter = E.inter.filter(i => i.texto !== 'Romper el cristal');
  E.props = E.props.filter(p => !p.cristal);
  E.props.push({ ratonLibre:true, x:29.5 * T, y:6.6 * T });
  chispas(29.5 * T, 6 * T, '#7ae8ff', 60, 280); shake = 14; sfx('jefe');
  const seguir = () => dialogo([
    ['raton', '¡Libre! ¡Libre al fin! ¡Trescientos años sin estirar las patas!'],
    ['raton', () => `${PJ.nombre}, ¿verdad? Te oí pensar tu nombre. Escucha: moriste en tu mundo y renaciste en este. Pasa muy pocas veces.`],
    ['raton', 'Aquí se abren grietas por todas partes: portales a mazmorras como esta. De ellas salen monstruos.'],
    ['raton', 'Los que entran a cerrarlas se llaman cazadores. La Asociación de Cazadores les da un rango: de E, el más bajo, hasta S.'],
    ['raton', 'Hay una ciudad cerca, Lumeria. Allí podrás descansar en la Posada del Eclipse y hacerte cazador.'],
    ['gato', '¿Y tú qué harás?'],
    ['raton', '¿Yo? Ir contigo, claro. Tú me sacaste del cristal. Para eso están los mejores amigos, ¿no?'],
    ['gato', 'Mejores amigos... Me gusta cómo suena.'],
    ['narr', 'Un portal se abrió en la pared de la cueva, brillando como una luna.']
  ], abrirPortalPrologo);
  if (PJ.mascota){ E.props = E.props.filter(p => !p.ratonLibre); invocarMascota(false); M.x = 29.5 * T; M.y = 6.9 * T; seguir(); return; }
  dialogo([
    ['raton', '¡Je! Gracias, gatito. Una cosa más...'],
    ['raton', 'En este mundo los nombres tienen poder. Un monstruo con nombre se vuelve más fuerte. Yo nunca he tenido uno.'],
    ['raton', '¿Me darías un nombre?']
  ], () => pedirNombreRaton(() => {
    E.props = E.props.filter(p => !p.ratonLibre);
    invocarMascota(false); M.x = 29.5 * T; M.y = 6.9 * T;
    texto(M.x, M.y - 70, `¡${PJ.mascota.nombre}!`, '#ff9ad8', 18); sfx('logro');
    dialogo([
      ['raton', () => `${PJ.mascota.nombre}... ¡${PJ.mascota.nombre}! Me encanta. Siento la magia corriendo por mis bigotes.`]
    ], seguir);
  }));
}
function abrirPortalPrologo(){
  prologo.paso = 7;
  E.portalFinal = { x:24 * T, y:7 * T };
  E.inter.push({ x:24 * T, y:7.2 * T, r:56, texto:'Cruzar el portal a Lumeria', accion:terminarPrologo });
  banner('Un portal se abrió', 'Crúzalo para llegar a Lumeria');
}
function terminarPrologo(){
  prologo = null;
  PJ.prologo = true;
  $('fundido').classList.add('ver');
  setTimeout(() => {
    irPosada('cama');
    if (PJ.mascota && !M) invocarMascota(true);
    $('fundido').classList.remove('ver');
    banner('Capítulo 1: Renacido en Lumeria', `${PJ.mascota ? PJ.mascota.nombre + ' y tú llegáis' : 'Llegas'} a la Posada del Eclipse`);
    chat('La dueña de la posada os deja una habitación: «Un gato y un ratón juntos... ¡esto sí que no lo había visto!»', '#ffd76a');
    chat('Ve a la Asociación de Cazadores (al oeste de la plaza) para empezar tu vida de cazador.', '#7ae8ff');
    guardar();
  }, 600);
}
// ponerle nombre al ratón: la misma ventana que la de las mascotas, pero sin poder dejarlo para luego
function pedirNombreRaton(alTerminar){
  nombrandoRaton = alTerminar;
  abrirElegirMascota();
  $('mTitulo').textContent = 'Ponle nombre a tu amigo';
  $('mDesc').textContent = 'Los nombres tienen poder en este mundo. Elige cómo se ve tu ratón y dale un nombre.';
  $('mNombre').placeholder = 'Por ejemplo, Queso'; $('mEtiqueta').textContent = 'Nombre de tu amigo';
  $('btnInvocarPet').textContent = 'Darle un nombre';
  $('pMascota').querySelector('[data-cerrar]').classList.add('oculto');
}
// el cristal con el ratón dentro, y el ratón ya libre esperando su nombre
function dibujarPropPrologo(pr){
  const t = performance.now() / 1000;
  if (pr.cristal){
    const x = pr.x, y = pr.y;
    const g = ctx.createRadialGradient(x, y - 30, 4, x, y - 30, 70); g.addColorStop(0, 'rgba(122,232,255,.35)'); g.addColorStop(1, 'rgba(122,232,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 70, y - 100, 140, 140);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x, y - 2, 30, 8, 0, 0, TAU); ctx.fill();
    // el ratón dormido dentro
    if (ratasListo){ const [sx, sy, w, h] = RATAS_DIR[0].ab[0]; ctx.globalAlpha = .85; ctx.drawImage(RATAS_IMG, sx, sy, w, h, Math.round(x - w / 2), Math.round(y - 16 - h), w, h); ctx.globalAlpha = 1; }
    // el cristal: un prisma de seis caras
    const cg = ctx.createLinearGradient(x - 28, 0, x + 28, 0);
    cg.addColorStop(0, 'rgba(160,240,255,.55)'); cg.addColorStop(.5, 'rgba(90,200,240,.3)'); cg.addColorStop(1, 'rgba(40,120,200,.55)');
    ctx.fillStyle = cg; ctx.strokeStyle = 'rgba(220,250,255,.9)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 92); ctx.lineTo(x + 28, y - 70); ctx.lineTo(x + 28, y - 10); ctx.lineTo(x, y + 2); ctx.lineTo(x - 28, y - 10); ctx.lineTo(x - 28, y - 70); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 92); ctx.lineTo(x, y + 2); ctx.moveTo(x - 28, y - 70); ctx.lineTo(x, y - 56); ctx.lineTo(x + 28, y - 70); ctx.strokeStyle = 'rgba(220,250,255,.35)'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(x - 18, y - 74 + Math.sin(t * 2) * 6, 3, 14);
    // destellos
    for (let k = 0; k < 4; k++){ const a = t * 1.3 + k * 1.6, r = 36 + Math.sin(t * 2 + k) * 4; ctx.fillStyle = `rgba(200,250,255,${.4 + .4 * Math.sin(t * 3 + k)})`; ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y - 46 + Math.sin(a) * r * .6), 3, 3); }
    return;
  }
  if (pr.ratonLibre && ratasListo){
    const [sx, sy, w, h] = RATAS_DIR[0].ab[Math.floor(t * 6) % 4], k = 2;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(pr.x, pr.y, 14, 4, 0, 0, TAU); ctx.fill();
    ctx.drawImage(RATAS_IMG, sx, sy, w, h, Math.round(pr.x - w * k / 2), Math.round(pr.y - h * k + Math.abs(Math.sin(t * 5)) * -4), w * k, h * k);
  }
}
// en el menú de pausa: volver a ver la historia o saltarse el resto del prólogo
function verHistoria(){
  iniciarCinematica(() => {
    dialogo([
      ['narr', 'Así renaciste en Lumeria: en una mazmorra, junto a un ratón sellado que se convirtió en tu mejor amigo.'],
      ...resumenHistoria(),
      ['narr', (PJ.historia && PJ.historia.cap >= HISTORIA.length) ? 'El misterio está resuelto, pero los portales siguen abriéndose. Tu leyenda continúa.' : 'Ahora eres cazador. Cierra portales, sube de rango y descubre por qué tu alma cruzó entre dos mundos.']
    ]);
  });
}
function saltarPrologo(){
  if (!prologo) return;
  const cerrar = () => { prologo = { paso:7 }; terminarPrologo(); };
  if (PJ.mascota) cerrar(); else pedirNombreRaton(cerrar);
}

// =====================================================
//  HISTORIA: un capítulo por rango (E → S) y el misterio del ratón
//  Cada capítulo se abre en la ciudad al llegar a su rango: el ratón cuenta lo que recuerda,
//  hay un objetivo (un jefe o cazar monstruos) y al volver se revela una parte del misterio.
// =====================================================
const nombreRaton = () => PJ.mascota ? PJ.mascota.nombre : 'el ratón';
const HISTORIA = [
  { rango:0, titulo:'Capítulo 2: La marca del limo', obj:{ tipo:'jefe', rango:0, n:1, txt:'Derrota al Rey Limo (portal de rango E)' },
    inicio:[
      ['raton', () => `¡Eh, ${PJ.nombre}! Ya eres cazador. Antes de nada, tengo que confesarte algo... más o menos.`],
      ['raton', 'Lo del queso era mentira. Bueno, me lo comí, pero no me encerraron por eso.'],
      ['gato', '¿Entonces por qué te encerraron?'],
      ['raton', 'No lo recuerdo bien. Trescientos años en un cristal te dejan la cabeza como un queso con agujeros.'],
      ['raton', 'Pero cuando vi a esos limos en la gruta sentí algo raro. Llévame hasta el Rey Limo, el jefe de los portales de rango E.']
    ],
    fin:[
      ['raton', '¡Mira su corona! Tiene grabada una espada cruzada con una llave.'],
      ['raton', 'Esa marca... la he visto antes. En una armadura que brillaba como el sol.'],
      ['gato', '¿De quién era?'],
      ['raton', 'De un humano. Me llamaba «compañero». Su nombre era... Al... Aldric.'],
      ['narr', 'Misterio del ratón: el héroe que lo selló se llamaba Aldric.']
    ], resumen:'El ratón recordó el nombre del héroe que lo selló: Aldric.' },
  { rango:1, titulo:'Capítulo 3: Arena y recuerdos', obj:{ tipo:'mata', mon:'escorpion', rango:1, n:15, txt:'Caza escorpiones en portales de rango D' },
    inicio:[
      ['raton', 'Desde que vi esa marca no paro de soñar con arena. Con un desierto debajo de la tierra.'],
      ['raton', 'La Caverna de Arena de los portales de rango D... Allí pasó algo. Lo noto en los bigotes.'],
      ['raton', 'Los escorpiones de esa caverna guardan algo de aquellos días. Si cazamos unos cuantos, quizá recuerde.']
    ],
    cine:[
      { escena:'recuerdo', lineas:[
        ['narr', 'Hace trescientos años, el mundo no tenía cazadores. Solo tenía a uno.'],
        ['narr', 'Aldric, el Primer Cazador, cerraba las grietas con su espada... y con la ayuda de un pequeño ratón.'],
        ['aldric', '«Compañero, tú y yo vamos a cerrar todas las grietas de Lumeria. Te lo prometo.»'] ] }
    ],
    fin:[
      ['raton', 'Lo recuerdo. Yo no era su mascota: era su compañero. Recorrimos juntos todo Lumeria.'],
      ['gato', 'Entonces, ¿por qué te encerró en un cristal?'],
      ['raton', 'Eso todavía no lo sé. Pero él nunca me habría hecho daño. Nunca.'],
      ['narr', 'Misterio del ratón: fue el compañero de Aldric, el Primer Cazador.']
    ], resumen:'Fue el compañero de viaje de Aldric, el Primer Cazador.' },
  { rango:2, titulo:'Capítulo 4: La llave', obj:{ tipo:'jefe', rango:2, n:1, txt:'Derrota a la Mantis de Escarcha (portal de rango C)' },
    inicio:[
      ['raton', 'La Gruta Helada... hace frío solo de pensarlo.'],
      ['raton', 'Anoche soñé que la Mantis de Escarcha me buscaba. Decía: «Devuélvenos la llave».'],
      ['gato', '¿Qué llave?'],
      ['raton', 'No lo sé. Vamos a preguntárselo. Con educación... y con tus garras.']
    ],
    fin:[
      ['narr', 'Al caer, la Mantis de Escarcha susurró: «La Llave del Vacío... está... dentro del roedor...»'],
      ['raton', '¿Dentro de mí? ¿La Llave del Vacío?'],
      ['raton', 'Ahora lo entiendo. Aldric no me encerró para castigarme. Me escondió.'],
      ['raton', 'La llave que abre y cierra todas las grietas está dentro de mí. Por eso brillaba el cristal.'],
      ['gato', 'Pues si alguien viene a por ella, tendrá que pasar por encima de mí.'],
      ['narr', 'Misterio del ratón: guarda en su interior la Llave del Vacío, que abre y cierra todas las grietas.']
    ], resumen:'Dentro del ratón está la Llave del Vacío, que abre y cierra todas las grietas.' },
  { rango:3, titulo:'Capítulo 5: Fuego bajo la piel', obj:{ tipo:'jefe', rango:3, n:1, txt:'Derrota a la Araña de Magma (portal de rango B)' },
    inicio:[
      ['raton', () => `Algo me quema por dentro, ${PJ.nombre}. La llave está despertando.`],
      ['raton', 'En el Cráter de Magma hay una araña que teje con fuego. La llave tiembla cada vez que pienso en ella.'],
      ['gato', 'Entonces vamos a quitarle las ganas de tejer.']
    ],
    cine:[
      { escena:'grieta', lineas:[
        ['narr', 'Al morir la Araña de Magma, el cielo de Lumeria se abrió en una grieta roja.'],
        ['monarca', '«Por fin te encuentro, Llave. Trescientos años escondida en una piedra...»'],
        ['monarca', '«Iré a por ti, ratoncito. Y esta vez no habrá ningún héroe para salvarte.»'] ] }
    ],
    fin:[
      ['raton', '¡Esa voz! Es el que nos perseguía: el Monarca del Vacío.'],
      ['raton', 'Aldric me selló en aquella cueva porque era el único sitio que el Monarca no podía ver.'],
      ['raton', () => `Y tú, ${PJ.nombre}, rompiste el cristal. Ahora puede sentirme.`],
      ['gato', 'Entonces lo derrotaremos antes de que te encuentre.'],
      ['raton', '¡Mira mis bigotes! Brillan. La llave me deja sentir los portales: te avisaré cuando haya peligro.'],
      ['narr', 'Misterio del ratón: estaba en esa cueva porque era el único lugar escondido del Monarca del Vacío.']
    ], resumen:'Aldric lo escondió en la cueva porque era el único lugar que el Monarca del Vacío no podía ver.' },
  { rango:4, titulo:'Capítulo 6: El Monarca del Vacío', obj:{ tipo:'jefe', rango:4, n:1, txt:'Derrota al Monarca del Vacío (portal de rango A)' },
    inicio:[
      ['raton', 'Es la hora. El Abismo del Vacío, los portales de rango A.'],
      ['raton', 'Si el Monarca cae, nunca más podrá buscarme.'],
      ['gato', 'Vamos juntos. Como tú y Aldric.'],
      ['raton', 'No. Mejor que Aldric y yo. Él al final me dejó solo... Tú no lo harás, ¿verdad?'],
      ['gato', 'Nunca.']
    ],
    cine:[
      { escena:'monarca', lineas:[
        ['monarca', '«Ja... ja... ¿Crees que yo era el peor monstruo de este mundo?»'],
        ['monarca', '«Pregúntale al ratón qué fue de su querido Aldric.»'],
        ['monarca', '«Lo encontrarás en la Grieta Roja. Ya no recordará tu nombre...»'] ] }
    ],
    fin:[
      ['raton', '¿Aldric... en la Grieta Roja?'],
      ['raton', 'Después de sellarme, cerró la Primera Grieta desde dentro. Se quedó al otro lado para salvar el mundo.'],
      ['raton', 'Creí que había muerto. Pero si sigue ahí... trescientos años en el Vacío...'],
      ['gato', 'Entonces iremos a buscarlo.'],
      ['narr', 'Misterio del ratón: Aldric se sacrificó cerrando la Primera Grieta desde dentro.']
    ], resumen:'Aldric se sacrificó cerrando la Primera Grieta desde dentro.' },
  { rango:5, titulo:'Capítulo 7: El último deseo', obj:{ tipo:'jefe', rango:5, n:1, txt:'Derrota al Monarca Carmesí (grieta de rango S)' },
    inicio:[
      ['raton', 'El Monarca Carmesí... Dicen que lleva una armadura que brilla como el sol, pero roja como la sangre.'],
      ['raton', () => `Tengo miedo, ${PJ.nombre}. No de él. De que sea quien yo creo que es.`],
      ['gato', 'Sea quien sea, no estarás solo.']
    ],
    cine:[
      { escena:'alba', lineas:[
        ['narr', 'La armadura carmesí se agrietó... y por las grietas salió una luz dorada.'],
        ['aldric', '«...¿Compañero? ¿Eres tú?»'],
        ['aldric', '«Te dejé dormido en un cristal. Perdóname. Era la única forma de esconder la llave.»'],
        ['aldric', '«Antes de cerrar la grieta pedí un último deseo al Mundo: que un alma valiente te encontrara... y te quisiera tanto como yo.»'],
        ['aldric', '«Gracias, gato de otro mundo. Cuida de él.»'] ] }
    ],
    fin:[
      ['raton', 'Así que por eso renaciste aquí... Él te llamó. Tu deseo y el suyo se encontraron.'],
      ['raton', 'Ya no hay sello, ni Monarca. Solo un gato y un ratón.'],
      ['gato', 'Mejores amigos.'],
      ['raton', 'Mejores amigos. Para siempre... o por lo menos hasta la hora de comer.'],
      ['narr', 'Fin del primer arco. Lumeria sigue llena de portales: tu leyenda continúa.']
    ], resumen:'El Monarca Carmesí era Aldric. Su último deseo trajo tu alma a este mundo para que encontraras a su compañero.' }
];
const historiaDe = () => (PJ.historia = PJ.historia || { cap:0, prog:0, activo:false, listo:false });
const capActual = () => HISTORIA[historiaDe().cap];
let tHistoria = 0;
// en la ciudad (no en portales ni en ventanas): abrir el capítulo que toca o cerrar el terminado
function actualizarHistoria(dt){
  if (!PJ || !PJ.prologo || prologo || cine || pantallaActual || !E || E.tipo === 'mazmorra' || E.tutorial){ tHistoria = 0; return; }
  const h = historiaDe(), C = HISTORIA[h.cap];
  if (!C) return;
  if (!h.activo && rangoCazador() < C.rango) return;
  if ((tHistoria += dt) < 2.5) return;
  tHistoria = 0;
  if (!h.activo) empezarCapitulo();
  else if (h.listo) terminarCapitulo();
}
function empezarCapitulo(){
  const h = historiaDe(), C = HISTORIA[h.cap];
  sfx('logro'); banner(C.titulo, 'Un nuevo capítulo de la historia');
  dialogo(C.inicio, () => {
    h.activo = true; h.prog = 0; h.listo = false;
    chat(`Historia: ${C.titulo}. Objetivo: ${C.obj.txt}.`, '#ff9ad8');
    firmaSeg = ''; guardar();
  });
}
function terminarCapitulo(){
  const h = historiaDe(), C = HISTORIA[h.cap], R = RANGOS[C.rango];
  const cerrar = () => dialogo(C.fin, () => {
    h.cap++; h.activo = false; h.listo = false; h.prog = 0;
    const oro = Math.round(150 * R.escala) * 100, xp = Math.round(260 * R.escala);
    PJ.oro += oro; PJ.pociones += 2;
    sfx('logro'); banner('Capítulo completado', C.titulo);
    chat(`Capítulo completado: ${C.titulo}. Recibes ${dineroTxt(oro)} y 2 pociones.`, '#ff9ad8');
    ganarXP(xp, true); firmaSeg = ''; revisarLogros(); guardar();
  });
  if (C.cine) iniciarCinematica(cerrar, C.cine); else cerrar();
}
// lo que cuenta para el objetivo del capítulo
function avisarHistoria(tipo, e){
  if (!PJ || !PJ.historia || !PJ.historia.activo || PJ.historia.listo || !E || E.tutorial) return;
  const h = PJ.historia, C = HISTORIA[h.cap]; if (!C) return;
  const o = C.obj;
  if (o.tipo !== tipo || (E.rango || 0) < o.rango) return;
  if (tipo === 'mata' && sprDe(e) !== o.mon) return;
  h.prog++;
  if (h.prog >= o.n){
    h.listo = true;
    sfx('logro'); banner('Objetivo de la historia cumplido', `Vuelve a la ciudad: ${nombreRaton()} quiere contarte algo`);
    chat(`Historia: objetivo cumplido (${o.txt}). Vuelve a la ciudad.`, '#ff9ad8');
  }
  firmaSeg = '';
}
// la línea de la historia en el seguimiento de misiones
function filaHistoria(){
  const h = PJ.historia, C = h && HISTORIA[h.cap];
  if (!C || !h.activo) return '';
  return `<div class="seg-m seg-hist ${h.listo ? 'ok' : ''}"><span class="seg-t"><span>📜</span> <span>${C.titulo}</span></span>` +
    (h.listo ? '<span class="seg-o ok">Vuelve a la ciudad</span>' : `<span class="seg-o">- <span>${C.obj.txt}</span>${C.obj.n > 1 ? `: ${h.prog}/${C.obj.n}` : ''}</span>`) + '</div>';
}
// lo que ya sabes del misterio (en «Ver la historia» del menú de pausa)
function resumenHistoria(){
  const h = PJ.historia || { cap:0 };
  return HISTORIA.slice(0, h.cap).map(C => ['narr', () => `${window.tr(C.titulo.split(':')[1].trim())}: ${window.tr(C.resumen)}`]);
}

// ---------- sala de vídeos: todas las cinemáticas, desde fuera del juego ----------
// fuera del juego no hay personaje: se ven con un gato de muestra (o con el tuyo, si ya elegiste uno)
const VIDEOS = () => [
  { t:'Prólogo: Renacido', d:'El gato muere en nuestro mundo y renace en Lumeria.', lista:CINE },
  ...HISTORIA.filter(C => C.cine).map(C => ({ t:C.titulo, d:C.resumen, lista:C.cine }))
];
let videosVolver = 'pAuth', pjVideo = null;
function abrirVideos(){
  if (pantallaActual && pantallaActual !== 'pVideos' && pantallaActual !== 'pPrologo') videosVolver = pantallaActual;
  const lista = VIDEOS(), ahora = performance.now();
  $('vidLista').innerHTML = lista.map((v, i) => `<button class="vid" type="button" data-vid="${i}"><span class="vid-mini"><canvas width="320" height="180"></canvas><span class="vid-play">▶</span></span><b>${v.t}</b><small>${v.d}</small></button>`).join('');
  pantalla('pVideos');
  conPjVideo(() => $('vidLista').querySelectorAll('canvas').forEach((cv, i) => pintarCine(ahora, cv, { lista:[lista[i].lista[0]], e:0, te:ahora - 3000, flash:0 })));
  $('vidLista').querySelectorAll('[data-vid]').forEach(b => b.onclick = () => verVideo(lista[+b.dataset.vid].lista));
}
// presta un personaje de muestra mientras dura la cinemática
function conPjVideo(fn){
  const propio = PJ;
  if (!propio) PJ = { nombre:'Gato', gato:0, clase:'mago', mascota:null };
  try { fn(); } finally { if (!propio) PJ = null; }
}
function verVideo(lista){
  pjVideo = PJ ? null : { nombre:'Gato', gato:0, clase:'mago', mascota:null };
  if (pjVideo) PJ = pjVideo;
  iniciarCinematica(() => { if (pjVideo && PJ === pjVideo) PJ = null; pjVideo = null; abrirVideos(); }, lista);
}
$('btnVidVolver').onclick = () => ir(videosVolver);
$('btnVidTodo').onclick = () => verVideo(VIDEOS().flatMap(v => v.lista));
document.querySelectorAll('[data-videos]').forEach(b => b.addEventListener('click', abrirVideos));

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
    P.hp = D.maxHp; P.en = recursoLleno(); guardar();
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
      <button class="btn" id="cQueso" ${PJ.oro < 300 ? 'disabled' : ''}><span class="tienda-ic">${ic3('queso')}Galleta de queso (mascota)</span><span>${dinero(300)}</span></button>
      <button class="btn" id="cTintes"><span class="tienda-ic">${ic3('tinte')}Tintes de ropa</span><span>${dinero(PRECIO_TINTE)}</span></button>
      ${botonEncargo('tendera')}
      <button class="btn dorado" id="cMin" ${valorMinerales() ? '' : 'disabled'}><span>Vender todos los minerales</span><span>${dinero(valorMinerales())}</span></button>
    </div>
    <p class="nota" style="margin-top:10px">Cada poción recupera casi la mitad de tu vida. Para vender equipo u objetos, abre tu mochila (B) aquí dentro del mercado.</p>`;
  enlazarEncargo('tendera');
  $('cTe').onclick = () => { if (PJ.oro >= 600){ PJ.oro -= 600; darApilable('tetera'); guardar(); abrirTienda('Compraste un Té de la posada.'); } };
  $('cFarol').onclick = () => { if (PJ.oro >= 1200){ PJ.oro -= 1200; darApilable('farol'); guardar(); abrirTienda('Compraste un Farol purificador.'); } };
  $('cTintes').onclick = () => abrirTintes();
  $('cQueso').onclick = () => { if (PJ.oro >= 300){ PJ.oro -= 300; darApilable('queso'); guardar(); abrirTienda('Compraste una Galleta de queso.'); } };
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
    <div class="linea"><span>Reparar todo el equipo</span><b>${costeReparar() ? dinero(costeReparar()) : 'No hace falta'}</b></div>
    <div class="compras">
      <button class="btn" id="cReparar" ${!costeReparar() || PJ.oro < costeReparar() ? 'disabled' : ''}><span>Reparar todo</span><span>${dinero(costeReparar())}</span></button>
      <button class="btn dorado" id="cArma" ${PJ.oro < p || max ? 'disabled' : ''}><span>${max ? 'Tu arma está al máximo' : `Forjar a +${PJ.arma + 1}`}</span><span>${dinero(p)}</span></button>
      ${botonEncargo('herrero')}
    </div>`;
  enlazarEncargo('herrero');
  $('cReparar').onclick = () => { if (reparar()) abrirForja('El herrero dejó tu equipo como nuevo.'); };
  $('cArma').onclick = () => { if (PJ.oro >= p && !max){ PJ.oro -= p; PJ.arma++; derivar(); guardar(); chispas(P.x, P.y, '#ff9a3d', 20, 180); abrirForja(`El herrero templó tu arma. Ahora es +${PJ.arma}.`); } };
  pantalla('pForja');
}

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
  PJ.limpias[R.l]++; PJ.jefesTotal++; contar('mazmorras'); darEmblemas(E.semanal ? 5 : 1, E.semanal ? 'titán semanal' : 'jefe derrotado'); premioTitan(); premioLFD(); premioJefeMundo();
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
  const R = E.R, s = R.escala, hp = Math.round(750 * s);
  jefeVivo = { jefe:true, nombre:R.jefe, x:E.jefePos.x, y:E.jefePos.y, r:40, hp, maxHp:hp, dmg:16 * s, vel:80, color:R.acento,
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

// =====================================================
//  ENTRADA
// =====================================================
const keys = {}, mouse = { x:0, y:0, izq:false }, sticks = { mov:null };
let holdAtk = false;

addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  keys[e.code] = true;
  if (!enJuego) return;
  if (pantallaActual === 'pDialogo' || pantallaActual === 'pPrologo'){
    const enCine = pantallaActual === 'pPrologo';
    if (['Space', 'Enter', 'KeyE', 'NumpadEnter'].includes(e.code)){ e.preventDefault(); enCine ? avanzarCine() : avanzarDialogo(); }
    else if (e.code === 'Escape') enCine ? terminarCine() : terminarDialogo();
    return;
  }
  if (e.code === 'Escape'){
    if (!$('wMenu').classList.contains('oculto')){ $('wMenu').classList.add('oculto'); return; }
    if (pantallaActual === null){ if (hayVentanas()) cerrarVentanas(); else if (objetivoValido()) P.objetivo = null; else if (amigoValido()) P.amigo = null; else pausar(); }
    else if (PANELES_JUEGO.includes(pantallaActual)) pantalla(null);
    return;
  }
  // en el casino, la barra espaciadora tira de la palanca o hace girar la ruleta
  if (pantallaActual === 'pCasino' && e.code === 'Space'){ e.preventDefault(); const g = $('casGirar'); if (g && !g.disabled) g.click(); return; }
  const vent = { KeyC:'wPj', KeyB:'wBolsa', KeyP:'wLibro', KeyL:'wMis' };
  if (e.code === 'KeyI' && pantallaActual === null){ abrirBuscador(); return; }
  if (vent[e.code] && pantallaActual === null){
    if (e.code === 'KeyC') wTab = 'personaje';
    alternarVentana(vent[e.code]);
    return;
  }
  if (pantallaActual) return;
  if (e.code === 'KeyH') beberPocion();
  if (e.code === 'KeyZ') usarDevorada();
  if (e.code === 'KeyE' && interCerca) interCerca.accion();
  if (e.code === 'KeyG') toggleMascota();
  if (e.code === 'Tab'){ e.preventDefault(); siguienteObjetivo(); }
  if (e.code === 'KeyV'){ VER_PLACAS = !VER_PLACAS; try { localStorage.setItem('rb_placas', VER_PLACAS ? '1' : '0'); } catch (er) {} texto(P.x, P.y - 74, VER_PLACAS ? 'Placas de vida: sí' : 'Placas de vida: no', '#e9e4ff', 13); }
  const tecla = CODIGO_TECLA[e.code];
  if (tecla && !e.repeat) usarPoder(PJ.barra[tecla]);
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouse.izq = false; });

cv.addEventListener('pointerdown', e => {
  if (!enJuego || pantallaActual) return;
  if (e.pointerType === 'mouse'){
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (E.tipo === 'mazmorra'){ const en = enemigoEnPantalla(e.clientX, e.clientY); if (en) fijarObjetivo(en); }
    else { const n = npcEnPantalla(e.clientX, e.clientY); if (n){ P.amigo = n; sfx('click'); } }
    if (e.button === 0) mouse.izq = true;
    if (e.button === 2) usarHab(2);
    return;
  }
  e.preventDefault();
  // tocar un monstruo lo fija como objetivo de tus ataques y poderes
  if (E.tipo === 'mazmorra'){
    const toc = enemigoEnPantalla(e.clientX, e.clientY, 70);
    if (toc){ fijarObjetivo(toc); vibrar(10); return; }
  } else { const n = npcEnPantalla(e.clientX, e.clientY); if (n){ P.amigo = n; vibrar(10); sfx('click'); return; } }
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
$('btnBuscador').onclick = () => abrirBuscador();
$('durAviso').onclick = () => { wTab = 'personaje'; abrirVentana('wPj'); };
$('ojoLFD').onclick = () => abrirBuscador();
$('btnAceptarGrupo').onclick = () => aceptarGrupo();
$('btnRechazar').onclick = () => { LFD.listo = false; pantalla(null); chat('Rechazaste el grupo.', '#9a91c2'); actualizarOjo(); };
$('btnLibro').onclick = () => alternarVentana('wLibro');
$('btnMis').onclick = () => alternarVentana('wMis');
$('btnPerfil').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPersonaje').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPuntos').onclick = () => abrirPerfil('personaje');
$('btnInteractuar').onclick = () => { if (interCerca) interCerca.accion(); };
$('btnSeguir').onclick = () => pantalla(null);
$('btnTamTel').onclick = () => { AJ_TEL.tam = (AJ_TEL.tam + 1) % 3; aplicarAjustesTel(); };
$('btnAutoTel').onclick = () => { AJ_TEL.auto = !AJ_TEL.auto; aplicarAjustesTel(); };
$('btnChatTel').onclick = () => { reiniciarChat(); $('notaGuardado').textContent = 'El chat volvió a su lugar.'; };
aplicarAjustesTel();
$('btnVerPerfil').onclick = () => abrirPerfil('personaje');
$('btnGuardar').onclick = () => { guardar(); $('notaGuardado').textContent = E.tipo === 'mazmorra' ? 'Partida guardada. Si sales ahora, apareces en la ciudad.' : 'Partida guardada.'; };
$('btnSalir').onclick = () => { guardar(); cerrarVentanas(); enJuego = false; document.body.classList.remove('jugando', 'combate'); M = null; ir('pPersonajes'); };
$('btnRevivir').onclick = () => { P.hp = D.maxHp; P.en = recursoLleno(); P.inv = 2; pantalla(null); irPosada('cama'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && enJuego && !pantallaActual) pausar(); });

function pausar(){ $('notaGuardado').textContent = ''; $('btnSaltarPrologo').classList.toggle('oculto', !prologo); pantalla('pPausa'); }
$('btnHistoria').onclick = () => verHistoria();
// modo app: se puede instalar en el teléfono o el ordenador y jugar sin internet
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
let avisoInstalar = null;
const yaInstalado = () => matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone;
addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); avisoInstalar = e;
  for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).classList.remove('oculto');
});
addEventListener('appinstalled', () => { avisoInstalar = null; for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).classList.add('oculto'); });
for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).onclick = async () => {
  if (!avisoInstalar) return;
  avisoInstalar.prompt();
  try { await avisoInstalar.userChoice; } catch (e) {}
  avisoInstalar = null;
  for (const b of ['btnInstalar', 'btnInstalarPausa']) $(b).classList.add('oculto');
};
// en iPhone no hay aviso de instalación: se explica cómo hacerlo a mano
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !yaInstalado()) $('notaInstalarIos').classList.remove('oculto');
// idioma: en el inicio de sesión y en la pausa (se guarda y la página se recarga en el idioma elegido)
document.querySelectorAll('[data-idioma]').forEach(b => {
  b.setAttribute('aria-pressed', b.dataset.idioma === window.IDIOMA);
  b.onclick = () => { if (b.dataset.idioma !== window.IDIOMA) window.cambiarIdioma(b.dataset.idioma); };
});
$('btnIdioma').textContent = `Idioma · Language: ${window.IDIOMA === 'en' ? 'English' : 'Español'}`;
$('btnIdioma').onclick = () => { guardar(); window.cambiarIdioma(window.IDIOMA === 'en' ? 'es' : 'en'); };
$('btnSaltarPrologo').onclick = () => saltarPrologo();

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
    if (e.target.closest('button') || innerWidth < 820 || esTactil) return; // en el teléfono las ventanas quedan fijas dentro de la pantalla
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
  asegurarDur(o); h += `<span class="${roto(o) ? 'rojo' : ''}">Durabilidad ${o.dur} / ${o.durMax}${roto(o) ? ' (roto)' : ''}</span>`;
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
    const cb = [['Vida', `${Math.ceil(P.hp)}/${D.maxHp}`], [recurso().n, `${Math.floor(P.en)}/${D.maxEn}`], ['Daño físico', Math.round(D.fis)], ['Daño mágico', Math.round(D.mag)],
      ['Crítico', Math.round(D.crit * 100) + '%'], ['Defensa', Math.round(D.def * 100) + '%'], ['Velocidad', Math.round(D.vel)], ['Forja', '+' + PJ.arma]]
      .map(([n, v]) => fila(n, { t:v, id:n === 'Vida' ? 'pdVida' : n === recurso().n ? 'pdEn' : '' })).join('');
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
      ? (() => { const m = PJ.mascota, H = HAB_MASCOTA[m.tipo], g = (PJ.mats || {}).queso || 0, sig = xpMascotaSig(m.nivel);
         return `<div class="pd-caja pet-caja"><h4>${escapar(m.nombre)} <small>nivel ${m.nivel}</small></h4><p>${TIPOS_RATA[m.tipo]} · <b>${H.n}</b></p>
         <p class="pet-hab">${H.d(m.nivel)}</p>
         <div class="pet-barra"><span>Experiencia</span><i><b style="width:${m.nivel >= MAX_NV_MASCOTA ? 100 : Math.round(m.xp / sig * 100)}%;background:#ffd100"></b></i><small>${m.nivel >= MAX_NV_MASCOTA ? 'máximo' : `${m.xp}/${sig}`}</small></div>
         <div class="pet-barra"><span>Barriga</span><i><b style="width:${Math.round(m.hambre)}%;background:${m.hambre < 20 ? '#ff5a5a' : '#7dffa8'}"></b></i><small>${Math.round(m.hambre)}%</small></div>
         ${m.hambre < 20 ? '<p class="pet-aviso">Tiene hambre: no te ayudará hasta que coma.</p>' : ''}
         <p class="gris" style="color:#9d9d9d;margin:6px 0">${M ? 'Te acompaña ahora mismo. Gana experiencia cuando derrotas monstruos.' : 'Está descansando en las sombras.'}</p>
         <div class="pet-bot"><button class="wbtn" id="wPet">${M ? 'Guardar mascota' : 'Invocar mascota'}</button>
         <button class="wbtn" id="wPetQueso" ${g ? '' : 'disabled'}>Dar galleta (${g})</button></div>
         ${g ? '' : '<p class="nota">Compra galletas de queso en el mercado.</p>'}</div>`; })()
      : `<div class="pd-caja" style="text-align:center"><h4>Sin mascota</h4><p>Pulsa G o el botón de la huella para elegir tu primera mascota.</p></div>`;
    const b = $('wPet'); if (b) b.onclick = () => { toggleMascota(); renderPj(); };
    const bq = $('wPetQueso'); if (bq) bq.onclick = () => { usarApilable('queso'); renderPj(); };
  } else if (wTab === 'desafios'){ cuerpo.innerHTML = htmlDesafios(); enlazarDesafios(); }
  else cuerpo.innerHTML = htmlRegistro();
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
  h += `</div><div class="wbag-pie"><span>${PJ.bolsa.length}/${TAM_BOLSA}</span><span class="emb" title="Emblemas">${ic3('emblema')}${PJ.emblemas || 0}</span>${dinero(PJ.oro)}</div>`;
  $('wBolsaCuerpo').innerHTML = h;
}

// ---------- libro de hechizos ----------
function renderLibro(){
  if (!abierta('wLibro')) return;
  const c = CLASES[PJ.clase];
  let h = `<div class="wl-hechizos"><div class="wl-sec">${c.nombre}</div>
    <div class="wl-h"><canvas data-icono="${c.h1.spr}" width="80" height="80"></canvas><div><b>${c.h1.n}</b><small>Clic izquierdo</small></div></div>
    <div class="wl-h"><canvas data-icono="${c.h2.spr}" width="80" height="80"></canvas><div><b>${c.h2.n}</b><small>Clic derecho · ${costeDe(c.h2)} ${recurso().n.toLowerCase()}</small></div></div>
    <div class="wl-sec">Habilidades de clase · ${recurso().n}</div>`;
  const filaPoder = (id, pw) => {
    const bloq = PJ.nivel < pw.nivel, tecla = TECLAS.find(t => PJ.barra[t] === id);
    return `<div class="wl-h ${bloq ? 'bloq' : ''}" data-hz="${id}" title="${pw.d}"><canvas data-icono="${pw.ic}" width="80" height="80" ${bloq ? '' : `draggable="true" data-arrastra="${id}"`}></canvas>
      <div><b>${pw.n}</b><small>${bloq ? `Nivel ${pw.nivel}` : `${costeDe(pw) ? costeDe(pw) + ' ' + recurso().n.toLowerCase() + ' · ' : ''}${pw.cd ? pw.cd + ' s' : 'sin recarga'}${tecla ? ` · tecla ${tecla}` : ''}`}</small></div></div>`;
  };
  for (const [id, pw] of Object.entries(PODERES)) if (pw.clase === PJ.clase && pw.barra) h += filaPoder(id, pw);
  h += '<div class="wl-sec">Técnicas de clase</div>';
  for (const [id, pw] of Object.entries(PODERES)) if (pw.clase === PJ.clase && !pw.barra) h += filaPoder(id, pw);

  h += '<p class="wl-nota">Arrastra un poder a tu barra de acción, o tócalo para elegir su tecla.</p>';
  h += libroDevorar();
  // talentos de la clase
  const libres = puntosTalento(PJ) - talentosGastados(PJ);
  h += `<div class="wl-sec">Talentos <small class="wl-pts">${libres} ${libres === 1 ? 'punto libre' : 'puntos libres'}</small></div>`;
  for (const t of TALENTOS[PJ.clase] || []){
    const r = PJ.talentos[t.id] || 0, puede = libres > 0 && r < MAX_RANGO_TAL;
    h += `<div class="wl-h wl-tal ${r ? '' : 'bloq'}" title="${t.d}"><canvas data-icono="${t.ic}" width="80" height="80"></canvas>
      <div><b>${t.n} <span class="wl-rango">${r}/${MAX_RANGO_TAL}</span></b><small>${t.d}</small></div>
      <button class="wl-mas" data-tal="${t.id}" ${puede ? '' : 'disabled'} aria-label="Subir ${t.n}">+</button></div>`;
  }
  h += `<p class="wl-nota">Ganas un punto de talento cada 2 niveles. ${talentosGastados(PJ) ? '<button class="wl-reini" id="btnReiniTal">Reiniciar talentos</button>' : ''}</p></div>`;
  const cu = $('wLibroCuerpo'); cu.innerHTML = h;
  cu.querySelectorAll('[data-tal]').forEach(b => b.onclick = e => { e.stopPropagation(); subirTalento(b.dataset.tal); });
  cu.querySelectorAll('[data-dev]').forEach(b => b.onclick = e => { e.stopPropagation(); equiparDevorada(b.dataset.dev); });
  if ($('btnReiniTal')) $('btnReiniTal').onclick = reiniciarTalentos;
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
  pintarDurabilidad();
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
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, 'ab', 0), esc = escGato(PJ.gato, 190 / 96), r = Math.sin(t / 420);
  a.save(); a.translate(110, 274);
  if (gatoPx(PJ.gato)){ a.imageSmoothingEnabled = false; a.translate(0, r > .6 ? -esc : 0); }
  else a.scale(1 - .012 * r, 1 + .025 * r);
  const frF = [sx, sy, w, h, ax, ay];
  if (gatoPx(PJ.gato)) dibujarEquipoGato(a, imgGato(PJ.gato), frF, 'ab', esc, PJ.equipo, 'atras');
  a.drawImage(hojaJugador(), sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  if (gatoPx(PJ.gato)) dibujarEquipoGato(a, imgGato(PJ.gato), frF, 'ab', esc, PJ.equipo, 'frente');
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
// ícono pixelado sin fondo para los botones redondos del teléfono
function pintarIconoBoton(c, spr){ const a = c.getContext('2d'); a.clearRect(0, 0, c.width, c.height); a.imageSmoothingEnabled = false; const ic = iconoPx(spr.slice(3), PALETA_CLASE[PJ.clase]), k = Math.floor(c.width * .7 / 16); a.drawImage(ic, (c.width - 16 * k) / 2, (c.width - 16 * k) / 2, 16 * k, 16 * k); }
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
  if (spr.startsWith('pxd:')){
    const ic = iconoPx(spr.slice(4), PALETA_DEVORAR), k = Math.floor(s * .9 / 16);
    a.imageSmoothingEnabled = false; a.drawImage(ic, (s - 16 * k) / 2, (s - 16 * k) / 2, 16 * k, 16 * k); return;
  }
  if (spr.startsWith('px:')){
    const ic = iconoPx(spr.slice(3), PALETA_CLASE[PJ ? PJ.clase : 'mago']), k = Math.floor(s * .9 / 16);
    a.imageSmoothingEnabled = false; a.drawImage(ic, (s - 16 * k) / 2, (s - 16 * k) / 2, 16 * k, 16 * k); return;
  }
  if (!spriteListo){ SPR.addEventListener('load', () => pintarIcono(c, spr), { once:true }); return; }
  const [sx, sy, w, h] = ATLAS[spr], k = Math.min(s * .9 / w, s * .9 / h);
  a.imageSmoothingEnabled = false;
  a.drawImage(SPR, sx, sy, w, h, (s - w * k) / 2, (s - h * k) / 2, w * k, h * k);
}

let barraEls = [];
function construirBarra(){
  const b = $('barra'); b.innerHTML = ''; barraEls = [];
  const c = CLASES[PJ.clase];
  const crear = (cls, tecla, spr, titulo, fn, info) => {
    const el = document.createElement('button');
    el.className = 'accion ' + cls; el.title = titulo; el.setAttribute('aria-label', titulo);
    el.innerHTML = `<canvas width="96" height="96"></canvas><kbd>${tecla}</kbd><b class="bloq"></b><i class="num"></i><i class="seg"></i>`;
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
  // la habilidad devorada (Z)
  { const dv = devorarDe(), H = HAB_MONSTRUO[dv.equipada]; crear('dev', 'Z', H ? 'pxd:' + H.ic : 'pxd:devorar', H ? H.n : 'Devorar', usarDevorada, { tipo:'dev' }); }
  prepararSoltarBarra();
}
function actualizarBarra(){
  const c = CLASES[PJ.clase];
  for (const b of barraEls){
    let cd = 0, bloq = '', num = '', seg = 0;
    if (b.tipo === 'h1') cd = clamp(P.cd1 / c.h1.cd, 0, 1);
    else if (b.tipo === 'h2') cd = P.en < costeDe(c.h2) ? 1 : clamp(P.cd2 / c.h2.cd, 0, 1);
    else if (b.tipo === 'poc'){ cd = clamp(P.cdPoc, 0, 1); num = PJ.pociones; }
    else if (b.tipo === 'dev'){ const n = devorarDe().equipada; if (!n) bloq = '—'; else { cd = clamp((P.cdDev || 0) / HAB_MONSTRUO[n].cd, 0, 1); seg = P.cdDev || 0; } }
    else {
      const id = PJ.barra[b.tecla], pw = PODERES[id];
      if (pw && PJ.nivel < pw.nivel) bloq = 'Nv ' + pw.nivel;
      else if (pw){ cd = P.en < costeDe(pw) ? 1 : (pw.cd ? clamp((P.cdP[id] || 0) / pw.cd, 0, 1) : 0); seg = P.cdP[id] || 0; }
    }
    if (b.tipo === 'h2') seg = P.cd2;
    if ((b.tipo === 'h2' || b.tipo === 'poder') && !bloq && P.gcd > 0) cd = Math.max(cd, P.gcd / GCD);
    const segTxt = seg > 0.05 ? (seg < 1 ? seg.toFixed(1) : Math.ceil(seg)) + '' : '';
    if (b.seg !== segTxt){ b.el.querySelector('.seg').textContent = segTxt; b.seg = segTxt; }
    if (b.cd !== cd){ b.el.style.setProperty('--cd', cd); b.cd = cd; }
    if (b.bloq !== bloq){ b.el.querySelector('.bloq').textContent = bloq; b.el.classList.toggle('bloqueado', !!bloq); b.bloq = bloq; }
    if (b.num !== num){ b.el.querySelector('.num').textContent = num; b.num = num; }
  }
}

function abrirPanelPortal(portal){
  const R = RANGOS[portal.rango], mio = rangoCazador();
  $('poLetra').textContent = R.l; $('poLetra').style.color = R.color;
  $('poTitulo').textContent = portal.mundo ? `Grieta roja: ${jefeMundoNombre()}` : portal.semanal ? `Portal dorado: ${titanDeLaSemana()}` : `Portal de rango ${R.l}`;
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
    ${portal.mundo ? `<div class="linea"><span>Jefe de mundo</span><b style="color:#ff4f6b">${jefeMundoNombre()}</b></div>
    <div class="linea"><span>Botín</span><b>${jefeMundoHecho() ? 'Ya lo derrotaste esta hora' : '5 emblemas, mucho dinero y un objeto épico'}</b></div>
    <p class="aviso" style="margin-top:10px">Es seis veces más resistente que un jefe normal. Un tanque y una sanadora irán contigo. La grieta se cierra a los 20 minutos de cada hora.</p>`
    : portal.semanal ? `<div class="linea"><span>Titán semanal</span><b style="color:#ffd100">${titanDeLaSemana()}</b></div>
    <div class="linea"><span>Cofre de la semana</span><b>${titanHecho() ? 'Ya lo abriste' : 'Mucho dinero y un objeto legendario'}</b></div>
    <p class="aviso" style="margin-top:10px">El titán es tres veces más resistente que un jefe normal.</p>`
    : `<div class="linea"><span>Se cierra en</span><b>${formatoTiempo(portal.cierra)}</b></div>`}${aviso}`;
  const btn = $('btnEntrarPortal');
  btn.className = 'btn ' + (portal.rango > mio ? 'peligro' : 'principal');
  btn.onclick = () => entrarPortal(portal);
  pantalla('pPortal');
}
const formatoTiempo = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// =====================================================
//  COMBATE
// =====================================================
// en el teléfono se apunta solo: primero al objetivo fijado (tocado o golpeado), si no al más cercano
// ---------- objetivo fijo (estilo WoW): Tab, clic o toque; se mantiene hasta que muere o lo quitas con Esc ----------
let VER_PLACAS = true; try { VER_PLACAS = localStorage.getItem('rb_placas') !== '0'; } catch (e) {}
const GCD = 1; // tiempo de recarga global de habilidades y poderes (el ataque básico no lo usa)
const objetivoValido = () => { const o = P && P.objetivo; return !!(o && !o.muerto && o.hp > 0 && enemigos.includes(o)); };
function fijarObjetivo(e){ if (P.objetivo !== e){ P.objetivo = e; if (e) sfx('click'); } }
function siguienteObjetivo(){
  if (E.tipo !== 'mazmorra') return;
  const lista = enemigos.filter(e => !e.muerto && Math.hypot(e.x - P.x, e.y - P.y) < 560 && lineaVision(P.x, P.y, e.x, e.y))
    .sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y));
  if (!lista.length){ P.objetivo = null; return; }
  const i = lista.indexOf(P.objetivo);
  fijarObjetivo(lista[(i + 1) % lista.length]);
}
// enemigo bajo un punto de la pantalla (para seleccionarlo con clic o toque)
function enemigoEnPantalla(sx, sy, radio = 46){
  const wx = sx + cam.x, wy = sy + cam.y; let toc = null, md = radio * radio;
  for (const en of enemigos){ if (en.muerto) continue; const d = (en.x - wx) ** 2 + (en.y - Math.min(40, altoDe(en) / 2) - wy) ** 2; if (d < md){ md = d; toc = en; } }
  return toc;
}
// a quién ataca un enemigo (objetivo del objetivo)
const unidadJugador = () => ({ nombre:PJ.nombre, hp:P.hp, maxHp:D.maxHp, color:'#7fc8ff' });
function objetivoDe(e){ return e && e.objetivo && e.objetivo !== P ? e.objetivo : unidadJugador(); }
// personaje amistoso seleccionado (ciudad e interiores)
const amigoValido = () => !!(P && P.amigo && E.npcs && E.npcs.includes(P.amigo));
function npcEnPantalla(sx, sy){
  if (!E.npcs) return null;
  const wx = sx + cam.x, wy = sy + cam.y; let toc = null, md = 44 * 44;
  for (const n of E.npcs){ const d = (n.x - wx) ** 2 + (n.y - 22 - wy) ** 2; if (d < md){ md = d; toc = n; } }
  return toc;
}
// retrato pixelado del objetivo: el dibujo del monstruo o del personaje
let retratoDe = null;
function pintarRetratoObjetivo(u){
  if (u === retratoDe) return; retratoDe = u;
  const c = $('oRetrato'); if (!c) return;
  const a = c.getContext('2d'), W = c.width;
  a.clearRect(0, 0, W, W);
  const g = a.createRadialGradient(W / 2, W / 2, 4, W / 2, W / 2, W / 2);
  g.addColorStop(0, u && (u.cam || u.spr) ? '#2a4a2a' : '#4a1a20'); g.addColorStop(1, '#0c0812'); a.fillStyle = g; a.fillRect(0, 0, W, W);
  if (!u) return;
  a.imageSmoothingEnabled = false;
  let img = null, sx, sy, w, h, cabeza = false;
  if (u.cam && CAM[u.cam]){ img = CAM_IMG; [sx, sy, w, h] = CAM[u.cam].ab[0]; cabeza = true; }
  else if (u.spr && NPC_SPR[u.spr]){ img = NPC_IMG; [sx, sy, w, h] = NPC_SPR[u.spr]; const o = NPC_SPR[u.spr][4] || 0; sy += o; h -= o; cabeza = true; }
  else {
    const n = sprDe(u); if (!n || !MON.tipos[n]) return;
    const idx = (u.jefe && n === 'arana') ? MON.tipos.arana_jefe : (u.jefe && n === 'jabali') ? MON.tipos.jabali_jefe : MON.tipos[n].walk[0];
    img = MON_IMG; [sx, sy, w, h] = MON.cuadros[idx];
  }
  if (!img.complete || !img.naturalWidth){ retratoDe = null; return; }
  // personajes: la cabeza y los hombros; monstruos: entero
  if (cabeza){ h = Math.min(h, Math.round(w * .95)); }
  const k = Math.max(1, Math.floor(Math.min((W - 6) / w, (W - 6) / h)));
  const dw = w * k, dh = h * k;
  a.drawImage(img, sx, sy, w, h, Math.round((W - dw) / 2), cabeza ? 4 : Math.round(W - dh - 4), dw, dh);
}
function objetivoTactil(max = 360){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < Math.max(max, 420)) return P.objetivo;
  return enemigoCercano(P.x, P.y, max);
}
const A_DISTANCIA = ['mago', 'sacerdote', 'arquero'];
// ataque automático (teléfono): golpea solo cuando hay un monstruo a tu alcance
function autoAtaque(){
  if (!esTactil || !AJ_TEL.auto || E.tipo !== 'mazmorra' || P.cd1 > 0) return false;
  return !!objetivoTactil(A_DISTANCIA.includes(PJ.clase) ? 330 : 105);
}
function apuntar(){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < 620){ P.ang = Math.atan2(P.objetivo.y - P.y, P.objetivo.x - P.x); return; }
  if (!esTactil){ P.ang = Math.atan2(mouse.y + cam.y - (P.y - 20), mouse.x + cam.x - P.x); return; }
  const e = objetivoTactil(360);
  P.ang = e ? Math.atan2(e.y - P.y, e.x - P.x) : Math.atan2(P.ldy, P.ldx);
}
function enemigoCercano(x, y, max){
  let mejor = null, md = max * max;
  for (const e of enemigos){ const d = (e.x - x) ** 2 + (e.y - y) ** 2; if (d < md){ md = d; mejor = e; } }
  return mejor;
}
// punto del suelo hacia donde apuntas (para poderes de zona)
function puntoMira(max){
  if (objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < max + 60) return { x:P.objetivo.x, y:P.objetivo.y };
  if (esTactil){ const e = objetivoTactil(max); if (e) return { x:e.x, y:e.y }; return { x:P.x + Math.cos(P.ang) * 180, y:P.y + Math.sin(P.ang) * 180 }; }
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
    P.cd1 = c.h1.cd * (1 - Math.min(.35, D.s.agi * .005)) * D.cdK * (estados.rapido ? .5 : 1); sfx(sfxClase('ataque'), .08);
  } else {
    if (P.cd2 > 0 || P.gcd > 0) return;
    const coste2 = costeDe(c.h2);
    if (P.en < coste2){ texto(P.x, P.y - 74, recurso().sin, '#4fa3ff', 14); P.cd2 = .3; vibrar([20, 40, 20]); return; }
    P.cd2 = c.h2.cd * D.cdK; P.en -= coste2; P.gcd = GCD; vibrar(15); sfx(sfxClase('poder'));
  }
  apuntar();
  HAB[PJ.clase + n]();
}

const HAB = {
  guerrero1(){ pose('atk', DUR_ATK); golpeArco(84, 1.9, D.fis); fxArco(P.x, P.y, P.ang, 70, 1.9, '#e2443c'); },
  guerrero2(){
    pose('cast', .45);
    golpeCirculo(P.x, P.y, 140, D.fis * 2.3, { empuje:90 });
    fxAnillo(P.x, P.y, 12, 140, '#e2443c', .45); fxGrietas(P.x, P.y + 4, '#5a0c0c', .7);
    shake = 12; chispas(P.x, P.y, '#ff5a4a', 26, 260);
  },
  sombra1(){ pose('atk', DUR_ATK * .7); golpeArco(68, 1.4, D.fis * .85, .15); fxArco(P.x, P.y, P.ang + rand(-.3, .3), 54, 1.2, '#5ad84a', .16); if (enemigos.some(e => e.hp < e.maxHp && Math.hypot(e.x - P.x, e.y - P.y) < 68 + e.r) && Math.random() < .35) sumarCombo(1); },
  sombra2(){
    const x0 = P.x, y0 = P.y, a = P.ang;
    fxAnillo(x0, y0, 28, 4, '#5ad84a', .3);
    let paso = 0;
    while (paso < 220 && !solidoEn(P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 16)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; }
    colisiones(P); P.inv = Math.max(P.inv, .35);
    golpeLinea(x0, y0, P.x, P.y, 30, D.fis * 2.4);
    fxEstela(x0, y0, P.x, P.y, '#5ad84a', .35);
    fxAnillo(P.x, P.y, 4, 30, '#c8ff8a', .3);
    pose('oculto', .12);
  },
  mago1(){
    pose('atk', DUR_ATK);
    const a = P.ang;
    fxAnillo(P.x + Math.cos(a) * 18, P.y + Math.sin(a) * 10, 14, 4, '#4f9aff', .2);
    proys.push({ px:'arcano', x:P.x + Math.cos(a) * 22, y:P.y + Math.sin(a) * 22, vx:Math.cos(a) * 480, vy:Math.sin(a) * 480, r:9, alt:30,
      dmg:D.mag * 1.1, vida:1.1, color:'#4f9aff', aoe:50 });
  },
  mago2(){
    pose('cast', .5);
    const a = P.ang;
    proys.push({ bola:true, x:P.x + Math.cos(a) * 30, y:P.y + Math.sin(a) * 30, vx:Math.cos(a) * 210, vy:Math.sin(a) * 210, r:34, alt:22,
      dmg:D.mag * .45, vida:2.4, tick:0, color:'#4f9aff' });
    chispas(P.x, P.y - 30, '#4f9aff', 16, 160);
  }
};

function usarPoder(id){
  if (!enJuego || pantallaActual || !id) return;
  const pw = PODERES[id];
  if (PJ.nivel < pw.nivel){ texto(P.x, P.y - 74, `Se aprende en el nivel ${pw.nivel}`, '#9a91c2', 14); return; }
  if (E.tipo !== 'mazmorra'){ texto(P.x, P.y - 74, 'Los poderes solo funcionan dentro de los portales', '#9a91c2', 14); return; }
  if ((P.cdP[id] || 0) > 0 || P.gcd > 0) return;
  if (pw.clase && pw.clase !== PJ.clase) return;
  if (P.en < costeDe(pw)){ texto(P.x, P.y - 74, recurso().sin, '#4fa3ff', 14); vibrar([20, 40, 20]); return; }
  P.en -= costeDe(pw); P.cdP[id] = pw.cd * D.cdK; P.gcd = GCD; vibrar(15); sfx(sfxClase('poder'));
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

// =====================================================
//  RECURSOS Y HABILIDADES DE CLASE (estilo WoW)
// =====================================================
// guerrero: ira (se gana pegando y recibiendo golpes, se va fuera de combate); sombra: energía rápida y puntos de combo; mago: maná
const RECURSO = {
  guerrero: { n:'Ira',     sin:'Sin ira',     col:'linear-gradient(#e2443c,#8a1410)', factor:.5 },
  sombra:   { n:'Energía', sin:'Sin energía', col:'linear-gradient(#ffe25a,#b89410)', factor:.7 },
  mago:     { n:'Maná',    sin:'Sin maná',    col:'linear-gradient(#5591ff,#1c45b3)', factor:1 },
  sacerdote:{ n:'Maná',    sin:'Sin maná',    col:'linear-gradient(#5591ff,#1c45b3)', factor:1 },
  arquero:  { n:'Enfoque', sin:'Sin enfoque', col:'linear-gradient(#ffb35a,#b85a10)', factor:.7 }
};
const recurso = () => RECURSO[PJ.clase] || RECURSO.mago;
// lo que cuesta un poder compartido o una habilidad de clase en el recurso de tu clase
const costeDe = pw => pw.clase ? pw.coste : Math.round(pw.coste * recurso().factor);
const recursoLleno = () => PJ.clase === 'guerrero' ? 0 : D.maxEn;
function ajustarRecurso(D){
  if (PJ.clase === 'guerrero'){ D.maxEn = 100; D.regEn = 0; }
  else if (PJ.clase === 'sombra'){ D.maxEn = 100; D.regEn = 14 + D.s.agi * .08; }
  // el arquero tensa el arco con la agilidad: también le suma daño
  else if (PJ.clase === 'arquero'){ D.maxEn = 100; D.regEn = 12 + D.s.agi * .08; D.fis += D.s.agi * .7; }
}
function ganarIra(n){ if (PJ.clase === 'guerrero' && P) P.en = Math.min(D.maxEn, P.en + n); }
function updateRecurso(dt){
  if (PJ.clase === 'guerrero'){
    const combate = E.tipo === 'mazmorra' && enemigos.some(e => e.aggro && !e.muerto);
    if (!combate) P.en = Math.max(0, P.en - 4 * dt);
  }
}
// puntos de combo (sombra): se ganan con los golpes y los gastan los remates
// provocar: el enemigo te ataca a ti unos segundos y quedas arriba en su tabla de amenaza
function provocarA(e, quien = P){
  e.aggro = true; e.provocado = 4; e.provocador = quien;
  const max = Math.max(0, ...amenazas(e).values()); amenazas(e).set(quien, max * 1.1 + 50);
  e.blanco = e.objetivo = quien; e.tBlanco = .5;
}
function reducirAmenaza(k){ for (const e of enemigos){ const m = amenazas(e); if (m.has(P)) m.set(P, m.get(P) * k); } }
function sumarCombo(n = 1){ if (PJ.clase !== 'sombra') return; P.combo = Math.min(5, (P.combo || 0) + n); }
function gastarCombo(){ const c = P.combo || 0; P.combo = 0; return c; }

const blanco = (alcance = 110) => objetivoValido() && Math.hypot(P.objetivo.x - P.x, P.objetivo.y - P.y) < alcance + P.objetivo.r ? P.objetivo : enemigoCercano(P.x, P.y, alcance);
function golpeUnico(e, dmg, critExtra = 0){ if (!e) return false; P.ang = Math.atan2(e.y - P.y, e.x - P.x); herir(e, dmg, critExtra); fxArco(P.x, P.y, P.ang, 56, 1.6, colFx()); return true; }

Object.assign(PODERES, {
  // guerrero
  heroico:  { clase:'guerrero', n:'Golpe heroico',        d:'Un golpe brutal a tu objetivo.', nivel:1,  cd:2,  coste:15, ic:'corte' },
  grito:    { clase:'guerrero', n:'Grito de batalla',     d:'Furia de sombras durante 30 s (+20% de daño).', nivel:3, cd:30, coste:10, ic:'pilar' },
  provocar: { clase:'guerrero', n:'Provocar',             d:'Obliga a tu objetivo a atacarte y te da 15 de ira.', nivel:5, cd:8, coste:0, ic:'domo' },
  torbellino:{ clase:'guerrero', n:'Torbellino',          d:'Giras y golpeas a todos a tu alrededor.', nivel:8, cd:8, coste:25, ic:'luna' },
  ejecutar: { clase:'guerrero', n:'Ejecutar',             d:'Remata a un objetivo con menos del 20% de vida.', nivel:10, cd:0, coste:20, ic:'corte' },
  // sombra
  siniestro:{ clase:'sombra', n:'Golpe siniestro',        d:'Golpe al objetivo. Da 1 punto de combo.', nivel:1, cd:0, coste:40, ic:'corte' },
  eviscerar:{ clase:'sombra', n:'Eviscerar',              d:'Remate: más daño cuantos más puntos de combo.', nivel:3, cd:0, coste:35, ic:'luna' },
  picadillo:{ clase:'sombra', n:'Hacer picadillo',        d:'Remate: Celeridad durante 6 s + 3 s por punto de combo.', nivel:5, cd:0, coste:25, ic:'tp' },
  patada:   { clase:'sombra', n:'Patada',                 d:'Aturde 2 s a tu objetivo e interrumpe la carga de los jefes.', nivel:7, cd:10, coste:25, ic:'corte' },
  esfumarse:{ clase:'sombra', n:'Esfumarse',              d:'Desapareces un instante: los enemigos te pierden la pista.', nivel:10, cd:20, coste:0, ic:'tp' },
  // mago
  escarcha: { clase:'mago', n:'Descarga de escarcha',     d:'Rayo helado que daña y ralentiza.', nivel:1, cd:0, coste:15, ic:'rayo' },
  nova:     { clase:'mago', n:'Nova de escarcha',         d:'Congela en el sitio a los enemigos cercanos 3 s.', nivel:3, cd:12, coste:25, ic:'domo' },
  arcana:   { clase:'mago', n:'Explosión arcana',         d:'Explosión que daña a todos a tu alrededor.', nivel:5, cd:0, coste:20, ic:'bola' },
  evocacion:{ clase:'mago', n:'Evocación',                d:'Recuperas la mitad de tu maná al instante.', nivel:8, cd:60, coste:0, ic:'lluvia' },
  bloque:   { clase:'mago', n:'Bloque de hielo',          d:'Inmune a todo daño durante 4 s.', nivel:10, cd:90, coste:0, ic:'pilar' }
});
const BARRA_CLASE = { guerrero:['heroico','grito','provocar','torbellino'], sombra:['siniestro','eviscerar','picadillo','patada'], mago:['escarcha','nova','arcana','evocacion'],
  sacerdote:['sanar','dolor','fortaleza','alarido'], arquero:['certero','conmocion','marcacaza','rafaga'] };
TECLAS.push('5', '6', '7', '8');
Object.assign(CODIGO_TECLA, { Digit5:'5', Digit6:'6', Digit7:'7', Digit8:'8' });

Object.assign(PODER_FN, {
  heroico(){ pose('atk', DUR_ATK); const e = blanco(100); if (!golpeUnico(e, D.fis * 2.2)) golpeArco(84, 1.4, D.fis * 2.2); chispas(P.x + Math.cos(P.ang) * 40, P.y - 10, '#ff5a4a', 12, 160); },
  grito(){ pose('cast', .45); ponerEfecto('atk_up', 30); chispas(P.x, P.y - 20, '#e2443c', 30, 220); fxAnillo(P.x, P.y, 10, 90, '#e2443c', .4); shake = 6; },
  provocar(){
    const e = blanco(380); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); return; }
    provocarA(e); ganarIra(15); texto(e.x, e.y - 60, '¡Provocado!', '#ff6a3d', 14);
  },
  torbellino(){ pose('cast', .4); golpeCirculo(P.x, P.y, 110, D.fis * 1.6); fxArco(P.x, P.y, P.ang, 90, TAU, '#e2443c', .3); fxAnillo(P.x, P.y, 20, 110, '#ff9a8a', .35); chispas(P.x, P.y, '#e2443c', 24, 240); },
  ejecutar(){
    const e = blanco(100);
    if (!e || e.hp > e.maxHp * .2){ texto(P.x, P.y - 74, 'El objetivo debe tener menos del 20%', '#9a91c2', 13); P.en += 20; return; }
    pose('atk', DUR_ATK); golpeUnico(e, D.fis * 4.5, .2); shake = 8;
  },
  siniestro(){ pose('atk', DUR_ATK * .7); const e = blanco(95); if (golpeUnico(e, D.fis * 1.7, .1)) sumarCombo(1); else { texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.en += 40; } },
  eviscerar(){
    if (!(P.combo > 0)){ texto(P.x, P.y - 74, 'Necesitas puntos de combo', '#9a91c2', 13); P.en += 35; return; }
    const e = blanco(95); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.en += 35; return; }
    const c = gastarCombo(); pose('atk', DUR_ATK); golpeUnico(e, D.fis * (.8 + .95 * c), .1); texto(P.x, P.y - 90, `Eviscerar (${c})`, '#ffe25a', 13);
  },
  picadillo(){
    if (!(P.combo > 0)){ texto(P.x, P.y - 74, 'Necesitas puntos de combo', '#9a91c2', 13); P.en += 25; return; }
    const c = gastarCombo(); ponerEfecto('agi_up', 6 + 3 * c); chispas(P.x, P.y - 20, '#ffe25a', 16, 160);
  },
  patada(){
    const e = blanco(100); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); return; }
    pose('atk', DUR_ATK * .6); golpeUnico(e, D.fis * .5);
    if (e.jefe){ if (e.aviso > 0){ e.aviso = 0; e.cd = 2; texto(e.x, e.y - 70, '¡Interrumpido!', '#ffe25a', 15); } }
    else { e.aturdido = 2; texto(e.x, e.y - 60, 'Aturdido', '#ffe3a1', 13); }
  },
  esfumarse(){ P.inv = Math.max(P.inv, .8); pose('oculto', .5); reducirAmenaza(.2); for (const e of enemigos) if (!e.jefe && e.objetivo === P) e.aggro = false; fxAnillo(P.x, P.y, 36, 4, '#5ad84a', .4); },
  escarcha(){
    pose('atk', DUR_ATK); const a = P.ang;
    proys.push({ x:P.x + Math.cos(a) * 22, y:P.y + Math.sin(a) * 22, vx:Math.cos(a) * 520, vy:Math.sin(a) * 520, r:9, alt:30,
      dmg:D.mag * 1.5, vida:1.1, color:'#9fd8ff', aoe:34, spr:'rayo', esc:.5, lento:2 });
  },
  nova(){ pose('cast', .4); golpeCirculo(P.x, P.y, 130, D.mag * .5); for (const e of enemigos) if (Math.hypot(e.x - P.x, e.y - P.y) < 130 + e.r) e.raiz = e.jefe ? 1 : 3; chispas(P.x, P.y, '#bff0ff', 40, 260); fxAnillo(P.x, P.y, 10, 130, '#c8f0ff', .4); },
  arcana(){ pose('cast', .35); golpeCirculo(P.x, P.y, 120, D.mag * 1.3); chispas(P.x, P.y, '#d08aff', 34, 260); },
  evocacion(){ P.en = Math.min(D.maxEn, P.en + D.maxEn * .5); pose('cast', .8); chispas(P.x, P.y - 20, '#5591ff', 26, 160); },
  bloque(){ ponerEfecto('hielo', 4); P.inv = Math.max(P.inv, 4); chispas(P.x, P.y - 20, '#bff0ff', 30, 180); }
});

// =====================================================
//  PODERES PROPIOS DE CADA CLASE (íconos y efectos en pixel art)
// =====================================================
// íconos de 16×16 dibujados a mano: a contorno, b color principal, c claro, d acento
const GLIFOS = {
  espada:  ['..............aa','.............acа','............acba','...........acba.','..........acba..','.........acba...','..a.....acba....','..aa...acba.....','...aa.acba......','....aacba.......','....adaa........','...adda.a.......','..adda...a......','.adda...........','.aaa............','................'],
  carga:   ['................','........aa......','.......acba.....','......acbba.....','.aaaaacbbbbaaa..','abbbbbbbbbbbbba.','acccccccccccbba.','abbbbbbbbbbbbba.','.aaaaacbbbbaaa..','......acbba.....','.......acba.....','........aa......','................','..d...d...d.....','.d...d...d......','................'],
  hacha:   ['................','.....aaaa.......','....abbbba......','...abccbbba.....','...abcbbbbaa....','...abbbbaa.a....','....abbaa..a....','.....aa...a.....','.........a......','........ada.....','.......ada......','......ada.......','.....ada........','....ada.........','....aa..........','................'],
  estandarte:['................','..a.............','..aaaaaaaaa.....','..abbbbbbba.....','..abbccbbba.....','..abcddcbba.....','..abbccbbba.....','..abbbbbbba.....','..abbbbbbba.....','..abba.abba.....','..aba...aba.....','..a.............','..a.............','..a.............','.aaa............','................'],
  onda:    ['................','................','..a.............','..aba...........','..abba..a.......','..abcba.aba.....','..abccba.aba..a.','..abccba.aba.aba','..abcba.aba..aba','..abba..a....aba','..aba..........a','..a.............','................','.dddddddddddd...','................','................'],
  trueno:  ['................','.......aaaa.....','......abbba.....','.....abbba......','....abbba.......','...abbbbaaaa....','...abccccbba....','....aaaacba.....','.......acba.....','......acba......','.....acba.......','....acba........','....aba.........','....aa..........','................','................'],
  escudo:  ['................','..aaaaaaaaaaaa..','..abbbbbbbbbba..','..abccbbbbddba..','..abcbbbbbddba..','..abbbbbbbddba..','..abbbbbbbbbba..','..abddbbbbbbba..','...abddbbbbba...','...abbbbbbbba...','....abbbbbba....','.....abbbba.....','......abba......','.......aa.......','................','................'],
  llama:   ['.......a........','......aba.......','......aba...a...','.....abba..aba..','..a..abcba.aba..','.aba.abcbaabba..','.abaabccbbabba..','.abbabccdbbbba..','.abbbccddcbbba..','..abbcdddccba...','..abbcddddcba...','...abccddcba....','....abbccba.....','.....aaaaa......','................','................'],
  daga:    ['................','............aa..','...........aca..','..........acba..','.........acba...','........acba....','.......acba.....','......acba......','..aa.acba.......','...aadda........','....adda........','...adaa.........','..ada...........','..aa............','................','................'],
  abanico: ['................','.......a........','......aca.......','..a...aca...a...','.aca..aca..aca..','..aca.aca.aca...','...acaacaaca....','....acbbbca.....','.....abdba......','......aba.......','......aba.......','.......a........','................','................','................','................'],
  gota:    ['.......a........','.......a........','......aba.......','......aba.......','.....abbba......','.....abbba......','....abbbbba.....','....abcbbba.....','...abccbbbba....','...abcbbbbba....','...abbbbbbba....','....abbbbba.....','.....aaaaa......','................','..d.....d.......','................'],
  ojo:     ['................','................','................','....aaaaaaaa....','..aabbbbbbbbaa..','.abbbccccccbbba.','abbbcaaddaacbbba','abbbcaddddacbbba','abbbcaaddaacbbba','.abbbccccccbbba.','..aabbbbbbbbaa..','....aaaaaaaa....','................','..aaaaaaaaaaaa..','................','................'],
  espiral: ['................','.....aaaaaa.....','...aabbbbbbaa...','..abbaaaaaabba..','.abba.aaaa.abba.','.aba.abbbba.aba.','.aba.aba.aba.aba','.aba.aba..a.aba.','.aba.abba..aba..','.abba.abbaabba..','..abba.aabba....','...abba.........','....abbaa.......','.....aaa........','................','................'],
  capa:    ['................','......aaaa......','.....abbbba.....','....abccccba....','....abcaacba....','...abbbbbbbba...','..abbbbbbbbbba..','..abbcbbbbcbba..','.abbcbbbbbbcbba.','.abbbbbbbbbbbba.','.abcbbbbbbbbcba.','abbbbbbbbbbbbbba','abcbbbbbbbbbbcba','aaaaaaaaaaaaaaaa','................','................'],
  calavera:['................','....aaaaaaaa....','...abbbbbbbba...','..abbbbbbbbbba..','..abbcbbbbcbba..','..abaaabbaaaba..','..abaddbbddaba..','..abaaabbaaaba..','..abbbbaabbbba..','...abbbbbbbba...','....abababab....','....abababab....','.....aaaaaa.....','................','................','................'],
  copo:    ['................','.......aa.......','....a..ca..a....','.....acbbca.....','..a..acbbca..a..','...accbccbcca...','.aaacbcddcbcaaa.','.acccbddddbccca.','.aaacbcddcbcaaa.','...accbccbcca...','..a..acbbca..a..','.....acbbca.....','....a..ca..a....','.......aa.......','................','................'],
  nube:    ['................','.....aaaa.......','....abbbba.aa...','..aabbccbbabba..','.abbbccccbbbbba.','abbbbbbbbbbbbba.','abbbbbbbbbbbbba.','.aaaaaaaaaaaaa..','................','..c...c...c.....','.c...c...c...c..','...c...c...c....','..c...c...c.....','................','................','................'],
  cono:    ['................','aa..............','abaa............','abbbaa..........','abccbbaa........','abccccbbaa......','abcdddccbbaa....','abcddddccbbbaa..','abcdddccbbaa....','abccccbbaa......','abccbbaa........','abbbaa..........','abaa............','aa..............','................','................'],
  elemental:['................','......aaaa......','.....abbbba.....','....abccccba....','....abdbbdba....','....abbbbbba....','.....abbbba.....','...aabbccbbaa...','..abbbccccbbba..','..abbbccccbbba..','...abbbccbbba...','....abbbbbba....','.....abbbba.....','......abba......','.......aa.......','................'],
  burbuja: ['................','.....aaaaaa.....','...aaccbbbbaa...','..acc......bba..','..ac........ba..','.ac..........ba.','.ab..........ba.','.ab....dd....ba.','.ab...dddd...ba.','.ab....dd....ba.','.ab..........ba.','..ab........ba..','..abb......bba..','...aabbbbbbaa...','.....aaaaaa.....','................'],
  meteoro: ['................','.d..............','..d..d..........','...dd.d.........','....ddd.........','.....ddaaaa.....','.....aabbbba....','....abbcbbbba...','....abccbbbba...','....abcbbbbba...','....abbbbbbba...','.....abbbbba....','......aaaaa.....','................','................','................'],
  estrella:['.......aa.......','.......ca.......','......acba......','......acba......','..aaaacccbaaaa..','..accccddcccba..','...aacdddcbaa...','.....acdcba.....','....acbaabca....','....aba..aba....','...aba....aba...','...aa......aa...','................','................','................','................'],
  reloj:   ['................','...aaaaaaaaaa...','...abbbbbbbba...','....accccccа....','....abddddba....','.....abddba.....','......abba......','......abba......','.....abccba.....','....abcddcba....','....acddddca....','...abbbbbbbba...','...aaaaaaaaaa...','................','................','................'],
  puno:    ['................','................','....aaaaaa......','...abbbbbba.....','..abcbcbcbba....','..abcbcbcbbaa...','..abbbbbbbbba...','..abcccbbbbba...','..abbbbbbbbba...','...abbbbbbba....','....abbbbba.....','....abbbbba.....','....aaaaaaa.....','................','................','................']
};
// glifos del sacerdote y del arquero
Object.assign(GLIFOS, {
  cruz: ['................', '......aaaa......', '......abca......', '......abca......', '......abca......', '.aaaaaabcaaaaaa.', '.abbbbbddbbbbba.', '.acccccddccccca.', '.aaaaaabcaaaaaa.', '......abca......', '......abca......', '......abca......', '......abca......', '......abca......', '......aaaa......', '................'],
  sol: ['.......d........', '................', '.......d........', '...daaaaaaaad...', '...aabbbbbbaa...', '...abbccccbba...', '...abccccccba...', '...abccccccba...', 'd.dabccccccba.d.', '...abccccccba...', '...abbccccbba...', '...aabbbbbbaa...', '...daaaaaaaad...', '................', '........d.......', '................'],
  halo: ['....aaaaaaaa....', '.aaaaddddddaaaa.', 'aadddaaaaaadddaa', 'adddaa....aaddda', 'aadddaaaaaadddaa', '.aaaaddddddaaaa.', '....aaaaaaaa....', '.....aabbaa.....', '....aabccbaa....', '....abbcbbba....', '...aabbbbbbaa...', '...abbbbbbbba...', '..aabbbbbbbbaa..', '..abbbbbbbbbba..', '..abbbbbbbbbba..', '..aaaaaaaaaaaa..'],
  ala: ['................', '........aaaaaaa.', '......aaabcbbca.', '....aaabbcbbcca.', '...aacbbcbbcbca.', '..aacbbcbbcbbca.', '.aacbbcbbcbbcca.', '.acbbcbbcbbccaa.', '.abbcbbcbbccaa..', '.abcbbcbbccaa...', '.aabbcbbccaa....', '..aacbbccaa.....', '...aabccaa......', '....aaaaa.......', '................', '................'],
  arco: ['...aaa..........', '...acaa.........', '...acbaaa.......', '...acaabaa......', '...acaabbaa.....', '...acaaabbaa....', 'aaaaca.aabbaaaa.', 'acaacaaaabbaadaa', 'adddddddddddddda', 'acaacaaaabbaadaa', 'aaaacaaabbaaaaa.', '...acaabbaa.....', '...acaabaa......', '...acbaaa.......', '...acaa.........', '...aaa..........'],
  flecha: ['................', '..........aaaaa.', '..........accca.', '..........aacca.', '.........aabaca.', '........aabaaaa.', '.......aabaa....', '......aabaa.....', '.....aabaa......', '....aabaa.......', '...aabaa........', 'aaaabaa.........', 'addbaa..........', 'adbda...........', 'aadda...........', '.aaaa...........'],
  trampa: ['................', '................', 'aaaaaaaaaaaaaaaa', 'abbbbbbbbbbbbbba', 'abcacacacacacaba', 'abacacacacacacba', 'abaaaaaaaaaaaaba', 'aba...adda...aba', 'abaaaaaddaaaaaba', 'abacacacacacacba', 'aacacacacacacaaa', 'abbbbbbbbbbbbbba', 'abbbbbbbbbbbbbba', 'aaaaaaaaaaaaaaaa', '................', '................'],
  diana: ['................', '....aaaaaaaa....', '...aaccccccaa...', '..aaccbbbbccaa..', '.aaccbbbbbbccaa.', '.accbbccccbbcca.', '.acbbccddccbbca.', '.acbbcddddcbbca.', '.acbbcddddcbbca.', '.acbbccddccbbca.', '.accbbccccbbcca.', '.aaccbbbbbbccaa.', '..aaccbbbbccaa..', '...aaccccccaa...', '....aaaaaaaa....', '................'],
  serpiente: ['................', '................', '................', '........aaaaaaa.', '.......aabbaadaa', '.......abcbbabba', '......aacccbbaba', '.aaa..abcaacbaaa', '.abaaaacaaaabaa.', '.acbaabca..acba.', '.aabaacaa..aaba.', '..acbbca....aca.', '..aaccaa....aaa.', '...aaaa.........', '................', '................'],
  lluviaf: ['.aaaaa....adbda.', '.adbda....aabaa.', '.aabaa.....aba..', '..aba.aaaaaaba..', '..aba.adbdaaba..', '..aba.aabaaaba..', '..aba..abaaabaa.', '.aabaa.abaacbca.', '.acbca.abaacbca.', '.acbca.abaaacaa.', '.aacaaaabaaaaa..', '..aaa.acbca.....', '......acbca.....', '......aacaa.....', 'aaaaaaaaaaaaaaaa', 'adddddddddddddda']
});
const COLOR_FX = { guerrero:['#e2443c', '#ff9a8a', '#ffffff'], sombra:['#5ad84a', '#c8ff8a', '#ffffff'], mago:['#4f9aff', '#c8f0ff', '#ffffff'], sacerdote:['#ffe066', '#fff2b0', '#ffffff'], arquero:['#ff9a3d', '#ffd9a0', '#ffffff'] };
const colFx = (i = 0) => (COLOR_FX[PJ.clase] || COLOR_FX.mago)[i];
const PALETA_CLASE = {
  guerrero:{ a:'#2a0606', b:'#d8283c', c:'#ff9a8a', d:'#c0c8d8' },
  sombra:  { a:'#100a1e', b:'#5aa83a', c:'#c8ff8a', d:'#b98bff' },
  mago:    { a:'#08142a', b:'#3a8ad8', c:'#c8f0ff', d:'#ffffff' },
  sacerdote:{ a:'#2a1e04', b:'#e8b830', c:'#fff2b0', d:'#ffffff' },
  arquero: { a:'#2a1404', b:'#b8682a', c:'#ffd9a0', d:'#7ad86b' }
};
const ICONOS_PX = {};
function iconoPx(glifo, pal){
  const clave = glifo + JSON.stringify(pal);
  if (ICONOS_PX[clave]) return ICONOS_PX[clave];
  const g = GLIFOS[glifo], c = document.createElement('canvas'); c.width = c.height = 16;
  const a = c.getContext('2d');
  g.forEach((fila, y) => [...fila].forEach((ch, x) => { const col = pal[ch === 'а' ? 'a' : ch]; if (col){ a.fillStyle = col; a.fillRect(x, y, 1, 1); } }));
  return ICONOS_PX[clave] = c;
}

// =====================================================
//  DEVORAR: la habilidad única del gato renacido
//  Los monstruos derrotados a veces dejan su esencia. Al pisarla, el gato la devora;
//  con suficientes esencias de un mismo monstruo aprende su habilidad (se usa con Z).
// =====================================================
const PALETA_DEVORAR = { a:'#1a0828', b:'#8a3ad8', c:'#e0b0ff', d:'#ff5ad0' };
Object.assign(GLIFOS, {
  devorar: ['................','....aaaaaaaa....','..aabbbbbbbbaa..','.abbbbbbbbbbbba.','.abcbcbcbcbcbba.','.ab.c.c.c.c.cba.','.ab..........ba.','.ab...dddd...ba.','.ab..dddddd..ba.','.ab...dddd...ba.','.ab..........ba.','.ab.c.c.c.c.cba.','.abcbcbcbcbcbba.','.abbbbbbbbbbbba.','..aabbbbbbbbaa..','....aaaaaaaa....'],
  salto:   ['................','.......aa.......','......abba......','.....abccba.....','.......bb.......','.......bb.......','................','.....aaaaaa.....','...aabbbbbbaa...','..abbcbbbbcbba..','..abbbbbbbbbba..','.abbbbbbbbbbbba.','.abbbbddbbbbbba.','..abbbbbbbbbba..','...aaaaaaaaaa...','................'],
  tajo:    ['................','.a............a.','.aba........aba.','..abba....abba..','...abca..acba...','....abcaacba....','.....abccba.....','......acca......','......acca......','.....abccba.....','....abcaacba....','...abca..acba...','..abba....abba..','.aba........aba.','.a............a.','................'],
  aguijon: ['................','..........aaa...','.........abcba..','........abcca...','........abca....','.........aba....','..........aba...','...........aba..','...aaa.....aba..','..abbbaa..aba...','.abbbbbbaaba....','.abddbbbbba.....','..abbbbbba......','...aaaaaa.......','................','................'],
  red:     ['c......c......c.','.c.....c.....c..','..c...ccc...c...','...c.c.c.c.c....','....cc.c.cc.....','..ccccccccccc...','....cc.c.cc.....','...c.c.c.c.c....','..c...ccc...c...','.c.....c.....c..','c......c......c.','.......c........','......ada.......','.....adddа......','......ada.......','................'],
  embestida:['................','.........aaaa...','.......aabbbba..','......abbbbbbba.','.....abbbbbbdba.','..c..abbbbbbbba.','.c...abbbbbbcca.','c....abbbbbccca.','.c...abbbbbbbba.','..c..abbbbbbba..','.....abbabbaa...','......aa.aa.....','................','.cccc...........','...cccc.........','................']
});
// lo que aprende de cada monstruo: esencias necesarias, recarga y efecto
const HAB_MONSTRUO = {
  slime:     { n:'Salto viscoso',    ic:'salto',     nec:6, cd:10, d:'Saltas hasta tu objetivo y aplastas a todos a tu alrededor; quedan ralentizados.' },
  mantis:    { n:'Doble tajo',       ic:'tajo',      nec:6, cd:6,  d:'Dos tajos rapidísimos en abanico frente a ti.' },
  escorpion: { n:'Aguijón venenoso', ic:'aguijon',   nec:5, cd:9,  d:'Un aguijonazo en línea que envenena a los enemigos durante 6 s.' },
  arana:     { n:'Red pegajosa',     ic:'red',       nec:5, cd:12, d:'Lanzas una red: los enemigos de la zona quedan atrapados y muy lentos.' },
  jabali:    { n:'Embestida',        ic:'embestida', nec:5, cd:10, d:'Embistes en línea recta y arrollas a todos los enemigos a tu paso.' }
};
const NOMBRE_MON = { slime:'Limo', mantis:'Mantis', escorpion:'Escorpión', arana:'Araña', jabali:'Jabalí' };
const devorarDe = () => (PJ.devorar = PJ.devorar || { esencias:{}, aprendidas:[], equipada:null });

// al morir, a veces deja su esencia (los jefes siempre, y vale por 3)
function soltarEsencia(e){
  const n = sprDe(e);
  if (!HAB_MONSTRUO[n] || (!e.jefe && Math.random() > .32)) return;
  botin.push({ t:'esencia', n, x:e.x + rand(-10, 10), y:e.y + rand(-10, 10), vale:e.jefe ? 3 : 1, t0:performance.now() });
}
function devorarEsencia(o){
  const dv = devorarDe(), H = HAB_MONSTRUO[o.n];
  dv.esencias[o.n] = (dv.esencias[o.n] || 0) + o.vale;
  sfx('devorar', .15); chispas(P.x, P.y - 20, '#b05cff', 22, 220); fxAnillo(P.x, P.y, 10, 60, '#d080ff', .35);
  const n = Math.min(dv.esencias[o.n], H.nec);
  if (!dv.aprendidas.includes(o.n)){
    texto(P.x, P.y - 80, `Devoras: ${NOMBRE_MON[o.n]} ${n}/${H.nec}`, '#d080ff', 14);
    if (dv.esencias[o.n] >= H.nec){
      dv.aprendidas.push(o.n);
      if (!dv.equipada) dv.equipada = o.n;
      sfx('logro'); banner('Habilidad devorada', `${H.n} (tecla Z)`);
      chat(`Has analizado la esencia del ${NOMBRE_MON[o.n].toLowerCase()}: aprendes «${H.n}».`, '#d080ff');
      if (PJ.mascota) chat(`${PJ.mascota.nombre}: «¡Ja! Eso es Devorar. Cuanto más comas, más fuerte serás.»`, '#ff9ad8');
      construirBarra(); renderLibro();
    }
  } else texto(P.x, P.y - 80, `Esencia de ${NOMBRE_MON[o.n]}`, '#d080ff', 13);
  guardar();
}
function dibujarEsencia(o, t){
  const b = 1 + .15 * Math.sin(t / 180 + o.x), y = o.y - 6 + Math.sin(t / 300 + o.x) * 3;
  const g = ctx.createRadialGradient(o.x, y, 1, o.x, y, 20 * b);
  g.addColorStop(0, 'rgba(255,220,255,.95)'); g.addColorStop(.35, 'rgba(176,92,255,.7)'); g.addColorStop(1, 'rgba(90,20,140,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, y, 20 * b, 0, TAU); ctx.fill();
  for (let k = 0; k < 3; k++){ const a = t / 400 + k * 2.1; ctx.fillStyle = '#e0b0ff'; ctx.fillRect(Math.round(o.x + Math.cos(a) * 12), Math.round(y + Math.sin(a) * 7), 2, 2); }
}
// usar la habilidad devorada que está en la Z
function usarDevorada(){
  if (!enJuego || pantallaActual) return;
  const dv = devorarDe(), n = dv.equipada;
  if (!n){ texto(P.x, P.y - 74, 'Aún no has devorado ninguna habilidad', '#9a91c2', 14); return; }
  if (E.tipo !== 'mazmorra'){ texto(P.x, P.y - 74, 'Los poderes solo funcionan dentro de los portales', '#9a91c2', 14); return; }
  if ((P.cdDev || 0) > 0 || P.gcd > 0) return;
  P.cdDev = HAB_MONSTRUO[n].cd * D.cdK; P.gcd = GCD; vibrar(15); sfx('devorar', .1);
  apuntar();
  HAB_DEVORADA[n]();
}
const HAB_DEVORADA = {
  slime(){
    const p = puntoMira(240), x0 = P.x, y0 = P.y, a = Math.atan2(p.y - P.y, p.x - P.x), dist = Math.min(240, Math.hypot(p.x - P.x, p.y - P.y));
    let paso = 0; while (paso < dist && !solidoEn(P.x + Math.cos(a) * 12, P.y + Math.sin(a) * 12)){ P.x += Math.cos(a) * 6; P.y += Math.sin(a) * 6; paso += 6; }
    colisiones(P); P.inv = Math.max(P.inv, .3); pose('atk', .3);
    fxEstela(x0, y0, P.x, P.y, '#6fd36b', .35); fxAnillo(P.x, P.y, 20, 110, '#6fd36b', .4); chispas(P.x, P.y, '#6fd36b', 24, 240); shake = 9;
    golpeCirculo(P.x, P.y, 100, D.poder * 1.7, { lento:2.5 });
  },
  mantis(){
    pose('atk', DUR_ATK); golpeArco(115, 1.9, D.poder * 1.15); fxArco(P.x, P.y, P.ang, 70, 1.9, '#e8e0a0', .2);
    setTimeout(() => { if (!enJuego || E.tipo !== 'mazmorra') return; golpeArco(115, 1.9, D.poder * 1.15); fxArco(P.x, P.y, P.ang + .3, 78, 1.9, '#c9a050', .2); sfx('ataque_sombra'); }, 180);
  },
  escorpion(){
    pose('atk', DUR_ATK); const ux = Math.cos(P.ang), uy = Math.sin(P.ang);
    fxEstela(P.x, P.y - 10, P.x + ux * 170, P.y - 10 + uy * 170, '#ff6a3d', .3);
    for (const e of enemigos){ const px = e.x - P.x, py = e.y - P.y, largo = px * ux + py * uy, lado = Math.abs(px * uy - py * ux);
      if (largo > -10 && largo < 170 + e.r && lado < 30 + e.r){ herir(e, D.poder * 1.1); if (!e.muerto) e.dot = { dps:D.poder * .35, t:6, tick:1, col:'#5aff5a' }; } }
  },
  arana(){
    pose('cast', .35); const p = puntoMira(300);
    zonas.push({ x:p.x, y:p.y, r:95, ticks:4, cada:.5, t:.1, dmg:D.poder * .3, lento:3, col:'#e8e8f0' });
    fxPx.push({ t:'zona', x:p.x, y:p.y, r:95, col:'#e8e8f0', vida:2.1, max:2.1 }); fxEstela(P.x, P.y - 10, p.x, p.y, '#e8e8f0', .3);
  },
  jabali(){
    const a = P.ang, x0 = P.x, y0 = P.y; let paso = 0; const tocados = new Set();
    while (paso < 230 && !solidoEn(P.x + Math.cos(a) * 14, P.y + Math.sin(a) * 14)){
      P.x += Math.cos(a) * 6; P.y += Math.sin(a) * 6; paso += 6;
      for (const e of enemigos){ if (!tocados.has(e) && Math.hypot(e.x - P.x, e.y - P.y) < e.r + P.r + 10){ tocados.add(e); herir(e, D.poder * 1.4); if (!e.jefe && !e.muerto){ e.x += Math.cos(a) * 40; e.y += Math.sin(a) * 40; colisiones(e); e.aturdido = 1; } } }
    }
    colisiones(P); P.inv = Math.max(P.inv, .35); fxEstela(x0, y0, P.x, P.y, '#c08a52', .45); shake = 8; pose('atk', .3);
  }
};
// en el libro de poderes: lo devorado y lo que falta
function libroDevorar(){
  const dv = devorarDe();
  let h = '<div class="wl-sec">Devorar · habilidad única</div>';
  for (const [n, H] of Object.entries(HAB_MONSTRUO)){
    const sabe = dv.aprendidas.includes(n), tiene = Math.min(dv.esencias[n] || 0, H.nec), eq = dv.equipada === n;
    h += `<div class="wl-h ${sabe ? '' : 'bloq'}" title="${H.d}"><canvas data-icono="pxd:${H.ic}" width="80" height="80"></canvas>
      <div><b>${sabe ? H.n : '???'}</b><small>${sabe ? `${NOMBRE_MON[n]} · ${H.cd} s${eq ? ' · tecla Z' : ''}` : `${NOMBRE_MON[n]}: ${tiene}/${H.nec} esencias`}</small></div>
      ${sabe ? `<button class="wl-mas wl-eq" data-dev="${n}" ${eq ? 'disabled' : ''}>${eq ? 'Z' : 'Usar'}</button>` : ''}</div>`;
  }
  return h + '<p class="wl-nota">Los monstruos derrotados a veces dejan su esencia: pásale por encima para devorarla. La habilidad elegida se usa con Z.</p>';
}
function equiparDevorada(n){ devorarDe().equipada = n; construirBarra(); renderLibro(); guardar(); }

// =====================================================
//  CLASES NUEVAS: SACERDOTE Y ARQUERO
// =====================================================
// curar al jugador y a su grupo (el sacerdote sana a todos los que tiene cerca)
function curar(frac, radio = 260){
  const c = Math.round(D.maxHp * frac);
  if (P.hp < D.maxHp){ P.hp = Math.min(D.maxHp, P.hp + c); texto(P.x + rand(-6, 6), P.y - 76, '+' + c, '#7dffa8', 15); }
  for (const g of GRUPO) if (g.vivo && g.hp < g.maxHp && Math.hypot(g.x - P.x, g.y - P.y) < radio){ const n = Math.round(g.maxHp * frac); g.hp = Math.min(g.maxHp, g.hp + n); texto(g.x, g.y - 60, '+' + n, '#7dffa8', 13); }
  pintarGrupo && GRUPO.length && pintarGrupo();
}
function quitarMalos(){ let n = 0; for (const id in estados) if (EFECTOS[id] && EFECTOS[id].malo){ delete estados[id]; n++; } if (n) pintarBuffs(true); return n; }
function sinObjetivo(reintegro = 0){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.en += reintegro; }
// una flecha (o un rayo de luz) desde el gato hacia donde apunta
function disparar(tipo, a, dmg, op = {}){
  const v = op.vel || (tipo === 'flecha' ? 720 : 520);
  const p = { px:tipo, x:P.x + Math.cos(a) * 20, y:P.y + Math.sin(a) * 20, vx:Math.cos(a) * v, vy:Math.sin(a) * v, r:op.r || 7, alt:28,
    dmg, vida:op.vida || .75, color:op.color || (tipo === 'flecha' ? '#ffd9a0' : '#ffe066'), aoe:op.aoe || 16, lento:op.lento };
  if (op.perfora){ p.perfora = true; p.hits = new Set(); }
  proys.push(p);
  return p;
}
Object.assign(HAB, {
  sacerdote1(){ pose('atk', DUR_ATK); disparar('luz', P.ang, D.mag * 1.05, { aoe:36, vida:1.1 }); fxAnillo(P.x + Math.cos(P.ang) * 18, P.y + Math.sin(P.ang) * 10, 12, 4, '#ffe066', .2); },
  sacerdote2(){
    pose('cast', .45); curar(.22);
    golpeCirculo(P.x, P.y, 115, D.mag * 1.2);
    fxAnillo(P.x, P.y, 10, 115, '#ffe066', .45); chispas(P.x, P.y - 20, '#fff2b0', 26, 200);
  },
  arquero1(){ pose('atk', DUR_ATK * .8); disparar('flecha', P.ang + rand(-.03, .03), D.fis * .95); },
  arquero2(){ pose('atk', DUR_ATK); for (let i = -2; i <= 2; i++) disparar('flecha', P.ang + i * .16, D.fis * .85); chispas(P.x + Math.cos(P.ang) * 20, P.y - 20, '#ff9a3d', 10, 120); }
});
Object.assign(PODERES, {
  // sacerdote
  sanar:     { clase:'sacerdote', n:'Sanar',                 d:'Te curas a ti y a tu grupo un 18% de la vida.', nivel:1, cd:0, coste:20, ic:'gota' },
  dolor:     { clase:'sacerdote', n:'Palabra de dolor',      d:'Tu objetivo pierde vida durante 10 s.', nivel:3, cd:0, coste:10, ic:'calavera' },
  fortaleza: { clase:'sacerdote', n:'Fortaleza',             d:'Recibes un 30% menos de daño durante 30 s.', nivel:5, cd:30, coste:15, ic:'escudo' },
  alarido:   { clase:'sacerdote', n:'Alarido psíquico',      d:'Los enemigos cercanos huyen aterrados 3 s.', nivel:8, cd:25, coste:20, ic:'onda' },
  purificar: { clase:'sacerdote', n:'Purificar',             d:'Te quitas venenos y maldiciones y recuperas un 8% de vida.', nivel:10, cd:8, coste:10, ic:'estrella' },
  // arquero
  certero:   { clase:'arquero', n:'Disparo certero',         d:'Una flecha muy poderosa y veloz.', nivel:1, cd:0, coste:30, ic:'diana' },
  conmocion: { clase:'arquero', n:'Disparo de conmoción',    d:'Una flecha que daña y ralentiza 4 s.', nivel:3, cd:8, coste:15, ic:'trueno' },
  marcacaza: { clase:'arquero', n:'Marca del cazador',       d:'Tu objetivo recibe un 30% más de daño durante 15 s.', nivel:5, cd:20, coste:10, ic:'ojo' },
  rafaga:    { clase:'arquero', n:'Ráfaga',                  d:'Disparas tres flechas seguidas a tu objetivo.', nivel:8, cd:10, coste:30, ic:'abanico' },
  fingir:    { clase:'arquero', n:'Fingir muerte',           d:'Te haces el muerto: los enemigos te pierden la pista.', nivel:10, cd:30, coste:0, ic:'calavera' }
});
Object.assign(PODER_FN, {
  sanar(){ pose('cast', .4); curar(.18); fxAnillo(P.x, P.y, 30, 6, '#7dffa8', .35); chispas(P.x, P.y - 30, '#bfffd0', 14, 120); },
  dolor(){ const e = blanco(360); if (!e) return sinObjetivo(10); pose('cast', .3); golpeUnico(e, D.mag * .3); e.dot = { dps:D.mag * .45, t:10, tick:1, col:'#b98bff' }; fxEstela(P.x, P.y - 10, e.x, e.y - 10, '#b98bff', .3); },
  fortaleza(){ ponerEfecto('def_up', 30); fxAnillo(P.x, P.y, 10, 60, '#ffe066', .4); },
  alarido(){ pose('cast', .4); fxAnillo(P.x, P.y, 10, 140, '#b98bff', .45); for (const e of enemigos) if (!e.jefe && Math.hypot(e.x - P.x, e.y - P.y) < 140 + e.r){ e.aturdido = 3; texto(e.x, e.y - 60, 'Aterrado', '#d8b0ff', 13); } },
  purificar(){ const n = quitarMalos(); curar(.08); texto(P.x, P.y - 90, n ? 'Purificado' : 'Nada que purificar', '#fff2b0', 13); chispas(P.x, P.y - 20, '#ffffff', 16, 140); },
  certero(){ pose('atk', DUR_ATK); disparar('flecha', P.ang, D.fis * 2.1, { vel:860, color:'#ffe066' }); },
  conmocion(){ pose('atk', DUR_ATK); disparar('flecha', P.ang, D.fis * 1.1, { lento:4, aoe:28, color:'#9fd8ff' }); },
  marcacaza(){ const e = blanco(420); if (!e) return sinObjetivo(10); e.vuln = 15; texto(e.x, e.y - 64, '¡Marcado!', '#ff9a3d', 14); fxAnillo(e.x, e.y, 40, 8, '#ff9a3d', .5); },
  rafaga(){
    pose('atk', DUR_ATK);
    for (let i = 0; i < 3; i++) setTimeout(() => { if (!enJuego || E.tipo !== 'mazmorra') return; apuntar(); disparar('flecha', P.ang, D.fis * 1.05); sfx('ataque_arquero', .05); }, i * 140);
  },
  fingir(){ P.inv = Math.max(P.inv, 1); pose('oculto', .8); reducirAmenaza(.1); for (const e of enemigos) if (!e.jefe && e.objetivo === P) e.aggro = false; texto(P.x, P.y - 80, 'Fingiendo muerte…', '#c0c8d8', 13); }
});
Object.assign(PODER_FN, {
  escudoluz(){ P.escudo = Math.round(D.maxHp * .25); P.tEscudo = 15; fxAnillo(P.x, P.y, 10, 40, '#ffe066', .4); texto(P.x, P.y - 80, 'Escudo de luz', '#ffe066', 13); },
  fuegosagrado(){
    const e = blanco(360); if (!e) return sinObjetivo(20);
    pose('cast', .35); P.ang = Math.atan2(e.y - P.y, e.x - P.x); herir(e, D.mag * 1.7);
    if (!e.muerto) e.dot = { dps:D.mag * .35, t:6, tick:1, col:'#ffb347' };
    fxPx.push({ t:'haz', x:e.x, y:e.y, col:'#ffb347', ancho:18, vida:.45, max:.45 }); chispas(e.x, e.y - 20, '#ffb347', 18, 180);
  },
  renovar(){
    pose('cast', .3); fxAnillo(P.x, P.y, 10, 50, '#7dffa8', .4);
    fxPx.push({ t:'renovar', vida:12, max:12, tick:1, paso:(f, dt) => { f.tick -= dt; if (f.tick <= 0){ f.tick = 1; curar(.03); } } });
  },
  novasagrada(){ pose('cast', .4); golpeCirculo(P.x, P.y, 140, D.mag * 1.6); curar(.1); fxAnillo(P.x, P.y, 10, 140, '#fff2b0', .45); chispas(P.x, P.y, '#ffe066', 40, 280); shake = 6; },
  pozoluz(){
    pose('cast', .6); const p = puntoMira(320);
    zonas.push({ x:p.x, y:p.y, r:100, ticks:8, cada:.38, t:.15, dmg:D.mag * .65, col:'#ffe066' });
    fxPx.push({ t:'haz', x:p.x, y:p.y, col:'#ffe066', ancho:70, vida:3.1, max:3.1 });
  },
  oracion(){ pose('invocar', .8); quitarMalos(); curar(1, 400); banner('Oración', 'La luz te restaura por completo'); fxAnillo(P.x, P.y, 10, 120, '#ffffff', .6); chispas(P.x, P.y - 30, '#fff2b0', 50, 260); },
  juicio(){
    pose('cast', .6); let n = 0;
    for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - P.x, e.y - P.y) < 340 + e.r && n < 10){
      const blancoE = e, k = n++;
      fxPx.push({ t:'haz', x:e.x, y:e.y, col:'#ffe066', ancho:34, vida:.7 + k * .08, max:.7 + k * .08, paso:(f) => {
        if (f.vida <= .05 && !f.hecho){ f.hecho = true; if (!blancoE.muerto) herir(blancoE, D.mag * 3.2); chispas(f.x, f.y, '#fff2b0', 24, 240); shake = Math.max(shake, 8); } } });
    }
    if (!n) texto(P.x, P.y - 74, 'No hay enemigos cerca', '#9a91c2', 14);
    else banner('¡Juicio final!', 'La luz castiga a tus enemigos');
  },
  flechaarcana(){ pose('atk', DUR_ATK); disparar('flecha', P.ang, D.poder * 1.8, { perfora:true, vel:820, vida:.8, r:12, color:'#b98bff' }); fxAnillo(P.x, P.y, 10, 30, '#b98bff', .25); },
  trampahielo(){
    pose('cast', .3); const p = puntoMira(260);
    for (const e of enemigos) if (Math.hypot(e.x - p.x, e.y - p.y) < 90 + e.r){ e.raiz = e.jefe ? 1 : 3; herir(e, D.poder * .6); }
    zonas.push({ x:p.x, y:p.y, r:90, ticks:5, cada:.5, t:.5, dmg:D.poder * .2, lento:3, col:'#9fd8ff' });
    fxPx.push({ t:'zona', x:p.x, y:p.y, r:90, col:'#9fd8ff', vida:2.5, max:2.5 }); fxEstela(P.x, P.y - 10, p.x, p.y, '#9fd8ff', .3);
  },
  retirada(){
    const x0 = P.x, y0 = P.y, a = P.ang + Math.PI; let paso = 0;
    for (const e of enemigos) if (!e.jefe && Math.hypot(e.x - P.x, e.y - P.y) < 90 + e.r) e.aturdido = 1;
    golpeCirculo(P.x, P.y, 80, D.poder * .5);
    while (paso < 200 && !solidoEn(P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 16)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; }
    colisiones(P); P.inv = Math.max(P.inv, .35); fxEstela(x0, y0, P.x, P.y, '#ffd9a0', .35); pose('oculto', .12);
  },
  volea(){
    pose('cast', .5); const p = puntoMira(330);
    zonas.push({ x:p.x, y:p.y, r:115, ticks:7, cada:.3, t:.25, dmg:D.poder * .75, col:'#ff9a3d' });
    fxPx.push({ t:'flechas', x:p.x, y:p.y, r:115, col:'#ffd9a0', vida:2.3, max:2.3 });
  },
  picadura(){ const e = blanco(380); if (!e) return sinObjetivo(15); pose('atk', DUR_ATK); P.ang = Math.atan2(e.y - P.y, e.x - P.x); disparar('flecha', P.ang, D.fis * .6, { color:'#5aff5a' }); e.dot = { dps:D.fis * .5, t:10, tick:1, col:'#5aff5a' }; },
  rapido(){ ponerEfecto('rapido', 10); chispas(P.x, P.y - 20, '#ffe066', 20, 160); },
  tormentaf(){
    pose('cast', .6); const p = puntoMira(340);
    zonas.push({ x:p.x, y:p.y, r:170, ticks:12, cada:.25, t:.2, dmg:D.poder * .8, col:'#ff5a1e' });
    fxPx.push({ t:'flechas', x:p.x, y:p.y, r:170, col:'#ff9a3d', vida:3.2, max:3.2 }); banner('¡Tormenta de flechas!', '');
  }
});

// los 7 poderes de la barra (Q F R 1 2 3 4), distintos para cada clase; los poderes de sombra compartidos quedan fuera
const PODERES_CLASE = {
  guerrero:[
    ['carga',      'Carga',              'Cargas contra tu objetivo y lo aturdes 1,5 s. Te da 20 de ira.', 2, 10, 0, 'carga', '#e2443c'],
    ['hender',     'Hender',             'Tajo enorme frente a ti que golpea a todos los enemigos.', 4, 4, 20, 'hacha', '#ff8a3d'],
    ['estandarte', 'Estandarte de guerra','Clavas un estandarte 15 s: tú y tu grupo hacéis un 20% más de daño cerca de él.', 6, 25, 10, 'estandarte', '#ffd27a'],
    ['ondachoque', 'Onda de choque',     'Onda frente a ti que daña y aturde 2 s.', 9, 12, 15, 'onda', '#ffd27a'],
    ['atronar',    'Atronar',            'Golpe al suelo que daña y ralentiza a todos a tu alrededor.', 12, 6, 20, 'trueno', '#ffe25a'],
    ['muro',       'Muro de escudo',     'Recibes un 60% menos de daño durante 10 s.', 16, 40, 0, 'escudo', '#c0c8d8'],
    ['avatar',     'Avatar',             'Durante 20 s haces un 25% más de daño y recuperas un 30% de vida.', 20, 90, 0, 'puno', '#ff5a3a']
  ],
  sombra:[
    ['pasosombra', 'Paso de las sombras','Apareces detrás de tu objetivo; tu siguiente golpe es crítico.', 2, 8, 15, 'capa', '#b98bff'],
    ['abanico',    'Abanico de cuchillos','Lanzas cuchillos a todos los enemigos cercanos.', 4, 2, 35, 'abanico', '#c8ff8a'],
    ['venenoletal','Veneno letal',       'Envenenas a tu objetivo: pierde vida durante 8 s. Da 1 punto de combo.', 6, 4, 25, 'gota', '#5aff5a'],
    ['ceguera',    'Ceguera',            'Tu objetivo queda aturdido 4 s.', 9, 20, 20, 'ojo', '#c8ff8a'],
    ['tormenta',   'Tormenta de cuchillas','Durante 6 s, cuchillas giran a tu alrededor y cortan a todos.', 12, 30, 25, 'espiral', '#c8ff8a'],
    ['evasion',    'Evasión',            'Esquivas la mitad de los golpes durante 8 s.', 16, 40, 0, 'capa', '#5aa83a'],
    ['marca',      'Marca de la muerte', 'Tu objetivo recibe un 30% más de daño 15 s y ganas 5 puntos de combo.', 20, 60, 0, 'calavera', '#ff5a7a']
  ],
  mago:[
    ['traslacion', 'Traslación',         'Te teletransportas hacia donde miras.', 2, 10, 10, 'estrella', '#c8f0ff'],
    ['fuego',      'Bola de fuego',      'Bola de fuego que explota y deja quemaduras.', 4, 2, 20, 'llama', '#ff8a1e'],
    ['ventisca',   'Ventisca',           'Hielo cae sobre la zona: daña y ralentiza durante 3 s.', 6, 12, 40, 'nube', '#c8f0ff'],
    ['conofrio',   'Cono de frío',       'Cono helado frente a ti que daña y ralentiza.', 9, 8, 25, 'cono', '#9fd8ff'],
    ['elemental',  'Elemental de agua',  'Invocas un elemental que lanza descargas de escarcha durante 20 s.', 12, 30, 35, 'elemental', '#3a8ad8'],
    ['barrera',    'Barrera de hielo',   'Un escudo absorbe daño igual al 30% de tu vida durante 30 s.', 16, 30, 30, 'burbuja', '#c8f0ff'],
    ['meteoro',    'Meteoro',            'Un meteoro cae sobre la zona y arrasa todo.', 20, 45, 60, 'meteoro', '#ff5a1e']
  ],
  sacerdote:[
    ['escudoluz',  'Palabra de poder: escudo','Un escudo de luz absorbe daño igual al 25% de tu vida durante 15 s.', 2, 12, 20, 'escudo', '#ffe066'],
    ['fuegosagrado','Fuego sagrado',      'Llamas sagradas queman a tu objetivo durante 6 s.', 4, 6, 20, 'llama', '#ffb347'],
    ['renovar',    'Renovar',            'Recuperas vida poco a poco durante 12 s (tú y tu grupo).', 6, 10, 15, 'ala', '#7dffa8'],
    ['novasagrada','Nova sagrada',       'Estallido de luz que daña a los enemigos cercanos y te cura.', 9, 8, 30, 'sol', '#fff2b0'],
    ['pozoluz',    'Pozo de luz',        'Una columna de luz cae sobre la zona y quema a todos durante 3 s.', 12, 14, 35, 'cruz', '#ffe066'],
    ['oracion',    'Oración',            'Recuperas toda tu vida y quitas todos los efectos malos.', 16, 60, 40, 'halo', '#ffffff'],
    ['juicio',     'Juicio final',       'Haces caer pilares de luz sobre todos los enemigos cercanos.', 20, 50, 60, 'sol', '#ffe066']
  ],
  arquero:[
    ['flechaarcana','Disparo arcano',     'Una flecha mágica que atraviesa a todos los enemigos en línea.', 2, 6, 20, 'flecha', '#b98bff'],
    ['trampahielo','Trampa de hielo',    'Lanzas una trampa: congela a los enemigos de la zona y los ralentiza.', 4, 15, 15, 'trampa', '#9fd8ff'],
    ['retirada',   'Retirada',           'Saltas hacia atrás y aturdes 1 s a los enemigos de los que te alejas.', 6, 12, 10, 'ala', '#ffd9a0'],
    ['volea',      'Volea',              'Una lluvia de flechas cae sobre la zona.', 9, 10, 35, 'lluviaf', '#ff9a3d'],
    ['picadura',   'Picadura de serpiente','Envenenas a tu objetivo: pierde vida durante 10 s.', 12, 5, 15, 'serpiente', '#5aff5a'],
    ['rapido',     'Disparo rápido',     'Durante 10 s disparas el doble de rápido.', 16, 40, 0, 'reloj', '#ffe066'],
    ['tormentaf',  'Tormenta de flechas','Una tormenta de flechas arrasa una zona enorme.', 20, 45, 50, 'lluviaf', '#ff5a1e']
  ]
};
// glifos de las 5 habilidades de clase (teclas 5 a 8)
const GLIFO_HAB = { heroico:'espada', grito:'trueno', provocar:'puno', torbellino:'espiral', ejecutar:'hacha', siniestro:'daga', eviscerar:'daga', picadillo:'reloj', patada:'puno', esfumarse:'capa',
  escarcha:'copo', nova:'copo', arcana:'estrella', evocacion:'reloj', bloque:'burbuja',
  sanar:'gota', dolor:'calavera', fortaleza:'escudo', alarido:'onda', purificar:'estrella', certero:'diana', conmocion:'trueno', marcacaza:'ojo', rafaga:'abanico', fingir:'calavera' };
for (const [clase, lista] of Object.entries(PODERES_CLASE)) for (const [id, n, d, nivel, cd, coste, glifo, col] of lista)
  PODERES[id] = { clase, n, d, nivel, cd, coste, ic:'px:' + glifo, col, barra:true };
for (const [id, g] of Object.entries(GLIFO_HAB)) if (PODERES[id]) PODERES[id].ic = 'px:' + g;
const TECLAS_BARRA = ['Q', 'F', 'R', '1', '2', '3', '4'];
function barraDeClase(pj){
  const lista = PODERES_CLASE[pj.clase] || [];
  TECLAS_BARRA.forEach((t, i) => { const id = pj.barra[t]; if (!id || !PODERES[id] || PODERES[id].clase !== pj.clase) pj.barra[t] = lista[i] ? lista[i][0] : null; });
}

// ---------- efectos en pixel art ----------
let fxPx = [];
const PX = 3; // tamaño de cada "píxel" de los efectos
function pxCuadro(x, y, col, t = PX){ ctx.fillStyle = col; ctx.fillRect(Math.round(x / t) * t, Math.round(y / t) * t, t, t); }
function fxArco(x, y, ang, radio, abre, col, vida = .22){ fxPx.push({ t:'arco', x, y, ang, radio, abre, col, vida, max:vida }); }
function fxGrietas(x, y, col, vida = .6){ const r = []; for (let i = 0; i < 7; i++){ const a = rand(0, TAU), l = rand(50, 120), q = []; let px = 0, py = 0; for (let k = 0; k < 6; k++){ px += Math.cos(a + rand(-.4, .4)) * l / 6; py += Math.sin(a + rand(-.4, .4)) * l / 6 * .55; q.push([px, py]); } r.push(q); } fxPx.push({ t:'grietas', x, y, r, col, vida, max:vida }); }
function fxAnillo(x, y, r0, r1, col, vida = .35){ fxPx.push({ t:'anillo', x, y, r0, r1, col, vida, max:vida }); }
function fxEstela(x1, y1, x2, y2, col, vida = .35){ fxPx.push({ t:'estela', x1, y1, x2, y2, col, vida, max:vida }); }
function fxCono(x, y, ang, largo, abre, col, vida = .3){ fxPx.push({ t:'cono', x, y, ang, largo, abre, col, vida, max:vida }); }
function updateFxPx(dt){ for (const f of fxPx){ f.vida -= dt; if (f.paso) f.paso(f, dt); } fxPx = fxPx.filter(f => f.vida > 0); }
function dibujarFxPx(t){
  for (const f of fxPx){
    const k = 1 - f.vida / f.max;
    ctx.globalAlpha = Math.min(1, f.vida / f.max * 2);
    if (f.t === 'anillo'){
      const r = f.r0 + (f.r1 - f.r0) * k, n = Math.max(12, r * .5 | 0);
      for (let i = 0; i < n; i++){ const a = i / n * TAU; pxCuadro(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * .55, i % 3 ? f.col : '#ffffff'); }
    } else if (f.t === 'estela'){
      const n = Math.max(4, Math.hypot(f.x2 - f.x1, f.y2 - f.y1) / 8 | 0);
      for (let i = 0; i <= n; i++){ const u = i / n; if (Math.random() < .7) pxCuadro(f.x1 + (f.x2 - f.x1) * u + rand(-4, 4), f.y1 + (f.y2 - f.y1) * u - 20 + rand(-10, 10), u > .8 ? '#ffffff' : f.col); }
    } else if (f.t === 'cono'){
      for (let i = 0; i < 40; i++){ const d = rand(20, f.largo) * (.4 + k * .6), a = f.ang + rand(-f.abre / 2, f.abre / 2); pxCuadro(f.x + Math.cos(a) * d, f.y + Math.sin(a) * d * .7 - 16, Math.random() < .3 ? '#ffffff' : f.col); }
    } else if (f.t === 'arco'){
      // barrido de un tajo: avanza de un lado al otro dejando estela
      const fin = f.ang - f.abre / 2 + f.abre * Math.min(1, k * 1.5), ini = Math.max(f.ang - f.abre / 2, fin - f.abre * .7);
      for (let a = ini; a <= fin; a += .06){ const u = (a - ini) / Math.max(.01, fin - ini); for (let g = 0; g < 2; g++) pxCuadro(f.x + Math.cos(a) * (f.radio - g * 7), f.y - 20 + Math.sin(a) * (f.radio - g * 7) * .6, u > .75 ? '#ffffff' : f.col); }
    } else if (f.t === 'grietas'){
      for (const q of f.r) for (const [dx, dy] of q) pxCuadro(f.x + dx, f.y + dy, f.col);
    } else if (f.t === 'meteoro'){
      // cae desde arriba, con la sombra que crece en el suelo
      const y = f.y - 420 * (1 - k);
      ctx.globalAlpha = .35 + k * .4; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(f.x, f.y, 18 + k * 50, 6 + k * 18, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#ff5a1e'; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.ellipse(f.x, f.y, 120, 50, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      for (let i = 0; i < 18; i++) pxCuadro(f.x - 30 * (1 - k) + rand(-14, 14), y - 30 + rand(-14, 14), i % 4 ? '#ff5a1e' : '#ffe25a', 5);
      for (let i = 0; i < 10; i++) pxCuadro(f.x - 30 * (1 - k) - i * 8 + rand(-6, 6), y - 40 - i * 10, '#ffb347', 4);
    } else if (f.t === 'zona'){
      // ventisca: copos que caen dentro de un círculo
      ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.ellipse(f.x, f.y, f.r, f.r * .55, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < 22; i++){ const a = rand(0, TAU), d = Math.sqrt(Math.random()) * f.r; pxCuadro(f.x + Math.cos(a) * d, f.y + Math.sin(a) * d * .55 - rand(0, 60), Math.random() < .5 ? '#ffffff' : f.col); }
    } else if (f.t === 'haz'){
      // columna de luz que baja del cielo
      const w = f.ancho * (.6 + .4 * Math.sin(k * Math.PI));
      ctx.globalAlpha = Math.min(1, f.vida / f.max * 2) * .35; ctx.fillStyle = f.col; ctx.fillRect(Math.round(f.x - w / 2), f.y - 420, Math.round(w), 420);
      ctx.globalAlpha = Math.min(1, f.vida / f.max * 2);
      for (let i = 0; i < 14; i++) pxCuadro(f.x + rand(-w / 2, w / 2), f.y - rand(0, 400), Math.random() < .5 ? '#ffffff' : f.col, 4);
      ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(f.x, f.y, w * .9 + 8, (w * .9 + 8) * .4, 0, 0, TAU); ctx.stroke();
    } else if (f.t === 'flechas'){
      // lluvia de flechas: caen en diagonal dentro del círculo
      ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.ellipse(f.x, f.y, f.r, f.r * .55, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < 16; i++){ const a = rand(0, TAU), d = Math.sqrt(Math.random()) * f.r, x = f.x + Math.cos(a) * d, y = f.y + Math.sin(a) * d * .55 - rand(0, 90);
        for (let j = 0; j < 4; j++) pxCuadro(x - j * 3, y - j * 6, j ? '#8a5a2b' : '#ffffff', 3); pxCuadro(x - 12, y - 24, f.col, 3); }
    } else if (f.t === 'estandarte'){
      ctx.globalAlpha = 1; const x = Math.round(f.x), y = Math.round(f.y);
      ctx.drawImage(iconoPx('estandarte', PALETA_CLASE.guerrero), x - 24, y - 60, 48, 48);
      ctx.fillStyle = '#2a1004'; ctx.fillRect(x - 21, y - 14, 3, 14);
      ctx.strokeStyle = 'rgba(255,210,122,.6)'; ctx.setLineDash([4, 6]); ctx.lineDashOffset = -t / 60; ctx.beginPath(); ctx.ellipse(x, y, 160, 70, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  ctx.globalAlpha = 1;
  // aura y cuchillas que siguen al jugador
  if (estados.avatar){ for (let i = 0; i < 6; i++) pxCuadro(P.x + rand(-18, 18), P.y - rand(0, 60), Math.random() < .5 ? '#ff5a3a' : '#ffb347'); }
  if (estados.tormenta){ for (let i = 0; i < 6; i++){ const a = t / 120 + i * TAU / 6; pxCuadro(P.x + Math.cos(a) * 46, P.y - 18 + Math.sin(a) * 22, '#c8ff8a'); pxCuadro(P.x + Math.cos(a - .2) * 46, P.y - 18 + Math.sin(a - .2) * 22, '#ffffff'); } }
  if (P.escudo > 0){ const n = 28; for (let i = 0; i < n; i++){ const a = i / n * TAU + t / 900; pxCuadro(P.x + Math.cos(a) * 30, P.y - 26 + Math.sin(a) * 36, i % 4 ? 'rgba(200,240,255,.75)' : '#ffffff'); } }
  if (estados.muro){ ctx.drawImage(iconoPx('escudo', PALETA_CLASE.guerrero), Math.round(P.x + 12), Math.round(P.y - 70), 24, 24); }
}
// torbellino de escarcha del mago (clic derecho)
function dibujarVortice(p, t, esc){
  const y = p.y - p.alt, R = 34 * esc;
  for (let b = 0; b < 3; b++) for (let i = 0; i < 14; i++){ const a = t / 160 + b * TAU / 3 + i * .22, r = R * (1 - i / 16); pxCuadro(p.x + Math.cos(a) * r, y + Math.sin(a) * r * .8, i < 3 ? '#ffffff' : i < 8 ? '#9fd8ff' : '#4f9aff', i < 6 ? 4 : 3); }
  pxCuadro(p.x - 3, y - 3, '#ffffff', 6);
}
// proyectiles en pixel art (bola de fuego, escarcha, cuchillos)
function dibujarProyPx(p, t){
  const a = Math.atan2(p.vy, p.vx), cols = { fuego:['#ff5a1e', '#ffb347', '#ffe25a'], hielo:['#3a8ad8', '#9fd8ff', '#ffffff'], arcano:['#4f9aff', '#c8f0ff', '#ffffff'], luz:['#e8b830', '#ffe066', '#ffffff'], cuchillo:['#c0c8d8', '#ffffff', '#5aa83a'] }[p.px];
  const y = p.y - (p.alt || 0);
  if (p.px === 'flecha'){
    const c = Math.cos(a), s = Math.sin(a);
    for (let i = 0; i < 7; i++) pxCuadro(p.x - c * i * 4, y - s * i * 4, i === 0 ? '#ffffff' : i < 6 ? '#8a5a2b' : p.color, i === 0 ? 4 : 3);
    pxCuadro(p.x - c * 26 - s * 4, y - s * 26 + c * 4, p.color, 3); pxCuadro(p.x - c * 26 + s * 4, y - s * 26 - c * 4, p.color, 3);
    if (p.perfora) for (let i = 0; i < 3; i++) pxCuadro(p.x - c * rand(0, 30) + rand(-5, 5), y - s * rand(0, 30) + rand(-5, 5), p.color, 3);
    return;
  }
  if (p.px === 'cuchillo'){ for (let i = 0; i < 4; i++) pxCuadro(p.x - Math.cos(a) * i * 4, y - Math.sin(a) * i * 4, i ? cols[0] : cols[1], 3); return; }
  for (let i = 0; i < 8; i++) pxCuadro(p.x - Math.cos(a) * i * 5 + rand(-3, 3), y - Math.sin(a) * i * 5 + rand(-3, 3), cols[Math.min(2, i / 3 | 0)], i < 2 ? 5 : 3);
  for (let i = 0; i < 5; i++) pxCuadro(p.x + rand(-6, 6), y + rand(-6, 6), cols[i % 3], 4);
}
// pequeño elemental de agua en pixel art
function dibujarElemental(s, t){
  const c = iconoPx('elemental', PALETA_CLASE.mago), x = Math.round(s.x), y = Math.round(s.y + 12 + Math.sin(t / 250) * 2);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(s.x, s.y + 12, 16, 5, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = Math.min(1, s.vida / .6); ctx.drawImage(c, x - 24, y - 52, 48, 48); ctx.globalAlpha = 1;
}

// lógica de los poderes nuevos
function objetivoOMira(alcance){ return blanco(alcance) || null; }
function danioZona(x, y, r, dmg, op = {}){ golpeCirculo(x, y, r, dmg, op); }
Object.assign(PODER_FN, {
  // guerrero
  carga(){
    const e = objetivoOMira(320); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.cdP.carga = 0; P.gcd = 0; return; }
    const x0 = P.x, y0 = P.y, a = Math.atan2(e.y - P.y, e.x - P.x), d = Math.hypot(e.x - P.x, e.y - P.y) - e.r - P.r - 4;
    let paso = 0; while (paso < d && !solidoEn(P.x + Math.cos(a) * 12, P.y + Math.sin(a) * 12)){ P.x += Math.cos(a) * 6; P.y += Math.sin(a) * 6; paso += 6; }
    colisiones(P); fxEstela(x0, y0, P.x, P.y, '#e2443c', .4); ganarIra(20);
    if (e.jefe){ if (e.aviso > 0){ e.aviso = 0; e.cd = 2; } } else e.aturdido = 1.5;
    herir(e, D.fis * .8); shake = 8; texto(e.x, e.y - 60, '¡Cargado!', '#ff8a7a', 13);
  },
  hender(){ pose('atk', DUR_ATK); golpeArco(120, 2.2, D.fis * 1.8); fxCono(P.x, P.y, P.ang, 120, 2.2, '#e2443c'); shake = 6; },
  estandarte(){ pose('cast', .4); fxPx.push({ t:'estandarte', x:P.x + 30, y:P.y + 10, vida:15, max:15, paso:(f) => { if (Math.hypot(P.x - f.x, P.y - f.y) < 170) ponerEfecto('atk_up', .6); } }); },
  ondachoque(){
    pose('atk', DUR_ATK); fxCono(P.x, P.y, P.ang, 170, 1.1, '#ff8a7a', .4); shake = 10;
    for (const e of enemigos){ const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy); if (d < 170 + e.r && Math.abs(angDif(Math.atan2(dy, dx), P.ang)) < .55){ herir(e, D.fis * 1.2); if (!e.jefe) e.aturdido = 2; } }
  },
  atronar(){ pose('cast', .35); danioZona(P.x, P.y, 140, D.fis * 1.4, { lento:3 }); fxAnillo(P.x, P.y, 10, 140, '#ff5a4a', .4); shake = 9; },
  muro(){ ponerEfecto('muro', 10); fxAnillo(P.x, P.y, 40, 10, '#c0c8d8', .4); },
  avatar(){ ponerEfecto('avatar', 20); const c = Math.round(D.maxHp * .3); P.hp = Math.min(D.maxHp, P.hp + c); texto(P.x, P.y - 74, '+' + c, '#7dffa8', 16); fxAnillo(P.x, P.y, 10, 90, '#ff5a3a', .5); banner('¡Avatar!', 'Tu furia no conoce límites'); },
  // cazador de sombras
  pasosombra(){
    const e = objetivoOMira(320); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.cdP.pasosombra = 0; P.gcd = 0; P.en += 15; return; }
    const x0 = P.x, y0 = P.y, a = Math.atan2(e.y - P.y, e.x - P.x);
    P.x = e.x + Math.cos(a) * (e.r + 22); P.y = e.y + Math.sin(a) * (e.r + 22); colisiones(P);
    fxEstela(x0, y0, P.x, P.y, '#b98bff', .35); P.critSig = true; P.ang = a + Math.PI; pose('oculto', .15);
  },
  abanico(){ pose('cast', .3); for (const e of enemigos) if (!e.muerto && Math.hypot(e.x - P.x, e.y - P.y) < 140 + e.r){ const a = Math.atan2(e.y - P.y, e.x - P.x); proys.push({ px:'cuchillo', x:P.x, y:P.y, vx:Math.cos(a) * 600, vy:Math.sin(a) * 600, r:6, alt:24, dmg:D.fis * 1.1, vida:.4, color:'#c0c8d8', aoe:1 }); } fxAnillo(P.x, P.y, 10, 140, '#c8ff8a', .3); },
  venenoletal(){ const e = objetivoOMira(110); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); P.en += 25; return; } pose('atk', DUR_ATK * .7); golpeUnico(e, D.fis * .6); e.dot = { dps:D.fis * .45, t:8, tick:0, col:'#5aff5a' }; sumarCombo(1); },
  ceguera(){ const e = objetivoOMira(260); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); return; } if (e.jefe){ texto(e.x, e.y - 60, 'Inmune', '#9a91c2', 13); return; } e.aturdido = 4; texto(e.x, e.y - 60, 'Cegado', '#c8ff8a', 13); fxAnillo(e.x, e.y, 30, 6, '#c8ff8a', .4); },
  tormenta(){ ponerEfecto('tormenta', 6); },
  evasion(){ ponerEfecto('evasion', 8); fxAnillo(P.x, P.y, 10, 50, '#5aa83a', .4); },
  marca(){ const e = objetivoOMira(400); if (!e){ texto(P.x, P.y - 74, 'Sin objetivo', '#9a91c2', 14); return; } e.vuln = 15; P.combo = 5; texto(e.x, e.y - 64, '¡Marcado!', '#ff5a7a', 14); fxAnillo(e.x, e.y, 40, 8, '#ff5a7a', .5); },
  // mago
  traslacion(){ const x0 = P.x, y0 = P.y, a = P.ang; let paso = 0; while (paso < 230 && !solidoEn(P.x + Math.cos(a) * 16, P.y + Math.sin(a) * 16)){ P.x += Math.cos(a) * 8; P.y += Math.sin(a) * 8; paso += 8; } colisiones(P); P.inv = Math.max(P.inv, .3); fxEstela(x0, y0, P.x, P.y, '#c8f0ff', .3); fxAnillo(P.x, P.y, 26, 4, '#ffffff', .3); },
  fuego(){ pose('atk', DUR_ATK); const a = P.ang; proys.push({ px:'fuego', x:P.x + Math.cos(a) * 22, y:P.y + Math.sin(a) * 22, vx:Math.cos(a) * 430, vy:Math.sin(a) * 430, r:10, alt:30, dmg:D.mag * 2, vida:1.2, color:'#ff8a1e', aoe:46, quema:true }); },
  ventisca(){ pose('cast', .6); const p = puntoMira(320); zonas.push({ x:p.x, y:p.y, r:110, ticks:8, cada:.38, t:.2, dmg:D.mag * .6, lento:2, col:'#c8f0ff' }); fxPx.push({ t:'zona', x:p.x, y:p.y, r:110, col:'#c8f0ff', vida:3.1, max:3.1 }); },
  conofrio(){ pose('cast', .35); fxCono(P.x, P.y, P.ang, 150, 1.3, '#9fd8ff', .35); for (const e of enemigos){ const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy); if (d < 150 + e.r && Math.abs(angDif(Math.atan2(dy, dx), P.ang)) < .65){ herir(e, D.mag * 1.5); e.lento = 3; } } },
  elemental(){ pose('invocar', .5); if (soldados.length >= 5) soldados.shift(); soldados.push({ elemental:true, x:P.x - 40, y:P.y + 20, r:14, vida:20, max:20, cd:.5, golpe:0, flip:false, idx:soldados.length }); fxAnillo(P.x - 40, P.y + 20, 30, 4, '#3a8ad8', .4); },
  barrera(){ P.escudo = Math.round(D.maxHp * .3); P.tEscudo = 30; fxAnillo(P.x, P.y, 10, 40, '#c8f0ff', .4); texto(P.x, P.y - 80, 'Barrera de hielo', '#c8f0ff', 13); },
  meteoro(){ pose('cast', .6); const p = puntoMira(340); fxPx.push({ t:'meteoro', x:p.x, y:p.y, vida:1, max:1, paso:(f) => { if (f.vida <= .02 && !f.hecho){ f.hecho = true; golpeCirculo(f.x, f.y, 120, D.mag * 4); fxAnillo(f.x, f.y, 10, 130, '#ff5a1e', .5); chispas(f.x, f.y, '#ff8a1e', 50, 320); shake = 16; } } }); }
});

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
      if (op.quema) e.dot = { dps:dmg * .15, t:5, tick:1, col:'#ff8a1e' };
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
  sfx('golpe', .06);
  if (e.muerto) return;
  dmg *= rand(.9, 1.1) * efMod.dmg() * (e.vuln > 0 ? 1.3 : 1);
  const forzado = !FUENTE && P.critSig && critExtra >= 0; if (forzado) P.critSig = false;
  const crit = forzado || Math.random() < D.crit + critExtra;
  if (crit) dmg *= 1.8;
  e.hp -= dmg; e.flash = .1; e.aggro = true;
  sumarAmenaza(e, FUENTE || P, dmg);
  if (!objetivoValido()) P.objetivo = e;
  ganarIra(3);
  texto(e.x + rand(-8, 8), e.y - e.r - 4, Math.round(dmg), crit ? '#f2c46d' : '#ffffff', crit ? 19 : 14);
  if (e.hp <= 0) matar(e);
}

function matar(e){
  e.muerto = true; PJ.kills++; sfx(e.jefe ? 'jefe' : 'muere', .05); contar('kills'); if (e.jefe) contar('jefes');
  if (M && PJ.mascota) ganarXPMascota(e.jefe ? 25 : 3);
  botinEvento(e);
  soltarEsencia(e);
  avisarHistoria('mata', e);
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
    sfx('nivel');
    derivar(); P.hp = D.maxHp; P.en = recursoLleno();
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
  agi_dn:  { n:'Lentitud',           d:'-35% de velocidad',          ic:'b_agi_dn', malo:true },
  hielo:   { n:'Bloque de hielo',    d:'Inmune al daño',             ic:'b_def_up' },
  muro:    { n:'Muro de escudo',     d:'Recibes 60% menos daño',     ic:'b_def_up' },
  avatar:  { n:'Avatar',             d:'+25% de daño',               ic:'b_atk_up' },
  tormenta:{ n:'Tormenta de cuchillas', d:'Cortas a todos a tu alrededor', ic:'b_atk_up' },
  com_atk: { n:'Bien alimentado',    d:'+10% de daño',               ic:'b_atk_up' },
  com_def: { n:'Bien alimentado',    d:'Recibes 10% menos daño',     ic:'b_def_up' },
  com_vel: { n:'Bien alimentado',    d:'+10% de velocidad y +30% de energía recuperada', ic:'b_agi_up' },
  evasion: { n:'Evasión',            d:'Esquivas la mitad de los golpes', ic:'b_agi_up' },
  rapido:  { n:'Disparo rápido',     d:'Disparas el doble de rápido',  ic:'b_agi_up' }
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
  dmg:   () => (estados.atk_up ? 1.2 : 1) * (estados.atk_dn ? .8 : 1) * (estados.avatar ? 1.25 : 1) * (estados.com_atk ? 1.1 : 1),
  recibe:() => (estados.def_up ? .7 : 1) * (estados.def_dn ? 1.25 : 1) * (estados.muro ? .4 : 1) * (estados.com_def ? .9 : 1),
  vel:   () => (estados.agi_up ? 1.25 : 1) * (estados.agi_dn ? .65 : 1) * (estados.com_vel ? 1.1 : 1),
  regEn: () => (estados.spi_up ? 1.6 : 1) * (estados.spi_dn ? .5 : 1) * (estados.com_vel ? 1.3 : 1)
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
  if (estados.hielo) return;
  if (estados.evasion && Math.random() < .5){ texto(P.x, P.y - 70, 'Esquivado', '#c8ff8a', 13); P.inv = .2; return; }
  if (Math.random() < .05) gastarDur(0, true);
  d *= (1 - D.def) * efMod.recibe();
  if (P.escudo > 0){ const abs = Math.min(P.escudo, d); P.escudo -= abs; d -= abs; texto(P.x + 14, P.y - 60, `(${Math.round(abs)} absorbido)`, '#c8f0ff', 11); if (d <= 0){ P.inv = .2; return; } }
  ganarIra(Math.min(20, d / D.maxHp * 120));
  if (src && !src.jefe){
    const db = DEBUFF_MONSTRUO[sprDe(src)];
    if (db && Math.random() < db[2]) ponerEfecto(db[0], db[1]);
  } else if (src && src.jefe && Math.random() < .25){
    const db = DEBUFF_MONSTRUO[sprDe(src)]; if (db) ponerEfecto(db[0], db[1] + 2);
  }
  if (E.tutorial) d = Math.min(d, P.hp - 1);   // en el prólogo no se muere
  P.hp -= d; P.inv = .45; P.golpe = .2; shake = Math.max(shake, 7); sfx('dano', .1);
  texto(P.x, P.y - 70, Math.round(d), '#ff6b7f', 15);
  chispas(P.x, P.y - 20, '#e2445c', 8, 150);
  if (P.hp <= 0){
    P.hp = 0;
    const perdida = Math.floor(PJ.oro * .15); PJ.oro -= perdida; gastarDur(.1); guardar();
    $('muerteTxt').textContent = (perdida ? `Perdiste ${dineroTxt(perdida)}. ` : '') + 'Tu equipo perdió un 10% de durabilidad. Despertarás en tu cama de la posada.';
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

let reiniciarChat = () => {};
// ventana de chat: se mueve desde la cabecera y cambia de tamaño desde la esquina
(function(){
  const ch = $('chat');
  // en el teléfono el chat guarda su propio lugar y tamaño (se ancla por arriba), sin tocar el de la PC
  const CLAVE = esTactil ? 'rb_chat_tel' : 'rb_chat';
  const guardarChat = () => { try { localStorage.setItem(CLAVE, JSON.stringify({ l:ch.style.left, t:ch.style.top, b:ch.style.bottom, w:ch.style.width, h:ch.style.height, min:ch.classList.contains('min') })); } catch (e) {} };
  try { const g = JSON.parse(localStorage.getItem(CLAVE) || 'null'); if (g){ Object.assign(ch.style, esTactil ? { left:g.l, top:g.t, width:g.w, height:g.h } : { left:g.l, bottom:g.b, width:g.w, height:g.h }); ch.classList.toggle('min', !!g.min); } } catch (e) {}
  reiniciarChat = () => { ch.style.left = ch.style.top = ch.style.bottom = ch.style.width = ch.style.height = ''; ch.classList.remove('min'); $('chatMin').textContent = '–'; guardarChat(); };
  const arrastre = (el, fn) => el.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    e.preventDefault(); const r = ch.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
    const mover = ev => fn(r, ev.clientX - x0, ev.clientY - y0);
    const fin = () => { removeEventListener('pointermove', mover); removeEventListener('pointerup', fin); guardarChat(); };
    addEventListener('pointermove', mover); addEventListener('pointerup', fin);
  });
  if (esTactil){
    arrastre($('chatCab'), (r, dx, dy) => { ch.style.left = clamp(r.left + dx, 0, innerWidth - 80) + 'px'; ch.style.top = clamp(r.top + dy, 0, innerHeight - 30) + 'px'; });
    arrastre($('chatRs'), (r, dx, dy) => { ch.style.width = clamp(r.width + dx, 150, innerWidth - r.left - 4) + 'px'; ch.style.height = clamp(r.height + dy, 60, innerHeight - r.top - 4) + 'px'; });
  } else {
  arrastre($('chatCab'), (r, dx, dy) => { ch.style.left = clamp(r.left + dx, 0, innerWidth - 120) + 'px'; ch.style.bottom = clamp(innerHeight - r.bottom - dy, 0, innerHeight - 60) + 'px'; });
  arrastre($('chatRs'), (r, dx, dy) => { ch.style.width = clamp(r.width + dx, 200, innerWidth - r.left - 8) + 'px'; ch.style.height = clamp(r.height - dy, 90, r.bottom - 8) + 'px'; });
  }
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
  if (timerCampo <= 0){ timerCampo = .25; campo = bfs(E, pcx, pcy); }

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
}

function actualizarJefe(e, dx, dy, d, dt){
  const U = e.blanco || P;
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
    const [vx, vy] = direccionHacia(e, U);
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
  if (d < e.r + U.r + 4 && e.cdGolpe <= 0){ e.cdGolpe = .9; pegar(U, false, e.dmg, e); }
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
  if (!gatosListo || !PJ){ document.addEventListener('gatoslistos', dibujarAvatar, { once:true }); return; }
  // cabeza del gato
  const [sx, sy, w] = cuadroGato(PJ.gato, GATOS_DIR[PJ.gato].q_ab ? 'q_ab' : 'ab', 0), lado = Math.min(w, Math.round(70 / (GATOS_DIR[PJ.gato].k || 1)));
  a.imageSmoothingEnabled = !gatoPx(PJ.gato);
  a.drawImage(hojaJugador(), sx + (w - lado) / 2, sy, lado, lado, 4, 8, 104, 104);
}

const ALTO_GATO_PJ = 62;
// dir: 'ab' de frente, 'ar' de espalda, 'lado'. Si un gato no tiene una vista, usa la más parecida.
function cuadroGato(tipo, dir, i){
  const g = GATOS_DIR[tipo];
  let set = g[dir];
  if (!set || !set.length) set = dir === 'ar' ? (g.lado.length ? g.lado : g.ab) : g.ab;
  return set[((i % set.length) + set.length) % set.length];
}
// =====================================================
//  EQUIPO VISIBLE (pixel art dibujado píxel a píxel)
// =====================================================
// o contorno, W/S hoja clara/oscura, G/g oro, H mango, B/b madera, P páginas, R color de la rareza, r rareza oscura
const EQ_PIX = {
  Espada:   { agarre:15, filas:['...o...','..oWo..','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','..oWSo.','ooGRGoo','oGGGGGo','.oogoo.','..oHo..','..oHo..','..oGo..','...o...'] },
  Daga:     { agarre:8,  filas:['..o..','.oWo.','.oWSo','.oWSo','.oWSo','oGRGo','.oHo.','.oHo.','.oGo.','..o..'] },
  Báculo:   { agarre:14, filas:['..ooo..','.oRRWo.','oRRRRWo','oRRRRRo','orRRRro','.orrro.','..oBo..','..oBo..','..oBo..','..obo..','..oBo..','..oBo..','..oBo..','..obo..','..oBo..','..oBo..','..oBo..','..obo..','...o...'] },
  Arco:     { agarre:9,  filas:['.oo.....','.WoRo...','.W.oBo..','.W.oBo..','.W..oBo.','.W..oBo.','.W...oBo','.W...oBo','.W...oHo','.W...oHo','.W...oHo','.W...oBo','.W...oBo','.W..oBo.','.W..oBo.','.W.oBo..','.W.oBo..','.WoRo...','.oo.....'] },
  Grimorio: { agarre:4,  filas:['ooooooooo','oRRRRRRRo','oRRGGGRRo','oRRGrGRRo','oRRGGGRRo','oRRRRRRRo','oPPPPPPPo','ooooooooo'] },
  Yelmo:    { filas:['......oooooo......','....ooSSSSSSoo....','...oSWWWWWWWSSo...','..oSWWWWWWWWWSSo..','.oSWWWWWWWWWWWSSo.','.oSSSSSSSSSSSSSSo.','oGGGGGGGRRGGGGGGGo','oooooooooooooooooo'] },
  Diadema:  { filas:['o.....o.....o','Go...oRo...oG','oGo.oGGGo.oGo','oGGGGGGGGGGGo','oGRGGGRGGGRGo','ooooooooooooo'] },
  Calabaza: { filas:['.......gg.......','......g.........','..oooooooooooo..','.oOOOOOOOOOOOOo.','oOOyyOOOOOOyyOOo','oOOOyyOOOOyyOOOo','oOOOOOOOOOOOOOOo','oOOyOyyOOyyOyOOo','.oOOyyyyyyyyOOo.','..oooooooooooo..'] },
  Gorro:    { filas:['...........WW...','..........WWW...','........orrro...','......orrrro....','.....orrrrro....','....orrrrrrro...','...orrrrrrrrro..','..WWWWWWWWWWWWW.','.WWWWWWWWWWWWWWW'] },
  Capucha:  { filas:['.........oo......','........oRRo.....','.......oRRRo.....','......oRRRRo.....','.....oRRRRRRo....','....oRRRRRRRo....','...oRRRRRRRRRo...','...oRRRRRRRRRo...','..oGGGGGGGGGGGo..','.orRRRRRRRRRRRro.','ooooooooooooooooo'] }
};
const EQ_COL = { O:'#ff8a1e', y:'#ffe25a', r:'#d8283c', o:'#1a1210', W:'#eef2f6', S:'#9aa6b4', G:'#e8b84a', g:'#9a6a1c', H:'#6b3f1f', B:'#8a5a2b', b:'#5a3816', P:'#efe3c4' };
const EQ_CACHE = new Map();
function pixEquipo(base, rareza){
  const clave = base + rareza;
  if (EQ_CACHE.has(clave)) return EQ_CACHE.get(clave);
  const def = EQ_PIX[base], filas = def.filas, w = Math.max(...filas.map(f => f.length));
  const c = document.createElement('canvas'); c.width = w; c.height = filas.length;
  const a = c.getContext('2d'), R = RAREZAS[rareza] ? RAREZAS[rareza].c : '#9a9a9a';
  // rareza oscura: el mismo color a media luz
  const r = '#' + [1, 3, 5].map(i => Math.round(parseInt(R.slice(i, i + 2), 16) * .55).toString(16).padStart(2, '0')).join('');
  filas.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === '.') return; a.fillStyle = ch === 'R' ? R : ch === 'r' ? r : EQ_COL[ch]; a.fillRect(x, y, 1, 1); }));
  const out = { c, w, h:filas.length, agarre:def.agarre || 0 };
  EQ_CACHE.set(clave, out);
  return out;
}
// tope de la cabeza de un cuadro (fila del primer píxel opaco en la columna del ancla), leído una vez
const TOPE_CACHE = new Map();
function topeCabeza(img, fr){
  const clave = img.src + '|' + fr[0] + ',' + fr[1];
  if (TOPE_CACHE.has(clave)) return TOPE_CACHE.get(clave);
  const [sx, sy, w, h, ax] = fr, c = document.createElement('canvas'); c.width = w; c.height = h;
  const a = c.getContext('2d'); a.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  const d = a.getImageData(0, 0, w, h).data, x = Math.round(ax);
  let y = 0;
  while (y < h && d[(y * w + x) * 4 + 3] < 128) y++;
  TOPE_CACHE.set(clave, y);
  return y;
}
const baseObjeto = o => o && Object.keys(EQ_PIX).find(b => o.nombre.startsWith(b));
// dibuja casco y arma alrededor del gato. El contexto ya está en los pies del gato (y reflejado si mira a la derecha).
// capa 'atras': lo que va detrás del cuerpo (arma en la espalda); 'frente': casco y arma en la mano
function dibujarEquipoGato(c, img, fr, set, esc, equipo, capa){
  if (!equipo || !img.complete) return;
  const [, , w, h, ax, ay] = fr, vista = set.replace('q_', '');
  const arma = equipo.arma, bArma = baseObjeto(arma), cab = equipo.cabeza, bCab = baseObjeto(cab);
  const pinta = (p, x, y) => c.drawImage(p.c, 0, 0, p.w, p.h, Math.round(x), Math.round(y), p.w * esc, p.h * esc);
  const arriba = -ay * esc, mano = arriba + Math.round(h * .74) * esc;
  if (bArma && ((capa === 'atras') === (vista === 'ar'))){
    const p = pixEquipo(bArma, arma.rareza);
    const x = vista === 'ab' ? (w - ax - 7) * esc : vista === 'ar' ? (-ax + 1) * esc - p.w * esc : 3 * esc;
    pinta(p, x, mano - p.agarre * esc);
  }
  if (bCab && capa === 'frente'){
    const p = pixEquipo(bCab, cab.rareza), tope = topeCabeza(img, fr);
    pinta(p, -Math.round(p.w / 2) * esc, arriba + (tope + 5) * esc - p.h * esc);
  }
}

// ---------- textos ya dibujados (rendimiento) ----------
// dibujar letras en el lienzo es caro: los nombres y números que se repiten se dibujan una vez en un lienzo chico y se reutilizan
const ROTULOS = new Map();
let fuentesListas = false;
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fuentesListas = true; ROTULOS.clear(); });
function rotulo(txt, x, y, font, fill, stroke = null, lw = 0, sombra = false){
  txt = String(txt);
  if (!fuentesListas){
    ctx.font = font; ctx.textAlign = 'center';
    if (sombra){ ctx.fillStyle = '#000'; ctx.fillText(txt, x + 1, y + 1); }
    if (stroke){ ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.strokeText(txt, x, y); }
    ctx.fillStyle = fill; ctx.fillText(txt, x, y); return;
  }
  const clave = txt + '|' + font + '|' + fill + '|' + stroke + '|' + lw + '|' + sombra + '|' + DPR;
  let r = ROTULOS.get(clave);
  if (!r){
    if (ROTULOS.size > 600) ROTULOS.clear();
    const m = document.createElement('canvas').getContext('2d'); m.font = font;
    const px = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)[1]), pad = Math.ceil(lw / 2) + 2;
    const w = Math.ceil(m.measureText(txt).width) + pad * 2 + 1, h = Math.ceil(px * 1.35) + pad * 2 + 1, base = pad + Math.ceil(px);
    const c = document.createElement('canvas'); c.width = Math.ceil(w * DPR); c.height = Math.ceil(h * DPR);
    const a = c.getContext('2d'); a.scale(DPR, DPR); a.font = font; a.textAlign = 'center'; a.lineJoin = 'miter';
    if (sombra){ a.fillStyle = '#000'; a.fillText(txt, w / 2 + 1, base + 1); }
    if (stroke){ a.lineWidth = lw; a.strokeStyle = stroke; a.strokeText(txt, w / 2, base); }
    a.fillStyle = fill; a.fillText(txt, w / 2, base);
    r = { c, w, h, base }; ROTULOS.set(clave, r);
  }
  const dx = Math.round((x - r.w / 2) * DPR) / DPR, dy = Math.round((y - r.base) * DPR) / DPR;
  ctx.drawImage(r.c, dx, dy, r.w, r.h);
}
// silueta blanca de una hoja de sprites (para el destello al recibir daño); se calcula una vez por imagen
const SILUETAS = new Map();
function siluetaBlanca(img){
  let c = SILUETAS.get(img);
  if (!c && img.naturalWidth){
    c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const a = c.getContext('2d'); a.drawImage(img, 0, 0); a.globalCompositeOperation = 'source-in'; a.fillStyle = '#fff'; a.fillRect(0, 0, c.width, c.height);
    SILUETAS.set(img, c);
  }
  return c || img;
}
// zarpazo en pixel art: tres garras que barren un arco delante del gato
function zarpazoPixel(x, y, ang, k, col){
  if (k <= .05 || k >= .95) return;
  const tam = 3, arco = 1.7, ini = ang - arco / 2;
  for (let g = 0; g < 3; g++){
    const r = 30 + g * 7, fin = ini + arco * Math.min(1, k * 1.6), desde = Math.max(ini, fin - .9);
    for (let a = desde; a <= fin; a += .07){
      const px = Math.round((x + Math.cos(a) * r) / tam) * tam, py = Math.round((y + Math.sin(a) * r * .6) / tam) * tam;
      const cola = (a - desde) / Math.max(.01, fin - desde);
      ctx.globalAlpha = Math.min(1, .35 + cola) * (k > .7 ? (1 - k) / .3 : 1);
      ctx.fillStyle = cola > .7 ? '#ffffff' : col;
      ctx.fillRect(px, py, tam, tam);
    }
  }
  ctx.globalAlpha = 1;
}
function dibujarJugador(t){
  if (P.inv > 0 && P.golpe > -0.25 && Math.floor(t / 60) % 2 && !gatoPx(PJ.gato)) return;
  const pie = P.y + 13;
  if (!gatosListo){
    ctx.fillStyle = '#120d24'; ctx.strokeStyle = CLASES[PJ.clase].color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(P.x, P.y, P.r, 0, TAU); ctx.fill(); ctx.stroke(); return;
  }
  const GD = GATOS_DIR[PJ.gato], escG = escGato(PJ.gato, ALTO_GATO_PJ / 96);
  // pixel art: caído es el cuadro de frente girado 90° (sin perder píxeles), con la cabeza a la izquierda
  if (P.hp <= 0 && GD.px){
    const [sx, sy, w, h] = GD.ab[0];
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(P.x), Math.round(pie - w * escG / 2)); ctx.rotate(-Math.PI / 2);
    ctx.drawImage(hojaJugador(), sx, sy, w, h, -w * escG / 2, -h * escG / 2, w * escG, h * escG);
    ctx.restore();
    return;
  }
  if (P.hp <= 0 && GD.muerto && GD.muerto.length){
    const [sx, sy, w, h, ax, ay] = GD.muerto[0];
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 30, 7, 0, 0, TAU); ctx.fill();
    ctx.drawImage(imgGato(PJ.gato), sx, sy, w, h, P.x - ax * escG, pie - ay * escG, w * escG, h * escG);
    return;
  }
  const mov = Math.hypot(P.mx, P.my) > .2, pose = P.pose.t > 0 ? P.pose.n : null;
  if (pose === 'oculto') return;
  // hacia dónde mira: al caminar, según el movimiento; al atacar, según donde apunta
  const dirDe = (vx, vy) => Math.abs(vy) > Math.abs(vx) * 1.15 ? (vy < 0 ? 'ar' : 'ab') : 'lado';
  // en diagonal no cambia de vista a cada rato: hace falta un giro claro para pasar de lado a frente/espalda o al revés
  if (mov){
    const ax = Math.abs(P.mx), ay = Math.abs(P.my);
    if (P.dirV === 'lado') { if (ay > ax * 1.5) P.dirV = P.my < 0 ? 'ar' : 'ab'; }
    else if (ax > ay * .9) P.dirV = 'lado';
    else P.dirV = P.my < 0 ? 'ar' : 'ab';
  }
  let dir = P.dirV || 'ab', derecha = !P.mira;
  let f = 0, kx = 1, ky = 1, alza = 0, rot = 0;
  if (pose){
    const k = 1 - P.pose.t / P.pose.dur, s = Math.sin(k * Math.PI);
    dir = dirDe(Math.cos(P.ang), Math.sin(P.ang)); derecha = Math.cos(P.ang) > 0;
    if (pose === 'atk'){ kx = 1 + .12 * s; ky = 1 - .09 * s; rot = dir === 'lado' ? (derecha ? 1 : -1) * .18 * s : 0; alza = dir === 'lado' ? 0 : -6 * s; }
    else { alza = -12 * s; kx = 1 - .06 * s; ky = 1 + .1 * s; }
  } else if (mov){
    // los pasos avanzan según la distancia recorrida
    // un cuadro cada 14 px; rebote suave en cada pisada y leve balanceo al ir de lado
    const k = P.paso / 14;
    f = Math.floor(k);
    alza = -(1 - Math.cos(k * Math.PI * 2)) * 1.1;
    if (dir === 'lado') rot = Math.sin(k * Math.PI) * .035;
    ky = 1 + Math.cos(k * Math.PI * 2) * .015;
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
  // pixel art: la caminata ya trae el rebote en sus cuadros; nada de girar ni estirar (deformaría los píxeles)
  let dxA = 0, dyA = 0, kAtk = 0;
  if (GD.px){
    alza = mov && !pose ? 0 : Math.round(alza);
    if (!mov && !pose) alza = Math.sin(t / 420) > .6 ? -1 : 0;
    rot = 0; kx = 1; ky = 1;
    // ataque: estocada hacia donde apunta (en píxeles enteros); al recibir un golpe, retrocede y tiembla
    if (pose === 'atk'){ kAtk = 1 - P.pose.t / P.pose.dur; const s2 = Math.sin(kAtk * Math.PI); dxA = Math.round(Math.cos(P.ang) * 5 * s2); dyA = Math.round(Math.sin(P.ang) * 3 * s2); alza = 0; }
    if (P.golpe > 0) dxA += Math.floor(t / 45) % 2 ? 2 : -2;
  }
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, setV, fV), esc = escG;
  // sombra y aro con el color de la clase
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(P.x, pie, 17, 6, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = CLASES[PJ.clase].color + '88'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(P.x, pie, 19, 7, 0, 0, TAU); ctx.stroke();
  if (P.golpe > 0 && !GD.px) ctx.globalAlpha = .65;
  // pixel art: tras el destello blanco, parpadea semitransparente mientras es invulnerable
  if (GD.px && P.inv > 0 && P.golpe <= 0 && Math.floor(t / 60) % 2) ctx.globalAlpha = .45;
  ctx.save();
  if (GD.px){ ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(P.x) + dxA, Math.round(pie + alza) + dyA); }
  else ctx.translate(P.x, pie + alza);
  if (rot) ctx.rotate(rot); ctx.scale(flip ? -kx : kx, ky);
  // pixel art: al recibir un golpe parpadea en blanco (silueta) en vez de volverse transparente
  const hojaG = GD.px && P.golpe > 0 && Math.floor(t / 50) % 2 === 0 ? siluetaBlanca(imgGato(PJ.gato)) : hojaJugador();
  const frG = [sx, sy, w, h, ax, ay];
  if (GD.px) dibujarEquipoGato(ctx, imgGato(PJ.gato), frG, setV, esc, PJ.equipo, 'atras');
  ctx.drawImage(hojaG, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  if (GD.px) dibujarEquipoGato(ctx, imgGato(PJ.gato), frG, setV, esc, PJ.equipo, 'frente');
  ctx.restore();
  ctx.globalAlpha = 1;
  if (GD.px && pose === 'atk') zarpazoPixel(Math.round(P.x) + dxA, Math.round(pie) - 26, P.ang, kAtk, CLASES[PJ.clase].color);
  // nombre sobre la cabeza, estilo MMO
  const ny = pie - ALTO_GATO_PJ - 10;
  rotulo(PJ.nombre, P.x, ny, '700 14px Rajdhani, sans-serif', '#7fc8ff', 'rgba(0,0,0,.85)', 3);
  const tit = tituloActual();
  if (tit) rotulo(`«${tit}»`, P.x, ny - 15, '600 12px Rajdhani, sans-serif', '#ffd100', 'rgba(0,0,0,.85)', 3);
  ctx.font = '700 14px Rajdhani, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)';
  if (PJ.hermandad){
    const hy = ny - (tit ? 30 : 15); ctx.font = '600 12px Rajdhani, sans-serif';
    const tx = `<${PJ.hermandad.nombre}>`;
    ctx.strokeText(tx, P.x, hy); ctx.fillStyle = '#7dffa8'; ctx.fillText(tx, P.x, hy);
  }
}

function updateAliados(dt){
  // soldados de sombra
  soldados.forEach((s, i) => {
    s.vida -= dt; s.cd -= dt; s.golpe -= dt;
    if (s.elemental){
      let obj = objetivoValido() ? P.objetivo : null, md = 400;
      if (!obj) for (const e of enemigos){ const d = Math.hypot(e.x - s.x, e.y - s.y); if (d < md && e.aggro){ md = d; obj = e; } }
      const tx = P.x - 50, ty = P.y + 10, dd = Math.hypot(tx - s.x, ty - s.y);
      if (dd > 30){ s.x += (tx - s.x) / dd * Math.min(220, dd * 3) * dt; s.y += (ty - s.y) / dd * Math.min(220, dd * 3) * dt; colisiones(s); }
      if (obj && s.cd <= 0 && Math.hypot(obj.x - s.x, obj.y - s.y) < 420){
        s.cd = 1.4; const a = Math.atan2(obj.y - s.y, obj.x - s.x);
        proys.push({ px:'hielo', x:s.x, y:s.y, vx:Math.cos(a) * 460, vy:Math.sin(a) * 460, r:8, alt:30, dmg:D.mag * .6, vida:1.1, color:'#9fd8ff', aoe:30, lento:1.5 });
      }
      return;
    }
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
      golpeCirculo(z.x, z.y, z.r, z.dmg, z.lento ? { lento:z.lento } : {});
      chispas(z.x + rand(-z.r, z.r) * .7, z.y + rand(-z.r, z.r) * .5, z.col || '#8a6bff', 6, 90);
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
  if (pr.cas) return dibujarPropCasino(pr);
  if (pr.cristal || pr.ratonLibre) return dibujarPropPrologo(pr);
  if (pr.casino){
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, 92, 10, 0, 0, TAU); ctx.fill();
    dibujarCas('fachada', pr.x, pr.y + 4, pr.esc);
    return;
  }
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
CESPED_IMG.src = 'img/px/cesped.png?v=' + VERSION;

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
// Mist (Gato Carmesí) tiene su propia hoja en pixel art: frente, espalda y lado (mirando a la izquierda; se refleja para la derecha), 4 cuadros cada una.
// k: cuánto más chica es su hoja que las de 96 px; px: se dibuja con escala entera y sin suavizar para que los píxeles queden limpios
const MIST_IMG = new Image();
GATOS_DIR[0] = Object.assign({"ab": [[2, 2, 39, 64, 19, 64], [43, 2, 39, 64, 17, 64], [84, 2, 40, 64, 19, 64], [126, 3, 39, 63, 18, 63]], "ar": [[2, 70, 38, 62, 18, 62], [42, 69, 36, 63, 17, 63], [80, 70, 37, 62, 18, 62], [119, 68, 36, 64, 18, 64]], "lado": [[2, 136, 40, 59, 16, 59], [44, 135, 36, 60, 13, 60], [82, 135, 39, 60, 16, 60], [123, 134, 35, 61, 12, 61]]}, { img:MIST_IMG, k:96 / 62, px:true });
// los demás gatos también tienen su hoja propia en pixel art (4 cuadros por vista, 64 px de alto)
const HOJAS_GATO = [[1, 'img/gato-ejecutivo.png', {"ab": [[2, 2, 39, 64, 19, 64], [43, 2, 39, 64, 19, 64], [84, 2, 39, 64, 19, 64], [125, 2, 39, 64, 19, 64]], "ar": [[2, 68, 38, 64, 19, 64], [42, 68, 38, 64, 19, 64], [82, 68, 38, 64, 19, 64], [122, 68, 38, 64, 19, 64]], "lado": [[2, 135, 41, 64, 17, 64], [45, 134, 39, 65, 15, 65], [86, 135, 41, 64, 17, 64], [129, 134, 39, 65, 15, 65]]}], [2, 'img/gato-calico.png', {"ab": [[2, 2, 63, 65, 24, 65], [67, 2, 63, 65, 24, 65], [132, 2, 63, 65, 24, 65], [197, 2, 63, 65, 24, 65]], "ar": [[2, 69, 63, 66, 24, 66], [67, 69, 63, 66, 24, 66], [132, 69, 63, 66, 24, 66], [197, 69, 63, 66, 24, 66]], "lado": [[2, 139, 62, 65, 23, 65], [66, 138, 62, 66, 23, 66], [130, 138, 62, 66, 23, 66], [194, 137, 62, 67, 23, 67]]}], [3, 'img/gato-misterioso.png', {"ab": [[2, 2, 49, 65, 20, 65], [53, 2, 49, 65, 20, 65], [104, 2, 49, 65, 20, 65], [155, 2, 49, 65, 20, 65]], "ar": [[2, 69, 47, 65, 19, 65], [51, 69, 47, 65, 19, 65], [100, 69, 47, 65, 19, 65], [149, 69, 47, 65, 19, 65]], "lado": [[2, 137, 46, 65, 18, 65], [50, 136, 46, 66, 18, 66], [98, 137, 46, 65, 18, 65], [146, 136, 46, 66, 18, 66]]}]];
for (const [i, src, dir] of HOJAS_GATO){ const img = new Image(); img.dataset.src = src; GATOS_DIR[i] = Object.assign(dir, { img, k:96 / 62, px:true }); }
const imgGato = tipo => (GATOS_DIR[tipo] && GATOS_DIR[tipo].img) || GATOS_IMG;
const gatoPx = tipo => !!(GATOS_DIR[tipo] && GATOS_DIR[tipo].px);
// escala de dibujo de un gato a partir de la escala pensada para hojas de 96 px
function escGato(tipo, base){
  const g = GATOS_DIR[tipo] || {}, e = base * (g.k || 1);
  return g.px ? Math.max(1, Math.round(e)) : e;
}
let gatosListo = false, gatosPend = 2 + HOJAS_GATO.length;
const gatoCargado = () => { if (--gatosPend === 0){ gatosListo = true; document.dispatchEvent(new Event('gatoslistos')); } };
GATOS_IMG.onload = gatoCargado; MIST_IMG.onload = gatoCargado;
for (const [i] of HOJAS_GATO){ const im = GATOS_DIR[i].img; im.onload = gatoCargado; im.src = im.dataset.src + '?v=' + VERSION; }
GATOS_IMG.src = 'img/gatos.png';
MIST_IMG.src = 'img/mist.png?v=' + VERSION;
const TIPOS_GATO = ['Gato Carmesí', 'Gato Ejecutivo', 'Gato Calicó', 'Gato Misterioso'];
// Mascotas: 4 ratas con 4 direcciones (ar arriba, ab abajo, iz izquierda, de derecha) de 4 cuadros
// cada cuadro: [x, y, ancho, alto, anclaX, anclaY]
const RATAS_DIR = [{"ar": [[2, 2, 24, 38, 11, 38], [28, 2, 25, 38, 12, 38], [55, 2, 25, 38, 12, 38], [82, 2, 23, 38, 11, 38]], "ab": [[2, 42, 23, 38, 11, 38], [27, 42, 25, 38, 12, 38], [54, 42, 24, 38, 11, 38], [80, 42, 23, 38, 11, 38]], "iz": [[2, 82, 21, 38, 10, 38], [25, 82, 21, 38, 10, 38], [48, 82, 20, 38, 9, 38], [70, 82, 19, 38, 9, 38]], "de": [[2, 122, 22, 38, 10, 38], [26, 122, 23, 38, 11, 38], [51, 122, 22, 38, 10, 38], [75, 122, 21, 38, 9, 38]]}, {"ar": [[2, 162, 23, 38, 11, 38], [27, 162, 24, 38, 11, 38], [53, 162, 23, 38, 11, 38], [78, 162, 23, 38, 11, 38]], "ab": [[2, 202, 23, 38, 11, 38], [27, 202, 24, 38, 11, 38], [53, 202, 23, 38, 11, 38], [78, 202, 22, 38, 11, 38]], "iz": [[2, 242, 24, 38, 12, 38], [28, 243, 22, 37, 11, 37], [52, 242, 22, 38, 10, 38], [76, 242, 21, 38, 10, 38]], "de": [[2, 282, 20, 38, 9, 38], [24, 282, 20, 38, 9, 38], [46, 282, 19, 38, 8, 38], [67, 282, 20, 38, 9, 38]]}, {"ar": [[2, 322, 24, 39, 11, 39], [28, 323, 23, 38, 11, 38], [53, 323, 26, 38, 13, 38], [81, 322, 24, 39, 12, 39]], "ab": [[2, 363, 24, 38, 11, 38], [28, 363, 28, 38, 13, 38], [58, 363, 25, 38, 12, 38], [85, 363, 24, 38, 12, 38]], "iz": [[2, 403, 26, 38, 14, 38], [30, 403, 25, 38, 13, 38], [57, 403, 25, 38, 13, 38], [84, 403, 24, 38, 12, 38]], "de": [[2, 443, 26, 38, 12, 38], [30, 443, 26, 38, 12, 38], [58, 443, 26, 38, 12, 38], [86, 443, 26, 38, 12, 38]]}, {"ar": [[2, 484, 24, 38, 11, 38], [28, 483, 24, 39, 11, 39], [54, 484, 24, 38, 11, 38], [80, 484, 23, 38, 12, 38]], "ab": [[2, 524, 23, 38, 11, 38], [27, 524, 24, 38, 12, 38], [53, 524, 23, 38, 11, 38], [78, 524, 23, 38, 11, 38]], "iz": [[2, 565, 24, 38, 12, 38], [28, 564, 24, 39, 12, 39], [54, 565, 22, 38, 11, 38], [78, 565, 22, 38, 11, 38]], "de": [[2, 605, 24, 38, 12, 38], [28, 605, 24, 38, 11, 38], [54, 605, 23, 38, 11, 38], [79, 605, 23, 38, 10, 38]]}];
const RATAS_IMG = new Image();
let ratasListo = false;
RATAS_IMG.onload = () => ratasListo = true;
RATAS_IMG.src = 'img/ratas.png?v=' + VERSION;
const ALTO_RATA = 40; // alto de la hoja de ratas en pixel art (se dibuja a escala entera)
const TIPOS_RATA = ['Rata Mensajera', 'Rata Quesera', 'Rata Ejecutiva', 'Rata Misteriosa'];
const ALTO_GATO = 40; // altura de la mascota en el mundo
let M = null, gatoElegido = 0;

function toggleMascota(){
  if (!enJuego || pantallaActual) return;
  if (!PJ.mascota){ if (!prologo) abrirElegirMascota(); return; }
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
  $('mTitulo').textContent = 'Tu primera mascota'; $('mDesc').textContent = 'Elige a tu compañero y ponle un nombre. Podrás invocarlo o guardarlo cuando quieras.';
  $('mNombre').placeholder = 'Por ejemplo, Sombrita'; $('btnInvocarPet').textContent = 'Invocar'; $('mEtiqueta').textContent = 'Nombre de tu mascota';
  $('pMascota').querySelector('[data-cerrar]').classList.remove('oculto');
  const cont = $('gatosOpc'); cont.innerHTML = '';
  TIPOS_RATA.forEach((nombre, i) => {
    const b = document.createElement('button'); b.className = 'gato';
    b.setAttribute('aria-pressed', i === gatoElegido);
    const c = document.createElement('canvas'); c.width = 152; c.height = 152;
    b.append(c, document.createTextNode(nombre));
    b.onclick = () => { gatoElegido = i; cont.querySelectorAll('.gato').forEach(x => x.setAttribute('aria-pressed', x === b)); };
    cont.appendChild(b);
    const pintar = () => { const [sx, sy, w, h] = RATAS_DIR[i].ab[0], a = c.getContext('2d'), k = Math.max(1, Math.floor(Math.min(c.width / w, c.height / h) * .9));
      a.clearRect(0, 0, c.width, c.height); a.imageSmoothingEnabled = false; a.drawImage(RATAS_IMG, sx, sy, w, h, (c.width - w * k) / 2, (c.height - h * k) / 2, w * k, h * k); };
    if (ratasListo) pintar(); else RATAS_IMG.addEventListener('load', pintar, { once:true });
  });
  pantalla('pMascota');
}
$('btnInvocarPet').onclick = () => {
  const n = $('mNombre').value.trim();
  if (n.length < 2){ $('mErr').textContent = 'Ponle un nombre de al menos 2 letras.'; return; }
  PJ.mascota = { tipo:gatoElegido, nombre:n, nivel:1, xp:0, hambre:100 };
  if (window.pintarIcoPet) pintarIcoPet();
  pantalla(null);
  if (nombrandoRaton){ const sig = nombrandoRaton; nombrandoRaton = null; guardar(); sig(); return; }
  invocarMascota(false);
  banner(`${n} se une a ti`, esTactil ? 'Toca la huella para invocarlo o guardarlo' : 'Pulsa G o toca la huella para invocarlo o guardarlo');
  guardar();
};

// cada rata ayuda a su manera; sube hasta nivel 10 y con hambre no ayuda
const HAB_MASCOTA = [
  { n:'Recolectora', d:nv => `Atrae hacia ti las monedas y el botín a ${110 + nv * 12} px.` },
  { n:'Curandera',   d:nv => `Cada 25 s te cura un ${(2 + nv * .5).toFixed(1)}% de vida.` },
  { n:'Negociante',  d:nv => `Ganas un ${4 + nv}% más de dinero.` },
  { n:'Sombra',      d:nv => `Muerde a los enemigos cercanos (${12 + nv * 2}% de tu poder).` }
];
const MAX_NV_MASCOTA = 10, xpMascotaSig = nv => 20 * nv;
const mascotaActiva = () => M && PJ.mascota && PJ.mascota.hambre >= 20;
const bonoOroMascota = () => mascotaActiva() && PJ.mascota.tipo === 2 ? (4 + PJ.mascota.nivel) / 100 : 0;
function ganarXPMascota(n){
  const m = PJ.mascota; if (m.nivel >= MAX_NV_MASCOTA) return;
  m.xp += n;
  while (m.nivel < MAX_NV_MASCOTA && m.xp >= xpMascotaSig(m.nivel)){
    m.xp -= xpMascotaSig(m.nivel); m.nivel++;
    if (M){ chispas(M.x, M.y - 15, '#ffd100', 24, 160); texto(M.x, M.y - 50, `¡${m.nombre} sube a nivel ${m.nivel}!`, '#ffd100', 14); }
    chat(`${m.nombre} sube a nivel ${m.nivel}.`, '#ffd100');
  }
  if (m.nivel >= MAX_NV_MASCOTA) m.xp = 0;
}
function alimentarMascota(){
  const m = PJ.mascota;
  if (!m){ texto(P.x, P.y - 74, 'No tienes mascota', '#9a91c2', 14); return false; }
  if (m.hambre >= 100){ texto(P.x, P.y - 74, `${m.nombre} no tiene hambre`, '#9a91c2', 14); return false; }
  m.hambre = 100; ganarXPMascota(15); contar('comida'); sfx('comer');
  const x = M ? M.x : P.x, y = M ? M.y : P.y;
  chispas(x, y - 15, '#ff8fc8', 18, 120); texto(x, y - 50, '♥ ¡Ñam!', '#ff8fc8', 15);
  if (abierta('wPj')) renderPj();
  return true;
}
function habilidadMascota(dt){
  const m = PJ.mascota;
  m.hambre = Math.max(0, m.hambre - dt / 30); // se vacía en unos 50 minutos de juego
  M.tHab = (M.tHab || 0) - dt; M.tHambre = (M.tHambre || 0) - dt;
  if (m.hambre < 20){
    if (M.tHambre <= 0){ M.tHambre = 25; M.frase = '¡Tengo hambre!'; M.tFrase = 3; }
    return;
  }
  if (m.tipo === 0){
    const r = 110 + m.nivel * 12;
    for (const o of botin){
      const dx = P.x - o.x, dy = P.y - o.y, d = Math.hypot(dx, dy);
      if (d >= 100 && Math.hypot(M.x - o.x, M.y - o.y) < r){ o.x += dx / d * 260 * dt; o.y += dy / d * 260 * dt; }
    }
  } else if (m.tipo === 1){
    if (M.tHab <= 0){
      M.tHab = 25;
      if (P.hp < D.maxHp){ const c = Math.round(D.maxHp * (2 + m.nivel * .5) / 100); P.hp = Math.min(D.maxHp, P.hp + c); texto(P.x, P.y - 74, '+' + c, '#7dffa8', 14); chispas(P.x, P.y - 20, '#7dffa8', 10, 100); }
    }
  } else if (m.tipo === 3 && E.tipo === 'mazmorra'){
    if (M.tHab <= 0){
      let obj = null, md = 80;
      for (const e of enemigos){ if (e.muerto) continue; const d = Math.hypot(e.x - M.x, e.y - M.y); if (d < md){ md = d; obj = e; } }
      if (obj){ M.tHab = 1.6; herir(obj, D.poder * (12 + m.nivel * 2) / 100); chispas(obj.x, obj.y - 10, '#b98bff', 10, 140); }
    }
  }
}
function updateMascota(dt){
  if (!M) return;
  M.tFrase = (M.tFrase || 0) - dt;
  habilidadMascota(dt);
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
  // las ratas son pixel art: escala entera, sin estirar; respiran subiendo un píxel
  const px = img === RATAS_IMG, esc = px ? Math.max(1, Math.round(alto / ALTO_RATA)) : alto / 84, dormido = !mov && quieto > 6;
  let kx = 1, ky = 1, sube = 0;
  if (px){ if (!mov) sube = Math.sin(t / (dormido ? 750 : 420)) > .5 ? -esc : 0; }
  else if (!mov){
    const fase = Math.sin(t / (dormido ? 750 : 420));
    if (dormido){ ky = .86 + .025 * fase; kx = 1.07 - .012 * fase; }
    else { ky = 1 + .025 * fase; kx = 1 - .012 * fase; }
  }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, pie, alto * .29 * kx, alto * .1, 0, 0, TAU); c.fill();
  c.save();
  if (px){ c.imageSmoothingEnabled = false; c.translate(Math.round(x), Math.round(pie) + sube); }
  else c.translate(x, pie);
  c.scale(flip ? -kx : kx, ky);
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
  rotulo(PJ.mascota.nombre, M.x, pie - ALTO_GATO - 4, '700 12px Rajdhani, sans-serif', '#e9e4ff', null, 0, true);
  if (M.tFrase > 0) burbuja(M.x, pie - ALTO_GATO - 18, M.frase, Math.min(1, M.tFrase));
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
// brillo redondo ya pintado (se reutiliza en vez de crear un degradado en cada cuadro)
const BRILLOS = {};
function brillo(col, r){
  const k = col + r; if (BRILLOS[k]) return BRILLOS[k];
  const c = document.createElement('canvas'); c.width = c.height = r * 2; const a = c.getContext('2d');
  const g = a.createRadialGradient(r, r, 1, r, r, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  a.fillStyle = g; a.fillRect(0, 0, r * 2, r * 2);
  return BRILLOS[k] = c;
}
function dibujarLucesCiudad(t){
  if (E.tipo !== 'ciudad') return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingEnabled = true;
  const parpadeo = .7 + oscuridad() * 1.2, b = brillo('rgb(255,215,140)', 34);
  ctx.globalAlpha = Math.min(1, .45 * parpadeo);
  for (const f of E.farolas) for (const [dx, dy] of f.luces) ctx.drawImage(b, f.x + dx - 34, f.y + dy - 34, 68, 68);
  ctx.restore();
}

function dibujarPortalCiudad(p, t){
  const R = RANGOS[p.rango], esc = Math.min(1, p.nace / .8);
  dibujarPortal(p.x, p.y, p.rango, t, esc);
  ctx.textAlign = 'center';
  ctx.font = '28px Marcellus, Georgia, serif';
  const letra = p.mundo ? '☠' : p.semanal ? '♛' : R.l;
  ctx.fillStyle = '#000'; ctx.fillText(letra, p.x + 1, p.y - 117 * esc + 1);
  ctx.fillStyle = p.mundo ? '#ff4f6b' : p.semanal ? '#ffd100' : R.color; ctx.fillText(letra, p.x, p.y - 117 * esc);
  ctx.font = '600 13px Rajdhani, sans-serif'; ctx.fillStyle = p.cierra < 30 ? '#ff8a9b' : '#e9e4ff';
  ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3;
  const txt = p.mundo ? `Jefe de mundo: ${jefeMundoNombre()}${jefeMundoHecho() ? ' (derrotado)' : ''}` : p.semanal ? `Titán semanal: ${titanDeLaSemana()}${titanHecho() ? ' (derrotado)' : ''}` : `Rango ${R.l}, se cierra en ${formatoTiempo(p.cierra)}`;
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
const NPC_SPR = {"comandante": [2, 2, 51, 68], "sabia": [55, 2, 48, 68], "panda": [105, 2, 52, 68], "vance": [159, 2, 43, 68], "aiko": [204, 2, 42, 68], "tendera": [248, 2, 50, 68], "herrero": [300, 2, 46, 68], "clienta": [348, 2, 47, 68], "cliente": [397, 2, 44, 68], "leon": [443, 2, 47, 68], "kenji": [492, 2, 46, 68], "bruno": [540, 2, 46, 68], "adolfo": [590, 2, 48, 80, 12]};  // el 5.º valor: píxeles de gorro que el retrato se salta
const NPC_IMG = new Image();
let npcListo = false;
NPC_IMG.onload = () => npcListo = true;
NPC_IMG.src = 'img/npcs.png?v=' + VERSION;
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
CAM_IMG.src = 'img/caminantes.png?v=' + VERSION;
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

// =====================================================
//  SONIDO: efectos y música chiptune generados en el navegador (sin archivos)
// =====================================================
const SON = { ctx:null, master:null, mus:null, fx:null, musica:true, efectos:true, pista:null, sig:0, paso:0, ult:{} };
try { const g = JSON.parse(localStorage.getItem('rb_sonido') || '{}'); if (g.musica === false) SON.musica = false; if (g.efectos === false) SON.efectos = false; } catch (e) {}
function guardarSonido(){ try { localStorage.setItem('rb_sonido', JSON.stringify({ musica:SON.musica, efectos:SON.efectos })); } catch (e) {} }
// el navegador sólo deja sonar después de un toque o una tecla
function iniciarAudio(){
  if (SON.ctx){ if (SON.ctx.state === 'suspended') SON.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  SON.ctx = new AC();
  SON.master = SON.ctx.createGain(); SON.master.gain.value = .8; SON.master.connect(SON.ctx.destination);
  SON.mus = SON.ctx.createGain(); SON.mus.gain.value = SON.musica ? .22 : 0; SON.mus.connect(SON.master);
  SON.fx = SON.ctx.createGain(); SON.fx.gain.value = SON.efectos ? .5 : 0; SON.fx.connect(SON.master);
  setInterval(programarMusica, 100);
}
addEventListener('pointerdown', iniciarAudio); addEventListener('keydown', iniciarAudio);
function tono(f, dur, { tipo = 'square', vol = .3, desde = 0, hasta = null, destino = null, ataque = .005 } = {}){
  const c = SON.ctx, t = c.currentTime + desde, o = c.createOscillator(), g = c.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t);
  if (hasta) o.frequency.exponentialRampToValueAtTime(hasta, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
  o.connect(g); g.connect(destino || SON.fx); o.start(t); o.stop(t + dur + .02);
}
function ruido(dur, { vol = .3, desde = 0, filtro = 1200, q = 1, tipoF = 'bandpass', destino = null } = {}){
  const c = SON.ctx, t = c.currentTime + desde, n = Math.ceil(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; f.type = tipoF; f.frequency.value = filtro; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
  s.connect(f); f.connect(g); g.connect(destino || SON.fx); s.start(t); s.stop(t + dur + .02);
}
const SFX = {
  ataque(){ ruido(.12, { vol:.35, filtro:2600, q:.8 }); tono(520, .08, { tipo:'triangle', vol:.12, hasta:260 }); },
  poder(){ ruido(.35, { vol:.25, filtro:900, q:2 }); tono(220, .35, { tipo:'sawtooth', vol:.12, hasta:660 }); },
  golpe(){ tono(160, .09, { tipo:'square', vol:.18, hasta:70 }); ruido(.06, { vol:.2, filtro:1800 }); },
  dano(){ tono(110, .2, { tipo:'sawtooth', vol:.25, hasta:55 }); ruido(.12, { vol:.25, filtro:500, tipoF:'lowpass' }); },
  muere(){ tono(440, .25, { tipo:'square', vol:.14, hasta:90 }); },
  jefe(){ [196, 247, 294, 392].forEach((f, i) => tono(f, .5, { tipo:'square', vol:.14, desde:i * .12 })); ruido(.6, { vol:.2, filtro:300, tipoF:'lowpass' }); },
  moneda(){ tono(988, .06, { vol:.12 }); tono(1319, .14, { vol:.12, desde:.06 }); },
  botin(){ [523, 659, 784].forEach((f, i) => tono(f, .12, { tipo:'triangle', vol:.18, desde:i * .06 })); },
  nivel(){ [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, .18, { tipo:'square', vol:.12, desde:i * .09 })); },
  logro(){ [784, 988, 1175, 1568].forEach((f, i) => tono(f, .3, { tipo:'triangle', vol:.2, desde:i * .1 })); },
  comer(){ tono(660, .07, { vol:.1 }); tono(880, .07, { vol:.1, desde:.1 }); tono(660, .07, { vol:.1, desde:.2 }); },
  paso(){ ruido(.035, { vol:.05, filtro:E && E.tipo === 'mazmorra' ? 500 : 1400, q:3 }); },
  click(){ tono(1200, .03, { vol:.06 }); },
  // cada clase suena distinto: el guerrero golpea metal, la sombra corta el aire, el mago chisporrotea...
  ataque_guerrero(){ ruido(.16, { vol:.4, filtro:900, q:1.2 }); tono(180, .14, { tipo:'square', vol:.16, hasta:90 }); tono(1400, .05, { tipo:'triangle', vol:.08, desde:.02 }); },
  ataque_sombra(){ ruido(.09, { vol:.32, filtro:4200, q:.6, tipoF:'highpass' }); tono(900, .06, { tipo:'sawtooth', vol:.06, hasta:400 }); },
  ataque_mago(){ tono(660, .12, { tipo:'sine', vol:.14, hasta:1320 }); tono(990, .1, { tipo:'triangle', vol:.08, desde:.03, hasta:1980 }); ruido(.08, { vol:.1, filtro:6000, tipoF:'highpass' }); },
  ataque_sacerdote(){ [1047, 1319].forEach((f, i) => tono(f, .22, { tipo:'sine', vol:.1, desde:i * .04 })); },
  ataque_arquero(){ tono(220, .07, { tipo:'triangle', vol:.18, hasta:140 }); ruido(.12, { vol:.18, filtro:2400, q:3, desde:.02 }); },
  poder_guerrero(){ tono(90, .4, { tipo:'sawtooth', vol:.2, hasta:45 }); ruido(.45, { vol:.3, filtro:400, tipoF:'lowpass' }); },
  poder_sombra(){ ruido(.3, { vol:.22, filtro:1600, q:4 }); tono(440, .28, { tipo:'sawtooth', vol:.08, hasta:110 }); },
  poder_mago(){ [523, 784, 1047].forEach((f, i) => tono(f, .3, { tipo:'triangle', vol:.1, desde:i * .05 })); ruido(.35, { vol:.12, filtro:3000, q:2 }); },
  poder_sacerdote(){ [784, 988, 1175, 1568].forEach((f, i) => tono(f, .5, { tipo:'sine', vol:.09, desde:i * .06, ataque:.04 })); },
  poder_arquero(){ for (let k = 0; k < 3; k++){ tono(240 - k * 20, .07, { tipo:'triangle', vol:.14, desde:k * .07, hasta:150 }); ruido(.1, { vol:.14, filtro:2600, q:3, desde:k * .07 + .02 }); } },
  devorar(){ tono(120, .5, { tipo:'sawtooth', vol:.16, hasta:40 }); ruido(.5, { vol:.18, filtro:700, q:3 }); [392, 523, 659].forEach((f, i) => tono(f, .25, { tipo:'triangle', vol:.12, desde:.35 + i * .08 })); }
};
// el sonido de ataque o de poder propio de la clase (si no tiene, el de siempre)
const sfxClase = base => PJ && SFX[`${base}_${PJ.clase}`] ? `${base}_${PJ.clase}` : base;
// reproduce un efecto (con un mínimo de tiempo entre repeticiones del mismo)
function sfx(n, minimo = .03){
  if (!SON.ctx || !SON.efectos || SON.ctx.state !== 'running') return;
  const ahora = SON.ctx.currentTime;
  if (ahora - (SON.ult[n] || 0) < minimo) return;
  SON.ult[n] = ahora; SFX[n]();
}
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.btn,.wbtn,.wv-x,.micro-btn')) sfx('click'); });

// música: cada lugar tiene su pista (escala, tempo y melodía); se programan las notas un poco por adelantado
const NOTA = n => 440 * Math.pow(2, (n - 69) / 12);
const PISTAS = {
  posada:   { bpm:84,  raiz:57, escala:[0, 2, 4, 7, 9],      mel:[0, 2, 4, 2, 1, 2, 0, -1, 0, 4, 3, 2, 1, 0, 1, -1], bajo:[0, 0, -3, -3, -5, -5, -2, -2], onda:'triangle' },
  ciudad:   { bpm:112, raiz:60, escala:[0, 2, 4, 5, 7, 9, 11], mel:[0, 2, 4, 5, 4, 2, 4, -1, 3, 4, 5, 7, 6, 4, 2, -1], bajo:[0, 0, 5, 5, 3, 3, 4, 4], onda:'square' },
  noche:    { bpm:76,  raiz:57, escala:[0, 2, 3, 5, 7, 8, 10], mel:[4, -1, 2, 3, 2, -1, 0, -1, 4, 5, 4, 2, 3, -1, -1, -1], bajo:[0, 0, 5, 5, 3, 3, 4, 4], onda:'triangle' },
  mazmorra: { bpm:100, raiz:50, escala:[0, 1, 3, 5, 7, 8, 10], mel:[0, -1, 2, 1, 0, -1, 4, 3, 2, -1, 1, 0, -1, 0, 1, 2], bajo:[0, 0, 0, 0, 5, 5, 4, 4], onda:'square' },
  titan:    { bpm:138, raiz:50, escala:[0, 1, 3, 5, 6, 8, 10], mel:[0, 0, 4, 3, 0, 0, 5, 4, 0, 0, 6, 5, 4, 3, 2, 1], bajo:[0, 0, 0, 0, 1, 1, 0, 0], onda:'sawtooth' },
  casino:   { bpm:126, raiz:58, escala:[0, 2, 4, 7, 9, 10],  mel:[0, 2, 4, 3, 5, -1, 4, 2, 0, 2, 4, 5, 3, 2, 1, -1], bajo:[0, 4, 3, 4, 0, 4, 3, 2], onda:'triangle' },
  // prólogo: la calle bajo la lluvia, la Voz del Mundo y la gruta donde renace (también para las escenas de historia)
  lluvia:   { bpm:66,  raiz:57, escala:[0, 2, 3, 5, 7, 8, 10], mel:[4, -1, 3, -1, 2, -1, 0, -1, 2, -1, 3, 2, 0, -1, -1, -1], bajo:[0, 0, 5, 5, 3, 3, 4, 4], onda:'sine', pad:[[0, 2, 4], [5, 7, 9], [3, 5, 7], [4, 6, 8]], lluvia:true },
  eter:     { bpm:56,  raiz:62, escala:[0, 2, 4, 7, 9],      mel:[4, -1, -1, 6, -1, -1, 5, -1, 3, -1, -1, 2, -1, -1, -1, -1], bajo:[0, 0, 0, 0, 3, 3, 3, 3], onda:'sine', pad:[[0, 2, 4], [3, 5, 7]] },
  gruta:    { bpm:80,  raiz:52, escala:[0, 1, 3, 5, 7, 8, 11], mel:[0, -1, 2, -1, 3, 2, -1, -1, 4, -1, 3, -1, 2, 1, -1, -1], bajo:[0, 0, 0, 0, 5, 5, 6, 6], onda:'triangle', pad:[[0, 2, 4], [5, 7, 9]], gota:true },
  menu:     { bpm:72,  raiz:55, escala:[0, 2, 3, 5, 7, 8, 10], mel:[0, -1, 2, -1, 4, -1, 3, 2, 0, -1, 2, -1, 1, -1, -1, -1], bajo:[0, 0, 5, 5, 3, 3, 4, 4], onda:'triangle' }
};
function pistaActual(){
  if (cine){ const esc = cine.lista[cine.e].escena; return esc === 'calle' || esc === 'luces' ? 'lluvia' : esc === 'vacio' || esc === 'recuerdo' || esc === 'alba' ? 'eter' : 'gruta'; }
  if (!enJuego) return 'menu';
  if (E.tutorial || pantallaActual === 'pDialogo' && E.tipo !== 'casino') return 'gruta';
  if (E.tipo === 'mazmorra') return E.semanal ? 'titan' : 'mazmorra';
  if (E.tipo === 'ciudad') return oscuridad() > .3 ? 'noche' : 'ciudad';
  if (E.tipo === 'casino') return 'casino';
  return 'posada';
}
function programarMusica(){
  if (!SON.ctx || SON.ctx.state !== 'running') return;
  if (!SON.musica) return;   // sin música no se programan notas
  const nueva = pistaActual();
  if (nueva !== SON.pista){ SON.pista = nueva; SON.paso = 0; SON.sig = SON.ctx.currentTime + .15; }
  const P0 = PISTAS[SON.pista], corchea = 60 / P0.bpm / 2;
  const nota = (grado, oct = 0) => { const L = P0.escala.length, o = Math.floor(grado / L); return NOTA(P0.raiz + 12 * (o + oct) + P0.escala[((grado % L) + L) % L]); };
  while (SON.sig < SON.ctx.currentTime + .3){
    const i = SON.paso, desde = SON.sig - SON.ctx.currentTime, m = P0.mel[i % P0.mel.length];
    if (m >= 0) tono(nota(m, 1), corchea * .9, { tipo:P0.onda, vol:.16, desde, destino:SON.mus, ataque:.01 });
    if (i % 2 === 0) tono(nota(P0.bajo[(i >> 1) % P0.bajo.length], -1), corchea * 1.8, { tipo:'triangle', vol:.3, desde, destino:SON.mus, ataque:.01 });
    // acordes largos de fondo, lluvia y gotas que caen en la cueva
    if (P0.pad && i % 8 === 0) for (const g of P0.pad[(i >> 3) % P0.pad.length]) tono(nota(g), corchea * 8, { tipo:'sine', vol:.06, desde, destino:SON.mus, ataque:corchea * 2 });
    if (P0.lluvia) ruido(corchea, { vol:.035, filtro:5500, tipoF:'highpass', desde, destino:SON.mus });
    if (P0.gota && i % 5 === 3 && Math.random() < .6) tono(1400 + Math.random() * 700, .12, { tipo:'sine', vol:.07, desde, destino:SON.mus, hasta:900 });
    if (SON.pista === 'mazmorra' || SON.pista === 'titan' || SON.pista === 'ciudad'){
      if (i % 4 === 0) tono(90, .12, { tipo:'sine', vol:.35, hasta:45, desde, destino:SON.mus });
      if (i % 4 === 2) ruido(.05, { vol:.12, filtro:6000, tipoF:'highpass', desde, destino:SON.mus });
    }
    SON.sig += corchea; SON.paso++;
  }
}
function botonesSonido(){
  $('btnMusica').textContent = `Música: ${SON.musica ? 'Activada' : 'Desactivada'}`;
  $('btnEfectos').textContent = `Efectos de sonido: ${SON.efectos ? 'Activados' : 'Desactivados'}`;
  const f = $('btnSonFlot'); f.textContent = SON.musica ? '♪' : '✕♪'; f.setAttribute('aria-pressed', SON.musica);
  f.title = SON.musica ? 'Quitar la música' : 'Poner la música';
  // el cambio se oye al momento (antes se apagaba poco a poco y las notas ya programadas seguían sonando)
  if (SON.ctx){
    const t = SON.ctx.currentTime;
    SON.mus.gain.cancelScheduledValues(t); SON.mus.gain.setValueAtTime(SON.musica ? .22 : 0, t);
    SON.fx.gain.value = SON.efectos ? .5 : 0;
    if (SON.musica){ SON.pista = null; }   // vuelve a empezar la pista desde el principio
  }
}
const alternarMusica = () => { iniciarAudio(); SON.musica = !SON.musica; guardarSonido(); botonesSonido(); };
$('btnMusica').onclick = alternarMusica;
$('btnSonFlot').onclick = alternarMusica;
$('btnEfectos').onclick = () => { SON.efectos = !SON.efectos; guardarSonido(); botonesSonido(); };
botonesSonido();

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

// =====================================================
//  JEFES DE MUNDO Y EVENTOS DE TEMPORADA
// =====================================================
// jefe de mundo: los primeros 20 minutos de cada hora se abre una grieta roja en la ciudad
// el nombre va con el dibujo del jefe de la cueva de tu rango, y cambia de título cada hora
const JEFES_MUNDO = { slime:'Gelatinor', jabali:'Colmillo Ancestral', mantis:'la Mantis Emperatriz', arana:'la Viuda del Abismo' };
const TITULOS_MUNDO = ['el Devorador', 'de la Grieta Roja', 'el Insaciable', 'el Eterno'];
const horaMundo = () => Math.floor(Date.now() / 3600000);
const jefeMundoActivo = () => new Date().getMinutes() < 20;
const jefeMundoNombre = () => { const n = JEFES_MUNDO[JEFE_SPR[Math.min(5, rangoCazador())]] || 'Kragmor'; return `${n[0].toUpperCase() + n.slice(1)}, ${TITULOS_MUNDO[horaMundo() % TITULOS_MUNDO.length]}`; };
const jefeMundoHecho = () => PJ.jefeMundo === horaMundo();
let avisoJefeMundo = -1;
function asegurarGrietaMundo(){
  if (E.tipo !== 'ciudad') return;
  const hay = portales.find(p => p.mundo);
  if (!jefeMundoActivo()){ if (hay) quitarPortal(hay); return; }
  if (hay) return;
  const libres = CIUDAD.puntosPortal.filter(p => p.libre); if (!libres.length) return;
  const punto = libres[libres.length - 1]; punto.libre = false;
  portales.push({ x:punto.x, y:punto.y, punto, rango:Math.min(5, rangoCazador()), cierra:Infinity, nace:0, mundo:true });
  if (avisoJefeMundo !== horaMundo()){ avisoJefeMundo = horaMundo(); banner('¡Un jefe de mundo ha aparecido!', `${jefeMundoNombre()} acecha tras la grieta roja`); chat(`${jefeMundoNombre()} ha abierto una grieta en la ciudad. Reúne fuerzas: es un jefe de mundo.`, '#ff4f6b'); sfx('jefe'); }
}
function hacerJefeMundo(){
  // arena sin monstruos menores: sólo el jefe, mucho más grande y fuerte (vienes con grupo)
  enemigos = enemigos.filter(e => e.jefe);
  const j = jefeVivo; if (!j) return;
  j.hp = j.maxHp = Math.round(j.maxHp * 6); j.dmg *= 1.6; j.r = Math.round(j.r * 1.4); j.xp *= 5; j.oro *= 5;
  j.nombre = jefeMundoNombre(); j.color = '#ff4f6b'; j.mundo = true; E.mundo = true;
  $('jefeNombre').textContent = j.nombre;
  if (!GRUPO.length) crearGrupo();
}
function premioJefeMundo(){
  if (!E.mundo || jefeMundoHecho()) return;
  PJ.jefeMundo = horaMundo(); PJ.jefesMundoTotal = (PJ.jefesMundoTotal || 0) + 1;
  darEmblemas(5, 'jefe de mundo');
  const oro = 30000 * (1 + E.rango); PJ.oro += oro;
  botin.push({ t:'obj', x:E.jefePos.x, y:E.jefePos.y + 20, obj:crearObjeto(E.rango, 3) });
  banner(`¡${jefeMundoNombre()} ha caído!`, `Botín de jefe de mundo: ${dineroTxt(oro)}, 5 emblemas y un objeto épico o mejor.`);
}

// eventos de temporada (según la fecha real): adornos en la ciudad, un objeto que sueltan los monstruos y un puesto para canjearlo
const EVENTOS = [
  { id:'animas',   n:'Festival de las Ánimas', desde:[10, 1],  hasta:[11, 2],  objeto:'caramelo', adorno:'calabaza', col:'#ff8a1e',
    ofertas:[{ n:'Sombrero de calabaza', d:'Pieza de cabeza del festival.', precio:15, dar:() => ({ slot:'cabeza', nombre:'Calabaza del festival', base:'Calabaza' }) },
             { n:'Galletas de queso ×3', d:'Para tu mascota.', precio:5, dar:() => { darApilable('queso', 3); } },
             { n:'Tinte Calabaza', d:'Tiñe tu ropa de naranja.', precio:10, dar:() => { if (!PJ.tintes.includes('calabaza')) PJ.tintes.push('calabaza'); } }] },
  { id:'invierno', n:'Gran Invierno',          desde:[12, 15], hasta:[1, 2],   objeto:'regalo',   adorno:'arbol',    col:'#9fd8ff',
    ofertas:[{ n:'Gorro de invierno', d:'Pieza de cabeza del festival.', precio:15, dar:() => ({ slot:'cabeza', nombre:'Gorro del Gran Invierno', base:'Gorro' }) },
             { n:'Galletas de queso ×3', d:'Para tu mascota.', precio:5, dar:() => { darApilable('queso', 3); } }] },
  { id:'amor',     n:'Amor en el aire',        desde:[2, 7],   hasta:[2, 14],  objeto:'bombon',   adorno:'corazon',  col:'#ff8fc8',
    ofertas:[{ n:'Diadema de corazones', d:'Pieza de cabeza del festival.', precio:12, dar:() => ({ slot:'cabeza', nombre:'Diadema del amor', base:'Diadema' }) },
             { n:'Galletas de queso ×3', d:'Para tu mascota.', precio:5, dar:() => { darApilable('queso', 3); } }] },
  { id:'solsticio',n:'Fuegos del Solsticio',   desde:[6, 21],  hasta:[7, 5],   objeto:'brasa',    adorno:'hoguera',  col:'#ffb347',
    ofertas:[{ n:'Corona de llamas', d:'Pieza de cabeza del festival.', precio:12, dar:() => ({ slot:'cabeza', nombre:'Corona del Solsticio', base:'Diadema' }) },
             { n:'Galletas de queso ×3', d:'Para tu mascota.', precio:5, dar:() => { darApilable('queso', 3); } }] }
];
function eventoActual(){
  const d = new Date(), md = (d.getMonth() + 1) * 100 + d.getDate();
  return EVENTOS.find(ev => { const a = ev.desde[0] * 100 + ev.desde[1], b = ev.hasta[0] * 100 + ev.hasta[1]; return a <= b ? md >= a && md <= b : md >= a || md <= b; }) || null;
}
Object.assign(APILABLES, {
  caramelo: { n:'Caramelo de las Ánimas', d:'Moneda del Festival de las Ánimas. Se canjea en el puesto de la plaza.', valor:50, r:1 },
  regalo:   { n:'Regalo del Gran Invierno', d:'Moneda del Gran Invierno. Se canjea en el puesto de la plaza.', valor:50, r:1 },
  bombon:   { n:'Bombón', d:'Moneda de Amor en el aire. Se canjea en el puesto de la plaza.', valor:50, r:1 },
  brasa:    { n:'Brasa del Solsticio', d:'Moneda de los Fuegos del Solsticio. Se canjea en el puesto de la plaza.', valor:50, r:1 }
});
TINTES.push({ id:'calabaza', n:'Calabaza', c:[240, 120, 20], evento:true });
// los monstruos sueltan el objeto del evento
function botinEvento(e){
  const ev = eventoActual(); if (!ev) return;
  if (Math.random() < (e.jefe ? 1 : .25)) botin.push({ t:'cons', x:e.x + rand(-16, 16), y:e.y + rand(-16, 16), k:ev.objeto });
}
// puesto del evento junto a la estatua
const PUESTO = { x:16.6 * T, y:17.2 * T };
function abrirPuestoEvento(msg){
  const ev = eventoActual(); if (!ev) return;
  const n = (PJ.mats || {})[ev.objeto] || 0;
  let h = `<p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tienes (${APILABLES[ev.objeto].n})</span><b style="color:${ev.col}">${ic3(ev.objeto) || ''} ${n}</b></div>
    <p class="nota" style="margin:6px 0">Los monstruos sueltan ${APILABLES[ev.objeto].n.toLowerCase()}s mientras dure el festival (los jefes siempre).</p><div class="emb-lista">`;
  ev.ofertas.forEach((o, i) => { h += `<div class="emb-fila"><div><b style="color:${ev.col}">${o.n}</b><small>${o.d}</small></div><button class="btn" data-of="${i}" ${n < o.precio ? 'disabled' : ''}>${o.precio}</button></div>`; });
  $('evCuerpo').innerHTML = h + '</div>';
  $('evTitulo').textContent = ev.n;
  $('evCuerpo').querySelectorAll('[data-of]').forEach(b => b.onclick = () => {
    const o = ev.ofertas[+b.dataset.of]; if (((PJ.mats || {})[ev.objeto] || 0) < o.precio) return;
    const r = o.dar();
    if (r && r.slot){
      if (PJ.bolsa.length >= TAM_BOLSA){ abrirPuestoEvento('Tu mochila está llena.'); return; }
      const nv = Math.max(1, PJ.nivel), it = asegurarDur({ id:'ev-' + Date.now().toString(36) + (uidObj++), slot:r.slot, nombre:r.nombre, rareza:2, nivel:nv, stats:{ vit:Math.round(3 + nv * .6) } });
      PJ.bolsa.push(it);
    }
    PJ.mats[ev.objeto] -= o.precio; if (PJ.mats[ev.objeto] <= 0) delete PJ.mats[ev.objeto];
    guardar(); sfx('botin'); abrirPuestoEvento(`Canjeaste: ${o.n}.`);
  });
  pantalla('pEvento');
}
// adornos en pixel art del evento (se dibujan en la ciudad)
const ADORNOS = {
  calabaza:['....gg....','...g......','.oooooooo.','oOOOOOOOOo','oOyOOOOyOo','oOyyOOyyOo','oOOOOOOOOo','oOyOyyOyOo','oOOyyyyOOo','.oooooooo.'],
  arbol:   ['.....Y.....','....gGg....','...gGGGg...','....gGg....','...gGrGGg..','..gGGGGGGg.','...gGGbGg..','..gGgGGGGg.','.gGGGGrGGGg','gGGbGGGGGGg','.....tt....','....tttt...'],
  corazon: ['.rr.rr.','rRRrRRr','rRRRRRr','.rRRRr.','..rRr..','...r...'],
  hoguera: ['....y....','...yOy...','..yOOOy..','..OOrOO..','.yOrrrOy.','ttOrrrOtt','.tttttt..']
};
const ADORNO_COL = { o:'#3a1a04', O:'#ff8a1e', y:'#ffe25a', g:'#1f6a2a', G:'#2fa040', Y:'#ffe25a', r:'#e02a3a', b:'#4f8aff', t:'#6b3f1f', R:'#ff5a7a' };
const ADORNO_CV = {};
function lienzoAdorno(n){
  if (ADORNO_CV[n]) return ADORNO_CV[n];
  const f = ADORNOS[n], c = document.createElement('canvas'); c.width = Math.max(...f.map(r => r.length)); c.height = f.length;
  const a = c.getContext('2d'); f.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '.'){ a.fillStyle = ADORNO_COL[ch]; a.fillRect(x, y, 1, 1); } }));
  return ADORNO_CV[n] = c;
}
function dibujarAdornosEvento(t){
  const ev = eventoActual(); if (!ev || E.tipo !== 'ciudad') return;
  const c = lienzoAdorno(ev.adorno), esc = ev.adorno === 'arbol' ? 4 : 3;
  ctx.save(); ctx.imageSmoothingEnabled = false;
  const pon = (x, y, conBrillo) => {
    x = Math.round(x); y = Math.round(y);
    if (conBrillo){ ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25 + .1 * Math.sin(t / 300 + x); ctx.imageSmoothingEnabled = true; ctx.drawImage(brillo(ev.col, 34), x - 34, y - c.height * esc / 2 - 34, 68, 68); ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    ctx.drawImage(c, x - c.width * esc / 2, y - c.height * esc, c.width * esc, c.height * esc);
  };
  for (const f of E.farolas || []) pon(f.x + 22, f.y + 6, ev.adorno !== 'arbol');
  // puesto del festival
  ctx.fillStyle = '#5a3816'; ctx.fillRect(PUESTO.x - 30, PUESTO.y - 26, 60, 26);
  ctx.fillStyle = ev.col; for (let i = 0; i < 6; i++) ctx.fillRect(PUESTO.x - 34 + i * 12, PUESTO.y - 40, 10, 12);
  ctx.fillStyle = '#2a1608'; ctx.fillRect(PUESTO.x - 32, PUESTO.y - 28, 64, 3);
  pon(PUESTO.x - 18, PUESTO.y - 26, false); pon(PUESTO.x + 18, PUESTO.y - 26, false);
  ctx.restore();
  ctx.font = '700 13px Rajdhani, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)';
  ctx.strokeText(ev.n, PUESTO.x, PUESTO.y - 48); ctx.fillStyle = ev.col; ctx.fillText(ev.n, PUESTO.x, PUESTO.y - 48);
}
// la interacción del puesto existe sólo mientras dure un evento
function asegurarPuesto(){
  if (E.tipo !== 'ciudad') return;
  const ev = eventoActual(), it = E.inter.find(i => i.puesto);
  if (ev && !it) E.inter.push({ puesto:true, x:PUESTO.x, y:PUESTO.y + 10, r:60, texto:`Puesto del ${ev.n}`, accion:() => abrirPuestoEvento() });
  if (!ev && it) E.inter = E.inter.filter(i => i !== it);
}

// =====================================================
//  AMBIENTE: HUELLAS, POLVO, DÍA Y NOCHE Y CLIMA
// =====================================================
let huellas = [], clima = [], ultimaHuella = 0, ladoHuella = 1, tClima = 0;
const CICLO_DIA = 600; // segundos reales que dura un día completo en la ciudad
// 0 = mediodía, .5 = medianoche
const horaDelDia = () => (Date.now() / 1000 % CICLO_DIA) / CICLO_DIA;
// oscuridad de la noche (0 de día, hasta .62 a medianoche)
const oscuridad = () => Math.pow(Math.max(0, -Math.cos(horaDelDia() * TAU)), .7) * .62;
// llueve en la ciudad en tandas de 3 minutos (una de cada cuatro, siempre las mismas para todos)
const lloviendo = () => { const b = Math.floor(Date.now() / 180000); return (Math.imul(b, 2654435761) >>> 16) % 4 === 0; };
const sueloConHuellas = () => E.tipo === 'ciudad' || E.tipo === 'mazmorra';

// al caminar: una huella cada 20 px y un poco de polvo en los pies
function ambientePaso(){
  if (!sueloConHuellas() || P.paso - ultimaHuella < 20) return;
  ultimaHuella = P.paso; ladoHuella = -ladoHuella; contar('pasos'); sfx('paso');
  const v = Math.hypot(P.vx, P.vy) || 1, nx = -P.vy / v, ny = P.vx / v, pie = P.y + 12;
  huellas.push({ x:Math.round(P.x + nx * 4 * ladoHuella), y:Math.round(pie + ny * 3 * ladoHuella), t:0 });
  if (huellas.length > 60) huellas.shift();
  const polvo = E.tipo === 'mazmorra' ? (RANGOS[E.rango] && RANGOS[E.rango].cara) || '#8a7a64' : '#c9b89a';
  for (let i = 0; i < 2 && particulas.length < 500; i++)
    particulas.push({ x:P.x - P.vx / v * 6 + rand(-4, 4), y:pie + rand(-1, 2), vx:-P.vx * .15 + rand(-12, 12), vy:rand(-22, -8), vida:rand(.25, .45), max:.45, color:polvo, r:2 });
}
function updateHuellas(dt){ for (const h of huellas) h.t += dt; huellas = huellas.filter(h => h.t < 5); }
function dibujarHuellas(){
  if (!sueloConHuellas()) return;
  for (const h of huellas){
    ctx.globalAlpha = .45 * (1 - h.t / 5);
    ctx.fillStyle = '#1a120a';
    ctx.fillRect(h.x - 2, h.y - 1, 4, 3); ctx.fillRect(h.x - 3, h.y - 4, 2, 2); ctx.fillRect(h.x + 1, h.y - 4, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// noche en la ciudad: se oscurece la pantalla y se recortan círculos de luz en farolas, portales y alrededor del gato
const NOCHE = { cv:null };
function dibujarNocheCiudad(){
  if (E.tipo !== 'ciudad') return;
  const d = oscuridad();
  if (d < .02) return;
  if (!NOCHE.cv) NOCHE.cv = document.createElement('canvas');
  const c = NOCHE.cv, w = Math.ceil(W / 2), h = Math.ceil(H / 2);
  if (c.width !== w || c.height !== h){ c.width = w; c.height = h; }
  const a = c.getContext('2d');
  a.globalCompositeOperation = 'source-over'; a.clearRect(0, 0, w, h);
  a.fillStyle = `rgba(12,16,48,${d})`; a.fillRect(0, 0, w, h);
  a.globalCompositeOperation = 'destination-out';
  const hueco = (x, y, r, k = 1) => {
    x = (x - cam.x) / 2; y = (y - cam.y) / 2; r /= 2;
    if (x < -r || y < -r || x > w + r || y > h + r) return;
    const g = a.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    a.fillStyle = g; a.fillRect(x - r, y - r, r * 2, r * 2);
  };
  for (const f of E.farolas || []) for (const [dx, dy] of f.luces){ hueco(f.x + dx, f.y + dy + 40, 150, .95); }
  for (const p of portales) hueco(p.x, p.y - 40, 170, .8);
  hueco(P.x, P.y - 20, 120, .55);
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(c, 0, 0, W, H); ctx.restore();
}

// clima en partículas de pantalla: lluvia en la ciudad y uno propio en cada tipo de cueva
const CLIMA_CUEVA = ['esporas', 'arena', 'nieve', 'brasas', 'vacio', 'brasas'];
function tipoClima(){
  if (E.tipo === 'ciudad') return lloviendo() ? 'lluvia' : null;
  if (E.tipo === 'mazmorra') return CLIMA_CUEVA[E.rango] || null;
  return null;
}
function dibujarClima(t){
  const dt = Math.min(.05, Math.max(0, (t - tClima) / 1000)); tClima = t;
  const tipo = tipoClima();
  if (!tipo){ clima.length = 0; return; }
  const tasa = { lluvia:420, nieve:50, arena:80, brasas:30, esporas:18, vacio:24 }[tipo];
  // al entrar, el clima ya está repartido por la pantalla
  let n = clima.length ? tasa * dt + Math.random() : tasa * 2.5, previo = !clima.length;
  while (n-- >= 1 && clima.length < 400){
    const p = { tipo, x:rand(-40, W + 40), y:-10, vida:0 };
    if (tipo === 'lluvia'){ p.vx = -60; p.vy = rand(520, 640); p.y = rand(-40, H * .3); p.fin = rand(H * .2, H); }
    else if (tipo === 'nieve'){ p.vx = rand(-15, 15); p.vy = rand(30, 60); p.y = rand(-20, H * .2); p.fase = rand(0, TAU); }
    else if (tipo === 'arena'){ p.x = -10; p.y = rand(0, H); p.vx = rand(260, 420); p.vy = rand(-10, 20); }
    else if (tipo === 'brasas' || tipo === 'vacio' || tipo === 'esporas'){ p.y = H + 10; p.vx = rand(-12, 12); p.vy = -rand(25, tipo === 'brasas' ? 70 : 35); p.fase = rand(0, TAU); }
    if (previo){ if (tipo === 'arena') p.x = rand(0, W); else if (tipo !== 'lluvia') p.y = rand(0, H); }
    clima.push(p);
  }
  ctx.save();
  for (const p of clima){
    p.vida += dt; p.x += p.vx * dt; p.y += p.vy * dt;
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.tipo === 'lluvia'){
      if (p.y > p.fin){ p.muere = true; ctx.fillStyle = 'rgba(200,220,255,.45)'; ctx.fillRect(x - 2, Math.round(p.fin), 4, 1); continue; }
      ctx.fillStyle = 'rgba(190,210,255,.5)'; ctx.fillRect(x, y, 1, 7);
    } else if (p.tipo === 'nieve'){
      p.x += Math.sin(p.vida * 2 + p.fase) * 12 * dt;
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x, y, 2, 2);
    } else if (p.tipo === 'arena'){
      ctx.fillStyle = 'rgba(230,200,140,.45)'; ctx.fillRect(x, y, 3, 1);
    } else {
      p.x += Math.sin(p.vida * 1.6 + p.fase) * 10 * dt;
      const parp = .5 + .5 * Math.sin(p.vida * 6 + p.fase);
      ctx.globalAlpha = (p.tipo === 'brasas' ? .5 + .5 * parp : .35 + .35 * parp);
      ctx.fillStyle = p.tipo === 'brasas' ? (parp > .5 ? '#ffb347' : '#ff5a1f') : p.tipo === 'vacio' ? '#b98bff' : '#9be37a';
      ctx.fillRect(x, y, 2, 2); ctx.globalAlpha = 1;
    }
    if (p.y > H + 20 || p.y < -30 || p.x > W + 50 || p.x < -50 || p.vida > 12) p.muere = true;
  }
  ctx.restore();
  clima = clima.filter(p => !p.muere);
  // en la ciudad, de noche y con lluvia, el cielo se ve más gris
  if (tipo === 'lluvia'){ ctx.fillStyle = 'rgba(40,50,70,.12)'; ctx.fillRect(0, 0, W, H); }
}

// globo de diálogo en pixel art (bordes rectos)
function burbuja(x, y, txt, alfa = 1){
  ctx.save(); ctx.globalAlpha = alfa;
  ctx.font = '600 12px Rajdhani, sans-serif'; ctx.textAlign = 'center';
  const w = Math.ceil(ctx.measureText(txt).width) + 14, h = 20, x0 = Math.round(x - w / 2), y0 = Math.round(y - h);
  ctx.fillStyle = '#1a1210'; ctx.fillRect(x0 - 2, y0 - 2, w + 4, h + 4);
  ctx.fillStyle = '#f4ead2'; ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = '#1a1210'; ctx.fillRect(Math.round(x) - 3, y0 + h + 2, 6, 2); ctx.fillRect(Math.round(x) - 1, y0 + h + 4, 2, 2);
  ctx.fillStyle = '#f4ead2'; ctx.fillRect(Math.round(x) - 2, y0 + h, 4, 2);
  ctx.fillStyle = '#2a1a08'; ctx.fillText(txt, x, y0 + 14);
  ctx.restore();
}

// =====================================================
//  DIBUJO PRINCIPAL
// =====================================================
function draw(t){
  if (!enJuego){ dibujarMenuFondo(t); return; }
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

// =====================================================
//  MONSTRUOS (sprites animados)
// =====================================================
const MON = {"cuadros": [[2, 2, 79, 66], [83, 2, 78, 65], [163, 2, 75, 64], [240, 2, 79, 65], [321, 2, 93, 57], [416, 2, 75, 70], [493, 2, 67, 57], [562, 2, 71, 38], [635, 2, 94, 62], [731, 2, 94, 61], [827, 2, 85, 61], [914, 2, 85, 61], [2, 74, 70, 59], [74, 74, 116, 66], [192, 74, 81, 65], [275, 74, 101, 40], [378, 74, 44, 44], [424, 74, 40, 48], [466, 74, 44, 44], [512, 74, 48, 40], [562, 74, 72, 60], [636, 74, 64, 52], [702, 74, 74, 48], [778, 74, 58, 46], [838, 74, 96, 48], [2, 142, 90, 50], [94, 142, 91, 48], [187, 142, 97, 48], [286, 142, 90, 49], [378, 142, 82, 49], [462, 142, 85, 48], [549, 142, 85, 48], [636, 142, 85, 48], [723, 142, 93, 48], [818, 142, 88, 49], [908, 142, 84, 68], [2, 212, 95, 77], [99, 212, 91, 57], [192, 212, 100, 48], [294, 212, 104, 49], [400, 212, 77, 49], [479, 212, 65, 55], [546, 212, 62, 52], [610, 212, 61, 62], [673, 212, 61, 67], [736, 212, 68, 57], [806, 212, 68, 55], [2, 291, 233, 152], [237, 291, 61, 59], [300, 291, 64, 59], [366, 291, 60, 58], [428, 291, 64, 58], [494, 291, 64, 60], [560, 291, 65, 58], [627, 291, 66, 55], [695, 291, 68, 54], [765, 291, 62, 60], [829, 291, 63, 61], [894, 291, 63, 62], [2, 445, 64, 61], [68, 445, 63, 61], [133, 445, 65, 61], [200, 445, 66, 61], [268, 445, 64, 60], [334, 445, 177, 132]], "tipos": {"mantis": {"mira": -1, "walk": [0, 1, 2, 3], "atk": [4, 5], "muere": [6, 7]}, "escorpion": {"mira": -1, "walk": [8, 9, 10, 11], "atk": [12, 13], "muere": [14, 15]}, "slime": {"mira": 0, "walk": [16, 17, 18, 19], "atk": [20, 21], "muere": [22, 23, 24, 25]}, "arana": {"mira": 1, "walk": [26, 27, 28, 29, 30, 31, 32, 33], "atk": [34, 35, 36, 37, 38, 39], "muere": [40, 41, 42, 43, 44, 45, 46]}, "arana_jefe": 47, "jabali": {"mira": 1, "idle": [48, 49, 50, 51], "walk": [56, 57, 58, 59, 60, 61, 62, 63], "atk": [52, 53, 54, 55], "muere": [55]}, "jabali_jefe": 64}};
const MON_IMG = new Image();
let monListo = false;
MON_IMG.onload = () => monListo = true;
MON_IMG.src = 'img/monstruos.png?v=' + VERSION;
const JEFE_SPR = ['slime', 'jabali', 'mantis', 'arana', 'arana', 'mantis'];
let cadaveres = [];
function sprDe(e){ return e.jefe ? JEFE_SPR[E.rango] : (ENEM[e.tipo] && ENEM[e.tipo].spr); }
function altoDe(e){
  const n = sprDe(e);
  if (e.jefe) return n === 'slime' ? 110 : n === 'jabali' ? 130 : 150;
  return ENEM[e.tipo].alto;
}
function pintarMonstruo(n, idx, x, pie, alto, ref, flip, flash, brillo){
  // pixel art: cada cuadro ya está al tamaño con que se ve; los jefes se agrandan a escala entera
  const [sx, sy, w, h] = MON.cuadros[idx], k = Math.max(1, Math.round(alto / ref));
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(Math.round(x), Math.round(pie)); if (flip) ctx.scale(-1, 1);
  if (brillo){ ctx.shadowColor = brillo; ctx.shadowBlur = 22; }
  ctx.drawImage(MON_IMG, sx, sy, w, h, -Math.round(w * k / 2), -h * k, w * k, h * k);
  ctx.shadowBlur = 0;
  if (flash > 0){ ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, flash * 6) * .7; ctx.drawImage(MON_IMG, sx, sy, w, h, -Math.round(w * k / 2), -h * k, w * k, h * k); }
  ctx.restore();
  return h * k;
}
function dibujarEnemigo(e){
  const n = sprDe(e);
  if (!monListo || !n) return dibujarEnemigoViejo(e);
  if (AVISOS_ATAQUE && e.jefe && e.aviso > 0){
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
  placaEnemigo(e, pie - alto);
}
// placa de vida sobre el enemigo (estilo WoW, tecla V): nombre y barra en píxeles; la del objetivo resalta
function placaEnemigo(e, tope){
  const obj = e === P.objetivo;
  if (!VER_PLACAS && !obj){
    if (e.jefe || e.hp >= e.maxHp) return;
    const bw = Math.max(26, e.r * 2.2), by = Math.round(tope - 8);
    ctx.fillStyle = '#2a2148'; ctx.fillRect(Math.round(e.x - bw / 2), by, Math.round(bw), 4);
    ctx.fillStyle = '#e2445c'; ctx.fillRect(Math.round(e.x - bw / 2), by, Math.round(bw * Math.max(0, e.hp / e.maxHp)), 4);
    return;
  }
  if (!obj && !e.aggro && Math.hypot(e.x - P.x, e.y - P.y) > 420) return;
  const w = e.jefe ? 90 : 56, h = obj ? 7 : 5, x = Math.round(e.x - w / 2), y = Math.round(tope - 12 - h);
  ctx.globalAlpha = obj || e.aggro ? 1 : .75;
  ctx.fillStyle = obj ? '#ffffff' : '#000000'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#2a0c10'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = e.aggro ? '#d8283c' : '#d8b02c'; ctx.fillRect(x, y, Math.round(w * Math.max(0, e.hp / e.maxHp)), h);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x, y, Math.round(w * Math.max(0, e.hp / e.maxHp)), 1);
  rotulo(e.nombre, e.x, y - 3, `700 ${obj ? 12 : 11}px Rajdhani, sans-serif`, obj ? '#ffffff' : (e.aggro ? '#ff8a8a' : '#ffe08a'), 'rgba(0,0,0,.85)', 3);
  ctx.globalAlpha = 1;
}
function dibujarCadaver(c){
  const D = MON.tipos[c.n], edad = (performance.now() - c.t0) / 1000;
  const lista = D.muere, idx = lista[Math.min(lista.length - 1, Math.floor(edad / .14))];
  ctx.globalAlpha = Math.max(0, 1 - Math.max(0, edad - .7) / .4);
  pintarMonstruo(c.n, idx, c.x, c.pie, c.alto, c.ref, c.flip, 0, null);
  ctx.globalAlpha = 1;
}

function dibujarEnemigoViejo(e){
  if (AVISOS_ATAQUE && e.jefe && e.aviso > 0){
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

// penumbra de las cuevas e interiores: el degradado se pinta una vez por tamaño de pantalla y luego sólo se coloca
const PENUMBRA = {};
function penumbra(tipo){
  const clave = tipo + W + 'x' + H;
  if (PENUMBRA[tipo] && PENUMBRA[tipo].clave === clave) return PENUMBRA[tipo].c;
  const c = document.createElement('canvas'), a = c.getContext('2d');
  if (tipo === 'cueva'){
    c.width = W * 2; c.height = H * 2;
    const g = a.createRadialGradient(W, H, 120, W, H, Math.max(360, Math.min(W, H) * .75));
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.88)');
    a.fillStyle = g; a.fillRect(0, 0, W * 2, H * 2);
  } else {
    c.width = W; c.height = H;
    const g = a.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(255,160,60,.06)'); g.addColorStop(1, 'rgba(20,8,0,.55)');
    a.fillStyle = g; a.fillRect(0, 0, W, H);
  }
  PENUMBRA[tipo] = { clave, c };
  return c;
}
const CARTEL = {};
function dibujarMinimapa(){
  const bajo = H < 500; // teléfono acostado: minimapa más chico para dejar ver el mundo
  const s = bajo ? 92 : W < 600 ? 104 : 140, r = s / 2, cx = W - r - (bajo ? 10 : 16);
  const cy = INSET + (esTactil ? (bajo ? 74 : 84) : 30) + r;
  const nombre = E.tipo === 'mazmorra' && !E.tutorial ? `Rango ${E.R.l}: ${E.R.tema}` : E.nombre;
  const colorZona = E.tipo === 'mazmorra' ? E.R.color : '#ffd76a';
  // placa con el nombre de la zona
  ctx.font = '15px Marcellus, Georgia, serif'; ctx.textAlign = 'center';
  // la placa nunca se sale de la pantalla: se corre hacia dentro y, si hace falta, se achica la letra
  const izq = W < 600 ? 244 : 8; // a la derecha del marco del jugador en pantallas chicas
  const claveCartel = nombre + '|' + W + '|' + fuentesListas;
  if (CARTEL.clave !== claveCartel){
    let fs = 15, tw = ctx.measureText(nombre).width + 24;
    while (tw > W - izq - 8 && fs > 9){ fs--; ctx.font = `${fs}px Marcellus, Georgia, serif`; tw = ctx.measureText(nombre).width + 16; }
    Object.assign(CARTEL, { clave:claveCartel, fs, tw });
  }
  const fs = CARTEL.fs, tw = CARTEL.tw; ctx.font = `${fs}px Marcellus, Georgia, serif`;
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
    if (E.salida) punto(E.salida.x, E.salida.y, '#9b7bff', 4);
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
  if (tSeg % 60 === 0 && enJuego) revisarLogros();
  const dt = Math.min((t - last) / 1000, .05); last = t;
  if (enJuego && !pantallaActual) update(dt);
  if (enJuego) updateBuscador(dt);
  draw(t);
  if (enJuego && wTab === 'personaje' && abierta('wPj')) dibujarFigura(t);
  if (pantallaActual === 'pPersonajes' && pjSel){ const pj = cuenta() && cuenta().personajes.find(p => p.id === pjSel); if (pj) dibujarEscenaPj($('selCv'), pj.gato || 0, pj.clase, t, rotSel, pj.mascota, pj.equipo, pj.tinte); }
  else if (pantallaActual === 'pPersonajes') $('selCv').getContext('2d').clearRect(0, 0, 520, 560);
  if (pantallaActual === 'pCrear') dibujarEscenaPj($('crearCv'), gatoPj, claseElegida, t, rotSel, null);
  if (enJuego && PJ && tSeg % 6 === 0){
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
