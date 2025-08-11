// backend/models/Rutina.js
const mongoose = require("mongoose");

const rutinaSchema = new mongoose.Schema(
  {
    equipo: { type: String, required: true },          // antes: nombreEjercicio
    nivelDeEquipo: { type: String, required: true },   // antes: series -> ahora categoría / nivel
    posicion: { type: String, required: true },        // antes: repeticiones -> ahora posición (Flyer, Base...)
    descripcion: { type: String },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // coincide con backend/models/User.js -> mongoose.model("User", ...)
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rutina", rutinaSchema);
