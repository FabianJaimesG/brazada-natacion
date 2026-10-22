// Pruebas del API de comentarios con el runner nativo de Node (npm test).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crearApp } from "../app.js";
import { crearAlmacen } from "../lib/almacen.js";

let servidor, base, carpeta, archivo;

before(async () => {
  carpeta = await mkdtemp(join(tmpdir(), "brazada-"));
  archivo = join(carpeta, "comentarios.json");
  // Límite holgado: aquí se prueba el API, el límite tiene su propia prueba
  const app = crearApp(await crearAlmacen(archivo), { limite: { max: 50 } });
  servidor = app.listen(0);
  base = `http://localhost:${servidor.address().port}/api/comentarios`;
});

after(async () => {
  servidor.close();
  await rm(carpeta, { recursive: true, force: true });
});

const enviar = (datos) =>
  fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });

test("empieza sin comentarios", async () => {
  const respuesta = await fetch(base);
  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), []);
});

test("guarda un comentario válido y lo escribe en el JSON", async () => {
  const respuesta = await enviar({ nombre: "  Ana ", estilo: "Crol", comentario: "Nado tres veces por semana." });
  assert.equal(respuesta.status, 201);
  const creado = await respuesta.json();
  assert.equal(creado.nombre, "Ana"); // llega sin espacios sobrantes
  assert.ok(creado.id && creado.fecha);

  const enDisco = JSON.parse(await readFile(archivo, "utf8"));
  assert.equal(enDisco.length, 1);
  assert.equal(enDisco[0].id, creado.id);
});

test("lista el más reciente primero", async () => {
  await enviar({ nombre: "Luis", comentario: "La mariposa me cuesta." });
  const lista = await (await fetch(base)).json();
  assert.deepEqual(lista.map((c) => c.nombre), ["Luis", "Ana"]);
});

test("rechaza datos inválidos con el error de cada campo", async () => {
  const respuesta = await enviar({ nombre: "", estilo: "Perrito", comentario: "hola" });
  assert.equal(respuesta.status, 400);
  const { errores } = await respuesta.json();
  assert.deepEqual(Object.keys(errores).sort(), ["comentario", "estilo", "nombre"]);
});

test("responde 400 ante un JSON mal formado", async () => {
  const respuesta = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{malo" });
  assert.equal(respuesta.status, 400);
});

test("guarda el HTML como texto, sin ejecutarlo", async () => {
  const comentario = '<img src=x onerror="alert(1)"> ¡hola!';
  const creado = await (await enviar({ nombre: "Eva", comentario })).json();
  assert.equal(creado.comentario, comentario); // el navegador lo pinta con textContent
});

test("conserva los comentarios al reiniciar el servidor", async () => {
  const otraVez = await crearAlmacen(archivo);
  assert.equal(otraVez.listar().length, 3); // Ana, Luis y Eva
});

test("envía la Content-Security-Policy", async () => {
  const respuesta = await fetch(base.replace("/api/comentarios", "/"));
  const csp = respuesta.headers.get("content-security-policy");
  assert.match(csp, /script-src 'self'/);
  assert.equal(respuesta.headers.get("x-content-type-options"), "nosniff");
});

test("responde 429 al pasar el límite de envíos", async () => {
  const otraCarpeta = await mkdtemp(join(tmpdir(), "brazada-limite-"));
  const app = crearApp(await crearAlmacen(join(otraCarpeta, "c.json")), { limite: { max: 2, ventanaMs: 60_000 } });
  const otro = app.listen(0);
  const url = `http://localhost:${otro.address().port}/api/comentarios`;
  const datos = JSON.stringify({ nombre: "Spam", comentario: "Mensaje repetido" });
  const post = () => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: datos });

  try {
    assert.equal((await post()).status, 201);
    assert.equal((await post()).status, 201);
    const bloqueado = await post();
    assert.equal(bloqueado.status, 429);
    assert.ok(Number(bloqueado.headers.get("retry-after")) > 0);
  } finally {
    otro.close();
    await rm(otraCarpeta, { recursive: true, force: true });
  }
});
