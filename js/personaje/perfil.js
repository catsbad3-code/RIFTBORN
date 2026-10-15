// =====================================================
//  PERFIL: PERSONAJE, BOLSA, LIBRO DE PODERES Y REGISTRO
// =====================================================
let pestana = 'personaje', seleccion = null, wTab = 'personaje';
const VENTANAS = ['wPj', 'wLibro', 'wBolsa', 'wMis'];
$('icoMochila').innerHTML = ic3('bolsa');
// botones del panel con íconos pixelados: cuando ya cargaron todos los archivos del juego (algunos usan cosas de archivos posteriores)
addEventListener('DOMContentLoaded', function(){
  const ico = (id, html) => { const b = $(id); if (b) b.innerHTML = html; };
  const casco = ICONOS_OBJ.cabeza[0];
  ico('btnPersonaje', `<span class="ico-obj" style="background-image:url(${ICONOS_URL});background-position:${(casco / (ICONOS_N - 1) * 100).toFixed(4)}% 0"></span>`);
  ico('btnLibro', ic3('libro')); ico('btnMis', ic3('pergamino')); ico('btnBolsa', ic3('bolsa'));
  ico('btnMenuJuego', ic3('escudo')); ico('mPoc', ic3('pocion'));
  ico('btnMascota', '<canvas width="64" height="64" id="icoPet"></canvas>');
  const pintarPet = () => { const c = $('icoPet'); if (!c || !ratasListo) return; const a = c.getContext('2d'); a.clearRect(0, 0, 64, 64);
    const [sx, sy, w, h] = RATAS_DIR[PJ && PJ.mascota ? PJ.mascota.tipo : 0].ab[0], k = Math.min(60 / w, 60 / h);
    a.imageSmoothingEnabled = false; a.drawImage(RATAS_IMG, sx, sy, w, h, 32 - w * k / 2, 62 - h * k, w * k, h * k); };
  if (ratasListo) pintarPet(); else RATAS_IMG.addEventListener('load', pintarPet, { once:true });
  window.pintarIcoPet = pintarPet;
  // el jabalí de la montura, con el cuadro de reposo de su hoja
  ico('btnMontura', '<canvas width="64" height="64"></canvas>');
  const pintarJab = () => { const c = $('btnMontura').firstChild, a = c.getContext('2d'), [sx, sy, w, h] = MON.cuadros[MON.tipos.jabali.idle[0]], k = Math.min(62 / w, 62 / h);
    a.imageSmoothingEnabled = false; a.drawImage(MON_IMG, sx, sy, w, h, 32 - w * k / 2, 63 - h * k, w * k, h * k); };
  if (monListo) pintarJab(); else MON_IMG.addEventListener('load', pintarJab, { once:true });
}); $('icoLibro').innerHTML = ic3('libro'); $('icoMis').innerHTML = ic3('pergamino');
const abierta = id => !$(id).classList.contains('oculto');
function abrirVentana(id){ $(id).classList.remove('oculto'); renderVentana(id); }
function cerrarVentana(id){ $(id).classList.add('oculto'); ocultarTip(); $('wMenu').classList.add('oculto'); }
function alternarVentana(id){ abierta(id) ? cerrarVentana(id) : abrirVentana(id); }
function hayVentanas(){ return VENTANAS.some(abierta); }
function cerrarVentanas(){ VENTANAS.forEach(cerrarVentana); }
function abrirPerfil(tab){
  if (pantallaActual && PANELES_JUEGO.includes(pantallaActual)) pantalla(null);
  if (tab === 'bolsa') return abrirVentana('wBolsa');
  if (tab === 'poderes') return abrirVentana('wLibro');
  wTab = tab === 'registro' ? 'registro' : 'personaje'; abrirVentana('wPj');
}
function renderVentana(id){
  if (!PJ || !abierta(id)) return;
  if (id === 'wPj') renderPj(); else if (id === 'wBolsa') renderBolsa(); else if (id === 'wMis') renderMisiones(); else renderLibro();
}
function renderPerfil(){ VENTANAS.forEach(renderVentana); }
document.querySelectorAll('[data-wcerrar]').forEach(b => b.onclick = () => cerrarVentana(b.dataset.wcerrar));
document.querySelectorAll('[data-wtab]').forEach(b => b.onclick = () => { wTab = b.dataset.wtab; renderPj(); });
// arrastrar ventanas por la cabecera
document.querySelectorAll('.wv-cab').forEach(cab => {
  cab.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || innerWidth < 820 || esTactil) return; // en el teléfono las ventanas quedan fijas dentro de la pantalla
    const v = cab.parentElement, r = v.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
    v.style.right = 'auto'; v.style.bottom = 'auto'; v.style.transform = 'none'; v.style.left = r.left + 'px'; v.style.top = r.top + 'px';
    const mover = ev => { v.style.left = clamp(ev.clientX - ox, 0, innerWidth - 60) + 'px'; v.style.top = clamp(ev.clientY - oy, 0, innerHeight - 40) + 'px'; };
    const fin = () => { removeEventListener('pointermove', mover); removeEventListener('pointerup', fin); };
    addEventListener('pointermove', mover); addEventListener('pointerup', fin);
  });
});

