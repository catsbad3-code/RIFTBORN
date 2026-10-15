// =====================================================
//  EDIFICIOS Y OBJETOS (atlas pixelado)
// =====================================================
// [x, y, ancho, alto] de cada sprite; se dibujan anclados abajo al centro
// edificios pixelados de la ciudad
const CASAS = {"c_asociacion":[0,0,176,210],"c_posada":[178,0,219,182],"c_mercado":[399,0,126,117],"c_casa":[527,0,82,115],"c_casamod":[611,0,106,118],"c_apart":[719,0,128,123],"c_cabana":[849,0,123,144],"c_torii":[974,0,100,88]};
const CASAS_IMG = new Image();
let casasListo = false;
CASAS_IMG.onload = () => casasListo = true;
CASAS_IMG.src = 'img/mundo/casas.webp';
const EDIF = {"casa":[0,0,168,127],"casamod":[170,0,171,125],"apart":[343,0,147,147],"hotel":[492,0,151,144],"cabana":[645,0,168,132],"cama":[0,149,145,112],"sofa":[147,149,170,91],"mesa":[319,149,162,105],"cocina":[483,149,157,117],"libreria":[642,149,135,116],"mercado":[0,268,145,114],"oficinas":[147,268,153,125],"farola":[302,268,37,105],"banco":[341,268,104,66],"arbol":[447,268,88,109],"arbusto":[537,268,99,71],"maceta":[638,268,67,95],"ropero":[707,268,121,124]};
const EDIF_IMG = new Image();
let edifListo = false;
EDIF_IMG.onload = () => edifListo = true;
EDIF_IMG.src = 'img/mundo/edif.png';
function dibujarProp(pr){
  if (pr.veta){
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, 22, 6, 0, 0, TAU); ctx.fill();
    dibujarIc3(pr.clave, pr.x, pr.y - 20, 44);
    const b = .5 + .5 * Math.sin(performance.now() / 400 + pr.x);
    ctx.fillStyle = `rgba(255,255,230,${.35 + .5 * b})`; ctx.fillRect(pr.x + 10, pr.y - 36, 2, 6); ctx.fillRect(pr.x + 8, pr.y - 34, 6, 2);
    return;
  }
  if (pr.mostrador){
    if (!MOSTRADOR_IMG.complete || !MOSTRADOR_IMG.width) return;
    const dw = MOSTRADOR_IMG.width * pr.esc, dh = MOSTRADOR_IMG.height * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(pr.x - dw / 2 + 4, pr.y - 6, dw - 8, 8);
    ctx.drawImage(MOSTRADOR_IMG, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  if (pr.mu) return dibujarMueble(pr);
  if (pr.cas) return dibujarPropCasino(pr);
  if (pr.cristal || pr.ratonLibre) return dibujarPropPrologo(pr);
  if (pr.casino){
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, 92, 10, 0, 0, TAU); ctx.fill();
    dibujarCas('fachada', pr.x, pr.y + 4, pr.esc);
    return;
  }
  if (pr.casa){
    if (!casasListo) return;
    const [sx, sy, w, h] = CASAS[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .5, 10, 0, 0, TAU); ctx.fill();
    const suave = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(CASAS_IMG, sx, sy, w, h, Math.round(pr.x - dw / 2), Math.round(pr.y - dh), Math.round(dw), Math.round(dh));
    ctx.imageSmoothingEnabled = suave;
    return;
  }
  if (pr.estatua){
    if (!estatuaLista) return;
    const dw = ESTATUA_IMG.width * pr.esc, dh = ESTATUA_IMG.height * pr.esc;
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 4, dw * .5, 14, 0, 0, TAU); ctx.fill();
    ctx.drawImage(ESTATUA_IMG, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  if (pr.ciu){
    if (!ciuListo) return;
    const n = pr.anim ? pr.anim + (sinMovimiento ? 0 : Math.floor(performance.now() / 130) % pr.nf) : pr.spr;
    const [sx, sy, w, h] = CIU[n], dw = w * pr.esc, dh = h * pr.esc;
    if (pr.sombra !== false){
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .42, Math.max(3, dh * .06), 0, 0, TAU); ctx.fill();
    }
    ctx.drawImage(CIU_IMG, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
    return;
  }
  const atlas = pr.terr ? TERR : EDIF, img = pr.terr ? TERR_IMG : EDIF_IMG;
  if (pr.terr ? !terrListo : !edifListo) return;
  const [sx, sy, w, h] = atlas[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
  ctx.fillStyle = 'rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(pr.x, pr.y - 2, dw * .46, Math.max(4, dh * .06), 0, 0, TAU); ctx.fill();
  ctx.drawImage(img, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
}

// =====================================================
//  TERRENOS Y NATURALEZA (catálogo pixelado)
// =====================================================
const TERR = {"t_cesped":[0,0,64,64],"t_tierra":[66,0,64,64],"t_piedra":[132,0,64,64],"t_arena":[198,0,64,64],"t_adoquin":[264,0,64,64],"t_madera":[330,0,64,64],"t_tierrahierba":[396,0,64,64],"t_nieve":[462,0,64,64],"t_muro":[528,0,64,64],"t_acera":[594,0,64,64],"arbolg":[660,0,94,105],"pino":[0,107,84,101],"flores":[86,107,88,68],"pasto":[176,107,90,75],"roca":[268,107,107,83],"tronco":[377,107,100,64],"cactus":[479,107,76,97],"fogata":[557,107,119,99]};
const TERR_IMG = new Image();
let terrListo = false;
const PATRONES = {};
TERR_IMG.onload = () => {
  for (const n of Object.keys(TERR)){
    if (!n.startsWith('t_')) continue;
    const c = document.createElement('canvas'); c.width = c.height = T;
    const a = c.getContext('2d'), [sx, sy, w, h] = TERR[n];
    a.drawImage(TERR_IMG, sx, sy, w, h, 0, 0, T, T);
    PATRONES[n.slice(2)] = ctx.createPattern(c, 'repeat');
  }
  terrListo = true;
};
TERR_IMG.src = 'img/mundo/terr.png';
const patron = n => PATRONES[n] || null;
// texturas pintadas de césped y tierra (reemplazan a las del catálogo)
const TEX2 = {"cesped_viejo": [0, 0, 135, 84], "tierra2": [135, 0, 135, 84], "arena2": [270, 0, 135, 84], "lava": [405, 0, 135, 84], "roca": [540, 0, 135, 84], "tierraroja": [675, 0, 135, 84]};
const TEX2_IMG = new Image();
TEX2_IMG.onload = () => {
  const poner = () => {
    for (const n of Object.keys(TEX2)){
      const [sx, sy, w, h] = TEX2[n], c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(TEX2_IMG, sx, sy, w, h, 0, 0, w, h);
      PATRONES[n] = ctx.createPattern(c, 'repeat');
    }
  };
  if (terrListo) poner(); else TERR_IMG.addEventListener('load', () => setTimeout(poner, 0), { once:true });
};
TEX2_IMG.src = 'img/mundo/tex2.webp';
// césped de la ciudad
const CESPED_IMG = new Image();
CESPED_IMG.onload = () => {
  const poner = () => { PATRONES.cesped = ctx.createPattern(CESPED_IMG, 'repeat'); };
  if (terrListo) poner(); else TERR_IMG.addEventListener('load', () => setTimeout(poner, 5), { once:true });
};
CESPED_IMG.src = 'img/px/cesped.png?v=' + VERSION;

// =====================================================
//  CIUDAD MODERNA Y PORTALES ANIMADOS (sprites)
// =====================================================
const CIU = {"arbol_a":[0,0,93,111],"farola":[95,0,30,111],"arbol_b":[127,0,87,107],"farola2":[216,0,92,106],"otono_a":[310,0,86,105],"semaforo":[398,0,25,104],"fuente0":[425,0,105,102],"fuente1":[532,0,105,102],"fuente2":[639,0,105,102],"fuente3":[746,0,105,102],"fuente4":[853,0,105,102],"senal":[960,0,31,98],"arbol_c":[0,113,65,89],"arbol_m":[67,113,66,89],"arbol_d":[135,113,62,88],"otono_c":[199,113,52,83],"otono_b":[253,113,53,82],"parada":[308,113,88,64],"t_asfalto":[398,113,64,64],"t_asfalto2":[464,113,64,64],"t_alcant":[530,113,64,64],"t_linea_h":[596,113,64,64],"t_linea_v":[662,113,64,64],"t_doble_h":[728,113,64,64],"t_cebra":[794,113,64,64],"t_acera":[860,113,64,64],"t_ladrillo":[926,113,64,64],"t_rombo":[0,204,64,64],"t_losa":[66,204,64,64],"hidrante":[132,204,33,59],"papelera":[167,204,26,46],"buzon":[195,204,23,45],"jardinera2":[220,204,29,40],"bolardo":[251,204,17,40],"jardinera":[270,204,29,39],"banco":[301,204,59,37],"bicis":[362,204,71,36]};
const CIU_IMG = new Image();
let ciuListo = false;
const PAT_CIU = {};
CIU_IMG.onload = () => {
  for (const n of Object.keys(CIU)){
    if (!n.startsWith('t_')) continue;
    const c = document.createElement('canvas'); c.width = c.height = T;
    const a = c.getContext('2d'), [sx, sy, w, h] = CIU[n];
    a.drawImage(CIU_IMG, sx, sy, w, h, 0, 0, T, T);
    PAT_CIU[n.slice(2)] = ctx.createPattern(c, 'repeat');
  }
  ciuListo = true;
};
CIU_IMG.src = 'img/mundo/ciu.webp';
const PORTAL_IMG = new Image();
let portalListo = false;
PORTAL_IMG.onload = () => portalListo = true;
PORTAL_IMG.src = 'img/mundo/portal.webp';
const ESTATUA_IMG = new Image();
let estatuaLista = false;
ESTATUA_IMG.onload = () => estatuaLista = true;
ESTATUA_IMG.src = 'img/mundo/estatua.webp';
// muebles de interior (posada y mercado) y suelo de madera
const MU = {"barriles": [0, 0, 137, 102], "cama": [139, 0, 121, 78], "alf_azul": [262, 0, 150, 78], "rug_rojo": [414, 0, 76, 77], "alf_verde": [492, 0, 73, 75], "oso": [567, 0, 76, 72], "cajas": [0, 104, 120, 69], "armaduras": [122, 104, 107, 67], "mesa": [231, 104, 73, 66], "sillon": [306, 104, 48, 61], "brasero": [356, 104, 37, 57], "sofa": [395, 104, 77, 56], "armero": [474, 104, 78, 56], "suelo": [554, 104, 56, 56], "estante_armas": [612, 104, 72, 49], "chimenea": [0, 175, 74, 48], "estante1": [76, 175, 74, 47], "estante2": [152, 175, 72, 47], "estante3": [226, 175, 145, 47]};
const MOSTRADOR_IMG = new Image();
MOSTRADOR_IMG.src = 'img/mundo/mostrador.webp';
const MU_IMG = new Image();
let muListo = false, PAT_SUELO = null;
MU_IMG.onload = () => {
  const [sx, sy, w, h] = MU.suelo, c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(MU_IMG, sx, sy, w, h, 0, 0, w, h);
  PAT_SUELO = ctx.createPattern(c, 'repeat'); muListo = true;
};
MU_IMG.src = 'img/mundo/mu.webp';
function dibujarMueble(pr){
  if (!muListo) return;
  const [sx, sy, w, h] = MU[pr.spr], dw = w * pr.esc, dh = h * pr.esc;
  ctx.drawImage(MU_IMG, sx, sy, w, h, pr.x - dw / 2, pr.y - dh, dw, dh);
}
const PFW = 66, PFH = 122, PFN = 9; // cuadros del portal pixelado
// una fila por rango: E plata, D azul, C turquesa, B violeta, A dorado, S rojo
const COLOR_PORTAL = ['#c8d4e6', '#4fa3ff', '#5ee6d0', '#b05cff', '#ffb347', '#ff4a5c'];
function tileCiu(n, x, y){
  if (!ciuListo) return;
  const [sx, sy, w, h] = CIU['t_' + n];
  ctx.drawImage(CIU_IMG, sx, sy, w, h, x, y, T + .5, T + .5);
}
// suelo, tinte y objetos de cada tipo de cueva (E, D, C, B, A, S)
const TEXTURA_RANGO = [
  { suelo:'tierra2',    tinte:.18, objetos:['roca','tronco','pasto','flores'] },
  { suelo:'arena2',     tinte:.2,  objetos:['cactus','roca'] },
  { suelo:'nieve',      tinte:.5,  objetos:['pino','roca'] },
  { suelo:'lava',       tinte:.3,  objetos:['roca','fogata'] },
  { suelo:'roca',       tinte:.3,  objetos:['roca'] },
  { suelo:'tierraroja', tinte:.3,  objetos:['roca','fogata'] }
];

