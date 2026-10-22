// Cabeceras de seguridad y límite de envíos, sin librerías externas.

// Content-Security-Policy: el navegador solo carga y ejecuta recursos del
// propio sitio. Si algún día se pintara un comentario con innerHTML por
// error, un <script> o un onerror inyectado no llegarían a ejecutarse.
const POLITICA = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export function cabecerasSeguras(req, res, next) {
  res.set({
    "Content-Security-Policy": POLITICA,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  next();
}

// Límite de envíos por IP con ventana deslizante: cada IP puede hacer
// `max` intentos cada `ventanaMs`. Al pasarse recibe 429 y Retry-After.
export function limitarEnvios({ max = 5, ventanaMs = 60_000 } = {}) {
  const intentos = new Map(); // ip -> marcas de tiempo de sus envíos

  // Limpieza periódica para que el mapa no crezca sin fin
  setInterval(() => {
    const limite = Date.now() - ventanaMs;
    for (const [ip, marcas] of intentos) {
      if (marcas.every((t) => t <= limite)) intentos.delete(ip);
    }
  }, ventanaMs).unref();

  return (req, res, next) => {
    const ahora = Date.now();
    const recientes = (intentos.get(req.ip) ?? []).filter((t) => t > ahora - ventanaMs);

    if (recientes.length >= max) {
      const espera = Math.ceil((recientes[0] + ventanaMs - ahora) / 1000);
      res.set("Retry-After", String(espera));
      return res.status(429).json({ mensaje: `Has enviado varios comentarios seguidos. Intenta de nuevo en ${espera} s.` });
    }

    recientes.push(ahora);
    intentos.set(req.ip, recientes);
    next();
  };
}
