const Rutina = require("../models/Rutina");
const Entrenador = require("../models/Entrenador");
const asyncHandler = require("express-async-handler");

// @desc    Crear una nueva rutina
// @route   POST /api/rutinas
// @access  Private (Admin)
exports.crearRutina = asyncHandler(async (req, res) => {
  const { equipo, nivelDeEquipo, posicion, descripcion } = req.body;

  console.log("Creando rutina - Paso 1: Datos recibidos:", req.body);
  console.log("Creando rutina - Paso 2: Usuario autenticado:", req.user);

  if (!equipo || !nivelDeEquipo || !posicion) {
    console.log("Error: Faltan campos requeridos");
    return res.status(400).json({
      mensaje: "Faltan campos requeridos: equipo, nivelDeEquipo y posicion son obligatorios",
    });
  }

  const equiposValidos = await Entrenador.distinct("especialidad").map(e => e.split(" (")[1].replace(")", ""));
  if (!equiposValidos.includes(equipo)) {
    return res.status(400).json({ mensaje: "Equipo no registrado por un entrenador" });
  }

  if (!req.user || !req.user._id) {
    console.log("Error: Usuario no autenticado o ID no disponible - Detalle:", req.user);
    return res.status(401).json({
      mensaje: "No autorizado: Usuario no autenticado o ID no disponible",
    });
  }

  console.log("Creando rutina - Paso 4: Preparando nueva rutina con creadoPor:", req.user._id);
  const nuevaRutina = new Rutina({
    equipo,
    nivelDeEquipo,
    posicion,
    descripcion,
    creadoPor: req.user._id,
  });

  console.log("Creando rutina - Paso 5: Validando modelo antes de guardar:", nuevaRutina.validateSync());
  console.log("Creando rutina - Paso 6: Guardando rutina en la base de datos...");
  const rutinaCreada = await nuevaRutina.save();
  console.log("Creando rutina - Paso 7: Rutina guardada:", rutinaCreada);
  res.status(201).json({ mensaje: "Rutina creada con éxito", rutina: rutinaCreada });
});

// Resto de los métodos (listarRutinas, actualizarRutina) permanecen sin cambios...
