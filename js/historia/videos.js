// ---------- sala de vídeos: todas las cinemáticas, desde fuera del juego ----------
// fuera del juego no hay personaje: se ven con un gato de muestra (o con el tuyo, si ya elegiste uno)
const VIDEOS = () => [
  { t:'Prólogo: Renacido', d:'El gato muere en nuestro mundo y renace en Lumeria.', lista:CINE },
  ...HISTORIA.filter(C => C.cine).map(C => ({ t:C.titulo, d:C.resumen, lista:C.cine }))
];
let videosVolver = 'pAuth', pjVideo = null;
function abrirVideos(){
  if (pantallaActual && pantallaActual !== 'pVideos' && pantallaActual !== 'pPrologo') videosVolver = pantallaActual;
  const lista = VIDEOS(), ahora = performance.now();
  $('vidLista').innerHTML = lista.map((v, i) => `<button class="vid" type="button" data-vid="${i}"><span class="vid-mini"><canvas width="320" height="180"></canvas><span class="vid-play">▶</span></span><b>${v.t}</b><small>${v.d}</small></button>`).join('');
  pantalla('pVideos');
  conPjVideo(() => $('vidLista').querySelectorAll('canvas').forEach((cv, i) => pintarCine(ahora, cv, { lista:[lista[i].lista[0]], e:0, te:ahora - 3000, flash:0 })));
  $('vidLista').querySelectorAll('[data-vid]').forEach(b => b.onclick = () => verVideo(lista[+b.dataset.vid].lista));
}
// presta un personaje de muestra mientras dura la cinemática
function conPjVideo(fn){
  const propio = PJ;
  if (!propio) PJ = { nombre:'Gato', gato:0, clase:'mago', mascota:null };
  try { fn(); } finally { if (!propio) PJ = null; }
}
function verVideo(lista){
  pjVideo = PJ ? null : { nombre:'Gato', gato:0, clase:'mago', mascota:null };
  if (pjVideo) PJ = pjVideo;
  iniciarCinematica(() => { if (pjVideo && PJ === pjVideo) PJ = null; pjVideo = null; abrirVideos(); }, lista);
}
$('btnVidVolver').onclick = () => ir(videosVolver);
$('btnVidTodo').onclick = () => verVideo(VIDEOS().flatMap(v => v.lista));
document.querySelectorAll('[data-videos]').forEach(b => b.addEventListener('click', abrirVideos));

