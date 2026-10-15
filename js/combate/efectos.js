// =====================================================
//  BUFFS Y DEBUFFS
// =====================================================
const EFECTOS = {
  atk_up:  { n:'Furia de sombras',   d:'+20% de daño',               ic:'b_atk_up' },
  def_up:  { n:'Coraza de sombras',  d:'Recibes 30% menos daño',     ic:'b_def_up' },
  spi_up:  { n:'Descansado',         d:'+60% de energía recuperada', ic:'b_spi_up' },
  agi_up:  { n:'Celeridad',          d:'+25% de velocidad',          ic:'b_agi_up' },
  veneno:  { n:'Veneno',             d:'Pierdes vida cada segundo',  ic:'b_veneno', malo:true },
  atk_dn:  { n:'Debilidad',          d:'-20% de daño',               ic:'b_atk_dn', malo:true },
  def_dn:  { n:'Armadura rota',      d:'Recibes 25% más daño',       ic:'b_def_dn', malo:true },
  spi_dn:  { n:'Mente nublada',      d:'-50% de energía recuperada', ic:'b_spi_dn', malo:true },
  agi_dn:  { n:'Lentitud',           d:'-35% de velocidad',          ic:'b_agi_dn', malo:true },
  hielo:   { n:'Bloque de hielo',    d:'Inmune al daño',             ic:'b_def_up' },
  muro:    { n:'Muro de escudo',     d:'Recibes 60% menos daño',     ic:'b_def_up' },
  avatar:  { n:'Avatar',             d:'+25% de daño',               ic:'b_atk_up' },
  tormenta:{ n:'Tormenta de cuchillas', d:'Cortas a todos a tu alrededor', ic:'b_atk_up' },
  com_atk: { n:'Bien alimentado',    d:'+10% de daño',               ic:'b_atk_up' },
  com_def: { n:'Bien alimentado',    d:'Recibes 10% menos daño',     ic:'b_def_up' },
  com_vel: { n:'Bien alimentado',    d:'+10% de velocidad y +30% de energía recuperada', ic:'b_agi_up' },
  evasion: { n:'Evasión',            d:'Esquivas la mitad de los golpes', ic:'b_agi_up' },
  rapido:  { n:'Disparo rápido',     d:'Disparas el doble de rápido',  ic:'b_agi_up' }
};
// qué debuff deja cada monstruo al golpearte (y con qué probabilidad)
const DEBUFF_MONSTRUO = { slime:['agi_dn', 3, .35], mantis:['atk_dn', 5, .3], escorpion:['def_dn', 5, .3], arana:['veneno', 4, .45], jabali:['agi_dn', 2, .3] };
let estados = {}, pilaTxt = 0, tPila = 0;
function ponerEfecto(id, seg){
  const nuevo = !estados[id];
  estados[id] = { t:Math.max(seg, estados[id] ? estados[id].t : 0), max:seg };
  if (nuevo){
    const ef = EFECTOS[id];
    const ahora = performance.now(); pilaTxt = ahora - tPila < 600 ? pilaTxt + 1 : 0; tPila = ahora;
    texto(P.x, P.y - 88 - pilaTxt * 15, ef.n, ef.malo ? '#ff8a9b' : '#7dffa8', 13);
    chat(ef.malo ? `Sufres ${ef.n}: ${ef.d.toLowerCase()}.` : `Obtienes ${ef.n}: ${ef.d.toLowerCase()}.`, ef.malo ? '#ff8a9b' : '#7dffa8');
  }
  pintarBuffs(true);
}
const efMod = {
  dmg:   () => (estados.atk_up ? 1.2 : 1) * (estados.atk_dn ? .8 : 1) * (estados.avatar ? 1.25 : 1) * (estados.com_atk ? 1.1 : 1),
  recibe:() => (estados.def_up ? .7 : 1) * (estados.def_dn ? 1.25 : 1) * (estados.muro ? .4 : 1) * (estados.com_def ? .9 : 1),
  vel:   () => (estados.agi_up ? 1.25 : 1) * (estados.agi_dn ? .65 : 1) * (estados.com_vel ? 1.1 : 1),
  regEn: () => (estados.spi_up ? 1.6 : 1) * (estados.spi_dn ? .5 : 1) * (estados.com_vel ? 1.3 : 1)
};
let tBuffs = 0, tVeneno = 0;
function updateEfectos(dt){
  for (const id in estados){ estados[id].t -= dt; if (estados[id].t <= 0){ delete estados[id]; pintarBuffs(true); } }
  if (estados.veneno && P.hp > 0){
    const d = D.maxHp * .025 * dt; P.hp = Math.max(1, P.hp - d);
    tVeneno += dt; if (tVeneno > 1){ tVeneno = 0; texto(P.x, P.y - 70, Math.round(D.maxHp * .025), '#8dff6a', 13); }
  }
  tBuffs -= dt; if (tBuffs <= 0){ tBuffs = .25; pintarBuffs(); }
}
function limpiarEfectos(soloMalos){
  for (const id in estados) if (!soloMalos || EFECTOS[id].malo) delete estados[id];
  pintarBuffs(true);
}
let firmaBuffs = '';
function pintarBuffs(forzar){
  const cont = $('buffs'); if (!cont) return;
  const ids = Object.keys(estados).sort((a, b) => (EFECTOS[a].malo ? 1 : 0) - (EFECTOS[b].malo ? 1 : 0));
  const firma = ids.join(',');
  if (forzar || firma !== firmaBuffs){
    firmaBuffs = firma;
    cont.innerHTML = ids.map(id => {
      const ef = EFECTOS[id], i = ICONOS_OBJ[ef.ic][0];
      return `<span class="buff ${ef.malo ? 'malo' : ''}" data-ef="${id}" title="${ef.n}: ${ef.d}" style="background-image:url(${ICONOS_URL});background-position:${(i / (ICONOS_N - 1) * 100).toFixed(4)}% 0"><i></i></span>`;
    }).join('');
  }
  cont.querySelectorAll('.buff').forEach(el => {
    const e = estados[el.dataset.ef]; if (!e) return;
    const t = Math.ceil(e.t);
    el.querySelector('i').textContent = t >= 60 ? `${Math.ceil(t / 60)}m` : `${t}s`;
    el.classList.toggle('fin', e.t < 3);
  });
}

