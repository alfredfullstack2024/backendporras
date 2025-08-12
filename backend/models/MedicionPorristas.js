const mongoose = require("mongoose");

const medicionPorristasSchema = new mongoose.Schema(
  {
    entrenadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
      required: true,
    },
    equipo: { type: String, required: true },
    categoria: { type: String, required: true },
    posicion: { type: String, required: true },
    descripcion: { type: String },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicionPorristas", medicionPorristasSchema);
