# Brazada · Mi pasión por la natación

Página web personal sobre la natación, construida para el **Proyecto de Aplicación** de la asignatura Desarrollo Web (Corporación Universitaria de Asturias, 2026).

## Secciones

- **Introducción:** por qué la natación y los cuatro estilos de competencia.
- **Galería:** seis imágenes con visor ampliado (`<dialog>`).
- **Comentarios:** formulario validado que publica el comentario y lo muestra en la misma página sin recargarla.
- **Backend:** API en Node.js con Express que guarda los comentarios en un archivo JSON.

## Cómo se guardan los comentarios

| Dónde | Qué guarda | Para qué |
|---|---|---|
| `data/comentarios.json` (servidor) | Todos los comentarios | Que todos los visitantes los vean y que sobrevivan a un reinicio |
| `localStorage` (navegador) | Solo los comentarios que publicó ese visitante | Marcarlos como «Tu comentario» y mostrarlos aunque el servidor haya perdido el archivo |

### API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/comentarios` | `200` con la lista, del más reciente al más antiguo |
| `POST` | `/api/comentarios` | `201` con el comentario creado, o `400` con `{ errores: { campo: mensaje } }` |

El cuerpo del `POST` es `{ "nombre", "estilo", "comentario" }`. Las reglas están en `public/js/validacion.js`, y las usan tanto el navegador como el servidor.

## Seguridad

- **Sin inyección de HTML:** los comentarios se pintan con `textContent`, nunca con `innerHTML`.
- **Content-Security-Policy:** el navegador solo ejecuta scripts y carga recursos del propio sitio (`lib/seguridad.js`). Además se envían `X-Content-Type-Options: nosniff` y `Referrer-Policy`.
- **Límite de envíos:** máximo 5 comentarios por minuto por IP. Al pasarse, el servidor responde `429` con `Retry-After`.
- **Validación en los dos lados**, cuerpo de máximo 10 KB y el archivo de datos fuera de `public/`.

## Tecnologías

- HTML5 semántico y accesible.
- CSS3 *mobile first*: estilos base para móvil y `min-width` en 40em (tableta) y 64em (escritorio).
- JavaScript sin librerías (ES Modules, `fetch`, `localStorage`, `<dialog>`).
- Node.js 20 + Express 5, con persistencia en un archivo JSON.
- Pruebas con `node:test`.
- Replit para el despliegue.

## Ejecutarlo en local

```bash
npm install
npm start        # http://localhost:3000
npm run dev      # reinicia el servidor al guardar
npm test         # pruebas del API
```

> En Replit, el archivo JSON se conserva mientras el proyecto vive en el espacio de trabajo. En una app publicada (Deployments) el disco no es permanente: al volver a publicar se empieza de cero. Por eso cada visitante conserva sus propios comentarios en `localStorage`.

## Estructura

```
server.js            arranque: carga el JSON y escucha en el puerto
app.js               aplicación Express y rutas del API
lib/almacen.js       lectura y escritura de data/comentarios.json
lib/seguridad.js     Content-Security-Policy y límite de envíos
data/                comentarios guardados (fuera de git)
public/
  index.html         página única
  css/styles.css     estilos mobile first
  js/main.js         menú móvil y visor de la galería
  js/comentarios.js  envío, listado y localStorage
  js/validacion.js   reglas compartidas por navegador y servidor
  img/               imágenes de la galería
tests/api.test.js    pruebas del API
docs/
  preguntas-ia.md    guion de la conversación con la IA
```

## Créditos de las imágenes

Todas provienen de Wikimedia Commons con licencias Creative Commons. Los autores y las licencias aparecen en el pie de la página.
