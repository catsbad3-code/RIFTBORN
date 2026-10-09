# Riftborn: El Ascenso del Eclipse

Juego RPG 2D de navegador (computadora y teléfono). Todo funciona en el navegador, sin servidor:
las cuentas y los personajes se guardan en el `localStorage` de cada navegador.

## Estructura

```
index.html        Página principal (va en la raíz)
css/style.css     Estilos de toda la interfaz
auth/auth.js      Cuentas, inicio de sesión y guardado
js/game.js        Lógica del juego (ciudad, mazmorras, combate, misiones, interfaz)
img/              Sprites, texturas, íconos y fondos
.nojekyll         Evita que GitHub Pages procese los archivos
```

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
C personaje · B mochila · P libro · L misiones · G mascota · Esc menú
