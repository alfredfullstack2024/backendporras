const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  horario: { type: String, required: true },
  estado: { type: String, default: "disponible" },
  capacidadMaxima: { type: Number, required: true },
  capacidadDisponible: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

claseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

claseSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Clase", claseSchema);
