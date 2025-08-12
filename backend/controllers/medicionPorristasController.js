const MedicionPorristas = require("../models/MedicionPorristas");
const Entrenador = require("../models/Entrenador");
const asyncHandler = require("express-async-handler");

// @desc    Crear una nueva medición de porristas
// @route   POST /api/medicion-porristas
// @access  Private (Admin, Entrenador)
exports.crearMedicionPorristas = asyncHandler(async (req, res) => {
  const { entrenadorId, equipo, categoria, posicion, descripcion } = req.body;

  if (!entrenadorId || !equipo || !categoria || !posicion) {
    return res.status(400).json({
      mensaje:
        "Faltan campos requeridos: entrenadorId, equipo, categoria y posicion son obligatorios",
    });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({
      mensaje: "No autorizado: Usuario no autenticado o ID no disponible",
    });
  }

  const entrenador = await Entrenador.findById(entrenadorId);
  if (!entrenador) {
    return res.status(404).json({ mensaje: "Entrenador no encontrado" });
  }

  const nuevaMedicion = new MedicionPorristas({
    entrenadorId,
    equipo,
    categoria,
    posicion,
    descripcion,
    creadoPor: req.user._id,
  });

  const medicionCreada = await nuevaMedicion.save();
  res
    .status(201)
    .json({ mensaje: "Medición creada con éxito", medicion: medicionCreada });
});

// @desc    Listar todas las mediciones de porristas
// @route   GET /api/medicion-porristas
// @access  Private (Admin, Entrenador)
exports.listarMedicionesPorristas = asyncHandler(async (req, res) => {
  const mediciones = await MedicionPorristas.find()
    .populate("entrenadorId", "nombre especialidad")
    .populate("creadoPor", "nombre");
  res.json(mediciones);
});

// @desc    Actualizar una medición de porristas
// @route   PUT /api/medicion-porristas/:id
// @access  Private (Admin)
exports.actualizarMedicionPorristas = asyncHandler(async (req, res) => {
  const { entrenadorId, equipo, categoria, posicion, descripcion } = req.body;

  if (!entrenadorId || !equipo || !categoria || !posicion) {
    return res.status(400).json({
      mensaje:
        "Faltan campos requeridos: entrenadorId, equipo, categoria y posicion son obligatorios",
    });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({
      mensaje: "No autorizado: Usuario no autenticado o ID no disponible",
    });
  }

  const entrenador = await Entrenador.findById(entrenadorId);
  if (!entrenador) {
    return res.status(404).json({ mensaje: "Entrenador no encontrado" });
  }

  const medicionActualizada = await MedicionPorristas.findByIdAndUpdate(
    req.params.id,
    {
      entrenadorId,
      equipo,
      categoria,
      posicion,
      descripcion,
      creadoPor: req.user._id,
    },
    { new: true }
  );

  if (!medicionActualizada) {
    return res.status(404).json({ mensaje: "Medición no encontrada" });
  }

  res.json({
    mensaje: "Medición actualizada con éxito",
    medicion: medicionActualizada,
  });
});
