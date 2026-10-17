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
  G.inter.push({ x:2 * T, y:3.5 * T, r:62, texto:'Dormir en la cama', accion:() => descansar() });
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
  G.inter.push({ x:6.5 * T, y:4.5 * T, r:62, texto:'Hablar con la tendera', accion:() => abrirTienda() });
  G.inter.push({ x:8.4 * T, y:6.6 * T, r:62, texto:'Usar la forja del herrero', accion:() => abrirForja() });
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
    { spr:'roxy', nombre:'Roxy, la recepcionista', x:7 * T, y:2.3 * T },
    { spr:'cliente', nombre:'Ren, el evaluador', x:11 * T, y:5.2 * T },
    { spr:'vance', nombre:'Vance, intendente de emblemas', x:3 * T, y:7 * T }
  ];
  G.obs.push({ x:3 * T, y:7 * T, r:14 });
  G.inter.push({ x:3 * T, y:7.9 * T, r:56, texto:'Intendente de emblemas', accion:() => abrirEmblemas() });
  G.obs.push({ x:11 * T, y:5.2 * T, r:14 });
  G.tablon = { x:3 * T, y:4.2 * T };
  G.obs.push({ x:G.tablon.x, y:G.tablon.y, r:24 });
  G.puerta = 7 * T;
  G.inter.push({ x:7 * T, y:4.4 * T, r:64, texto:'Registro de hermandades', accion:() => abrirHermandad() });
  G.inter.push({ x:11 * T, y:6.1 * T, r:56, texto:'Evaluación de rango', accion:() => abrirEvaluacion() });
  G.inter.push({ x:G.tablon.x, y:G.tablon.y + 50, r:56, texto:'Tablón de clasificación', accion:() => abrirClasificacion() });
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