function golpearJugador(d, src){
  if (P.inv > 0) return;
  if (estados.hielo) return;
  if (estados.evasion && Math.random() < .5){ texto(P.x, P.y - 70, 'Esquivado', '#c8ff8a', 13); P.inv = .2; return; }
  if (Math.random() < .05) gastarDur(0, true);
  d *= (1 - D.def) * efMod.recibe();
  if (P.escudo > 0){ const abs = Math.min(P.escudo, d); P.escudo -= abs; d -= abs; texto(P.x + 14, P.y - 60, `(${Math.round(abs)} absorbido)`, '#c8f0ff', 11); if (d <= 0){ P.inv = .2; return; } }
  ganarIra(Math.min(20, d / D.maxHp * 120));
  if (src && !src.jefe){
    const db = DEBUFF_MONSTRUO[sprDe(src)];
    if (db && Math.random() < db[2]) ponerEfecto(db[0], db[1]);
  } else if (src && src.jefe && Math.random() < .25){
    const db = DEBUFF_MONSTRUO[sprDe(src)]; if (db) ponerEfecto(db[0], db[1] + 2);
  }
  if (E.tutorial) d = Math.min(d, P.hp - 1);   // en el prólogo no se muere
  P.hp -= d; P.inv = .45; P.golpe = .2; shake = Math.max(shake, 7); sfx('dano', .1);
  texto(P.x, P.y - 70, Math.round(d), '#ff6b7f', 15);
  chispas(P.x, P.y - 20, '#e2445c', 8, 150);
  if (P.hp <= 0){
    P.hp = 0;
    const perdida = Math.floor(PJ.oro * .15); PJ.oro -= perdida; gastarDur(.1); guardar();
    $('muerteTxt').textContent = (perdida ? `Perdiste ${dineroTxt(perdida)}. ` : '') + 'Tu equipo perdió un 10% de durabilidad. Despertarás en tu cama de la posada.';
    limpiarEfectos(false);
    pantalla('pMuerte');
  }
}

function beberPocion(){
  if (!enJuego || pantallaActual || P.cdPoc > 0) return;
  if (PJ.pociones <= 0){ texto(P.x, P.y - 70, 'Sin pociones', '#ff8a9b', 14); return; }
  if (P.hp >= D.maxHp){ texto(P.x, P.y - 70, 'Vida completa', '#9a91c2', 14); return; }
  PJ.pociones--; P.cdPoc = 1;
  const c = Math.round(D.maxHp * .45); P.hp = Math.min(D.maxHp, P.hp + c);
  texto(P.x, P.y - 70, '+' + c, '#7dffa8', 17); chispas(P.x, P.y - 20, '#7dffa8', 16, 120);
}

