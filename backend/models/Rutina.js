const mongoose = require("mongoose");

const rutinaSchema = new mongoose.Schema(
  {
    equipo: { type: String, required: true },
    nivelDeEquipo: { type: String, required: true },
    posicion: {
      type: String,
      required: true,
      enum: ["Flyer", "Base", "Spotter"],
    },
    descripcion: { type: String },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    categorizacion: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rutina", rutinaSchema);