// ---------- descripción emergente (tooltip) ----------
function lineasObj(o, titulo){
  const R = RAREZAS[o.rareza], tipo = o.slot === 'arma' ? (o.nombre.split(' ')[0]) : '';
  let h = titulo ? `<span class="gris">${titulo}</span>` : '';
  h += `<span class="tn" style="color:${R.c}">${escapar(o.nombre)}</span>`;
  h += `<span class="amar">Nivel de objeto ${o.nivel}</span>`;
  h += `<div class="fila"><span>${RANURAS[o.slot].n}</span><span>${tipo}</span></div>`;
  if (o.dmg) h += `<div class="fila"><span>${Math.round(o.dmg * .85)} - ${Math.round(o.dmg * 1.15)} de daño</span><span>Velocidad 2,40</span></div>`;
  for (const [k, v] of Object.entries(o.stats)) h += `<span>+${v} ${NOMBRE_STAT[k]}</span>`;
  h += `<span class="gris">${R.n}</span>`;
  asegurarDur(o); h += `<span class="${roto(o) ? 'rojo' : ''}">Durabilidad ${o.dur} / ${o.durMax}${roto(o) ? ' (roto)' : ''}</span>`;
  h += `<span>Precio de venta: ${dinero(precioVenta(o))}</span>`;
  return h;
}
function htmlTip(o, comparar){
  const eq = comparar && PJ.equipo[o.slot];
  let dif = '';
  if (comparar && eq){
    const d = [], claves = new Set([...Object.keys(o.stats), ...Object.keys(eq.stats)]);
    if (o.dmg || eq.dmg) claves.add('dmg');
    for (const k of claves){
      const v = k === 'dmg' ? (o.dmg || 0) - (eq.dmg || 0) : (o.stats[k] || 0) - (eq.stats[k] || 0);
      if (v) d.push(`<span class="${v > 0 ? 'verde' : 'rojo'}">${v > 0 ? '+' : ''}${v} ${k === 'dmg' ? 'daño' : NOMBRE_STAT[k]}</span>`);
    }
    dif = `<div class="tsep"></div><span class="amar">Si lo equipas:</span>${d.length ? d.join('') : '<span class="gris">Sin cambios</span>'}`;
  }
  const actual = `<div style="display:flex;flex-direction:column">${lineasObj(o)}${dif}<div class="tsep"></div><span class="verde">${comparar ? 'Clic derecho: equipar' : 'Clic derecho: quitar'}</span></div>`;
  if (eq) return `<div class="doble"><div style="display:flex;flex-direction:column">${lineasObj(eq, 'Equipado actualmente')}</div>${actual}</div>`;
  return actual;
}
function htmlTipPocion(){
  return `<div style="display:flex;flex-direction:column"><span class="tn" style="color:#fff">Poción de vida</span>
    <span>Montón de ${PJ.pociones}</span><span class="verde">Uso: recupera una parte de tu vida.</span>
    <span class="gris">Tecla H. La tendera del mercado vende más.</span><div class="tsep"></div><span class="verde">Clic: beber</span></div>`;
}
function mostrarTip(html, x, y){
  const t = $('wTip'); t.innerHTML = html; t.classList.remove('oculto');
  const r = t.getBoundingClientRect();
  let px = x + 18, py = y - r.height - 10;
  if (px + r.width > innerWidth - 6) px = x - r.width - 18;
  if (px < 6) px = 6;
  if (py < 6) py = Math.min(innerHeight - r.height - 6, y + 18);
  t.style.left = px + 'px'; t.style.top = py + 'px';
}
function ocultarTip(){ $('wTip').classList.add('oculto'); }
function menuEn(x, y, opciones){
  const m = $('wMenu'); m.innerHTML = '';
  for (const [txt, fn, extra] of opciones){
    const b = document.createElement('button'); b.innerHTML = `<span>${txt}</span>${extra || ''}`;
    if (fn === null){ b.disabled = true; b.style.color = '#7a7a7a'; b.style.cursor = 'default'; }
    b.onclick = ev => { ev.stopPropagation(); m.classList.add('oculto'); ocultarTip(); fn && fn(); };
    m.appendChild(b);
  }
  m.classList.remove('oculto');
  const r = m.getBoundingClientRect();
  m.style.left = clamp(x, 6, innerWidth - r.width - 6) + 'px'; m.style.top = clamp(y, 6, innerHeight - r.height - 6) + 'px';
}
addEventListener('pointerdown', e => { if (!e.target.closest('#wMenu') && !e.target.closest('[data-bo],[data-eq],[data-pocion],[data-hz],[data-st]')) $('wMenu').classList.add('oculto'); }, true);
const objDe = el => el.dataset.bo ? PJ.bolsa.find(x => x.id === el.dataset.bo) : el.dataset.eq ? PJ.equipo[el.dataset.eq] : null;
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse' || !PJ) return;
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el){ ocultarTip(); return; }
  if (el.dataset.pocion !== undefined) return mostrarTip(htmlTipPocion(), e.clientX, e.clientY);
  if (el.dataset.st) return mostrarTip(htmlTipApilable(el.dataset.st), e.clientX, e.clientY);
  const o = objDe(el); if (o) mostrarTip(htmlTip(o, !!el.dataset.bo), e.clientX, e.clientY);
});
document.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || $('wTip').classList.contains('oculto')) return;
  if (!e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]')) return ocultarTip();
  const t = $('wTip'), r = t.getBoundingClientRect();
  let px = e.clientX + 18, py = e.clientY - r.height - 10;
  if (px + r.width > innerWidth - 6) px = e.clientX - r.width - 18;
  if (py < 6) py = Math.min(innerHeight - r.height - 6, e.clientY + 18);
  t.style.left = Math.max(6, px) + 'px'; t.style.top = py + 'px';
});
document.addEventListener('contextmenu', e => {
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el) return;
  e.preventDefault(); ocultarTip();
  if (el.dataset.bo) equipar(el.dataset.bo);
  else if (el.dataset.eq && PJ.equipo[el.dataset.eq]) quitarEquipo(el.dataset.eq);
  else if (el.dataset.pocion !== undefined) beberPocion();
  else if (el.dataset.st) usarApilable(el.dataset.st);
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-bo],[data-eq],[data-pocion],[data-st]');
  if (!el || !PJ) return;
  const r = el.getBoundingClientRect(), x = r.right + 4, y = r.top;
  if (el.dataset.pocion !== undefined){ beberPocion(); renderBolsa(); return; }
  if (el.dataset.st){
    const k = el.dataset.st, A = APILABLES[k];
    if (e.pointerType && e.pointerType !== 'mouse') mostrarTip(htmlTipApilable(k), r.left, r.top);
    const op = [];
    if (A.usa) op.push(['Usar', () => usarApilable(k)]);
    if (E.tipo === 'tienda'){
      op.push(['Vender 1', () => venderApilable(k, false), dinero(A.valor)]);
      if (PJ.mats[k] > 1) op.push([`Vender ${PJ.mats[k]}`, () => venderApilable(k, true), dinero(A.valor * PJ.mats[k])]);
    } else op.push(['Vender (solo en la tienda)', null]);
    op.push(['Cancelar']);
    menuEn(x, y, op); return;
  }
  const o = objDe(el); if (!o) return;
  if (e.pointerType && e.pointerType !== 'mouse') mostrarTip(htmlTip(o, !!el.dataset.bo), r.left, r.top);
  if (el.dataset.bo) menuEn(x, y, [['Equipar', () => equipar(o.id)], E.tipo === 'tienda' ? ['Vender', () => vender(o.id), dinero(precioVenta(o))] : ['Vender (solo en la tienda)', null], ['Cancelar']]);
  else menuEn(x, y, [['Quitar', () => quitarEquipo(el.dataset.eq)], ['Cancelar']]);
});

