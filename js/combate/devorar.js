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

