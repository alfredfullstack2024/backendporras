const mongoose = require("mongoose");

const entrenadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String }, // Opcional
  correo: { type: String, required: true, unique: true },
  telefono: { type: String }, // Opcional
  especialidad: { type: String, required: true }, // Ej: "Gimnasia (DULCE)"
  diasHorarios: {
    type: [
      {
        dia: { type: String, required: true, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
        horario: { type: String, required: true }, // Ej: "10:00-12:00"
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
