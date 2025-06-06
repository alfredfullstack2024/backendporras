const db = require("../config/db"); // Importar el objeto completo

const clienteSchema = new db.mongoose.Schema({
  numeroIdentificacion: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String },
  email: { type: String },
  fechaNacimiento: { type: Date },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: String, enum: ["activo", "inactivo"], default: "activo" },
  membresias: [{ type: db.mongoose.Schema.Types.ObjectId, ref: "Membresia" }],
});

module.exports = db.mongoose.model("Cliente", clienteSchema);
