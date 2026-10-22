# Guion para la conversación con la IA

El enunciado pide hablar con una IA (ChatGPT, Claude u otra) para que ayude a generar el backend en Node.js y anexar la conversación **completa**. Haz las preguntas en este orden, en una sola conversación, y copia cada respuesta tal cual.

## Antes de empezar

- Abre una conversación nueva en https://chatgpt.com o https://claude.ai.
- No pegues el código del proyecto todavía: la idea es ver qué propone la IA por sí sola.
- Al final, usa **Compartir** para sacar un enlace público y exporta o copia el texto completo.

## Preguntas

1. **Contexto y sesión** (pregunta del enunciado)
   > Estoy haciendo una página web sobre natación en Replit con Node.js y Express. Tiene un formulario con nombre, estilo favorito y comentario. ¿Cómo puedo crear un formulario que guarde comentarios en una variable de sesión en Node.js?

2. **Mostrar los comentarios** (pregunta del enunciado)
   > ¿Cómo muestro los comentarios almacenados en la misma página utilizando JavaScript, sin recargarla?

3. **Sesión o memoria compartida**
   > Si guardo los comentarios en la sesión, ¿los demás visitantes también los ven? ¿Qué diferencia hay con guardarlos en un arreglo en memoria del servidor? ¿Qué me conviene para una página donde todos deben ver los comentarios?

4. **Validación y seguridad**
   > ¿Cómo valido en el servidor que el nombre y el comentario no lleguen vacíos ni demasiado largos, y cómo evito que alguien inyecte HTML o scripts en los comentarios?

5. **Replit**
   > ¿Qué tengo que configurar para que este servidor funcione en Replit? ¿En qué puerto debe escuchar?

## Después

Pásale a Claude Code el enlace o el texto de la conversación. Con eso:

- se integra el código en `server.js` y en un módulo `public/js/comentarios.js`;
- se anota cada ajuste hecho al código sugerido y por qué. Ese registro es la base del anexo.
