const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  metodoPago: {
    type: String,
    required: true,
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar el campo updatedAt antes de guardar
pagoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para actualizar el campo updatedAt antes de una actualización
pagoSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Pago", pagoSchema);
