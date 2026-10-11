// RIFTBORN · modo app: guarda los archivos del juego para poder jugar sin internet.
// Con conexión siempre se usa la versión nueva (red primero); sin conexión, la guardada.
const CACHE = 'riftborn-v1';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'css/style.css', 'auth/auth.js', 'js/en.js', 'js/idioma.js', 'js/game.js',
  'img/icono.png', 'img/icono-192.png', 'img/icono-512.png', 'img/fondo-menu.jpg', 'img/ui-1.png', 'img/ui-2.png', 'img/ui-3.png', 'img/ui-4.png',
  'img/band.png', 'img/caminantes.png', 'img/casas.webp', 'img/casino.png', 'img/cesped.webp', 'img/ciu.webp', 'img/edif.png', 'img/estatua.webp',
  'img/gato-calico.png', 'img/gato-ejecutivo.png', 'img/gato-misterioso.png', 'img/gatos.png', 'img/ic3.png', 'img/iconos.png', 'img/mist.png',
  'img/monstruos.png', 'img/mostrador.webp', 'img/mu.webp', 'img/npcs.png', 'img/par.webp', 'img/portal.webp', 'img/ratas.png', 'img/spr.png',
  'img/terr.png', 'img/tex2.webp', 'img/px/band.png', 'img/px/casas.png', 'img/px/cesped.png', 'img/px/ciu.png', 'img/px/edif.png',
  'img/px/estatua.png', 'img/px/mostrador.png', 'img/px/mu.png', 'img/px/par.png', 'img/px/portal.png', 'img/px/spr.png', 'img/px/terr.png', 'img/px/tex2.png'];
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