// ---------- ventana del personaje ----------
function slotHTML(k){
  const o = PJ.equipo[k], rs = RANURAS[k];
  return `<button class="wslot ${o ? 'lleno' : ''}" data-eq="${k}" style="--rc:${o ? RAREZAS[o.rareza].c : '#555'}" aria-label="${rs.n}${o ? ': ' + escapar(o.nombre) : ''}">
    ${o ? icoObj(o) : `<span class="vac">${rs.ic}</span>`}</button>`;
}
function renderPj(){
  if (!abierta('wPj')) return;
  const c = CLASES[PJ.clase], R = RANGOS[rangoCazador()];
  $('wPjTitulo').textContent = PJ.nombre;
  document.querySelectorAll('[data-wtab]').forEach(b => b.setAttribute('aria-selected', b.dataset.wtab === wTab));
  const rc = $('wPjRetrato').getContext('2d'); rc.clearRect(0, 0, 96, 96); rc.drawImage($('avatar'), 0, 0, 96, 96);
  const cuerpo = $('wPjCuerpo');
  if (wTab === 'personaje'){
    const fila = (n, v, k) => `<div class="pd-fila"><span>${n}</span><b ${v.id ? `id="${v.id}"` : ''} class="${v.extra ? 'verde' : ''}">${v.t}${k ? `<button class="pd-mas" data-stat="${k}" ${PJ.puntos ? '' : 'disabled'} aria-label="Subir ${n}">+</button>` : ''}</b></div>`;
    const at = ['fue','agi','vit','int'].map(k => fila(NOMBRE_STAT[k], { t:D.s[k], extra:D.s[k] > PJ.stats[k] }, k)).join('');
    const cb = [['Vida', `${Math.ceil(P.hp)}/${D.maxHp}`], [recurso().n, `${Math.floor(P.en)}/${D.maxEn}`], ['Daño físico', Math.round(D.fis)], ['Daño mágico', Math.round(D.mag)],
      ['Crítico', Math.round(D.crit * 100) + '%'], ['Defensa', Math.round(D.def * 100) + '%'], ['Velocidad', Math.round(D.vel)], ['Forja', '+' + PJ.arma]]
      .map(([n, v]) => fila(n, { t:v, id:n === 'Vida' ? 'pdVida' : n === recurso().n ? 'pdEn' : '' })).join('');
    cuerpo.innerHTML = `<p class="pd-sub">Nivel ${PJ.nivel} ${c.nombre} · <span style="color:${R.color}">Rango ${R.l}</span></p>
      <div class="pd"><div class="pd-col">${IZQ.map(slotHTML).join('')}</div>
        <div class="pd-mod"><canvas id="figura" width="240" height="300"></canvas></div>
        <div class="pd-col">${DER.filter(k => k !== 'arma').map(slotHTML).join('')}</div></div>
      <div class="pd-abajo">${slotHTML('arma')}</div>
      ${PJ.puntos ? `<p class="pd-puntos">Tienes ${PJ.puntos} puntos de atributo para repartir</p>` : ''}
      <div class="pd-stats"><div class="pd-caja"><h4>Atributos</h4>${at}</div><div class="pd-caja"><h4>Combate</h4>${cb}</div></div>`;
    cuerpo.querySelectorAll('.pd-mas').forEach(b => b.onclick = () => { if (PJ.puntos <= 0) return; PJ.stats[b.dataset.stat]++; PJ.puntos--; recalcular(); });
  } else if (wTab === 'mascota'){
    cuerpo.innerHTML = PJ.mascota
      ? (() => { const m = PJ.mascota, H = HAB_MASCOTA[m.tipo], g = (PJ.mats || {}).queso || 0, sig = xpMascotaSig(m.nivel);
         return `<div class="pd-caja pet-caja"><h4>${escapar(m.nombre)} <small>nivel ${m.nivel}</small></h4><p>${TIPOS_RATA[m.tipo]} · <b>${H.n}</b></p>
         <p class="pet-hab">${H.d(m.nivel)}</p>
         <div class="pet-barra"><span>Experiencia</span><i><b style="width:${m.nivel >= MAX_NV_MASCOTA ? 100 : Math.round(m.xp / sig * 100)}%;background:#ffd100"></b></i><small>${m.nivel >= MAX_NV_MASCOTA ? 'máximo' : `${m.xp}/${sig}`}</small></div>
         <div class="pet-barra"><span>Barriga</span><i><b style="width:${Math.round(m.hambre)}%;background:${m.hambre < 20 ? '#ff5a5a' : '#7dffa8'}"></b></i><small>${Math.round(m.hambre)}%</small></div>
         ${m.hambre < 20 ? '<p class="pet-aviso">Tiene hambre: no te ayudará hasta que coma.</p>' : ''}
         <p class="gris" style="color:#9d9d9d;margin:6px 0">${M ? 'Te acompaña ahora mismo. Gana experiencia cuando derrotas monstruos.' : 'Está descansando en las sombras.'}</p>
         <div class="pet-bot"><button class="wbtn" id="wPet">${M ? 'Guardar mascota' : 'Invocar mascota'}</button>
         <button class="wbtn" id="wPetQueso" ${g ? '' : 'disabled'}>Dar galleta (${g})</button></div>
         ${g ? '' : '<p class="nota">Compra galletas de queso en el mercado.</p>'}</div>`; })()
      : `<div class="pd-caja" style="text-align:center"><h4>Sin mascota</h4><p>Pulsa G o el botón de la huella para elegir tu primera mascota.</p></div>`;
    const b = $('wPet'); if (b) b.onclick = () => { toggleMascota(); renderPj(); };
    const bq = $('wPetQueso'); if (bq) bq.onclick = () => { usarApilable('queso'); renderPj(); };
  } else if (wTab === 'desafios'){ cuerpo.innerHTML = htmlDesafios(); enlazarDesafios(); }
  else cuerpo.innerHTML = htmlRegistro();
}

