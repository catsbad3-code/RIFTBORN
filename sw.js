// RIFTBORN · modo app: guarda los archivos del juego para poder jugar sin internet.
// Con conexión siempre se usa la versión nueva (red primero); sin conexión, la guardada.
const CACHE = 'riftborn-v2';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'css/style.css', 'auth/auth.js', 'idioma/en.js', 'idioma/idioma.js', 'js/nucleo/datos.js',
  'js/nucleo/partida.js', 'js/mundo/ciudad.js', 'js/mundo/casino.js', 'js/historia/prologo.js', 'js/historia/historia.js', 'js/historia/videos.js',
  'js/mundo/edificios.js', 'js/mundo/mazmorras.js', 'js/nucleo/controles.js', 'js/personaje/perfil.js', 'js/combate/combate.js', 'js/combate/clases.js',
  'js/combate/devorar.js', 'js/combate/sacerdote-arquero.js', 'js/combate/efectos.js', 'js/nucleo/actualizar.js', 'js/combate/jefes.js',
  'js/personaje/sprites.js', 'js/mundo/dibujo-mundo.js', 'js/personaje/mascota.js', 'js/mundo/dibujo-escenas.js', 'js/mundo/npc.js', 'js/personaje/progreso.js',
  'music/sonido.js', 'js/combate/grupo.js', 'js/personaje/emblemas.js', 'js/mundo/eventos.js', 'js/mundo/ambiente.js', 'js/nucleo/dibujo.js',
  'js/personaje/montura.js', 'js/mundo/monstruos.js', 'js/nucleo/inicio.js', 'img/app/icono-192.png', 'img/app/icono-512.png', 'img/app/icono.png',
  'img/efectos/spr.png', 'img/interfaz/fondo-menu.jpg', 'img/interfaz/ic3.png', 'img/interfaz/iconos.png', 'img/interfaz/ui-1.png', 'img/interfaz/ui-2.png',
  'img/interfaz/ui-3.png', 'img/interfaz/ui-4.png', 'img/monstruos/monstruos.png', 'img/mundo/band.png', 'img/mundo/casas.webp', 'img/mundo/casino.png',
  'img/mundo/cesped.webp', 'img/mundo/ciu.webp', 'img/mundo/edif.png', 'img/mundo/estatua.webp', 'img/mundo/mostrador.webp', 'img/mundo/mu.webp',
  'img/mundo/par.webp', 'img/mundo/portal.webp', 'img/mundo/terr.png', 'img/mundo/tex2.webp', 'img/personajes/caminantes.png', 'img/personajes/gato-calico.png',
  'img/personajes/gato-ejecutivo.png', 'img/personajes/gato-misterioso.png', 'img/personajes/gatos.png', 'img/personajes/mist.png', 'img/personajes/npcs.png',
  'img/personajes/ratas.png', 'img/px/band.png', 'img/px/casas.png', 'img/px/cesped.png', 'img/px/ciu.png', 'img/px/edif.png', 'img/px/estatua.png',
  'img/px/mostrador.png', 'img/px/mu.png', 'img/px/par.png', 'img/px/portal.png', 'img/px/spr.png', 'img/px/terr.png', 'img/px/tex2.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith('http')) return;
  e.respondWith(
    fetch(r).then(resp => {
      // se guarda una copia (también las fuentes de Google) para la próxima vez sin conexión
      if (resp && (resp.ok || resp.type === 'opaque')){ const copia = resp.clone(); caches.open(CACHE).then(c => c.put(r, copia)); }
      return resp;
    }).catch(() => caches.match(r, { ignoreSearch:true }).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
