// =====================================================
//  CADENAS DE MISIONES DE LOS VECINOS
//  Cada vecino importante tiene su propia historia en varias etapas, con diálogos (como los de la historia principal)
//  y un premio único al final que va a la Colección.
//  Una etapa la da un vecino («da», por defecto el dueño de la cadena) y se entrega a otro («entrega», por defecto
//  el mismo); en las etapas de hablar, el objetivo es ir a ver a otro vecino.
//  Objetivos: mata (un tipo de monstruo), despeja (mazmorras de un rango o superior), jefe (el jefe de un rango),
//  recoge (objetos de la bolsa, se entregan al terminar) y habla.
// =====================================================
const HABLANTES = {
  roxy:   { n:'Roxy',        spr:'roxy',  col:'#a9b8ff' },
  bruno:  { n:'Bruno',       spr:'bruno', col:'#e8a868' },
  nalani: { n:'Nalani',      cam:'nalani', col:'#ffb3d0' },
  benja:  { n:'Benja',       cam:'benja', col:'#9fe39a' },
  ruarc:  { n:'Sabio Ruarc', cam:'ruarc', col:'#c8a8ff' },
  eldrin: { n:'Eldrin',      cam:'eldrin', col:'#9fe0ff' }
};
const CADENAS = {
  roxy: { titulo:'El registro perdido', dueno:'roxy', nivel:1, premio:['tinte', 'medianoche'], pasos:[
    { obj:{ tipo:'despeja', rango:0, n:2 }, txt:'Despeja 2 mazmorras (cualquier rango)', oro:3000, xp:150,
      intro:[['roxy', '¡Hola, cazador! Perdona el desorden... Ayer se me cayó el Registro Antiguo de la Asociación dentro de un portal.'],
             ['roxy', 'Bueno, «se me cayó»... Un limo se lo tragó. Se comen todo lo que brilla, y las tapas tenían letras doradas.'],
             ['gato', '¿Un limo se comió un libro?'],
             ['roxy', 'Y luego escupió las hojas por toda la cueva. Si despejas un par de mazmorras, ¿me traes las que encuentres?']],
      fin:[['roxy', '¡Las páginas! Están pegajosas, pero se leen. Mira esta: «Hermandad de la Primera Grieta. Maestro: Aldric».'],
           ['gato', 'Ese nombre... algo he oído.'],
           ['roxy', 'Todos en Lumeria lo han oído. Pero nadie sabe quién llevaba el registro de su hermandad.']] },
    { obj:{ tipo:'recoge', k:'p_gelatina', n:6 }, txt:'Trae 6 Gelatinas de limo', oro:4000, xp:220,
      intro:[['roxy', 'Las hojas se deshacen en cuanto las toco. Mi abuela restauraba libros con jalea de limo... suena raro, ya lo sé.'],
             ['roxy', '¿Me traes 6 Gelatinas de limo? Los limos de los portales las sueltan al morir.']],
      fin:[['roxy', 'Huele a fresa, pero funciona. Mira, ya se lee la firma del registro...'],
           ['roxy', '«Rosa, recepcionista de la hermandad». ¡Rosa era mi abuela! Nunca me contó que trabajó para Aldric.']] },
    { obj:{ tipo:'jefe', rango:1, n:1 }, txt:'Derrota al Rey Colmillo (portal de rango D)', oro:8000, xp:400,
      intro:[['roxy', 'Falta la última hoja. Un cazador la vio clavada en la guarida del Rey Colmillo, en los portales de rango D.'],
             ['gato', 'Claro. Cómo no.'],
             ['roxy', '¡Ten cuidado! Te espero aquí con un té.']],
      fin:[['roxy', '¡La tienes! Dice: «A quien termine este registro: la Asociación siempre tendrá un sitio para ti».'],
           ['roxy', 'Lo escribió mi abuela. Supongo que ahora ese sitio es tuyo.'],
           ['roxy', 'Toma. Es el tinte que usaba la hermandad para sus uniformes: Medianoche. Te quedará genial.']] }
  ] },
  bruno: { titulo:'La última cacería', dueno:'bruno', nivel:8, premio:['montura', 'veterano'], pasos:[
    { obj:{ tipo:'recoge', k:'p_colmillo', n:6 }, txt:'Trae 6 Colmillos de jabalí', oro:5000, xp:300,
      intro:[['bruno', '¿Ves esta cicatriz, chaval? Me la hizo un jabalí del primer portal que se abrió en Lumeria.'],
             ['gato', '¿Y qué fue de él?'],
             ['bruno', 'Sigue ahí dentro. Ahora lo llaman el Rey Colmillo. Antes de hablar de él, quiero ver de qué estás hecho.'],
             ['bruno', 'Tráeme 6 colmillos de jabalí. Si no puedes con los pequeños, olvídate del grande.']],
      fin:[['bruno', 'Buenos colmillos. Limpios, sin melladuras. Tienes buen ojo.']] },
    { obj:{ tipo:'mata', que:'jabali', n:20 }, txt:'Derrota 20 Jabalíes furiosos', oro:6000, xp:400,
      intro:[['bruno', 'Los jabalíes cargan en línea recta. Si aprendes a esquivarlos, aprendes a cazarlos.'],
             ['bruno', 'Derrota a 20. Y cuando veas la marca roja en el suelo... apártate.']],
      fin:[['bruno', 'Ya te mueves como un cazador de verdad. Yo tardé años en aprender eso.']] },
    { obj:{ tipo:'jefe', rango:1, n:1 }, txt:'Derrota al Rey Colmillo (portal de rango D)', oro:12000, xp:700,
      intro:[['bruno', 'Ha llegado la hora. Entra en un portal de rango D y acaba con el Rey Colmillo.'],
             ['bruno', 'Yo ya no tengo las piernas de antes. Hazlo por los dos.']],
      fin:[['bruno', '¿Lo hiciste? ... Treinta años esperando este día.'],
           ['bruno', 'Tengo algo para ti. Es el jabalí que domé de joven. Viejo y gruñón, pero más fuerte que ninguno.'],
           ['bruno', 'Cuídalo. Él te cuidará a ti.']] }
  ] },
  nalani: { titulo:'¿Dónde está Queso?', dueno:'nalani', nivel:3, premio:['pelaje', 'queso'], pasos:[
    { obj:{ tipo:'habla' }, entrega:'benja', txt:'Pregunta a Benja (en la parada del autobús)', oro:1500, xp:80,
      intro:[['nalani', '¡Cazador, ayuda! ¡Queso, mi rata, se ha escapado!'],
             ['nalani', 'Benja estaba en la parada del autobús cuando pasó. ¿Puedes preguntarle si la vio?']],
      fin:[['benja', '¿Una rata amarilla con mucha prisa? ¡Sí! Se metió en un portal persiguiendo a un limo.'],
           ['gato', 'Claro que sí...'],
           ['benja', 'Si entras a buscarla, tráela de vuelta a Nalani. ¡Y ten cuidado!']] },
    { da:'benja', entrega:'nalani', obj:{ tipo:'despeja', rango:0, n:1 }, txt:'Busca a Queso en un portal y vuelve con Nalani', oro:3000, xp:200,
      intro:[['benja', 'Los portales de rango E son los más tranquilos. Seguro que está en uno de esos.']],
      fin:[['nalani', '¡Queso! ¡Estás pringosa de gelatina de los pies a la cabeza!'],
           ['nalani', 'Gracias, de verdad. No sé qué haría sin ella.']] },
    { obj:{ tipo:'mata', que:'slime', n:12 }, txt:'Derrota 12 Limos', oro:4000, xp:300,
      intro:[['nalani', 'Queso dice (bueno, chilla) que en la cueva hay más ratas atrapadas por los limos.'],
             ['nalani', '¿Puedes ahuyentarlos? Con 12 limos menos, seguro que salen todas.']],
      fin:[['nalani', '¡Han vuelto todas! Queso las ha traído a casa en fila, como un desfile.'],
           ['nalani', 'Mira, te ha dejado un mechón de su pelo dorado. Dicen que si se lo das a tu mascota, le crece igual de brillante.']] }
  ] },
  ruarc: { titulo:'Ecos de la Primera Grieta', dueno:'ruarc', nivel:25, premio:['montura', 'runico'], pasos:[
    { obj:{ tipo:'despeja', rango:2, n:2 }, txt:'Despeja 2 mazmorras de rango C o superior', oro:15000, xp:900,
      intro:[['ruarc', 'Joven cazador. Los portales se abren cada vez más hondo. Escucho un eco... como si algo llamara desde la Primera Grieta.'],
             ['ruarc', 'Despeja dos mazmorras de rango C o superior y dime qué sientes allí dentro.']],
      fin:[['gato', 'Hacía frío. Y las paredes... susurraban.'],
           ['ruarc', 'Lo sabía. Las runas se están despertando.']] },
    { obj:{ tipo:'recoge', k:'p_nucleo', n:3 }, txt:'Trae 3 Núcleos de jefe', oro:18000, xp:1100,
      intro:[['ruarc', 'Los núcleos de los jefes guardan el eco de la grieta donde nacieron. Tráeme tres y podré leerlos.']],
      fin:[['ruarc', 'Este núcleo... repite un nombre una y otra vez: Aldric.']] },
    { obj:{ tipo:'habla' }, entrega:'eldrin', txt:'Cuéntaselo a Eldrin, el elfo', oro:5000, xp:400,
      intro:[['ruarc', 'Eldrin conoce las runas antiguas de los elfos. Ve a verlo y cuéntale lo que hemos descubierto.']],
      fin:[['eldrin', 'Runas de sellado... Son las mismas que vi de joven en la Grieta Roja.'],
           ['eldrin', 'Si alguien rompe el último sello, los portales nunca volverán a cerrarse.']] },
    { da:'eldrin', entrega:'ruarc', obj:{ tipo:'jefe', rango:4, n:1 }, txt:'Derrota al Monarca del Vacío (portal de rango A)', oro:40000, xp:2500,
      intro:[['eldrin', 'El Monarca del Vacío guarda la piedra rúnica del sello. Derrótalo y llévasela a Ruarc.']],
      fin:[['ruarc', 'La piedra... late como un corazón.'],
           ['ruarc', 'Con ella he despertado al guardián que la custodiaba. Te reconoce como su jinete.'],
           ['ruarc', 'Llévalo contigo: un jabalí rúnico, el último de su especie.']] }
  ] }
};