// ---------- mochila ----------
function renderBolsa(){
  if (!abierta('wBolsa')) return;
  let h = '<div class="wbag">', n = 0;
  if (PJ.pociones > 0){ h += `<button class="wslot lleno" data-pocion style="--rc:#ffffff" aria-label="Pociones de vida">${ic3('pocion')}<span class="cnt">${PJ.pociones}</span></button>`; n++; }
  for (const k of Object.keys(APILABLES)){
    const c = (PJ.mats || {})[k]; if (!c) continue;
    h += `<button class="wslot lleno" data-st="${k}" style="--rc:${RAREZAS[APILABLES[k].r].c}" aria-label="${APILABLES[k].n}">${ic3(k)}${c > 1 ? `<span class="cnt">${c}</span>` : ''}</button>`; n++;
  }
  for (const o of PJ.bolsa){ h += `<button class="wslot lleno" data-bo="${o.id}" style="--rc:${RAREZAS[o.rareza].c}" aria-label="${escapar(o.nombre)}">${icoObj(o)}</button>`; n++; }
  const total = Math.max(28, Math.ceil(n / 4) * 4);
  for (; n < total; n++) h += '<div class="wslot"></div>';
  h += `</div><div class="wbag-pie"><span>${PJ.bolsa.length}/${TAM_BOLSA}</span><span class="emb" title="Emblemas">${ic3('emblema')}${PJ.emblemas || 0}</span>${dinero(PJ.oro)}</div>`;
  $('wBolsaCuerpo').innerHTML = h;
}

