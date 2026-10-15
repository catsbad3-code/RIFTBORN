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

