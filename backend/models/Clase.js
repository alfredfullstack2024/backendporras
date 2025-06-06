const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema(
  {
    nombreClase: { type: String, required: true },
    dias: [
      {
        dia: { type: String, required: true },
        horarioInicio: { type: String, required: true },
        horarioFin: { type: String, required: true },
      },
    ],
    capacidadMaxima: { type: Number, required: true, default: 10 },
    entrenador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
      required: true,
    },
    estado: { type: String, enum: ["activa", "inactiva"], default: "activa" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clase", claseSchema);