// ---------- libro de hechizos ----------
function renderLibro(){
  if (!abierta('wLibro')) return;
  const c = CLASES[PJ.clase];
  let h = `<div class="wl-hechizos"><div class="wl-sec">${c.nombre}</div>
    <div class="wl-h"><canvas data-icono="${c.h1.spr}" width="80" height="80"></canvas><div><b>${c.h1.n}</b><small>Clic izquierdo</small></div></div>
    <div class="wl-h"><canvas data-icono="${c.h2.spr}" width="80" height="80"></canvas><div><b>${c.h2.n}</b><small>Clic derecho · ${costeDe(c.h2)} ${recurso().n.toLowerCase()}</small></div></div>
    <div class="wl-sec">Habilidades de clase · ${recurso().n}</div>`;
  const filaPoder = (id, pw) => {
    const bloq = PJ.nivel < pw.nivel, tecla = TECLAS.find(t => PJ.barra[t] === id);
    return `<div class="wl-h ${bloq ? 'bloq' : ''}" data-hz="${id}" title="${pw.d}"><canvas data-icono="${pw.ic}" width="80" height="80" ${bloq ? '' : `draggable="true" data-arrastra="${id}"`}></canvas>
      <div><b>${pw.n}</b><small>${bloq ? `Nivel ${pw.nivel}` : `${costeDe(pw) ? costeDe(pw) + ' ' + recurso().n.toLowerCase() + ' · ' : ''}${pw.cd ? pw.cd + ' s' : 'sin recarga'}${tecla ? ` · tecla ${tecla}` : ''}`}</small></div></div>`;
  };
  for (const [id, pw] of Object.entries(PODERES)) if (pw.clase === PJ.clase && pw.barra) h += filaPoder(id, pw);
  h += '<div class="wl-sec">Técnicas de clase</div>';
  for (const [id, pw] of Object.entries(PODERES)) if (pw.clase === PJ.clase && !pw.barra) h += filaPoder(id, pw);

  h += '<p class="wl-nota">Arrastra un poder a tu barra de acción, o tócalo para elegir su tecla.</p>';
  h += libroDevorar();
  // talentos de la clase
  const libres = puntosTalento(PJ) - talentosGastados(PJ);
  h += `<div class="wl-sec">Talentos <small class="wl-pts">${libres} ${libres === 1 ? 'punto libre' : 'puntos libres'}</small></div>`;
  for (const t of TALENTOS[PJ.clase] || []){
    const r = PJ.talentos[t.id] || 0, puede = libres > 0 && r < MAX_RANGO_TAL;
    h += `<div class="wl-h wl-tal ${r ? '' : 'bloq'}" title="${t.d}"><canvas data-icono="${t.ic}" width="80" height="80"></canvas>
      <div><b>${t.n} <span class="wl-rango">${r}/${MAX_RANGO_TAL}</span></b><small>${t.d}</small></div>
      <button class="wl-mas" data-tal="${t.id}" ${puede ? '' : 'disabled'} aria-label="Subir ${t.n}">+</button></div>`;
  }
  h += `<p class="wl-nota">Ganas un punto de talento cada 2 niveles. ${talentosGastados(PJ) ? '<button class="wl-reini" id="btnReiniTal">Reiniciar talentos</button>' : ''}</p></div>`;
  const cu = $('wLibroCuerpo'); cu.innerHTML = h;
  cu.querySelectorAll('[data-tal]').forEach(b => b.onclick = e => { e.stopPropagation(); subirTalento(b.dataset.tal); });
  cu.querySelectorAll('[data-dev]').forEach(b => b.onclick = e => { e.stopPropagation(); equiparDevorada(b.dataset.dev); });
  if ($('btnReiniTal')) $('btnReiniTal').onclick = reiniciarTalentos;
  cu.querySelectorAll('canvas[data-icono]').forEach(cv => pintarIcono(cv, cv.dataset.icono));
  cu.querySelectorAll('[data-arrastra]').forEach(cv => cv.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', cv.dataset.arrastra); e.dataTransfer.effectAllowed = 'copy'; }));
  cu.querySelectorAll('.wl-h[data-hz]:not(.bloq)').forEach(el => el.onclick = e => {
    const r = el.getBoundingClientRect(), id = el.dataset.hz;
    menuEn(r.left + 20, r.bottom, [...TECLAS.map(t => [`Poner en la tecla ${t}`, () => asignar(id, t), PODERES[PJ.barra[t]] && PJ.barra[t] !== id ? `<small style="color:#9d9d9d">${PODERES[PJ.barra[t]].n}</small>` : '']), ['Cancelar']]);
  });
}
function prepararSoltarBarra(){
  for (const b of barraEls){
    if (b.tipo !== 'poder') continue;
    b.el.addEventListener('dragover', e => { e.preventDefault(); b.el.classList.add('soltar'); });
    b.el.addEventListener('dragleave', () => b.el.classList.remove('soltar'));
    b.el.addEventListener('drop', e => { e.preventDefault(); b.el.classList.remove('soltar'); const id = e.dataTransfer.getData('text/plain'); if (PODERES[id]) asignar(id, b.tecla); });
  }
}

function tarjeta(o){
  const lineas = [];
  if (o.dmg) lineas.push(`<span>+${o.dmg} de daño</span>`);
  for (const [k, v] of Object.entries(o.stats)) lineas.push(`<span>+${v} de ${NOMBRE_STAT[k]}</span>`);
  return `<div class="tarjeta" style="--rc:${RAREZAS[o.rareza].c}"><b>${escapar(o.nombre)}</b>
    <small>${RAREZAS[o.rareza].n}, ${RANURAS[o.slot].n.toLowerCase()}, nivel de objeto ${o.nivel}</small>${lineas.join('')}</div>`;
}
function comparacion(o){
  const eq = PJ.equipo[o.slot];
  if (!eq) return '<p class="nota" style="margin-top:6px">No llevas nada en esa ranura.</p>';
  const dif = [], claves = new Set([...Object.keys(o.stats), ...Object.keys(eq.stats)]);
  if (o.dmg || eq.dmg) claves.add('dmg');
  for (const k of claves){
    const v = k === 'dmg' ? (o.dmg || 0) - (eq.dmg || 0) : (o.stats[k] || 0) - (eq.stats[k] || 0);
    if (!v) continue;
    dif.push(`<span class="${v > 0 ? 'verde' : 'rojo'}">${v > 0 ? '+' : ''}${v} ${k === 'dmg' ? 'de daño' : NOMBRE_STAT[k]}</span>`);
  }
  return `<p class="nota" style="margin-top:6px">Si lo equipas en lugar de ${escapar(eq.nombre)}: ${dif.length ? dif.join(', ') : 'sin cambios'}</p>`;
}

function htmlPersonaje(){
  const c = CLASES[PJ.clase], R = RANGOS[rangoCazador()];
  const ranura = k => {
    const o = PJ.equipo[k], rs = RANURAS[k];
    return `<button class="ranura ${o ? '' : 'vacia'} ${seleccion && seleccion.slot === k ? 'sel' : ''}" data-ranura="${k}" style="--rc:${o ? RAREZAS[o.rareza].c : '#3a3066'}">
      <span>${o ? icoObj(o) : rs.ic}</span><small>${o ? escapar(o.nombre) : rs.n}</small></button>`;
  };
  let det = '<p class="nota">Toca una ranura para ver lo que llevas puesto o cambiarlo por algo de tu bolsa.</p>';
  if (seleccion && seleccion.slot){
    const k = seleccion.slot, o = PJ.equipo[k];
    const opciones = PJ.bolsa.filter(x => x.slot === k);
    det = (o ? tarjeta(o) + `<div class="acciones-obj"><button class="btn" data-quitar="${k}">Quitar</button></div>` : `<p class="nota">No llevas nada en ${RANURAS[k].n.toLowerCase()}.</p>`)
      + `<div class="lista-obj">${opciones.length ? opciones.map(x => `<button class="mini-obj" data-equipar="${x.id}" style="--rc:${RAREZAS[x.rareza].c}"><span>${escapar(x.nombre)}</span><small>Equipar</small></button>`).join('') : '<p class="nota">No tienes otros objetos para esta ranura en tu bolsa.</p>'}</div>`;
  }
  let attrs = '';
  for (const k of ['fue','agi','vit','int']){
    const extra = D.s[k] - PJ.stats[k];
    attrs += `<span>${NOMBRE_STAT[k]} <small class="tenue">(${DESC_STAT[k]})</small></span>
      <span class="val">${D.s[k]}${extra ? ` <small class="verde">+${extra}</small>` : ''}</span>
      <button class="mas" data-stat="${k}" ${PJ.puntos ? '' : 'disabled'} aria-label="Subir ${NOMBRE_STAT[k]}">+</button>`;
  }
  return `<p class="sub">${c.nombre}, nivel ${PJ.nivel}. <span style="color:${R.color}">Cazador de rango ${R.l}</span></p>
    <div class="equipo">
      <div class="col">${IZQ.map(ranura).join('')}</div>
      <div class="figura"><canvas id="figura" width="240" height="300"></canvas></div>
      <div class="col">${DER.map(ranura).join('')}</div>
    </div>
    <div class="detalle">${det}</div>
    <div class="dos">
      <div><h3>Atributos</h3>
        <p class="puntos" style="color:${PJ.puntos ? 'var(--corona)' : 'var(--tenue)'}">${PJ.puntos ? `Tienes ${PJ.puntos} puntos para repartir` : 'Sin puntos por repartir'}</p>
        <div class="stats">${attrs}</div></div>
      <div><h3>Combate</h3><div class="derivados" style="grid-template-columns:1fr auto">
        <span>Vida</span><b>${Math.ceil(P.hp)} / ${D.maxHp}</b><span>Energía</span><b>${Math.floor(P.en)} / ${D.maxEn}</b>
        <span>Daño físico</span><b>${Math.round(D.fis)}</b><span>Daño mágico</span><b>${Math.round(D.mag)}</b>
        <span>Poder de sombra</span><b>${Math.round(D.poder)}</b><span>Crítico</span><b>${Math.round(D.crit * 100)}%</b>
        <span>Defensa</span><b>${Math.round(D.def * 100)}%</b><span>Velocidad</span><b>${Math.round(D.vel)}</b>
        <span>Forja del arma</span><b>+${PJ.arma}</b></div></div>
    </div>`;
}

function htmlBolsa(){
  let celdas = '';
  for (let i = 0; i < TAM_BOLSA; i++){
    const o = PJ.bolsa[i];
    celdas += o ? `<button class="celda ${seleccion && seleccion.id === o.id ? 'sel' : ''}" data-obj="${o.id}" style="--rc:${RAREZAS[o.rareza].c}" title="${escapar(o.nombre)}">${icoObj(o)}</button>`
                : '<div class="celda vacia"></div>';
  }
  let det = '<p class="nota">Toca un objeto para verlo, equiparlo o venderlo. Los monstruos y jefes de los portales sueltan equipo.</p>';
  const o = seleccion && PJ.bolsa.find(x => x.id === seleccion.id);
  if (o) det = tarjeta(o) + comparacion(o) + `<div class="acciones-obj">
      <button class="btn principal" data-equipar="${o.id}">Equipar</button>
      <button class="btn" data-vender="${o.id}">Vender por 🪙 ${precioVenta(o)}</button></div>`;
  return `<p class="sub">${PJ.bolsa.length} de ${TAM_BOLSA} espacios ocupados. Oro: 🪙 ${PJ.oro}. Pociones: 🧪 ${PJ.pociones}</p>
    <div class="bolsa">${celdas}</div><div class="detalle">${det}</div>`;
}

function htmlPoderes(){
  const c = CLASES[PJ.clase];
  let h = `<p class="sub">Aprendes poderes nuevos al subir de nivel. Toca una tecla para colocar cada poder en tu barra de acción.</p>
    <div class="libro"><h3>Ataques de tu clase</h3>
    <div class="hechizo"><canvas data-icono="${c.h1.spr}" width="112" height="112"></canvas><div><b>${c.h1.n}</b><small>Clic izquierdo</small><p>${c.h1.d}</p></div></div>
    <div class="hechizo"><canvas data-icono="${c.h2.spr}" width="112" height="112"></canvas><div><b>${c.h2.n}</b><small>Clic derecho, ${c.h2.coste} de energía</small><p>${c.h2.d}</p></div></div>
    <h3 style="margin-top:6px">Poderes de las sombras</h3>`;
  for (const [id, pw] of Object.entries(PODERES)){
    const bloq = PJ.nivel < pw.nivel;
    h += `<div class="hechizo ${bloq ? 'bloq' : ''}"><canvas data-icono="${pw.ic}" width="112" height="112"></canvas><div>
      <b>${pw.n}</b><small>${bloq ? `Se aprende en el nivel ${pw.nivel}` : `${pw.coste} de energía, recarga de ${pw.cd} segundos`}</small><p>${pw.d}</p>
      ${bloq ? '' : `<div class="teclas">${TECLAS.map(t => `<button data-asignar="${id}" data-tecla="${t}" aria-pressed="${PJ.barra[t] === id}">${t}</button>`).join('')}</div>`}
    </div></div>`;
  }
  return h + '</div>';
}

function htmlRegistro(){
  const r = rangoCazador(), R = RANGOS[r];
  const sig = r < 5 ? `Próxima reevaluación de rango en el nivel ${UMBRAL_RANGO[r + 1]}.` : 'Has alcanzado el rango más alto.';
  return `<div class="perfil-cab">
      <div class="rango-grande" style="color:${R.color}">${R.l}</div>
      <div><h3>${escapar(PJ.nombre)}</h3><p>${CLASES[PJ.clase].nombre}, nivel ${PJ.nivel}</p><p>Cazador de rango ${R.l}. ${sig}</p></div>
    </div>
    <p class="tenue" style="font-size:.95rem">Experiencia ${PJ.xp} de ${PJ.xpSig}</p>
    <div class="xpbar"><span style="width:${PJ.xp / PJ.xpSig * 100}%"></span></div>
    <h3>Mazmorras despejadas</h3><div class="registro">
      ${RANGOS.map(x => `<div><b style="color:${x.color}">${x.l}</b><span>${PJ.limpias[x.l]}</span></div>`).join('')}
    </div>
    <div class="seccion">
      <div class="linea"><span>Jefes derrotados</span><b>${PJ.jefesTotal}</b></div>
      <div class="linea"><span>Monstruos eliminados</span><b>${PJ.kills}</b></div>
      <div class="linea"><span>Mascota</span><b>${PJ.mascota ? `${escapar(PJ.mascota.nombre)} (${TIPOS_RATA[PJ.mascota.tipo]})` : 'Aún no tienes'}</b></div>
      <div class="linea"><span>Tiempo de juego</span><b>${Math.floor(PJ.tiempo / 3600)} h ${Math.floor(PJ.tiempo / 60) % 60} min</b></div>
    </div>`;
}

function renderPerfil(){
  document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === pestana));
  $('vTitulo').textContent = { personaje:PJ.nombre, bolsa:'Bolsa', poderes:'Libro de poderes', registro:'Registro de cazador' }[pestana];
  const cuerpo = $('vCuerpo'), scroll = cuerpo.scrollTop;
  cuerpo.innerHTML = { personaje:htmlPersonaje, bolsa:htmlBolsa, poderes:htmlPoderes, registro:htmlRegistro }[pestana]();
  cuerpo.scrollTop = scroll;
  cuerpo.querySelectorAll('[data-ranura]').forEach(b => b.onclick = () => { seleccion = { slot:b.dataset.ranura }; renderPerfil(); });
  cuerpo.querySelectorAll('[data-obj]').forEach(b => b.onclick = () => { seleccion = { id:b.dataset.obj }; renderPerfil(); });
  cuerpo.querySelectorAll('[data-equipar]').forEach(b => b.onclick = () => equipar(b.dataset.equipar));
  cuerpo.querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => quitarEquipo(b.dataset.quitar));
  cuerpo.querySelectorAll('[data-vender]').forEach(b => b.onclick = () => vender(b.dataset.vender));
  cuerpo.querySelectorAll('[data-asignar]').forEach(b => b.onclick = () => asignar(b.dataset.asignar, b.dataset.tecla));
  cuerpo.querySelectorAll('canvas[data-icono]').forEach(c => pintarIcono(c, c.dataset.icono));
  cuerpo.querySelectorAll('.mas').forEach(b => b.onclick = () => {
    if (PJ.puntos <= 0) return;
    PJ.stats[b.dataset.stat]++; PJ.puntos--; recalcular();
  });
}

