const mongoose = require("mongoose");

const entrenadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  especialidad: { type: String, required: true },
  diasHorarios: {
    type: [
      {
        dia: { type: String, required: true, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
        horario: { type: String, required: true },
      },
    ],
    required: true,
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Entrenador", entrenadorSchema);