// ---------- estado y progreso ----------
const npcClave = n => n && (n.cam || n.spr);
const estadoCadena = id => { PJ.cadenas = PJ.cadenas || {}; return PJ.cadenas[id] || (PJ.cadenas[id] = { paso:0, estado:'libre' }); };
const sumaDesde = r => RANGOS.slice(r).reduce((a, R) => a + ((PJ.limpias || {})[R.l] || 0), 0);
function cuentaObj(o){
  if (o.tipo === 'mata') return (PJ.matados || {})[o.que] || 0;
  if (o.tipo === 'despeja') return sumaDesde(o.rango);
  if (o.tipo === 'jefe') return (PJ.limpias || {})[RANGOS[o.rango].l] || 0;
  if (o.tipo === 'recoge') return cuentaRecoge(o.k);
  return 0;
}
function progresoPaso(id){
  const st = estadoCadena(id), C = CADENAS[id], p = C.pasos[st.paso];
  if (!p || st.estado !== 'activa') return { p, prog:0, n:0, lista:false };
  if (p.obj.tipo === 'habla') return { p, prog:0, n:1, lista:true };
  const n = p.obj.n, prog = Math.min(n, p.obj.tipo === 'recoge' ? cuentaObj(p.obj) : cuentaObj(p.obj) - (st.base || 0));
  return { p, prog, n, lista:prog >= n };
}
const daPaso = (C, p) => p.da || C.dueno, entregaPaso = (C, p) => p.entrega || C.dueno;

