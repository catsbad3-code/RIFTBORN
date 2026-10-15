// ---------- hermandades ----------
const PRECIO_HERMANDAD = 5000; // 50 de plata
const COLORES_HERM = ['#8a1c1c', '#e8641c', '#3a2b2e', '#1fb89a', '#6bc26b', '#5b3aa0', '#a9c9c9', '#b49cf0'];
const NOMBRES_BAND = ['Espada', 'Corona', 'Puño', 'Martillo', 'Arco', 'Sol negro', 'Cruz', 'Lis'];
const BAND_URL = 'img/mundo/band.png';
const BAND_IMG = new Image(); BAND_IMG.src = BAND_URL;
const bandPos = i => `background-image:url(${BAND_URL});background-position:${(i / 7 * 100).toFixed(3)}% 0`;
function dibujarBandera(i, x, y, alto){
  if (!BAND_IMG.complete || !BAND_IMG.width) return;
  const w = alto / 2, suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(BAND_IMG, i * 100, 0, 100, 200, Math.round(x - w / 2), Math.round(y), Math.round(w), Math.round(alto));
  ctx.imageSmoothingEnabled = suave;
}
const nivelHerm = h => Math.min(10, 1 + Math.floor((PJ.jefesTotal - h.jefesBase) / 3));
const bonoHerm = () => PJ && PJ.hermandad ? (nivelHerm(PJ.hermandad) - 1) * .02 : 0;
let colorHerm = COLORES_HERM[0];
function abrirHermandad(msg){
  const h = PJ.hermandad, si = $('miSi'), no = $('miNo');
  $('miNombre').textContent = 'Lucía, la registradora';
  si.classList.remove('oculto'); no.textContent = 'Cerrar';
  if (!h){
    $('miTitulo').textContent = 'Fundar una hermandad';
    $('miCuerpo').innerHTML = `<p>Las hermandades reúnen a los cazadores bajo un mismo estandarte. Cuantas más mazmorras despeje tu hermandad, más sube de nivel y más botín reciben sus miembros.</p>
      ${msg ? `<p class="error">${msg}</p>` : ''}
      <label class="campo" style="margin-top:8px">Nombre de la hermandad<input id="hNombreH" maxlength="22" placeholder="Por ejemplo, Garras del Eclipse"></label>
      <label class="campo">Siglas (2 a 4 letras)<input id="hSiglas" maxlength="4" placeholder="GDE" style="text-transform:uppercase"></label>
      <p class="tenue" style="margin:6px 0 4px">Estandarte: <b id="bandNom">${NOMBRES_BAND[COLORES_HERM.indexOf(colorHerm)]}</b></p>
      <div class="herm-colores">${COLORES_HERM.map((c, i) => `<button type="button" class="herm-band" data-c="${c}" style="${bandPos(i)}" aria-pressed="${c === colorHerm}" aria-label="Estandarte ${NOMBRES_BAND[i]}"></button>`).join('')}</div>
      <div class="linea"><span>Coste de registro</span><b>${dinero(PRECIO_HERMANDAD)}</b></div>
      <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>`;
    $('miCuerpo').querySelectorAll('.herm-band').forEach(b => b.onclick = () => { colorHerm = b.dataset.c; $('bandNom').textContent = NOMBRES_BAND[COLORES_HERM.indexOf(colorHerm)]; $('miCuerpo').querySelectorAll('.herm-band').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    si.textContent = 'Fundar hermandad'; si.disabled = PJ.oro < PRECIO_HERMANDAD;
    si.onclick = () => {
      const n = $('hNombreH').value.trim(), sg = $('hSiglas').value.trim().toUpperCase();
      if (n.length < 3) return abrirHermandad('El nombre necesita al menos 3 letras.');
      if (!/^[A-ZÑ0-9]{2,4}$/.test(sg)) return abrirHermandad('Las siglas deben tener de 2 a 4 letras o números.');
      if (PJ.oro < PRECIO_HERMANDAD) return abrirHermandad('No tienes suficiente dinero.');
      PJ.oro -= PRECIO_HERMANDAD;
      PJ.hermandad = { nombre:n, siglas:sg, color:colorHerm, band:COLORES_HERM.indexOf(colorHerm), rango:'Maestro de la hermandad', fundada:Date.now(), jefesBase:PJ.jefesTotal };
      chat(`Has fundado la hermandad <${n}>.`, '#7dffa8'); banner('Hermandad fundada', `<${n}> [${sg}]`);
      guardar(); abrirHermandad();
    };
  } else {
    const nv = nivelHerm(h), sig = nv < 10 ? 3 - ((PJ.jefesTotal - h.jefesBase) % 3) : 0;
    const otros = (cuenta().personajes || []).filter(p => p.id !== PJ.id && p.hermandad && p.hermandad.nombre === h.nombre);
    $('miTitulo').textContent = `<${h.nombre}>`;
    $('miCuerpo').innerHTML = `${msg ? `<p class="error">${msg}</p>` : ''}
      <div class="herm-cab"><span class="herm-escudo band" style="${bandPos(h.band || 0)}"></span>
        <div><b>${escapar(h.nombre)}</b><small>Nivel ${nv} de hermandad</small></div></div>
      <div class="linea"><span>Tu rango</span><b>${h.rango}</b></div>
      <div class="linea"><span>Miembros</span><b>${1 + otros.length}</b></div>
      <div class="linea"><span>Bono de la hermandad</span><b>+${Math.round(bonoHerm() * 100)}% de dinero y experiencia</b></div>
      <div class="linea"><span>Siguiente nivel</span><b>${nv < 10 ? `Despeja ${sig} mazmorra${sig > 1 ? 's' : ''} más` : 'Nivel máximo'}</b></div>
      <div class="linea"><span>Fundada</span><b>${new Date(h.fundada).toLocaleDateString()}</b></div>
      <p class="tenue" style="margin-top:8px">Tus otros personajes de esta cuenta pueden unirse a tu hermandad hablando con Lucía.</p>`;
    si.textContent = 'Abandonar hermandad'; si.disabled = false;
    si.onclick = () => {
      if (si.dataset.confirma !== '1'){ si.dataset.confirma = '1'; si.textContent = '¿Seguro? Pulsa otra vez'; return; }
      si.dataset.confirma = ''; chat(`Has abandonado <${h.nombre}>.`, '#ff8a9b'); PJ.hermandad = null; guardar(); abrirHermandad();
    };
  }
  // unirse a la hermandad de otro personaje de la cuenta
  if (!h){
    const ajenas = [...new Map((cuenta().personajes || []).filter(p => p.id !== PJ.id && p.hermandad).map(p => [p.hermandad.nombre, p.hermandad])).values()];
    if (ajenas.length){
      $('miCuerpo').insertAdjacentHTML('beforeend', `<p class="tenue" style="margin-top:10px">O únete a la hermandad de otro de tus personajes:</p>` +
        ajenas.map((x, i) => `<button class="btn" data-unir="${i}" style="width:100%;margin-top:6px"><span>Unirse a &lt;${escapar(x.nombre)}&gt;</span><span>Gratis</span></button>`).join(''));
      $('miCuerpo').querySelectorAll('[data-unir]').forEach(b => b.onclick = () => {
        const x = ajenas[+b.dataset.unir];
        PJ.hermandad = { ...x, rango:'Miembro', jefesBase:Math.min(PJ.jefesTotal, PJ.jefesTotal) };
        chat(`Te has unido a <${x.nombre}>.`, '#7dffa8'); guardar(); abrirHermandad();
      });
    }
  }
  si.dataset.confirma = '';
  pantalla('pMision');
}
function abrirEvaluacion(){
  const r = rangoCazador(), R = RANGOS[r], si = $('miSi');
  $('miNombre').textContent = 'Ren, el evaluador';
  $('miTitulo').textContent = 'Evaluación de rango';
  $('miCuerpo').innerHTML = `<div class="herm-cab"><span class="herm-escudo" style="background:${R.color};color:#120d24">${R.l}</span>
      <div><b>Cazador de rango ${R.l}</b><small>Nivel ${PJ.nivel}</small></div></div>
    ${RANGOS.map((x, i) => `<div class="linea"><span style="color:${x.color}">Rango ${x.l}</span><b>${i <= r ? '✓ Alcanzado' : `Desde el nivel ${UMBRAL_RANGO[i]}`}</b></div>`).join('')}
    <p class="tenue" style="margin-top:8px">Los portales de tu rango o menor son seguros. Los de rango superior dan mejor botín, pero son mucho más peligrosos.</p>`;
  si.classList.add('oculto'); $('miNo').textContent = 'Gracias';
  pantalla('pMision');
}
function abrirClasificacion(){
  const lista = [...(cuenta().personajes || [])].sort((a, b) => b.nivel - a.nivel || b.jefesTotal - a.jefesTotal);
  $('miNombre').textContent = 'Tablón de la Asociación';
  $('miTitulo').textContent = 'Clasificación de cazadores';
  $('miCuerpo').innerHTML = lista.map((p, i) => `<div class="linea"><span>${i + 1}. ${escapar(p.nombre)}${p.hermandad ? ` <small style="color:${p.hermandad.color}">&lt;${escapar(p.hermandad.siglas)}&gt;</small>` : ''}</span>
      <b>Nivel ${p.nivel} · ${p.jefesTotal || 0} jefes</b></div>`).join('') +
    '<p class="tenue" style="margin-top:8px">Solo aparecen los cazadores de tu cuenta. Cuando el juego esté en un servidor, aquí se verá a todos los jugadores.</p>';
  $('miSi').classList.add('oculto'); $('miNo').textContent = 'Cerrar';
  pantalla('pMision');
}

function irPosada(lugar){
  E = POSADA; limpiarEscena(); modoCombate(false);
  if (lugar === 'cama') colocar(3.6 * T, 2.2 * T); else colocar(5 * T, 5.2 * T);
  chat('Entras en tu habitación de la posada.', '#ffd76a');
}
function irTienda(){
  E = TIENDA; limpiarEscena(); modoCombate(false);
  colocar(6 * T, 6.3 * T);
  chat('Entras en el Mercado de Lumeria.', '#ffd76a');
}

function descansar(){
  $('fundido').classList.add('ver');
  setTimeout(() => {
    P.hp = D.maxHp; P.en = recursoLleno(); guardar();
    limpiarEfectos(true); ponerEfecto('spi_up', 300);
    $('fundido').classList.remove('ver');
    banner('Has descansado', 'Vida y energía al máximo. Partida guardada.');
  }, 700);
}

const precioPocion = () => (15 + rangoCazador() * 20) * 100;
const precioArma = () => Math.round(60 * Math.pow(PJ.arma + 1, 1.6)) * 100;

// encargo (misión) del NPC de la tienda, accesible desde su panel
function npcTienda(spr){ return TIENDA.npcs.find(n => n.spr === spr); }
function botonEncargo(spr){
  const n = npcTienda(spr); if (!n || !n.mision) return '';
  const mk = marcaNPC(n), M = MISIONES[n.mision];
  return `<button class="btn principal" id="enc_${spr}"><span><b style="color:${mk ? mk.col : '#fff'}">${mk ? mk.c : ''}</b> Encargo: ${M.titulo}</span><span></span></button>`;
}
function enlazarEncargo(spr){ const b = $('enc_' + spr); if (b) b.onclick = () => hablarNPC(npcTienda(spr)); }
const valorMinerales = () => Object.entries(PJ.mats || {}).reduce((a, [k, n]) => a + (k.startsWith('m_') ? APILABLES[k].valor * n : 0), 0);
function abrirTienda(msg){
  const p = precioPocion();
  $('tiendaCuerpo').innerHTML = `
    <p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>
    <div class="linea"><span>Pociones en tu bolsa</span><b>🧪 ${PJ.pociones}</b></div>
    <div class="compras">
      <button class="btn" id="cP1" ${PJ.oro < p ? 'disabled' : ''}><span>Comprar 1 poción</span><span>${dinero(p)}</span></button>
      <button class="btn" id="cP5" ${PJ.oro < p * 5 ? 'disabled' : ''}><span>Comprar 5 pociones</span><span>${dinero(p * 5)}</span></button>
      <button class="btn" id="cTe" ${PJ.oro < 600 ? 'disabled' : ''}><span class="tienda-ic">${ic3('tetera')}Té de la posada</span><span>${dinero(600)}</span></button>
      <button class="btn" id="cFarol" ${PJ.oro < 1200 ? 'disabled' : ''}><span class="tienda-ic">${ic3('farol')}Farol purificador</span><span>${dinero(1200)}</span></button>
      <button class="btn" id="cQueso" ${PJ.oro < 300 ? 'disabled' : ''}><span class="tienda-ic">${ic3('queso')}Galleta de queso (mascota)</span><span>${dinero(300)}</span></button>
      <button class="btn" id="cTintes"><span class="tienda-ic">${ic3('tinte')}Tintes de ropa</span><span>${dinero(PRECIO_TINTE)}</span></button>
      ${botonEncargo('tendera')}
      <button class="btn dorado" id="cMin" ${valorMinerales() ? '' : 'disabled'}><span>Vender todos los minerales</span><span>${dinero(valorMinerales())}</span></button>
    </div>
    <p class="nota" style="margin-top:10px">Cada poción recupera casi la mitad de tu vida. Para vender equipo u objetos, abre tu mochila (B) aquí dentro del mercado.</p>`;
  enlazarEncargo('tendera');
  $('cTe').onclick = () => { if (PJ.oro >= 600){ PJ.oro -= 600; darApilable('tetera'); guardar(); abrirTienda('Compraste un Té de la posada.'); } };
  $('cFarol').onclick = () => { if (PJ.oro >= 1200){ PJ.oro -= 1200; darApilable('farol'); guardar(); abrirTienda('Compraste un Farol purificador.'); } };
  $('cTintes').onclick = () => abrirTintes();
  $('cQueso').onclick = () => { if (PJ.oro >= 300){ PJ.oro -= 300; darApilable('queso'); guardar(); abrirTienda('Compraste una Galleta de queso.'); } };
  $('cMin').onclick = () => { const v = valorMinerales(); if (!v) return; for (const k in PJ.mats) if (k.startsWith('m_')) delete PJ.mats[k]; PJ.oro += v; guardar(); abrirTienda(`Vendiste tus minerales por ${dineroTxt(v)}.`); };
  const comprar = n => { if (PJ.oro >= p * n){ PJ.oro -= p * n; PJ.pociones += n; guardar(); abrirTienda(`Compraste ${n} ${n > 1 ? 'pociones' : 'poción'}.`); } };
  $('cP1').onclick = () => comprar(1);
  $('cP5').onclick = () => comprar(5);
  pantalla('pTienda');
}

function abrirForja(msg){
  const p = precioArma(), max = PJ.arma >= 20;
  $('forjaCuerpo').innerHTML = `
    <p style="color:var(--xp);min-height:1.3em">${msg || ''}</p>
    <div class="linea"><span>Tu arma</span><b>+${PJ.arma}</b></div>
    <div class="linea"><span>Tu dinero</span><b>${dinero(PJ.oro)}</b></div>
    <div class="linea"><span>Cada mejora</span><b>+5 de daño físico y mágico</b></div>
    <div class="linea"><span>Reparar todo el equipo</span><b>${costeReparar() ? dinero(costeReparar()) : 'No hace falta'}</b></div>
    <div class="compras">
      <button class="btn" id="cReparar" ${!costeReparar() || PJ.oro < costeReparar() ? 'disabled' : ''}><span>Reparar todo</span><span>${dinero(costeReparar())}</span></button>
      <button class="btn dorado" id="cArma" ${PJ.oro < p || max ? 'disabled' : ''}><span>${max ? 'Tu arma está al máximo' : `Forjar a +${PJ.arma + 1}`}</span><span>${dinero(p)}</span></button>
      ${botonEncargo('herrero')}
    </div>`;
  enlazarEncargo('herrero');
  $('cReparar').onclick = () => { if (reparar()) abrirForja('El herrero dejó tu equipo como nuevo.'); };
  $('cArma').onclick = () => { if (PJ.oro >= p && !max){ PJ.oro -= p; PJ.arma++; derivar(); guardar(); chispas(P.x, P.y, '#ff9a3d', 20, 180); abrirForja(`El herrero templó tu arma. Ahora es +${PJ.arma}.`); } };
  pantalla('pForja');
}

