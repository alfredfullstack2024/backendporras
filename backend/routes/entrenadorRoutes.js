const express = require("express");
const router = express.Router();
const Entrenador = require("../models/Entrenador");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const entrenadores = await Entrenador.find().lean();
    res.json(entrenadores);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar entrenadores", error: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const entrenador = await Entrenador.findById(req.params.id).lean();
    if (!entrenador) return res.status(404).json({ mensaje: "Entrenador no encontrado" });
    res.json(entrenador);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener entrenador", error: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, especialidad } = req.body;
    const entrenador = await Entrenador.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, correo, telefono, especialidad },
      { new: true, runValidators: true }
    ).lean();
    if (!entrenador) return res.status(404).json({ mensaje: "Entrenador no encontrado" });
    res.json(entrenador);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar entrenador", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, especialidad } = req.body;
    const nuevoEntrenador = new Entrenador({ nombre, apellido, correo, telefono, especialidad });
    const entrenadorGuardado = await nuevoEntrenador.save();
    res.status(201).json(entrenadorGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear entrenador", error: error.message });
  }
});

module.exports = router;
