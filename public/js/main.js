// Interacciones de la interfaz: menú móvil y visor de la galería.
// El envío y la carga de comentarios se integra en un módulo aparte
// a partir del código trabajado con la IA (ver docs/preguntas-ia.md).

const botonMenu = document.querySelector(".menu-boton");
const menu = document.querySelector("#menu");

function cerrarMenu() {
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
}

botonMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});

// Al elegir una sección en móvil el panel se cierra solo
menu.addEventListener("click", (evento) => {
  if (evento.target.closest("a")) cerrarMenu();
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarMenu();
});

// Visor: muestra en grande la imagen pulsada usando <dialog>
const visor = document.querySelector("#visor");
const visorImagen = visor.querySelector(".visor__imagen");
const visorPie = visor.querySelector(".visor__pie");

document.querySelectorAll("[data-ampliar]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const imagen = boton.querySelector("img");
    visorImagen.src = imagen.src;
    visorImagen.alt = imagen.alt;
    visorPie.textContent = boton.closest("figure").querySelector("figcaption").textContent;
    visor.showModal();
  });
});

visor.querySelector("[data-cerrar]").addEventListener("click", () => visor.close());

// Un clic fuera de la imagen (en el fondo) también cierra el visor
visor.addEventListener("click", (evento) => {
  if (evento.target === visor) visor.close();
});
