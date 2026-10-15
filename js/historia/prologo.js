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

