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
  if (e.rugido > 0){ if (Math.random() < .2) texto(e.x, e.y - e.r - 10, 'Inmune', '#9a91c2', 13); return; }
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

