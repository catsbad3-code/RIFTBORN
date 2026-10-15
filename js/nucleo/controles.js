// =====================================================
//  ENTRADA
// =====================================================
const keys = {}, mouse = { x:0, y:0, izq:false }, sticks = { mov:null };
let holdAtk = false;

addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  keys[e.code] = true;
  if (!enJuego) return;
  if (pantallaActual === 'pDialogo' || pantallaActual === 'pPrologo'){
    const enCine = pantallaActual === 'pPrologo';
    if (['Space', 'Enter', 'KeyE', 'NumpadEnter'].includes(e.code)){ e.preventDefault(); enCine ? avanzarCine() : avanzarDialogo(); }
    else if (e.code === 'Escape') enCine ? terminarCine() : terminarDialogo();
    return;
  }
  if (e.code === 'Escape'){
    if (!$('wMenu').classList.contains('oculto')){ $('wMenu').classList.add('oculto'); return; }
    if (pantallaActual === null){ if (hayVentanas()) cerrarVentanas(); else if (objetivoValido()) P.objetivo = null; else if (amigoValido()) P.amigo = null; else pausar(); }
    else if (PANELES_JUEGO.includes(pantallaActual)) pantalla(null);
    return;
  }
  // en el casino, la barra espaciadora tira de la palanca o hace girar la ruleta
  if (pantallaActual === 'pCasino' && e.code === 'Space'){ e.preventDefault(); const g = $('casGirar'); if (g && !g.disabled) g.click(); return; }
  const vent = { KeyC:'wPj', KeyB:'wBolsa', KeyP:'wLibro', KeyL:'wMis' };
  if (e.code === 'KeyI' && pantallaActual === null){ abrirBuscador(); return; }
  if (vent[e.code] && pantallaActual === null){
    if (e.code === 'KeyC') wTab = 'personaje';
    alternarVentana(vent[e.code]);
    return;
  }
  if (pantallaActual) return;
  if (e.code === 'KeyH') beberPocion();
  if (e.code === 'KeyZ') usarDevorada();
  if (e.code === 'KeyE' && interCerca) interCerca.accion();
  if (e.code === 'KeyG') toggleMascota();
  if (e.code === 'KeyY') toggleMontura();
  if (e.code === 'Tab'){ e.preventDefault(); siguienteObjetivo(); }
  if (e.code === 'KeyV'){ VER_PLACAS = !VER_PLACAS; try { localStorage.setItem('rb_placas', VER_PLACAS ? '1' : '0'); } catch (er) {} texto(P.x, P.y - 74, VER_PLACAS ? 'Placas de vida: sí' : 'Placas de vida: no', '#e9e4ff', 13); }
  const tecla = CODIGO_TECLA[e.code];
  if (tecla && !e.repeat) usarPoder(PJ.barra[tecla]);
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouse.izq = false; });

cv.addEventListener('pointerdown', e => {
  if (!enJuego || pantallaActual) return;
  if (e.pointerType === 'mouse'){
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (E.tipo === 'mazmorra'){ const en = enemigoEnPantalla(e.clientX, e.clientY); if (en) fijarObjetivo(en); }
    else { const n = npcEnPantalla(e.clientX, e.clientY); if (n){ P.amigo = n; sfx('click'); } }
    if (e.button === 0) mouse.izq = true;
    if (e.button === 2) usarHab(2);
    return;
  }
  e.preventDefault();
  // tocar un monstruo lo fija como objetivo de tus ataques y poderes
  if (E.tipo === 'mazmorra'){
    const toc = enemigoEnPantalla(e.clientX, e.clientY, 70);
    if (toc){ fijarObjetivo(toc); vibrar(10); return; }
  } else { const n = npcEnPantalla(e.clientX, e.clientY); if (n){ P.amigo = n; vibrar(10); sfx('click'); return; } }
  if (e.clientX < W * .6 && !sticks.mov) sticks.mov = { id:e.pointerId, ox:e.clientX, oy:e.clientY, x:e.clientX, y:e.clientY };
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse'){ mouse.x = e.clientX; mouse.y = e.clientY; return; }
  if (sticks.mov && sticks.mov.id === e.pointerId){ sticks.mov.x = e.clientX; sticks.mov.y = e.clientY; }
});
const soltar = e => {
  if (e.pointerType === 'mouse'){ if (e.button === 0) mouse.izq = false; return; }
  if (sticks.mov && sticks.mov.id === e.pointerId) sticks.mov = null;
};
addEventListener('pointerup', soltar);
addEventListener('pointercancel', soltar);
cv.addEventListener('contextmenu', e => e.preventDefault());

