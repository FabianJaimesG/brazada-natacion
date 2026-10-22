// Servidor de Brazada: entrega la página estática de /public.
// Las rutas de comentarios se agregan a partir de la conversación con la IA.
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Replit expone el servicio si escucha en 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Brazada escuchando en http://localhost:${PORT}`);
});
