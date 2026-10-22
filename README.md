# Brazada · Mi pasión por la natación

Página web personal sobre la natación, construida para el **Proyecto de Aplicación** de la asignatura Desarrollo Web (Corporación Universitaria de Asturias, 2026).

## Secciones

- **Introducción:** por qué la natación y los cuatro estilos de competencia.
- **Galería:** seis imágenes con visor ampliado (`<dialog>`).
- **Comentarios:** formulario para dejar un comentario, que se muestra en la misma página.
- **Backend:** servidor Node.js con Express que recibe y entrega los comentarios.

## Tecnologías

- HTML5 semántico y accesible.
- CSS3 *mobile first*: estilos base para móvil y `min-width` en 40em (tableta) y 64em (escritorio).
- JavaScript sin librerías.
- Node.js 20 + Express 5.
- Replit para el despliegue.

## Ejecutarlo en local

```bash
npm install
npm start        # http://localhost:3000
npm run dev      # reinicia el servidor al guardar
```

## Estructura

```
server.js            servidor Express
public/
  index.html         página única
  css/styles.css     estilos mobile first
  js/main.js         menú móvil y visor de la galería
  img/               imágenes de la galería
docs/
  preguntas-ia.md    guion de la conversación con la IA
```

## Créditos de las imágenes

Todas provienen de Wikimedia Commons con licencias Creative Commons. Los autores y las licencias aparecen en el pie de la página.
