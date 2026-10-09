// =====================================================
//  CUENTAS Y GUARDADO
// =====================================================
const DB = {
  leer(){ try { return JSON.parse(localStorage.getItem('rb_cuentas')) || {}; } catch { return {}; } },
  escribir(d){ try { localStorage.setItem('rb_cuentas', JSON.stringify(d)); return true; } catch { return false; } },
  sesion(){ try { return localStorage.getItem('rb_sesion'); } catch { return null; } },
  setSesion(u){ try { u ? localStorage.setItem('rb_sesion', u) : localStorage.removeItem('rb_sesion'); } catch {} }
};
// Hash simple solo para la demo. En producción usa un servidor real.
function hash(s){ let h = 5381; for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) | 0; return (h >>> 0).toString(36); }
let usuario = null;
const cuenta = () => DB.leer()[usuario];
function guardarCuenta(c){ const d = DB.leer(); d[usuario] = c; DB.escribir(d); }

function registrar(u, p, p2){
  u = u.trim();
  if (u.length < 3) return 'El usuario necesita al menos 3 caracteres.';
  if (p.length < 4) return 'La contraseña necesita al menos 4 caracteres.';
  if (p !== p2) return 'Las contraseñas no coinciden.';
  const d = DB.leer(), k = u.toLowerCase();
  if (d[k]) return 'Ese usuario ya existe. Inicia sesión.';
  d[k] = { nombre:u, hash:hash(k + ':' + p), personajes:[] };
  if (!DB.escribir(d)) return 'Este navegador no permite guardar datos.';
  return null;
}
function iniciarSesion(u, p){
  const d = DB.leer(), k = u.trim().toLowerCase();
  if (!d[k] || d[k].hash !== hash(k + ':' + p)) return 'Usuario o contraseña incorrectos.';
  usuario = k; DB.setSesion(k); return null;
}
