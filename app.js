// Aplicación Express: archivos estáticos + API de comentarios.
import express from "express";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { cabecerasSeguras, limitarEnvios } from "./lib/seguridad.js";
import { limpiar, validarComentario } from "./public/js/validacion.js";

const carpetaPublica = fileURLToPath(new URL("./public", import.meta.url));

export function crearApp(almacen, { limite } = {}) {
  const app = express();

  // Replit atiende detrás de un proxy: así req.ip es la IP real del visitante
  app.set("trust proxy", 1);

  app.use(cabecerasSeguras);
  app.use(express.json({ limit: "10kb" }));
  app.use(express.static(carpetaPublica));

  app.get("/api/comentarios", (req, res) => {
    res.json(almacen.listar());
  });

  app.post("/api/comentarios", limitarEnvios(limite), async (req, res, next) => {
    const errores = validarComentario(req.body);
    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const comentario = {
        id: randomUUID(),
        ...limpiar(req.body),
        fecha: new Date().toISOString(),
      };
      res.status(201).json(await almacen.agregar(comentario));
    } catch (error) {
      next(error);
    }
  });

  // JSON mal formado u otro error: se responde sin exponer detalles internos
  app.use((error, req, res, next) => {
    const estado = error.status || 500;
    if (estado === 500) console.error(error);
    res.status(estado).json({ mensaje: estado === 500 ? "No pudimos guardar el comentario." : "Solicitud inválida." });
  });

  return app;
}
