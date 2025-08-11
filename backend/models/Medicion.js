const mongoose = require("mongoose");

const ejercicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  calificacion: { type: Number, min: 1, max: 10, required: true }
});

const medicionSchema = new mongoose.Schema({
  deportista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deportista",
    required: true
  },
  fecha: { type: Date, default: Date.now },
  problemasFisicos: { type: String, default: "" },
  notasAdicionales: { type: String, default: "" },
  ejercicios: [ejercicioSchema],
  promedioGlobal: { type: Number, min: 0, max: 10 },
  pasaSiguienteNivel: { type: Boolean, default: false }
});

module.exports = mongoose.model("Medicion", medicionSchema);
