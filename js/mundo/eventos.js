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

