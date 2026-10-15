// =====================================================
//  BUCLE E INICIO
// =====================================================
let last = performance.now();
let firmaBolsa = '', firmaPj = '', tSeg = 0;
function loop(t){
  if (++tSeg % 15 === 0){ actualizarSeguimiento(); if (abierta('wMis') && enJuego) renderMisiones(); }
  if (tSeg % 60 === 0 && enJuego) revisarLogros();
  const dt = Math.min((t - last) / 1000, .05); last = t;
  if (enJuego && !pantallaActual) update(dt);
  if (enJuego) updateBuscador(dt);
  if (pantallaActual !== 'pPrologo') draw(t);   // la cinemática tapa toda la pantalla: no hace falta dibujar el mundo detrás
  if (enJuego && wTab === 'personaje' && abierta('wPj')) dibujarFigura(t);
  if (pantallaActual === 'pPersonajes' && pjSel){ const pj = cuenta() && cuenta().personajes.find(p => p.id === pjSel); if (pj) dibujarEscenaPj($('selCv'), pj.gato || 0, pj.clase, t, rotSel, pj.mascota, pj.equipo, pj.tinte); }
  else if (pantallaActual === 'pPersonajes') $('selCv').getContext('2d').clearRect(0, 0, 520, 560);
  if (pantallaActual === 'pCrear') dibujarEscenaPj($('crearCv'), gatoPj, claseElegida, t, rotSel, null);
  if (enJuego && PJ && tSeg % 6 === 0){
    const fb = PJ.bolsa.length + '|' + PJ.bolsa.map(o => o.id).join(',') + '|' + PJ.pociones + '|' + PJ.oro + '|' + JSON.stringify(PJ.mats);
    if (fb !== firmaBolsa){ firmaBolsa = fb; renderBolsa(); }
    const fp = [PJ.nivel, PJ.puntos, JSON.stringify(PJ.stats), Object.values(PJ.equipo).map(o => o ? o.id : '-').join(','), PJ.arma, wTab, !!M].join('|');
    if (fp !== firmaPj){ firmaPj = fp; renderPj(); }
    if (abierta('wPj') && wTab === 'personaje'){ const v = $('pdVida'), en = $('pdEn'); if (v) v.textContent = `${Math.ceil(P.hp)}/${D.maxHp}`; if (en) en.textContent = `${Math.floor(P.en)}/${D.maxEn}`; }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

(function iniciar(){
  const s = DB.sesion();
  if (s && DB.leer()[s]){ usuario = s; ir('pPersonajes'); }
  else pantalla('pAuth');
})();
