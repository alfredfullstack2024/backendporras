const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  numeroIdentificacion: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String },
  email: { type: String },
  fechaNacimiento: { type: Date, required: true },
  edad: { type: Number }, // se calcula automáticamente
  tipoDocumento: {
    type: String,
    enum: ["C.C", "T.I", "RC", "PPT"],
    default: "C.C",
    required: true,
  },
  rh: { type: String },
  eps: { type: String },
  tallaTrenSuperior: { type: String },
  tallaTrenInferior: { type: String },
  nombreResponsable: { type: String },
  direccion: { type: String },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: String, enum: ["activo", "inactivo"], default: "activo" },
  membresias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membresia" }],
  equipo: { type: String },
});

// Middleware para calcular edad antes de guardar
clienteSchema.pre("save", function (next) {
  if (this.fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - this.fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < this.fechaNacimiento.getDate())) {
      edad--;
    }
    this.edad = edad;
  }
  next();
});

module.exports = mongoose.model("Cliente", clienteSchema);