function recalcular(){
  pintarDurabilidad();
  const hpA = D.maxHp, enA = D.maxEn;
  derivar();
  P.hp = clamp(P.hp + (D.maxHp - hpA), 1, D.maxHp);
  P.en = clamp(P.en + (D.maxEn - enA), 0, D.maxEn);
  guardar(); renderPerfil();
}
function equipar(id){
  const i = PJ.bolsa.findIndex(o => o.id === id); if (i < 0) return;
  const o = PJ.bolsa[i], antes = PJ.equipo[o.slot];
  PJ.equipo[o.slot] = o; PJ.bolsa.splice(i, 1);
  if (antes) PJ.bolsa.push(antes);
  seleccion = pestana === 'personaje' ? { slot:o.slot } : null;
  recalcular();
}
function quitarEquipo(slot){
  if (PJ.bolsa.length >= TAM_BOLSA){ banner('Tu bolsa está llena', 'Vende algo antes de quitarte este objeto'); return; }
  PJ.bolsa.push(PJ.equipo[slot]); PJ.equipo[slot] = null; recalcular();
}
function vender(id){
  if (E.tipo !== 'tienda'){ chat('Solo puedes vender en el Mercado de Lumeria.', '#ff8a9b'); return; }
  const i = PJ.bolsa.findIndex(o => o.id === id); if (i < 0) return;
  PJ.oro += precioVenta(PJ.bolsa[i]); PJ.bolsa.splice(i, 1); seleccion = null; guardar(); renderPerfil();
}
function asignar(id, tecla){
  const anterior = PJ.barra[tecla], donde = TECLAS.find(t => PJ.barra[t] === id);
  PJ.barra[tecla] = id;
  if (donde && donde !== tecla) PJ.barra[donde] = anterior;
  guardar(); construirBarra(); renderPerfil();
}

