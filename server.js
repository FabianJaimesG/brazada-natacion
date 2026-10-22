// Punto de entrada: carga los comentarios guardados y levanta el servidor.
import { fileURLToPath } from "node:url";
import { crearApp } from "./app.js";
import { crearAlmacen } from "./lib/almacen.js";

const PORT = process.env.PORT || 3000;
const ARCHIVO = process.env.ARCHIVO_COMENTARIOS || fileURLToPath(new URL("./data/comentarios.json", import.meta.url));

const app = crearApp(await crearAlmacen(ARCHIVO));

// Replit expone el servicio si escucha en 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Brazada escuchando en http://localhost:${PORT}`);
});
