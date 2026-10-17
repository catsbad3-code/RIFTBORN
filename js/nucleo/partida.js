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
// gatos que se pueden elegir al crear personaje: por ahora solo Mist, el gato rojo (el que tiene la hoja de caminar terminada).
// Para sumar otro, añadir su número aquí. Los personajes ya creados con otro gato siguen igual.
const GATOS_ELEGIBLES = [0];
const ICONO_CLASE = { guerrero:'⚔️', sombra:'🗡️', mago:'🔮', sacerdote:'✨', arquero:'🏹' };
const NOMBRES_AL = ['Kael','Mira','Thorne','Luna','Vex','Nyx','Rayo','Sombra','Bigotes','Zarpa','Eclipse','Ónix','Ceniza','Runa','Michi','Garra'];
function renderCrear(){
  $('cNombre').value = ''; $('cErr').textContent = ''; rotSel = 0;
  const gc = $('gatosPj'); gc.innerHTML = '';
  if (!GATOS_ELEGIBLES.includes(gatoPj)) gatoPj = GATOS_ELEGIBLES[0];
  GATOS_ELEGIBLES.forEach(i => { const nombre = TIPOS_GATO[i];
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
        cd1:0, cd2:0, cdPoc:0, cdP:{}, inv:0, golpe:0, montura:!!PJ.montado };
  $('btnMontura').setAttribute('aria-pressed', P.montura);
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
  enemigos = []; proys = []; proysE = []; botin = []; efectos = []; particulas = []; textos = []; soldados = []; zonas = []; huellas = []; clima = []; peligros = [];
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
  // vecinos a mano (antes se creaban 5 listas por casilla visitada)
  const C = G.cols, S = G.solido;
  while (a < b){
    const i = cola[a++], x = i % C, d1 = dist[i] + 1;
    if (x + 1 < C && !S[i + 1] && dist[i + 1] < 0){ dist[i + 1] = d1; cola[b++] = i + 1; }
    if (x > 0 && !S[i - 1] && dist[i - 1] < 0){ dist[i - 1] = d1; cola[b++] = i - 1; }
    if (i + C < S.length && !S[i + C] && dist[i + C] < 0){ dist[i + C] = d1; cola[b++] = i + C; }
    if (i - C >= 0 && !S[i - C] && dist[i - C] < 0){ dist[i - C] = d1; cola[b++] = i - C; }
  }
  return dist;
}