function dibujarFigura(t){
  const c = $('figura'); if (!c) return;
  const a = c.getContext('2d');
  a.clearRect(0, 0, c.width, c.height);
  const g = a.createRadialGradient(120, 170, 10, 120, 170, 170);
  g.addColorStop(0, CLASES[PJ.clase].color + '55'); g.addColorStop(1, '#0e0a1c');
  a.fillStyle = g; a.fillRect(0, 0, c.width, c.height);
  a.fillStyle = 'rgba(0,0,0,.45)'; a.beginPath(); a.ellipse(120, 274, 50, 12, 0, 0, TAU); a.fill();
  if (!gatosListo) return;
  const [sx, sy, w, h, ax, ay] = cuadroGato(PJ.gato, 'ab', 0), esc = escGato(PJ.gato, 190 / 96), r = Math.sin(t / 420);
  a.save(); a.translate(110, 274);
  if (gatoPx(PJ.gato)){ a.imageSmoothingEnabled = false; a.translate(0, r > .6 ? -esc : 0); }
  else a.scale(1 - .012 * r, 1 + .025 * r);
  const frF = [sx, sy, w, h, ax, ay];
  if (gatoPx(PJ.gato)) dibujarEquipoGato(a, imgGato(PJ.gato), frF, 'ab', esc, PJ.equipo, 'atras');
  a.drawImage(hojaJugador(), sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  if (gatoPx(PJ.gato)) dibujarEquipoGato(a, imgGato(PJ.gato), frF, 'ab', esc, PJ.equipo, 'frente');
  a.restore();
  if (PJ.mascota && ratasListo){
    // ciclo: despierto mirando a los lados, luego se duerme
    const ciclo = (t / 1000) % 16, flip = ciclo < 7 && Math.floor(ciclo / 2.5) % 2 === 1;
    const q = cuadroRata(PJ.mascota.tipo, flip ? 'lado' : 'abajo', false, 0, true);
    pintarGato(a, PJ.mascota.tipo, 196, 280, 74, t, false, false, ciclo, null, q.img, q.fr);
    a.font = '700 13px Rajdhani, sans-serif'; a.textAlign = 'center'; a.fillStyle = '#e9e4ff';
    a.fillText(PJ.mascota.nombre, 196, 296);
  }
}

// ----- Iconos y barra de acción -----
// ícono pixelado sin fondo para los botones redondos del teléfono
function pintarIconoBoton(c, spr){ const a = c.getContext('2d'); a.clearRect(0, 0, c.width, c.height); a.imageSmoothingEnabled = false; const ic = iconoPx(spr.slice(3), PALETA_CLASE[PJ.clase]), k = Math.floor(c.width * .7 / 16); a.drawImage(ic, (c.width - 16 * k) / 2, (c.width - 16 * k) / 2, 16 * k, 16 * k); }
function pintarIcono(c, spr){
  const a = c.getContext('2d'), s = c.width;
  a.clearRect(0, 0, s, s);
  const g = a.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s * .7);
  g.addColorStop(0, '#2e2160'); g.addColorStop(1, '#0b0817');
  a.fillStyle = g; a.fillRect(0, 0, s, s);
  if (spr === 'pocion'){
    a.fillStyle = '#c9b8ff'; a.fillRect(s * .42, s * .14, s * .16, s * .16);
    a.fillStyle = '#e2445c'; a.beginPath(); a.arc(s / 2, s * .58, s * .27, 0, TAU); a.fill();
    a.fillStyle = 'rgba(255,255,255,.4)'; a.beginPath(); a.arc(s * .42, s * .5, s * .07, 0, TAU); a.fill();
    return;
  }
  if (!spr) return;
  if (spr.startsWith('pxd:')){
    const ic = iconoPx(spr.slice(4), PALETA_DEVORAR), k = Math.floor(s * .9 / 16);
    a.imageSmoothingEnabled = false; a.drawImage(ic, (s - 16 * k) / 2, (s - 16 * k) / 2, 16 * k, 16 * k); return;
  }
  if (spr.startsWith('px:')){
    const ic = iconoPx(spr.slice(3), PALETA_CLASE[PJ ? PJ.clase : 'mago']), k = Math.floor(s * .9 / 16);
    a.imageSmoothingEnabled = false; a.drawImage(ic, (s - 16 * k) / 2, (s - 16 * k) / 2, 16 * k, 16 * k); return;
  }
  if (!spriteListo){ SPR.addEventListener('load', () => pintarIcono(c, spr), { once:true }); return; }
  const [sx, sy, w, h] = ATLAS[spr], k = Math.min(s * .9 / w, s * .9 / h);
  a.imageSmoothingEnabled = false;
  a.drawImage(SPR, sx, sy, w, h, (s - w * k) / 2, (s - h * k) / 2, w * k, h * k);
}

