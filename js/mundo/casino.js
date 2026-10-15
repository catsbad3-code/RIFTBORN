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
CAS_IMG.src = 'img/mundo/casino.png?v=' + VERSION;
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

