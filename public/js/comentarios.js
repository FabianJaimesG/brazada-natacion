// Comentarios: envía el formulario al backend, pinta la lista sin recargar
// y guarda en localStorage los comentarios que publicó este visitante.
import { LIMITES, validarComentario } from "./validacion.js";

const API = "/api/comentarios";
const CLAVE_PROPIOS = "brazada:mis-comentarios";

const formulario = document.querySelector("#formulario-comentario");
const lista = document.querySelector("#lista-comentarios");
const estado = document.querySelector("#estado-formulario");
const botonEnviar = formulario.querySelector('button[type="submit"]');
const contador = document.querySelector("#contador-comentario");

const formatoFecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

// ---------- localStorage ----------
// Si el navegador bloquea el almacenamiento, la página sigue funcionando.

function leerPropios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PROPIOS)) ?? [];
  } catch {
    return [];
  }
}

function guardarPropio(comentario) {
  try {
    localStorage.setItem(CLAVE_PROPIOS, JSON.stringify([...leerPropios(), comentario]));
  } catch {
    // sin almacenamiento local: el comentario igual quedó en el servidor
  }
}

// ---------- Pintar la lista ----------

function crearItem(comentario, { propio, soloLocal }) {
  const item = document.createElement("li");
  item.className = "comentario";
  if (propio) item.classList.add("comentario--propio");

  const cabecera = document.createElement("p");
  cabecera.className = "comentario__cabecera";

  const nombre = document.createElement("strong");
  nombre.textContent = comentario.nombre; // textContent: nunca se interpreta como HTML
  cabecera.append(nombre);

  if (comentario.estilo) {
    const estilo = document.createElement("span");
    estilo.className = "comentario__estilo";
    estilo.textContent = comentario.estilo;
    cabecera.append(estilo);
  }

  if (propio) {
    const etiqueta = document.createElement("span");
    etiqueta.className = "comentario__etiqueta";
    etiqueta.textContent = soloLocal ? "Guardado en este navegador" : "Tu comentario";
    cabecera.append(etiqueta);
  }

  const texto = document.createElement("p");
  texto.className = "comentario__texto";
  texto.textContent = comentario.comentario;

  const fecha = document.createElement("time");
  fecha.className = "comentario__fecha";
  fecha.dateTime = comentario.fecha;
  fecha.textContent = formatoFecha.format(new Date(comentario.fecha));

  item.append(cabecera, texto, fecha);
  return item;
}

// Une los del servidor con los propios que el servidor ya no tenga
// (por ejemplo, si se reinició) y los ordena del más reciente al más antiguo.
function pintar(delServidor) {
  const propios = leerPropios();
  const idsPropios = new Set(propios.map((c) => c.id));
  const idsServidor = new Set(delServidor.map((c) => c.id));
  const soloLocales = propios.filter((c) => !idsServidor.has(c.id));

  const todos = [...delServidor, ...soloLocales].sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (todos.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "comentarios__vacio";
    vacio.textContent = "Todavía no hay comentarios. ¡Sé el primero!";
    lista.replaceChildren(vacio);
    return;
  }

  lista.replaceChildren(
    ...todos.map((c) => crearItem(c, { propio: idsPropios.has(c.id), soloLocal: !idsServidor.has(c.id) }))
  );
}

async function cargarComentarios() {
  try {
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    pintar(await respuesta.json());
  } catch {
    pintar([]); // al menos se ven los propios
    mostrarEstado("No pudimos cargar los comentarios. Intenta recargar la página.", true);
  }
}

// ---------- Formulario ----------

function mostrarEstado(mensaje, esError = false) {
  estado.textContent = mensaje;
  estado.classList.toggle("error", esError);
}

function mostrarErrores(errores) {
  for (const campo of ["nombre", "estilo", "comentario"]) {
    const control = formulario.elements[campo];
    const mensaje = document.querySelector(`#error-${campo}`);
    mensaje.textContent = errores[campo] ?? "";
    control.setAttribute("aria-invalid", String(Boolean(errores[campo])));
  }
  const primero = Object.keys(errores)[0];
  if (primero) formulario.elements[primero].focus();
}

function actualizarContador() {
  const usados = formulario.elements.comentario.value.length;
  contador.textContent = `${usados}/${LIMITES.comentario}`;
}

formulario.addEventListener("input", (evento) => {
  if (evento.target.name === "comentario") actualizarContador();
});

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));

  const errores = validarComentario(datos);
  mostrarErrores(errores);
  if (Object.keys(errores).length > 0) {
    mostrarEstado("Revisa los campos marcados.", true);
    return;
  }

  botonEnviar.disabled = true;
  mostrarEstado("Publicando…");

  try {
    const respuesta = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const cuerpo = await respuesta.json();

    if (respuesta.status === 400 && cuerpo.errores) {
      mostrarErrores(cuerpo.errores);
      mostrarEstado("Revisa los campos marcados.", true);
      return;
    }
    if (respuesta.status === 429) {
      mostrarEstado(cuerpo.mensaje, true);
      return;
    }
    if (!respuesta.ok) throw new Error(cuerpo.mensaje);

    guardarPropio(cuerpo);
    formulario.reset();
    actualizarContador();
    mostrarEstado("¡Gracias! Tu comentario ya está publicado.");
    await cargarComentarios();
  } catch {
    mostrarEstado("No pudimos publicar el comentario. Intenta de nuevo en un momento.", true);
  } finally {
    botonEnviar.disabled = false;
  }
});

actualizarContador();
cargarComentarios();
