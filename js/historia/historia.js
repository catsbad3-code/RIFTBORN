// =====================================================
//  HISTORIA: un capítulo por rango (E → S) y el misterio del ratón
//  Cada capítulo se abre en la ciudad al llegar a su rango: el ratón cuenta lo que recuerda,
//  hay un objetivo (un jefe o cazar monstruos) y al volver se revela una parte del misterio.
// =====================================================
const nombreRaton = () => PJ.mascota ? PJ.mascota.nombre : 'el ratón';
const HISTORIA = [
  { rango:0, titulo:'Capítulo 2: La marca del limo', obj:{ tipo:'jefe', rango:0, n:1, txt:'Derrota al Rey Limo (portal de rango E)' },
    inicio:[
      ['raton', () => `¡Eh, ${PJ.nombre}! Ya eres cazador. Antes de nada, tengo que confesarte algo... más o menos.`],
      ['raton', 'Lo del queso era mentira. Bueno, me lo comí, pero no me encerraron por eso.'],
      ['gato', '¿Entonces por qué te encerraron?'],
      ['raton', 'No lo recuerdo bien. Trescientos años en un cristal te dejan la cabeza como un queso con agujeros.'],
      ['raton', 'Pero cuando vi a esos limos en la gruta sentí algo raro. Llévame hasta el Rey Limo, el jefe de los portales de rango E.']
    ],
    fin:[
      ['raton', '¡Mira su corona! Tiene grabada una espada cruzada con una llave.'],
      ['raton', 'Esa marca... la he visto antes. En una armadura que brillaba como el sol.'],
      ['gato', '¿De quién era?'],
      ['raton', 'De un humano. Me llamaba «compañero». Su nombre era... Al... Aldric.'],
      ['narr', 'Misterio del ratón: el héroe que lo selló se llamaba Aldric.']
    ], resumen:'El ratón recordó el nombre del héroe que lo selló: Aldric.' },
  { rango:1, titulo:'Capítulo 3: Arena y recuerdos', obj:{ tipo:'mata', mon:'escorpion', rango:1, n:15, txt:'Caza escorpiones en portales de rango D' },
    inicio:[
      ['raton', 'Desde que vi esa marca no paro de soñar con arena. Con un desierto debajo de la tierra.'],
      ['raton', 'La Caverna de Arena de los portales de rango D... Allí pasó algo. Lo noto en los bigotes.'],
      ['raton', 'Los escorpiones de esa caverna guardan algo de aquellos días. Si cazamos unos cuantos, quizá recuerde.']
    ],
    cine:[
      { escena:'recuerdo', lineas:[
        ['narr', 'Hace trescientos años, el mundo no tenía cazadores. Solo tenía a uno.'],
        ['narr', 'Aldric, el Primer Cazador, cerraba las grietas con su espada... y con la ayuda de un pequeño ratón.'],
        ['aldric', '«Compañero, tú y yo vamos a cerrar todas las grietas de Lumeria. Te lo prometo.»'] ] }
    ],
    fin:[
      ['raton', 'Lo recuerdo. Yo no era su mascota: era su compañero. Recorrimos juntos todo Lumeria.'],
      ['gato', 'Entonces, ¿por qué te encerró en un cristal?'],
      ['raton', 'Eso todavía no lo sé. Pero él nunca me habría hecho daño. Nunca.'],
      ['narr', 'Misterio del ratón: fue el compañero de Aldric, el Primer Cazador.']
    ], resumen:'Fue el compañero de viaje de Aldric, el Primer Cazador.' },
  { rango:2, titulo:'Capítulo 4: La llave', obj:{ tipo:'jefe', rango:2, n:1, txt:'Derrota a la Mantis de Escarcha (portal de rango C)' },
    inicio:[
      ['raton', 'La Gruta Helada... hace frío solo de pensarlo.'],
      ['raton', 'Anoche soñé que la Mantis de Escarcha me buscaba. Decía: «Devuélvenos la llave».'],
      ['gato', '¿Qué llave?'],
      ['raton', 'No lo sé. Vamos a preguntárselo. Con educación... y con tus garras.']
    ],
    fin:[
      ['narr', 'Al caer, la Mantis de Escarcha susurró: «La Llave del Vacío... está... dentro del roedor...»'],
      ['raton', '¿Dentro de mí? ¿La Llave del Vacío?'],
      ['raton', 'Ahora lo entiendo. Aldric no me encerró para castigarme. Me escondió.'],
      ['raton', 'La llave que abre y cierra todas las grietas está dentro de mí. Por eso brillaba el cristal.'],
      ['gato', 'Pues si alguien viene a por ella, tendrá que pasar por encima de mí.'],
      ['narr', 'Misterio del ratón: guarda en su interior la Llave del Vacío, que abre y cierra todas las grietas.']
    ], resumen:'Dentro del ratón está la Llave del Vacío, que abre y cierra todas las grietas.' },
  { rango:3, titulo:'Capítulo 5: Fuego bajo la piel', obj:{ tipo:'jefe', rango:3, n:1, txt:'Derrota a la Araña de Magma (portal de rango B)' },
    inicio:[
      ['raton', () => `Algo me quema por dentro, ${PJ.nombre}. La llave está despertando.`],
      ['raton', 'En el Cráter de Magma hay una araña que teje con fuego. La llave tiembla cada vez que pienso en ella.'],
      ['gato', 'Entonces vamos a quitarle las ganas de tejer.']
    ],
    cine:[
      { escena:'grieta', lineas:[
        ['narr', 'Al morir la Araña de Magma, el cielo de Lumeria se abrió en una grieta roja.'],
        ['monarca', '«Por fin te encuentro, Llave. Trescientos años escondida en una piedra...»'],
        ['monarca', '«Iré a por ti, ratoncito. Y esta vez no habrá ningún héroe para salvarte.»'] ] }
    ],
    fin:[
      ['raton', '¡Esa voz! Es el que nos perseguía: el Monarca del Vacío.'],
      ['raton', 'Aldric me selló en aquella cueva porque era el único sitio que el Monarca no podía ver.'],
      ['raton', () => `Y tú, ${PJ.nombre}, rompiste el cristal. Ahora puede sentirme.`],
      ['gato', 'Entonces lo derrotaremos antes de que te encuentre.'],
      ['raton', '¡Mira mis bigotes! Brillan. La llave me deja sentir los portales: te avisaré cuando haya peligro.'],
      ['narr', 'Misterio del ratón: estaba en esa cueva porque era el único lugar escondido del Monarca del Vacío.']
    ], resumen:'Aldric lo escondió en la cueva porque era el único lugar que el Monarca del Vacío no podía ver.' },
  { rango:4, titulo:'Capítulo 6: El Monarca del Vacío', obj:{ tipo:'jefe', rango:4, n:1, txt:'Derrota al Monarca del Vacío (portal de rango A)' },
    inicio:[
      ['raton', 'Es la hora. El Abismo del Vacío, los portales de rango A.'],
      ['raton', 'Si el Monarca cae, nunca más podrá buscarme.'],
      ['gato', 'Vamos juntos. Como tú y Aldric.'],
      ['raton', 'No. Mejor que Aldric y yo. Él al final me dejó solo... Tú no lo harás, ¿verdad?'],
      ['gato', 'Nunca.']
    ],
    cine:[
      { escena:'monarca', lineas:[
        ['monarca', '«Ja... ja... ¿Crees que yo era el peor monstruo de este mundo?»'],
        ['monarca', '«Pregúntale al ratón qué fue de su querido Aldric.»'],
        ['monarca', '«Lo encontrarás en la Grieta Roja. Ya no recordará tu nombre...»'] ] }
    ],
    fin:[
      ['raton', '¿Aldric... en la Grieta Roja?'],
      ['raton', 'Después de sellarme, cerró la Primera Grieta desde dentro. Se quedó al otro lado para salvar el mundo.'],
      ['raton', 'Creí que había muerto. Pero si sigue ahí... trescientos años en el Vacío...'],
      ['gato', 'Entonces iremos a buscarlo.'],
      ['narr', 'Misterio del ratón: Aldric se sacrificó cerrando la Primera Grieta desde dentro.']
    ], resumen:'Aldric se sacrificó cerrando la Primera Grieta desde dentro.' },
  { rango:5, titulo:'Capítulo 7: El último deseo', obj:{ tipo:'jefe', rango:5, n:1, txt:'Derrota al Monarca Carmesí (grieta de rango S)' },
    inicio:[
      ['raton', 'El Monarca Carmesí... Dicen que lleva una armadura que brilla como el sol, pero roja como la sangre.'],
      ['raton', () => `Tengo miedo, ${PJ.nombre}. No de él. De que sea quien yo creo que es.`],
      ['gato', 'Sea quien sea, no estarás solo.']
    ],
    cine:[
      { escena:'alba', lineas:[
        ['narr', 'La armadura carmesí se agrietó... y por las grietas salió una luz dorada.'],
        ['aldric', '«...¿Compañero? ¿Eres tú?»'],
        ['aldric', '«Te dejé dormido en un cristal. Perdóname. Era la única forma de esconder la llave.»'],
        ['aldric', '«Antes de cerrar la grieta pedí un último deseo al Mundo: que un alma valiente te encontrara... y te quisiera tanto como yo.»'],
        ['aldric', '«Gracias, gato de otro mundo. Cuida de él.»'] ] }
    ],
    fin:[
      ['raton', 'Así que por eso renaciste aquí... Él te llamó. Tu deseo y el suyo se encontraron.'],
      ['raton', 'Ya no hay sello, ni Monarca. Solo un gato y un ratón.'],
      ['gato', 'Mejores amigos.'],
      ['raton', 'Mejores amigos. Para siempre... o por lo menos hasta la hora de comer.'],
      ['narr', 'Fin del primer arco. Lumeria sigue llena de portales: tu leyenda continúa.']
    ], resumen:'El Monarca Carmesí era Aldric. Su último deseo trajo tu alma a este mundo para que encontraras a su compañero.' }
];
const historiaDe = () => (PJ.historia = PJ.historia || { cap:0, prog:0, activo:false, listo:false });
const capActual = () => HISTORIA[historiaDe().cap];
let tHistoria = 0;
// en la ciudad (no en portales ni en ventanas): abrir el capítulo que toca o cerrar el terminado
function actualizarHistoria(dt){
  if (!PJ || !PJ.prologo || prologo || cine || pantallaActual || !E || E.tipo === 'mazmorra' || E.tutorial){ tHistoria = 0; return; }
  const h = historiaDe(), C = HISTORIA[h.cap];
  if (!C) return;
  if (!h.activo && rangoCazador() < C.rango) return;
  if ((tHistoria += dt) < 2.5) return;
  tHistoria = 0;
  if (!h.activo) empezarCapitulo();
  else if (h.listo) terminarCapitulo();
}
function empezarCapitulo(){
  const h = historiaDe(), C = HISTORIA[h.cap];
  sfx('logro'); banner(C.titulo, 'Un nuevo capítulo de la historia');
  dialogo(C.inicio, () => {
    h.activo = true; h.prog = 0; h.listo = false;
    chat(`Historia: ${C.titulo}. Objetivo: ${C.obj.txt}.`, '#ff9ad8');
    firmaSeg = ''; guardar();
  });
}
function terminarCapitulo(){
  const h = historiaDe(), C = HISTORIA[h.cap], R = RANGOS[C.rango];
  const cerrar = () => dialogo(C.fin, () => {
    h.cap++; h.activo = false; h.listo = false; h.prog = 0;
    const oro = Math.round(150 * R.escala) * 100, xp = Math.round(260 * R.escala);
    PJ.oro += oro; PJ.pociones += 2;
    sfx('logro'); banner('Capítulo completado', C.titulo);
    chat(`Capítulo completado: ${C.titulo}. Recibes ${dineroTxt(oro)} y 2 pociones.`, '#ff9ad8');
    ganarXP(xp, true); firmaSeg = ''; revisarLogros(); guardar();
  });
  if (C.cine) iniciarCinematica(cerrar, C.cine); else cerrar();
}
// lo que cuenta para el objetivo del capítulo
function avisarHistoria(tipo, e){
  if (!PJ || !PJ.historia || !PJ.historia.activo || PJ.historia.listo || !E || E.tutorial) return;
  const h = PJ.historia, C = HISTORIA[h.cap]; if (!C) return;
  const o = C.obj;
  if (o.tipo !== tipo || (E.rango || 0) < o.rango) return;
  if (tipo === 'mata' && sprDe(e) !== o.mon) return;
  h.prog++;
  if (h.prog >= o.n){
    h.listo = true;
    sfx('logro'); banner('Objetivo de la historia cumplido', `Vuelve a la ciudad: ${nombreRaton()} quiere contarte algo`);
    chat(`Historia: objetivo cumplido (${o.txt}). Vuelve a la ciudad.`, '#ff9ad8');
  }
  firmaSeg = '';
}
// la línea de la historia en el seguimiento de misiones
function filaHistoria(){
  const h = PJ.historia, C = h && HISTORIA[h.cap];
  if (!C || !h.activo) return '';
  return `<div class="seg-m seg-hist ${h.listo ? 'ok' : ''}"><span class="seg-t"><span>📜</span> <span>${C.titulo}</span></span>` +
    (h.listo ? '<span class="seg-o ok">Vuelve a la ciudad</span>' : `<span class="seg-o">- <span>${C.obj.txt}</span>${C.obj.n > 1 ? `: ${h.prog}/${C.obj.n}` : ''}</span>`) + '</div>';
}
// lo que ya sabes del misterio (en «Ver la historia» del menú de pausa)
function resumenHistoria(){
  const h = PJ.historia || { cap:0 };
  return HISTORIA.slice(0, h.cap).map(C => ['narr', () => `${window.tr(C.titulo.split(':')[1].trim())}: ${window.tr(C.resumen)}`]);
}

