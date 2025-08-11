// backend/controllers/rutinasController.js
const Rutina = require("../models/Rutina");
const RutinaAsignada = require("../models/RutinaAsignada");
const Cliente = require("../models/Cliente");
const asyncHandler = require("express-async-handler");

// Crear una nueva rutina
exports.crearRutina = asyncHandler(async (req, res) => {
  const { equipo, nivelDeEquipo, posicion, descripcion } = req.body;

  console.log("CrearRutina - datos recibidos:", { equipo, nivelDeEquipo, posicion });

  if (!equipo || !nivelDeEquipo || !posicion) {
    return res.status(400).json({
      mensaje: "Faltan campos requeridos: equipo, nivelDeEquipo y posicion son obligatorios",
    });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ mensaje: "No autorizado: Usuario no autenticado" });
  }

  const nuevaRutina = new Rutina({
    equipo,
    nivelDeEquipo,
    posicion,
    descripcion,
    creadoPor: req.user._id,
  });

  const rutinaCreada = await nuevaRutina.save();
  console.log("CrearRutina - guardada:", rutinaCreada._id);

  res.status(201).json({ mensaje: "Rutina creada con éxito", rutina: rutinaCreada });
});

// Listar todas las rutinas (populate creadoPor -> nombre)
exports.listarRutinas = asyncHandler(async (req, res) => {
  const rutinas = await Rutina.find()
    .populate({ path: "creadoPor", select: "nombre apellido email" })
    .sort({ createdAt: -1 })
    .lean();
  res.json(rutinas);
});

// Actualizar una rutina
exports.actualizarRutina = asyncHandler(async (req, res) => {
  const { equipo, nivelDeEquipo, posicion, descripcion } = req.body;

  if (!equipo || !nivelDeEquipo || !posicion) {
    return res.status(400).json({
      mensaje: "Faltan campos requeridos: equipo, nivelDeEquipo y posicion son obligatorios",
    });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ mensaje: "No autorizado: Usuario no autenticado" });
  }

  const rutinaActualizada = await Rutina.findByIdAndUpdate(
    req.params.id,
    {
      equipo,
      nivelDeEquipo,
      posicion,
      descripcion,
      creadoPor: req.user._id,
    },
    { new: true, runValidators: true }
  );

  if (!rutinaActualizada) {
    return res.status(404).json({ mensaje: "Rutina no encontrada" });
  }

  res.json({ mensaje: "Rutina actualizada con éxito", rutina: rutinaActualizada });
});

// Asignar rutina a cliente
exports.asignarRutina = asyncHandler(async (req, res) => {
  const { clienteId, rutinaId, diasEntrenamiento, diasDescanso } = req.body;

  if (!clienteId || !rutinaId) {
    return res.status(400).json({ mensaje: "clienteId y rutinaId son obligatorios" });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ mensaje: "No autorizado: Usuario no autenticado" });
  }

  const cliente = await Cliente.findById(clienteId);
  if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });

  const rutina = await Rutina.findById(rutinaId);
  if (!rutina) return res.status(404).json({ mensaje: "Rutina no encontrada" });

  const asignacion = new RutinaAsignada({
    clienteId,
    numeroIdentificacion: cliente.numeroIdentificacion || "",
    rutinaId,
    diasEntrenamiento: Array.isArray(diasEntrenamiento) ? diasEntrenamiento : [],
    diasDescanso: Array.isArray(diasDescanso) ? diasDescanso : [],
    asignadaPor: req.user._id,
  });

  const creada = await asignacion.save();
  res.status(201).json({ mensaje: "Rutina asignada con éxito", rutinaAsignada: creada });
});

// Actualizar asignación
exports.actualizarAsignacionRutina = asyncHandler(async (req, res) => {
  const { clienteId, rutinaId, diasEntrenamiento, diasDescanso } = req.body;

  if (!clienteId || !rutinaId) {
    return res.status(400).json({ mensaje: "clienteId y rutinaId son obligatorios" });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ mensaje: "No autorizado: Usuario no autenticado" });
  }

  const asignacion = await RutinaAsignada.findByIdAndUpdate(
    req.params.id,
    {
      clienteId,
      rutinaId,
      diasEntrenamiento: Array.isArray(diasEntrenamiento) ? diasEntrenamiento : [],
      diasDescanso: Array.isArray(diasDescanso) ? diasDescanso : [],
      asignadaPor: req.user._id,
    },
    { new: true }
  );

  if (!asignacion) return res.status(404).json({ mensaje: "Asignación no encontrada" });

  res.json({ mensaje: "Asignación actualizada con éxito", rutinaAsignada: asignacion });
});

// Eliminar asignación
exports.eliminarAsignacionRutina = asyncHandler(async (req, res) => {
  const asignacion = await RutinaAsignada.findByIdAndDelete(req.params.id);
  if (!asignacion) return res.status(404).json({ mensaje: "Asignación no encontrada" });
  res.json({ mensaje: "Asignación eliminada con éxito" });
});

// Consultar rutinas asignadas por número identificación
exports.consultarRutinasPorNumeroIdentificacion = asyncHandler(async (req, res) => {
  const numeroIdentificacion = req.params.numeroIdentificacion;
  const rutinasAsignadas = await RutinaAsignada.find({ numeroIdentificacion })
    .populate("clienteId", "nombre apellido numeroIdentificacion")
    .populate({
      path: "rutinaId",
      select: "equipo nivelDeEquipo posicion descripcion creadoPor",
      populate: { path: "creadoPor", select: "nombre apellido" },
    })
    .populate("asignadaPor", "nombre apellido");

  if (!rutinasAsignadas || rutinasAsignadas.length === 0) {
    return res.status(404).json({ mensaje: "No se encontraron rutinas asignadas para este cliente" });
  }

  res.json(rutinasAsignadas);
});
