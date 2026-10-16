// =====================================================
//  MASCOTA (GATOS)
// =====================================================
// 4 gatos x 6 cuadros de caminar: [x, y, ancho, alto, anclaX, anclaY]
// Gatos jugables: vistas de frente (ab), espalda (ar) y lado (mirando a la IZQUIERDA en la hoja)
// cada cuadro: [x, y, ancho, alto, anclaX, anclaY]
const GATOS_DIR = [{"muerto":[[0,0,128,65,63.5,65]],"q_ab":[[139,196,63,94,26.2,94],[204,196,62,94,26.2,94]],"ab":[[268,196,62,94,34.1,94],[332,196,64,94,36.1,94],[398,196,62,95,35.4,95],[462,196,63,94,35.1,94]],"q_ar":[[527,196,59,95,26.2,95],[588,196,59,95,26.2,95]],"ar":[[649,196,59,95,26.6,95],[710,196,59,95,26.8,95],[771,196,59,94,31.9,94],[832,196,59,95,31.9,95]],"q_lado":[[893,196,68,94,25.8,94],[963,196,68,94,25.9,94]],"lado":[[1033,196,69,95,25.7,95],[1104,196,69,95,26.3,95],[1175,196,69,95,25.9,95],[1246,196,70,95,26.7,95]],"q_de":[[1318,196,68,95,40.7,95],[0,294,62,95,19.8,95]],"de":[[64,294,70,95,42.4,95],[136,294,70,96,42.6,96],[208,294,69,95,42.1,95],[279,294,70,96,42.4,96]]},{"ab":[[130,0,76,96,32.0,96],[208,0,77,96,31.5,96],[287,0,77,96,31.5,96],[366,0,79,96,31.5,96]],"ar":[[447,0,86,96,48.5,96],[535,0,81,96,37.5,96],[618,0,75,96,35.0,96],[695,0,74,96,31.5,96],[771,0,73,96,32.0,96]],"lado":[[846,0,82,96,34.0,96],[930,0,82,96,32.0,96],[1014,0,84,96,33.0,96],[1100,0,85,96,36.5,96],[1187,0,80,96,35.5,96],[1269,0,80,96,35.0,96]],"de":[[0,98,86,96,49.5,96],[88,98,76,96,42.5,96],[166,98,87,96,50.0,96],[255,98,75,96,44.0,96],[332,98,77,96,43.5,96],[411,98,72,96,42.5,96]],"muerto":[[485,98,122,56,60.5,56]]},{"ab":[[609,98,95,96,36.5,96]],"ar":[[706,98,94,96,35.5,96]],"lado":[[802,98,92,96,32.5,96],[896,98,98,96,33.0,96],[996,98,93,96,34.0,96]]},{"ab":[[1091,98,73,96,30.5,96],[1166,98,72,96,28.0,96]],"ar":[[1240,98,70,96,28.0,96],[1312,98,66,96,36.5,96],[0,196,67,96,36.0,96]],"lado":[[69,196,68,96,25.0,96]]}];
const GATOS = null;
const GATOS_IMG = new Image();
// Mist (Gato Carmesí) tiene su propia hoja en pixel art: frente, espalda y lado (mirando a la izquierda; se refleja para la derecha), 4 cuadros cada una.
// k: cuánto más chica es su hoja que las de 96 px; px: se dibuja con escala entera y sin suavizar para que los píxeles queden limpios
const MIST_IMG = new Image();
GATOS_DIR[0] = Object.assign({"ab": [[2, 2, 39, 64, 19, 64], [43, 2, 39, 64, 17, 64], [84, 2, 40, 64, 19, 64], [126, 3, 39, 63, 18, 63]], "ar": [[2, 70, 38, 62, 18, 62], [42, 69, 36, 63, 17, 63], [80, 70, 37, 62, 18, 62], [119, 68, 36, 64, 18, 64]], "lado": [[2, 136, 40, 59, 16, 59], [44, 135, 36, 60, 13, 60], [82, 135, 39, 60, 16, 60], [123, 134, 35, 61, 12, 61]]}, { img:MIST_IMG, k:96 / 62, px:true });
// los demás gatos también tienen su hoja propia en pixel art (4 cuadros por vista, 64 px de alto)
const HOJAS_GATO = [[1, 'img/personajes/gato-ejecutivo.png', {"ab": [[2, 2, 39, 64, 19, 64], [43, 2, 39, 64, 19, 64], [84, 2, 39, 64, 19, 64], [125, 2, 39, 64, 19, 64]], "ar": [[2, 68, 38, 64, 19, 64], [42, 68, 38, 64, 19, 64], [82, 68, 38, 64, 19, 64], [122, 68, 38, 64, 19, 64]], "lado": [[2, 135, 41, 64, 17, 64], [45, 134, 39, 65, 15, 65], [86, 135, 41, 64, 17, 64], [129, 134, 39, 65, 15, 65]]}], [2, 'img/personajes/gato-calico.png', {"ab": [[2, 2, 63, 65, 24, 65], [67, 2, 63, 65, 24, 65], [132, 2, 63, 65, 24, 65], [197, 2, 63, 65, 24, 65]], "ar": [[2, 69, 63, 66, 24, 66], [67, 69, 63, 66, 24, 66], [132, 69, 63, 66, 24, 66], [197, 69, 63, 66, 24, 66]], "lado": [[2, 139, 62, 65, 23, 65], [66, 138, 62, 66, 23, 66], [130, 138, 62, 66, 23, 66], [194, 137, 62, 67, 23, 67]]}], [3, 'img/personajes/gato-misterioso.png', {"ab": [[2, 2, 49, 65, 20, 65], [53, 2, 49, 65, 20, 65], [104, 2, 49, 65, 20, 65], [155, 2, 49, 65, 20, 65]], "ar": [[2, 69, 47, 65, 19, 65], [51, 69, 47, 65, 19, 65], [100, 69, 47, 65, 19, 65], [149, 69, 47, 65, 19, 65]], "lado": [[2, 137, 46, 65, 18, 65], [50, 136, 46, 66, 18, 66], [98, 137, 46, 65, 18, 65], [146, 136, 46, 66, 18, 66]]}]];
for (const [i, src, dir] of HOJAS_GATO){ const img = new Image(); img.dataset.src = src; GATOS_DIR[i] = Object.assign(dir, { img, k:96 / 62, px:true }); }
const imgGato = tipo => (GATOS_DIR[tipo] && GATOS_DIR[tipo].img) || GATOS_IMG;
const gatoPx = tipo => !!(GATOS_DIR[tipo] && GATOS_DIR[tipo].px);
// escala de dibujo de un gato a partir de la escala pensada para hojas de 96 px
function escGato(tipo, base){
  const g = GATOS_DIR[tipo] || {}, e = base * (g.k || 1);
  return g.px ? Math.max(1, Math.round(e)) : e;
}
let gatosListo = false, gatosPend = 2 + HOJAS_GATO.length;
// Al cargar las hojas se ajustan los cuadros de caminar de cada gato en pixel art:
//  - el punto de apoyo de cada cuadro pasa a ser el centro de la cabeza y el pecho (antes era el de los pies, que se
//    mueve al dar el paso, y el cuerpo daba saltitos adelante y atrás al andar)
//  - quieto, cada vista usa el cuadro con las piernas más juntas (antes, de lado, se quedaba con el paso abierto)
function ajustarCuadrosGato(){
  for (const GD of GATOS_DIR){
    if (!GD || !GD.px || GD.ajustado) continue;
    const c = document.createElement('canvas'), a = c.getContext('2d', { willReadFrequently:true });
    for (const v of ['ab', 'ar', 'lado', 'de']){
      const set = GD[v]; if (!set || !set.length) continue;
      let quieto = set[0], min = 1e9;
      for (const fr of set){
        const [sx, sy, w, h] = fr; c.width = w; c.height = h; a.clearRect(0, 0, w, h); a.drawImage(GD.img, sx, sy, w, h, 0, 0, w, h);
        const d = a.getImageData(0, 0, w, h).data, opaco = (x, y) => d[(y * w + x) * 4 + 3] > 127;
        // centro de la cabeza y el pecho (del 12% al 50% de la altura): la cola y los pies quedan fuera
        let suma = 0, n = 0;
        for (let y = Math.round(h * .12); y < Math.round(h * .5); y++) for (let x = 0; x < w; x++) if (opaco(x, y)){ suma += x; n++; }
        if (n) fr[4] = Math.round(suma / n * 2) / 2;
        // lo abiertas que van las piernas: anchura de las últimas filas
        let x0 = w, x1 = -1;
        for (let y = h - 5; y < h; y++) for (let x = 0; x < w; x++) if (opaco(x, y)){ if (x < x0) x0 = x; if (x > x1) x1 = x; }
        if (x1 - x0 < min){ min = x1 - x0; quieto = fr; }
      }
      if (!GD['q_' + v]) GD['q_' + v] = [quieto];
    }
    GD.ajustado = true;
  }
}
const gatoCargado = () => { if (--gatosPend === 0){ ajustarCuadrosGato(); gatosListo = true; document.dispatchEvent(new Event('gatoslistos')); } };
GATOS_IMG.onload = gatoCargado; MIST_IMG.onload = gatoCargado;
for (const [i] of HOJAS_GATO){ const im = GATOS_DIR[i].img; im.onload = gatoCargado; im.src = im.dataset.src + '?v=' + VERSION; }
GATOS_IMG.src = 'img/personajes/gatos.png';
MIST_IMG.src = 'img/personajes/mist.png?v=' + VERSION;
const TIPOS_GATO = ['Gato Carmesí', 'Gato Ejecutivo', 'Gato Calicó', 'Gato Misterioso'];
// Mascotas: 4 ratas con 4 direcciones (ar arriba, ab abajo, iz izquierda, de derecha) de 4 cuadros
// cada cuadro: [x, y, ancho, alto, anclaX, anclaY]
const RATAS_DIR = [{"ar": [[2, 2, 24, 38, 11, 38], [28, 2, 25, 38, 12, 38], [55, 2, 25, 38, 12, 38], [82, 2, 23, 38, 11, 38]], "ab": [[2, 42, 23, 38, 11, 38], [27, 42, 25, 38, 12, 38], [54, 42, 24, 38, 11, 38], [80, 42, 23, 38, 11, 38]], "iz": [[2, 82, 21, 38, 10, 38], [25, 82, 21, 38, 10, 38], [48, 82, 20, 38, 9, 38], [70, 82, 19, 38, 9, 38]], "de": [[2, 122, 22, 38, 10, 38], [26, 122, 23, 38, 11, 38], [51, 122, 22, 38, 10, 38], [75, 122, 21, 38, 9, 38]]}, {"ar": [[2, 162, 23, 38, 11, 38], [27, 162, 24, 38, 11, 38], [53, 162, 23, 38, 11, 38], [78, 162, 23, 38, 11, 38]], "ab": [[2, 202, 23, 38, 11, 38], [27, 202, 24, 38, 11, 38], [53, 202, 23, 38, 11, 38], [78, 202, 22, 38, 11, 38]], "iz": [[2, 242, 24, 38, 12, 38], [28, 243, 22, 37, 11, 37], [52, 242, 22, 38, 10, 38], [76, 242, 21, 38, 10, 38]], "de": [[2, 282, 20, 38, 9, 38], [24, 282, 20, 38, 9, 38], [46, 282, 19, 38, 8, 38], [67, 282, 20, 38, 9, 38]]}, {"ar": [[2, 322, 24, 39, 11, 39], [28, 323, 23, 38, 11, 38], [53, 323, 26, 38, 13, 38], [81, 322, 24, 39, 12, 39]], "ab": [[2, 363, 24, 38, 11, 38], [28, 363, 28, 38, 13, 38], [58, 363, 25, 38, 12, 38], [85, 363, 24, 38, 12, 38]], "iz": [[2, 403, 26, 38, 14, 38], [30, 403, 25, 38, 13, 38], [57, 403, 25, 38, 13, 38], [84, 403, 24, 38, 12, 38]], "de": [[2, 443, 26, 38, 12, 38], [30, 443, 26, 38, 12, 38], [58, 443, 26, 38, 12, 38], [86, 443, 26, 38, 12, 38]]}, {"ar": [[2, 484, 24, 38, 11, 38], [28, 483, 24, 39, 11, 39], [54, 484, 24, 38, 11, 38], [80, 484, 23, 38, 12, 38]], "ab": [[2, 524, 23, 38, 11, 38], [27, 524, 24, 38, 12, 38], [53, 524, 23, 38, 11, 38], [78, 524, 23, 38, 11, 38]], "iz": [[2, 565, 24, 38, 12, 38], [28, 564, 24, 39, 12, 39], [54, 565, 22, 38, 11, 38], [78, 565, 22, 38, 11, 38]], "de": [[2, 605, 24, 38, 12, 38], [28, 605, 24, 38, 11, 38], [54, 605, 23, 38, 11, 38], [79, 605, 23, 38, 10, 38]]}];
const RATAS_IMG = new Image();
let ratasListo = false;
RATAS_IMG.onload = () => ratasListo = true;
RATAS_IMG.src = 'img/personajes/ratas.png?v=' + VERSION;
const ALTO_RATA = 40; // alto de la hoja de ratas en pixel art (se dibuja a escala entera)
const TIPOS_RATA = ['Rata Mensajera', 'Rata Quesera', 'Rata Ejecutiva', 'Rata Misteriosa'];
const ALTO_GATO = 40; // altura de la mascota en el mundo
let M = null, gatoElegido = 0;

