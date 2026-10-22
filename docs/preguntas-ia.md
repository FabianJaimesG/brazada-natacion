# Guion para la conversación con la IA

El enunciado pide hablar con una IA para desarrollar el backend en Node.js y anexar la conversación **completa** con una reflexión. Este guion recorre, en orden, las decisiones que tiene el proyecto. Cada pregunta indica qué parte del código debería salir de la respuesta, para comparar lo que propone la IA con lo implementado y anotar los ajustes.

## Cómo hacerla

- Una sola conversación nueva en https://chatgpt.com o https://claude.ai.
- Haz las preguntas en este orden. Si la respuesta se desvía, repregunta con tus palabras: eso también cuenta como interacción.
- Al final usa **Compartir** para sacar el enlace y copia el texto completo para el anexo.

## Preguntas

### 1. Sesión (pregunta del enunciado)
> Estoy haciendo una página web sobre natación en Replit con Node.js y Express. Tiene un formulario con nombre, estilo favorito y comentario. ¿Cómo puedo crear un formulario que guarde comentarios en una variable de sesión en Node.js?

**Lo esperable:** `express-session` y `req.session.comentarios`.
**En el proyecto:** no se usó la sesión (ver pregunta 3).

### 2. Mostrar sin recargar (pregunta del enunciado)
> ¿Cómo muestro los comentarios almacenados en la misma página utilizando JavaScript, sin recargarla?

**Lo esperable:** `fetch` a una ruta `GET` que devuelve JSON y un `POST` con `preventDefault()`.
**En el proyecto:** `public/js/comentarios.js` (`cargarComentarios`, listener `submit`) y las rutas de `app.js`.

### 3. Sesión frente a datos compartidos
> Si guardo los comentarios en la sesión, ¿los demás visitantes también los ven? ¿Qué me conviene si quiero que todos vean todos los comentarios?

**Lo esperable:** la sesión es individual, así que cada visitante solo ve los suyos; la alternativa es un arreglo en el servidor.
**Ajuste principal:** se cambió la sesión por un almacén compartido.

### 4. Que no se pierdan al reiniciar
> Si guardo los comentarios en un arreglo en memoria, se borran cuando el servidor se reinicia. ¿Cómo los guardo en un archivo JSON sin usar una base de datos?

**Lo esperable:** `fs.readFile` al arrancar y `fs.writeFile` en cada comentario nuevo.
**En el proyecto:** `lib/almacen.js`.

### 5. Escrituras simultáneas
> ¿Qué pasa si dos personas envían un comentario al mismo tiempo y las dos escrituras del archivo se cruzan? ¿Cómo lo evito?

**Lo esperable:** encolar las escrituras y escribir primero en un archivo temporal para luego renombrarlo.
**En el proyecto:** la `cola` de promesas y el `rename` de `lib/almacen.js`.

### 6. LocalStorage para los comentarios propios
> Quiero que cada visitante vea marcados sus propios comentarios y que no los pierda aunque el servidor se reinicie. ¿Cómo uso localStorage para eso?

**Lo esperable:** guardar en `localStorage` el comentario que devuelve el servidor y compararlo por `id` al pintar la lista.
**En el proyecto:** `leerPropios`, `guardarPropio` y `pintar` en `public/js/comentarios.js`, con las etiquetas «Tu comentario» y «Guardado en este navegador».

### 7. Validación y seguridad
> ¿Cómo valido el formulario en el navegador y en el servidor con las mismas reglas, sin escribirlas dos veces? ¿Y cómo evito que alguien inyecte HTML o scripts en un comentario?

**Lo esperable:** un módulo compartido (ES Modules), respuestas `400` con el error de cada campo y pintar con `textContent` en vez de `innerHTML`.
**En el proyecto:** `public/js/validacion.js`, importado por `app.js` y por `comentarios.js`.

### 8. Pruebas
> ¿Cómo pruebo esa API con el runner de pruebas que trae Node, sin instalar librerías?

**Lo esperable:** `node:test`, `assert` y `fetch` contra el servidor levantado en un puerto libre.
**En el proyecto:** `tests/api.test.js` (`npm test`).

### 9. Replit
> ¿Qué tengo que configurar para que este proyecto funcione en Replit? ¿En qué puerto debe escuchar? ¿El archivo JSON se conserva cuando lo publico?

**Lo esperable:** `process.env.PORT`, escuchar en `0.0.0.0`, un archivo `.replit` y la advertencia de que el disco de una app publicada no es permanente.
**En el proyecto:** `server.js` y `.replit`.

## Para el anexo

Por cada pregunta anota tres cosas: qué propuso la IA, qué se usó tal cual y qué se ajustó y por qué. La pregunta 3 es el ajuste más importante, porque cambia la idea inicial del enunciado de usar la sesión.