$('mAtk').addEventListener('pointerdown', e => { e.preventDefault(); holdAtk = true; });
['pointerup','pointercancel','pointerleave'].forEach(ev => $('mAtk').addEventListener(ev, () => holdAtk = false));
$('mHab').addEventListener('pointerdown', e => { e.preventDefault(); usarHab(2); });
$('mPoc').addEventListener('pointerdown', e => { e.preventDefault(); beberPocion(); });

$('btnMenuJuego').onclick = pausar;
$('btnPantalla').onclick = alternarPantallaCompleta;
$('btnPantallaPausa').onclick = alternarPantallaCompleta;
marcarPantallaCompleta();
$('btnMascota').onclick = () => toggleMascota();
$('btnMontura').onclick = () => toggleMontura();
$('btnBolsa').onclick = () => alternarVentana('wBolsa');
$('btnBuscador').onclick = () => abrirBuscador();
$('durAviso').onclick = () => { wTab = 'personaje'; abrirVentana('wPj'); };
$('ojoLFD').onclick = () => abrirBuscador();
$('btnAceptarGrupo').onclick = () => aceptarGrupo();
$('btnRechazar').onclick = () => { LFD.listo = false; pantalla(null); chat('Rechazaste el grupo.', '#9a91c2'); actualizarOjo(); };
$('btnLibro').onclick = () => alternarVentana('wLibro');
$('btnMis').onclick = () => alternarVentana('wMis');
$('btnPerfil').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPersonaje').onclick = () => { wTab = 'personaje'; alternarVentana('wPj'); };
$('btnPuntos').onclick = () => abrirPerfil('personaje');
$('btnInteractuar').onclick = () => { if (interCerca) interCerca.accion(); };
$('btnSeguir').onclick = () => pantalla(null);
$('btnTamTel').onclick = () => { AJ_TEL.tam = (AJ_TEL.tam + 1) % 3; aplicarAjustesTel(); };
$('btnAutoTel').onclick = () => { AJ_TEL.auto = !AJ_TEL.auto; aplicarAjustesTel(); };
$('btnChatTel').onclick = () => { reiniciarChat(); $('notaGuardado').textContent = 'El chat volvió a su lugar.'; };
aplicarAjustesTel();
$('btnVerPerfil').onclick = () => abrirPerfil('personaje');
$('btnGuardar').onclick = () => { guardar(); $('notaGuardado').textContent = E.tipo === 'mazmorra' ? 'Partida guardada. Si sales ahora, apareces en la ciudad.' : 'Partida guardada.'; };
$('btnSalir').onclick = () => { guardar(); cerrarVentanas(); enJuego = false; document.body.classList.remove('jugando', 'combate'); M = null; ir('pPersonajes'); };
$('btnRevivir').onclick = () => { P.hp = D.maxHp; P.en = recursoLleno(); P.inv = 2; pantalla(null); irPosada('cama'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && enJuego && !pantallaActual) pausar(); });

function pausar(){ $('notaGuardado').textContent = ''; $('btnSaltarPrologo').classList.toggle('oculto', !prologo); pantalla('pPausa'); }
$('btnHistoria').onclick = () => verHistoria();
// modo app: se puede instalar en el teléfono o el ordenador y jugar sin internet
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
let avisoInstalar = null;
const yaInstalado = () => matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone;
addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); avisoInstalar = e;
  for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).classList.remove('oculto');
});
addEventListener('appinstalled', () => { avisoInstalar = null; for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).classList.add('oculto'); });
for (const id of ['btnInstalar', 'btnInstalarPausa']) $(id).onclick = async () => {
  if (!avisoInstalar) return;
  avisoInstalar.prompt();
  try { await avisoInstalar.userChoice; } catch (e) {}
  avisoInstalar = null;
  for (const b of ['btnInstalar', 'btnInstalarPausa']) $(b).classList.add('oculto');
};
// en iPhone no hay aviso de instalación: se explica cómo hacerlo a mano
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !yaInstalado()) $('notaInstalarIos').classList.remove('oculto');
// idioma: en el inicio de sesión y en la pausa (se guarda y la página se recarga en el idioma elegido)
document.querySelectorAll('[data-idioma]').forEach(b => {
  b.setAttribute('aria-pressed', b.dataset.idioma === window.IDIOMA);
  b.onclick = () => { if (b.dataset.idioma !== window.IDIOMA) window.cambiarIdioma(b.dataset.idioma); };
});
$('btnIdioma').textContent = `Idioma · Language: ${window.IDIOMA === 'en' ? 'English' : 'Español'}`;
$('btnIdioma').onclick = () => { guardar(); window.cambiarIdioma(window.IDIOMA === 'en' ? 'es' : 'en'); };
$('btnSaltarPrologo').onclick = () => saltarPrologo();