function toggleMascota(){
  if (!enJuego || pantallaActual) return;
  if (!PJ.mascota){ if (!prologo) abrirElegirMascota(); return; }
  if (!M && enMontura()){ texto(P.x, P.y - 110, `${PJ.mascota.nombre} va guardado mientras montas`, '#b9a3ff', 13); return; }
  if (M){
    chispas(M.x, M.y - 15, '#b9a3ff', 18, 140);
    texto(M.x, M.y - 50, `${PJ.mascota.nombre} vuelve a las sombras`, '#b9a3ff', 13);
    M = null; PJ.mascotaActiva = false;
  } else invocarMascota(false);
  guardar();
}

function invocarMascota(silencio){
  M = { x:P.x - 34, y:P.y + 8, r:10, mov:false, flip:false };
  colisiones(M);
  PJ.mascotaActiva = true;
  if (!silencio){
    chispas(M.x, M.y - 15, '#b9a3ff', 26, 170);
    texto(M.x, M.y - 52, `¡${PJ.mascota.nombre}!`, '#f2c46d', 16);
  }
}

function dibujarGatoEn(c, tipo, atlas = null, img = GATOS_IMG){
  const a = c.getContext('2d'), [sx, sy, w, h] = atlas ? atlas[tipo * 6] : cuadroGato(tipo, 'ab', 0);
  a.clearRect(0, 0, c.width, c.height);
  const k = Math.min(c.width / w, c.height / h) * .95;
  a.drawImage(img, sx, sy, w, h, (c.width - w * k) / 2, (c.height - h * k) / 2, w * k, h * k);
}

