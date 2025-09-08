const Cliente = require("../models/Cliente");

// Crear cliente
const crearCliente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      estado,
      numeroIdentificacion,
      fechaNacimiento,
      tipoDocumento,
      rh,
      eps,
      tallaTrenSuperior,
      tallaTrenInferior,
      nombreResponsable,
      equipo,
    } = req.body;

    console.log("📩 Datos recibidos para crear cliente:", req.body);

    if (!nombre || !email || !numeroIdentificacion || !fechaNacimiento) {
      return res.status(400).json({
        message: "Nombre, email, número de identificación y fecha de nacimiento son obligatorios",
      });
    }

    const clienteExistente = await Cliente.findOne({ numeroIdentificacion });
    if (clienteExistente) {
      return res.status(400).json({ message: "El número de identificación ya está registrado" });
    }

    const nuevoCliente = new Cliente({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      estado: estado ? estado.toLowerCase() : "activo",
      numeroIdentificacion,
      fechaNacimiento,
      tipoDocumento,
      rh,
      eps,
      tallaTrenSuperior,
      tallaTrenInferior,
      nombreResponsable,
      equipo,
      fechaRegistro: new Date(),
    });

    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente: " + error.message });
  }
};

// Obtener clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().populate("membresias");
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes: " + error.message });
  }
};

module.exports = { crearCliente, obtenerClientes };