// ¿qué hace este vecino ahora? ofrecer una etapa, recibirla (lista o no), o nada
function cadenaDe(clave){
  if (!PJ) return null;
  for (const id in CADENAS){
    const C = CADENAS[id], st = estadoCadena(id), p = C.pasos[st.paso];
    if (st.estado === 'hecha' || !p) continue;
    if (st.estado === 'libre' && daPaso(C, p) === clave && PJ.nivel >= C.nivel) return { id, accion:'ofrece' };
    if (st.estado === 'activa' && entregaPaso(C, p) === clave) return { id, accion:progresoPaso(id).lista ? 'entrega' : 'espera' };
  }
  return null;
}
// marca sobre la cabeza: ! naranja (etapa nueva de una historia), ? naranja (lista para entregar), ? gris (falta)
function marcaCadena(n){
  const c = cadenaDe(npcClave(n)); if (!c) return null;
  if (c.accion === 'ofrece') return { c:'!', col:'#ff9a3d' };
  return c.accion === 'entrega' ? { c:'?', col:'#ff9a3d' } : { c:'?', col:'#b8b8c4' };
}
// hablar con el vecino: devuelve true si se ocupó la cadena (y no hace falta su misión normal)
function hablarCadena(n){
  const c = cadenaDe(npcClave(n)); if (!c) return false;
  const C = CADENAS[c.id], st = estadoCadena(c.id), p = C.pasos[st.paso];
  if (c.accion === 'ofrece'){
    dialogo(p.intro, () => {
      st.estado = 'activa'; st.base = p.obj.tipo === 'recoge' || p.obj.tipo === 'habla' ? 0 : cuentaObj(p.obj);
      chat(`Historia de ${HABLANTES[C.dueno].n}: «${C.titulo}» (${st.paso + 1}/${C.pasos.length}). ${p.txt}.`, '#ff9a3d');
      banner(`${C.titulo} · ${st.paso + 1}/${C.pasos.length}`, p.txt);
      sfx('click'); guardar();
    });
    return true;
  }
  if (c.accion === 'espera'){
    const { prog, n:meta } = progresoPaso(c.id);
    dialogo([[npcClave(n), `Todavía te falta un poco: ${window.tr(p.txt)} (${prog}/${meta}).`]]);
    return true;
  }
  // entrega
  dialogo(p.fin, () => {
    if (p.obj.tipo === 'recoge') gastarRecoge(p.obj.k, p.obj.n);
    PJ.oro += p.oro || 0;
    chat(`Etapa completada: «${C.titulo}» (${st.paso + 1}/${C.pasos.length}). Recibes ${dineroTxt(p.oro || 0)}.`, '#ff9a3d');
    st.paso++; st.estado = 'libre'; st.base = 0;
    if (st.paso >= C.pasos.length){
      st.estado = 'hecha';
      banner('Historia completada', C.titulo);
      darColeccion(C.premio[0], C.premio[1]);
    } else banner('Etapa completada', `${C.titulo} · ${st.paso}/${C.pasos.length}`);
    ganarXP(p.xp || 0, true); guardar();
  });
  return true;
}
// líneas para el seguimiento de misiones de la pantalla
function filasCadenas(){
  if (!PJ) return '';
  let h = '';
  for (const id in CADENAS){
    const st = estadoCadena(id); if (st.estado !== 'activa') continue;
    const C = CADENAS[id], { p, prog, n, lista } = progresoPaso(id);
    const quien = HABLANTES[entregaPaso(C, p)].n;
    h += `<div class="seg-m seg-cad ${lista ? 'ok' : ''}"><span class="seg-t"><span>✦</span> <span>${C.titulo}</span></span>` +
      (lista ? `<span class="seg-o ok">Habla con ${quien}</span>` : `<span class="seg-o">- <span>${p.txt}</span>${n > 1 ? `: ${prog}/${n}` : ''}</span>`) + '</div>';
  }
  return h;
}
