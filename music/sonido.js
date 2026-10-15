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
  bufRuido(SON.ctx);
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
// un solo búfer de ruido (2 s) para todos los sonidos: cada uno toca un trozo al azar (antes se creaba uno nuevo en cada paso o golpe y daba tirones)
let RUIDO_BUF = null;
function bufRuido(c){
  if (RUIDO_BUF && RUIDO_BUF.sampleRate === c.sampleRate) return RUIDO_BUF;
  const n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return RUIDO_BUF = b;
}
function ruido(dur, { vol = .3, desde = 0, filtro = 1200, q = 1, tipoF = 'bandpass', destino = null } = {}){
  const c = SON.ctx, t = c.currentTime + desde, b = bufRuido(c), largo = Math.min(dur + .02, 1.9);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; f.type = tipoF; f.frequency.value = filtro; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
  s.connect(f); f.connect(g); g.connect(destino || SON.fx); s.start(t, Math.random() * (2 - largo), largo);
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
  montar(){ tono(140, .18, { tipo:'sawtooth', vol:.14, hasta:90 }); ruido(.15, { vol:.15, filtro:700, q:2, desde:.05 }); tono(330, .08, { tipo:'square', vol:.08, desde:.18, hasta:520 }); },
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
  // si el juego se atascó (pestaña oculta, carga), no se recuperan de golpe las notas atrasadas: se sigue desde ahora
  if (SON.sig < SON.ctx.currentTime - .05) SON.sig = SON.ctx.currentTime + .05;
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