function abrirElegirMascota(){
  $('mNombre').value = ''; $('mErr').textContent = '';
  $('mTitulo').textContent = 'Tu primera mascota'; $('mDesc').textContent = 'Elige a tu compañero y ponle un nombre. Podrás invocarlo o guardarlo cuando quieras.';
  $('mNombre').placeholder = 'Por ejemplo, Sombrita'; $('btnInvocarPet').textContent = 'Invocar'; $('mEtiqueta').textContent = 'Nombre de tu mascota';
  $('pMascota').querySelector('[data-cerrar]').classList.remove('oculto');
  const cont = $('gatosOpc'); cont.innerHTML = '';
  TIPOS_RATA.forEach((nombre, i) => {
    const b = document.createElement('button'); b.className = 'gato';
    b.setAttribute('aria-pressed', i === gatoElegido);
    const c = document.createElement('canvas'); c.width = 152; c.height = 152;
    b.append(c, document.createTextNode(nombre));
    b.onclick = () => { gatoElegido = i; cont.querySelectorAll('.gato').forEach(x => x.setAttribute('aria-pressed', x === b)); };
    cont.appendChild(b);
    const pintar = () => { const [sx, sy, w, h] = RATAS_DIR[i].ab[0], a = c.getContext('2d'), k = Math.max(1, Math.floor(Math.min(c.width / w, c.height / h) * .9));
      a.clearRect(0, 0, c.width, c.height); a.imageSmoothingEnabled = false; a.drawImage(RATAS_IMG, sx, sy, w, h, (c.width - w * k) / 2, (c.height - h * k) / 2, w * k, h * k); };
    if (ratasListo) pintar(); else RATAS_IMG.addEventListener('load', pintar, { once:true });
  });
  pantalla('pMascota');
}
$('btnInvocarPet').onclick = () => {
  const n = $('mNombre').value.trim();
  if (n.length < 2){ $('mErr').textContent = 'Ponle un nombre de al menos 2 letras.'; return; }
  PJ.mascota = { tipo:gatoElegido, nombre:n, nivel:1, xp:0, hambre:100 };
  if (window.pintarIcoPet) pintarIcoPet();
  pantalla(null);
  if (nombrandoRaton){ const sig = nombrandoRaton; nombrandoRaton = null; guardar(); sig(); return; }
  invocarMascota(false);
  banner(`${n} se une a ti`, esTactil ? 'Toca la huella para invocarlo o guardarlo' : 'Pulsa G o toca la huella para invocarlo o guardarlo');
  guardar();
};

