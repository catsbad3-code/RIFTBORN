# Riftborn: El Ascenso del Eclipse

Juego RPG 2D de navegador (computadora y teléfono). Todo funciona en el navegador, sin servidor:
las cuentas y los personajes se guardan en el `localStorage` de cada navegador.

## Estructura

```
index.html              Página principal (va en la raíz)
manifest.webmanifest    Datos de la app instalable (nombre, iconos)
sw.js                   Modo sin internet (guarda los archivos del juego); debe ir en la raíz
css/style.css           Estilos de toda la interfaz
auth/auth.js            Cuentas, inicio de sesión y guardado
idioma/                 Español / inglés: idioma.js (traductor) y en.js (textos en inglés)
music/sonido.js         Música y efectos (se generan en el navegador, sin archivos de audio)
js/                     El juego, repartido por temas
  nucleo/               Datos, partida, controles, actualizar, dibujo e inicio (bucle del juego)
  mundo/                Ciudad, edificios, casino, mazmorras, monstruos, NPC, eventos y ambiente
  combate/              Combate, clases, Devorar, sacerdote y arquero, efectos, jefes y grupo
  personaje/            Perfil, sprites del gato, mascota, montura, progreso y emblemas
  historia/             Prólogo, capítulos de la historia y sala de vídeos
img/
  personajes/           Gatos, ratas, NPC y vecinos
  monstruos/            Monstruos y jefes
  mundo/                Casas, terrenos, edificios, muebles, portales y casino
  efectos/              Efectos de los poderes
  interfaz/             Marcos, iconos y fondo del menú
  app/                  Iconos de la app instalable
  px/                   Versiones en pixel art de las hojas del mundo
.nojekyll               Evita que GitHub Pages procese los archivos
```

Los archivos de `js/` se cargan en `index.html` en un orden fijo: cada uno usa lo que cargaron los anteriores.
Si añades un archivo nuevo, ponlo también en `index.html` y en la lista de `sw.js`.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `riftborn`).
2. Sube **el contenido** de esta carpeta (index.html debe quedar en la raíz del repositorio, no dentro de otra carpeta).
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. En uno o dos minutos el juego queda en `https://TU-USUARIO.github.io/riftborn/`.

## Publicar en Vercel

1. En vercel.com: **Add New → Project** e importa el repositorio de GitHub.
2. Framework Preset: **Other**. No hace falta comando de build ni carpeta de salida.
3. **Deploy**.

## Probar en tu computadora

Abre la carpeta en una terminal y ejecuta `python -m http.server 8000`, luego entra a `http://localhost:8000`.
(También funciona abriendo `index.html` con doble clic.)

## Controles

WASD mover · clic izquierdo/derecho atacar · Q F R 1 2 3 4 poderes · H poción · E interactuar ·
C personaje · B mochila · P libro · L misiones · G mascota · Y montura · Z Devorar · Esc menú
