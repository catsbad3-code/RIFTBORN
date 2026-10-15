// =====================================================
//  AMBIENTE: HUELLAS, POLVO, DÍA Y NOCHE Y CLIMA
// =====================================================
let huellas = [], clima = [], ultimaHuella = 0, ladoHuella = 1, tClima = 0;
const CICLO_DIA = 600; // segundos reales que dura un día completo en la ciudad
// 0 = mediodía, .5 = medianoche
const horaDelDia = () => (Date.now() / 1000 % CICLO_DIA) / CICLO_DIA;
// oscuridad de la noche (0 de día, hasta .62 a medianoche)
const oscuridad = () => Math.pow(Math.max(0, -Math.cos(horaDelDia() * TAU)), .7) * .62;
// llueve en la ciudad en tandas de 3 minutos (una de cada cuatro, siempre las mismas para todos)
const lloviendo = () => { const b = Math.floor(Date.now() / 180000); return (Math.imul(b, 2654435761) >>> 16) % 4 === 0; };
const sueloConHuellas = () => E.tipo === 'ciudad' || E.tipo === 'mazmorra';

// al caminar: una huella cada 20 px y un poco de polvo en los pies
function ambientePaso(){
  if (!sueloConHuellas() || P.paso - ultimaHuella < 20) return;
  ultimaHuella = P.paso; ladoHuella = -ladoHuella; contar('pasos'); sfx('paso');
  const v = Math.hypot(P.vx, P.vy) || 1, nx = -P.vy / v, ny = P.vx / v, pie = P.y + 12;
  huellas.push({ x:Math.round(P.x + nx * 4 * ladoHuella), y:Math.round(pie + ny * 3 * ladoHuella), t:0 });
  if (huellas.length > 60) huellas.shift();
  const polvo = E.tipo === 'mazmorra' ? (RANGOS[E.rango] && RANGOS[E.rango].cara) || '#8a7a64' : '#c9b89a';
  for (let i = 0; i < 2 && particulas.length < 500; i++)
    particulas.push({ x:P.x - P.vx / v * 6 + rand(-4, 4), y:pie + rand(-1, 2), vx:-P.vx * .15 + rand(-12, 12), vy:rand(-22, -8), vida:rand(.25, .45), max:.45, color:polvo, r:2 });
}
function updateHuellas(dt){ for (const h of huellas) h.t += dt; huellas = huellas.filter(h => h.t < 5); }
function dibujarHuellas(){
  if (!sueloConHuellas()) return;
  for (const h of huellas){
    ctx.globalAlpha = .45 * (1 - h.t / 5);
    ctx.fillStyle = '#1a120a';
    ctx.fillRect(h.x - 2, h.y - 1, 4, 3); ctx.fillRect(h.x - 3, h.y - 4, 2, 2); ctx.fillRect(h.x + 1, h.y - 4, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// noche en la ciudad: se oscurece la pantalla y se recortan círculos de luz en farolas, portales y alrededor del gato
const NOCHE = { cv:null };
// la noche va en un lienzo pequeño aparte, encima del juego: el navegador lo estira solo (antes se estiraba a pantalla
// completa en cada cuadro y se llevaba la mitad del tiempo de dibujo). El minimapa queda fuera, con su hueco.
const MINI = { ok:false };
function ocultarNoche(){ const c = NOCHE.el; if (c && c.style.display !== 'none') c.style.display = 'none'; }
function dibujarNocheCiudad(){
  const d = E.tipo === 'ciudad' ? oscuridad() : 0;
  if (d < .02){ ocultarNoche(); return; }
  const c = NOCHE.el || (NOCHE.el = $('nocheCv'));
  if (c.style.display !== 'block') c.style.display = 'block';
  const E3 = 3, w = Math.ceil(W / E3), h = Math.ceil(H / E3);
  if (c.width !== w || c.height !== h){ c.width = w; c.height = h; }
  const a = c.getContext('2d');
  a.globalCompositeOperation = 'source-over'; a.clearRect(0, 0, w, h);
  a.fillStyle = `rgba(12,16,48,${d})`; a.fillRect(0, 0, w, h);
  a.globalCompositeOperation = 'destination-out';
  const hueco = (x, y, r, k = 1) => {
    x = (x - cam.x) / E3; y = (y - cam.y) / E3; r = Math.round(r / E3);
    if (x < -r || y < -r || x > w + r || y > h + r) return;
    a.drawImage(manchaLuz(r, k), x - r, y - r);
  };
  for (const f of E.farolas || []) for (const [dx, dy] of f.luces){ hueco(f.x + dx, f.y + dy + 40, 150, .95); }
  for (const p of portales) hueco(p.x, p.y - 40, 170, .8);
  hueco(P.x, P.y - 20, 120, .55);
  // el minimapa y el cartel de la zona no se oscurecen (su sitio lo apunta dibujarMinimapa)
  if (MINI.ok){
    a.fillStyle = '#000';
    a.beginPath(); a.arc(MINI.cx / E3, MINI.cy / E3, (MINI.r + 4) / E3, 0, TAU); a.fill();
    a.fillRect((MINI.px - MINI.tw / 2 - 2) / E3, (MINI.cy - MINI.r - 26) / E3, (MINI.tw + 4) / E3, 24 / E3);
  }
}

const MANCHAS = {};
function manchaLuz(r, k){
  const clave = r + '|' + k; if (MANCHAS[clave]) return MANCHAS[clave];
  const c = document.createElement('canvas'); c.width = c.height = r * 2; const a = c.getContext('2d');
  const g = a.createRadialGradient(r, r, 0, r, r, r); g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  a.fillStyle = g; a.fillRect(0, 0, r * 2, r * 2);
  return MANCHAS[clave] = c;
}
// clima en partículas de pantalla: lluvia en la ciudad y uno propio en cada tipo de cueva
const CLIMA_CUEVA = ['esporas', 'arena', 'nieve', 'brasas', 'vacio', 'brasas'];
function tipoClima(){
  if (E.tipo === 'ciudad') return lloviendo() ? 'lluvia' : null;
  if (E.tipo === 'mazmorra') return CLIMA_CUEVA[E.rango] || null;
  return null;
}
function dibujarClima(t){
  const dt = Math.min(.05, Math.max(0, (t - tClima) / 1000)); tClima = t;
  const tipo = tipoClima();
  if (!tipo){ clima.length = 0; return; }
  const tasa = { lluvia:420, nieve:50, arena:80, brasas:30, esporas:18, vacio:24 }[tipo];
  // al entrar, el clima ya está repartido por la pantalla
  let n = clima.length ? tasa * dt + Math.random() : tasa * 2.5, previo = !clima.length;
  while (n-- >= 1 && clima.length < 400){
    const p = { tipo, x:rand(-40, W + 40), y:-10, vida:0 };
    if (tipo === 'lluvia'){ p.vx = -60; p.vy = rand(520, 640); p.y = rand(-40, H * .3); p.fin = rand(H * .2, H); }
    else if (tipo === 'nieve'){ p.vx = rand(-15, 15); p.vy = rand(30, 60); p.y = rand(-20, H * .2); p.fase = rand(0, TAU); }
    else if (tipo === 'arena'){ p.x = -10; p.y = rand(0, H); p.vx = rand(260, 420); p.vy = rand(-10, 20); }
    else if (tipo === 'brasas' || tipo === 'vacio' || tipo === 'esporas'){ p.y = H + 10; p.vx = rand(-12, 12); p.vy = -rand(25, tipo === 'brasas' ? 70 : 35); p.fase = rand(0, TAU); }
    if (previo){ if (tipo === 'arena') p.x = rand(0, W); else if (tipo !== 'lluvia') p.y = rand(0, H); }
    clima.push(p);
  }
  ctx.save();
  for (const p of clima){
    p.vida += dt; p.x += p.vx * dt; p.y += p.vy * dt;
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.tipo === 'lluvia'){
      if (p.y > p.fin){ p.muere = true; ctx.fillStyle = 'rgba(200,220,255,.45)'; ctx.fillRect(x - 2, Math.round(p.fin), 4, 1); continue; }
      ctx.fillStyle = 'rgba(190,210,255,.5)'; ctx.fillRect(x, y, 1, 7);
    } else if (p.tipo === 'nieve'){
      p.x += Math.sin(p.vida * 2 + p.fase) * 12 * dt;
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x, y, 2, 2);
    } else if (p.tipo === 'arena'){
      ctx.fillStyle = 'rgba(230,200,140,.45)'; ctx.fillRect(x, y, 3, 1);
    } else {
      p.x += Math.sin(p.vida * 1.6 + p.fase) * 10 * dt;
      const parp = .5 + .5 * Math.sin(p.vida * 6 + p.fase);
      ctx.globalAlpha = (p.tipo === 'brasas' ? .5 + .5 * parp : .35 + .35 * parp);
      ctx.fillStyle = p.tipo === 'brasas' ? (parp > .5 ? '#ffb347' : '#ff5a1f') : p.tipo === 'vacio' ? '#b98bff' : '#9be37a';
      ctx.fillRect(x, y, 2, 2); ctx.globalAlpha = 1;
    }
    if (p.y > H + 20 || p.y < -30 || p.x > W + 50 || p.x < -50 || p.vida > 12) p.muere = true;
  }
  ctx.restore();
  clima = clima.filter(p => !p.muere);
  // en la ciudad, de noche y con lluvia, el cielo se ve más gris
  if (tipo === 'lluvia'){ ctx.fillStyle = 'rgba(40,50,70,.12)'; ctx.fillRect(0, 0, W, H); }
}

// globo de diálogo en pixel art (bordes rectos)
function burbuja(x, y, txt, alfa = 1){
  ctx.save(); ctx.globalAlpha = alfa;
  ctx.font = '600 12px Rajdhani, sans-serif'; ctx.textAlign = 'center';
  const w = Math.ceil(ctx.measureText(txt).width) + 14, h = 20, x0 = Math.round(x - w / 2), y0 = Math.round(y - h);
  ctx.fillStyle = '#1a1210'; ctx.fillRect(x0 - 2, y0 - 2, w + 4, h + 4);
  ctx.fillStyle = '#f4ead2'; ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = '#1a1210'; ctx.fillRect(Math.round(x) - 3, y0 + h + 2, 6, 2); ctx.fillRect(Math.round(x) - 1, y0 + h + 4, 2, 2);
  ctx.fillStyle = '#f4ead2'; ctx.fillRect(Math.round(x) - 2, y0 + h, 4, 2);
  ctx.fillStyle = '#2a1a08'; ctx.fillText(txt, x, y0 + 14);
  ctx.restore();
}