// cada rata ayuda a su manera; sube hasta nivel 10 y con hambre no ayuda
const HAB_MASCOTA = [
  { n:'Recolectora', d:nv => `Atrae hacia ti las monedas y el botín a ${110 + nv * 12} px.` },
  { n:'Curandera',   d:nv => `Cada 25 s te cura un ${(2 + nv * .5).toFixed(1)}% de vida.` },
  { n:'Negociante',  d:nv => `Ganas un ${4 + nv}% más de dinero.` },
  { n:'Sombra',      d:nv => `Muerde a los enemigos cercanos (${12 + nv * 2}% de tu poder).` }
];
const MAX_NV_MASCOTA = 10, xpMascotaSig = nv => 20 * nv;
const mascotaActiva = () => M && PJ.mascota && PJ.mascota.hambre >= 20;
const bonoOroMascota = () => mascotaActiva() && PJ.mascota.tipo === 2 ? (4 + PJ.mascota.nivel) / 100 : 0;
function ganarXPMascota(n){
  const m = PJ.mascota; if (m.nivel >= MAX_NV_MASCOTA) return;
  m.xp += n;
  while (m.nivel < MAX_NV_MASCOTA && m.xp >= xpMascotaSig(m.nivel)){
    m.xp -= xpMascotaSig(m.nivel); m.nivel++;
    if (M){ chispas(M.x, M.y - 15, '#ffd100', 24, 160); texto(M.x, M.y - 50, `¡${m.nombre} sube a nivel ${m.nivel}!`, '#ffd100', 14); }
    chat(`${m.nombre} sube a nivel ${m.nivel}.`, '#ffd100');
  }
  if (m.nivel >= MAX_NV_MASCOTA) m.xp = 0;
}
function alimentarMascota(){
  const m = PJ.mascota;
  if (!m){ texto(P.x, P.y - 74, 'No tienes mascota', '#9a91c2', 14); return false; }
  if (m.hambre >= 100){ texto(P.x, P.y - 74, `${m.nombre} no tiene hambre`, '#9a91c2', 14); return false; }
  m.hambre = 100; ganarXPMascota(15); contar('comida'); sfx('comer');
  const x = M ? M.x : P.x, y = M ? M.y : P.y;
  chispas(x, y - 15, '#ff8fc8', 18, 120); texto(x, y - 50, '♥ ¡Ñam!', '#ff8fc8', 15);
  if (abierta('wPj')) renderPj();
  return true;
}
function habilidadMascota(dt){
  const m = PJ.mascota;
  m.hambre = Math.max(0, m.hambre - dt / 30); // se vacía en unos 50 minutos de juego
  M.tHab = (M.tHab || 0) - dt; M.tHambre = (M.tHambre || 0) - dt;
  if (m.hambre < 20){
    if (M.tHambre <= 0){ M.tHambre = 25; M.frase = '¡Tengo hambre!'; M.tFrase = 3; }
    return;
  }
  if (m.tipo === 0){
    const r = 110 + m.nivel * 12;
    for (const o of botin){
      const dx = P.x - o.x, dy = P.y - o.y, d = Math.hypot(dx, dy);
      if (d >= 100 && Math.hypot(M.x - o.x, M.y - o.y) < r){ o.x += dx / d * 260 * dt; o.y += dy / d * 260 * dt; }
    }
  } else if (m.tipo === 1){
    if (M.tHab <= 0){
      M.tHab = 25;
      if (P.hp < D.maxHp){ const c = Math.round(D.maxHp * (2 + m.nivel * .5) / 100); P.hp = Math.min(D.maxHp, P.hp + c); texto(P.x, P.y - 74, '+' + c, '#7dffa8', 14); chispas(P.x, P.y - 20, '#7dffa8', 10, 100); }
    }
  } else if (m.tipo === 3 && E.tipo === 'mazmorra'){
    if (M.tHab <= 0){
      let obj = null, md = 80;
      for (const e of enemigos){ if (e.muerto) continue; const d = Math.hypot(e.x - M.x, e.y - M.y); if (d < md){ md = d; obj = e; } }
      if (obj){ M.tHab = 1.6; herir(obj, D.poder * (12 + m.nivel * 2) / 100); chispas(obj.x, obj.y - 10, '#b98bff', 10, 140); }
    }
  }
}
function updateMascota(dt){
  if (!M) return;
  M.tFrase = (M.tFrase || 0) - dt;
  habilidadMascota(dt);
  const dx = P.x - M.x, dy = P.y - M.y, d = Math.hypot(dx, dy);
  if (d > 450){ M.x = P.x - 34; M.y = P.y + 8; colisiones(M); return; }
  M.mov = false;
  M.quieto = (M.quieto || 0) + dt;
  // mira a los lados de vez en cuando mientras espera despierto
  if (M.quieto > 2 && M.quieto < 6 && Math.random() < dt * .35) M.flip = !M.flip;
  // en reposo mira a la cámara y, de vez en cuando, hacia un lado
  if (!M.mov && M.quieto > .4) M.dir = (M.quieto > 2 && M.quieto < 6 && Math.sin(M.quieto * 1.7) > .55) ? 'lado' : 'abajo';
  if (d > 55){
    const v = Math.min(D.vel * 1.15 * (enMontura() ? VEL_MONTURA : 1), (d - 40) * 4);
    M.x += dx / d * v * dt; M.y += dy / d * v * dt;
    M.mov = v > 25;
    M.paso = (M.paso || 0) + v * dt;
    if (M.mov) M.quieto = 0;
    if (Math.abs(dx) > 6) M.flip = dx < 0;
    // dirección con margen para que no cambie de vista a cada rato
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ay > ax * 1.3) M.dir = dy < 0 ? 'arriba' : 'abajo';
    else if (ax > ay * .8) M.dir = 'lado';
    colisiones(M);
  }
}

