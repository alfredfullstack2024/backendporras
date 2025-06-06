const mongoose = require("mongoose");

const entrenadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    especialidad: { type: String, required: true },
    clases: [
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
      },
    ],
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Especificar el nombre de la colección como "entrenadors"
module.exports = mongoose.model("Entrenador", entrenadorSchema, "entrenadors");