let barraEls = [];
function construirBarra(){
  const b = $('barra'); b.innerHTML = ''; barraEls = [];
  const c = CLASES[PJ.clase];
  const crear = (cls, tecla, spr, titulo, fn, info) => {
    const el = document.createElement('button');
    el.className = 'accion ' + cls; el.title = titulo; el.setAttribute('aria-label', titulo);
    el.innerHTML = `<canvas width="96" height="96"></canvas><kbd>${tecla}</kbd><b class="bloq"></b><i class="num"></i><i class="seg"></i>`;
    pintarIcono(el.querySelector('canvas'), spr);
    el.addEventListener('pointerdown', e => { e.preventDefault(); fn(); });
    b.appendChild(el); barraEls.push({ el, ...info });
  };
  const sep = () => { const s = document.createElement('span'); s.className = 'sep'; b.appendChild(s); };
  crear('clic', 'Izq', c.h1.spr, c.h1.n, () => usarHab(1), { tipo:'h1' });
  crear('clic', 'Der', c.h2.spr, c.h2.n, () => usarHab(2), { tipo:'h2' });
  sep();
  TECLAS.forEach(t => {
    const pw = PODERES[PJ.barra[t]];
    crear('', t, pw ? pw.ic : null, pw ? pw.n : 'Vacío', () => usarPoder(PJ.barra[t]), { tipo:'poder', tecla:t });
  });
  sep();
  crear('poc', 'H', 'pocion', 'Poción de vida', beberPocion, { tipo:'poc' });
  // la habilidad devorada (Z)
  { const dv = devorarDe(), H = HAB_MONSTRUO[dv.equipada]; crear('dev', 'Z', H ? 'pxd:' + H.ic : 'pxd:devorar', H ? H.n : 'Devorar', usarDevorada, { tipo:'dev' }); }
  prepararSoltarBarra();
}
function actualizarBarra(){
  const c = CLASES[PJ.clase];
  for (const b of barraEls){
    let cd = 0, bloq = '', num = '', seg = 0;
    if (b.tipo === 'h1') cd = clamp(P.cd1 / c.h1.cd, 0, 1);
    else if (b.tipo === 'h2') cd = P.en < costeDe(c.h2) ? 1 : clamp(P.cd2 / c.h2.cd, 0, 1);
    else if (b.tipo === 'poc'){ cd = clamp(P.cdPoc, 0, 1); num = PJ.pociones; }
    else if (b.tipo === 'dev'){ const n = devorarDe().equipada; if (!n) bloq = '—'; else { cd = clamp((P.cdDev || 0) / HAB_MONSTRUO[n].cd, 0, 1); seg = P.cdDev || 0; } }
    else {
      const id = PJ.barra[b.tecla], pw = PODERES[id];
      if (pw && PJ.nivel < pw.nivel) bloq = 'Nv ' + pw.nivel;
      else if (pw){ cd = P.en < costeDe(pw) ? 1 : (pw.cd ? clamp((P.cdP[id] || 0) / pw.cd, 0, 1) : 0); seg = P.cdP[id] || 0; }
    }
    if (b.tipo === 'h2') seg = P.cd2;
    if ((b.tipo === 'h2' || b.tipo === 'poder') && !bloq && P.gcd > 0) cd = Math.max(cd, P.gcd / GCD);
    const segTxt = seg > 0.05 ? (seg < 1 ? seg.toFixed(1) : Math.ceil(seg)) + '' : '';
    if (b.seg !== segTxt){ b.el.querySelector('.seg').textContent = segTxt; b.seg = segTxt; }
    if (b.cd !== cd){ b.el.style.setProperty('--cd', cd); b.cd = cd; }
    if (b.bloq !== bloq){ b.el.querySelector('.bloq').textContent = bloq; b.el.classList.toggle('bloqueado', !!bloq); b.bloq = bloq; }
    if (b.num !== num){ b.el.querySelector('.num').textContent = num; b.num = num; }
  }
}

function abrirPanelPortal(portal){
  const R = RANGOS[portal.rango], mio = rangoCazador();
  $('poLetra').textContent = R.l; $('poLetra').style.color = R.color;
  $('poTitulo').textContent = portal.mundo ? `Grieta roja: ${jefeMundoNombre()}` : portal.semanal ? `Portal dorado: ${titanDeLaSemana()}` : `Portal de rango ${R.l}`;
  let aviso = '';
  if (portal.rango > mio + 1) aviso = '<p class="aviso" style="margin-top:10px">Este portal supera por mucho tu rango. Lo más probable es que no salgas con vida.</p>';
  else if (portal.rango > mio) aviso = '<p class="aviso" style="margin-top:10px">Este portal está por encima de tu rango. Entra con cuidado.</p>';
  else if (portal.rango < mio) aviso = `<p class="aviso" style="margin-top:10px;color:#9d9d9d">Portal por debajo de tu rango: solo darás ${mio - portal.rango === 1 ? 'el 25%' : 'el 5%'} de la experiencia.</p>`;
  $('poCuerpo').innerHTML = `
    <div class="linea"><span>Mazmorra</span><b>${R.tema}</b></div>
    <div class="linea"><span>Nivel recomendado</span><b>${R.nivel}</b></div>
    <div class="linea"><span>Tu rango</span><b style="color:${RANGOS[mio].color}">${RANGOS[mio].l} (nivel ${PJ.nivel})</b></div>
    <div class="linea"><span>Jefe</span><b>${R.jefe}</b></div>
    <div class="linea"><span>Recompensa al despejar</span><b>${dinero(Math.round(80 * R.escala) * 100)} y más</b></div>
    ${portal.mundo ? `<div class="linea"><span>Jefe de mundo</span><b style="color:#ff4f6b">${jefeMundoNombre()}</b></div>
    <div class="linea"><span>Botín</span><b>${jefeMundoHecho() ? 'Ya lo derrotaste esta hora' : '5 emblemas, mucho dinero y un objeto épico'}</b></div>
    <p class="aviso" style="margin-top:10px">Es seis veces más resistente que un jefe normal. Un tanque y una sanadora irán contigo. La grieta se cierra a los 20 minutos de cada hora.</p>`
    : portal.semanal ? `<div class="linea"><span>Titán semanal</span><b style="color:#ffd100">${titanDeLaSemana()}</b></div>
    <div class="linea"><span>Cofre de la semana</span><b>${titanHecho() ? 'Ya lo abriste' : 'Mucho dinero y un objeto legendario'}</b></div>
    <p class="aviso" style="margin-top:10px">El titán es tres veces más resistente que un jefe normal.</p>`
    : `<div class="linea"><span>Se cierra en</span><b>${formatoTiempo(portal.cierra)}</b></div>`}${aviso}`;
  const btn = $('btnEntrarPortal');
  btn.className = 'btn ' + (portal.rango > mio ? 'peligro' : 'principal');
  btn.onclick = () => entrarPortal(portal);
  pantalla('pPortal');
}
const formatoTiempo = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