// Dibuja al gato en cualquier canvas. Quieto: respira y mira a los lados; tras un rato se echa a dormir.
function pintarGato(c, tipo, x, pie, alto, t, mov, flip, quieto, atlas = GATOS, img = GATOS_IMG, cuadro = null){
  const f = mov ? Math.floor(t / 1000 * 10) % 6 : 0;
  const [sx, sy, w, h, ax, ay] = cuadro || atlas[tipo * 6 + f];
  // las ratas son pixel art: escala entera, sin estirar; respiran subiendo un píxel
  const px = img === RATAS_IMG, esc = px ? Math.max(1, Math.round(alto / ALTO_RATA)) : alto / 84, dormido = !mov && quieto > 6;
  let kx = 1, ky = 1, sube = 0;
  if (px){ if (!mov) sube = Math.sin(t / (dormido ? 750 : 420)) > .5 ? -esc : 0; }
  else if (!mov){
    const fase = Math.sin(t / (dormido ? 750 : 420));
    if (dormido){ ky = .86 + .025 * fase; kx = 1.07 - .012 * fase; }
    else { ky = 1 + .025 * fase; kx = 1 - .012 * fase; }
  }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, pie, alto * .29 * kx, alto * .1, 0, 0, TAU); c.fill();
  c.save();
  if (px){ c.imageSmoothingEnabled = false; c.translate(Math.round(x), Math.round(pie) + sube); }
  else c.translate(x, pie);
  c.scale(flip ? -kx : kx, ky);
  c.drawImage(img, sx, sy, w, h, -ax * esc, -ay * esc, w * esc, h * esc);
  c.restore();
  if (dormido){
    c.textAlign = 'left';
    for (let k = 0; k < 3; k++){
      const p = (t / 1000 * .55 + k / 3) % 1;
      c.globalAlpha = Math.sin(p * Math.PI);
      c.font = `700 ${Math.round(alto * (.16 + p * .12))}px Rajdhani, sans-serif`;
      c.fillStyle = '#c9b8ff';
      c.fillText('z', x + alto * .2 + p * alto * .3, pie - alto * .8 - p * alto * .55);
    }
    c.globalAlpha = 1;
  }
}

// Elige el cuadro de la rata: de lado, de frente o de espalda según hacia dónde camina
function cuadroRata(tipo, dir, mov, paso, izq){
  const clave = dir === 'arriba' ? 'ar' : dir === 'lado' ? (izq ? 'iz' : 'de') : 'ab';
  const set = RATAS_DIR[tipo][clave];
  return { img:RATAS_IMG, fr:set[mov ? Math.floor(paso / 14) % set.length : 0] };
}
function dibujarMascota(t){
  if (!ratasListo) return;
  const pie = M.y + 8;
  // la hoja ya trae izquierda y derecha: no hace falta reflejar
  const q = cuadroRata(PJ.mascota.tipo, M.dir || 'abajo', M.mov, M.paso || 0, M.flip);
  pintarGato(ctx, PJ.mascota.tipo, M.x, pie, ALTO_GATO, t, M.mov, false, M.quieto || 0, null, q.img, q.fr);
  rotulo(PJ.mascota.nombre, M.x, pie - ALTO_GATO - 4, '700 12px Rajdhani, sans-serif', '#e9e4ff', null, 0, true);
  if (M.tFrase > 0) burbuja(M.x, pie - ALTO_GATO - 18, M.frase, Math.min(1, M.tFrase));
}

