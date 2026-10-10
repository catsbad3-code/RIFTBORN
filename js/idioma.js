// =====================================================
//  IDIOMA: español (el del juego) o inglés
//  El juego está escrito en español. En inglés, cada texto que llega a la pantalla
//  (la página, el chat, las ventanas y lo que se pinta en el lienzo) se cambia por su
//  traducción de js/en.js. Las frases con huecos ({}) se reconocen como patrones.
// =====================================================
(function(){
  let lang = 'es';
  try { lang = localStorage.getItem('rb_idioma') || 'es'; } catch (e) {}
  if (lang !== 'en') lang = 'es';
  window.IDIOMA = lang;
  // cambiar de idioma guarda la elección y recarga la página
  window.cambiarIdioma = l => { try { localStorage.setItem('rb_idioma', l); } catch (e) {} location.reload(); };
  document.documentElement.lang = lang;
  if (lang === 'es'){ window.tr = s => s; return; }

  const exactos = new Map(), patrones = [];
  const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const [es, en] of Object.entries(window.I18N_EN || {})){
    if (en == null || en === '') continue;
    if (!es.includes('{}')){ exactos.set(es, en); continue; }
    const trozos = es.split('{}'), fijo = trozos.reduce((a, b) => b.length > a.length ? b : a, '');
    if (fijo.trim().length < 3) continue;   // un patrón casi vacío lo atraparía todo
    const re = new RegExp('^' + trozos.map(escapar).join('([\\s\\S]*?)') + '$');
    patrones.push({ re, en, fijo, largo:es.length - (trozos.length - 1) * 2 });
  }
  patrones.sort((a, b) => b.largo - a.largo);   // los más concretos primero

  // dinero: "3 de oro, 5 de plata y 2 de cobre" -> "3 gold, 5 silver and 2 copper"
  const DINERO = /^\d+ de (oro|plata|cobre)((, | y )\d+ de (oro|plata|cobre))*$/;
  const dinero = t => DINERO.test(t) ? t.replace(/ de oro/g, ' gold').replace(/ de plata/g, ' silver').replace(/ de cobre/g, ' copper').replace(/ y /g, ' and ') : null;

  const TERMINOS = (window.I18N_EN_TERMINOS || []).map(([a, b]) => [new RegExp(a, 'g'), b]);
  const ES = /[áéíóúñÁÉÍÓÚÑ¿¡]|\b(de|del|la|las|los|el|que|con|por|para|una|tu|tus|y|en|sin|más)\b/;
  const rellenar = (en, vals) => { let i = 0; return en.replace(/\{(\d*)\}/g, (_, n) => (n ? vals[n - 1] : vals[i++]) ?? ''); };
  const LETRA = /[A-Za-zÁÉÍÓÚáéíóúñÑ]/;
  function traducir(s){
    const t = s.trim();
    if (!t || !LETRA.test(t)) return s;
    const i = s.indexOf(t), antes = s.slice(0, i), despues = s.slice(i + t.length);
    let x = exactos.get(t);
    if (x === undefined) x = dinero(t);
    if (x == null){
      for (const p of patrones){
        if (!t.includes(p.fijo)) continue;
        const m = p.re.exec(t);
        if (m){ x = rellenar(p.en, m.slice(1).map(v => tr(v))); break; }
      }
    }
    // «¡Nombre!» y otras exclamaciones sin frase propia: se traduce lo de dentro
    if (x == null && /^¡.+!$/.test(t)){ const d = tr(t.slice(1, -1)); if (d !== t.slice(1, -1) || !ES.test(d)) x = d + '!'; }
    // lo que el juego monta por piezas (nombres de objetos, ranuras, atributos): términos sueltos
    if (x == null && ES.test(t)){ let y = t; for (const [re, en] of TERMINOS) y = y.replace(re, en); if (y !== t) x = y; }
    return x == null ? s : antes + x + despues;
  }
  const cache = new Map();
  const tr = window.tr = s => {
    if (typeof s !== 'string' || !s) return s;
    let r = cache.get(s);
    if (r === undefined){ r = traducir(s); if (cache.size > 6000) cache.clear(); cache.set(s, r); }
    return r;
  };

  // lienzo: lo que se pinta con fillText / strokeText (y su medida) sale traducido
  const C = CanvasRenderingContext2D.prototype;
  for (const f of ['fillText', 'strokeText', 'measureText']){
    const orig = C[f];
    C[f] = function(txt, ...resto){ return orig.call(this, typeof txt === 'string' ? tr(txt) : txt, ...resto); };
  }

  // página: textos, títulos y textos de ayuda; los cambios posteriores se vigilan
  const ATRS = ['placeholder', 'title', 'aria-label'];
  const fuera = n => n.parentElement && n.parentElement.closest('[translate="no"],script,style,textarea');
  function nodo(n){
    if (n.nodeType === 3){
      if (fuera(n)) return;
      const v = n.nodeValue, t = tr(v);
      if (t !== v) n.nodeValue = t;
    } else if (n.nodeType === 1){
      if (n.closest('[translate="no"],script,style')) return;
      for (const a of ATRS){ const v = n.getAttribute(a); if (v){ const t = tr(v); if (t !== v) n.setAttribute(a, t); } }
      if (n.tagName === 'INPUT' && (n.type === 'button' || n.type === 'submit') && n.value){ const t = tr(n.value); if (t !== n.value) n.value = t; }
      for (const h of n.childNodes) nodo(h);
    }
  }
  const raiz = document.body || document.documentElement;
  nodo(raiz);
  document.title = tr(document.title);
  new MutationObserver(lista => {
    for (const m of lista){
      if (m.type === 'characterData') nodo(m.target);
      else if (m.type === 'attributes') nodo(m.target);
      else for (const n of m.addedNodes) nodo(n);
    }
  }).observe(raiz, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATRS });
})();