function chispas(x, y, color, n, v = 180){
  for (let i = 0; i < n && particulas.length < 500; i++){
    const a = rand(0, TAU), s = rand(v * .3, v);
    particulas.push({ x, y, vx:Math.cos(a) * s, vy:Math.sin(a) * s, vida:rand(.25, .6), max:.6, color, r:rand(1.5, 3.5) });
  }
}
function texto(x, y, txt, color, size){ if (textos.length < 70) textos.push({ x, y, txt, color, size, vida:.8 }); }

let reiniciarChat = () => {};
// ventana de chat: se mueve desde la cabecera y cambia de tamaño desde la esquina
(function(){
  const ch = $('chat');
  // en el teléfono el chat guarda su propio lugar y tamaño (se ancla por arriba), sin tocar el de la PC
  const CLAVE = esTactil ? 'rb_chat_tel' : 'rb_chat';
  const guardarChat = () => { try { localStorage.setItem(CLAVE, JSON.stringify({ l:ch.style.left, t:ch.style.top, b:ch.style.bottom, w:ch.style.width, h:ch.style.height, min:ch.classList.contains('min') })); } catch (e) {} };
  try { const g = JSON.parse(localStorage.getItem(CLAVE) || 'null'); if (g){ Object.assign(ch.style, esTactil ? { left:g.l, top:g.t, width:g.w, height:g.h } : { left:g.l, bottom:g.b, width:g.w, height:g.h }); ch.classList.toggle('min', !!g.min); } } catch (e) {}
  reiniciarChat = () => { ch.style.left = ch.style.top = ch.style.bottom = ch.style.width = ch.style.height = ''; ch.classList.remove('min'); $('chatMin').textContent = '–'; guardarChat(); };
  const arrastre = (el, fn) => el.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    e.preventDefault(); const r = ch.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
    const mover = ev => fn(r, ev.clientX - x0, ev.clientY - y0);
    const fin = () => { removeEventListener('pointermove', mover); removeEventListener('pointerup', fin); guardarChat(); };
    addEventListener('pointermove', mover); addEventListener('pointerup', fin);
  });
  if (esTactil){
    arrastre($('chatCab'), (r, dx, dy) => { ch.style.left = clamp(r.left + dx, 0, innerWidth - 80) + 'px'; ch.style.top = clamp(r.top + dy, 0, innerHeight - 30) + 'px'; });
    arrastre($('chatRs'), (r, dx, dy) => { ch.style.width = clamp(r.width + dx, 150, innerWidth - r.left - 4) + 'px'; ch.style.height = clamp(r.height + dy, 60, innerHeight - r.top - 4) + 'px'; });
  } else {
  arrastre($('chatCab'), (r, dx, dy) => { ch.style.left = clamp(r.left + dx, 0, innerWidth - 120) + 'px'; ch.style.bottom = clamp(innerHeight - r.bottom - dy, 0, innerHeight - 60) + 'px'; });
  arrastre($('chatRs'), (r, dx, dy) => { ch.style.width = clamp(r.width + dx, 200, innerWidth - r.left - 8) + 'px'; ch.style.height = clamp(r.height - dy, 90, r.bottom - 8) + 'px'; });
  }
  $('chatMin').onclick = () => { ch.classList.toggle('min'); $('chatMin').textContent = ch.classList.contains('min') ? '+' : '–'; guardarChat(); };
  if (ch.classList.contains('min')) $('chatMin').textContent = '+';
})();
// los mensajes se juntan y se añaden una vez por cuadro: medir la caja del chat en mitad del combate obligaba
// a la página a recalcularse en cada golpe
let chatCola = [];
function chat(txt, color = '#e9e4ff'){
  const p = document.createElement('p'); p.textContent = txt; p.style.color = color;
  if (!chatCola.length) requestAnimationFrame(volcarChat);
  chatCola.push(p);
}
function volcarChat(){
  const c = $('chatLog'), f = document.createDocumentFragment();
  const abajo = c.scrollHeight - c.scrollTop - c.clientHeight < 30;
  for (const p of chatCola) f.appendChild(p);
  chatCola = [];
  c.appendChild(f);
  while (c.children.length > 120) c.firstChild.remove();
  if (abajo) c.scrollTop = c.scrollHeight;
}
let bannerT;
function banner(titulo, sub){
  const b = $('banner');
  b.innerHTML = escapar(titulo) + (sub ? `<small>${escapar(sub)}</small>` : '');
  b.classList.add('ver'); clearTimeout(bannerT); bannerT = setTimeout(() => b.classList.remove('ver'), 2800);
}

