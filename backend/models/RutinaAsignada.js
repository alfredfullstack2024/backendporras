const mongoose = require("mongoose");

const RutinaAsignadaSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  numeroIdentificacion: {
    type: String,
    required: true,
  },
  equipo: {
    type: String,
    required: true,
  },
  posicion: {
    type: String,
    required: true,
    enum: ["Flyer", "Base", "Spotter"],
  },
  diasHorarios: {
    type: String, // Ej: "Lunes 10:00-12:00, Miércoles 14:00-16:00"
    required: true,
  },
  asignadaPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fechaAsignacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RutinaAsignada", RutinaAsignadaSchema);
