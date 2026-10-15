// =====================================================
//  UTILIDADES
// =====================================================
const VERSION = '1.16.2'; // también en index.html (estilos y scripts)
const $ = id => document.getElementById(id);
// el juego está repartido en varios archivos: lo que llega pronto (una imagen ya guardada) espera a que estén todos
const alCargar = fn => document.readyState === 'loading' ? addEventListener('DOMContentLoaded', fn, { once:true }) : fn();
// ---------- todo el mundo en pixel art ----------
// cada hoja del mundo tiene una versión en pixel art (img/px) con cada dibujo reducido al tamaño con que se ve en pantalla.
// Al dibujar una parte de la hoja original se usa su versión pixelada; el mundo se dibuja sin suavizar.
const PX_HOJAS = {"img/mundo/terr.png":{"src":"img/px/terr.png","r":{"0,0":[2,2,48,48],"66,0":[52,2,48,48],"132,0":[102,2,48,48],"198,0":[152,2,48,48],"264,0":[202,2,48,48],"330,0":[252,2,48,48],"396,0":[302,2,48,48],"462,0":[352,2,48,48],"528,0":[402,2,48,48],"594,0":[452,2,48,48],"660,0":[502,2,70,79],"0,107":[574,2,46,56],"86,107":[622,2,40,31],"176,107":[664,2,40,34],"268,107":[706,2,45,35],"377,107":[753,2,42,27],"479,107":[797,2,32,41],"557,107":[831,2,50,42]}},"img/mundo/ciu.webp":{"src":"img/px/ciu.png","r":{"0,0":[2,2,93,111],"95,0":[97,2,22,83],"127,0":[121,2,87,107],"216,0":[210,2,74,85],"310,0":[286,2,86,105],"398,0":[374,2,18,73],"425,0":[394,2,79,76],"532,0":[475,2,79,76],"639,0":[556,2,79,76],"746,0":[637,2,79,76],"853,0":[718,2,79,76],"960,0":[799,2,23,74],"0,113":[824,2,65,89],"67,113":[891,2,66,89],"135,113":[959,2,62,88],"199,113":[2,115,52,83],"253,113":[56,115,53,82],"308,113":[111,115,88,64],"398,113":[201,115,48,48],"464,113":[251,115,48,48],"530,113":[301,115,49,49],"596,113":[352,115,49,49],"662,113":[403,115,48,48],"728,113":[453,115,48,48],"794,113":[503,115,49,49],"860,113":[554,115,48,48],"926,113":[604,115,48,48],"0,204":[654,115,48,48],"66,204":[704,115,48,48],"132,204":[754,115,20,37],"167,204":[776,115,18,32],"195,204":[796,115,17,34],"220,204":[815,115,22,30],"251,204":[839,115,10,24],"270,204":[851,115,22,29],"301,204":[875,115,59,37],"362,204":[936,115,57,29]}},"img/mundo/edif.png":{"src":"img/px/edif.png","r":{"0,0":[2,2,104,79],"170,0":[108,2,106,78],"343,0":[216,2,91,91],"492,0":[309,2,94,89],"645,0":[405,2,104,82],"0,149":[511,2,90,69],"147,149":[603,2,105,56],"319,149":[710,2,100,65],"483,149":[812,2,97,73],"642,149":[911,2,84,72],"0,268":[2,95,90,71],"147,268":[94,95,95,78],"302,268":[191,95,23,65],"341,268":[216,95,64,41],"447,268":[282,95,55,68],"537,268":[339,95,61,44],"638,268":[402,95,30,43],"707,268":[434,95,75,77]}},"img/mundo/mu.webp":{"src":"img/px/mu.png","r":{"0,0":[2,2,85,63],"139,0":[89,2,121,78],"262,0":[212,2,150,78],"414,0":[364,2,76,77],"492,0":[442,2,73,75],"567,0":[517,2,76,72],"0,104":[595,2,102,59],"122,104":[699,2,86,54],"231,104":[787,2,73,66],"306,104":[862,2,48,61],"356,104":[912,2,37,57],"395,104":[2,82,77,56],"474,104":[81,82,78,56],"554,104":[161,82,56,56],"612,104":[219,82,72,49],"0,175":[293,82,74,48],"76,175":[369,82,74,47],"152,175":[445,82,72,47],"226,175":[519,82,109,35]}},"img/efectos/spr.png":{"src":"img/px/spr.png","r":{"0,0":[2,2,49,105],"61,0":[53,2,49,105],"123,0":[104,2,49,105],"184,0":[155,2,43,105],"238,0":[200,2,44,84],"293,0":[246,2,40,85],"344,0":[288,2,31,85],"384,0":[321,2,30,85],"423,0":[353,2,60,91],"498,0":[415,2,58,91],"571,0":[475,2,61,91],"647,0":[538,2,67,90],"731,0":[607,2,67,90],"815,0":[676,2,72,88],"905,0":[750,2,59,86],"0,130":[811,2,75,96],"93,130":[888,2,71,94],"181,130":[961,2,52,91],"246,130":[2,109,69,86],"332,130":[73,109,47,83],"391,130":[122,109,40,82],"442,130":[164,109,86,16],"661,130":[252,109,60,70],"742,130":[314,109,34,28],"800,130":[350,109,86,32],"0,249":[438,109,86,62],"107,249":[526,109,174,82],"283,249":[702,109,71,95],"404,249":[775,109,75,88],"550,249":[852,109,158,141],"738,249":[2,252,37,27],"785,249":[41,252,86,81]}},"img/mundo/casas.webp":{"src":"img/px/casas.png","r":{"0,0":[2,2,158,189],"178,0":[162,2,186,155],"399,0":[350,2,126,117],"527,0":[478,2,82,115],"611,0":[562,2,106,118],"719,0":[670,2,122,117],"849,0":[794,2,117,137],"974,0":[913,2,100,88]}},"img/mundo/par.webp":{"src":"img/px/par.png","r":{"0,0":[2,2,110,88],"112,0":[114,2,192,31],"306,0":[308,2,16,22]}},"img/mundo/band.png":{"src":"img/px/band.png","r":{"0,0":[2,2,32,64],"100,0":[36,2,32,64],"200,0":[70,2,32,64],"300,0":[104,2,32,64],"400,0":[138,2,32,64],"500,0":[172,2,32,64],"600,0":[206,2,32,64],"700,0":[240,2,32,64]}},"img/mundo/portal.webp":{"src":"img/px/portal.png","r":{"0,0":[2,2,66,122],"66,0":[70,2,66,122],"132,0":[138,2,66,122],"198,0":[206,2,66,122],"264,0":[274,2,66,122],"330,0":[342,2,66,122],"396,0":[410,2,66,122],"462,0":[478,2,66,122],"528,0":[546,2,66,122],"0,122":[614,2,66,122],"66,122":[682,2,66,122],"132,122":[750,2,66,122],"198,122":[818,2,66,122],"264,122":[886,2,66,122],"330,122":[954,2,66,122],"396,122":[2,126,66,122],"462,122":[70,126,66,122],"528,122":[138,126,66,122],"0,244":[206,126,66,122],"66,244":[274,126,66,122],"132,244":[342,126,66,122],"198,244":[410,126,66,122],"264,244":[478,126,66,122],"330,244":[546,126,66,122],"396,244":[614,126,66,122],"462,244":[682,126,66,122],"528,244":[750,126,66,122],"0,366":[818,126,57,105],"66,366":[877,126,57,105],"132,366":[936,126,57,105],"198,366":[2,250,57,105],"264,366":[61,250,57,105],"330,366":[120,250,57,105],"396,366":[179,250,57,105],"462,366":[238,250,57,105],"528,366":[297,250,57,105],"0,488":[356,250,66,122],"66,488":[424,250,66,122],"132,488":[492,250,66,122],"198,488":[560,250,66,122],"264,488":[628,250,66,122],"330,488":[696,250,66,122],"396,488":[764,250,66,122],"462,488":[832,250,66,122],"528,488":[900,250,66,122],"0,610":[2,374,66,122],"66,610":[70,374,66,122],"132,610":[138,374,66,122],"198,610":[206,374,66,122],"264,610":[274,374,66,122],"330,610":[342,374,66,122],"396,610":[410,374,66,122],"462,610":[478,374,66,122],"528,610":[546,374,66,122]}},"img/mundo/estatua.webp":{"src":"img/px/estatua.png","r":{"0,0":[2,2,128,190]}},"img/mundo/mostrador.webp":{"src":"img/px/mostrador.png","r":{"0,0":[2,2,205,61]}},"img/mundo/tex2.webp":{"src":"img/px/tex2.png","r":{"0,0":[2,2,135,84],"135,0":[139,2,135,84],"270,0":[276,2,135,84],"405,0":[413,2,135,84],"540,0":[550,2,135,84],"675,0":[687,2,135,84]}}};
const PX_IMG = {};
let pxPend = Object.keys(PX_HOJAS).length;
for (const [orig, h] of Object.entries(PX_HOJAS)){
  const im = new Image();
  im.onload = () => { h.listo = true; if (--pxPend === 0) alCargar(() => setTimeout(rehacerPatrones, 0)); };
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
const IC3_URL = 'img/interfaz/ic3.png?v=' + VERSION;
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
const ICONOS_URL = 'img/interfaz/iconos.png';
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

