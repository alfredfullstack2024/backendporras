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
  rutinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rutina",
    required: true,
  },
  diasEntrenamiento: {
    type: [String],
    required: true,
  },
  diasDescanso: {
    type: [String],
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
