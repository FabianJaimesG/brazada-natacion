// Guarda los comentarios en un archivo JSON. Los mantiene en memoria
// para responder rápido y reescribe el archivo completo en cada alta.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function crearAlmacen(ruta) {
  let comentarios = [];
  try {
    comentarios = JSON.parse(await readFile(ruta, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error; // si no existe, se empieza vacío
  }

  // Las escrituras se encadenan para que dos envíos simultáneos no se pisen
  let cola = Promise.resolve();

  async function guardarEnDisco() {
    await mkdir(dirname(ruta), { recursive: true });
    const temporal = `${ruta}.tmp`;
    await writeFile(temporal, JSON.stringify(comentarios, null, 2));
    await rename(temporal, ruta); // el archivo nunca queda a medio escribir
  }

  return {
    listar() {
      return [...comentarios].reverse(); // el más reciente primero
    },
    agregar(comentario) {
      comentarios.push(comentario);
      cola = cola.then(guardarEnDisco);
      return cola.then(() => comentario);
    },
  };
}
