// Reglas del formulario de comentarios. El mismo archivo lo usan el
// navegador (antes de enviar) y el servidor (antes de guardar), así
// los dos lados validan igual.

export const ESTILOS = ["Crol", "Espalda", "Pecho", "Mariposa"];
export const LIMITES = { nombre: 40, comentario: 500 };

export function limpiar({ nombre = "", estilo = "", comentario = "" } = {}) {
  return {
    nombre: String(nombre).trim(),
    estilo: String(estilo).trim(),
    comentario: String(comentario).trim(),
  };
}

export function validarComentario(datos) {
  const { nombre, estilo, comentario } = limpiar(datos);
  const errores = {};

  if (nombre.length < 2) errores.nombre = "Escribe tu nombre (mínimo 2 caracteres).";
  else if (nombre.length > LIMITES.nombre) errores.nombre = `El nombre admite máximo ${LIMITES.nombre} caracteres.`;

  if (estilo && !ESTILOS.includes(estilo)) errores.estilo = "Elige un estilo de la lista.";

  if (comentario.length < 5) errores.comentario = "Cuéntanos un poco más (mínimo 5 caracteres).";
  else if (comentario.length > LIMITES.comentario) errores.comentario = `El comentario admite máximo ${LIMITES.comentario} caracteres.`;

  return errores;
}
